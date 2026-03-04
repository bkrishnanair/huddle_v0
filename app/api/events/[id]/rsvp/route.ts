export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"
import { z } from "zod"
import { FieldValue } from "firebase-admin/firestore"

// Helper function to fan-out notifications in the background using Serendipity Logic
async function notifyFollowersOfJoin(userId: string, eventId: string, eventName: string, eventCategory: string, eventGeopoint: any) {
  try {
    const adminDb = getFirebaseAdminDb()
    if (!adminDb) return;

    // Get the user's details for the notification string (e.g. "Bobby just joined...")
    const userDoc = await adminDb.collection("users").doc(userId).get()
    const userName = userDoc.exists ? (userDoc.data()?.displayName || userDoc.data()?.name || "A friend") : "A friend"

    // Fetch followers
    const followersRef = adminDb.collection("users").doc(userId).collection("followers")
    const followersSnap = await followersRef.get()

    if (followersSnap.empty) return

    const followerIds = followersSnap.docs.map(doc => doc.id)

    // Chunk array by 500 (Firestore batch limit)
    const chunkSize = 500;
    const { Timestamp } = await import("firebase-admin/firestore");
    const geofire = await import("geofire-common");

    for (let i = 0; i < followerIds.length; i += chunkSize) {
      const chunk = followerIds.slice(i, i + chunkSize);
      const batch = adminDb.batch();

      // Fetch follower profiles to apply Serendipity filters (Location & Interests)
      const followerSnaps = await adminDb.collection("users").where("__name__", "in", chunk).get();

      followerSnaps.docs.forEach(doc => {
        const followerData = doc.data();
        const followerId = doc.id;

        // Serendipity Filter 1: Interest Match
        // If they have no interests set, we assume they want to know everything their friends do.
        // Otherwise, it must match the event category.
        const interests: string[] = followerData.favoriteSports || [];
        const matchesInterest = interests.length === 0 || interests.includes(eventCategory);

        if (!matchesInterest) return;

        // Serendipity Filter 2: Location Match (under 25 miles)
        // If event has no physical location (virtual) OR follower hasn't opened map yet, we default to sending.
        let isNearby = true;
        if (eventGeopoint && followerData.lastKnownLocation) {
          const followerLat = followerData.lastKnownLocation.latitude || followerData.lastKnownLocation._latitude;
          const followerLng = followerData.lastKnownLocation.longitude || followerData.lastKnownLocation._longitude;
          const eventLat = eventGeopoint.latitude || eventGeopoint._latitude;
          const eventLng = eventGeopoint.longitude || eventGeopoint._longitude;

          if (followerLat && followerLng && eventLat && eventLng) {
            const distanceInKm = geofire.distanceBetween([followerLat, followerLng], [eventLat, eventLng]);
            const distanceInMiles = distanceInKm * 0.621371;
            isNearby = distanceInMiles <= 25;
          }
        }

        if (!isNearby) return;

        // Passed filters! Write notification.
        const notificationRef = adminDb.collection("users").doc(followerId).collection("notifications").doc();
        batch.set(notificationRef, {
          userId: followerId,
          type: "friend_attending",
          message: `🔥 ${userName} is playing ${eventCategory} near you! Join them?`,
          eventId: eventId,
          read: false,
          createdAt: Timestamp.now().toDate().toISOString()
        });
      });

      await batch.commit();
    }
  } catch (error) {
    console.error("Failed to notify followers:", error);
  }
}

