export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { checkInPlayer } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getServerCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { playerId } = body

    if (!playerId) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 })
    }

    const { status = true } = body
    const updatedEvent = await checkInPlayer(id, playerId, user.uid, status)

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
