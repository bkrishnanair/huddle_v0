/**
 * fix-scraped-geocoding.ts
 * 
 * One-time migration: re-geocode all TerpLink-scraped events that may have
 * landed on the campus center fallback coordinates.
 * 
 * Usage:
 *   DRY_RUN=true npx tsx --env-file=.env.local scripts/fix-scraped-geocoding.ts
 *   npx tsx --env-file=.env.local scripts/fix-scraped-geocoding.ts
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, GeoPoint } from 'firebase-admin/firestore';
import * as geofire from 'geofire-common';

const DRY_RUN = process.env.DRY_RUN === 'true';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const db = getFirestore();

// Campus center coordinates — events near this are likely fallback-geocoded
const CAMPUS_CENTER_LAT = 38.9897;
const CAMPUS_CENTER_LNG = -76.9378;
const FALLBACK_RADIUS_KM = 0.15; // ~150 meters from center = likely a fallback

async function geocodeLocation(address: string): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.GOOGLE_MAPS_SERVER_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || !address) return null;

  try {
    const query = `${address}, University of Maryland, College Park, MD`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === 'OK' && data.results?.[0]) {
      const loc = data.results[0].geometry.location;
      return { lat: loc.lat, lng: loc.lng };
    }
    console.warn(`  ⚠ Geocoding returned '${data.status}' for: "${address}"`);
  } catch (e) {
    console.error(`  ✗ Geocoding exception for: "${address}"`, e);
  }
  return null;
}

function isNearCampusCenter(lat: number, lng: number): boolean {
  const dist = geofire.distanceBetween([lat, lng], [CAMPUS_CENTER_LAT, CAMPUS_CENTER_LNG]);
  return dist <= FALLBACK_RADIUS_KM;
}

async function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Fix Scraped Geocoding — ${DRY_RUN ? '🔍 DRY RUN' : '🔧 LIVE RUN'}`);
  console.log(`${'='.repeat(60)}\n`);

  const snap = await db.collection('events')
    .where('source', '==', 'terplink')
    .get();

  console.log(`Found ${snap.size} TerpLink events total.\n`);

  let fixedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const lat = data.geopoint?.latitude;
    const lng = data.geopoint?.longitude;
    const location = data.location || data.venue || '';

    if (!lat || !lng) {
      console.log(`[${doc.id}] "${data.name}" — no geopoint, will re-geocode`);
    } else if (!isNearCampusCenter(lat, lng)) {
      skippedCount++;
      continue; // Already has a good geocode
    } else {
      console.log(`[${doc.id}] "${data.name}" — near campus center (${lat.toFixed(4)}, ${lng.toFixed(4)}), re-geocoding "${location}"`);
    }

    const coords = await geocodeLocation(location);
    if (!coords) {
      console.log(`  ✗ Failed to geocode, skipping`);
      failedCount++;
      continue;
    }

    const distFromOld = lat && lng
      ? (geofire.distanceBetween([lat, lng], [coords.lat, coords.lng]) * 1000).toFixed(0) + 'm'
      : 'N/A';

    console.log(`  ✓ New coords: (${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}) — moved ${distFromOld}`);

    if (!DRY_RUN) {
      const geohash = geofire.geohashForLocation([coords.lat, coords.lng]);
      await doc.ref.update({
        geopoint: new GeoPoint(coords.lat, coords.lng),
        geohash,
      });
    }

    fixedCount++;

    // Rate limit to avoid hitting Google geocoding quotas
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Results:`);
  console.log(`  Fixed:   ${fixedCount}`);
  console.log(`  Skipped: ${skippedCount} (already had valid coordinates)`);
  console.log(`  Failed:  ${failedCount} (could not re-geocode)`);
  console.log(`  Mode:    ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE (writes committed)'}`);
  console.log(`${'='.repeat(60)}\n`);

  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
