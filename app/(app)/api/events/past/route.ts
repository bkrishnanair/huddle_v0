import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get("userId");
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!adminAuth || !adminDb) {
            return NextResponse.json({ error: "Internal Server Error: Database not configured" }, { status: 500 });
        }

        const tokenString = authHeader.split("Bearer ")[1];
        let decodedToken;
        try {
            decodedToken = await adminAuth.verifyIdToken(tokenString);
        } catch {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Authorization check to ensure user can only query their own past events
        if (decodedToken.uid !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const eventsRef = adminDb.collection("events");

        const now = new Date();
        // Use ISO string comparison for date filtering
        const dateStr = now.toISOString().split('T')[0];

        const snapshot = await eventsRef
            .where("attendees", "array-contains", userId)
            .get();

        const events = snapshot.docs
            .map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            .filter((event: any) => event.date <= dateStr);

        return NextResponse.json({ events });
    } catch (error) {
        console.error("Error fetching past events:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
