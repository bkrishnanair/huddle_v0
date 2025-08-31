import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { checkInPlayer } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { playerId } = await request.json()

    if (!playerId) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 })
    }

    const updatedEvent = await checkInPlayer(id, playerId, user.uid)

    return NextResponse.json({ event: updatedEvent })
  } catch (error) {
    console.error("Check-in error:", error)

    if (error instanceof Error) {
      if (error.message.includes("Only the event organizer")) {
        return NextResponse.json({ error: error.message }, { status: 403 })
      }
      if (error.message.includes("not found") || error.message.includes("not joined")) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }
    }

    return NextResponse.json({ error: "Failed to check in player" }, { status: 500 })
  }
}
