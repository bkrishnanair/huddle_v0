import 'server-only';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * How much looser the per-IP budget is than the per-account one. Campus wifi
 * and university NAT put many genuine students behind one address, so this must
 * not be 1 — the IP counter exists to stop one person cycling accounts, not to
 * punish a shared network.
 */
const IP_LIMIT_MULTIPLIER = 5;

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the current window rolls over. Use for the Retry-After header. */
  retryAfterSeconds: number;
}

/**
 * Reads the caller's IP from the proxy headers Vercel sets.
 *
 * `x-forwarded-for` is a comma-separated chain; the left-most entry is the
 * original client. Returns null when no header is present (local dev, or a
 * direct invocation), in which case the caller falls back to uid-only limiting.
 */
export function getClientIp(request: { headers: { get(name: string): string | null } }): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || null;
}

/** Firestore document ids may not contain '/'. IPv6 and headers are untrusted. */
function safeKeySegment(value: string): string {
  return value.replace(/[^A-Za-z0-9_.:-]/g, '_').slice(0, 64);
}

async function bumpAndRead(
  adminDb: FirebaseFirestore.Firestore,
  docId: string,
  now: number,
  windowMs: number,
): Promise<number> {
  const ref = adminDb.collection('rateLimits').doc(docId);
  // Optimistically increment first (avoids a read-before-write race condition)
  await ref.set(
    {
      count: FieldValue.increment(1),
      expiresAt: new Date(now + windowMs).toISOString(),
    },
    { merge: true }
  );
  const snap = await ref.get();
  return snap.data()?.count || 1;
}

/**
 * Enforces a rate limit for a specific user and action using Firestore.
 * Uses FieldValue.increment to ensure atomic counter updates without read-modify-write.
 *
 * When `ip` is supplied, a second counter is kept per IP and the STRICTER of the
 * two decides. This matters because anonymous sign-in is one click
 * (lib/auth.ts:71), so a uid-only limit is reset by opening a new session — the
 * IP counter is what actually holds.
 *
 * @param uid The authenticated user ID
 * @param action The action identifier (e.g., 'ai_enhance')
 * @param limit The maximum number of requests allowed in the window
 * @param windowMs The time window in milliseconds (default: 1 hour)
 * @param ip Optional client IP, from getClientIp(request)
 */
export async function checkRateLimit(
  uid: string,
  action: string,
  limit: number = 20,
  windowMs: number = 3600000,
  ip?: string | null
): Promise<RateLimitResult> {
  const adminDb = getFirebaseAdminDb();
  if (!adminDb) {
    throw new Error('Database unavailable for rate limiting');
  }

  const now = Date.now();
  // Group windows by mathematical division to avoid tracking individual timestamps
  const windowId = Math.floor(now / windowMs);

  const uidCount = await bumpAndRead(adminDb, `${uid}_${action}_${windowId}`, now, windowMs);

  // One IP may legitimately carry several students on campus wifi, so the IP
  // budget is deliberately looser than the per-account one rather than equal.
  let count = uidCount;
  let effectiveLimit = limit;
  if (ip) {
    const ipLimit = limit * IP_LIMIT_MULTIPLIER;
    const ipCount = await bumpAndRead(
      adminDb,
      `ip:${safeKeySegment(ip)}_${action}_${windowId}`,
      now,
      windowMs,
    );
    // Whichever budget is proportionally more spent decides.
    if (ipCount / ipLimit > uidCount / limit) {
      count = ipCount;
      effectiveLimit = ipLimit;
    }
  }

  const remaining = Math.max(0, effectiveLimit - count);
  // Windows are fixed buckets, so the reset is the start of the next bucket.
  const windowEndsAt = (windowId + 1) * windowMs;
  const retryAfterSeconds = Math.max(1, Math.ceil((windowEndsAt - now) / 1000));

  return {
    success: count <= effectiveLimit,
    limit: effectiveLimit,
    remaining,
    retryAfterSeconds,
  };
}
