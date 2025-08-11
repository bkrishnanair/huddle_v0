import { type NextRequest, NextResponse } from "next/server"
import { logOut } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await logOut()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
