export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { sendMessage, getChatMessages } from "@/lib/db"
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

    const body = await request.json()
    const validationResult = chatSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
    }

    const { message, action } = validationResult.data
    const displayName = user.name || user.displayName || "Anonymous"

    if (action === "pin") {
      const adminDb = (await import("@/lib/firebase-admin")).getFirebaseAdminDb();
      if (!adminDb) throw new Error("Firebase admin db not found");

      const eventRef = adminDb.collection("events").doc(id);
      const eventDoc = await eventRef.get();
      if (!eventDoc.exists) return NextResponse.json({ error: "Event not found" }, { status: 404 });
      if (eventDoc.data()?.createdBy !== user.uid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      await eventRef.update({ pinnedMessage: message });
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

    const messages = await getChatMessages(id)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Get chat messages error:", error)
    return NextResponse.json({ error: "Failed to get messages" }, { status: 500 })
  }
}
