import 'server-only';

import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { getCronEventWindow } from '@/lib/datetime';

/** Include older-starting, multi-day events without scanning the entire collection.
 * Uses the existing events(endDate, date) index. Privacy remains the caller's job. */
export async function getCronEventDocs(now: Date, lookBackHours: number, lookAheadHours: number) {
  const db = getFirebaseAdminDb();
  if (!db) throw new Error('Database unavailable');
  const { from, to } = getCronEventWindow(now, lookBackHours, lookAheadHours);
  const events = db.collection('events');
  const [recent, ongoing] = await Promise.all([
    events.where('date', '>=', from).where('date', '<=', to).orderBy('date').limit(201).get(),
    events.where('endDate', '>=', from).where('date', '<', from)
      .orderBy('endDate').orderBy('date').limit(101).get(),
  ]);
  return { docs: [...recent.docs.slice(0, 200), ...ongoing.docs.slice(0, 100)],
    truncated: recent.size > 200 || ongoing.size > 100 };
}
