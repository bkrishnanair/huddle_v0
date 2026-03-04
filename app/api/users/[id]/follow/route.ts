import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { toggleFollowUser } from "@/lib/db"
import { z } from "zod"

const followSchema = z.object({
    isFollowing: z.boolean(),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params // id is the target user's ID
        const user = await getServerCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }

        if (user.uid === id) {
            return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
        }

        const body = await request.json()
        const validationResult = followSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
        }

        const { isFollowing } = validationResult.data

        await toggleFollowUser(user.uid, id, isFollowing)

        return NextResponse.json({ success: true, isFollowing })
    } catch (error: any) {
        console.error("Follow error:", error)
        if (error.message === "UNAUTHORIZED_BLOCK") {
            return NextResponse.json({ error: "You cannot follow this user." }, { status: 403 })
        }
        return NextResponse.json({ error: "Failed to update follow status" }, { status: 500 })
    }
}
