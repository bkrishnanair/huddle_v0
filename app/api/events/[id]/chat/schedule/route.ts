export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"
import { z } from "zod"
import { FieldValue } from "firebase-admin/firestore"

const scheduleSchema = z.object({
    message: z.string().min(1, "Message is required").max(500, "Message is too long"),
    scheduledFor: z.string().datetime(),
    isAnnouncement: z.boolean().default(false),
})

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;
        const user = await getServerCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }

        const adminDb = getFirebaseAdminDb()
        if (!adminDb) {
            return NextResponse.json({ error: "Database unavailable" }, { status: 500 })
        }

        const eventRef = adminDb.collection("events").doc(eventId)
        const eventDoc = await eventRef.get()

        if (!eventDoc.exists) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 })
        }

        const eventData = eventDoc.data()
        if (eventData?.createdBy !== user.uid) {
            return NextResponse.json({ error: "Only the organizer can schedule messages" }, { status: 403 })
        }

        const body = await request.json()
        const validationResult = scheduleSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
        }

        const { message, scheduledFor, isAnnouncement } = validationResult.data

        const scheduleId = `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        await eventRef.update({
            scheduledMessages: FieldValue.arrayUnion({
                id: scheduleId,
                message,
                scheduledFor,
                isAnnouncement,
                sent: false
            })
        })

        return NextResponse.json({ success: true, scheduleId })
    } catch (error) {
        console.error("Error scheduling message:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
