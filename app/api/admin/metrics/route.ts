import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { getServerCurrentUser } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

// Allowed admin UIDs — add your UIDs here
const ADMIN_UIDS = new Set([
  // Add admin UIDs to this set
  process.env.ADMIN_UID || '',
]);

export async function GET(req: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    if (!user || !ADMIN_UIDS.has(user.uid)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminDb = getFirebaseAdminDb();
    if (!adminDb) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    // Fetch aggregate metrics
    const [eventsSnap, usersSnap, archivedSnap, scrapedSnap] = await Promise.all([
      adminDb.collection('events').get(),
      adminDb.collection('users').get(),
      adminDb.collection('events').where('status', '==', 'archived').get(),
      adminDb.collection('events').where('isScraped', '==', true).get(),
    ]);

    // Calculate metrics
    let totalViews = 0;
    let totalRSVPs = 0;
    let liveCount = 0;
    const categoryCounts: Record<string, number> = {};

    const now = new Date();

    eventsSnap.forEach((doc) => {
      const data = doc.data();
      totalViews += data.viewCount || 0;
      totalRSVPs += data.currentPlayers || 0;

      // Category distribution
      const cat = data.category || data.sport || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      // Live check
      if (data.date && data.time) {
        try {
          const start = new Date(`${data.date}T${data.time}`);
          if (isNaN(start.getTime())) return;
          const end = data.endTime
            ? new Date(`${data.date}T${data.endTime}`)
            : new Date(start.getTime() + 3 * 60 * 60 * 1000);
          if (now >= start && now <= end) liveCount++;
        } catch { }
      }
    });

    // Sort category distribution
    const categoryDistribution = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    return NextResponse.json({
      metrics: {
        totalEvents: eventsSnap.size,
        totalUsers: usersSnap.size,
        totalViews,
        totalRSVPs,
        liveEvents: liveCount,
        archivedEvents: archivedSnap.size,
        scrapedEvents: scrapedSnap.size,
        categoryDistribution,
      }
    });
  } catch (error) {
    console.error('Admin metrics error:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
