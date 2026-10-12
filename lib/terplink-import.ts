import 'server-only';

import { getFirebaseAdminDb, GeoPoint, Timestamp } from '@/lib/firebase-admin';
import * as geofire from 'geofire-common';
import { getEventFieldsFromISO } from '@/lib/datetime';
import { classifyTerpLinkEvent } from '@/lib/terplink-category';
import { normalizeCoordinates } from '@/lib/coordinates';
import { acquireCronLease } from '@/lib/cron/lease';
import { z } from 'zod';

export class TerpLinkImportError extends Error {
  constructor(message: string, public readonly status: number) { super(message); }
}

/** Only host this route will fetch from. */
const TERPLINK_HOST = 'terplink.umd.edu';

// UMD campus center
const UMD_LAT = 38.9897;
const UMD_LNG = -76.9378;

interface TerpLinkEvent {
  id: string;
  name: string;
  description?: string;
  startsOn?: string;
  endsOn?: string;
  location?: string;
  imagePath?: string;
  categoryNames?: string[];
  organizationName?: string;
}

/** Stable fallback: pin separation belongs to the map, not invented coordinates. */
function campusFallback() { return { lat: UMD_LAT, lng: UMD_LNG, geocoded: false }; }

async function geocodeLocation(address: string) {
  const fallback = campusFallback();

  if (!address) {
    console.warn('[Scraper] No address provided, using campus center fallback');
    return fallback;
  }

  // Prefer server-side key (no HTTP referrer restrictions).
  // Falls back to client key with a warning — client key may fail if referrer-restricted.
  // TODO: Set GOOGLE_MAPS_SERVER_KEY in Vercel env vars for production reliability.
  const apiKey = process.env.GOOGLE_MAPS_SERVER_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('[Scraper] No Google Maps API key available for geocoding');
    return fallback;
  }
  if (!process.env.GOOGLE_MAPS_SERVER_KEY) {
    console.warn('[Scraper] Using client-side Maps key for geocoding — set GOOGLE_MAPS_SERVER_KEY for reliable server-side geocoding');
  }

  try {
    // Append University of Maryland context to improve geocoding accuracy for campus buildings
    const query = `${address}, University of Maryland, College Park, MD`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return fallback;
    const data = await res.json();

    if (data.status !== 'OK') {
      console.warn(`[Scraper] Geocoding status '${data.status}' for address: "${address}"`, data.error_message || '');
      return fallback;
    }

    if (data.results && data.results[0]) {
       const loc = data.results[0].geometry.location;
       return {
         lat: loc.lat,
         lng: loc.lng,
         geocoded: true,
       };
    }

    console.warn(`[Scraper] No geocoding results for address: "${address}"`);
  } catch (e) {
    console.error(`[Scraper] Geocoding exception for "${address}":`, e);
  }
  return fallback;
}

const sourceEventSchema = z.object({
  id: z.union([z.string().min(1), z.number()]).transform(String),
  name: z.string().min(1), startsOn: z.string(), endsOn: z.string().optional().nullable(),
  description: z.string().optional().nullable(), location: z.string().optional().nullable(),
  categoryNames: z.array(z.string()).optional(), organizationName: z.string().optional().nullable(),
});


/** Compare only source-owned fields. No writes for unchanged daily listings. */
export function hasTerpLinkSourceChanges(current: Record<string, unknown>, next: Record<string, unknown>): boolean {
  return Object.entries(next).some(([key, value]) => {
    if (key !== 'geopoint') return current[key] !== value;
    const before = normalizeCoordinates(current[key]);
    const after = normalizeCoordinates(value);
    return !before || !after || before.latitude !== after.latitude || before.longitude !== after.longitude;
  });
}

/** Same importer for the admin action and daily cron; neither can overlap the other. */
export async function importTerpLinkEvents() {
  const release = await acquireCronLease('terplink');
  if (!release) throw new TerpLinkImportError('An import is already running', 409);
  const started = Date.now();
  const deadline = started + 45_000;
  try {
    const result = await importListings(deadline);
    await getFirebaseAdminDb()!.collection('cronState').doc('terplinkSync').set({
      lastAttemptAt: new Date().toISOString(),
      ...(result.failed === 0 && result.deferred === 0 ? { lastSuccessAt: new Date().toISOString() } : {}),
      ...result, error: null, durationMs: Date.now() - started,
    }, { merge: true });
    return result;
  } catch (error) {
    await getFirebaseAdminDb()?.collection('cronState').doc('terplinkSync').set({
      lastAttemptAt: new Date().toISOString(), error: 'Import failed; see server logs',
    }, { merge: true }).catch(() => {});
    throw error;
  } finally {
    await release().catch(error => console.error('[TerpLink] Lease release failed', error));
  }
}

