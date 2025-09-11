import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getEvents, createEvent as dbCreateEvent, getNearbyEvents } from "@/lib/db"
import * as geofire from "geofire-common"
import { GeoPoint } from "firebase/firestore"
import { z } from "zod"

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  sport: z.string().min(1, "Sport is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  maxPlayers: z.number().min(2, "At least 2 players required").max(50, "Maximum 50 players"),
  description: z.string().optional(),
  location: z.object({
    text: z.string().min(1, "Location is required"),
    lat: z.number(),
    lng: z.number(),
  }),
  boostEvent: z.boolean().optional().default(false),
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
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = eventSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ 
        error: "Invalid data format", 
        details: validationResult.error.flatten().fieldErrors 
      }, { status: 400 })
    }

    const { title, sport, date, time, maxPlayers, description, location, boostEvent } = validationResult.data

    // Combine date and time into a proper datetime
    const datetime = new Date(`${date}T${time}`)
    
    if (datetime <= new Date()) {
      return NextResponse.json({ error: "Event date must be in the future" }, { status: 400 })
    }

    // Create GeoPoint for Firestore
    const geoPoint = new GeoPoint(location.lat, location.lng)
    
    // Generate geohash for location-based queries
    const geohash = geofire.geohashForLocation([location.lat, location.lng])

    const eventData = {
      title,
      sport,
      datetime: datetime.toISOString(),
      maxPlayers,
      currentPlayers: 1, // Creator is automatically joined
      description: description || "",
      location: {
        text: location.text,
        geopoint: geoPoint,
        geohash: geohash
      },
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      players: [user.uid],
      checkedInPlayers: [],
      isBoosted: boostEvent || false,
      isCompleted: false
    }

    const newEvent = await dbCreateEvent(eventData)

    return NextResponse.json({ 
      success: true, 
      event: newEvent 
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating event:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
