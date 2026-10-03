import 'server-only';

import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getServerCurrentUser } from '@/lib/auth-server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { checkRateLimit } from '@/lib/rate-limit';
import { organizerIdSchema, publicWebsiteSchema } from '@/lib/organizers';
import { pickPublicFields } from '@/lib/types';

export const dynamic = 'force-dynamic';
const claimSchema = z.object({ scrapedEventId: organizerIdSchema, evidenceUrl: publicWebsiteSchema.default('') }).strict();

export async function POST(request: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    if (!user || user.firebase?.sign_in_provider === 'anonymous') return NextResponse.json({ error: 'Sign in with a full account to request access.' }, { status: 401 });
    const parsed = claimSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'Provide a valid event and public HTTPS link showing your organizer role.' }, { status: 400 });
    if (!(await checkRateLimit(user.uid, 'event_claim', 10, 86400000)).success) return NextResponse.json({ error: 'Daily claim limit reached.' }, { status: 429 });
    const db = getFirebaseAdminDb();
    if (!db) throw new Error('Unavailable');
    const { scrapedEventId, evidenceUrl } = parsed.data;
    const eventRef = db.collection('events').doc(scrapedEventId);
    const key = createHash('sha256').update(scrapedEventId + ':' + user.uid).digest('hex');
    const claimRef = db.collection('eventClaims').doc(key);
    const profile = (await db.collection('users').doc(user.uid).get()).data();
    const organizerName = typeof profile?.displayName === 'string' && profile.displayName.trim()
      ? profile.displayName.trim().slice(0, 120)
      : typeof profile?.name === 'string' && profile.name.trim()
        ? profile.name.trim().slice(0, 120) : 'Organizer';
    const result = await db.runTransaction(async tx => {
      const event = (await tx.get(eventRef)).data();
      const claim = (await tx.get(claimRef)).data();
      if (!event) throw new Error('NOT_FOUND');
      if (event.source === 'claimed' && event.createdBy === user.uid) return { status: 'claimed', event: pickPublicFields({ ...event, id: scrapedEventId }) };
      if (event.source === 'claimed' || !(event.isScraped || ['terplink', 'umd-calendar'].includes(event.source))) throw new Error('UNAVAILABLE');
      if (claim?.status !== 'approved' || claim.uid !== user.uid || claim.eventId !== scrapedEventId) {
        if (claim?.status === 'rejected') throw new Error('REJECTED');
        if (!evidenceUrl && !claim) throw new Error('EVIDENCE_REQUIRED');
        if (!claim) tx.create(claimRef, {
          uid: user.uid, eventId: scrapedEventId, eventName: String(event.name || event.title || 'Event'),
          organizerName, evidenceUrl, status: 'pending', createdAt: Timestamp.now(),
        });
        return { status: 'pending' };
      }
      // Approval is private and can only be written by the admin endpoint.
      // Consume it in the same transaction as ownership transfer.
      const ownership = {
        createdBy: user.uid, organizerName, organizerPhotoURL: profile?.photoURL || '',
        admins: [user.uid], source: 'claimed', isScraped: false,
        claimedFrom: scrapedEventId, claimedAt: Timestamp.now(), isOrganizerVerified: false,
      };
      tx.update(eventRef, ownership);
      tx.update(claimRef, { status: 'consumed', consumedAt: Timestamp.now() });
      // No notification side effects inside retryable transactions.
      return { status: 'claimed', event: pickPublicFields({ ...event, ...ownership, id: scrapedEventId }) };
    });
    return NextResponse.json({ ...result, eventId: scrapedEventId }, { status: result.status === 'pending' ? 202 : 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const failures: Record<string, [number, string]> = {
      NOT_FOUND: [404, 'Event not found.'], UNAVAILABLE: [409, 'This event is no longer available to claim.'],
      REJECTED: [403, 'This request was declined. Contact Huddle through Feedback if you need a review.'],
      EVIDENCE_REQUIRED: [400, 'Add a public link showing your role in the club or organization.'],
    };
    const [status, detail] = failures[message] || [503, 'Could not confirm your request. Retry safely.'];
    return NextResponse.json({ error: detail }, { status });
  }
}
