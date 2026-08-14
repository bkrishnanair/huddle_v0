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

    const staleSnap = await adminDb
      .collection('events')
      .where('date', '<', cutoffStr)
      .where('status', '!=', 'archived')
      .limit(100)
      .get();

    if (!staleSnap.empty) {
      const batch = adminDb.batch();
      staleSnap.forEach((doc) => {
        batch.update(doc.ref, { status: 'archived' });
      });
      await batch.commit();
      processed = staleSnap.size;
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
