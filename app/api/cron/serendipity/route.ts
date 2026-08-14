import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { runSerendipity } from '@/lib/cron/serendipity';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
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

  const result = await runSerendipity();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
