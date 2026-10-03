import 'server-only';

import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { publicOrganizer, organizerIdSchema } from '@/lib/organizers';
import { getEventStartUTC } from '@/lib/datetime';
import { getDiscoveryEventDocs } from '@/lib/event-discovery';
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
  const { docs } = await getDiscoveryEventDocs({ createdBy: id, limit: 100 });
  return docs.flatMap(doc => {
    const data = doc.data();
    if (data.isPrivate) return [];
    return [{ ...pickPublicFields({ ...data, id: doc.id }), geopoint: normalizeCoordinates(data.geopoint) } as GameEvent];
  }).sort((a, b) => getEventStartUTC(a).getTime() - getEventStartUTC(b).getTime());
}
