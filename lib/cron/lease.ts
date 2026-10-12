import 'server-only';

import { randomUUID } from 'node:crypto';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';

/** Prevent overlapping cron/admin invocations. Expiry recovers a killed worker. */
export async function acquireCronLease(name: string): Promise<(() => Promise<void>) | null> {
  const db = getFirebaseAdminDb();
  if (!db) throw new Error('Database unavailable');
  const ref = db.collection('cronState').doc(`lease_${name}`);
  const token = randomUUID();
  const acquired = await db.runTransaction(async tx => {
    const current = await tx.get(ref);
    if (current.data()?.expiresAt > Date.now()) return false;
    tx.set(ref, { token, expiresAt: Date.now() + 6 * 60_000 });
    return true;
  });
  if (!acquired) return null;
  return async () => {
    await db.runTransaction(async tx => {
      const current = await tx.get(ref);
      // An expired lease may already belong to a later worker.
      if (current.data()?.token === token) tx.delete(ref);
    });
  };
}
