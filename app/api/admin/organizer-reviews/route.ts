import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getServerCurrentUser } from '@/lib/auth-server';
import { isAdminUid } from '@/lib/admin-auth';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { checkRateLimit } from '@/lib/rate-limit';
import { organizerIdSchema, publicWebsiteSchema } from '@/lib/organizers';

const revision = (timestamp: Timestamp | undefined) => timestamp ? `${timestamp.seconds}:${timestamp.nanoseconds}` : '';

export async function GET() {
  const user = await getServerCurrentUser();
  if (!isAdminUid(user?.uid)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const db = getFirebaseAdminDb();
  if (!db) return NextResponse.json({ error: 'Unavailable' }, { status: 503 });
  const [claims, pages] = await Promise.all([
    db.collection('eventClaims').where('status', '==', 'pending').limit(50).get(),
    db.collection('organizers').where('reviewStatus', '==', 'pending').limit(50).get(),
  ]);
  const reviews = [
    ...claims.docs.map(doc => ({ kind: 'claim', id: doc.id, title: String(doc.data().eventName), applicant: String(doc.data().organizerName), uid: String(doc.data().uid), evidenceUrl: doc.data().evidenceUrl, eventId: doc.data().eventId, version: revision(doc.updateTime) })),
    ...pages.docs.map(doc => ({ kind: 'organizer', id: doc.id, title: String(doc.data().name), applicant: String(doc.data().kind), uid: doc.id, evidenceUrl: doc.data().website, version: revision(doc.updateTime) })),
  ].map(review => ({ ...review, evidenceUrl: publicWebsiteSchema.safeParse(review.evidenceUrl).success ? review.evidenceUrl : '' }));
  return NextResponse.json({ reviews }, { headers: { 'Cache-Control': 'no-store' } });
}

const reviewSchema = z.object({ kind: z.enum(['claim', 'organizer']), id: organizerIdSchema, decision: z.enum(['approved', 'rejected']), version: z.string().max(40).regex(/^\d+:\d+$/), confirmed: z.literal(true) }).strict();
export async function POST(request: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    if (!user || !isAdminUid(user.uid)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const parsed = reviewSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'Invalid review.' }, { status: 400 });
    if (!(await checkRateLimit(user.uid, 'organizer_review', 100, 3600000)).success) return NextResponse.json({ error: 'Review limit reached.' }, { status: 429 });
    const db = getFirebaseAdminDb();
    if (!db) throw new Error('Unavailable');
    const { kind, id, decision, version } = parsed.data;
    const ref = db.collection(kind === 'claim' ? 'eventClaims' : 'organizers').doc(id);
    await db.runTransaction(async tx => {
      const snapshot = await tx.get(ref);
      if (!snapshot.exists || revision(snapshot.updateTime) !== version) throw new Error('STALE');
      const data = snapshot.data()!;
      if ((kind === 'claim' ? data.status : data.reviewStatus) !== 'pending') throw new Error('STALE');
      tx.update(ref, { [kind === 'claim' ? 'status' : 'reviewStatus']: decision, reviewedBy: user.uid, reviewedAt: Timestamp.now() });
      if (kind === 'claim') tx.set(db.collection('users').doc(data.uid).collection('notifications').doc('claim_' + id), {
        type: 'event_update', eventId: data.eventId, eventName: data.eventName, read: false, createdAt: Timestamp.now().toDate().toISOString(),
        message: decision === 'approved' ? 'Your organizer request was approved. Open the event and request access again to finish the transfer.' : 'Your organizer request was declined. Contact Huddle through Feedback for help.',
      });
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'The request changed or could not be reviewed. Reload before deciding.' }, { status: error instanceof Error && error.message === 'STALE' ? 409 : 503 });
  }
}
