import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getEvents, createEvent as dbCreateEvent, getNearbyEvents } from "@/lib/db"
import * from "geofire-common"
import { GeoPoint } from "firebase/firestore"
import { z } from "zod"

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required"),
  maxPlayers: z.number().min(1, "At least one player is required"),
  minPlayers: z.number().optional(),
  description: z.string().optional(),
  geopoint: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
})

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

export async function POST(request: NextRequest) {
  try {
    const user = await getServerCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = eventSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const { geopoint, ...rest } = validation.data
    const geohash = geofire.geohashForLocation([geopoint.latitude, geopoint.longitude])
    
    const newEvent = {
      ...rest,
      geopoint: new GeoPoint(geopoint.latitude, geopoint.longitude),
      geohash,
      createdBy: user.uid,
      players: [user.uid],
    }

    const createdEvent = await dbCreateEvent(newEvent)

    return NextResponse.json({
      message: "Event created successfully",
      event: createdEvent,
    })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}