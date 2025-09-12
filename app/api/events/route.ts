import { type NextRequest, NextResponse } from "next/server";
import { verifySession, SessionVerificationError } from "@/lib/auth-server";
import { getEvents, createEvent as dbCreateEvent, getNearbyEvents } from "@/lib/db";
import * as geofire from "geofire-common";
import { GeoPoint } from "firebase/firestore";
import { z } from "zod";

// This schema is used for creating events, hence it's specific to the POST request.
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
});

/**
 * Handles fetching events. 
 * This can be either all events or events nearby a specific location.
 * This endpoint is public and does not require authentication.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const radius = searchParams.get('radius');

    if (lat && lon && radius) {
      const events = await getNearbyEvents(
        [parseFloat(lat), parseFloat(lon)],
        parseFloat(radius)
      );
      return NextResponse.json({ events });
    }

    const events = await getEvents();
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

/**
 * Handles the creation of a new event.
 * This is a protected endpoint and requires a valid user session.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify user session - this is the first and most important step.
    const user = await verifySession(request);

    // 2. Parse and validate the incoming request body.
    const body = await request.json();
    const validationResult = eventSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        error: "Invalid data format",
        details: validationResult.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    const { title, sport, date, time, maxPlayers, description, location, boostEvent } = validationResult.data;

    // 3. Perform server-side logic (date checks, data transformation).
    const datetime = new Date(`${date}T${time}`);
    if (datetime <= new Date()) {
      return NextResponse.json({ error: "Event date must be in the future" }, { status: 400 });
    }

    const geoPoint = new GeoPoint(location.lat, location.lng);
    const geohash = geofire.geohashForLocation([location.lat, location.lng]);

    const eventData = {
      title,
      sport,
      datetime: datetime.toISOString(),
      maxPlayers,
      currentPlayers: 1,
      description: description || "",
      location: {
        text: location.text,
        geopoint: geoPoint,
        geohash: geohash,
      },
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      players: [user.uid],
      checkedInPlayers: [],
      isBoosted: boostEvent || false,
      isCompleted: false,
    };

    // 4. Create the event in the database.
    const newEvent = await dbCreateEvent(eventData);

    // 5. Return a successful response.
    return NextResponse.json({
      success: true,
      event: newEvent,
    }, { status: 201 });

  } catch (error: any) {
    // Specific handling for authentication errors from verifySession
    if (error instanceof SessionVerificationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
        return NextResponse.json({ error: "Invalid data format", details: error.flatten() }, { status: 400 });
    }
    
    // Generic error handler for all other unexpected errors
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
