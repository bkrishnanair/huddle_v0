// lib/cron/event-reminders.ts
// Handler: send T-24h reminder notifications + emails to RSVP'd attendees.
import 'server-only';

import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { sendReminderEmail } from '@/lib/email';
import { sendPushToUser } from '@/lib/push-server';
import type { CronResult } from './types';

/**
 * Scan events starting within 0–28 hours, send in-app notifications
 * + email to each attendee whose notifyReminders !== false, then
 * stamp reminderSentAt on the event for idempotency.
 *
 * Bounded query: date >= today AND date <= today+2.
 * Estimated reads per run: ~10–30 events + user chunks
 */
export async function runEventReminders(): Promise<CronResult> {
  const start = Date.now();
  const errors: string[] = [];
  let processed = 0;

  try {
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error('Database unavailable');

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];

    const eventsSnap = await adminDb
      .collection('events')
      .where('date', '>=', todayStr)
      .where('date', '<=', dayAfterTomorrowStr)
      .get();

    let notificationsSent = 0;
    let emailsSent = 0;
    let emailsFailed = 0;
    let pushesSent = 0;
    let pushesFailed = 0;

    const batch = adminDb.batch();
    const emailPromises: Promise<{ success: boolean; error?: string }>[] = [];
    const pendingPushes: { uid: string; payload: { title: string; body: string; url: string; type: "event_reminder" } }[] = [];
    let batchOps = 0;

    for (const doc of eventsSnap.docs) {
      const data = doc.data();

      if (data.reminderSentAt) continue;
      if (data.status === 'archived') continue;
      if (data.isScraped) continue;

      const eventDate = data.date || '';
      const eventTime = data.time || '18:00';

      let eventStart: Date;
      try {
        eventStart = new Date(`${eventDate}T${eventTime}`);
        if (isNaN(eventStart.getTime())) continue;
      } catch {
        continue;
      }

      const hoursUntilEvent =
        (eventStart.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Only process events starting in 0–28h (28h = 24h + buffer)
      if (hoursUntilEvent < 0 || hoursUntilEvent > 28) continue;

      const playerIds: string[] = data.players || [];
      if (playerIds.length === 0) continue;

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

      const domain =
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'localhost:3000';
      const protocol = domain.includes('localhost') ? 'http' : 'https';
      const eventUrl = `${protocol}://${domain}/event/${doc.id}`;
      const eventName = data.name || data.title || 'Your event';

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
          message: `Reminder: "${eventName}" is happening ${hoursUntilEvent < 2 ? 'soon' : 'tomorrow'}! Don't forget to show up.`,
          eventId: doc.id,
          eventName,
          read: false,
          createdAt: new Date().toISOString(),
        });

        batchOps++;
        notificationsSent++;

        const pushTitle = `Reminder: ${eventName}`;
        const pushBody = `Happening ${hoursUntilEvent < 2 ? 'soon' : 'tomorrow'}! Don't forget to show up.`;
        
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
          emailPromises.push(
            sendReminderEmail({
              to: userEmail,
              eventName,
              eventDate,
              eventTime,
              eventUrl,
            }),
          );
        }
      }

      if (batchOps < 450) {
        const eventRef = adminDb.collection('events').doc(doc.id);
        batch.update(eventRef, { reminderSentAt: now.toISOString() });
        batchOps++;
        processed++;
      }
    }

    if (batchOps > 0) {
      // 1. Commit in-app notifications first
      await batch.commit();

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
      errors.push(`${emailsFailed} emails failed`);
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
  };
}
