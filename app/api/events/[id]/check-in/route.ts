export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { setCheckInStatus, attendeeSelfCheckIn, checkInPlayer } from "@/lib/db"
import { z } from "zod"

const checkInSchema = z.object({
    action: z.enum(["open", "close", "self_check_in", "organizer_check_in"]),
    targetUserId: z.string().optional(),
    status: z.boolean().optional(),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const user = await getServerCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }

        const body = await request.json()
        const validationResult = checkInSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
        }

        const { action, targetUserId, status } = validationResult.data
        let updatedEvent = null;

        if (action === "open") {
            updatedEvent = await setCheckInStatus(id, user.uid, true)
        } else if (action === "close") {
            updatedEvent = await setCheckInStatus(id, user.uid, false)
        } else if (action === "self_check_in") {
            updatedEvent = await attendeeSelfCheckIn(id, user.uid)
        } else if (action === "organizer_check_in") {
            if (!targetUserId) {
                return NextResponse.json({ error: "Target user ID required for organizer check in" }, { status: 400 })
            }
            updatedEvent = await checkInPlayer(id, targetUserId, user.uid, status ?? true)
        }

        return NextResponse.json({ success: true, event: updatedEvent })
    } catch (error: any) {
        console.error("Check-in error:", error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
        }
        return NextResponse.json({ error: error.message || "Failed to process check-in" }, { status: 500 })
    }
}
