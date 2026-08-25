import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { runEventReminders } from '@/lib/cron/event-reminders';

import { authorizeCronRequest } from '@/lib/cron/auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const auth = authorizeCronRequest(req);
  if (!auth.ok) {
    return new NextResponse(auth.message, { status: auth.status });
  }

  const result = await runEventReminders();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
