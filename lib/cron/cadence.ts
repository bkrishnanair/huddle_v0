// Public deployment metadata only. Safe to share with the chat composer.
import deployment from '@/vercel.json';

/** Read the deployed schedule, not stale CRON_MODE/CRON_PLAN environment values. */
export function cronModeForSchedule(schedule: string | undefined): 'daily' | 'hourly' {
  return schedule === '0 * * * *' ? 'hourly' : 'daily';
}

export const DEPLOYED_CRON_MODE = cronModeForSchedule(
  deployment.crons.find(cron => cron.path === '/api/cron/dispatch')?.schedule,
);

export const SCHEDULED_MESSAGE_NOTICE = DEPLOYED_CRON_MODE === 'daily'
  ? 'Scheduled messages are checked once a day. Delivery may be more than 24 hours after your selected time. Messages are skipped if the event ends before delivery. Send now for time-sensitive updates.'
  : 'Scheduled messages are checked hourly. Delivery is not guaranteed at the exact selected time.';
