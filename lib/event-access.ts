import 'server-only';

/**
 * Shared authorisation vocabulary for a single event.
 *
 * Extracted from app/api/events/[id]/attendees/route.ts, which was the only
 * route that got this right. Routes that serve anything beyond the public
 * projection of an event should decide with these helpers rather than
 * re-deriving the checks, so the tiers cannot drift apart per route.
 */

export interface EventAccess {
  /** Created the event. */
  isOrganizer: boolean;
  /** Named in the event's `admins` array. */
  isEventAdmin: boolean;
  /** RSVP'd — present in `players`. */
  isMember: boolean;
  /** May see the roster at all. */
  canSeeRoster: boolean;
  /**
   * May see operational detail — a member's private note, their pickup point,
   * their no-show record. Organisers and event admins only: one attendee must
   * never see another attendee's attendance history.
   */
  canSeeAttendeeDetail: boolean;
}

/**
 * Derives the caller's access tier from a raw event document.
 *
 * `eventData` is the raw Firestore document data, not a projected event —
 * `createdBy`, `admins` and `players` must all be present.
 */
export async function loadEventAccess(
  eventId: string,
  uid: string,
): Promise<{ exists: boolean; eventData?: Record<string, unknown>; access: EventAccess }> {
  const { getFirebaseAdminDb } = await import('@/lib/firebase-admin');
  const adminDb = getFirebaseAdminDb();
  if (!adminDb) throw new Error('Database service unavailable');

  const snap = await adminDb.collection('events').doc(eventId).get();
  if (!snap.exists) {
    return { exists: false, access: getEventAccess(undefined, uid) };
  }
  const eventData = snap.data() as Record<string, unknown>;
  return { exists: true, eventData, access: getEventAccess(eventData, uid) };
}

export function getEventAccess(
  eventData: Record<string, unknown> | undefined,
  uid: string,
): EventAccess {
  const isOrganizer = eventData?.createdBy === uid;
  const admins = eventData?.admins;
  const isEventAdmin = Array.isArray(admins) && admins.includes(uid);
  const players = eventData?.players;
  const isMember = Array.isArray(players) && players.includes(uid);

  return {
    isOrganizer,
    isEventAdmin,
    isMember,
    canSeeRoster: isOrganizer || isEventAdmin || isMember,
    canSeeAttendeeDetail: isOrganizer || isEventAdmin,
  };
}
