import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Gate with Vercel cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const adminDb = getFirebaseAdminDb();
    if (!adminDb) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    // Mark events older than 48 hours as archived
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 48);
    const cutoffStr = cutoff.toISOString().split('T')[0]; // YYYY-MM-DD

    const staleSnap = await adminDb
      .collection('events')
      .where('date', '<', cutoffStr)
      .where('status', '!=', 'archived')
      .limit(100)
      .get();

    if (staleSnap.empty) {
      return NextResponse.json({ archived: 0, message: 'No stale events found' });
    }

    const batch = adminDb.batch();
    staleSnap.forEach((doc) => {
      batch.update(doc.ref, { status: 'archived' });
    });
    await batch.commit();

    return NextResponse.json({
      archived: staleSnap.size,
      message: `Archived ${staleSnap.size} stale events`,
    });
  } catch (error) {
    console.error('Cleanup cron error:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
