import { NextResponse } from "next/server"
import { getAuth } from "@/lib/auth"

export async function GET() {
  try {
    // Verify user is authenticated
    const user = await getAuth()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
    }

    return NextResponse.json({
      apiKey,
      mapId: "huddle-map",
    })
  } catch (error) {
    console.error("Maps config error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
