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

export const EVENT_TIME_FILTERS = ['This Week', 'Live', 'Today', 'This Weekend', 'This Month', 'All'] as const;

/** Event-local calendar windows; ongoing overnight/multi-day events remain visible. */
export function matchesEventTimeFilter(
  event: GameEvent, filter: string, now = new Date(),
  custom: { startDate?: string; endDate?: string } = {},
): boolean {
  if (event.status === 'past' || event.status === 'archived') return false;
  const start = getEventStartUTC(event);
  const end = getEventEndUTC(event);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < now) return false;
  if (filter === 'Live') return start <= now && end >= now;
  if (filter === 'All') return true;
  const tz = event.timezone || DEFAULT_TIMEZONE;
  const today = format(toZonedTime(now, tz), 'yyyy-MM-dd', { timeZone: tz });
  const shiftDay = (day: string, days: number) => {
    const date = new Date(`${day}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  let from = today;
  let until = shiftDay(today, filter === 'Today' ? 1 : 7);
  if (filter === 'This Month') {
    const date = new Date(`${today}T12:00:00Z`);
    date.setUTCMonth(date.getUTCMonth() + 1, 1);
    until = date.toISOString().slice(0, 10);
  } else if (filter === 'This Weekend') {
    const weekday = new Date(`${today}T12:00:00Z`).getUTCDay();
    from = shiftDay(today, weekday === 0 || weekday === 6 ? 0 : 6 - weekday);
    until = shiftDay(from, weekday === 0 ? 1 : 2);
  } else if (filter === 'Custom') {
    from = custom.startDate || today;
    until = custom.endDate ? shiftDay(custom.endDate, 1) : '9999-12-31';
  }
  return start < fromZonedTime(`${until}T00:00:00`, tz) && end >= fromZonedTime(`${from}T00:00:00`, tz);
}

export function getUpcomingEventWindow(now = new Date(), hours = 48) {
  const until = new Date(now.getTime() + hours * 60 * 60 * 1000);
  return { now, until,
    from: format(toZonedTime(now, DEFAULT_TIMEZONE), 'yyyy-MM-dd', { timeZone: DEFAULT_TIMEZONE }),
    to: format(toZonedTime(until, DEFAULT_TIMEZONE), 'yyyy-MM-dd', { timeZone: DEFAULT_TIMEZONE }),
  };
}

export function getEventFieldsFromISO(value: string, timezone = DEFAULT_TIMEZONE): { date: string; time: string } | null {
  const instant = new Date(value);
  if (!Number.isFinite(instant.getTime())) return null;
  const zoned = toZonedTime(instant, timezone);
  return { date: format(zoned, 'yyyy-MM-dd', { timeZone: timezone }), time: format(zoned, 'HH:mm', { timeZone: timezone }) };
}

/** Bounded SEO discovery window, including recent overnight/multi-day starts. */
export function getDirectoryDateWindow(now = new Date()) {
  const from = new Date(now);
  const until = new Date(now);
  from.setUTCDate(from.getUTCDate() - 7);
  until.setUTCDate(until.getUTCDate() + 90);
  return { from: from.toISOString().slice(0, 10), until: until.toISOString().slice(0, 10) };
}

/** Stable public-page display in the event's timezone, not the server's locale. */
export function formatEventDateForSEO(event: GameEvent): string {
  const timezone = event.timezone || DEFAULT_TIMEZONE;
  return format(toZonedTime(getEventStartUTC(event), timezone), 'EEEE, MMMM d, yyyy', { timeZone: timezone });
}

export function formatEventTimeForSEO(event: GameEvent): string {
  const timezone = event.timezone || DEFAULT_TIMEZONE;
  const start = getEventStartUTC(event);
  if (!Number.isFinite(start.getTime())) return event.time || 'Time to be confirmed';
  return format(toZonedTime(start, timezone), 'h:mm a zzz', { timeZone: timezone });
}

export function formatEventEndForSEO(event: GameEvent): string {
  const timezone = event.timezone || DEFAULT_TIMEZONE;
  return format(toZonedTime(getEventEndUTC(event), timezone), 'MMMM d, yyyy · h:mm a zzz', { timeZone: timezone });
}

/**
 * Get the UTC Date when the event starts.
 *
 * Interprets the event's date+time strings in the event's timezone,
 * then converts to UTC.
 */
export function getEventStartUTC(event: GameEvent): Date {
  const tz = event.timezone || DEFAULT_TIMEZONE;
  const dateStr = event.date?.trim();
  if (!dateStr) return new Date(NaN);
  const timeStr = event.time?.trim() || '00:00';
  const normalizedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  const localString = `${dateStr}T${normalizedTime}`;
  return fromZonedTime(localString, tz);
}

/**
 * Get the UTC Date when the event ends.
 *
 * If endTime is set, uses it. Otherwise defaults to start + 2 hours.
 * Resilient against empty/whitespace endDate strings and cross-midnight times.
 */
export function getEventEndUTC(event: GameEvent): Date {
  const tz = event.timezone || DEFAULT_TIMEZONE;
  const startUTC = getEventStartUTC(event);
  if (isNaN(startUTC.getTime())) return new Date(NaN);

  const endTimeStr = event.endTime?.trim();
  if (endTimeStr) {
    const endDateStr = (event.endDate && event.endDate.trim().length > 0)
      ? event.endDate.trim()
      : (event.date && event.date.trim().length > 0 ? event.date.trim() : '');

    if (endDateStr) {
      const normalizedEndTime = endTimeStr.length === 5 ? `${endTimeStr}:00` : endTimeStr;
      const localEnd = `${endDateStr}T${normalizedEndTime}`;
      const endUTC = fromZonedTime(localEnd, tz);

      if (!isNaN(endUTC.getTime())) {
        // If end time is earlier than start time on same date, advance by 24 hours
        if (
          endUTC.getTime() <= startUTC.getTime() &&
          (!event.endDate || event.endDate.trim() === '' || event.endDate.trim() === event.date?.trim())
        ) {
          // Advance the calendar date, then resolve in the event timezone.
          // Adding 24 elapsed hours is wrong on 23/25-hour DST transition days.
          const nextDay = new Date(`${endDateStr}T12:00:00Z`);
          nextDay.setUTCDate(nextDay.getUTCDate() + 1);
          return fromZonedTime(`${nextDay.toISOString().slice(0, 10)}T${normalizedEndTime}`, tz);
        }
        return endUTC;
      }
    }
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
