export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { sendMessage, getChatMessages } from "@/lib/db"
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { loadEventAccess } from "@/lib/event-access"
import { z } from "zod"

const chatSchema = z.object({
  action: z.enum(["send", "pin"]).optional().default("send"),
  message: z.string().trim().min(1, "Message cannot be empty").max(500, "Message too long (max 500 characters)"),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getServerCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const limitCheck = await checkRateLimit(user.uid, 'event_chat', 30, 60000, getClientIp(request)); // 30 per minute
    if (!limitCheck.success) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }

    // Posting into an event chat requires being in the event. Same reasoning as
    // the GET handler: the Admin SDK bypasses the Firestore rule that covers this.
    const { exists, access } = await loadEventAccess(id, user.uid)
    if (!exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }
    if (!access.canSeeRoster) {
      return NextResponse.json({ error: "Forbidden: You are not a participant in this event" }, { status: 403 })
    }

    const body = await request.json()
    const validationResult = chatSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
    }

    const { message, action } = validationResult.data

    // Attempt multiple fallbacks for the display name
    let displayName = user.name || user.displayName;

    if (!displayName || displayName === "Anonymous") {
      const adminDb = (await import("@/lib/firebase-admin")).getFirebaseAdminDb();
      if (adminDb) {
        const userDoc = await adminDb.collection("users").doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          displayName = userData?.displayName || userData?.name;
        }
      }
    }

    // Ultra-fallback to Email or Anonymous
    if (!displayName) {
      displayName = user.email ? user.email.split('@')[0] : "Anonymous";
    }

    if (action === "pin") {
      const adminDb = (await import("@/lib/firebase-admin")).getFirebaseAdminDb();
      if (!adminDb) throw new Error("Firebase admin db not found");

      const eventRef = adminDb.collection("events").doc(id);
      const eventDoc = await eventRef.get();
      if (!eventDoc.exists) return NextResponse.json({ error: "Event not found" }, { status: 404 });
      if (eventDoc.data()?.createdBy !== user.uid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      await eventRef.update({ pinnedMessage: message, lastAnnouncementAt: new Date().toISOString() });

      // Notify users about the pinned announcement
      const eventData = eventDoc.data();
      if (eventData?.players && Array.isArray(eventData.players)) {
        try {
          const { createNotification } = await import("@/lib/db");

          // Don't notify the organizer about their own announcement
          const playersToNotify = eventData.players.filter((pId: string) => pId !== user.uid);

          Promise.all(playersToNotify.map((pId: string) =>
            createNotification({
              userId: pId,
              type: "event_announcement",
              message: `New announcement for "${eventData.title || eventData.name}": ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
              eventId: id
            })
          )).catch(e => console.error("Error creating announcement notifications:", e));
        } catch (e) {
          console.error("Failed to emit announcement notifications", e);
        }
      }

      return NextResponse.json({ success: true, pinnedMessage: message });
    }

    await sendMessage(id, user.uid, displayName, message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Chat message error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await getServerCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // firestore.rules gates chat behind isEventParticipant(), but this route
    // reads through the Admin SDK, which bypasses rules — so the check has to
    // happen here or it does not happen at all. Without it any signed-in user,
    // including a one-click anonymous account, could read any event's chat.
    const { exists, access } = await loadEventAccess(id, user.uid)
    if (!exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }
    if (!access.canSeeRoster) {
      return NextResponse.json({ error: "Forbidden: You are not a participant in this event" }, { status: 403 })
    }

    const messages = await getChatMessages(id)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Get chat messages error:", error)
    return NextResponse.json({ error: "Failed to get messages" }, { status: 500 })
  }
}
