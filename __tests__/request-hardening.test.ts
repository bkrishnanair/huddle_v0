import { describe, expect, it } from 'vitest';
import { loginInput, signupInput, statusInput, checkinInput, notificationInput, profileUpdateInput } from '@/lib/request-schemas';
import { resolveCronMode, selectHandlers } from '@/lib/cron/schedule';
import { getEventEndUTC } from '@/lib/datetime';
import type { GameEvent } from '@/lib/types';

describe('launch request hardening', () => {
  it('requires typed bounded authentication input', () => {
    expect(loginInput.safeParse({idToken: {}}).success).toBe(false);
    expect(loginInput.safeParse({idToken: 'token', admin: true}).success).toBe(false);
    expect(signupInput.safeParse({email: 'invalid', password: 'short', name: 'x'}).success).toBe(false);
    expect(signupInput.safeParse({email: 'test@example.com', password: 'valid-test-password', name: 'Student'}).success).toBe(true);
  });
  it('validates document IDs, enums and booleans', () => {
    expect(statusInput.safeParse({status: 'anything'}).success).toBe(false);
    expect(checkinInput.safeParse({playerId: 'a/b', status: true}).success).toBe(false);
    expect(checkinInput.safeParse({playerId: 'student', status: 'false'}).success).toBe(false);
    expect(checkinInput.parse({playerId: 'student'}).status).toBe(true);
    expect(notificationInput.safeParse({notificationId: []}).success).toBe(false);
  });
  it('rejects profile privilege fields and unbounded nested values', () => {
    expect(profileUpdateInput.safeParse({admin: true}).success).toBe(false);
    expect(profileUpdateInput.safeParse({savedQuestions: [{bad: 'object'}]}).success).toBe(false);
    expect(profileUpdateInput.safeParse({bio: 'x'.repeat(161)}).success).toBe(false);
    expect(profileUpdateInput.parse({displayName: ' Student ', notifyReminders: false})).toEqual({displayName: 'Student', notifyReminders: false});
  });
  it('runs all handlers on the daily schedule when CRON_MODE is absent', () => {
    expect(resolveCronMode(undefined)).toBe('daily');
    expect(selectHandlers(resolveCronMode(undefined), 14).every(handler => handler.shouldRun)).toBe(true);
    expect(resolveCronMode('hourly')).toBe('hourly');
  });
  it.each([
    ['2026-03-07', '2026-03-08T07:00:00.000Z'],
    ['2026-10-31', '2026-11-01T08:00:00.000Z'],
  ])('handles overnight events across DST: %s', (date, expected) => {
    expect(getEventEndUTC({date, time: '23:00', endTime: '03:00', timezone: 'America/New_York'} as GameEvent).toISOString()).toBe(expected);
  });
});
