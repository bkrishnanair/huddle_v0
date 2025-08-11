import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getAllEvents, createEvent } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const events = await getAllEvents()
    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { title, sport, location, latitude, longitude, date, time, maxPlayers } = await request.json()

    if (!title || !sport || !location || !date || !time || !maxPlayers) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const event = await createEvent({
      title,
      sport,
      location,
      latitude: latitude || 0,
      longitude: longitude || 0,
      date,
      time,
      maxPlayers: Number.parseInt(maxPlayers),
      createdBy: user.uid,
    })

    return NextResponse.json({ event })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
