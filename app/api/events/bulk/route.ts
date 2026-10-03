import 'server-only';

import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { FieldValue, GeoPoint, Timestamp } from 'firebase-admin/firestore';
import { geohashForLocation } from 'geofire-common';
import { getServerCurrentUser } from '@/lib/auth-server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { checkRateLimit } from '@/lib/rate-limit';
import { publishScheduleSchema } from '@/lib/schedule-import';
import { getEventEndUTC } from '@/lib/datetime';
import type { GameEvent } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    if (!user || user.firebase?.sign_in_provider === 'anonymous') return NextResponse.json({ error: 'Sign in to publish a schedule.' }, { status: 401 });
    const parsed = publishScheduleSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Review your schedule.' }, { status: 400 });
    const db = getFirebaseAdminDb();
    if (!db) return NextResponse.json({ error: 'Publishing is temporarily unavailable.' }, { status: 503 });
    const { submissionId, events, timezone } = parsed.data;
    const fingerprint = createHash('sha256').update(JSON.stringify({ events, timezone })).digest('hex');
    const requestId = createHash('sha256').update(user.uid + ':submission:' + submissionId).digest('hex');
    const scheduleId = createHash('sha256').update(user.uid + ':content:' + fingerprint).digest('hex');
    const receipt = db.collection('scheduleImports').doc(requestId);
    const contentReceipt = db.collection('scheduleImports').doc(scheduleId);
    // Completed requests can be retried even after the daily import limit is reached.
    const previous = await receipt.get();
    if (previous.exists) {
      if (previous.data()?.fingerprint !== fingerprint) return NextResponse.json({ error: 'This submission was already used for another draft.' }, { status: 409 });
      return NextResponse.json(previous.data()?.result);
    }
    const identical = await contentReceipt.get();
    if (identical.exists) return NextResponse.json(identical.data()?.result);
    if (!(await checkRateLimit(user.uid, 'publish_schedule', 3, 86400000)).success) return NextResponse.json({ error: 'Daily schedule import limit reached.' }, { status: 429 });
    const now = Timestamp.now();
    if (events.some(event => {
      const end = getEventEndUTC({ ...event, timezone } as unknown as GameEvent);
      return !Number.isFinite(end.getTime()) || end.getTime() <= now.toMillis();
    })) return NextResponse.json({ error: 'Every event must have a valid upcoming or ongoing time.' }, { status: 400 });
    const profile = (await db.collection('users').doc(user.uid).get()).data();
    const eventIds = events.map((_, index) => scheduleId + '_' + index);
    const result = { created: events.length, scheduleId, eventIds };
    await db.runTransaction(async tx => {
      const [existing, identical] = await tx.getAll(receipt, contentReceipt);
      if (existing.exists) {
        if (existing.data()?.fingerprint !== fingerprint) throw new Error('SUBMISSION_CONFLICT');
        return;
      }
      if (identical.exists) {
        tx.create(receipt, { uid: user.uid, fingerprint, result: identical.data()?.result, createdAt: now });
        return;
      }
      events.forEach((event, index) => {
        const { latitude, longitude } = event.geopoint;
        tx.create(db.collection('events').doc(eventIds[index]), {
          name: event.title, title: event.title, category: event.category, sport: event.category,
          date: event.date, time: event.time, endDate: event.endDate, endTime: event.endTime, timezone,
          eventType: 'in-person', venue: event.location, location: event.location,
          geopoint: new GeoPoint(latitude, longitude), geohash: geohashForLocation([latitude, longitude]),
          description: event.description, maxPlayers: event.capacity, currentPlayers: FieldValue.increment(0),
          players: [], waitlist: [], createdBy: user.uid,
          organizerName: typeof profile?.displayName === 'string' && profile.displayName.trim()
            ? profile.displayName.trim().slice(0, 120)
            : typeof profile?.name === 'string' && profile.name.trim()
              ? profile.name.trim().slice(0, 120) : 'Organizer',
          organizerPhotoURL: profile?.photoURL || '', parentScheduleId: scheduleId,
          source: 'manual', status: 'active', isPrivate: false, isScraped: false,
          viewCount: FieldValue.increment(0), createdAt: now,
        });
      });
      // Private receipt: default-deny rules keep draft metadata out of public event docs.
      tx.create(receipt, { uid: user.uid, fingerprint, result, createdAt: now });
      tx.create(contentReceipt, { uid: user.uid, fingerprint, result, createdAt: now });
    });
    return NextResponse.json(result);
  } catch (error) {
    const conflict = error instanceof Error && error.message === 'SUBMISSION_CONFLICT';
    return NextResponse.json({ error: conflict ? 'Submission conflict. Review your draft.' : 'Publishing could not be confirmed. Retry the unchanged draft safely.' }, { status: conflict ? 409 : 503 });
  }
}
