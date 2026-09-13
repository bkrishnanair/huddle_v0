import "server-only";

export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { loadEventAccess } from "@/lib/event-access"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"
import { pickPublicFields, pickPublicUserFields } from "@/lib/types"

/**
 * GET /api/events/[id]/details
 *
 * The deep-link path: components/map-view.tsx opens this for every shared
 * ?eventId= link.
 *
 * Public links work without a session. Read attendee profiles only after
 * authorisation, and never include private profile fields in the response.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const user = await getServerCurrentUser()
    const { exists, eventData: rawEvent, access } = await loadEventAccess(id, user?.uid ?? "")
    if (!exists || !rawEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // A private event is only visible to people already involved in it. The
    // public projection below would otherwise hand out its title and location.
    const canSeeRoster = Boolean(user && access.canSeeRoster)
    if (rawEvent.isPrivate !== undefined && rawEvent.isPrivate !== false && !canSeeRoster) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Allowlist projection. The raw document carries attendee free text,
    // check-in records, waitlist order and unsent announcement drafts.
    const point = rawEvent.geopoint as { latitude?: number; longitude?: number; _latitude?: number; _longitude?: number } | undefined
    const latitude = point?.latitude ?? point?._latitude
    const longitude = point?.longitude ?? point?._longitude
    const geopoint = typeof latitude === "number" && Number.isFinite(latitude) && Math.abs(latitude) <= 90 &&
      typeof longitude === "number" && Number.isFinite(longitude) && Math.abs(longitude) <= 180
      ? { latitude, longitude } : null
    const event = pickPublicFields({ ...rawEvent, id, geopoint })

    // The roster is not part of the public shape of an event. Organisers,
    // event admins and confirmed attendees see who is coming; nobody else does.
    if (!canSeeRoster) {
      return NextResponse.json(event, { headers: { "Cache-Control": "private, no-store" } })
    }

    const db = getFirebaseAdminDb()
    if (!db) throw new Error("Database service unavailable")
    const playerIds = Array.isArray(rawEvent.players)
      ? [...new Set(rawEvent.players.filter((uid): uid is string => typeof uid === "string" && uid.length > 0 && !uid.includes("/")))]
      : []
    const playerDetails = await Promise.all(playerIds.map(async (uid) => {
      const profile = await db.collection("users").doc(uid).get()
      return pickPublicUserFields({ ...(profile.data() ?? {}), uid })
    }))
    return NextResponse.json({ ...event, playerDetails }, { headers: { "Cache-Control": "private, no-store" } })
  } catch (error) {
    console.error("Error fetching event details:", error)
    return NextResponse.json({ error: "Failed to fetch event details" }, { status: 500 })
  }
}
