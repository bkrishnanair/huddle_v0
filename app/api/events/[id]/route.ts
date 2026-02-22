export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;
        const user = await getServerCurrentUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const adminDb = getFirebaseAdminDb()
        if (!adminDb) {
            throw new Error("Database service unavailable")
        }

        const eventRef = adminDb.collection("events").doc(eventId)
        const eventDoc = await eventRef.get()

        if (!eventDoc.exists) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 })
        }

        const eventData = eventDoc.data()

        // Security verify: only the creator can delete their event
        if (eventData?.createdBy !== user.uid) {
            return NextResponse.json({ error: "Forbidden: You do not have permission to delete this event" }, { status: 403 })
        }

        await eventRef.delete()

        return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 })

    } catch (error) {
        console.error("Error deleting event:", error)
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
    }
}
