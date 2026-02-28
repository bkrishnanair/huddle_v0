export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: uid } = await params;
        const user = await getServerCurrentUser()

        if (!user || user.uid !== uid) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const adminDb = getFirebaseAdminDb()
        if (!adminDb) {
            return NextResponse.json({ error: "Database service unavailable" }, { status: 500 })
        }

        const notificationsRef = adminDb.collection("users").doc(uid).collection("notifications")
        const snapshot = await notificationsRef.orderBy("createdAt", "desc").limit(50).get()

        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        return NextResponse.json({ notifications })
    } catch (error) {
        console.error("Error fetching notifications:", error)
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: uid } = await params;
        const user = await getServerCurrentUser()

        if (!user || user.uid !== uid) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { notificationId } = body

        if (!notificationId) {
            return NextResponse.json({ error: "Notification ID is required" }, { status: 400 })
        }

        const adminDb = getFirebaseAdminDb()
        if (!adminDb) {
            return NextResponse.json({ error: "Database service unavailable" }, { status: 500 })
        }

        const notificationRef = adminDb
            .collection("users")
            .doc(uid)
            .collection("notifications")
            .doc(notificationId)

        await notificationRef.update({
            read: true
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating notification:", error)
        return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
    }
}
