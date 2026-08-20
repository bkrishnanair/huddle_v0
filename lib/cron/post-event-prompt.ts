// lib/cron/post-event-prompt.ts
// Handler: send organizers a post-event attendance + clone prompt.
import 'server-only';

import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { getEventEndUTC } from '@/lib/datetime';
import type { GameEvent } from '@/lib/types';
import type { CronResult } from './types';

/**
 * Scan events that ended in the last 3 hours, send organizer a
 * "How many showed up?" + "Schedule again?" notification.
 * Bounded query: date >= yesterday AND date <= today.
 * Estimated reads per run: ~10–30
 */
export async function runPostEventPrompt(): Promise<CronResult> {
  const start = Date.now();
  const errors: string[] = [];
  let processed = 0;

  try {
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error('Database unavailable');

    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const todayStr = now.toISOString().split('T')[0];
    const yesterdayStr = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const eventsSnap = await adminDb
      .collection('events')
      .where('date', '>=', yesterdayStr)
      .where('date', '<=', todayStr)
      .get();

    const batch = adminDb.batch();

    for (const doc of eventsSnap.docs) {
      const data = doc.data();

      if (data.postEventPromptSent) continue;
      if (data.isScraped || data.status === 'archived') continue;

      const eventEnd = getEventEndUTC(data as GameEvent);

      if (isNaN(eventEnd.getTime())) continue;
      if (eventEnd > now) continue;
      if (eventEnd < threeHoursAgo) continue;

      const organizerUid = data.createdBy;
      if (!organizerUid) continue;

      const notifRef = adminDb
        .collection('users')
        .doc(organizerUid)
        .collection('notifications')
        .doc();

      batch.set(notifRef, {
        userId: organizerUid,
        type: 'post_event',
        message: `Your event "${data.name || data.title}" just ended! How many people showed up?`,
        eventId: doc.id,
        eventName: data.name || data.title || 'Your event',
        actions: ['report_attendance', 'clone_event'],
        read: false,
        createdAt: new Date().toISOString(),
      });

      const eventRef = adminDb.collection('events').doc(doc.id);
      batch.update(eventRef, { postEventPromptSent: true });
      processed++;
    }

    if (processed > 0) {
      await batch.commit();
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    errors.push(msg);
    console.error('Post-event-prompt handler error:', msg);
  }

  return {
    handler: 'post-event-prompt',
    ok: errors.length === 0,
    processed,
    errors,
    durationMs: Date.now() - start,
  };
}
