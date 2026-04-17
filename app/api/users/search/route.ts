import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const searchSchema = z.object({
  q: z.string().min(1).max(100),
});

/**
 * GET /api/users/search?q=running+club
 * 
 * Searches users by displayName prefix match (case-insensitive).
 * Returns up to 10 matching user profiles for the organizer search feature.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  const validation = searchSchema.safeParse({ q });
  if (!validation.success) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
  }

  const adminDb = getFirebaseAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: 'DB not available' }, { status: 500 });
  }

  try {
    const queryLower = validation.data.q.toLowerCase();

    // Firestore doesn't support case-insensitive search natively.
    // Use a range query on a lowercase displayName field if available,
    // otherwise fetch a batch and filter client-side.
    const usersSnap = await adminDb.collection('users')
      .limit(200) // Scan recent users
      .get();

    const matches: any[] = [];
    for (const doc of usersSnap.docs) {
      const data = doc.data();
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
