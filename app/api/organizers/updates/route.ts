import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getServerCurrentUser } from '@/lib/auth-server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { checkRateLimit } from '@/lib/rate-limit';
import { organizerIdSchema, publicOrganizer } from '@/lib/organizers';
import { matchesEventTimeFilter } from '@/lib/datetime';
import type { GameEvent } from '@/lib/types';

const updateSchema = z.object({ eventId: organizerIdSchema, message: z.string().trim().min(5).max(280), public: z.literal(true) }).strict();

export async function GET() {
  try {
    const db = getFirebaseAdminDb();
    if (!db) throw new Error('Unavailable');
    const snapshot = await db.collection('organizerUpdates').orderBy('createdAt', 'desc').limit(30).get();
    if (snapshot.empty) return NextResponse.json({ updates: [] });
    const eventIds = [...new Set(snapshot.docs.map(doc => doc.data().eventId as string))];
    const ownerIds = [...new Set(snapshot.docs.map(doc => doc.data().ownerId as string))];
    const [events, organizers] = await Promise.all([
      db.getAll(...eventIds.map(id => db.collection('events').doc(id))),
      db.getAll(...ownerIds.map(id => db.collection('organizers').doc(id))),
    ]);
    const eventMap = new Map(events.map(doc => [doc.id, doc.data()]));
    const organizerMap = new Map(organizers.map(doc => [doc.id, doc.exists ? publicOrganizer(doc.id, doc.data()!) : null]));
    const updates = snapshot.docs.flatMap(doc => {
      const update = doc.data();
      const event = eventMap.get(update.eventId);
      const organizer = organizerMap.get(update.ownerId);
      if (!organizer?.published || !event || event.isPrivate || event.createdBy !== update.ownerId || !matchesEventTimeFilter(event as GameEvent, 'All')) return [];
      return [{ id: doc.id, eventId: update.eventId, ownerId: update.ownerId, organizerName: organizer.name,
        eventName: String(event.name || event.title || 'Event'), message: String(update.message),
        publishedAt: update.createdAt.toDate().toISOString() }];
    });
    return NextResponse.json({ updates: updates.slice(0, 12) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Updates are temporarily unavailable.' }, { status: 503 }); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    if (!user || user.firebase?.sign_in_provider === 'anonymous') return NextResponse.json({ error: 'Sign in first.' }, { status: 401 });
    const parsed = updateSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'Select an event and write a public update of 5–280 characters.' }, { status: 400 });
    if (!(await checkRateLimit(user.uid, 'public_organizer_update', 5, 86400000)).success) return NextResponse.json({ error: 'Daily update limit reached.' }, { status: 429 });
    const db = getFirebaseAdminDb();
    if (!db) throw new Error('Unavailable');
    await db.runTransaction(async tx => {
      const event = (await tx.get(db.collection('events').doc(parsed.data.eventId))).data();
      const organizer = (await tx.get(db.collection('organizers').doc(user.uid))).data();
      if (!organizer?.published || !event || event.createdBy !== user.uid || event.isPrivate || !matchesEventTimeFilter(event as GameEvent, 'All')) throw new Error('NOT_ALLOWED');
      // One public update per event, not a general-purpose social feed. Private pinned chat is never reused.
      tx.set(db.collection('organizerUpdates').doc(parsed.data.eventId), {
        ownerId: user.uid, eventId: parsed.data.eventId, message: parsed.data.message, createdAt: Timestamp.now(),
      });
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const denied = error instanceof Error && error.message === 'NOT_ALLOWED';
    return NextResponse.json({ error: denied ? 'Publish your organizer page and choose your own public upcoming event.' : 'Could not publish the update.' }, { status: denied ? 403 : 503 });
  }
}

const removeSchema = z.object({ eventId: organizerIdSchema }).strict();
export async function DELETE(request: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    if (!user) return NextResponse.json({ error: 'Sign in first.' }, { status: 401 });
    const parsed = removeSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'Invalid event.' }, { status: 400 });
    if (!(await checkRateLimit(user.uid, 'remove_public_update', 20, 86400000)).success) return NextResponse.json({ error: 'Daily limit reached.' }, { status: 429 });
    const db = getFirebaseAdminDb();
    if (!db) throw new Error('Unavailable');
    await db.runTransaction(async tx => {
      const ref = db.collection('organizerUpdates').doc(parsed.data.eventId);
      const snapshot = await tx.get(ref);
      if (!snapshot.exists) return;
      if (snapshot.data()?.ownerId !== user.uid) throw new Error('FORBIDDEN');
      tx.delete(ref);
    });
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: 'Could not remove the update.' }, { status: error instanceof Error && error.message === 'FORBIDDEN' ? 403 : 503 }); }
}
