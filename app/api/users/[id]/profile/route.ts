import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { admin } from "@/lib/firebase-admin"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate the user
    const currentUser = await getServerCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const requestedUserId = params.id
    if (!requestedUserId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Security check: User can only access their own profile data
    if (currentUser.uid !== requestedUserId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get user profile data from Firestore using Admin SDK
    const db = admin.firestore()
    const userRef = db.collection("users").doc(requestedUserId)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = userDoc.data()
    
    // Return user's complete profile data (private data included since it's their own profile)
    const profile = {
      uid: requestedUserId,
      email: currentUser.email,
      displayName: userData?.displayName || "",
      bio: userData?.bio || "",
      favoriteSports: userData?.favoriteSports || [],
      photoURL: userData?.photoURL || null,
      createdAt: userData?.createdAt || null,
      fcmTokens: userData?.fcmTokens || [],
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error(`Error fetching profile for user ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}