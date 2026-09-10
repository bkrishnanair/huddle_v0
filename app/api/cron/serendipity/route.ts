import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { runSerendipity } from '@/lib/cron/serendipity';

import { authorizeCronRequest } from '@/lib/cron/auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const auth = authorizeCronRequest(req);
  if (!auth.ok) {
    return new NextResponse(auth.message, { status: auth.status });
  }

  const result = await runSerendipity();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
