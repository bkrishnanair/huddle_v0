import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getServerCurrentUser } from '@/lib/auth-server';
import { getFirebaseAdminDb, Timestamp } from '@/lib/firebase-admin';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const claimSchema = z.object({
  scrapedEventId: z.string().min(1),
});

/**
 * POST /api/events/claim
 * 
 * Lets an authenticated user "claim" a scraped TerpLink event.
 * Copies the scraped event data into a new organizer-owned event doc,
 * then marks the scraped doc as archived so it no longer appears.
 */
export async function POST(request: NextRequest) {
  const user = await getServerCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();
  const validation = claimSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const { scrapedEventId } = validation.data;
  const adminDb = getFirebaseAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: 'DB not available' }, { status: 500 });
  }

  try {
    const scrapedRef = adminDb.collection('events').doc(scrapedEventId);
    const scrapedSnap = await scrapedRef.get();

    if (!scrapedSnap.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const scrapedData = scrapedSnap.data()!;

    // Get organizer info
    const userDoc = await adminDb.collection('users').doc(user.uid).get();
    const userData = userDoc.data() || {};
    const organizerName = userData.displayName || userData.name || user.email?.split('@')[0] || 'Organizer';

    // Create the new organizer-owned event
    const newEventRef = adminDb.collection('events').doc();
    const newEvent = {
      name: scrapedData.name || scrapedData.title || 'Claimed Event',
      title: scrapedData.name || scrapedData.title || 'Claimed Event',
      category: scrapedData.category || scrapedData.sport || 'Community',
      sport: scrapedData.category || scrapedData.sport || 'Community',
      eventType: scrapedData.eventType || 'in-person',
      date: scrapedData.date || '',
      endDate: scrapedData.endDate || '',
      time: scrapedData.time || '18:00',
      endTime: scrapedData.endTime || '',
      venue: scrapedData.venue || scrapedData.location || '',
      location: scrapedData.venue || scrapedData.location || '',
      geopoint: scrapedData.geopoint || null,
      geohash: scrapedData.geohash || null,
      description: scrapedData.description || '',
      maxPlayers: scrapedData.maxPlayers || 50,
      currentPlayers: 1,
      players: [user.uid],
      waitlist: [],
      createdBy: user.uid,
      organizerName,
      organizerPhotoURL: userData.photoURL || '',
      source: 'claimed',
      claimedFrom: scrapedEventId,
      status: 'active',
      viewCount: scrapedData.viewCount || 0,
      createdAt: Timestamp.now(),
    };

    // Batch: create new event + archive scraped event
    const batch = adminDb.batch();
    batch.set(newEventRef, newEvent);
    batch.update(scrapedRef, { status: 'archived', claimedBy: user.uid, claimedAt: Timestamp.now() });
    await batch.commit();

    const isNewOrganizer = !userData.onboardingComplete;

    return NextResponse.json({
      message: 'Event claimed successfully! You now own and manage this event.',
      eventId: newEventRef.id,
      event: { id: newEventRef.id, ...newEvent },
      isNewOrganizer,
    });
  } catch (error) {
    console.error('Claim event error:', error);
    return NextResponse.json({ error: 'Failed to claim event' }, { status: 500 });
  }
}
