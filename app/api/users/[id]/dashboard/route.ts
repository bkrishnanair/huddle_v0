export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"
import { subDays, isAfter, parseISO } from "date-fns"

export const runtime = 'nodejs'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: requestedUserId } = await params;
        const currentUser = await getServerCurrentUser()

        if (!currentUser) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }

        if (currentUser.uid !== requestedUserId) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 })
        }

        const adminDb = getFirebaseAdminDb()
        if (!adminDb) {
            return NextResponse.json({ error: "Database service unavailable" }, { status: 503 })
        }

        const { searchParams } = new URL(request.url)
        const days = parseInt(searchParams.get("days") || "30", 10)

        const cutoffDate = subDays(new Date(), days)

        // Fetch all events created by the user
        const eventsRef = adminDb.collection("events")
        const q = eventsRef.where("createdBy", "==", requestedUserId)
        const querySnapshot = await q.get()

        const allEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        // Filter events that happened within the timeframe
        const recentEvents = allEvents.filter((ev: any) => {
            if (!ev.date || ev.date.includes('/')) return true; // Keep malformed just in case, or exclude. Let's include for stat completeness.
            try {
                const eventDate = parseISO(ev.date)
                return isAfter(eventDate, cutoffDate)
            } catch (e) {
                return true;
            }
        }).sort((a: any, b: any) => b.date?.localeCompare(a.date || "") || 0);

        let totalRSVPs = 0;
        let totalEvents = recentEvents.length;
        let overallShowRateSum = 0;
        let eventsWithCheckinsTracked = 0;

        const eventsData = recentEvents.map((ev: any) => {
            const rsvps = ev.currentPlayers || 0;
            totalRSVPs += rsvps;

            // Only count show rate if Check-In feature was used
            let checkedInCount = 0;
            if (ev.checkInOpen || (ev.checkIns && Object.keys(ev.checkIns).length > 0)) {
                checkedInCount = ev.checkIns ? Object.values(ev.checkIns).filter(val => val === true).length : 0;
                if (rsvps > 0) {
                    overallShowRateSum += (checkedInCount / rsvps);
                    eventsWithCheckinsTracked++;
                }
            }

            return {
                id: ev.id,
                title: ev.title || "Untitled",
                sport: ev.sport || "Other",
                date: ev.date || "",
                maxPlayers: ev.maxPlayers || 0,
                currentPlayers: rsvps,
                checkedInCount,
            }
        })

        const avgShowRate = eventsWithCheckinsTracked > 0
            ? Math.round((overallShowRateSum / eventsWithCheckinsTracked) * 100)
            : 0;

        return NextResponse.json({
            stats: {
                totalEvents,
                totalRSVPs,
                avgShowRate,
                events: eventsData
            }
        }, { status: 200 })

    } catch (error) {
        console.error("Dashboard error:", error)
        return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 })
    }
}
