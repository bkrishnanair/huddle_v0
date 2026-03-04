import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getFollowers } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params

        // Auth check is optional for viewing public followers, but we'll enforce it for now to prevent scraping,
        // or just let it pass if public profiles are a thing. Let's enforce auth.
        const user = await getServerCurrentUser()
        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }

        const followers = await getFollowers(id)

        // filter sensitive info before returning
        const safeProfiles = followers.map((f: any) => ({
            uid: f.uid,
            displayName: f.displayName || f.name,
            photoURL: f.photoURL,
            bio: f.bio,
        }))

        return NextResponse.json({ followers: safeProfiles })
    } catch (error) {
        console.error("Fetch followers error:", error)
        return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 })
    }
}
