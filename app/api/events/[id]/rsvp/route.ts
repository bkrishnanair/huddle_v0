export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"
import { z } from "zod"
import { FieldValue } from "firebase-admin/firestore"

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
            const nextUser = newWaitlist.shift()
            newPlayers.push(nextUser)

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
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update RSVP status" }, { status: 500 })
  }
}
