import 'server-only';

import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { publicOrganizer, organizerIdSchema } from '@/lib/organizers';
import { getDirectoryDateWindow, getEventStartUTC, matchesEventTimeFilter } from '@/lib/datetime';
import { normalizeCoordinates } from '@/lib/coordinates';
import { pickPublicFields, type GameEvent } from '@/lib/types';

export async function getPublicOrganizer(id: string) {
  if (!organizerIdSchema.safeParse(id).success) return null;
  const db = getFirebaseAdminDb();
  if (!db) throw new Error('Organizer pages unavailable');
  const snapshot = await db.collection('organizers').doc(id).get();
  const page = snapshot.exists ? publicOrganizer(id, snapshot.data()!) : null;
  return page?.published ? page : null;
}

export async function getOrganizerDirectory() {
  const db = getFirebaseAdminDb();
  if (!db) throw new Error('Organizer directory unavailable');
  const snapshot = await db.collection('organizers').where('published', '==', true).limit(100).get();
  return snapshot.docs.flatMap(doc => { const page = publicOrganizer(doc.id, doc.data()); return page ? [page] : []; });
}

export async function getOrganizerEvents(id: string): Promise<GameEvent[]> {
  const db = getFirebaseAdminDb();
  if (!db) throw new Error('Events unavailable');
  const { from, until } = getDirectoryDateWindow();
  const snapshot = await db.collection('events').where('createdBy', '==', id)
    .where('date', '>=', from).where('date', '<=', until).orderBy('date').limit(100).get();
  return snapshot.docs.flatMap(doc => {
    const data = doc.data();
    if (data.isPrivate || !matchesEventTimeFilter(data as GameEvent, 'All')) return [];
    return [{ ...pickPublicFields({ ...data, id: doc.id }), geopoint: normalizeCoordinates(data.geopoint) } as GameEvent];
  }).sort((a, b) => getEventStartUTC(a).getTime() - getEventStartUTC(b).getTime());
}
