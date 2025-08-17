import { type NextRequest, NextResponse } from "next/server";
// FIX: Switched to the correct server-side authentication function
import { getServerCurrentUser } from "@/lib/auth";
import { getEvents, createEvent } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const events = await getEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // This now correctly and securely identifies the user on the server.
    const user = await getServerCurrentUser();

    if (!user) {
      // If the cookie is invalid or missing, the user is unauthorized.
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { title, sport, location, date, time, maxPlayers } = await request.json();

    if (!title || !sport || !location || !date || !time || !maxPlayers) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // We now have the user's ID (uid) from the verified session.
    const event = await createEvent({
      title,
      sport,
      location,
      date,
      time,
      maxPlayers: Number(maxPlayers),
      createdBy: user.uid, // Use the verified user ID
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
