// app/api/cron/dispatch/route.ts
// Single consolidated Vercel cron dispatcher.
//
// Schedule & Timezone Mapping (EDT = UTC-4 / EST = UTC-5):
// --------------------------------------------------------------------------------------
// Handler             Cadence           UTC Hours          EDT Equivalent (Local UMD)
// --------------------------------------------------------------------------------------
// event-reminders     Hourly            Every hour (*)     Every hour
// scheduled-messages  Hourly            Every hour (*)     Every hour
// serendipity         4x Daily          14, 18, 22, 1      10:00 AM, 2:00 PM, 6:00 PM, 9:00 PM
// cleanup             Daily             6                  2:00 AM
// post-event-prompt   Daily             2                  10:00 PM
// --------------------------------------------------------------------------------------
//
// Mode Support:
// - CRON_MODE='hourly' (default): Runs handlers based on current UTC hour schedule above.
// - CRON_MODE='daily': Runs all 5 handlers on every invocation (fallback for daily crons).
//
// ============================================================================
// PLAN COMPATIBILITY — READ BEFORE CHANGING vercel.json
// ============================================================================
// vercel.json cannot read environment variables, so its cron `schedule` string
// must be edited by hand to match the plan. CRON_PLAN drives everything on the
// code side; the schedule string is the one thing it cannot reach.
//
//   Plan    CRON_PLAN   vercel.json schedule   CRON_MODE   maxDuration
//   ------- ----------- ---------------------- ----------- ------------
//   Hobby   'hobby'     "0 14 * * *"           'daily'     60s
//           (default)   (once per day — Hobby allows daily crons only)
//
//   Pro     'pro'       "0 * * * *"            'hourly'    300s
//                       (hourly — the schedule the table above assumes)
//
// Deploying with vercel.json on "0 * * * *" while the project is on Hobby is a
// hard deploy error, and maxDuration=300 on Hobby is a second, separate one.
// CRON_PLAN defaults to 'hobby' so the code half fails safe; the vercel.json
// half is on you.
//
// On Hobby you MUST also set CRON_MODE='daily'. A daily schedule in 'hourly'
// mode fires once at 14:00 UTC and silently skips cleanup (6 UTC) and
// post-event-prompt (2 UTC) forever — they would never run at all.
//
// TODO: Once push delivery is verified working in production, move serendipity
// to its own dedicated schedule "*/15 8-23 * * *" so at-risk detection happens
// inside the 45-minute window the product pitch claims.

import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { runEventReminders } from '@/lib/cron/event-reminders';
import { runSerendipity } from '@/lib/cron/serendipity';
import { runCleanup } from '@/lib/cron/cleanup';
import { runPostEventPrompt } from '@/lib/cron/post-event-prompt';
import { runScheduledMessages } from '@/lib/cron/scheduled-messages';
import {
  selectHandlers,
  resolveCronPlan,
  MAX_DURATION_BY_PLAN,
  type CronHandlerName,
} from '@/lib/cron/schedule';
import type { CronResult } from '@/lib/cron/types';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// maxDuration MUST be a literal. Next parses this statically and rejects any
// expression — both of these were tried and both fail the build:
//   export const maxDuration = MAX_DURATION_BY_PLAN[CRON_PLAN];
//     -> Unsupported node type "MemberExpression" at "maxDuration"
//   export const maxDuration = process.env.CRON_PLAN === 'pro' ? 300 : 60;
//     -> Unsupported node type "ConditionalExpression" at "maxDuration"
//
// So this one value cannot be env-driven. It is set to the Hobby ceiling
// because 60 is valid on BOTH plans, while 300 is a hard deploy error on
// Hobby — fail safe, not fail open.
//
// Moving to Pro means editing three things together:
//   1. this literal            60  -> 300
//   2. vercel.json schedule    "0 14 * * *" -> "0 * * * *"
//   3. env CRON_PLAN=pro, CRON_MODE=hourly
// The runtime check below shouts if you do 3 and forget 1.
// ---------------------------------------------------------------------------
export const maxDuration = 60;

const CRON_PLAN = resolveCronPlan(process.env.CRON_PLAN);

/** Derived from maxDuration rather than from CRON_PLAN, so the budget can
 *  never disagree with the ceiling it is budgeting against. 15s of headroom
 *  lets an in-flight handler finish instead of being killed mid-write. */
const TIME_BUDGET_MS = Math.max(15_000, (maxDuration - 15) * 1000);

