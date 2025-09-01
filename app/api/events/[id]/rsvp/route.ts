import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { db } from "@/lib/firebase-admin"
import { getEvent, joinEvent, leaveEvent } from "@/lib/db"
import { z } from "zod"
import { firestore } from "firebase-admin"

const rsvpSchema = z.object({
  action: z.enum(["join", "leave"]),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
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
    const event = await getEvent(id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    let updatedEvent

    if (action === "join") {
      if (event.players?.includes(user.uid)) {
        return NextResponse.json({ error: "You have already joined this event" }, { status: 400 })
      }

      if (event.currentPlayers >= event.maxPlayers) {
        return NextResponse.json({ error: "This event is already full" }, { status: 400 })
      }

      updatedEvent = await joinEvent(id, user.uid)

      // Gamification: Check for first game achievement
      const userEventsQuery = await db.collection("events").where("players", "array-contains", user.uid).get()
      if (userEventsQuery.size === 1) {
        const userRef = db.collection("users").doc(user.uid)
        await userRef.update({
          badges: firestore.FieldValue.arrayUnion("first_game"),
        })
      }
    } else {
      // action === "leave"
      if (!event.players?.includes(user.uid)) {
        return NextResponse.json({ error: "You are not currently joined to this event" }, { status: 400 })
      }

      updatedEvent = await leaveEvent(id, user.uid)
    }

    return NextResponse.json({ event: updatedEvent })
  } catch (error) {
    console.error("RSVP error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update RSVP status" }, { status: 500 })
  }
}
