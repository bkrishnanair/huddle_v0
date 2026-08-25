export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getFirebaseAdminDb } from "@/lib/firebase-admin";
import { getEventCountsForUser, getUserJoinedEvents } from "@/lib/db";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await props.params;
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const adminDb = getFirebaseAdminDb();
    if (!adminDb) {
      console.error("[Public Profile] Firebase Admin Firestore not initialized");
      return NextResponse.json({ error: "Database service unavailable" }, { status: 503 });
    }

    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();

    // Project ONLY safe public fields (exclude email, fcmTokens, etc.)
    const publicProfile = {
      uid: userId,
      displayName: userData?.displayName || userData?.name || "Huddle User",
      photoURL: userData?.photoURL || null,
      bio: userData?.bio || null,
      favoriteSports: userData?.favoriteSports || [],
      createdAt: userData?.createdAt || null,
    };

    const stats = await getEventCountsForUser(userId);
    const joinedEvents = await getUserJoinedEvents(userId);
    const now = Date.now();

    const pastEvents = (joinedEvents || [])
      .filter((event: any) => {
        if (!event.date || event.date.includes("/")) return false;
        try {
          const eventDateTime = new Date(`${event.date}T${event.time || "00:00"}`);
          return !isNaN(eventDateTime.getTime()) && eventDateTime.getTime() < now;
        } catch {
          return false;
        }
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
        const dateB = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
        return dateB - dateA;
      });

    // Calculate reliability score from past tracked events
    let attended = 0;
    let noShows = 0;
    pastEvents.forEach((ev: any) => {
      if (ev.checkInOpen || (ev.checkIns && Object.keys(ev.checkIns).length > 0)) {
        if (ev.checkIns && ev.checkIns[userId]) {
          attended++;
        } else {
          noShows++;
        }
      }
    });

    const totalTracked = attended + noShows;
    const reliabilityScore = totalTracked > 0 ? Math.round((attended / totalTracked) * 100) : null;

    // Follower and following count aggregations
    let followerCount = 0;
    let followingCount = 0;
    try {
      const followersSnap = await adminDb.collection("users").doc(userId).collection("followers").count().get();
      const followingSnap = await adminDb.collection("users").doc(userId).collection("following").count().get();
      followerCount = followersSnap.data().count;
      followingCount = followingSnap.data().count;
    } catch {
      // Non-blocking fallback
    }

    return NextResponse.json({
      profile: publicProfile,
      stats,
      pastEvents,
      reliabilityScore,
      totalTracked,
      followerCount,
      followingCount,
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json({ error: "Failed to fetch public profile" }, { status: 500 });
  }
}
