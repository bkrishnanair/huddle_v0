import { describe, expect, it } from 'vitest';
import config from '@/vercel.json';
import { cronModeForSchedule, DEPLOYED_CRON_MODE, SCHEDULED_MESSAGE_NOTICE } from '@/lib/cron/cadence';
import { getCronEventWindow, isEventInPostPromptWindow, isEventInReminderWindow } from '@/lib/datetime';
import { hasTerpLinkSourceChanges } from '@/lib/terplink-import';
import type { GameEvent } from '@/lib/types';

const event = { date: '2026-10-11', time: '12:00', endTime: '14:00', timezone: 'America/New_York' } as GameEvent;
describe('low-cost deployment contract', () => {
  it('uses only two daily jobs with no overlapping recommendation schedule', () => {
    expect(config.fluid).toBe(true);
    expect(config.crons).toEqual([
      { path: '/api/cron/dispatch', schedule: '0 14 * * *' },
      { path: '/api/cron/terplink', schedule: '0 10 * * *' },
    ]);
    expect(DEPLOYED_CRON_MODE).toBe('daily');
  });
  it('derives cadence from the deployed schedule, not a runtime plan hint', () => {
    expect(cronModeForSchedule('0 14 * * *')).toBe('daily');
    expect(cronModeForSchedule(undefined)).toBe('daily');
    expect(cronModeForSchedule('0 * * * *')).toBe('hourly');
    expect(SCHEDULED_MESSAGE_NOTICE).toContain('once a day');
  });
});

describe('daily notification windows', () => {
  it('includes an event that ended yesterday, outside the old three-hour window', () => {
    expect(isEventInPostPromptWindow(event, new Date('2026-10-12T14:59:00Z'))).toBe(true);
    expect(isEventInPostPromptWindow(event, new Date('2026-10-13T14:00:00Z'))).toBe(false);
  });
  it('does not prompt for ongoing events, and handles older-starting events', () => {
    const ongoing = { ...event, date: '2026-09-15', endDate: '2026-12-31' };
    expect(isEventInPostPromptWindow(ongoing, new Date('2026-10-12T14:00:00Z'))).toBe(false);
    expect(isEventInPostPromptWindow({ ...ongoing, endDate: '2026-10-11' }, new Date('2026-10-12T14:00:00Z'))).toBe(true);
  });
  it('keeps the full daily interval across DST and rejects future endings', () => {
    const fall = { ...event, date: '2026-10-31', time: '13:00', endTime: '14:00' };
    expect(isEventInPostPromptWindow(fall, new Date('2026-11-01T19:00:00Z'))).toBe(true);
    expect(isEventInPostPromptWindow(event, new Date('2026-10-11T16:00:00Z'))).toBe(false);
  });
  it('reminds only about future events within 28 hours', () => {
    expect(isEventInReminderWindow(event, new Date('2026-10-11T14:00:00Z'))).toBe(true);
    expect(isEventInReminderWindow(event, new Date('2026-10-09T14:00:00Z'))).toBe(false);
    expect(isEventInReminderWindow(event, new Date('2026-10-11T17:00:00Z'))).toBe(false);
    const tokyo = { ...event, date: '2026-10-12', time: '01:00', timezone: 'Asia/Tokyo' };
    expect(isEventInReminderWindow(tokyo, new Date('2026-10-11T14:00:00Z'))).toBe(true);
  });
  it('pads queries for local dates on both sides of UTC', () => {
    expect(getCronEventWindow(new Date('2026-10-11T14:00:00Z'), 28, 0)).toMatchObject({ from: '2026-10-09', to: '2026-10-12' });
  });
});

describe('TerpLink no-op refreshes', () => {
  const fields = { name: 'Workshop', date: '2026-10-12', geopoint: { latitude: 38.99, longitude: -76.94 } };
  it('does not rewrite unchanged events or compare attendee/ownership fields', () => {
    expect(hasTerpLinkSourceChanges({ ...fields, currentPlayers: 5 }, { ...fields })).toBe(false);
  });
  it('compares plain, Firestore, and serialized coordinates by value', () => {
    expect(hasTerpLinkSourceChanges({ ...fields, geopoint: { _latitude: 38.99, _longitude: -76.94 } }, fields)).toBe(false);
    expect(hasTerpLinkSourceChanges(fields, { ...fields, geopoint: { latitude: 39, longitude: -76.94 } })).toBe(true);
  });
  it('updates real source changes', () => {
    expect(hasTerpLinkSourceChanges(fields, { ...fields, date: '2026-10-13' })).toBe(true);
    expect(hasTerpLinkSourceChanges({ ...fields, geopoint: null }, fields)).toBe(true);
  });
});
