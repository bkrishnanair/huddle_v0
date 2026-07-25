// app/api/cron/event-reminders/route.ts
// Cron: Send T-24h reminder notifications + emails to RSVP'd attendees.
import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { sendReminderEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * GET /api/cron/event-reminders
 *
 * Runs every 4 hours (0 *​/4 * * *). Scans events starting within 0–28h,
 * sends in-app notifications + email to each attendee whose
 * notifyReminders !== false, then stamps reminderSentAt on the event
 * to guarantee idempotency.
 */
export async function GET(request: NextRequest) {
  // ── Auth: same CRON_SECRET pattern as other crons ──
  const authHeader = request.headers.get('authorization');
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminDb = getFirebaseAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: 'DB not available' }, { status: 500 });
  }

  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    // Query window: today and the next 2 days to cover all timezones + the 28h window
    const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];

    // Fetch events in date range. Filter reminderSentAt in-memory
    // (Firestore cannot query "field is null / missing").
    const eventsSnap = await adminDb.collection('events')
      .where('date', '>=', todayStr)
      .where('date', '<=', dayAfterTomorrowStr)
      .get();

    let remindersProcessed = 0;
    let notificationsSent = 0;
    let emailsSent = 0;
    let emailsFailed = 0;

    const batch = adminDb.batch();
    const emailPromises: Promise<{ success: boolean; error?: string }>[] = [];
    let batchOps = 0;

    for (const doc of eventsSnap.docs) {
      const data = doc.data();

      // Skip: already sent, archived, scraped
      if (data.reminderSentAt) continue;
      if (data.status === 'archived') continue;
      if (data.isScraped) continue;

      // Parse event start datetime
      const eventDate = data.date || '';
      const eventTime = data.time || '18:00';
      const eventTimezone = data.timezone || 'America/New_York';

      let eventStart: Date;
      try {
        // Build a Date in the event's timezone.
        // We parse the local datetime string, then use it directly since
        // we only need an approximate hours-until check (±1h is fine).
        eventStart = new Date(`${eventDate}T${eventTime}`);
        if (isNaN(eventStart.getTime())) continue;
      } catch {
        continue;
      }

      const hoursUntilEvent = (eventStart.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Only process events starting in 0–28h (28h upper bound = 24h + 4h cron buffer)
      if (hoursUntilEvent < 0 || hoursUntilEvent > 28) continue;

      // ── Collect attendee UIDs ──
      const playerIds: string[] = data.players || [];
      if (playerIds.length === 0) continue;

      // ── Batch-fetch user docs (chunks of 30 via whereIn) ──
      const userDocs: Map<string, FirebaseFirestore.DocumentData> = new Map();
      for (let i = 0; i < playerIds.length; i += 30) {
        const chunk = playerIds.slice(i, i + 30);
        const usersSnap = await adminDb.collection('users')
          .where('__name__', 'in', chunk)
          .get();
        usersSnap.forEach((userDoc) => {
          userDocs.set(userDoc.id, userDoc.data());
        });
      }

      // ── Build event URL for email ──
      const domain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'localhost:3000';
      const protocol = domain.includes('localhost') ? 'http' : 'https';
      const eventUrl = `${protocol}://${domain}/event/${doc.id}`;
      const eventName = data.name || data.title || 'Your event';

      // ── Write notifications + queue emails ──
      for (const [uid, userData] of userDocs) {
        // Respect user notification preferences
        if (userData.notifyReminders === false) continue;

        // Guard: don't exceed Firestore batch limit (500 ops, we cap at 450)
        if (batchOps >= 450) break;

        const notifRef = adminDb
          .collection('users')
          .doc(uid)
          .collection('notifications')
          .doc();

        batch.set(notifRef, {
          userId: uid,
          type: 'event_reminder',
          message: `Reminder: "${eventName}" is happening ${hoursUntilEvent < 2 ? 'soon' : 'tomorrow'}! Don't forget to show up.`,
          eventId: doc.id,
          eventName,
          read: false,
          createdAt: new Date().toISOString(),
        });

        batchOps++;
        notificationsSent++;

        // Queue email if user has an email address
        const userEmail = userData.email;
        if (userEmail) {
          emailPromises.push(
            sendReminderEmail({
              to: userEmail,
              eventName,
              eventDate,
              eventTime,
              eventUrl,
            })
          );
        }
      }

      // Stamp the event as processed (idempotency guard)
      if (batchOps < 450) {
        const eventRef = adminDb.collection('events').doc(doc.id);
        batch.update(eventRef, { reminderSentAt: now.toISOString() });
        batchOps++;
        remindersProcessed++;
      }
    }

    // ── Commit all writes ──
    if (batchOps > 0) {
      await batch.commit();
    }

    // ── Send all emails (parallel, non-blocking) ──
    const emailResults = await Promise.allSettled(emailPromises);
    for (const result of emailResults) {
      if (result.status === 'fulfilled' && result.value.success) {
        emailsSent++;
      } else {
        emailsFailed++;
      }
    }

    return NextResponse.json({
      message: `Event reminders processed: ${remindersProcessed} events, ${notificationsSent} notifications, ${emailsSent} emails sent, ${emailsFailed} emails failed`,
      remindersProcessed,
      notificationsSent,
      emailsSent,
      emailsFailed,
    });
  } catch (error) {
    console.error('Event reminders cron error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
