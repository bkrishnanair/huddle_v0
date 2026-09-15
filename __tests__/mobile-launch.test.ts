import { describe, expect, it } from 'vitest';
import { EVENT_TIME_FILTERS, matchesEventTimeFilter, getEventFieldsFromISO } from '@/lib/datetime';
import { overlayViewport } from '@/lib/overlay-viewport';
import { classifyTerpLinkEvent } from '@/lib/terplink-category';
import { canSendRecommendation, isRecommendationEvent } from '@/lib/recommendation-policy';
import { composeNotification } from '@/lib/serendipity-composer';
import type { GameEvent } from '@/lib/types';

const now = new Date('2026-09-15T16:00:00Z');
const event = { id: 'e', name: 'Campus workshop', date: '2026-09-15', time: '18:00', endTime: '20:00',
  timezone: 'America/New_York', category: 'Learning', status: 'active', maxPlayers: 20,
  currentPlayers: 3, createdBy: 'organizer', players: [], geopoint: { latitude: 38.99, longitude: -76.94 },
} as unknown as GameEvent;

describe('mobile event filter contract', () => {
  it('puts This Week first and All after This Month', () => {
    expect(EVENT_TIME_FILTERS[0]).toBe('This Week');
    expect(EVENT_TIME_FILTERS.slice(-2)).toEqual(['This Month', 'All']);
  });
  it('includes ongoing multi-day and overnight events', () => {
    expect(matchesEventTimeFilter({ ...event, date: '2026-09-14', endDate: '2026-09-16' }, 'This Week', now)).toBe(true);
    expect(matchesEventTimeFilter({ ...event, date: '2026-09-14', time: '23:00', endTime: '02:00' }, 'Today', new Date('2026-09-15T05:00:00Z'))).toBe(true);
  });
  it('uses event timezone, not the viewer timezone', () => {
    expect(matchesEventTimeFilter(event, 'Today', new Date('2026-09-16T00:30:00Z'))).toBe(false); // ended at midnight UTC
    expect(matchesEventTimeFilter({ ...event, time: '22:00', endTime: '23:00' }, 'Today', new Date('2026-09-16T00:30:00Z'))).toBe(true);
  });
  it('excludes ended/archived events and does not pretend upcoming events are live', () => {
    expect(matchesEventTimeFilter(event, 'Live', now)).toBe(false);
    expect(matchesEventTimeFilter({ ...event, status: 'archived' }, 'All', now)).toBe(false);
    expect(matchesEventTimeFilter({ ...event, date: '2026-09-14' }, 'All', now)).toBe(false);
  });
  it('actually applies the selected custom dates', () => {
    expect(matchesEventTimeFilter(event, 'Custom', now, { startDate: '2026-09-16' })).toBe(false);
    expect(matchesEventTimeFilter(event, 'Custom', now, { startDate: '2026-09-15', endDate: '2026-09-15' })).toBe(true);
  });
  it('converts source UTC dates without changing the local event day', () => {
    expect(getEventFieldsFromISO('2026-09-16T01:00:00Z')).toEqual({ date: '2026-09-15', time: '21:00' });
    expect(getEventFieldsFromISO('not a date')).toBeNull();
  });
});

describe('keyboard viewport sizing', () => {
  it('lifts the sheet when the keyboard overlays rather than resizes the layout', () => {
    expect(overlayViewport(800, 480, 0)).toEqual({ bottom: 320, height: 464 });
    expect(overlayViewport(480, 480, 0)).toEqual({ bottom: 0, height: 464 });
    expect(overlayViewport(800, 480, 40)).toEqual({ bottom: 280, height: 464 });
  });
  it('restores the bottom and leaves pinch zoom alone', () => {
    expect(overlayViewport(800, 800, 0)).toEqual({ bottom: 0, height: 784 });
    expect(overlayViewport(800, 400, 0, 2)).toBeNull();
  });
});

describe('recommendations and imported categories', () => {
  it.each([
    ['Free West Coast Swing Dance Lessons', 'Arts & Culture'],
    ['GSO Fall Chapel Rehearsal', 'Music'], ['Pickup basketball', 'Sports'],
    ['Coding workshop', 'Tech'], ['Club meeting', 'Community'],
  ])('classifies %s despite broad Social metadata', (name, category) => {
    expect(classifyTerpLinkEvent(['Social'], name)).toBe(category);
  });
  it('never markets imported placeholder capacity or private events', () => {
    expect(isRecommendationEvent({ ...event, isScraped: true, source: 'terplink' }, now)).toBe(false);
    expect(isRecommendationEvent({ ...event, isPrivate: true }, now)).toBe(false);
    expect(isRecommendationEvent(event, now)).toBe(true);
  });
  it('enforces repeat, preference, participation and daily cooldown rules', () => {
    const student = { uid: 'student' };
    expect(canSendRecommendation(student, event, true, now)).toBe(false);
    expect(canSendRecommendation({ ...student, notifyPromotions: false }, event, false, now)).toBe(false);
    expect(canSendRecommendation({ ...student, lastSerendipityAt: '2026-09-15T10:00:00Z' }, event, false, now)).toBe(false);
    expect(canSendRecommendation({ ...student, blockedUsers: ['organizer'] }, event, false, now)).toBe(false);
    expect(canSendRecommendation(student, { ...event, players: ['student'] }, false, now)).toBe(false);
    expect(canSendRecommendation(student, event, false, now)).toBe(true);
  });
  it('composes factual copy without model calls or invented urgency', async () => {
    const result = await composeNotification({ userId: 'student', displayName: 'Student', score: 60,
      factors: { interest: 30, proximity: 20, social: 0, reliability: 10 }, reasons: [],
    }, { ...event, spotsLeft: 50 });
    expect(result.message).toContain('Matches your interests');
    expect(result.message).not.toContain('50');
    expect(result.message.length).toBeLessThanOrEqual(140);
  });
});
