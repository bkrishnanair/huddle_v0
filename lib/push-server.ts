import 'server-only'

import { getFirebaseAdminDb } from '@/lib/firebase-admin'

export interface PushPayload {
  title: string
  body: string
  url?: string
  type?: "waitlist_promo" | "event_update" | "event_announcement" | "general" | "rsvp_update" | "serendipity_nudge" | "friend_attending" | "post_event" | "event_reminder" | "new_event_from_followed"
}

export async function sendPushToUser(uid: string, payload: PushPayload) {
  return sendPushToUsers([uid], payload)
}

export async function sendPushToUsers(uids: string[], payload: PushPayload) {
  const adminDb = getFirebaseAdminDb()
  if (!adminDb) return { success: false, error: "Database unavailable" }

  const results = {
    successCount: 0,
    failureCount: 0,
    tokensRemoved: 0
  }

  try {
    // We only load firebase-admin/messaging dynamically here so it's not accidentally bundled
    const { getMessaging } = await import('firebase-admin/messaging')
    const { FieldValue } = await import('firebase-admin/firestore')
    const messaging = getMessaging()

    // 1. Fetch user documents to get tokens and check preferences
    const tokensToUsers = new Map<string, string>() // token -> uid
    const activeTokens: string[] = []

    // Chunk fetching users (max 30 for where-in if we used it, but doing Promise.all is safer for arbitrary numbers)
    // We will batch user fetches
    const usersBatchSize = 100
    for (let i = 0; i < uids.length; i += usersBatchSize) {
      const chunk = uids.slice(i, i + usersBatchSize)
      const snaps = await Promise.all(chunk.map(id => adminDb.collection('users').doc(id).get()))
      
      snaps.forEach(snap => {
        if (!snap.exists) return
        const data = snap.data()
        if (!data?.pushEnabled || !data?.fcmTokens || data.fcmTokens.length === 0) return

        // Preference checks mirroring createNotification
        let shouldNotify = true
        if (payload.type === "event_announcement" || payload.type === "event_update") {
          if (data.notifyAnnouncements === false) shouldNotify = false
        } else if (payload.type === "waitlist_promo") {
          if (data.notifyPromotions === false) shouldNotify = false
        } else if (payload.type === "rsvp_update" || payload.type === "event_reminder") {
          if (data.notifyReminders === false) shouldNotify = false
        }

        if (shouldNotify) {
          data.fcmTokens.forEach((token: string) => {
            activeTokens.push(token)
            tokensToUsers.set(token, snap.id)
          })
        }
      })
    }

    if (activeTokens.length === 0) {
      return results
    }

    // 2. Batch by 500 (FCM limit)
    const tokenChunks = []
    for (let i = 0; i < activeTokens.length; i += 500) {
      tokenChunks.push(activeTokens.slice(i, i + 500))
    }

    for (const chunk of tokenChunks) {
      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: {
          url: payload.url || '/',
          type: payload.type || 'general',
        },
        tokens: chunk,
      }

      const response = await messaging.sendEachForMulticast(message)
      results.successCount += response.successCount
      results.failureCount += response.failureCount

      if (response.failureCount > 0) {
        const tokensToRemoveByUid = new Map<string, string[]>()

        response.responses.forEach((resp, idx) => {
          if (!resp.success && resp.error) {
            if (
              resp.error.code === 'messaging/registration-token-not-registered' ||
              resp.error.code === 'messaging/invalid-registration-token'
            ) {
              const deadToken = chunk[idx]
              const uid = tokensToUsers.get(deadToken)
              if (uid) {
                if (!tokensToRemoveByUid.has(uid)) {
                  tokensToRemoveByUid.set(uid, [])
                }
                tokensToRemoveByUid.get(uid)!.push(deadToken)
              }
            }
          }
        })

        // Clean up dead tokens
        const removePromises = []
        for (const [uid, tokens] of tokensToRemoveByUid.entries()) {
          removePromises.push(
            adminDb.collection('users').doc(uid).update({
              fcmTokens: FieldValue.arrayRemove(...tokens)
            })
          )
          results.tokensRemoved += tokens.length
        }
        await Promise.allSettled(removePromises)
      }
    }

    return results

  } catch (error) {
    console.error("Push dispatch error:", error)
    return { ...results, error: String(error) }
  }
}
