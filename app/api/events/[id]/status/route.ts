import { type NextRequest, NextResponse } from "next/server";
import { getServerCurrentUser } from "@/lib/auth-server";
import { getFirebaseAdminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const user = await getServerCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const { status } = await request.json();

        if (!status || !['active', 'past'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const adminDb = getFirebaseAdminDb();
        if (!adminDb) throw new Error("Firebase Admin not initialized");

        const eventRef = adminDb.collection("events").doc(id);
        const eventDoc = await eventRef.get();

        if (!eventDoc.exists) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const eventData = eventDoc.data();
        if (eventData?.createdBy !== user.uid) {
            return NextResponse.json({ error: "Only the organizer can update the event status" }, { status: 403 });
        }

        await eventRef.update({
            status: status
        });

        return NextResponse.json({
            success: true,
            event: { id: eventDoc.id, ...eventData, status: status }
        });

    } catch (error) {
        console.error("Error updating event status:", error);
        return NextResponse.json({ error: "Failed to update event status" }, { status: 500 });
    }
}
