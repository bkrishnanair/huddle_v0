import 'server-only';

import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { isEventInPostPromptWindow } from '@/lib/datetime';
import { getCronEventDocs } from '@/lib/cron/event-candidates';
import type { GameEvent } from '@/lib/types';
import type { CronResult } from './types';

/** Once-daily delivery needs a 28-hour lookback, including long-running events. */
export async function runPostEventPrompt(): Promise<CronResult> {
  const start = Date.now();
  const now = new Date();
  const errors: string[] = [];
  let processed = 0;
  try {
    const db = getFirebaseAdminDb();
    if (!db) throw new Error('Database unavailable');
    const { docs, truncated } = await getCronEventDocs(now, 28, 0);
    if (truncated) errors.push('Post-event candidate limit reached; some events were deferred');
    const eligible = (data: FirebaseFirestore.DocumentData) =>
      !data.postEventPromptSent && !data.isScraped && data.status !== 'archived' &&
      typeof data.createdBy === 'string' && data.createdBy.length > 0 && data.createdBy !== 'system' &&
      isEventInPostPromptWindow(data as GameEvent, now);
    for (const doc of docs) {
      if (!eligible(doc.data())) continue;
      const sent = await db.runTransaction(async tx => {
        const current = await tx.get(doc.ref);
        const data = current.data();
        if (!data || !eligible(data)) return false;
        const notif = db.collection('users').doc(data.createdBy).collection('notifications').doc('post_event_' + doc.id);
        tx.set(notif, {
          userId: data.createdBy, type: 'post_event',
          message: `Your event "${data.name || data.title || 'Event'}" has ended. How many people showed up?`,
          eventId: doc.id, eventName: data.name || data.title || 'Event',
          actions: ['report_attendance', 'clone_event'], read: false, createdAt: now.toISOString(),
        });
        tx.update(doc.ref, { postEventPromptSent: true });
        return true;
      });
      if (sent) processed++;
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    console.error('Post-event-prompt handler failed', error);
  }
  return { handler: 'post-event-prompt', ok: errors.length === 0, processed, errors, durationMs: Date.now() - start };
}
