import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { db } from "@/lib/firebase-admin"
import { z } from "zod"

const requestSchema = z.object({
  targetUserId: z.string().min(1, "Target user ID is required"),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getServerCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = requestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
    }

    const { targetUserId } = validationResult.data

    if (targetUserId === user.uid) {
      return NextResponse.json({ error: "You cannot send a connection request to yourself" }, { status: 400 })
    }

    const targetUserRef = db.collection("users").doc(targetUserId)
    const connectionRef = targetUserRef.collection("connections").doc(user.uid)

    await connectionRef.set({
      status: "pending",
      requestedBy: user.uid,
      requestedAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending connection request:", error)
    return NextResponse.json({ error: "Failed to send connection request" }, { status: 500 })
  }
}
