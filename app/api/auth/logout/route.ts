export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { logOut } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await logOut()

    // Clear the server-side session cookie
    const cookieStore = await import("next/headers").then(mod => mod.cookies())
    cookieStore.delete("session")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