const rsvpSchema = z.object({
  action: z.enum(["join", "leave", "remove"]),
  note: z.string().optional(),
  targetUserId: z.string().optional(),
  answers: z.record(z.string()).optional(),
  pickupPointId: z.string().optional(),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getServerCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = rsvpSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
    }

    const { action, note, targetUserId, answers, pickupPointId } = validationResult.data

    if (action === "remove" && !targetUserId) {
      return NextResponse.json({ error: "targetUserId is required for remove action" }, { status: 400 })
    }

    const adminDb = getFirebaseAdminDb()
    if (!adminDb) {
      return NextResponse.json({ error: "Firebase admin DB not found" }, { status: 500 })
    }

    const eventRef = adminDb.collection("events").doc(id)
    let updatedEventData: any;
    let joinedPlayers = false; // to determine if we should issue achievement

    await adminDb.runTransaction(async (transaction) => {
      const eventDoc = await transaction.get(eventRef)

      if (!eventDoc.exists) {
        throw new Error("EVENT_NOT_FOUND")
      }

      const eventData = eventDoc.data() as any
      const players = eventData.players || []
      const waitlist = eventData.waitlist || []
      const attendeeNotes = eventData.attendeeNotes || {}
      const maxPlayers = eventData.maxPlayers || 0

      const attendeeAnswers = eventData.attendeeAnswers || {}
      const attendeePickup = eventData.attendeePickup || {}

      if (action === "join") {
        if (players.includes(user.uid) || waitlist.includes(user.uid)) {
          throw new Error("ALREADY_JOINED")
        }

        // Check if user is blocked by the organizer
        const organizerId = eventData.createdBy;
        if (organizerId) {
          const organizerDoc = await transaction.get(adminDb.collection("users").doc(organizerId));
          if (organizerDoc.exists) {
            const organizerData = organizerDoc.data();
            if (organizerData?.blockedUsers?.includes(user.uid)) {
              throw new Error("UNAUTHORIZED_BLOCK");
            }
          }
        }

        // Process Note if provided
        const newAttendeeNotes = { ...attendeeNotes };
        if (note && note.trim().length > 0) {
          newAttendeeNotes[user.uid] = note.trim();
        }

        const newAttendeeAnswers = { ...attendeeAnswers };
        if (answers && Object.keys(answers).length > 0) {
          newAttendeeAnswers[user.uid] = answers;
        }

        const newAttendeePickup = { ...attendeePickup };
        if (pickupPointId) {
          newAttendeePickup[user.uid] = pickupPointId;
        }

        if (players.length >= maxPlayers) {
          // Join waitlist
          transaction.update(eventRef, {
            waitlist: FieldValue.arrayUnion(user.uid),
            attendeeNotes: newAttendeeNotes,
            attendeeAnswers: newAttendeeAnswers,
            attendeePickup: newAttendeePickup
          })
          updatedEventData = { ...eventData, waitlist: [...waitlist, user.uid], attendeeNotes: newAttendeeNotes, attendeeAnswers: newAttendeeAnswers, attendeePickup: newAttendeePickup }
        } else {
          // Join players
          transaction.update(eventRef, {
            players: FieldValue.arrayUnion(user.uid),
            currentPlayers: players.length + 1,
            attendeeNotes: newAttendeeNotes,
            attendeeAnswers: newAttendeeAnswers,
            attendeePickup: newAttendeePickup
          })
          updatedEventData = { ...eventData, players: [...players, user.uid], currentPlayers: players.length + 1, attendeeNotes: newAttendeeNotes, attendeeAnswers: newAttendeeAnswers, attendeePickup: newAttendeePickup }
          joinedPlayers = true;
        }
      } else if (action === "leave" || action === "remove") {
        const actingUserId = action === "remove" ? targetUserId! : user.uid;

        if (action === "remove" && eventData.createdBy !== user.uid) {
          throw new Error("UNAUTHORIZED_REMOVE");
        }

        if (!players.includes(actingUserId) && !waitlist.includes(actingUserId)) {
          throw new Error("NOT_JOINED")
        }

        const newAttendeeNotes = { ...attendeeNotes };
        delete newAttendeeNotes[actingUserId];
        const newAttendeeAnswers = { ...attendeeAnswers };
        delete newAttendeeAnswers[actingUserId];
        const newAttendeePickup = { ...attendeePickup };
        delete newAttendeePickup[actingUserId];

        if (waitlist.includes(actingUserId)) {
          // Leave waitlist
          transaction.update(eventRef, {
            waitlist: FieldValue.arrayRemove(actingUserId),
            attendeeNotes: newAttendeeNotes,
            attendeeAnswers: newAttendeeAnswers,
            attendeePickup: newAttendeePickup
          })
          updatedEventData = { ...eventData, waitlist: waitlist.filter((uid: string) => uid !== actingUserId), attendeeNotes: newAttendeeNotes, attendeeAnswers: newAttendeeAnswers, attendeePickup: newAttendeePickup }
        } else if (players.includes(actingUserId)) {
          // Leave players
          const newPlayers = players.filter((uid: string) => uid !== actingUserId)
          let newWaitlist = [...waitlist]

          if (newWaitlist.length > 0) {
            // Pop the first user from waitlist and push to players
            const promotedUserId = newWaitlist.shift()

            if (promotedUserId) {
              newPlayers.push(promotedUserId)

              // Emit notification for waitlist promotion
              try {
                const { createNotification } = await import("@/lib/db")
                await createNotification({
                  userId: promotedUserId,
                  type: "waitlist_promo",
                  message: `You've been promoted from the waitlist for "${eventData.title || eventData.name}"!`,
                  eventId: id
                })
              } catch (e) {
                console.error("Failed to emit waitlist promo notification", e)
              }
            }

            // Overwrite arrays because we are doing both remove and push on different lists
            transaction.update(eventRef, {
              players: newPlayers,
              waitlist: newWaitlist,
              attendeeNotes: newAttendeeNotes,
              attendeeAnswers: newAttendeeAnswers,
              attendeePickup: newAttendeePickup
              // currentPlayers remains the same since we swapped one for one
            })
            updatedEventData = { ...eventData, players: newPlayers, waitlist: newWaitlist, attendeeNotes: newAttendeeNotes, attendeeAnswers: newAttendeeAnswers, attendeePickup: newAttendeePickup }
          } else {
            // Just normal leave
            transaction.update(eventRef, {
              players: FieldValue.arrayRemove(actingUserId),
              currentPlayers: newPlayers.length,
              attendeeNotes: newAttendeeNotes,
              attendeeAnswers: newAttendeeAnswers,
              attendeePickup: newAttendeePickup
            })
            updatedEventData = { ...eventData, players: newPlayers, currentPlayers: newPlayers.length, attendeeNotes: newAttendeeNotes, attendeeAnswers: newAttendeeAnswers, attendeePickup: newAttendeePickup }
          }
        }
      }
    })

    // Gamification: Check for first game achievement (only if joined players list, not waitlist)
    if (joinedPlayers && updatedEventData) {
      try {
        const userEventsQuery = await adminDb.collection("events").where("players", "array-contains", user.uid).get()
        if (userEventsQuery.size === 1) { // 1 because they just joined
          const userRef = adminDb.collection("users").doc(user.uid)
          await userRef.update({
            badges: FieldValue.arrayUnion("first_game"),
          })
        }
      } catch (e) {
        console.error("Failed to assign badge", e);
      }

      // Fire-and-forget fan-out to followers (Serendipity Engine)
      const eventName = updatedEventData.title || updatedEventData.name || "an event"
      const eventCategory = updatedEventData.category || updatedEventData.sport || "None"
      const eventGeopoint = updatedEventData.geopoint || null
      notifyFollowersOfJoin(user.uid, id, eventName, eventCategory, eventGeopoint).catch(console.error)
    }

    return NextResponse.json({ event: { id, ...updatedEventData } })
  } catch (error: any) {
    console.error("RSVP error:", error)
    if (error.message === "EVENT_NOT_FOUND") {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    } else if (error.message === "ALREADY_JOINED") {
      return NextResponse.json({ error: "You have already joined or waitlisted for this event" }, { status: 400 })
    } else if (error.message === "NOT_JOINED") {
      return NextResponse.json({ error: "You are not currently joined to this event" }, { status: 400 })
    } else if (error.message === "UNAUTHORIZED_BLOCK") {
      return NextResponse.json({ error: "You are not permitted to join this event." }, { status: 403 })
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update RSVP status" }, { status: 500 })
  }
}
