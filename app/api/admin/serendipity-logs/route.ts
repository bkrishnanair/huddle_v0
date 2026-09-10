import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getServerCurrentUser } from '@/lib/auth-server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { isAdminUid } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/serendipity-logs
 * 
 * Returns the most recent serendipity agent run logs (up to 20)
 * for the admin dashboard Activity Log visualization.
 * Gated by ADMIN_UID environment variable.
 */
export async function GET(request: NextRequest) {
  const user = await getServerCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fails closed. This previously read `if (adminUid && user.uid !== adminUid)`,
  // so an unset ADMIN_UID skipped the guard entirely and served these logs —
  // which name individual students and quote the notifications sent to them —
  // to any signed-in caller.
  if (!isAdminUid(user.uid)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const adminDb = getFirebaseAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: 'DB not available' }, { status: 500 });
  }

  try {
    const logsSnap = await adminDb.collection('serendipityLogs')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    const logs = logsSnap.docs.map(doc => doc.data());

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Failed to fetch serendipity logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
