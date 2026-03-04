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
  eventType: z.enum(["in-person", "virtual", "hybrid"]).default("in-person"),
  virtualLink: z.string().url("Please enter a valid URL").optional().nullable(),
  icon: z.string().max(2, "Icon must be a single emoji").optional(),
  tags: z.array(z.string()).optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  endTime: z.string().optional(),
  location: z.string().optional(),
  maxPlayers: z.number().min(1, "At least one player is required"),
  minPlayers: z.number().optional(),
  description: z.string().optional(),
  isBoosted: z.boolean().optional(),
  isPrivate: z.boolean().optional(),
  geopoint: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  questions: z.array(z.string()).optional(),
  pickupPoints: z.array(z.object({
    id: z.string(),
    location: z.string(),
    time: z.string(),
  })).optional(),
  stayUntil: z.string().optional(),
  transitTips: z.string().optional(),
}).refine(data => {
  // Virtual and hybrid events must have a meeting link
  if ((data.eventType === "virtual" || data.eventType === "hybrid") && !data.virtualLink) return false;
  return true;
}, { message: "Virtual/Hybrid events require a meeting link", path: ["virtualLink"] })
  .refine(data => {
    // In-person and hybrid events must have a physical location
    if (data.eventType !== "virtual" && !data.location) return false;
    return true;
  }, { message: "In-person/Hybrid events require a location", path: ["location"] })
  .refine(data => {
    // In-person and hybrid events must have a geopoint
    if (data.eventType !== "virtual" && !data.geopoint) return false;
    return true;
  }, { message: "In-person/Hybrid events require a geopoint", path: ["geopoint"] });



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

      // Return only actual Firebase events (exclude private ones)
      const combinedEvents = events.filter((e: any) => !e.isPrivate)

      return NextResponse.json(
        { events: combinedEvents },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      )
    }

    const events = await getEvents()
    const combinedEvents = events.filter((e: any) => !e.isPrivate)
    return NextResponse.json(
      { events: combinedEvents },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
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

    // Conditionally compute geohash only for events with a physical location
    const geohash = geopoint
      ? geofire.geohashForLocation([geopoint.latitude, geopoint.longitude])
      : null;

    const adminDb = getFirebaseAdminDb()
    if (!adminDb) {
      throw new Error("Database service unavailable")
    }

    // Get user's name for organizerName field
    const userDoc = await adminDb.collection("users").doc(user.uid).get()
    const userData = userDoc.data()
    const organizerName = userData?.name || user.name || user.email?.split("@")[0] || "User"

    const newEvent: Record<string, any> = {
      ...rest,
      title: rest.name, // Ensure title is set for component compatibility
      sport: rest.category, // Ensure sport is set for component compatibility
      location: rest.location || null,
      eventType: rest.eventType || "in-person",
      virtualLink: rest.virtualLink || null,
      createdBy: user.uid,
      organizerName,
      players: [user.uid],
      currentPlayers: 1,
      createdAt: Timestamp.now(),
      checkInOpen: false,
    }

    // Only set geopoint/geohash for events with a physical location
    if (geopoint) {
      newEvent.geopoint = new GeoPoint(geopoint.latitude, geopoint.longitude);
      newEvent.geohash = geohash;
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