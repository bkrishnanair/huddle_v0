import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getEvents, createEvent as dbCreateEvent } from "@/lib/db"
import * as geofire from "geofire-common"
import { GeoPoint } from "firebase/firestore"
import { z } from "zod"

// Zod schema for incoming event data
const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  sport: z.string().min(1, "Sport is required"),
  location: z.string().min(1, "Location is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  maxPlayers: z.number().int().min(2, "Max players must be at least 2"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringFrequency: z.enum(["weekly", "biweekly", "monthly"]).optional(),
  recurringCount: z.number().int().min(2).max(12).optional(),
})

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

    const body = await request.json()
    const validationResult = eventSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
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
    } = validationResult.data

    const geohash = geofire.geohashForLocation([latitude, longitude])
    const geopoint = new GeoPoint(latitude, longitude)

    const baseEventData = {
      title,
      sport,
      location,
      time,
      maxPlayers,
      createdBy: user.uid,
      players: [user.uid],
      currentPlayers: 1,
      geohash,
      geopoint,
      description: description || "",
      organizerName: user.displayName || "Anonymous",
      organizerPhotoURL: user.photoURL || null,
    }

    if (isRecurring && recurringFrequency && recurringCount && recurringCount > 1) {
      const events = []
      const startDate = new Date(date)

      for (let i = 0; i < recurringCount; i++) {
        const eventDate = new Date(startDate)
        if (recurringFrequency === "weekly") {
          eventDate.setDate(startDate.getDate() + i * 7)
        } else if (recurringFrequency === "biweekly") {
          eventDate.setDate(startDate.getDate() + i * 14)
        } else if (recurringFrequency === "monthly") {
          eventDate.setMonth(startDate.getMonth() + i)
        }

        const eventData = {
          ...baseEventData,
          date: eventDate.toISOString().split("T")[0],
          recurringSeriesId: `${user.uid}_${Date.now()}`,
          recurringIndex: i + 1,
          recurringTotal: recurringCount,
        }
        const event = await dbCreateEvent(eventData)
        events.push(event)
      }
      return NextResponse.json({ events, message: `Created ${recurringCount} recurring events` })
    } else {
      const eventData = { ...baseEventData, date }
      const event = await dbCreateEvent(eventData)
      return NextResponse.json({ event })
    }
  } catch (error) {
    console.error("Error creating event:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
