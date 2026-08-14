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
export const maxDuration = 60; // 60s max for Vercel Hobby/Pro

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

  // 2. Determine Handlers for Current Hour
  const now = new Date();
  const currentHour = now.getUTCHours();
  
  const handlersToRun: { name: string; fn: () => Promise<CronResult>; deferrable: boolean }[] = [
    { name: 'event-reminders', fn: runEventReminders, deferrable: false },
    { name: 'scheduled-messages', fn: runScheduledMessages, deferrable: false }
  ];

  if ([1, 7, 13, 19].includes(currentHour)) {
    handlersToRun.push({ name: 'serendipity', fn: runSerendipity, deferrable: false });
  }
  if (currentHour === 6) {
    handlersToRun.push({ name: 'cleanup', fn: runCleanup, deferrable: true });
  }
  if (currentHour === 2) {
    handlersToRun.push({ name: 'post-event-prompt', fn: runPostEventPrompt, deferrable: true });
  }

  // 3. Execute Handlers Safely
  const results: CronResult[] = [];
  
  // Sort: non-deferrable first
  handlersToRun.sort((a, b) => (a.deferrable === b.deferrable ? 0 : a.deferrable ? 1 : -1));

  for (const handler of handlersToRun) {
    const elapsed = Date.now() - start;
    if (elapsed > 50000 && handler.deferrable) {
      console.warn(`[Cron Dispatch] Skipping ${handler.name} due to time budget (${elapsed}ms elapsed)`);
      results.push({
        handler: handler.name,
        ok: false,
        processed: 0,
        errors: ['Skipped: execution time budget exceeded'],
        durationMs: 0
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
        durationMs: 0
      });
    }
  }

  const totalDurationMs = Date.now() - start;

  // 4. Record Execution
  try {
    const adminDb = getFirebaseAdminDb();
    if (adminDb) {
      await adminDb.collection('cronRuns').add({
        runAt: now.toISOString(),
        handlers: results,
        totalDurationMs,
      });
    }
  } catch (err) {
    console.error('[Cron Dispatch] Failed to record run to DB:', err);
  }

  return NextResponse.json({
    message: 'Cron dispatch complete',
    totalDurationMs,
    results
  });
}
