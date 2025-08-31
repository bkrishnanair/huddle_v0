import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getEvents, createEvent as dbCreateEvent } from "@/lib/db"
import * as geofire from "geofire-common"
import { GeoPoint } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
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

    const {
      title,
      sport,
      location,
      date,
      time,
      maxPlayers,
      latitude,
      longitude,
      description,
      isRecurring,
      recurringFrequency,
      recurringCount,
    } = await request.json()

    if (
      !title ||
      !sport ||
      !location ||
      !date ||
      !time ||
      !maxPlayers ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return NextResponse.json({ error: "All fields, including lat/lng, are required" }, { status: 400 })
    }

    const geohash = geofire.geohashForLocation([latitude, longitude])
    const geopoint = new GeoPoint(latitude, longitude)

    const baseEventData = {
      title,
      sport,
      location,
      time,
      maxPlayers: Number(maxPlayers),
      createdBy: user.uid,
      players: [user.uid],
      currentPlayers: 1,
      geohash,
      geopoint,
      description: description || "",
      organizerName: user.displayName || "Anonymous",
      organizerPhotoURL: user.photoURL || null,
    }

    if (isRecurring && recurringCount > 1) {
      const events = []
      const startDate = new Date(date)

      for (let i = 0; i < recurringCount; i++) {
        const eventDate = new Date(startDate)

        // Calculate the date for each occurrence
        if (recurringFrequency === "weekly") {
          eventDate.setDate(startDate.getDate() + i * 7)
        } else if (recurringFrequency === "biweekly") {
          eventDate.setDate(startDate.getDate() + i * 14)
        } else if (recurringFrequency === "monthly") {
          eventDate.setMonth(startDate.getMonth() + i)
        }

        const eventData = {
          ...baseEventData,
          date: eventDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
          // Add series identifier for recurring events
          recurringSeriesId: `${user.uid}_${Date.now()}`,
          recurringIndex: i + 1,
          recurringTotal: recurringCount,
        }

        const event = await dbCreateEvent(eventData)
        events.push(event)
      }

      return NextResponse.json({ events, message: `Created ${recurringCount} recurring events` })
    } else {
      const eventData = {
        ...baseEventData,
        date,
      }

      const event = await dbCreateEvent(eventData)
      return NextResponse.json({ event })
    }
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
