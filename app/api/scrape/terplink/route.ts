import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getServerCurrentUser } from '@/lib/auth-server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { isAdminUid } from '@/lib/admin-auth';
import { importTerpLinkEvents, TerpLinkImportError } from '@/lib/terplink-import';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// A run processes at most 100 listings with four workers and 20 geocoding calls.
export const maxDuration = 60;

// The caller-supplied `apiUrl` was removed. `z.string().url()` accepts any
// scheme and any host, and the value reached fetch() below — an open
// server-side request proxy, reachable by any signed-in user. The TerpLink
// endpoint is a constant, so there is nothing for a caller to configure.
const scrapeInputSchema = z.object({}).strict();

export async function POST(req: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Imports use billed geocoding and are restricted to administrators.
    if (!isAdminUid(user.uid)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Scraping fans out to the TerpLink API and a full Firestore batch write,
    // so gate it before any of that work starts.
    const limitCheck = await checkRateLimit(user.uid, 'scrape_terplink', 5, 3600000, getClientIp(req)); // 5 per hour
    if (!limitCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limitCheck.retryAfterSeconds) } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const validation = scrapeInputSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'This endpoint takes no parameters' }, { status: 400 });
    }

    return NextResponse.json(await importTerpLinkEvents());
  } catch (error) {
    console.error('TerpLink scraper error:', error);
    return NextResponse.json(
      { error: error instanceof TerpLinkImportError ? error.message : 'Scrape failed' },
      { status: error instanceof TerpLinkImportError ? error.status : 500 },
    );
  }
}
