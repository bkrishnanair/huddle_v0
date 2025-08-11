import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getUserJoinedEvents, getUserOrganizedEvents } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Users can only access their own events
    if (user.uid !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const [joinedEvents, organizedEvents] = await Promise.all([getUserJoinedEvents(id), getUserOrganizedEvents(id)])

    return NextResponse.json({
      joinedEvents,
      organizedEvents,
    })
  } catch (error) {
    console.error("Error fetching user events:", error)
    return NextResponse.json({ error: "Failed to fetch user events" }, { status: 500 })
  }
}
