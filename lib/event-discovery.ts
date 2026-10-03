import 'server-only';

import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { getDirectoryDateWindow, matchesEventTimeFilter } from '@/lib/datetime';
import type { GameEvent } from '@/lib/types';

/** Server-only candidates; callers must still enforce privacy and project public fields. */
export async function getDiscoveryEventDocs({ now = new Date(), createdBy, limit = 500 }: {
  now?: Date; createdBy?: string; limit?: number;
} = {}) {
  const db = getFirebaseAdminDb();
  if (!db) throw new Error('Event discovery is temporarily unavailable');
  const { from, until } = getDirectoryDateWindow(now);
  const pageSize = Math.max(1, Math.min(1000, Math.floor(limit)));
  const ongoingLimit = Math.min(pageSize, 100);
  const events = db.collection('events');
  const base = createdBy ? events.where('createdBy', '==', createdBy) : events;

  // Disjoint start-date ranges retain legacy events without endDate while also
  // finding semester-long events. Extra rows detect truncation; no full scan.
  const [recent, ongoing] = await Promise.all([
    base.where('date', '>=', from).where('date', '<=', until)
      .orderBy('date').limit(pageSize + 1).get(),
    base.where('endDate', '>=', from).where('date', '<', from)
      .orderBy('endDate').orderBy('date').limit(ongoingLimit + 1).get(),
  ]);
  const candidates = [...recent.docs.slice(0, pageSize), ...ongoing.docs.slice(0, ongoingLimit)];
  const docs = [...new Map(candidates.map(doc => [doc.id, doc])).values()].filter(doc => {
    try { return matchesEventTimeFilter(doc.data() as GameEvent, 'All', now); }
    catch { return false; }
  });
  return { docs, truncated: recent.size > pageSize || ongoing.size > ongoingLimit };
}
