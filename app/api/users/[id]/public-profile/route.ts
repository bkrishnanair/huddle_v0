import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { doc, getDoc } from "firebase/firestore";
import { getEventCountsForUser } from "@/lib/db"; // Assuming this function exists

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userData = userSnap.data();
        const stats = await getEventCountsForUser(userId);

        const publicProfile = {
            displayName: userData.displayName || "Huddle User",
            photoURL: userData.photoURL || null,
            bio: userData.bio || null,
            favoriteSports: userData.favoriteSports || [],
        };

        return NextResponse.json({ profile: publicProfile, stats });

    } catch (error) {
        console.error(`Error fetching public profile for user ${params.id}:`, error);
        return NextResponse.json({ error: "Failed to fetch public profile" }, { status: 500 });
    }
}
