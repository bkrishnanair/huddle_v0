import 'server-only';

import { cache } from 'react';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { getDirectoryDateWindow, getEventEndUTC, getEventStartUTC } from '@/lib/datetime';
import type { GameEvent } from '@/lib/types';

export const SEO_ORIGIN = 'https://huddlemap.live';
export const eventUrl = (id: string) => `${SEO_ORIGIN}/event/${encodeURIComponent(id)}`;
export const cleanText = (value: unknown): string => typeof value === 'string' ? value.replace(/<[^>]*>/g, '').trim() : '';

/** An explicit SEO projection: never pass roster, contacts, join URLs or raw docs to JSX. */
export type SeoEvent = Pick<GameEvent, 'id' | 'name' | 'category' | 'date' | 'time' | 'endDate' | 'endTime' | 'timezone' | 'description' | 'organizerName' | 'eventType'> & {
  location: string; address?: string; geopoint?: { latitude: number; longitude: number };
  currentPlayers?: number; maxPlayers?: number;
};

export function projectSeoEvent(id: string, data: Record<string, any>, now = new Date()): SeoEvent | null {
  // Legacy public events omit isPrivate/status. Unknown states fail closed.
  if ((data.isPrivate !== undefined && data.isPrivate !== false) ||
      (data.status !== undefined && data.status !== 'active')) return null;
  const name = cleanText(data.name || data.title);
  if (!name || typeof data.date !== 'string' || typeof data.time !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !/^\d{2}:\d{2}(:\d{2})?$/.test(data.time)) return null;
  try {
    const start = getEventStartUTC(data as GameEvent);
    const end = getEventEndUTC(data as GameEvent);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < now || end < start) return null;
  } catch { return null; }
  const location = cleanText(data.location) || cleanText(data.venue) || cleanText(data.venue?.name);
  // Use an actual stored address, never infer a city/street from map coordinates.
  const address = cleanText(data.venue?.formatted_address || data.venue?.address) || undefined;
  const point = data.geopoint;
  const geopoint = Number.isFinite(point?.latitude) && Math.abs(point.latitude) <= 90 &&
    Number.isFinite(point?.longitude) && Math.abs(point.longitude) <= 180
    ? { latitude: point.latitude, longitude: point.longitude } : undefined;
  return { id, name, category: cleanText(data.category || data.sport), date: data.date, time: data.time,
    endDate: cleanText(data.endDate) || undefined, endTime: cleanText(data.endTime) || undefined,
    timezone: cleanText(data.timezone) || undefined, description: cleanText(data.description),
    organizerName: cleanText(data.organizerName), location, address, geopoint,
    currentPlayers: Number.isInteger(data.currentPlayers) && data.currentPlayers >= 0 ? data.currentPlayers : undefined,
    maxPlayers: Number.isInteger(data.maxPlayers) && data.maxPlayers >= 0 ? data.maxPlayers : undefined,
    eventType: ['virtual', 'hybrid'].includes(data.eventType) ? data.eventType : 'in-person' };
}

// React cache deduplicates metadata/page reads only within a request. No persistent
// event cache: a public -> private edit must disappear on the next request.
export const getSeoEvent = cache(async (id: string): Promise<SeoEvent | null> => {
  if (!id || id.includes('/') || id.length > 256) return null;
  const db = getFirebaseAdminDb();
  if (!db) throw new Error('Event discovery is temporarily unavailable');
  const doc = await db.collection('events').doc(id).get();
  return doc.exists ? projectSeoEvent(doc.id, doc.data()!) : null;
});

export const getSeoEvents = cache(async (): Promise<{events: SeoEvent[]; truncated: boolean}> => {
  const db = getFirebaseAdminDb();
  if (!db) throw new Error('Event discovery is temporarily unavailable');
  const now = new Date();
  const window = getDirectoryDateWindow(now);
  // Single-field range/order: uses existing automatic date indexing, no rule or
  // composite-index migration. Read budget stays bounded as the collection grows.
  const snapshot = await db.collection('events').where('date', '>=', window.from)
    .where('date', '<=', window.until).orderBy('date').limit(1001).get();
  const events = snapshot.docs.slice(0, 1000).flatMap(doc => {
    const event = projectSeoEvent(doc.id, doc.data(), now);
    return event ? [event] : [];
  });
  events.sort((a, b) => getEventStartUTC(a as GameEvent).getTime() - getEventStartUTC(b as GameEvent).getTime() || a.id.localeCompare(b.id));
  return {events, truncated: snapshot.size > 1000};
});

export function eventJsonLd(event: SeoEvent) {
  const url = eventUrl(event.id);
  const place = event.location ? { '@type': 'Place', name: event.location,
    ...(event.address ? {address: {'@type': 'PostalAddress', name: event.address}} : {}),
    ...(event.geopoint ? {geo: {'@type': 'GeoCoordinates', ...event.geopoint}} : {}) } : undefined;
  const virtual = {'@type': 'VirtualLocation', url};
  const location = event.eventType === 'virtual' ? virtual : event.eventType === 'hybrid' && place ? [place, virtual] : place;
  if (!location) return null;
  return {
    '@context': 'https://schema.org', '@type': 'Event', '@id': `${url}#event`, url,
    name: event.name, description: event.description || undefined,
    startDate: getEventStartUTC(event as GameEvent).toISOString(),
    // Do not publish the engine's inferred two-hour duration as a fact.
    endDate: event.endTime ? getEventEndUTC(event as GameEvent).toISOString() : undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: `https://schema.org/${event.eventType === 'virtual' ? 'Online' : event.eventType === 'hybrid' ? 'Mixed' : 'Offline'}EventAttendanceMode`,
    location,
    organizer: event.organizerName ? {'@type': 'Organization', name: event.organizerName} : undefined,
  };
}

/** Script-safe JSON, including hostile event titles containing </script>. */
export const serializeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
