import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getServerCurrentUser } from '@/lib/auth-server';
import { getFirebaseAdminDb, Timestamp } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const claimSchema = z.object({
  scrapedEventId: z.string().min(1),
  // Optional organizer edits applied during claim
  updates: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    maxPlayers: z.number().optional(),
    category: z.string().optional(),
  }).optional(),
});

/**
 * POST /api/events/claim
 *
 * Lets an authenticated user "claim" a scraped TerpLink event.
 *
 * ARCHITECTURE DECISION: We update the document IN PLACE rather than creating
 * a new document. This preserves EVERYTHING:
 *   - players[] (existing RSVPs)
 *   - guestRsvps
 *   - attendeeAnswers, attendeeNotes, attendeePickup
 *   - checkedInPlayers, checkIns
 *   - viewCount, reportedAttendance
 *   - pinnedMessage, lastAnnouncementAt
 *   - scheduledMessages
 *   - currentPlayers count
 *   - chat subcollection (stays attached to same doc ID)
 *
 * Only ownership fields are changed: createdBy, organizerName, source, admins.
 * Existing attendees are notified of the ownership transfer.
 */
export async function POST(request: NextRequest) {
  const user = await getServerCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();
  const validation = claimSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const { scrapedEventId, updates } = validation.data;
  const adminDb = getFirebaseAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: 'DB not available' }, { status: 500 });
  }

  try {
    // Get organizer info
    const userDoc = await adminDb.collection('users').doc(user.uid).get();
    const userData = userDoc.data() || {};
    const organizerName = userData.displayName || userData.name || user.email?.split('@')[0] || 'Organizer';

    let claimedEventData: any = null;

    await adminDb.runTransaction(async (tx) => {
      const scrapedRef = adminDb.collection('events').doc(scrapedEventId);
      const scrapedSnap = await tx.get(scrapedRef);

      if (!scrapedSnap.exists) {
        throw new Error('EVENT_NOT_FOUND');
      }

      const scrapedData = scrapedSnap.data()!;

      // Only scraped events can be claimed
      if (scrapedData.source !== 'terplink' && scrapedData.source !== 'umd-calendar' && scrapedData.isScraped !== true) {
        throw new Error('NOT_SCRAPED');
      }

      // Can't claim an already-claimed event
      if (scrapedData.source === 'claimed') {
        throw new Error('ALREADY_CLAIMED');
      }

      // --- Build the ownership update (IN PLACE — preserves all attendee data) ---
      const ownershipUpdate: Record<string, any> = {
        // Transfer ownership
        createdBy: user.uid,
        organizerName,
        organizerPhotoURL: userData.photoURL || '',
        admins: [user.uid],

        // Mark as claimed
        source: 'claimed',
        claimedFrom: scrapedEventId, // self-reference for audit trail
        claimedAt: FieldValue.serverTimestamp(),
        isScraped: false,

        // Keep active
        status: 'active',
      };

      // Apply optional organizer edits (title, description, capacity, category)
      if (updates?.name) {
        ownershipUpdate.name = updates.name;
        ownershipUpdate.title = updates.name;
      }
      if (updates?.description) ownershipUpdate.description = updates.description;
      if (updates?.maxPlayers) ownershipUpdate.maxPlayers = updates.maxPlayers;
      if (updates?.category) {
        ownershipUpdate.category = updates.category;
        ownershipUpdate.sport = updates.category;
      }

      // Add the organizer to the players array if not already present
      const existingPlayers: string[] = scrapedData.players || [];
      if (!existingPlayers.includes(user.uid)) {
        ownershipUpdate.players = FieldValue.arrayUnion(user.uid);
        ownershipUpdate.currentPlayers = FieldValue.increment(1);
      }

      // Perform the IN-PLACE update — preserves ALL other fields:
      // players[], guestRsvps, attendeeAnswers, attendeeNotes, attendeePickup,
      // checkedInPlayers, checkIns, viewCount, reportedAttendance,
      // pinnedMessage, lastAnnouncementAt, scheduledMessages, tags,
      // questions, pickupPoints, stayUntil, transitTips, etc.
      tx.update(scrapedRef, ownershipUpdate);

      // --- Notify existing attendees about the ownership transfer ---
      const allAttendeeUids = new Set<string>([
        ...existingPlayers,
        ...Object.keys(scrapedData.guestRsvps || {}),
      ]);
      // Don't notify the new organizer themselves
      allAttendeeUids.delete(user.uid);

      for (const attendeeUid of allAttendeeUids) {
        const notifRef = adminDb
          .collection('users').doc(attendeeUid)
          .collection('notifications').doc();
        tx.set(notifRef, {
          type: 'event_update',
          eventId: scrapedEventId,
          eventName: scrapedData.name || scrapedData.title || 'Event',
          message: `${scrapedData.name || 'An event'} is now officially managed by ${organizerName}. Your RSVP is preserved.`,
          read: false,
          createdAt: Timestamp.now(),
        });
      }

      // Build response data (merge original data with ownership updates for the response)
      claimedEventData = {
        id: scrapedEventId,
        ...scrapedData,
        ...ownershipUpdate,
        // FieldValue sentinels don't serialize — resolve them manually
        players: existingPlayers.includes(user.uid)
          ? existingPlayers
          : [...existingPlayers, user.uid],
        currentPlayers: existingPlayers.includes(user.uid)
          ? (scrapedData.currentPlayers || existingPlayers.length)
          : (scrapedData.currentPlayers || existingPlayers.length) + 1,
        claimedAt: new Date().toISOString(),
      };
    });

    const isNewOrganizer = !userData.onboardingComplete;

    return NextResponse.json({
      message: 'Event claimed successfully! You now own and manage this event. All existing RSVPs have been preserved.',
      eventId: scrapedEventId, // Same ID — no duplicate created
      event: claimedEventData,
      isNewOrganizer,
    });
  } catch (error: any) {
    if (error?.message === 'EVENT_NOT_FOUND') {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    if (error?.message === 'NOT_SCRAPED') {
      return NextResponse.json({ error: 'Only scraped events can be claimed' }, { status: 400 });
    }
    if (error?.message === 'ALREADY_CLAIMED') {
      return NextResponse.json({ error: 'This event has already been claimed' }, { status: 409 });
    }
    console.error('Claim event error:', error);
    return NextResponse.json({ error: 'Failed to claim event' }, { status: 500 });
  }
}
