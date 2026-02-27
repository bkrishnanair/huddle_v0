export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"
import { z } from "zod"
import * as geofire from "geofire-common"

const editEventSchema = z.object({
    name: z.string().min(1, "Event name is required").optional(),
    category: z.string().min(1, "Category is required").optional(),
    date: z.string().min(1, "Date is required").optional(),
    time: z.string().min(1, "Time is required").optional(),
    location: z.string().min(1, "Location is required").optional(),
    maxPlayers: z.number().min(1, "At least one player is required").optional(),
    description: z.string().optional(),
    geopoint: z.object({
        latitude: z.number(),
        longitude: z.number(),
    }).optional(),
    questions: z.array(z.string()).optional(),
    pickupPoints: z.array(z.object({
        id: z.string(),
        location: z.string(),
        time: z.string(),
    })).optional(),
    stayUntil: z.string().optional(),
    transitTips: z.string().optional(),
})

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

export async function PUT(
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

        // Security verify: only the creator can edit their event
        if (eventData?.createdBy !== user.uid) {
            return NextResponse.json({ error: "Forbidden: You do not have permission to edit this event" }, { status: 403 })
        }

        const body = await request.json()
        const validation = editEventSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 })
        }

        const updates: any = { ...validation.data }

        // If they updated geolocation, recalculate the geohash
        if (updates.geopoint) {
            const geohash = geofire.geohashForLocation([updates.geopoint.latitude, updates.geopoint.longitude])
            updates.geohash = geohash
            // Keep aliases synced if updating name or category
            if (updates.name) updates.title = updates.name;
            if (updates.category) updates.sport = updates.category;
        }

        await eventRef.update(updates)

        return NextResponse.json({ message: "Event updated successfully", event: { ...eventData, ...updates } }, { status: 200 })

    } catch (error) {
        console.error("Error updating event:", error)
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
    }
}
