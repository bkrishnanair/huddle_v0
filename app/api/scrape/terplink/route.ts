import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb, GeoPoint, Timestamp } from '@/lib/firebase-admin';
import { getServerCurrentUser } from '@/lib/auth-server';
import * as geofire from 'geofire-common';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const scrapeInputSchema = z.object({
  // Optional: pass the TerpLink Engage API URL directly
  apiUrl: z.string().url().optional(),
});

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

async function geocodeLocation(address: string) {
  // Jitter helper to prevent exact stacking
  const jitter = () => (Math.random() - 0.5) * 0.002;
  const fallback = { lat: 38.9897 + jitter(), lng: -76.9378 + jitter() };

  if (!address) return fallback;
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return fallback;

  try {
    // We append the city/state to help Google focus 
    const query = `${address}, College Park, MD`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.results && data.results[0]) {
       const loc = data.results[0].geometry.location;
       // Add a tiny bit of jitter even to successful results to distinguish between events in the same building
       return {
         lat: loc.lat + (Math.random() - 0.5) * 0.0005,
         lng: loc.lng + (Math.random() - 0.5) * 0.0005
       };
    }
  } catch (e) {
    console.error("Geocoding failed for", address, e);
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

    const body = await req.json().catch(() => ({}));
    const validation = scrapeInputSchema.safeParse(body);

    // Default TerpLink Engage API URL for UMD
    const apiUrl = validation.success && validation.data.apiUrl
      ? validation.data.apiUrl
      : `https://terplink.umd.edu/api/discovery/event/search?orderByField=startsOn&orderByDirection=ascending&status=Approved&take=100&startsAfter=${new Date().toISOString()}&query=`;

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

      // Parse dates
      let date = '';
      let time = '12:00';
      let endTime = '';
      if (te.startsOn) {
        const dt = new Date(te.startsOn);
        if (!isNaN(dt.getTime())) {
          date = dt.toISOString().split('T')[0];
          time = dt.toTimeString().slice(0, 5);
        }
      }
      if (te.endsOn) {
        const dt = new Date(te.endsOn);
        if (!isNaN(dt.getTime())) {
          endTime = dt.toTimeString().slice(0, 5);
        }
      }

      if (!date) continue; // skip events without a valid date

      const category = mapTerpLinkCategory(te.categoryNames || []);
      const loc = te.location || 'University of Maryland';
      const isOnline = loc.toLowerCase().includes('online') || 
                       loc.toLowerCase().includes('zoom') || 
                       loc.toLowerCase().includes('virtual') ||
                       loc.toLowerCase().includes('remote');
                       
      const { lat, lng } = await geocodeLocation(loc);
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
        endTime,
        endDate: '',
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
