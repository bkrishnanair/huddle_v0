// lib/cron/schedule.ts
//
// Pure scheduling logic for the cron dispatcher. Deliberately free of
// `server-only` and of any Firebase/Admin import: it holds no secrets and
// touches no I/O, and the unit tests in __tests__/cron-schedule.test.ts import
// it directly. Everything that actually reaches a database lives in the
// handlers this module only names.

/** The five handlers the dispatcher can invoke. */
export type CronHandlerName =
  | 'event-reminders'
  | 'scheduled-messages'
  | 'serendipity'
  | 'cleanup'
  | 'post-event-prompt';

/** UTC hours at which each non-hourly handler is due. Single source of truth —
 *  the table at the top of dispatch/route.ts documents these same values. */
export const SERENDIPITY_UTC_HOURS = [14, 18, 22, 1] as const;
export const CLEANUP_UTC_HOUR = 6;
export const POST_EVENT_PROMPT_UTC_HOUR = 2;

export interface HandlerSchedule {
  name: CronHandlerName;
  /** Deferrable handlers are dropped first when the time budget runs out. */
  deferrable: boolean;
  shouldRun: boolean;
  skipReason?: string;
}

/**
 * Decide which handlers run for a given mode and UTC hour.
 *
 * 'daily'  — the dispatcher fires once a day, so every handler must run on that
 *            single invocation or it never runs at all. This is the fail-safe
 *            mode for a plan or schedule that cannot invoke hourly.
 * 'hourly' — handlers run only on the UTC hours in the table above.
 *
 * Any unrecognised value is treated as 'hourly', matching the previous
 * `(process.env.CRON_MODE || 'hourly')` behaviour.
 */
export function selectHandlers(mode: string | undefined, utcHour: number): HandlerSchedule[] {
  const isDailyMode = (mode || 'hourly').toLowerCase() === 'daily';

  return [
    // Always due: these are hourly by design in both modes.
    { name: 'event-reminders', deferrable: false, shouldRun: true },
    { name: 'scheduled-messages', deferrable: false, shouldRun: true },
    {
      name: 'serendipity',
      deferrable: false,
      shouldRun: isDailyMode || (SERENDIPITY_UTC_HOURS as readonly number[]).includes(utcHour),
      skipReason: `Not scheduled for UTC hour ${utcHour} in hourly mode (scheduled for ${SERENDIPITY_UTC_HOURS.join(', ')} UTC)`,
    },
    {
      name: 'cleanup',
      deferrable: true,
      shouldRun: isDailyMode || utcHour === CLEANUP_UTC_HOUR,
      skipReason: `Not scheduled for UTC hour ${utcHour} in hourly mode (scheduled for ${CLEANUP_UTC_HOUR} UTC / 2:00 AM EDT)`,
    },
    {
      name: 'post-event-prompt',
      deferrable: true,
      shouldRun: isDailyMode || utcHour === POST_EVENT_PROMPT_UTC_HOUR,
      skipReason: `Not scheduled for UTC hour ${utcHour} in hourly mode (scheduled for ${POST_EVENT_PROMPT_UTC_HOUR} UTC / 10:00 PM EDT)`,
    },
  ];
}

/** Vercel plan the deployment targets. Defaults to 'hobby' — fail safe, not
 *  fail open: assuming Pro on a Hobby project produces a hard deploy error. */
export type CronPlan = 'hobby' | 'pro';

export function resolveCronPlan(raw: string | undefined): CronPlan {
  return (raw || '').toLowerCase() === 'pro' ? 'pro' : 'hobby';
}

/** Missing/invalid configuration defaults to the safe once-daily behavior. */
export function resolveCronMode(raw: string | undefined): 'daily' | 'hourly' {
  return raw?.trim().toLowerCase() === 'hourly' ? 'hourly' : 'daily';
}

/** Function timeout ceiling per plan, in seconds. Hobby caps at 60. */
export const MAX_DURATION_BY_PLAN: Record<CronPlan, number> = {
  hobby: 60,
  pro: 300,
};

/** How long to keep starting deferrable handlers, in ms. Leaves headroom under
 *  the ceiling so an in-flight handler can finish rather than being killed. */
export const TIME_BUDGET_MS_BY_PLAN: Record<CronPlan, number> = {
  hobby: 45_000,   // of 60s
  pro: 270_000,    // of 300s
};
