import { type NextRequest, NextResponse } from "next/server";
import { getServerCurrentUser } from "@/lib/auth-server";
import { getEvents, createEvent as dbCreateEvent } from "@/lib/db";
import * as geofire from "geofire-common";
import { GeoPoint } from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const events = await getEvents();
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { title, sport, location, date, time, maxPlayers, latitude, longitude } = await request.json();

    if (!title || !sport || !location || !date || !time || !maxPlayers || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "All fields, including lat/lng, are required" }, { status: 400 });
    }

    const geohash = geofire.geohashForLocation([latitude, longitude]);
    const geopoint = new GeoPoint(latitude, longitude);

    const eventData = {
      title,
      sport,
      location,
      date,
      time,
      maxPlayers: Number(maxPlayers),
      createdBy: user.uid,
      players: [user.uid],
      currentPlayers: 1,
      geohash,
      geopoint,
      // DENORM: Add the organizer's name and photo URL directly to the event document.
      // This saves us from having to make a separate query for the user's profile on the client.
      organizerName: user.displayName || "Anonymous",
      organizerPhotoURL: user.photoURL || null,
    };

    const event = await dbCreateEvent(eventData);

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