async function importListings(deadline: number) {
    // Constant, and built here rather than accepted from the caller.
    const apiUrl = `https://${TERPLINK_HOST}/api/discovery/event/search?orderByField=startsOn&orderByDirection=ascending&status=Approved&take=100&startsAfter=${new Date().toISOString()}&query=`;

    // Fetch from TerpLink API
    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(8000), redirect: 'error',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Huddle/1.0',
      },
    });

    if (!response.ok) {
      throw new TerpLinkImportError(`TerpLink API returned ${response.status}`, 502);
    }

    const data = await response.json();
    const terpEvents: TerpLinkEvent[] = data.value || data.items || data || [];

    if (!Array.isArray(terpEvents)) throw new TerpLinkImportError('Unexpected TerpLink response', 502);
    if (terpEvents.length === 0) {
      return { imported: 0, refreshed: 0, skipped: 0, failed: 0, deferred: 0, geocodeRequests: 0, message: 'No events found from TerpLink' };
    }

    const adminDb = getFirebaseAdminDb();
    if (!adminDb) {
      throw new TerpLinkImportError('Database unavailable', 503);
    }

    // Source-specific lookups include claimed listings so imports never duplicate them.
    const items = [...new Map(terpEvents.slice(0, 100).flatMap(item => {
      const parsed = sourceEventSchema.safeParse(item);
      return parsed.success && /^[a-zA-Z0-9_-]+$/.test(parsed.data.id) ? [[parsed.data.id, parsed.data] as const] : [];
    })).values()];
    const existing = new Map<string, FirebaseFirestore.QueryDocumentSnapshot>();
    for (let offset = 0; offset < items.length; offset += 30) {
      const urls = items.slice(offset, offset + 30).map(item => 'https://terplink.umd.edu/event/' + item.id);
      const snapshot = await adminDb.collection('events').where('sourceUrl', 'in', urls).get();
      snapshot.docs.forEach(doc => existing.set(doc.data().sourceUrl, doc));
    }
    const geocodes = new Map<string, ReturnType<typeof geocodeLocation>>();
    let geocodeRequests = 0, next = 0, imported = 0, refreshed = 0, skipped = 0;
    const failures: string[] = [];
    await Promise.all(Array.from({ length: 4 }, async () => {
      while (next < items.length && Date.now() < deadline) {
        const te = items[next++];
        try {
          const sourceUrl = 'https://terplink.umd.edu/event/' + te.id;
          const previous = existing.get(sourceUrl);
          const prior = previous?.data();
          if (prior && (prior.source !== 'terplink' || prior.createdBy !== 'system')) { skipped++; continue; }
          const start = getEventFieldsFromISO(te.startsOn);
          const end = te.endsOn ? getEventFieldsFromISO(te.endsOn) : null;
          if (!start) { skipped++; continue; }
          const category = classifyTerpLinkEvent(te.categoryNames || [], te.name);
          const location = te.location || 'University of Maryland';
          const virtual = /\b(online|zoom|virtual|remote)\b/i.test(location);
          let point = campusFallback();
          const existingPoint = normalizeCoordinates(prior?.geopoint);
          if (prior?.location === location && existingPoint) {
            point = { lat: existingPoint.latitude, lng: existingPoint.longitude, geocoded: true };
          } else if (!virtual) {
            const key = location.trim().toLowerCase();
            if (!geocodes.has(key) && geocodeRequests < 20) {
              geocodeRequests++; geocodes.set(key, geocodeLocation(location));
            }
            if (geocodes.has(key)) point = await geocodes.get(key)!;
          }
          const sourceFields = {
            name: te.name, title: te.name,
            description: (te.description || '').replace(/<[^>]*>/g, '').slice(0, 500),
            category, sport: category, eventType: virtual ? 'virtual' : 'in-person',
            date: start.date, time: start.time, timezone: 'America/New_York',
            endDate: end?.date || '', endTime: end?.time || '', location,
            geopoint: new GeoPoint(point.lat, point.lng), geohash: geofire.geohashForLocation([point.lat, point.lng]),
            organizerName: te.organizationName || 'TerpLink', sourceUrl,
          };
          const ref = previous?.ref || adminDb.collection('events').doc('terplink_' + te.id);
          const result = await adminDb.runTransaction(async tx => {
            const current = await tx.get(ref);
            if (current.exists) {
              const value = current.data();
              if (value?.source !== 'terplink' || value?.createdBy !== 'system') return 'skipped';
              if (!hasTerpLinkSourceChanges(value, sourceFields)) return 'skipped';
              // Keep ownership, RSVPs, privacy, moderation and counters untouched.
              tx.update(ref, sourceFields);
              return 'refreshed';
            }
            tx.create(ref, { ...sourceFields, maxPlayers: 50, currentPlayers: 0, players: [],
              createdBy: 'system', createdAt: Timestamp.now(), checkInOpen: false,
              isScraped: true, source: 'terplink', viewCount: 0 });
            return 'imported';
          });
          if (result === 'imported') imported++; else if (result === 'refreshed') refreshed++; else skipped++;
        } catch { failures.push(te.id); }
      }
    }));
    return { imported, refreshed, skipped, failed: failures.length, deferred: items.length - next, geocodeRequests,
      message: 'Imported ' + imported + ', refreshed ' + refreshed + ' TerpLink events.',
    };
}
