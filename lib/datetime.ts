/**
 * lib/datetime.ts
 *
 * Timezone-aware date/time utilities for Huddle events.
 *
 * All events have date (YYYY-MM-DD) and time (HH:mm) strings that are
 * local to the event's timezone (defaulting to America/New_York for UMD).
 * This module converts those into proper UTC Date objects so that
 * countdown timers and "live" calculations work for users in ANY timezone.
 *
 * Client-safe — no 'server-only' import. Used in both client components
 * and server API routes.
 */

import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';
import type { GameEvent } from '@/lib/types';

const DEFAULT_TIMEZONE = 'America/New_York';

/**
 * Get the UTC Date when the event starts.
 *
 * Interprets the event's date+time strings in the event's timezone,
 * then converts to UTC.
 */
export function getEventStartUTC(event: GameEvent): Date {
  const tz = event.timezone || DEFAULT_TIMEZONE;
  const localString = `${event.date}T${event.time || '00:00'}:00`;
  return fromZonedTime(localString, tz);
}

/**
 * Get the UTC Date when the event ends.
 *
 * If endTime is set, uses it. Otherwise defaults to start + 2 hours.
 */
export function getEventEndUTC(event: GameEvent): Date {
  const tz = event.timezone || DEFAULT_TIMEZONE;
  const startUTC = getEventStartUTC(event);

  if (event.endTime) {
    const endDateStr = event.endDate || event.date;
    const localEnd = `${endDateStr}T${event.endTime}:00`;
    const endUTC = fromZonedTime(localEnd, tz);
    if (!isNaN(endUTC.getTime())) return endUTC;
  }

  // Default: start + 2 hours
  return new Date(startUTC.getTime() + 2 * 60 * 60 * 1000);
}

/**
 * How many hours until the event starts (can be negative if event already started).
 */
export function hoursUntilEvent(event: GameEvent): number {
  const startUTC = getEventStartUTC(event);
  const diff = startUTC.getTime() - Date.now();
  return diff / (1000 * 60 * 60);
}

/**
 * Is the event currently happening?
 *
 * Timezone-aware version of isEventLive().
 * Once timezone migration is complete, isEventLive in lib/utils.ts
 * should delegate to this function.
 */
export function isEventLiveTZ(event: GameEvent): boolean {
  if (event.status === 'archived' || event.status === 'past') return false;
  if (!event.date || !event.time) return false;

  try {
    const now = Date.now();
    const startUTC = getEventStartUTC(event);
    if (isNaN(startUTC.getTime())) return false;
    if (now < startUTC.getTime()) return false;

    const endUTC = getEventEndUTC(event);
    return now <= endUTC.getTime();
  } catch {
    return false;
  }
}

/**
 * Format the event's start time for display in the USER's local timezone.
 *
 * Example: "5:00 PM EDT" for EST users, "2:30 AM IST" for India users
 * viewing the same event.
 */
export function formatEventTimeInUserTZ(event: GameEvent): string {
  try {
    const startUTC = getEventStartUTC(event);
    if (isNaN(startUTC.getTime())) return event.time || '';

    const userTZ = typeof window !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : DEFAULT_TIMEZONE;

    const zoned = toZonedTime(startUTC, userTZ);
    return format(zoned, 'h:mm a zzz', { timeZone: userTZ });
  } catch {
    return event.time || '';
  }
}

/**
 * Format a time range for display in the USER's local timezone.
 *
 * Example: "5:00 PM - 7:00 PM EDT"
 */
export function formatEventTimeRange(event: GameEvent): string {
  try {
    const startUTC = getEventStartUTC(event);
    if (isNaN(startUTC.getTime())) return event.time || '';

    const userTZ = typeof window !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : DEFAULT_TIMEZONE;

    const startZoned = toZonedTime(startUTC, userTZ);
    const startStr = format(startZoned, 'h:mm a', { timeZone: userTZ });

    if (event.endTime) {
      const endUTC = getEventEndUTC(event);
      const endZoned = toZonedTime(endUTC, userTZ);
      const endStr = format(endZoned, 'h:mm a zzz', { timeZone: userTZ });
      return `${startStr} - ${endStr}`;
    }

    const tzAbbr = format(startZoned, 'zzz', { timeZone: userTZ });
    return `${startStr} ${tzAbbr}`;
  } catch {
    return event.endTime ? `${event.time} - ${event.endTime}` : event.time || '';
  }
}

/**
 * Get the organizer's current timezone from the browser.
 * Used when creating events to capture timezone context.
 */
export function getLocalTimezone(): string {
  if (typeof window !== 'undefined') {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  return DEFAULT_TIMEZONE;
}
