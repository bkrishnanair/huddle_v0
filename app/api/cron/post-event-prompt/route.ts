import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { runPostEventPrompt } from '@/lib/cron/post-event-prompt';

import { authorizeCronRequest } from '@/lib/cron/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = authorizeCronRequest(req);
  if (!auth.ok) {
    return new NextResponse(auth.message, { status: auth.status });
  }

  const result = await runPostEventPrompt();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
