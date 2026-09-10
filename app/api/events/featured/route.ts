import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { getServerCurrentUser } from '@/lib/auth-server';
import { isEventLive } from '@/lib/utils';
import { pickPublicFields } from '@/lib/types';

export const dynamic = 'force-dynamic';

// Literal, not an expression — Next rejects MemberExpression and
// ConditionalExpression forms for this export (CLAUDE.md).
export const maxDuration = 30;

/**
 * Upper bound on documents read per request. Matches EVENT_QUERY_LIMIT in
 * lib/db.ts so the two event-reading paths behave alike.
 *
 * This route previously ran `collection('events').get()` — an unbounded scan of
 * every event on every load of /home, with `no-store`, so the cost grew as
 * events × pageviews with nothing to damp it.
 */
const FEATURED_QUERY_LIMIT = 500;

/**
 * GET /api/events/featured
 *
 * Returns curated event sections for the Home feed:
 * - happeningNow: events currently live
 * - popularThisWeek: highest RSVP count in next 7 days
 * - newOnHuddle: most recently created events
 * - categoryCounts: event counts per category for Browse grid
 * - serendipityPicks: per-user, derived from that user's nudge notifications
 *
 * Every event returned is projected through pickPublicFields(). The raw
 * documents carry attendee free text, check-in records, waitlist order and
 * unsent announcement drafts, none of which belong in a feed response.
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
    // Lower bound is yesterday, not today: an event that began late last night
    // and runs past midnight is still live now, and isEventLive() must see it.
    const yesterdayStr = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // Bounded: a range filter and an order on the same field need only the
    // single-field index Firestore maintains automatically, so this adds no
    // composite index. Earliest-first is the right slice for "live" and "this
    // week"; the trade-off is that a newly created event dated far in the
    // future can fall outside the window and miss "new on Huddle".
    const eventsSnap = await adminDb
      .collection('events')
      .where('date', '>=', yesterdayStr)
      .orderBy('date', 'asc')
      .limit(FEATURED_QUERY_LIMIT)
      .get();

    const allEvents: any[] = [];
    eventsSnap.docs.forEach(doc => {
      const data = doc.data();
      // Kept as a post-filter deliberately. `where('isPrivate','==',false)`
      // would match only documents that carry the field explicitly and would
      // silently drop every event where it is absent.
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
      happeningNow: happeningNow.map(pickPublicFields),
      popularThisWeek: thisWeekEvents.map(pickPublicFields),
      newOnHuddle: newEvents.map(pickPublicFields),
      categoryCounts,
      serendipityPicks: serendipityPicks.map(pickPublicFields),
    }, {
      headers: {
        // `private`, not `s-maxage`. serendipityPicks is derived from the
        // signed-in user's own notifications, so a shared CDN entry would serve
        // one student's recommendations to the next caller. Browser-only
        // caching still removes the repeat-load cost this route was paying.
        'Cache-Control': 'private, max-age=60',
      },
    });
  } catch (error) {
    console.error('Featured events error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured events' }, { status: 500 });
  }
}
