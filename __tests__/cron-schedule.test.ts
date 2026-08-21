import { describe, it, expect } from 'vitest';
import {
  selectHandlers,
  resolveCronPlan,
  MAX_DURATION_BY_PLAN,
  SERENDIPITY_UTC_HOURS,
  CLEANUP_UTC_HOUR,
  POST_EVENT_PROMPT_UTC_HOUR,
  type CronHandlerName,
} from '@/lib/cron/schedule';

const ALL_HANDLERS: CronHandlerName[] = [
  'event-reminders',
  'scheduled-messages',
  'serendipity',
  'cleanup',
  'post-event-prompt',
];

const ALL_HOURS = Array.from({ length: 24 }, (_, h) => h);

/** Names of handlers that would actually execute for this mode/hour. */
function running(mode: string | undefined, hour: number): CronHandlerName[] {
  return selectHandlers(mode, hour)
    .filter((h) => h.shouldRun)
    .map((h) => h.name);
}

describe('cron dispatcher handler selection', () => {
  describe("CRON_MODE='daily'", () => {
    // This is the guard that matters. On Hobby the dispatcher fires once a day,
    // so anything not selected on that single invocation never runs at all.
    it('runs all five handlers at every UTC hour', () => {
      for (const hour of ALL_HOURS) {
        expect(running('daily', hour).sort()).toEqual([...ALL_HANDLERS].sort());
      }
    });

    it('marks nothing as skipped at any hour', () => {
      for (const hour of ALL_HOURS) {
        const skipped = selectHandlers('daily', hour).filter((h) => !h.shouldRun);
        expect(skipped).toHaveLength(0);
      }
    });

    it('is case insensitive', () => {
      for (const variant of ['daily', 'DAILY', 'Daily', 'dAiLy']) {
        expect(running(variant, 3)).toHaveLength(5);
      }
    });
  });

  describe("CRON_MODE='hourly'", () => {
    it('always runs the two hourly handlers, at every hour', () => {
      for (const hour of ALL_HOURS) {
        const names = running('hourly', hour);
        expect(names).toContain('event-reminders');
        expect(names).toContain('scheduled-messages');
      }
    });

    it('runs serendipity only at 14, 18, 22 and 1 UTC', () => {
      const due = ALL_HOURS.filter((h) => running('hourly', h).includes('serendipity'));
      expect(due.sort((a, b) => a - b)).toEqual([...SERENDIPITY_UTC_HOURS].sort((a, b) => a - b));
    });

    it('runs cleanup only at 6 UTC', () => {
      const due = ALL_HOURS.filter((h) => running('hourly', h).includes('cleanup'));
      expect(due).toEqual([CLEANUP_UTC_HOUR]);
    });

    it('runs post-event-prompt only at 2 UTC', () => {
      const due = ALL_HOURS.filter((h) => running('hourly', h).includes('post-event-prompt'));
      expect(due).toEqual([POST_EVENT_PROMPT_UTC_HOUR]);
    });

    it('matches the documented schedule table exactly, hour by hour', () => {
      for (const hour of ALL_HOURS) {
        const expected: CronHandlerName[] = ['event-reminders', 'scheduled-messages'];
        if ((SERENDIPITY_UTC_HOURS as readonly number[]).includes(hour)) expected.push('serendipity');
        if (hour === CLEANUP_UTC_HOUR) expected.push('cleanup');
        if (hour === POST_EVENT_PROMPT_UTC_HOUR) expected.push('post-event-prompt');
        expect(running('hourly', hour).sort()).toEqual(expected.sort());
      }
    });

    it('gives every skipped handler a reason naming the hour', () => {
      const skipped = selectHandlers('hourly', 9).filter((h) => !h.shouldRun);
      expect(skipped.length).toBeGreaterThan(0);
      for (const h of skipped) {
        expect(h.skipReason).toBeTruthy();
        expect(h.skipReason).toContain('9');
      }
    });
  });

  describe('mode defaulting', () => {
    it('treats undefined, empty and unknown values as hourly, not daily', () => {
      // A typo in CRON_MODE must not silently become "run everything".
      for (const mode of [undefined, '', 'houry', 'weekly', 'true']) {
        expect(running(mode, 9).sort()).toEqual(['event-reminders', 'scheduled-messages']);
      }
    });
  });

  describe('deferrability', () => {
    it('marks only cleanup and post-event-prompt deferrable', () => {
      const deferrable = selectHandlers('daily', 0)
        .filter((h) => h.deferrable)
        .map((h) => h.name)
        .sort();
      expect(deferrable).toEqual(['cleanup', 'post-event-prompt']);
    });
  });
});

describe('plan resolution', () => {
  it("defaults to hobby for undefined, empty and unknown values", () => {
    // Fail safe: maxDuration=300 is a hard deploy error on Hobby, so anything
    // ambiguous must resolve to the lower ceiling.
    for (const raw of [undefined, '', 'HOBBY', 'free', 'enterprise', 'Pro ']) {
      expect(resolveCronPlan(raw)).toBe('hobby');
    }
  });

  it("resolves 'pro' case insensitively", () => {
    for (const raw of ['pro', 'PRO', 'Pro']) {
      expect(resolveCronPlan(raw)).toBe('pro');
    }
  });

  it('never exceeds the Hobby ceiling when the plan is hobby', () => {
    expect(MAX_DURATION_BY_PLAN[resolveCronPlan(undefined)]).toBe(60);
    expect(MAX_DURATION_BY_PLAN.hobby).toBeLessThanOrEqual(60);
  });
});
