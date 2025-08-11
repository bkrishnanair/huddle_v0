import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getEvent, joinEvent, leaveEvent } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { action } = await request.json()

    if (!action || !["join", "leave"].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "join" or "leave"' }, { status: 400 })
    }

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
    } else {
      if (!event.players?.includes(user.uid)) {
        return NextResponse.json({ error: "You are not currently joined to this event" }, { status: 400 })
      }

      updatedEvent = await leaveEvent(id, user.uid)
    }

    return NextResponse.json({ event: updatedEvent })
  } catch (error) {
    console.error("RSVP error:", error)
    return NextResponse.json({ error: "Failed to update RSVP status" }, { status: 500 })
  }
}
