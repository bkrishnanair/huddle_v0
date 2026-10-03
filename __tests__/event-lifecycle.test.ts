import { describe, expect, it } from 'vitest';
import { getEventEndUTC, matchesEventTimeFilter, shouldArchiveEvent } from '@/lib/datetime';
import type { GameEvent } from '@/lib/types';

const now = new Date('2026-10-03T16:00:00Z');
const event = { date: '2026-09-15', time: '13:44', endDate: '2026-12-31', endTime: '23:59',
  timezone: 'America/New_York', status: 'active' } as GameEvent;

describe('ongoing event lifecycle', () => {
  it('keeps a September-to-December event visible and out of cleanup in October', () => {
    expect(shouldArchiveEvent(event, now)).toBe(false);
    expect(matchesEventTimeFilter(event, 'This Week', now)).toBe(true);
    expect(matchesEventTimeFilter(event, 'Live', now)).toBe(true);
  });
  it('waits 48 elapsed hours after the actual end, including the boundary', () => {
    const ended = { ...event, endDate: '2026-10-01', endTime: '12:00' };
    expect(shouldArchiveEvent(ended, new Date('2026-10-03T15:59:59.999Z'))).toBe(false);
    expect(shouldArchiveEvent(ended, now)).toBe(true);
  });
  it('honors an explicit end date even when no end time was supplied', () => {
    const dateOnly = { ...event, endTime: undefined };
    expect(getEventEndUTC(dateOnly).toISOString()).toBe('2027-01-01T04:59:59.999Z');
    expect(shouldArchiveEvent(dateOnly, now)).toBe(false);
    expect(matchesEventTimeFilter(dateOnly, 'Live', now)).toBe(true);
  });
  it('retains the two-hour fallback for legacy events with neither end field', () => {
    const legacy = { ...event, endDate: undefined, endTime: undefined };
    expect(getEventEndUTC(legacy).toISOString()).toBe('2026-09-15T19:44:00.000Z');
    expect(shouldArchiveEvent(legacy, now)).toBe(true);
  });
  it('resolves overnight end times across DST before applying elapsed-hour retention', () => {
    const overnight = { ...event, date: '2026-10-31', time: '23:00', endDate: undefined, endTime: '02:30' };
    expect(getEventEndUTC(overnight).toISOString()).toBe('2026-11-01T07:30:00.000Z');
    expect(shouldArchiveEvent(overnight, new Date('2026-11-03T07:29:59Z'))).toBe(false);
    expect(shouldArchiveEvent(overnight, new Date('2026-11-03T07:30:00Z'))).toBe(true);
  });
  it.each([
    { endDate: '2026-02-30' }, { endDate: '2026-09-01' }, { endTime: '30:99' },
    { date: 'bad-date' }, { timezone: 'Not/AZone' },
  ])('never archives malformed dates: %j', fields => {
    expect(shouldArchiveEvent({ ...event, ...fields }, now)).toBe(false);
  });
  it.each(['past', 'archived'] as const)('does not restore or rewrite %s events', status => {
    expect(shouldArchiveEvent({ ...event, status }, new Date('2027-02-01T12:00:00Z'))).toBe(false);
    expect(matchesEventTimeFilter({ ...event, status }, 'All', now)).toBe(false);
  });
});
