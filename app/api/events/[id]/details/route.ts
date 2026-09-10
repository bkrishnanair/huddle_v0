export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getEventWithPlayerDetails } from "@/lib/db"
import { getEventAccess } from "@/lib/event-access"
import { pickPublicFields } from "@/lib/types"

/**
 * GET /api/events/[id]/details
 *
 * The deep-link path: components/map-view.tsx opens this for every shared
 * ?eventId= link.
 *
 * This route previously had no authentication of any kind and returned the raw
 * event document plus, for every attendee, their entire user document — email
 * address and last-known GPS coordinates included. It now requires a session,
 * projects the event through the public allowlist, and reveals the roster only
 * to people entitled to see it.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const user = await getServerCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const eventWithDetails = await getEventWithPlayerDetails(id)

    if (!eventWithDetails) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const { playerDetails, ...rawEvent } = eventWithDetails as Record<string, unknown> & {
      playerDetails?: unknown[]
    }

    // A private event is only visible to people already involved in it. The
    // public projection below would otherwise hand out its title and location.
    const access = getEventAccess(rawEvent, user.uid)
    if (rawEvent.isPrivate && !access.canSeeRoster) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Allowlist projection. The raw document carries attendee free text,
    // check-in records, waitlist order and unsent announcement drafts.
    const event = pickPublicFields(rawEvent)

    // The roster is not part of the public shape of an event. Organisers,
    // event admins and confirmed attendees see who is coming; nobody else does.
    // getEventWithPlayerDetails already projects each entry through
    // PUBLIC_USER_FIELDS, so even this tier carries no email or location.
    if (!access.canSeeRoster) {
      return NextResponse.json(event)
    }

    return NextResponse.json({ ...event, playerDetails })
  } catch (error) {
    console.error("Error fetching event details:", error)
    return NextResponse.json({ error: "Failed to fetch event details" }, { status: 500 })
  }
}
