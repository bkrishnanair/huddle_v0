import 'server-only';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the current window rolls over. Use for the Retry-After header. */
  retryAfterSeconds: number;
}

/**
 * Enforces a rate limit for a specific user and action using Firestore.
 * Uses FieldValue.increment to ensure atomic counter updates without read-modify-write.
 * 
 * @param uid The authenticated user ID
 * @param action The action identifier (e.g., 'ai_enhance')
 * @param limit The maximum number of requests allowed in the window
 * @param windowMs The time window in milliseconds (default: 1 hour)
 */
export async function checkRateLimit(
  uid: string,
  action: string,
  limit: number = 20,
  windowMs: number = 3600000
): Promise<RateLimitResult> {
  const adminDb = getFirebaseAdminDb();
  if (!adminDb) {
    throw new Error('Database unavailable for rate limiting');
  }

  const now = Date.now();
  // Group windows by mathematical division to avoid tracking individual timestamps
  const windowId = Math.floor(now / windowMs);
  const docId = `${uid}_${action}_${windowId}`;

  const rateLimitRef = adminDb.collection('rateLimits').doc(docId);

  // Optimistically increment first (avoids a read-before-write race condition)
  await rateLimitRef.set(
    {
      count: FieldValue.increment(1),
      expiresAt: new Date(now + windowMs).toISOString(),
    },
    { merge: true }
  );

  // Then read the updated count
  const docSnap = await rateLimitRef.get();
  const count = docSnap.data()?.count || 1;

  const remaining = Math.max(0, limit - count);
  // Windows are fixed buckets, so the reset is the start of the next bucket.
  const windowEndsAt = (windowId + 1) * windowMs;
  const retryAfterSeconds = Math.max(1, Math.ceil((windowEndsAt - now) / 1000));

  return {
    success: count <= limit,
    limit,
    remaining,
    retryAfterSeconds,
  };
}
