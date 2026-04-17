import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getServerCurrentUser } from '@/lib/auth-server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const eventPayloadSchema = z.object({
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().optional(),
  location: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional().default(''),
  capacity: z.number().int().positive().default(50),
  geopoint: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
});

const bulkSchema = z.object({
  events: z.array(eventPayloadSchema).min(1).max(100),
  parentScheduleId: z.string().optional(),
});

/**
 * POST /api/events/bulk
 * 
 * Batch creates multiple events from a confirmed schedule import.
 * Each event is linked via parentScheduleId for grouping.
 */
export async function POST(request: NextRequest) {
  const user = await getServerCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();
  const validation = bulkSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const { events, parentScheduleId } = validation.data;
  const adminDb = getFirebaseAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: 'DB not available' }, { status: 500 });
  }

  // Fetch user profile for organizer info
  const userDoc = await adminDb.collection('users').doc(user.uid).get();
  const userData = userDoc.data() || {};
  const organizerName = userData.displayName || userData.name || 'Unknown Organizer';
  const organizerPhotoURL = userData.photoURL || '';
  const scheduleId = parentScheduleId || `schedule_${Date.now()}`;

  // Batch write (Firestore batches max 500)
  const createdIds: string[] = [];
  const batchSize = 500;

  for (let i = 0; i < events.length; i += batchSize) {
    const chunk = events.slice(i, i + batchSize);
    const batch = adminDb.batch();

    for (const event of chunk) {
      const docRef = adminDb.collection('events').doc();
      const defaultGeopoint = event.geopoint || { latitude: 38.9897, longitude: -76.9378 }; // UMD default

      batch.set(docRef, {
        name: event.title,
        title: event.title,
        category: event.category,
        sport: event.category,
        eventType: 'in-person',
        date: event.date,
        time: event.time,
        endTime: event.endTime || '',
        venue: event.location,
        location: event.location,
        geopoint: defaultGeopoint,
        description: event.description || '',
        maxPlayers: event.capacity,
        currentPlayers: 0,
        players: [],
        waitlist: [],
        createdBy: user.uid,
        organizerName,
        organizerPhotoURL,
        parentScheduleId: scheduleId,
        source: 'manual',
        status: 'active',
        viewCount: 0,
        createdAt: new Date().toISOString(),
      });

      createdIds.push(docRef.id);
    }

    await batch.commit();
  }

  return NextResponse.json({
    created: createdIds.length,
    scheduleId,
    eventIds: createdIds,
    message: `Successfully created ${createdIds.length} events`,
  });
}