if (CRON_PLAN === 'pro' && maxDuration < MAX_DURATION_BY_PLAN.pro) {
  console.warn(
    `[Cron Dispatch] CRON_PLAN=pro but maxDuration is still ${maxDuration}s. ` +
      `Edit the literal in app/api/cron/dispatch/route.ts to ${MAX_DURATION_BY_PLAN.pro} ` +
      `and set vercel.json to the hourly schedule, or the extra plan headroom is unused.`,
  );
}

if (CRON_PLAN === 'hobby' && (process.env.CRON_MODE || 'hourly').toLowerCase() !== 'daily') {
  console.warn(
    '[Cron Dispatch] CRON_PLAN=hobby without CRON_MODE=daily. Hobby allows one ' +
      'cron per day, so cleanup (6 UTC) and post-event-prompt (2 UTC) will never ' +
      'fire. Set CRON_MODE=daily.',
  );
}

export async function GET(req: NextRequest) {
  const start = Date.now();

  // 1. Authenticate Request
  const authHeader = req.headers.get('authorization');
  let isAuthorized = authHeader === `Bearer ${process.env.CRON_SECRET}`;

  if (!isAuthorized && process.env.NODE_ENV === 'development') {
    const { searchParams } = new URL(req.url);
    const querySecret = searchParams.get('secret');
    isAuthorized = !!(process.env.CRON_SECRET && querySecret === process.env.CRON_SECRET);
  }

  if (!isAuthorized) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // 2. Determine Mode & Handlers for Current Invocation
  const now = new Date();
  const currentHour = now.getUTCHours();
  const cronMode = (process.env.CRON_MODE || 'hourly').toLowerCase();
  const isDailyMode = cronMode === 'daily';

  const HANDLER_FNS: Record<CronHandlerName, () => Promise<CronResult>> = {
    'event-reminders': runEventReminders,
    'scheduled-messages': runScheduledMessages,
    'serendipity': runSerendipity,
    'cleanup': runCleanup,
    'post-event-prompt': runPostEventPrompt,
  };

  // Selection logic lives in lib/cron/schedule.ts so it can be unit tested
  // without touching Firebase. See __tests__/cron-schedule.test.ts.
  const allHandlers = selectHandlers(cronMode, currentHour).map((h) => ({
    ...h,
    fn: HANDLER_FNS[h.name],
  }));

  const handlersToRun = allHandlers.filter((h) => h.shouldRun);
  const skippedHandlers = allHandlers
    .filter((h) => !h.shouldRun)
    .map((h) => ({
      handler: h.name,
      ok: true,
      processed: 0,
      skipped: true,
      reason: h.skipReason || 'Not scheduled',
      durationMs: 0,
    }));

  // 3. Execute Handlers Safely (Sort: non-deferrable first)
  const results: CronResult[] = [];
  handlersToRun.sort((a, b) => (a.deferrable === b.deferrable ? 0 : a.deferrable ? 1 : -1));

  for (const handler of handlersToRun) {
    const elapsed = Date.now() - start;
    // Budget scales with the plan ceiling: 45s of 60s on Hobby, 270s of 300s
    // on Pro. Deferrable handlers are dropped first so the hourly ones finish.
    if (elapsed > TIME_BUDGET_MS && handler.deferrable) {
      console.warn(`[Cron Dispatch] Skipping ${handler.name} due to time budget (${elapsed}ms elapsed)`);
      results.push({
        handler: handler.name,
        ok: false,
        processed: 0,
        errors: [`Skipped: execution time budget exceeded (>${TIME_BUDGET_MS / 1000}s on ${CRON_PLAN})`],
        durationMs: 0,
      });
      continue;
    }

    try {
      const result = await handler.fn();
      results.push(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({
        handler: handler.name,
        ok: false,
        processed: 0,
        errors: [`Uncaught error: ${msg}`],
        durationMs: 0,
      });
    }
  }

  const totalDurationMs = Date.now() - start;

  // 4. Record Execution & Audit State in Firestore
  try {
    const adminDb = getFirebaseAdminDb();
    if (adminDb) {
      await adminDb.collection('cronRuns').add({
        runAt: now.toISOString(),
        utcHour: currentHour,
        cronMode,
        handlers: results,
        skipped: skippedHandlers,
        totalDurationMs,
      });
    }
  } catch (err) {
    console.error('[Cron Dispatch] Failed to record run to DB:', err);
  }

  return NextResponse.json({
    message: 'Cron dispatch complete',
    cronMode,
    utcHour: currentHour,
    totalDurationMs,
    executed: results,
    skipped: skippedHandlers,
  });
}
