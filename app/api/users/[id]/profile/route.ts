export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { adminDb } from "@/lib/firebase-admin"
import { getEventCountsForUser, getUserJoinedEvents } from "@/lib/db"

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestedUserId } = await params;
    // Authenticate the user
    const currentUser = await getServerCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (!requestedUserId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Security check: User can only access their own profile data
    if (currentUser.uid !== requestedUserId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get user profile data from Firestore using Admin SDK
    if (!adminDb) {
      console.error("Firebase Admin Firestore not initialized")
      return NextResponse.json({ error: "Database service unavailable" }, { status: 503 })
    }

    const userRef = adminDb.collection("users").doc(requestedUserId)
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

    const stats = await getEventCountsForUser(requestedUserId);
    const joinedEvents = await getUserJoinedEvents(requestedUserId);
    const now = Date.now();

    // Process and sort for strictly past events
    const pastEvents = joinedEvents
      .filter((event: any) => {
        if (!event.date || event.date.includes('/')) return false;
        try {
          const eventDateTime = new Date(`${event.date}T${event.time || '00:00'}`);
          return !isNaN(eventDateTime.getTime()) && eventDateTime.getTime() < now;
        } catch (e) {
          return false;
        }
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
        const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
        return dateB - dateA; // Most recent past events first
      });

    return NextResponse.json({ profile, stats, pastEvents })
  } catch (error) {
    console.error(`Error fetching profile for user:`, error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}