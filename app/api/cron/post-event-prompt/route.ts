import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb, Timestamp } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/post-event-prompt
 * 
 * Runs hourly. Scans events that ended in the last 3 hours
 * where postEventPromptSent !== true. Sends the organizer
 * a notification prompting: "How many showed up?" + "Schedule again?"
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');

  if (cronSecret && secret !== cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminDb = getFirebaseAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: 'DB not available' }, { status: 500 });
  }

  try {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const todayStr = now.toISOString().split('T')[0];

    // Fetch events from today and yesterday (covers the 3-hour window)
    const yesterdayStr = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const eventsSnap = await adminDb.collection('events')
      .where('date', '>=', yesterdayStr)
      .where('date', '<=', todayStr)
      .get();

    let promptsSent = 0;
    const batch = adminDb.batch();

    for (const doc of eventsSnap.docs) {
      const data = doc.data();

      // Skip if already prompted
      if (data.postEventPromptSent) continue;

      // Skip scraped/archived events
      if (data.isScraped || data.status === 'archived') continue;

      // Check if event has ended
      const endTime = data.endTime || '';
      const startTime = data.time || '18:00';
      const eventDate = data.date || '';

      let eventEnd: Date;
      if (endTime) {
        eventEnd = new Date(`${eventDate}T${endTime}`);
      } else {
        // Default: 2 hours after start
        const start = new Date(`${eventDate}T${startTime}`);
        eventEnd = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      }

      // Event must have ended, but within the last 3 hours
      if (isNaN(eventEnd.getTime())) continue;
      if (eventEnd > now) continue; // hasn't ended yet
      if (eventEnd < threeHoursAgo) continue; // too old

      const organizerUid = data.createdBy;
      if (!organizerUid) continue;

      // Write notification to organizer
      const notifRef = adminDb
        .collection('users')
        .doc(organizerUid)
        .collection('notifications')
        .doc();

      batch.set(notifRef, {
        userId: organizerUid,
        type: 'post_event',
        message: `Your event "${data.name || data.title}" just ended! How many people showed up?`,
        eventId: doc.id,
        eventName: data.name || data.title || 'Your event',
        actions: ['report_attendance', 'clone_event'],
        read: false,
        createdAt: new Date().toISOString(),
      });

      // Mark event as prompted
      const eventRef = adminDb.collection('events').doc(doc.id);
      batch.update(eventRef, { postEventPromptSent: true });

      promptsSent++;
    }

    if (promptsSent > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      message: `Post-event prompts sent: ${promptsSent}`,
      promptsSent,
    });
  } catch (error) {
    console.error('Post-event prompt cron error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
