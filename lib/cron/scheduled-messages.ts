import 'server-only';

import { createHash } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { getEventEndUTC } from '@/lib/datetime';
import { getCronEventDocs } from '@/lib/cron/event-candidates';
import type { GameEvent } from '@/lib/types';
import type { CronResult } from './types';

/** Daily queue drain: atomic delivery, no stale announcements after an event ends. */
export async function runScheduledMessages(): Promise<CronResult> {
  const start = Date.now();
  const now = new Date();
  const errors: string[] = [];
  let processed = 0;
  try {
    const db = getFirebaseAdminDb();
    if (!db) throw new Error('Database unavailable');
    const { docs, truncated } = await getCronEventDocs(now, 28, 7 * 24);
    if (truncated) errors.push('Scheduled-message candidate limit reached; some events were deferred');
    for (const doc of docs) {
      if (!Array.isArray(doc.data().scheduledMessages) || !doc.data().scheduledMessages.length) continue;
      processed += await db.runTransaction(async tx => {
        const current = await tx.get(doc.ref);
        const event = current.data();
        if (!event || event.status === 'archived' || !Array.isArray(event.scheduledMessages)) return 0;
        const end = getEventEndUTC(event as GameEvent);
        if (!Number.isFinite(end.getTime())) return 0;
        const messages = [...event.scheduledMessages];
        let count = 0, changed = false, pinnedMessage = event.pinnedMessage;
        // Bound each transaction below Firestore's write limit.
        for (let i = 0, handled = 0; i < messages.length && handled < 100; i++) {
          const msg = messages[i];
          if (!msg || msg.sent || msg.cancelled || typeof msg.id !== 'string') continue;
          const due = new Date(msg.scheduledFor);
          if (!Number.isFinite(due.getTime()) || due > now) continue;
          handled++;
          changed = true;
          if (end <= now || event.status === 'past') {
            messages[i] = { ...msg, cancelled: true };
            continue;
          }
          const id = 'scheduled_' + createHash('sha256').update(msg.id).digest('hex');
          tx.set(doc.ref.collection('chat').doc(id), {
            message: msg.message, userId: event.createdBy,
            userName: (event.organizerName || 'Organizer') + ' (Organizer)',
            timestamp: FieldValue.serverTimestamp(),
          });
          if (msg.isAnnouncement) pinnedMessage = msg.message;
          messages[i] = { ...msg, sent: true };
          count++;
        }
        if (changed) tx.update(doc.ref, {
          scheduledMessages: messages,
          ...(pinnedMessage !== event.pinnedMessage ? { pinnedMessage, lastAnnouncementAt: now.toISOString() } : {}),
        });
        return count;
      });
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    console.error('Scheduled-messages handler failed', error);
  }
  return { handler: 'scheduled-messages', ok: errors.length === 0, processed, errors, durationMs: Date.now() - start };
}
