import "server-only";

export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"
import { z } from "zod"
import { FieldValue } from "firebase-admin/firestore"
import { randomUUID } from "node:crypto"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { getEventEndUTC } from "@/lib/datetime"
import { SCHEDULED_MESSAGE_NOTICE } from "@/lib/cron/cadence"
import type { GameEvent } from "@/lib/types"

const scheduleSchema = z.object({
    message: z.string().min(1, "Message is required").max(500, "Message is too long"),
    scheduledFor: z.string().datetime(),
    isAnnouncement: z.boolean().default(false),
}).strict()

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

        const limit = await checkRateLimit(user.uid, 'schedule_message', 20, 3_600_000, getClientIp(request))
        if (!limit.success) return NextResponse.json({ error: 'Please wait before scheduling another message' }, {
            status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) },
        })

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

        const body = await request.json().catch(() => null)
        const validationResult = scheduleSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json({ error: 'Enter a message and a valid future delivery time' }, { status: 400 })
        }

        const { message, scheduledFor, isAnnouncement } = validationResult.data

        const scheduleId = `sched_${randomUUID()}`
        const result = await adminDb.runTransaction(async tx => {
            const current = await tx.get(eventRef)
            const event = current.data()
            if (!event || event.createdBy !== user.uid) return { error: 'Event is no longer available to this organizer', status: 403 }
            const end = getEventEndUTC(event as GameEvent)
            const due = new Date(scheduledFor)
            if (!Number.isFinite(end.getTime()) || due <= new Date() || due >= end || event.status === 'archived' || event.status === 'past') {
                return { error: 'Choose a future time before the event ends', status: 400 }
            }
            const pending = (event.scheduledMessages || []).filter((item: { sent?: boolean; cancelled?: boolean }) => !item.sent && !item.cancelled)
            if (pending.length >= 20) return { error: 'This event already has 20 pending messages', status: 400 }
            tx.update(eventRef, {
                scheduledMessages: FieldValue.arrayUnion({ id: scheduleId, message, scheduledFor, isAnnouncement, sent: false }),
            })
            return null
        })
        if (result) return NextResponse.json({ error: result.error }, { status: result.status })
        return NextResponse.json({ success: true, scheduleId, deliveryNotice: SCHEDULED_MESSAGE_NOTICE })
    } catch (error) {
        console.error("Error scheduling message:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
