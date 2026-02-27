export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"
import { FieldPath } from "firebase-admin/firestore"

export async function GET(
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

        // Ensure only the organizer can fetch the attendee roster
        if (eventData?.createdBy !== user.uid) {
            return NextResponse.json({ error: "Forbidden: You do not have permission to view the attendee roster" }, { status: 403 })
        }

        const playerUids = eventData?.players || [];
        if (playerUids.length === 0) {
            return NextResponse.json({ attendees: [] }, { status: 200 })
        }

        // Fetch users using whereIn. Note: whereIn supports max 10 items per array in Firestore.
        // If there are more than 10 players, we need to batch the queries.
        const attendees: { id: string, name: string, loyaltyCount: number, note?: string }[] = [];
        const attendeeNotes = eventData?.attendeeNotes || {};

        // Chunk the uids into sizes of 10
        const chunkSize = 10;
        for (let i = 0; i < playerUids.length; i += chunkSize) {
            const chunk = playerUids.slice(i, i + chunkSize);
            const usersSnapshot = await adminDb.collection("users").where(FieldPath.documentId(), "in", chunk).get();

            for (const doc of usersSnapshot.docs) {
                const userData = doc.data();

                // Count how many events organized by currentUser.uid this specific attendee has joined
                const countSnapshot = await adminDb.collection("events")
                    .where("createdBy", "==", user.uid)
                    .where("players", "array-contains", doc.id)
                    .count()
                    .get();

                attendees.push({
                    id: doc.id,
                    name: userData.name || userData.displayName || "Unknown User",
                    loyaltyCount: countSnapshot.data().count,
                    note: attendeeNotes[doc.id] || undefined
                });
            }
        }

        return NextResponse.json({ attendees }, { status: 200 })

    } catch (error) {
        console.error("Error fetching attendees:", error)
        return NextResponse.json({ error: "Failed to fetch attendees" }, { status: 500 })
    }
}
