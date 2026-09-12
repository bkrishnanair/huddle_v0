import "server-only";

export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { checkInPlayer } from "@/lib/db"
import { checkinInput } from '@/lib/request-schemas'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getServerCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const validation = checkinInput.safeParse(await request.json().catch(() => null));
    if (!validation.success) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 })
    }
    const { playerId, status } = validation.data;
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
