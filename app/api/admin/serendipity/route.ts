import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getServerCurrentUser } from '@/lib/auth-server';
import { isAdminUid } from '@/lib/admin-auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { runSerendipity } from '@/lib/cron/serendipity';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// No request body: the verified admin identity authorizes this fixed action.
export async function POST(request: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    if (!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    if (!isAdminUid(user.uid)) return NextResponse.json({error: 'Forbidden'}, {status: 403});
    const limit = await checkRateLimit(user.uid, 'admin_serendipity', 3, 60_000, getClientIp(request));
    if (!limit.success) return NextResponse.json({error: 'Please wait before running again'}, {
      status: 429, headers: {'Retry-After': String(limit.retryAfterSeconds)},
    });
    const result = await runSerendipity();
    return NextResponse.json(result, {status: result.ok ? 200 : 500});
  } catch (error) {
    console.error('Admin serendipity run failed', error);
    return NextResponse.json({error: 'Agent run failed'}, {status: 500});
  }
}
