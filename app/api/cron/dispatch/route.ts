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
import type { CronResult } from '@/lib/cron/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 300s max for Vercel Pro

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

  interface HandlerDef {
    name: string;
    fn: () => Promise<CronResult>;
    deferrable: boolean;
    shouldRun: boolean;
    skipReason?: string;
  }

  const allHandlers: HandlerDef[] = [
    {
      name: 'event-reminders',
      fn: runEventReminders,
      deferrable: false,
      shouldRun: true,
    },
    {
      name: 'scheduled-messages',
      fn: runScheduledMessages,
      deferrable: false,
      shouldRun: true,
    },
    {
      name: 'serendipity',
      fn: runSerendipity,
      deferrable: false,
      shouldRun: isDailyMode || [14, 18, 22, 1].includes(currentHour),
      skipReason: `Not scheduled for UTC hour ${currentHour} in hourly mode (scheduled for 14, 18, 22, 1 UTC)`,
    },
    {
      name: 'cleanup',
      fn: runCleanup,
      deferrable: true,
      shouldRun: isDailyMode || currentHour === 6,
      skipReason: `Not scheduled for UTC hour ${currentHour} in hourly mode (scheduled for 6 UTC / 2:00 AM EDT)`,
    },
    {
      name: 'post-event-prompt',
      fn: runPostEventPrompt,
      deferrable: true,
      shouldRun: isDailyMode || currentHour === 2,
      skipReason: `Not scheduled for UTC hour ${currentHour} in hourly mode (scheduled for 2 UTC / 10:00 PM EDT)`,
    },
  ];

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
    // With 300s maxDuration on Vercel Pro, allow up to 270s before dropping deferrable handlers
    if (elapsed > 270000 && handler.deferrable) {
      console.warn(`[Cron Dispatch] Skipping ${handler.name} due to time budget (${elapsed}ms elapsed)`);
      results.push({
        handler: handler.name,
        ok: false,
        processed: 0,
        errors: ['Skipped: execution time budget exceeded (>270s)'],
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
