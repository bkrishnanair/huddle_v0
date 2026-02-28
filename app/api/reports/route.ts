export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { reportItem } from "@/lib/db"
import { z } from "zod"

const reportSchema = z.object({
    targetId: z.string().min(1, "Target ID is required"),
    itemType: z.enum(["user", "event", "photo"]),
    reason: z.string().min(1, "Reason is required"),
    details: z.string().optional()
})

export async function POST(request: NextRequest) {
    try {
        const user = await getServerCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const validationResult = reportSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
        }

        const { targetId, itemType, reason, details } = validationResult.data

        await reportItem({
            reporterId: user.uid,
            targetId,
            itemType,
            reason,
            details
        })

        return NextResponse.json({ success: true, message: "Report submitted successfully" })

    } catch (error) {
        console.error("Error submitting report:", error)
        return NextResponse.json({ error: "Failed to submit report" }, { status: 500 })
    }
}
