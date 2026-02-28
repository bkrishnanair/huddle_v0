export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { toggleUserBlock } from "@/lib/db"
import { z } from "zod"

const blockSchema = z.object({
    targetUserId: z.string().min(1, "Target User ID is required"),
    block: z.boolean()
})

export async function POST(request: NextRequest) {
    try {
        const user = await getServerCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const validationResult = blockSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
        }

        const { targetUserId, block } = validationResult.data

        if (user.uid === targetUserId) {
            return NextResponse.json({ error: "Cannot block yourself." }, { status: 400 })
        }

        await toggleUserBlock(user.uid, targetUserId, block)

        return NextResponse.json({ success: true, message: block ? "User blocked" : "User unblocked" })

    } catch (error) {
        console.error("Error managing block list:", error)
        return NextResponse.json({ error: "Failed to update block list" }, { status: 500 })
    }
}
