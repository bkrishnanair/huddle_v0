import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getEvents, createEvent as dbCreateEvent, getNearbyEvents } from "@/lib/db"
import * as geofire from "geofire-common"
import { GeoPoint } from "firebase/firestore"
import { z } from "zod"

// ... (eventSchema remains the same)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const radius = searchParams.get('radius')

    if (lat && lon && radius) {
      const events = await getNearbyEvents(
        [parseFloat(lat), parseFloat(lon)],
        parseFloat(radius)
      )
      return NextResponse.json({ events })
    }

    const events = await getEvents()
    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

// ... (POST function remains the same)
