import { type NextRequest, NextResponse } from "next/server"
import { verifyIdToken, getFirebaseAdminDb } from "@/lib/firebase-admin"

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("🚨 Auth error: Missing or invalid authorization header")
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
    }

    const idToken = authHeader.split("Bearer ")[1]
    console.log("🔍 Verifying token for /api/auth/me")

    // Verify token with Firebase Admin SDK
    const decodedToken = await verifyIdToken(idToken)

    if (!decodedToken) {
      console.log("🚨 Auth error: Invalid token")
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    console.log("✅ Token verified for user:", decodedToken.uid)

    const adminDb = getFirebaseAdminDb()
    if (!adminDb) {
      console.error("🚨 Firebase Admin Firestore not initialized")
      return NextResponse.json({ error: "Database service unavailable" }, { status: 503 })
    }

    // Get user profile using Firebase Admin SDK
    console.log("🔍 Fetching user profile from Firestore using Admin SDK")
    const userRef = adminDb.collection("users").doc(decodedToken.uid)
    const userDoc = await userRef.get()

    let userProfile = null
    if (userDoc.exists) {
      userProfile = { id: userDoc.id, ...userDoc.data() }
      console.log("✅ User profile found:", userProfile.name || userProfile.email)
    } else {
      console.log("⚠️ User profile not found, creating from token data")
      // Create user profile if it doesn't exist
      const newUserData = {
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email?.split("@")[0] || "User",
        createdAt: new Date(),
      }
      await userRef.set(newUserData)
      userProfile = { id: decodedToken.uid, ...newUserData }
      console.log("✅ Created new user profile:", userProfile.name)
    }

    const response = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: userProfile.name || decodedToken.name || "User",
    }

    console.log("✅ /api/auth/me success for user:", response.name)
    return NextResponse.json(response)
  } catch (error: any) {
    console.error("🚨 Error in /api/auth/me:", error)
    console.error("🚨 Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack?.split("\n").slice(0, 3).join("\n"),
    })

    // Provide more specific error messages
    if (error.code === "permission-denied") {
      return NextResponse.json({ error: "Firestore permission denied. Check security rules." }, { status: 403 })
    } else if (error.code === "unauthenticated") {
      return NextResponse.json({ error: "Authentication failed. Invalid token." }, { status: 401 })
    } else if (error.message?.includes("Firebase Admin")) {
      return NextResponse.json({ error: "Firebase Admin SDK not properly configured." }, { status: 503 })
    }

    return NextResponse.json({ error: "Internal server error. Check server logs." }, { status: 500 })
  }
}
