import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb, GeoPoint, Timestamp } from '@/lib/firebase-admin';
import { getServerCurrentUser } from '@/lib/auth-server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { isAdminUid } from '@/lib/admin-auth';
import * as geofire from 'geofire-common';
import { toZonedTime, format } from 'date-fns-tz';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Literal, not an expression — Next rejects MemberExpression and
// ConditionalExpression forms for this export (CLAUDE.md). A run makes up to
// 100 sequential geocoding calls, so the default 10s ceiling is not enough.
export const maxDuration = 60;

// The caller-supplied `apiUrl` was removed. `z.string().url()` accepts any
// scheme and any host, and the value reached fetch() below — an open
// server-side request proxy, reachable by any signed-in user. The TerpLink
// endpoint is a constant, so there is nothing for a caller to configure.
const scrapeInputSchema = z.object({}).strict();

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

/** Campus-centre coordinate with jitter, so co-located pins do not stack exactly. */
function campusFallback() {
  const jitter = () => (Math.random() - 0.5) * 0.002;
  return { lat: UMD_LAT + jitter(), lng: UMD_LNG + jitter(), geocoded: false };
}

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
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK') {
      console.warn(`[Scraper] Geocoding status '${data.status}' for address: "${address}"`, data.error_message || '');
      return fallback;
    }

    if (data.results && data.results[0]) {
       const loc = data.results[0].geometry.location;
       // Add a tiny bit of jitter even to successful results to distinguish between events in the same building
       return {
         lat: loc.lat + (Math.random() - 0.5) * 0.0005,
         lng: loc.lng + (Math.random() - 0.5) * 0.0005,
         geocoded: true,
       };
    }

    console.warn(`[Scraper] No geocoding results for address: "${address}"`);
  } catch (e) {
    console.error(`[Scraper] Geocoding exception for "${address}":`, e);
  }
  return fallback;
}

