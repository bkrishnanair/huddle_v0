import 'server-only';

import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getServerCurrentUser } from '@/lib/auth-server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { checkRateLimit } from '@/lib/rate-limit';
import { organizerIdSchema } from '@/lib/organizers';
import { matchesEventTimeFilter } from '@/lib/datetime';
import type { GameEvent } from '@/lib/types';

type Context = { params: Promise<{ id: string }> };
const inviteSchema = z.object({ targetUserId: organizerIdSchema }).strict();
const canInvite = (event: FirebaseFirestore.DocumentData | undefined, uid: string) =>
  !!event && !event.isPrivate && event.players?.includes(uid) && matchesEventTimeFilter(event as GameEvent, 'All');

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    const user = await getServerCurrentUser();
    if (!user || user.firebase?.sign_in_provider === 'anonymous') return NextResponse.json({ error: 'Sign in first.' }, { status: 401 });
    const { id } = await params;
    if (!organizerIdSchema.safeParse(id).success) return NextResponse.json({ error: 'Invalid event.' }, { status: 400 });
    const db = getFirebaseAdminDb();
    if (!db) throw new Error();
    const event = (await db.collection('events').doc(id).get()).data();
    if (!canInvite(event, user.uid)) return NextResponse.json({ error: 'Join a public upcoming event before inviting friends.' }, { status: 403 });
    const senderRef = db.collection('users').doc(user.uid);
    const [following, sender] = await Promise.all([senderRef.collection('following').limit(50).get(), senderRef.get()]);
    if (following.empty) return NextResponse.json({ friends: [] });
    const ids = following.docs.map(doc => doc.id);
    const [profiles, reverse] = await Promise.all([
      db.getAll(...ids.map(uid => db.collection('users').doc(uid))),
      db.getAll(...ids.map(uid => db.collection('users').doc(uid).collection('following').doc(user.uid))),
    ]);
    const friends = profiles.flatMap((profile, index) => {
      if (!profile.exists || !reverse[index].exists || sender.data()?.blockedUsers?.includes(profile.id) || profile.data()?.blockedUsers?.includes(user.uid)) return [];
      return [{ uid: profile.id, name: String(profile.data()?.displayName || profile.data()?.name || 'Friend') }];
    });
    return NextResponse.json({ friends }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Could not load friends.' }, { status: 503 }); }
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const user = await getServerCurrentUser();
    if (!user || user.firebase?.sign_in_provider === 'anonymous') return NextResponse.json({ error: 'Sign in first.' }, { status: 401 });
    const { id } = await params;
    const parsed = inviteSchema.safeParse(await request.json().catch(() => null));
    if (!organizerIdSchema.safeParse(id).success || !parsed.success || parsed.data.targetUserId === user.uid) return NextResponse.json({ error: 'Choose a friend.' }, { status: 400 });
    if (!(await checkRateLimit(user.uid, 'friend_invite', 20, 86400000)).success) return NextResponse.json({ error: 'Daily invitation limit reached.' }, { status: 429 });
    const db = getFirebaseAdminDb();
    if (!db) throw new Error();
    const target = parsed.data.targetUserId;
    const senderRef = db.collection('users').doc(user.uid);
    const recipientRef = db.collection('users').doc(target);
    const notificationId = 'invite_' + createHash('sha256').update(user.uid + ':' + id).digest('hex');
    const notificationRef = recipientRef.collection('notifications').doc(notificationId);
    await db.runTransaction(async tx => {
      const [eventDoc, sender, recipient, forward, reverse, existing] = await tx.getAll(
        db.collection('events').doc(id), senderRef, recipientRef,
        senderRef.collection('following').doc(target), recipientRef.collection('following').doc(user.uid), notificationRef,
      );
      const event = eventDoc.data();
      if (!canInvite(event, user.uid) || !sender.exists || !recipient.exists || !forward.exists || !reverse.exists || sender.data()?.blockedUsers?.includes(target) || recipient.data()?.blockedUsers?.includes(user.uid)) throw new Error('FORBIDDEN');
      if (existing.exists) return;
      tx.create(notificationRef, { userId: target, type: 'friend_invite', eventId: id, eventName: event!.name || event!.title || 'Event',
        message: String(sender.data()?.displayName || sender.data()?.name || 'A friend') + ' invited you to ' + String(event!.name || event!.title || 'an event') + '.',
        read: false, createdAt: Timestamp.now().toDate().toISOString(),
      });
    });
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: 'Invitation unavailable. You must both follow each other, and the event must still be public.' }, { status: error instanceof Error && error.message === 'FORBIDDEN' ? 403 : 503 }); }
}
