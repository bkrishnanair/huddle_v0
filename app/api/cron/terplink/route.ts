import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { authorizeCronRequest } from '@/lib/cron/auth';
import { importTerpLinkEvents, TerpLinkImportError } from '@/lib/terplink-import';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const auth = authorizeCronRequest(request);
  if (!auth.ok) return new NextResponse(auth.message, { status: auth.status });
  try {
    const result = await importTerpLinkEvents();
    return NextResponse.json(result, { status: result.failed || result.deferred ? 503 : 200 });
  } catch (error) {
    if (error instanceof TerpLinkImportError && error.status === 409) {
      return NextResponse.json({ skipped: true, reason: 'Already running' });
    }
    console.error('[TerpLink Cron] Import failed', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 502 });
  }
}
