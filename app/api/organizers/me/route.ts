import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getServerCurrentUser } from '@/lib/auth-server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { organizerSchema, publicOrganizer } from '@/lib/organizers';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET() {
  const user = await getServerCurrentUser();
  if (!user || user.firebase?.sign_in_provider === 'anonymous') return NextResponse.json({ error: 'Sign in first.' }, { status: 401 });
  const db = getFirebaseAdminDb();
  if (!db) return NextResponse.json({ error: 'Unavailable' }, { status: 503 });
  const snapshot = await db.collection('organizers').doc(user.uid).get();
  return NextResponse.json({ organizer: snapshot.exists ? publicOrganizer(user.uid, snapshot.data()!) : null }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    if (!user || user.firebase?.sign_in_provider === 'anonymous') return NextResponse.json({ error: 'Use a full account to manage an organizer page.' }, { status: 401 });
    const parsed = organizerSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    if (!(await checkRateLimit(user.uid, 'organizer_page', 20, 86400000)).success) return NextResponse.json({ error: 'Daily update limit reached.' }, { status: 429 });
    const db = getFirebaseAdminDb();
    if (!db) return NextResponse.json({ error: 'Unavailable' }, { status: 503 });
    const ref = db.collection('organizers').doc(user.uid);
    await db.runTransaction(async tx => {
      const old = (await tx.get(ref)).data();
      const identityChanged = !old || old.name !== parsed.data.name || old.website !== parsed.data.website || old.kind !== parsed.data.kind;
      tx.set(ref, { ...parsed.data, ownerId: user.uid,
        reviewStatus: identityChanged ? 'pending' : old?.reviewStatus || 'pending',
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Could not save your page. Try again.' }, { status: 503 }); }
}
