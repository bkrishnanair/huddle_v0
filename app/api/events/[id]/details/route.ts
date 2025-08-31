import { type NextRequest, NextResponse } from "next/server"
import { getEventWithPlayerDetails } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const eventWithDetails = await getEventWithPlayerDetails(id)

    if (!eventWithDetails) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(eventWithDetails)
  } catch (error) {
    console.error("Error fetching event details:", error)
    return NextResponse.json({ error: "Failed to fetch event details" }, { status: 500 })
  }
}
