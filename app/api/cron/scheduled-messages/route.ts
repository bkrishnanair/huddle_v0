export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import { getFirebaseAdminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"

export async function GET(request: NextRequest) {
    try {
        // Basic auth check for Vercel Cron. If CRON_SECRET is empty locally, it allows it.
        const authHeader = request.headers.get('authorization');
        const { searchParams } = new URL(request.url);
        const isForce = searchParams.get('force') === 'true';

        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}` && !isForce) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminDb = getFirebaseAdminDb()
        if (!adminDb) {
            return NextResponse.json({ error: "Database unavailable" }, { status: 500 })
        }

        const now = new Date()

        // Fetch all events. In production with a huge DB, we'd add a "hasPendingMessages: true" boolean 
        // to GameEvent and index it to only fetch events needing processing.
        const eventsSnapshot = await adminDb.collection("events").get()

        let processedCount = 0;

        for (const doc of eventsSnapshot.docs) {
            const event = doc.data()
            if (!event.scheduledMessages || !Array.isArray(event.scheduledMessages)) continue;

            let needsUpdate = false;
            const updatedMessages = [...event.scheduledMessages];
            let newPinnedMessage = event.pinnedMessage;

            for (let i = 0; i < updatedMessages.length; i++) {
                const msg = updatedMessages[i]

                if (!msg.sent && new Date(msg.scheduledFor) <= now) {
                    // Push to chat subcolleciton
                    const chatRef = doc.ref.collection("chat").doc()
                    await chatRef.set({
                        message: msg.message,
                        userId: event.createdBy,
                        userName: event.organizerName + " (Organizer)",
                        timestamp: FieldValue.serverTimestamp(),
                    })

                    if (msg.isAnnouncement) {
                        newPinnedMessage = msg.message;
                    }

                    updatedMessages[i] = { ...msg, sent: true }
                    needsUpdate = true;
                    processedCount++;
                }
            }

            if (needsUpdate) {
                await doc.ref.update({
                    scheduledMessages: updatedMessages,
                    ...(newPinnedMessage !== event.pinnedMessage ? { pinnedMessage: newPinnedMessage } : {})
                })
            }
        }

        return NextResponse.json({ success: true, processedMessages: processedCount })
    } catch (error) {
        console.error("Cron Error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
