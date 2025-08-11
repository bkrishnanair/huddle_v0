import { type NextRequest, NextResponse } from "next/server"
import { signUpWithEmail } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Check if Firebase is configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      // Use fallback in-memory storage
      const { fallbackCreateUser } = await import("@/lib/fallback-db")
      const user = await fallbackCreateUser({ email, password, name })
      return NextResponse.json({ user: { uid: user.uid, email: user.email, name: user.name } })
    }

    // Use Firebase
    const user = await signUpWithEmail(email, password, name)
    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Signup error:", error)

    if (error.message.includes("email-already-in-use") || error.message.includes("User already exists")) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 })
    }

    if (error.message.includes("weak-password")) {
      return NextResponse.json({ error: "Password should be at least 6 characters" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 })
  }
}
