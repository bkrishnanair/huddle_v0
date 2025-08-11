import { type NextRequest, NextResponse } from "next/server"
import { signInWithEmail } from "@/lib/auth"
import { getUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if Firebase is configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      // Use fallback in-memory storage
      const { fallbackSignIn } = await import("@/lib/fallback-db")
      const user = await fallbackSignIn(email, password)
      return NextResponse.json({ user: { uid: user.uid, email: user.email, name: user.name } })
    }

    // Use Firebase
    const authUser = await signInWithEmail(email, password)
    const userProfile = await getUser(authUser.uid)

    const user = {
      uid: authUser.uid,
      email: authUser.email,
      name: userProfile?.name || "User",
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Login error:", error)

    if (
      error.message.includes("user-not-found") ||
      error.message.includes("wrong-password") ||
      error.message.includes("Invalid credentials")
    ) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (error.message.includes("too-many-requests")) {
      return NextResponse.json({ error: "Too many failed attempts. Please try again later." }, { status: 429 })
    }

    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 })
  }
}
