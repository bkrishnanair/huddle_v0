export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"
import { z } from "zod"
import { FieldValue } from "firebase-admin/firestore"

const rsvpSchema = z.object({
  action: z.enum(["join", "leave"]),
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

    const { action } = validationResult.data

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
      const maxPlayers = eventData.maxPlayers || 0

      if (action === "join") {
        if (players.includes(user.uid) || waitlist.includes(user.uid)) {
          throw new Error("ALREADY_JOINED")
        }

        if (players.length >= maxPlayers) {
          // Join waitlist
          transaction.update(eventRef, {
            waitlist: FieldValue.arrayUnion(user.uid)
          })
          updatedEventData = { ...eventData, waitlist: [...waitlist, user.uid] }
        } else {
          // Join players
          transaction.update(eventRef, {
            players: FieldValue.arrayUnion(user.uid),
            currentPlayers: players.length + 1
          })
          updatedEventData = { ...eventData, players: [...players, user.uid], currentPlayers: players.length + 1 }
          joinedPlayers = true;
        }
      } else {
        // action === "leave"
        if (!players.includes(user.uid) && !waitlist.includes(user.uid)) {
          throw new Error("NOT_JOINED")
        }

        if (waitlist.includes(user.uid)) {
          // Leave waitlist
          transaction.update(eventRef, {
            waitlist: FieldValue.arrayRemove(user.uid)
          })
          updatedEventData = { ...eventData, waitlist: waitlist.filter((uid: string) => uid !== user.uid) }
        } else if (players.includes(user.uid)) {
          // Leave players
          const newPlayers = players.filter((uid: string) => uid !== user.uid)
          let newWaitlist = [...waitlist]

          if (newWaitlist.length > 0) {
            // Pop the first user from waitlist and push to players
            const nextUser = newWaitlist.shift()
            newPlayers.push(nextUser)

            // Overwrite arrays because we are doing both remove and push on different lists
            transaction.update(eventRef, {
              players: newPlayers,
              waitlist: newWaitlist,
              // currentPlayers remains the same since we swapped one for one
            })
            updatedEventData = { ...eventData, players: newPlayers, waitlist: newWaitlist }
          } else {
            // Just normal leave
            transaction.update(eventRef, {
              players: FieldValue.arrayRemove(user.uid),
              currentPlayers: newPlayers.length
            })
            updatedEventData = { ...eventData, players: newPlayers, currentPlayers: newPlayers.length }
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
