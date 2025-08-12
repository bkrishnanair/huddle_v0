import { type NextRequest, NextResponse } from "next/server"
import { signInWithGoogle } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase is configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return NextResponse.json({ error: "Firebase not configured" }, { status: 500 })
    }

    // Use Firebase Google Sign-in
    const user = await signInWithGoogle()

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Google sign-in error:", error)

    if (error.message.includes("popup-closed-by-user")) {
      return NextResponse.json({ error: "Sign-in was cancelled" }, { status: 400 })
    }

    if (error.message.includes("popup-blocked")) {
      return NextResponse.json({ error: "Popup was blocked. Please allow popups and try again." }, { status: 400 })
    }

    return NextResponse.json({ error: "Google sign-in failed. Please try again." }, { status: 500 })
  }
}
