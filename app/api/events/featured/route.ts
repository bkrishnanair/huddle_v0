import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { getServerCurrentUser } from '@/lib/auth-server';
import { isEventLive } from '@/lib/utils';

export const dynamic = 'force-dynamic';

/**
 * GET /api/events/featured
 * 
 * Returns curated event sections for the Home feed:
 * - happeningNow: events currently live
 * - popularThisWeek: highest RSVP count in next 7 days
 * - newOnHuddle: most recently created events
 * - categoryCounts: event counts per category for Browse grid
 */
export async function GET(request: NextRequest) {
  const adminDb = getFirebaseAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: 'DB not available' }, { status: 500 });
  }

  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekStr = weekFromNow.toISOString().split('T')[0];

    // Fetch all active, non-private events
    const eventsSnap = await adminDb.collection('events').get();
    const allEvents: any[] = [];

    eventsSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.isPrivate || data.status === 'archived') return;
      allEvents.push({ id: doc.id, ...data });
    });

    // --- HAPPENING NOW ---
    // Uses the canonical isEventLive() from lib/utils to guarantee 
    // count consistency with the Map's "Live" filter chip.
    const happeningNow = allEvents.filter(e => isEventLive(e)).slice(0, 10);

    // --- POPULAR THIS WEEK ---
    const thisWeekEvents = allEvents
      .filter(e => e.date >= todayStr && e.date <= weekStr && e.status !== 'past')
      .sort((a, b) => (b.currentPlayers || 0) - (a.currentPlayers || 0))
      .slice(0, 12);

    // --- NEW ON HUDDLE ---
    const newEvents = [...allEvents]
      .filter(e => e.date >= todayStr)
      .sort((a, b) => {
        const aTime = a.createdAt?._seconds || a.createdAt?.seconds || 0;
        const bTime = b.createdAt?._seconds || b.createdAt?.seconds || 0;
        return bTime - aTime;
      })
      .slice(0, 10);

    // --- CATEGORY COUNTS ---
    const catMap = new Map<string, number>();
    allEvents
      .filter(e => e.date >= todayStr) // only future events
      .forEach(e => {
        const cat = e.category || e.sport || 'Community';
        catMap.set(cat, (catMap.get(cat) || 0) + 1);
      });

    const categoryCounts = Array.from(catMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // --- SERENDIPITY PICKS ---
    let serendipityPicks: any[] = [];
    const user = await getServerCurrentUser();
    if (user) {
      try {
        const notifsSnap = await adminDb.collection('users').doc(user.uid)
          .collection('notifications')
          .where('type', '==', 'serendipity_nudge')
          .get();

        const pickEventIds = new Set<string>();
        notifsSnap.docs.forEach(doc => {
          const d = doc.data();
          if (d.eventId) pickEventIds.add(d.eventId);
        });

        serendipityPicks = allEvents.filter(e => pickEventIds.has(e.id) && e.date >= todayStr);
      } catch (e) {
        console.error('Error fetching serendipity picks:', e);
      }
    }

    return NextResponse.json({
      happeningNow,
      popularThisWeek: thisWeekEvents,
      newOnHuddle: newEvents,
      categoryCounts,
      serendipityPicks,
    }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    console.error('Featured events error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured events' }, { status: 500 });
  }
}
