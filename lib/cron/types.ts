// lib/cron/types.ts
// Shared types for cron handler results.
import 'server-only';

export type CronResult = {
  handler: string;
  ok: boolean;
  processed: number;
  errors: string[];
  durationMs: number;
  /** Per-channel delivery counts. Optional so handlers that dispatch nothing
   *  can omit them. Present so that hitting a cron endpoint answers "did email
   *  actually leave?" without a Resend login — the channels degrade silently
   *  when unconfigured, and counts are the only way to see it. */
  delivery?: {
    emailsSent?: number;
    emailsFailed?: number;
    pushesSent?: number;
    pushesFailed?: number;
  };
};
