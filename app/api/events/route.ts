import { type NextRequest, NextResponse } from "next/server";
// FIX: Switched to importing from the new, dedicated server-side auth file.
import { getServerCurrentUser } from "@/lib/auth-server";
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
    // This function now comes from a server-only file, resolving the build error.
    const user = await getServerCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { title, sport, location, date, time, maxPlayers } = await request.json();

    if (!title || !sport || !location || !date || !time || !maxPlayers) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const event = await createEvent({
      title,
      sport,
      location,
      date,
      time,
      maxPlayers: Number(maxPlayers),
      createdBy: user.uid,
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
