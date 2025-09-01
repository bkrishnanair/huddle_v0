import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { db } from "@/lib/firebase-admin"
import { z } from "zod"

const acceptSchema = z.object({
  requesterId: z.string().min(1, "Requester user ID is required"),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getServerCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = acceptSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
    }

    const { requesterId } = validationResult.data

    // A user cannot accept their own request
    if (requesterId === user.uid) {
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
    }

    const currentUserConnectionRef = db
      .collection("users")
      .doc(user.uid)
      .collection("connections")
      .doc(requesterId)
    
    const requesterConnectionRef = db
      .collection("users")
      .doc(requesterId)
      .collection("connections")
      .doc(user.uid)

    // Use a transaction to ensure both documents are updated atomically
    await db.runTransaction(async (transaction) => {
      const connectionDoc = await transaction.get(currentUserConnectionRef)

      if (!connectionDoc.exists || connectionDoc.data()?.status !== "pending") {
        throw new Error("No pending connection request found from this user.")
      }
      
      // Update the current user's connection doc: pending -> accepted
      transaction.update(currentUserConnectionRef, {
        status: "accepted",
        acceptedAt: new Date(),
      })
      
      // Create the corresponding connection doc for the requester: accepted
      transaction.set(requesterConnectionRef, {
        status: "accepted",
        acceptedAt: new Date(),
      })
    })

    return NextResponse.json({ success: true, message: "Connection accepted." })
  } catch (error: any) {
    console.error("Error accepting connection request:", error)
    if (error.message.includes("No pending connection request")) {
        return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to accept connection request" }, { status: 500 })
  }
}
