import 'server-only';
import { getEventStartUTC, getUpcomingEventWindow } from '@/lib/datetime';
import { normalizeCoordinates } from '@/lib/coordinates';
import type { GameEvent } from '@/lib/types';

export function isRecommendationEvent(event: GameEvent, now = new Date()): boolean {
  if (event.isPrivate || event.status === 'past' || event.status === 'archived' ||
      event.createdBy === 'system' || (event.isScraped && event.source !== 'claimed')) return false;
  const starts = getEventStartUTC(event);
  return Number.isFinite(starts.getTime()) && starts > now && starts <= getUpcomingEventWindow(now).until &&
    Number.isFinite(event.maxPlayers) && event.maxPlayers > 0 && event.currentPlayers < event.maxPlayers * 0.5 &&
    !!normalizeCoordinates(event.geopoint);
}

export function canSendRecommendation(user: Record<string, any>, event: GameEvent, alreadySent: boolean, now = new Date()): boolean {
  if (alreadySent || user.notifyPromotions === false || user.uid === event.createdBy || event.players?.includes(user.uid) ||
      user.blockedUsers?.includes(event.createdBy) || !isRecommendationEvent(event, now)) return false;
  const last = typeof user.lastSerendipityAt === 'string' ? new Date(user.lastSerendipityAt) : null;
  return !last || !Number.isFinite(last.getTime()) || getUpcomingEventWindow(last, 24).until <= now;
}
