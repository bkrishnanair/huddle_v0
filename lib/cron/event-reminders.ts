// lib/cron/event-reminders.ts
// Handler: daily reminder notifications + emails to RSVP'd attendees.
import 'server-only';

import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { sendReminderEmail } from '@/lib/email';
import { sendPushToUser } from '@/lib/push-server';
import { getCronEventWindow, isEventInReminderWindow } from '@/lib/datetime';
import type { GameEvent } from '@/lib/types';
import type { CronResult } from './types';

/**
 * Scan events starting within 0–28 hours, send in-app notifications
 * + email to each attendee whose notifyReminders !== false, then
 * stamp reminderSentAt on the event for idempotency.
 *
 * Bounded query: at most 201 date candidates, with timezone padding.
 */
export async function runEventReminders(): Promise<CronResult> {
  const start = Date.now();
  const errors: string[] = [];
  let processed = 0;
  // Declared at function scope so the returned delivery counts can read them.
  let emailsSent = 0;
  let emailsFailed = 0;
  let pushesSent = 0;
  let pushesFailed = 0;

  try {
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error('Database unavailable');

    const now = new Date();
    const { from, to } = getCronEventWindow(now, 0, 28);

    const eventsSnap = await adminDb
      .collection('events')
      .where('date', '>=', from)
      .where('date', '<=', to)
      .limit(201)
      .get();

    if (eventsSnap.size > 200) errors.push('Reminder candidate limit reached; some events were deferred');

    let eventsQueued = 0;

    const batch = adminDb.batch();
    const pendingEmails: Parameters<typeof sendReminderEmail>[0][] = [];
    const emailPromises: Promise<{ success: boolean; error?: string }>[] = [];
    const pendingPushes: { uid: string; payload: { title: string; body: string; url: string; type: "event_reminder" } }[] = [];
    let batchOps = 0;

    for (const doc of eventsSnap.docs.slice(0, 200)) {
      const data = doc.data();

      if (data.reminderSentAt) continue;
      if (data.status === 'archived' || data.status === 'past') continue;
      if (data.isScraped) continue;

      if (!isEventInReminderWindow(data as GameEvent, now)) continue;

      const playerIds: string[] = data.players || [];
      if (playerIds.length === 0) continue;
      // Never partially enqueue a roster and mark the whole event as reminded.
      if (batchOps + playerIds.length + 1 > 450) {
        errors.push(`Reminder recipient budget reached for event ${doc.id}`);
        continue;
      }

      // Batch-fetch user docs (chunks of 30 via whereIn)
      const userDocs: Map<string, FirebaseFirestore.DocumentData> = new Map();
      for (let i = 0; i < playerIds.length; i += 30) {
        const chunk = playerIds.slice(i, i + 30);
        const usersSnap = await adminDb
          .collection('users')
          .where('__name__', 'in', chunk)
          .get();
        usersSnap.forEach((userDoc) => {
          userDocs.set(userDoc.id, userDoc.data());
        });
      }

      const baseUrl = (
        process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
        'https://huddlemap.live'
      ).replace(/\/$/, '');
      const eventUrl = `${baseUrl}/event/${doc.id}`;
      const eventName = data.name || data.title || 'Your event';
      const eventDate = data.date || '';
      const eventTime = data.time || '18:00';

      for (const [uid, userData] of userDocs) {
        if (userData.notifyReminders === false) continue;
        if (batchOps >= 450) break;

        const notifRef = adminDb
          .collection('users')
          .doc(uid)
          .collection('notifications')
          .doc();

        batch.set(notifRef, {
          userId: uid,
          type: 'event_reminder',
          message: `Reminder: "${eventName}" is coming up. Check the event for its time and location.`,
          eventId: doc.id,
          eventName,
          read: false,
          createdAt: new Date().toISOString(),
        });

        batchOps++;

        const pushTitle = `Reminder: ${eventName}`;
        const pushBody = 'Your event is coming up. Check its time and location.';
        
        // Queue push to execute only AFTER successful batch commit
        pendingPushes.push({
          uid,
          payload: {
            title: pushTitle,
            body: pushBody,
            url: `/event/${doc.id}`,
            type: 'event_reminder'
          }
        });

        const userEmail = userData.email;
        if (userEmail) {
          pendingEmails.push({
            to: userEmail,
            eventName,
            eventDate,
            eventTime,
            eventUrl,
          });
        }
      }

      if (batchOps < 450) {
        const eventRef = adminDb.collection('events').doc(doc.id);
        batch.update(eventRef, { reminderSentAt: now.toISOString() });
        batchOps++;
        eventsQueued++;
      }
    }

    if (batchOps > 0) {
      // 1. Commit in-app notifications first
      await batch.commit();
      processed = eventsQueued;

      // Do not send emails for an uncommitted notification batch.
      emailPromises.push(...pendingEmails.map(email => sendReminderEmail(email)));

      // 2. Only dispatch and await push notifications after commit succeeds
      const pushPromises = pendingPushes.map((p) =>
        sendPushToUser(p.uid, p.payload),
      );
      const pushResults = await Promise.allSettled(pushPromises);
      for (const res of pushResults) {
        if (res.status === 'fulfilled' && (res.value as any)?.successCount > 0) {
          pushesSent++;
        } else if (res.status === 'rejected' || (res.value as any)?.failureCount > 0) {
          pushesFailed++;
        }
      }
    }

    const emailResults = await Promise.allSettled(emailPromises);
    for (const result of emailResults) {
      if (result.status === 'fulfilled' && result.value.success) {
        emailsSent++;
      } else {
        emailsFailed++;
      }
    }

    // Include stats in errors array for cron log observability
    if (emailsFailed > 0) {
      // Distinguish "Resend rejected it" from "Resend was never configured".
      // The second is the failure mode that hides: lib/email.ts warns once at
      // module load and every send returns success:false, so the UI looks fine
      // while zero email leaves the system.
      const unconfigured = emailResults.some(
        (r) => r.status === 'fulfilled' && r.value.error === 'RESEND_NOT_CONFIGURED',
      );
      errors.push(
        unconfigured
          ? `${emailsFailed} emails NOT SENT — RESEND_API_KEY is not configured. No reminder email has left this deployment. Run \`npm run preflight\`.`
          : `${emailsFailed} emails failed`,
      );
    }
    if (pushesFailed > 0) {
      errors.push(`${pushesFailed} push dispatches failed`);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    errors.push(msg);
    console.error('Event reminders handler error:', msg);
  }

  return {
    handler: 'event-reminders',
    ok: errors.length === 0,
    processed,
    errors,
    durationMs: Date.now() - start,
    delivery: { emailsSent, emailsFailed, pushesSent, pushesFailed },
  };
}
