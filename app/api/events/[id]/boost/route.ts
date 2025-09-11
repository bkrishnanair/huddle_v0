import { type NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    const userId = decodedToken.uid

    const { id: eventId } = await params
    const eventRef = adminDb.collection("events").doc(eventId)
    const eventDoc = await eventRef.get()

    if (!eventDoc.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const eventData = eventDoc.data()

    // Verify that the user is the event organizer
    if (eventData?.createdBy !== userId) {
      return NextResponse.json({ error: "Only the event organizer can boost this event" }, { status: 403 })
    }

    // Check if event is already boosted
    if (eventData?.isBoosted) {
      return NextResponse.json({ error: "Event is already boosted" }, { status: 400 })
    }

    // Update the event to set isBoosted to true
    await eventRef.update({
      isBoosted: true,
      boostedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Event boosted successfully",
    })
  } catch (error) {
    console.error("Error boosting event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
