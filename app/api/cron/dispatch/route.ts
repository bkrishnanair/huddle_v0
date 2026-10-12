import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { runEventReminders } from '@/lib/cron/event-reminders';
import { runSerendipity } from '@/lib/cron/serendipity';
import { runCleanup } from '@/lib/cron/cleanup';
import { runPostEventPrompt } from '@/lib/cron/post-event-prompt';
import { runScheduledMessages } from '@/lib/cron/scheduled-messages';
import { selectHandlers, type CronHandlerName } from '@/lib/cron/schedule';
import { DEPLOYED_CRON_MODE } from '@/lib/cron/cadence';
import { acquireCronLease } from '@/lib/cron/lease';
import type { CronResult } from '@/lib/cron/types';
import { authorizeCronRequest } from '@/lib/cron/auth';

export const dynamic = 'force-dynamic';
// Fluid Compute is explicit in vercel.json; 300s is supported on Hobby and Pro.
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const auth = authorizeCronRequest(req);
  if (!auth.ok) return new NextResponse(auth.message, { status: auth.status });

  let release: (() => Promise<void>) | null = null;
  try {
    release = await acquireCronLease('dispatch');
    if (!release) return NextResponse.json({ skipped: true, reason: 'Already running' });

    const start = Date.now();
    const now = new Date();
    const utcHour = now.getUTCHours();
    const cronMode = DEPLOYED_CRON_MODE;
    const handlers: Record<CronHandlerName, () => Promise<CronResult>> = {
      'event-reminders': runEventReminders,
      'scheduled-messages': runScheduledMessages,
      'serendipity': () => runSerendipity({ maxEvents: 10, budgetMs: Math.max(0, Math.min(45_000, 240_000 - (Date.now() - start))) }),
      'cleanup': runCleanup,
      'post-event-prompt': runPostEventPrompt,
    };
    const selected = selectHandlers(cronMode, utcHour);
    const results: CronResult[] = [];
    // Maintenance must not depend on recommendation fan-out finishing first.
    const order: CronHandlerName[] = ['cleanup', 'scheduled-messages', 'post-event-prompt', 'event-reminders', 'serendipity'];
    for (const name of order) {
      if (!selected.find(handler => handler.name === name)?.shouldRun) continue;
      if (Date.now() - start > 240_000) {
        results.push({ handler: name, ok: false, processed: 0, errors: ['Deferred: invocation time budget reached'], durationMs: 0 });
        continue;
      }
      try {
        results.push(await handlers[name]());
      } catch (error) {
        results.push({ handler: name, ok: false, processed: 0,
          errors: [error instanceof Error ? error.message : String(error)], durationMs: 0 });
      }
    }
    const skipped = selected.filter(handler => !handler.shouldRun).map(handler => handler.name);
    const totalDurationMs = Date.now() - start;
    const db = getFirebaseAdminDb();
    await db?.collection('cronRuns').add({
      runAt: now.toISOString(), utcHour, cronMode, handlers: results, skipped, totalDurationMs,
    });
    return NextResponse.json({
      message: 'Cron dispatch complete', cronMode, utcHour, totalDurationMs, executed: results, skipped,
    }, { status: results.every(result => result.ok) ? 200 : 500 });
  } catch (error) {
    console.error('[Cron Dispatch] Failed', error);
    return NextResponse.json({ error: 'Cron dispatch failed' }, { status: 500 });
  } finally {
    await release?.().catch(error => console.error('[Cron Dispatch] Lease release failed', error));
  }
}
