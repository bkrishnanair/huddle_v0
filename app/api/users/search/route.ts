import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { getServerCurrentUser } from '@/lib/auth-server';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const searchSchema = z.object({
  q: z.string().trim().min(2).max(100),
});

/**
 * GET /api/users/search?q=running+club
 * 
 * Bounded name-prefix lookup, with a legacy contains-match fallback.
 * Returns public profile fields only; no email or location search.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  const user = await getServerCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const limitCheck = await checkRateLimit(user.uid, 'user_search', 60); // 60 searches per hour
  if (!limitCheck.success) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
  }

  const validation = searchSchema.safeParse({ q });
  if (!validation.success) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
  }

  const adminDb = getFirebaseAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: 'DB not available' }, { status: 500 });
  }

  try {
    const search = validation.data.q;
    const queryLower = search.toLowerCase();
    // Existing displayName index needs no new field/backfill. Common case variants
    // reach profiles outside the legacy scan; this is not full-text search.
    const prefixes = [...new Set([search, queryLower,
      queryLower.replace(/(^|\s)\S/g, letter => letter.toUpperCase())])];
    const users = adminDb.collection('users');
    const [viewer, legacy, ...prefixResults] = await Promise.all([
      users.doc(user.uid).get(),
      users.limit(200).get(),
      ...prefixes.map(prefix => users.orderBy('displayName')
        .startAt(prefix).endAt(prefix + '\uf8ff').limit(10).get()),
    ]);
    const blocked = new Set<string>(viewer.data()?.blockedUsers || []);
    const candidates = new Map([...prefixResults.flatMap(snapshot => snapshot.docs), ...legacy.docs]
      .map(doc => [doc.id, doc]));

    const matches: any[] = [];
    for (const doc of candidates.values()) {
      const data = doc.data();
      if (doc.id === user.uid || blocked.has(doc.id) || data.blockedUsers?.includes(user.uid)) continue;
      const name = (data.displayName || data.name || '').toLowerCase();
      if (name.includes(queryLower)) {
        matches.push({
          uid: doc.id,
          displayName: data.displayName || data.name || 'Unknown',
          photoURL: data.photoURL || '',
          bio: data.bio || '',
        });
        if (matches.length >= 10) break;
      }
    }

    return NextResponse.json({ users: matches });
  } catch (error) {
    console.error('User search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
