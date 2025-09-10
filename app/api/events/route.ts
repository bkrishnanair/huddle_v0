import { type NextRequest, NextResponse } from "next/server";
// CORRECT: Import the new centralized session verification function.
import { verifySession } from "@/lib/auth-server";
import { createEvent as dbCreateEvent, getEvents, getNearbyEvents } from "@/lib/db-server";
import * as geofire from "geofire-common";
import { z } from "zod";

export const runtime = 'nodejs';

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  sport: z.string().min(1, "Sport is required"),
  location: z.string().min(1, "Location is required"),
  latitude: z.number(),
  longitude: z.number(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  maxPlayers: z.number().int().min(2, "At least 2 players are required"),
  description: z.string().optional(),
  isBoosted: z.boolean().optional().default(false),
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
    // SERVER GUARD: Use the centralized `verifySession` function.
    // This will throw an error if the user is not authenticated, which is caught below.
    const user = await verifySession();

    const body = await request.json()
    const validationResult = eventSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
    }

    const eventData = validationResult.data
    const geohash = geofire.geohashForLocation([eventData.latitude, eventData.longitude])
    
    const newEvent = {
      ...eventData,
      hostId: user.uid,
      hostName: user.displayName || "Anonymous",
      hostPhotoURL: user.photoURL || "",
      players: [
        {
          uid: user.uid,
          displayName: user.displayName || "Anonymous",
          photoURL: user.photoURL || "",
        },
      ],
      createdAt: new Date().toISOString(),
      geohash,
    }

    const createdEvent = await dbCreateEvent(newEvent)

    return NextResponse.json({ message: "Event created successfully", event: createdEvent }, { status: 201 })
  } catch (error: any) {
    console.error(`[API /events POST] Error: [${error.code || 'UNKNOWN'}] ${error.message}`);
    
    // Catch specific, expected authentication errors and return a 401.
    if (error.code === 'auth/no-session-cookie' || 
        error.code === 'auth/session-cookie-expired' || 
        error.code === 'auth/invalid-session-cookie') {
        return NextResponse.json({ error: "Authentication required. Please log in." }, { status: 401 });
    }
    
    // For all other errors, return a generic 500 server error.
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
  }
}
