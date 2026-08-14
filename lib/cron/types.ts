// lib/cron/types.ts
// Shared types for cron handler results.
import 'server-only';

export type CronResult = {
  handler: string;
  ok: boolean;
  processed: number;
  errors: string[];
  durationMs: number;
};
