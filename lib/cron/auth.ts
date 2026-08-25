import 'server-only';
import type { NextRequest } from 'next/server';

/**
 * Shared authentication for every cron route.
 *
 * All six cron entry points carried the same check:
 *
 *   authHeader === `Bearer ${process.env.CRON_SECRET}`
 *
 * With `CRON_SECRET` unset, that template literal evaluates to the string
 * "Bearer undefined". Vercel Cron sends a real secret and got 401, while anyone
 * sending `Authorization: Bearer undefined` got 200 and could trigger the
 * reminder, cleanup and serendipity jobs on demand.
 *
 * This helper refuses every request when the secret is not configured, so the
 * unconfigured state is closed rather than wide open.
 */
export type CronAuthResult =
  | { ok: true }
  | { ok: false; status: 401 | 500; message: string };

export function authorizeCronRequest(req: NextRequest): CronAuthResult {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error(
      '[cron] CRON_SECRET is not set. Refusing every request rather than ' +
        'comparing against "Bearer undefined". Set it in the Vercel project.',
    );
    return { ok: false, status: 500, message: 'Cron not configured' };
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader === `Bearer ${cronSecret}`) {
    return { ok: true };
  }

  // Query-string fallback for local development only — never in production.
  if (process.env.NODE_ENV === 'development') {
    const querySecret = new URL(req.url).searchParams.get('secret');
    if (querySecret === cronSecret) {
      return { ok: true };
    }
  }

  return { ok: false, status: 401, message: 'Unauthorized' };
}
