export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"
import { FieldPath } from "firebase-admin/firestore"
import { getUserJoinedEvents } from "@/lib/db"

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

        // Roster access: the organizer, an event admin, or someone actually in the
        // event. Anyone else is refused — this is the only route that serves the
        // roster, since GET /api/events projects it away.
        const isOrganizer = eventData?.createdBy === user.uid
        const isEventAdmin = Array.isArray(eventData?.admins) && eventData.admins.includes(user.uid)
        const isMember = Array.isArray(eventData?.players) && eventData.players.includes(user.uid)

        if (!isOrganizer && !isEventAdmin && !isMember) {
            return NextResponse.json({ error: "Forbidden: You do not have permission to view the attendee roster" }, { status: 403 })
        }

        // Organizers and event admins run the event, so they get operational
        // detail. A plain attendee gets names only — one attendee must not see
        // another's private note or their no-show record.
        const canSeeAttendeeDetail = isOrganizer || isEventAdmin

        const playerUids = eventData?.players || [];
        if (playerUids.length === 0) {
            return NextResponse.json({ attendees: [] }, { status: 200 })
        }

        // Fetch users using whereIn. Note: whereIn supports max 10 items per array in Firestore.
        // If there are more than 10 players, we need to batch the queries.
        const attendees: {
            id: string,
            name: string,
            loyaltyCount?: number,
            note?: string,
            answers?: Record<string, string>,
            pickup?: string,
            reliabilityScore?: number | null,
        }[] = [];

        // Free-text roster data lives in events/{id}/roster/{uid}, which denies all
        // client access — this route is the only way to read it. Fetched once for
        // the whole event, and only for callers entitled to the detail.
        const roster: Record<string, { note?: string, answers?: Record<string, string>, pickup?: string }> = {};
        if (canSeeAttendeeDetail) {
            const rosterSnap = await eventRef.collection("roster").get();
            for (const rosterDoc of rosterSnap.docs) {
                roster[rosterDoc.id] = rosterDoc.data() as { note?: string, answers?: Record<string, string>, pickup?: string };
            }
        }

        // Chunk the uids into sizes of 10
        const chunkSize = 10;
        for (let i = 0; i < playerUids.length; i += chunkSize) {
            const chunk = playerUids.slice(i, i + chunkSize);
            const usersSnapshot = await adminDb.collection("users").where(FieldPath.documentId(), "in", chunk).get();

            for (const doc of usersSnapshot.docs) {
                const userData = doc.data();
                const name = userData.name || userData.displayName || "Unknown User";

                // Plain attendees get names only. Skipping the detail work also
                // avoids two extra Firestore reads per attendee for this caller.
                if (!canSeeAttendeeDetail) {
                    attendees.push({ id: doc.id, name });
                    continue;
                }

                // Count how many events organized by currentUser.uid this specific attendee has joined
                const countSnapshot = await adminDb.collection("events")
                    .where("createdBy", "==", user.uid)
                    .where("players", "array-contains", doc.id)
                    .count()
                    .get();

                // Calculate Reliability Score
                const joinedEvents = await getUserJoinedEvents(doc.id);
                const now = Date.now();
                const pastEvents = joinedEvents.filter((ev: any) => {
                    if (!ev.date || ev.date.includes('/')) return false;
                    try {
                        const eventDateTime = new Date(`${ev.date}T${ev.time || '00:00'}`);
                        return !isNaN(eventDateTime.getTime()) && eventDateTime.getTime() < now;
                    } catch (e) {
                        return false;
                    }
                });

                let attended = 0;
                let noShows = 0;
                pastEvents.forEach((ev: any) => {
                    if (ev.checkInOpen || (ev.checkIns && Object.keys(ev.checkIns).length > 0)) {
                        if (ev.checkIns && ev.checkIns[doc.id]) {
                            attended++;
                        } else {
                            noShows++;
                        }
                    }
                });

                const totalTracked = attended + noShows;
                const reliabilityScore = totalTracked > 0 ? Math.round((attended / totalTracked) * 100) : null;


                const rosterEntry = roster[doc.id];

                attendees.push({
                    id: doc.id,
                    name,
                    loyaltyCount: countSnapshot.data().count,
                    note: rosterEntry?.note || undefined,
                    answers: rosterEntry?.answers || undefined,
                    pickup: rosterEntry?.pickup || undefined,
                    reliabilityScore
                });
            }
        }

        return NextResponse.json({ attendees }, { status: 200 })

    } catch (error) {
        console.error("Error fetching attendees:", error)
        return NextResponse.json({ error: "Failed to fetch attendees" }, { status: 500 })
    }
}