function mapTerpLinkCategory(categories: string[]): string {
  const catMap: Record<string, string> = {
    'Athletics': 'Sports',
    'Sports': 'Sports',
    'Club Sports': 'Sports',
    'Workout': 'Sports',
    'Fitness': 'Sports',
    'Training': 'Sports',
    'Exercise': 'Sports',
    'Music': 'Music',
    'Concert': 'Music',
    'Rehearsal': 'Music',
    'Performance': 'Music',
    'Arts': 'Arts & Culture',
    'Cultural': 'Arts & Culture',
    'Artist': 'Arts & Culture',
    'Creative': 'Arts & Culture',
    'Academic': 'Learning',
    'Workshop': 'Learning',
    'Professional Development': 'Learning',
    'Science': 'Learning',
    'Library': 'Learning',
    'Research': 'Learning',
    'Study': 'Learning',
    'Community Service': 'Community',
    'Social': 'Community',
    'Philanthropy': 'Community',
    'Meeting': 'Community',
    'Club': 'Community',
    'Food': 'Food & Drink',
    'Cooking': 'Food & Drink',
    'Dining': 'Food & Drink',
    'Technology': 'Tech',
    'Programming': 'Tech',
    'Software': 'Tech',
    'Engineering': 'Tech',
    'Coding': 'Tech',
    'Outdoor': 'Outdoors',
    'Recreation': 'Outdoors',
    'Nature': 'Outdoors',
    'Adventure': 'Outdoors',
  };

  for (const cat of categories) {
    for (const [key, value] of Object.entries(catMap)) {
      if (cat.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
  }
  return 'Community'; // default
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin only. A run fans out to up to 100 billed Google Geocoding calls,
    // and accounts are free to create, so leaving this open to any signed-in
    // user put an unmetered cost lever in anyone's hands.
    if (!isAdminUid(user.uid)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Scraping fans out to the TerpLink API and a full Firestore batch write,
    // so gate it before any of that work starts.
    const limitCheck = await checkRateLimit(user.uid, 'scrape_terplink', 5, 3600000, getClientIp(req)); // 5 per hour
    if (!limitCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limitCheck.retryAfterSeconds) } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const validation = scrapeInputSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'This endpoint takes no parameters' }, { status: 400 });
    }

    // Constant, and built here rather than accepted from the caller.
    const apiUrl = `https://${TERPLINK_HOST}/api/discovery/event/search?orderByField=startsOn&orderByDirection=ascending&status=Approved&take=100&startsAfter=${new Date().toISOString()}&query=`;

    // Fetch from TerpLink API
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Huddle/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `TerpLink API returned ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const terpEvents: TerpLinkEvent[] = data.value || data.items || data || [];

    if (!Array.isArray(terpEvents) || terpEvents.length === 0) {
      return NextResponse.json({ imported: 0, message: 'No events found from TerpLink' });
    }

    const adminDb = getFirebaseAdminDb();
    if (!adminDb) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    // Check existing scraped events to avoid duplicates
    const existingSnap = await adminDb
      .collection('events')
      .where('isScraped', '==', true)
      .where('source', '==', 'terplink')
      .get();

    const existingSourceUrls = new Set(
      existingSnap.docs.map(d => d.data().sourceUrl).filter(Boolean)
    );

    const batch = adminDb.batch();
    let importCount = 0;

    for (const te of terpEvents) {
      const sourceUrl = `https://terplink.umd.edu/event/${te.id}`;

      // Skip if already imported
      if (existingSourceUrls.has(sourceUrl)) continue;

      // Parse dates in UMD local timezone (America/New_York)
      const eventTz = 'America/New_York';
      let date = '';
      let time = '12:00';
      let endDate: string | undefined = undefined;
      let endTime: string | undefined = undefined;

      if (te.startsOn) {
        const dt = new Date(te.startsOn);
        if (!isNaN(dt.getTime())) {
          const zonedStart = toZonedTime(dt, eventTz);
          date = format(zonedStart, 'yyyy-MM-dd', { timeZone: eventTz });
          time = format(zonedStart, 'HH:mm', { timeZone: eventTz });
        }
      }

      if (te.endsOn) {
        const dtEnd = new Date(te.endsOn);
        if (!isNaN(dtEnd.getTime())) {
          const zonedEnd = toZonedTime(dtEnd, eventTz);
          const endCalDate = format(zonedEnd, 'yyyy-MM-dd', { timeZone: eventTz });
          endTime = format(zonedEnd, 'HH:mm', { timeZone: eventTz });
          if (endCalDate && endCalDate !== date) {
            endDate = endCalDate;
          }
        }
      }

      if (!date) continue; // skip events without a valid date

      const category = mapTerpLinkCategory(te.categoryNames || []);
      const loc = te.location || 'University of Maryland';
      const isOnline = loc.toLowerCase().includes('online') || 
                       loc.toLowerCase().includes('zoom') || 
                       loc.toLowerCase().includes('virtual') ||
                       loc.toLowerCase().includes('remote');
                       
      // Virtual events have no physical address to resolve, so skip the billed
      // Geocoding call entirely. They still need a coordinate because every
      // event document carries a geohash for the radius query in
      // getNearbyEvents(); campus centre is the same value geocoding would
      // have fallen back to anyway.
      const { lat, lng } = isOnline ? campusFallback() : await geocodeLocation(loc);
      const geohash = geofire.geohashForLocation([lat, lng]);

      const eventDoc: Record<string, any> = {
        name: te.name || 'TerpLink Event',
        title: te.name || 'TerpLink Event',
        description: te.description ? te.description.replace(/<[^>]*>/g, '').slice(0, 500) : '',
        category,
        sport: category,
        eventType: isOnline ? 'virtual' : 'physical',
        date,
        time,
        timezone: eventTz,
        ...(endTime ? { endTime } : {}),
        ...(endDate ? { endDate } : {}),
        location: loc,
        maxPlayers: 50,
        currentPlayers: 0,
        players: [],
        geopoint: new GeoPoint(lat, lng),
        geohash,
        createdBy: 'system',
        organizerName: te.organizationName || 'TerpLink',
        createdAt: Timestamp.now(),
        checkInOpen: false,
        isScraped: true,
        source: 'terplink',
        sourceUrl,
        viewCount: 0,
      };

      const docRef = adminDb.collection('events').doc();
      batch.set(docRef, eventDoc);
      importCount++;
    }

    if (importCount > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      imported: importCount,
      message: `Imported ${importCount} events from TerpLink`,
    });
  } catch (error) {
    console.error('TerpLink scraper error:', error);
    return NextResponse.json({ error: 'Scrape failed' }, { status: 500 });
  }
}
