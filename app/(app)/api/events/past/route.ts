import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { pickPublicFields } from "@/lib/types";

/**
 * Upper bound on documents read per request. The query was previously
 * unbounded; a heavy user's history would grow without limit.
 */
const PAST_EVENTS_LIMIT = 200;

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

        // `players`, not `attendees`. No document has ever carried an
        // `attendees` field — the RSVP path writes `players`
        // (app/api/events/route.ts:343, lib/db.ts:402, lib/types.ts:57) — so
        // this query matched nothing and every user's history was empty.
        const snapshot = await eventsRef
            .where("players", "array-contains", userId)
            .limit(PAST_EVENTS_LIMIT)
            .get();

        const events = snapshot.docs
            // Projected. The raw event document carries every attendee's free
            // text and the whole check-in map, so spreading it here would show
            // one student another student's notes and no-show record.
            .map((doc) => pickPublicFields({ id: doc.id, ...doc.data() }))
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
