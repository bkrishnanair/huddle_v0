// lib/cron/scheduled-messages.ts
// Handler: process pending scheduled messages for events.
import 'server-only';

import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { CronResult } from './types';

/**
 * Process scheduled messages for events happening within
 * the next 7 days. Previously did a full-collection scan;
 * now bounded by date range.
 *
 * Bounded query: date >= today AND date <= today+7 (covers any
 * reasonable pre-event scheduled message window).
 * Estimated reads per run: ~20–50 (only upcoming events)
 */
export async function runScheduledMessages(): Promise<CronResult> {
  const start = Date.now();
  const errors: string[] = [];
  let processed = 0;

  try {
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error('Database unavailable');

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const weekAheadStr = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // Bounded query: only scan events in the upcoming week
    // (past events with unsent messages are stale and should be skipped)
    const eventsSnapshot = await adminDb
      .collection('events')
      .where('date', '>=', todayStr)
      .where('date', '<=', weekAheadStr)
      .get();

    for (const doc of eventsSnapshot.docs) {
      const event = doc.data();
      if (!event.scheduledMessages || !Array.isArray(event.scheduledMessages)) {
        continue;
      }
      if (event.status === 'archived') continue;

      let needsUpdate = false;
      const updatedMessages = [...event.scheduledMessages];
      let newPinnedMessage = event.pinnedMessage;

      for (let i = 0; i < updatedMessages.length; i++) {
        const msg = updatedMessages[i];

        if (!msg.sent && new Date(msg.scheduledFor) <= now) {
          try {
            const chatRef = doc.ref.collection('chat').doc();
            await chatRef.set({
              message: msg.message,
              userId: event.createdBy,
              userName: event.organizerName + ' (Organizer)',
              timestamp: FieldValue.serverTimestamp(),
            });

            if (msg.isAnnouncement) {
              newPinnedMessage = msg.message;
            }

            updatedMessages[i] = { ...msg, sent: true };
            needsUpdate = true;
            processed++;
          } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            errors.push(`Message send failed for event ${doc.id}: ${errMsg}`);
          }
        }
      }

      if (needsUpdate) {
        await doc.ref.update({
          scheduledMessages: updatedMessages,
          ...(newPinnedMessage !== event.pinnedMessage
            ? {
                pinnedMessage: newPinnedMessage,
                lastAnnouncementAt: new Date().toISOString(),
              }
            : {}),
        });
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    errors.push(msg);
    console.error('Scheduled-messages handler error:', msg);
  }

  return {
    handler: 'scheduled-messages',
    ok: errors.length === 0,
    processed,
    errors,
    durationMs: Date.now() - start,
  };
}
