import { type NextRequest, NextResponse } from "next/server"
import { getFirebaseAdminAuth } from "@/lib/firebase-admin"
import { getUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 })
    }

    // Check if Firebase is configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return NextResponse.json({ error: "Firebase is not configured" }, { status: 500 })
    }

    // Verify token with Firebase Admin SDK
    const adminAuth = getFirebaseAdminAuth()
    if (!adminAuth) {
      throw new Error("Firebase Admin Auth is not initialized")
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken)
    console.log("🔥 Server-side token verification successful")

    // Get user profile from database
    const userProfile = await getUser(decodedToken.uid)

    const user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: userProfile?.name || decodedToken.name || "User",
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Login error:", error)

    if (error.code === "auth/id-token-expired") {
      return NextResponse.json({ error: "Session expired. Please sign in again." }, { status: 401 })
    }

    if (error.code === "auth/id-token-revoked") {
      return NextResponse.json({ error: "Session revoked. Please sign in again." }, { status: 401 })
    }

    return NextResponse.json({ error: "Authentication failed. Please try again." }, { status: 500 })
  }
}
