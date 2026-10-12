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

/** Used only if the deployed dispatcher schedule is intentionally restored to hourly. */
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
 * Missing/invalid values are daily, matching resolveCronMode. The deployed
 * dispatcher obtains its mode from vercel.json, not an environment override.
 */
export function selectHandlers(mode: string | undefined, utcHour: number): HandlerSchedule[] {
  const isDailyMode = resolveCronMode(mode) === 'daily';

  return [
    // Always due on each dispatch, whether daily or hourly.
    { name: 'event-reminders', deferrable: false, shouldRun: true },
    { name: 'scheduled-messages', deferrable: false, shouldRun: true },
    {
      name: 'serendipity',
      deferrable: true,
      shouldRun: isDailyMode || (SERENDIPITY_UTC_HOURS as readonly number[]).includes(utcHour),
      skipReason: `Not scheduled for UTC hour ${utcHour} in hourly mode (scheduled for ${SERENDIPITY_UTC_HOURS.join(', ')} UTC)`,
    },
    {
      name: 'cleanup',
      deferrable: false,
      shouldRun: isDailyMode || utcHour === CLEANUP_UTC_HOUR,
      skipReason: `Not scheduled for UTC hour ${utcHour} in hourly mode (scheduled for ${CLEANUP_UTC_HOUR} UTC / 2:00 AM EDT)`,
    },
    {
      name: 'post-event-prompt',
      deferrable: false,
      shouldRun: isDailyMode || utcHour === POST_EVENT_PROMPT_UTC_HOUR,
      skipReason: `Not scheduled for UTC hour ${utcHour} in hourly mode (scheduled for ${POST_EVENT_PROMPT_UTC_HOUR} UTC / 10:00 PM EDT)`,
    },
  ];
}

/** Missing/invalid configuration defaults to the safe once-daily behavior. */
export function resolveCronMode(raw: string | undefined): 'daily' | 'hourly' {
  return raw?.trim().toLowerCase() === 'hourly' ? 'hourly' : 'daily';
}
