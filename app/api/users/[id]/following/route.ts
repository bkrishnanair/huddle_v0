import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getFollowing } from "@/lib/db"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params

        const user = await getServerCurrentUser()
        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const idsOnly = searchParams.get("idsOnly") === "true"

        if (idsOnly) {
            // Return just the array of strings for the client hook cache
            const adminDb = getFirebaseAdminDb();
            if (!adminDb) throw new Error("Firebase Admin not initialized");
            const followingRef = adminDb.collection("users").doc(id).collection("following");
            const snapshot = await followingRef.get();
            const followingIds = snapshot.docs.map(doc => doc.id);
            return NextResponse.json({ followingIds })
        }

        const following = await getFollowing(id)

        // filter sensitive info before returning
        const safeProfiles = following.map((f: any) => ({
            uid: f.uid,
            displayName: f.displayName || f.name,
            photoURL: f.photoURL,
            bio: f.bio,
        }))

        return NextResponse.json({ following: safeProfiles })
    } catch (error) {
        console.error("Fetch following error:", error)
        return NextResponse.json({ error: "Failed to fetch following" }, { status: 500 })
    }
}
