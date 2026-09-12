import "server-only";

export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { adminDb } from "@/lib/firebase-admin"
import { getEventCountsForUser, getUserJoinedEvents } from "@/lib/db"
import { profileUpdateInput } from '@/lib/request-schemas'

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
      savedQuestions: userData?.savedQuestions || [],
      savedTransitTips: userData?.savedTransitTips || [],
      notifyAnnouncements: userData?.notifyAnnouncements ?? true,
      notifyPromotions: userData?.notifyPromotions ?? true,
      notifyReminders: userData?.notifyReminders ?? true,
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

    // Calculate Reliability Score from past events
    let attended = 0;
    let noShows = 0;
    pastEvents.forEach((ev: any) => {
      // Only count events where Check-In was used by the organizer at all
      if (ev.checkInOpen || (ev.checkIns && Object.keys(ev.checkIns).length > 0)) {
        if (ev.checkIns && ev.checkIns[requestedUserId]) {
          attended++;
        } else {
          noShows++;
        }
      }
    });

    const totalTracked = attended + noShows;
    const reliabilityScore = totalTracked > 0 ? Math.round((attended / totalTracked) * 100) : null;

    // Fetch efficient Subcollection Counts (Firestore Count query handles this server-side without document reads limit issues)
    const followersSnapshot = await adminDb.collection("users").doc(requestedUserId).collection("followers").count().get();
    const followingSnapshot = await adminDb.collection("users").doc(requestedUserId).collection("following").count().get();
    const followerCount = followersSnapshot.data().count;
    const followingCount = followingSnapshot.data().count;

    return NextResponse.json({ profile, stats, pastEvents, reliabilityScore, totalTracked, followerCount, followingCount })
  } catch (error) {
    console.error(`Error fetching profile for user:`, error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestedUserId } = await params;
    const currentUser = await getServerCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (currentUser.uid !== requestedUserId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database service unavailable" }, { status: 503 })
    }

    const validation = profileUpdateInput.safeParse(await request.json().catch(() => null));
    if (!validation.success) return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
    const body = validation.data;

    // Whitelist allowed fields for update.
    //
    // Type-checked rather than presence-checked. `if (x !== undefined)` accepted
    // an object or an array as a display name and wrote it straight to the
    // document; the sibling route app/api/users/profile/route.ts:9-12 enforces
    // min(3).max(50) on the same field, so the two disagreed and the looser one
    // was reachable.
    const updates: Record<string, any> = {};
    if (Array.isArray(body.savedQuestions)) updates.savedQuestions = body.savedQuestions;
    if (Array.isArray(body.savedTransitTips)) updates.savedTransitTips = body.savedTransitTips;
    if (body.displayName !== undefined) {
      const name = typeof body.displayName === "string" ? body.displayName.trim() : "";
      // Rejected explicitly rather than dropped, so a too-short name reports
      // itself instead of falling through to "No valid fields to update".
      if (name.length < 3 || name.length > 50) {
        return NextResponse.json(
          { error: "Display name must be between 3 and 50 characters" },
          { status: 400 },
        );
      }
      updates.displayName = name;
    }
    if (body.bio !== undefined) {
      if (typeof body.bio !== "string" || body.bio.length > 160) {
        return NextResponse.json(
          { error: "Bio must be text of 160 characters or fewer" },
          { status: 400 },
        );
      }
      updates.bio = body.bio;
    }
    if (typeof body.notifyAnnouncements === "boolean") updates.notifyAnnouncements = body.notifyAnnouncements;
    if (typeof body.notifyPromotions === "boolean") updates.notifyPromotions = body.notifyPromotions;
    if (typeof body.notifyReminders === "boolean") updates.notifyReminders = body.notifyReminders;
    // Sent by components/onboarding-wizard.tsx and previously dropped on the
    // floor, because it was never in this list.
    if (typeof body.onboardingComplete === "boolean") updates.onboardingComplete = body.onboardingComplete;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const userRef = adminDb.collection("users").doc(requestedUserId);
    await userRef.set(updates, { merge: true });

    return NextResponse.json({ success: true, updates });
  } catch (error) {
    console.error(`Error updating profile:`, error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
