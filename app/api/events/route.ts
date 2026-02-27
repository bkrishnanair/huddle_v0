export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getEvents, getNearbyEvents } from "@/lib/db"
import { getFirebaseAdminDb, GeoPoint, Timestamp } from "@/lib/firebase-admin"
import * as geofire from "geofire-common"
import { z } from "zod"

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  maxPlayers: z.number().min(1, "At least one player is required"),
  minPlayers: z.number().optional(),
  description: z.string().optional(),
  isBoosted: z.boolean().optional(),
  isPrivate: z.boolean().optional(),
  geopoint: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  questions: z.array(z.string()).optional(),
  pickupPoints: z.array(z.object({
    id: z.string(),
    location: z.string(),
    time: z.string(),
  })).optional(),
  stayUntil: z.string().optional(),
  transitTips: z.string().optional(),
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

      // Return only actual Firebase events
      const combinedEvents = events.filter((e: any) => !e.isPrivate)

      return NextResponse.json({ events: combinedEvents })
    }

    const events = await getEvents()
    const combinedEvents = events.filter((e: any) => !e.isPrivate)
    return NextResponse.json({ events: combinedEvents })
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
    console.log("Incoming Payload for POST /api/events:", body)

    const validation = eventSchema.safeParse(body)

    if (!validation.success) {
      console.error("Validation Error:", validation.error.format())
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const { geopoint, ...rest } = validation.data
    const geohash = geofire.geohashForLocation([geopoint.latitude, geopoint.longitude])

    const adminDb = getFirebaseAdminDb()
    if (!adminDb) {
      throw new Error("Database service unavailable")
    }

    // Get user's name for organizerName field
    const userDoc = await adminDb.collection("users").doc(user.uid).get()
    const userData = userDoc.data()
    const organizerName = userData?.name || user.name || user.email?.split("@")[0] || "User"

    const newEvent = {
      ...rest,
      title: rest.name, // Ensure title is set for component compatibility
      sport: rest.category, // Ensure sport is set for component compatibility
      location: rest.location, // Ensure location is set for component compatibility
      geopoint: new GeoPoint(geopoint.latitude, geopoint.longitude),
      geohash,
      createdBy: user.uid,
      organizerName,
      players: [user.uid],
      currentPlayers: 1,
      createdAt: Timestamp.now(),
    }

    const docRef = await adminDb.collection("events").add(newEvent)
    const createdEvent = { id: docRef.id, ...newEvent }

    return NextResponse.json({
      message: "Event created successfully",
      event: createdEvent,
    })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}