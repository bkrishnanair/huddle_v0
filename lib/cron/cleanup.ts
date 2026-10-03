import 'server-only';

import { FieldPath } from 'firebase-admin/firestore';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { getEventCleanupWindow, shouldArchiveEvent } from '@/lib/datetime';
import type { GameEvent } from '@/lib/types';
import type { CronResult } from './types';

const PAGE_SIZE = 200;

/** Archive only events that ended at least 48 hours ago, never merely old starts. */
export async function runCleanup(): Promise<CronResult> {
  const start = Date.now();
  const now = new Date();
  const errors: string[] = [];
  let processed = 0;

  try {
    const db = getFirebaseAdminDb();
    if (!db) throw new Error('Database unavailable');
    const stateRef = db.collection('cronState').doc('eventCleanup');
    const { through } = getEventCleanupWindow(now);

    // Revisit old multi-day events after they end instead of abandoning them
    // outside a moving start-date window. Retry if an organizer extends an event.
    processed = await db.runTransaction(async transaction => {
      const state = await transaction.get(stateRef);
      const cursor = state.data()?.cursor;
      let query = db.collection('events').where('date', '<=', through)
        .orderBy('date').orderBy(FieldPath.documentId()).limit(PAGE_SIZE);
      if (typeof cursor?.date === 'string' &&
          typeof cursor?.id === 'string' && cursor.id && !cursor.id.includes('/')) {
        query = query.startAfter(cursor.date, cursor.id);
      }
      const snapshot = await transaction.get(query);
      let archived = 0;
      for (const doc of snapshot.docs) {
        if (shouldArchiveEvent(doc.data() as GameEvent, now)) {
          transaction.update(doc.ref, { status: 'archived' });
          archived++;
        }
      }
      const last = snapshot.docs.at(-1);
      transaction.set(stateRef, {
        cursor: snapshot.size === PAGE_SIZE && last
          ? { date: last.data().date, id: last.id } : null,
      });
      return archived;
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    errors.push(msg);
    console.error('Cleanup handler error:', msg);
  }

  return {
    handler: 'cleanup',
    ok: errors.length === 0,
    processed,
    errors,
    durationMs: Date.now() - start,
  };
}
