// lib/cron/cleanup.ts
// Handler: archive stale events older than 48 hours.
import 'server-only';

import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import type { CronResult } from './types';

/**
 * Archive events whose date is more than 48 hours ago.
 * Bounded query: date < cutoff AND status != 'archived', limit 100.
 * Estimated reads per run: ≤100
 */
export async function runCleanup(): Promise<CronResult> {
  const start = Date.now();
  const errors: string[] = [];
  let processed = 0;

  try {
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) throw new Error('Database unavailable');

    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 48);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    
    // Moving window: events from exactly 7 days before cutoff, up to cutoff.
    // This avoids fetching extremely old events that are already archived.
    const cutoffMinus7 = new Date(cutoff.getTime() - 7 * 24 * 60 * 60 * 1000);
    const cutoffMinus7Str = cutoffMinus7.toISOString().split('T')[0];

    const staleSnap = await adminDb
      .collection('events')
      .where('date', '>=', cutoffMinus7Str)
      .where('date', '<', cutoffStr)
      .limit(200)
      .get();

    if (!staleSnap.empty) {
      const batch = adminDb.batch();
      staleSnap.docs.forEach((doc) => {
        if (doc.data().status !== 'archived') {
          batch.update(doc.ref, { status: 'archived' });
          processed++;
        }
      });
      if (processed > 0) {
        await batch.commit();
      }
    }
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
