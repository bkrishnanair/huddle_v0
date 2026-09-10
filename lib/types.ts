export interface Player {
  id: string;
  displayName: string;
  photoURL?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  bio?: string;
  photoURL?: string;
  savedQuestions?: string[];
  savedTransitTips?: string[];
  accountType?: "individual" | "organization";
  verificationStatus?: "pending" | "verified" | "rejected";
  fcmTokens?: string[];
  pushEnabled?: boolean;
  pushPermissionAskedAt?: string | null;
  pushPermissionState?: "default" | "granted" | "denied";
}

export interface GameEvent {
  id: string;
  name: string;
  title?: string; // Alias for name
  category: string;
  sport?: string; // Alias for category
  eventType?: "in-person" | "virtual" | "hybrid"; // default: "in-person"
  virtualLink?: string | null; // URL to Zoom/Meet/Teams/custom link
  icon?: string;
  tags?: string[];
  venue: any;
  location?: any; // Alias for venue
  geopoint: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  orgLocation?: string;
  orgGeopoint?: {
    latitude: number;
    longitude: number;
  };
  date: string;
  endDate?: string;
  time: string;
  endTime?: string;
  timezone?: string; // IANA timezone (e.g. "America/New_York"). Defaults to "America/New_York" if missing.
  maxPlayers: number;
  currentPlayers: number;
  createdBy: string;
  organizerName: string;
  organizerPhotoURL?: string;
  isOrganizerVerified?: boolean;
  pinnedMessage?: string;
  players: string[];
  waitlist?: string[];
  /** @deprecated Moved to events/{id}/roster/{uid}.note — the event document is
   *  world-readable. Still present on documents that predate
   *  scripts/migrate-roster-fields.ts. Read via GET /api/events/[id]/attendees. */
  attendeeNotes?: Record<string, string>;
  /** @deprecated Moved to events/{id}/roster/{uid}.answers. See attendeeNotes. */
  attendeeAnswers?: Record<string, Record<string, string>>;
  /** @deprecated Moved to events/{id}/roster/{uid}.pickup. See attendeeNotes. */
  attendeePickup?: Record<string, string>;
  questions?: string[];
  pickupPoints?: { id: string; location: string; time: string }[];
  stayUntil?: string;
  transitTips?: string;
  playerDetails?: Player[];
  checkedInPlayers?: string[];
  checkIns?: Record<string, boolean>;
  distance?: number;
  isBoosted?: boolean;
  isPrivate?: boolean;
  scheduledMessages?: {
    id: string;
    message: string;
    scheduledFor: string; // ISO String
    sent: boolean;
    isAnnouncement: boolean; // if true, pin it when sent
  }[];
  viewCount?: number; // incremented via POST /api/events/[id]/view
  source?: "terplink" | "manual" | "claimed"; // origin of the event
  sourceUrl?: string; // link back to source (e.g. TerpLink event page)
  claimedFrom?: string; // original scraped event ID if claimed
  claimedAt?: any; // Timestamp — when the event was claimed by an organizer
  isScraped?: boolean; // true for auto-imported events
  status?: "active" | "archived" | "past"; // archived = expired by cleanup cron
  checkInOpen?: boolean;
  lastAnnouncementAt?: string; // ISO — updated when organizer pins announcement
  postEventPromptSent?: boolean; // true after post-event cron prompts organizer
  reminderSentAt?: string | null; // ISO — set by event-reminders cron
  reportedAttendance?: number; // organizer-reported actual attendance
  createdAt?: any;
  parentEventId?: string;
  recurrence?: {
    type: "weekly" | "biweekly" | "monthly";
    endDate: string;
  };
}

/** One attendee's free-text RSVP data, stored at events/{eventId}/roster/{uid}.
 *  Deny-all to clients in firestore.rules; served only by
 *  GET /api/events/[id]/attendees, which authorizes the caller. */
export interface RosterEntry {
  note?: string;
  answers?: Record<string, string>;
  pickup?: string;
  updatedAt?: any;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: "waitlist_promo" | "event_update" | "event_announcement" | "general" | "rsvp_update" | "serendipity_nudge" | "friend_attending" | "post_event" | "event_reminder" | "new_event_from_followed";
  message: string;
  eventId?: string;
  eventName?: string;
  actions?: string[];
  read: boolean;
  createdAt: string; // ISO String
}

/**
 * Fields GET /api/events may return to an unauthenticated caller.
 *
 * The events collection is world-readable by design — guest browsing is core
 * positioning and the map depends on it. That makes the list payload the wrong
 * place for roster data. Everything omitted here is either attendee PII or
 * organizer-only operational state, and lives behind
 * GET /api/events/[id]/attendees instead.
 *
 * Deliberately omitted: attendeeNotes, attendeeAnswers, attendeePickup (free
 * text written by students), checkIns, checkedInPlayers, waitlist,
 * playerDetails, reportedAttendance, scheduledMessages, questions,
 * pickupPoints, stayUntil, transitTips, pinnedMessage, lastAnnouncementAt,
 * postEventPromptSent, reminderSentAt, checkInOpen, claimedFrom, claimedAt,
 * createdAt, isBoosted, organizerPhotoURL, orgLocation, geohash, isPrivate.
 *
 * players[] is included: it is an array of UIDs with no free text, and two
 * client features read it from list data — the "Joined" filter
 * (components/map-view.tsx) and the friends-attending badge
 * (components/events/event-card.tsx).
 */
export const PUBLIC_EVENT_FIELDS = [
  "id",
  "name",
  "title",
  "category",
  "sport",
  "tags",
  "date",
  "endDate",
  "time",
  "endTime",
  "timezone",
  "geopoint",
  "orgGeopoint",
  "venue",
  "location",
  "description",
  "icon",
  "eventType",
  "virtualLink",
  "currentPlayers",
  "maxPlayers",
  "players",
  "organizerName",
  "createdBy",
  "isOrganizerVerified",
  "source",
  "isScraped",
  "sourceUrl",
  "viewCount",
  "status",
  "recurrence",
  "parentEventId",
  "distance",
  // Attached at runtime by deduplicateRecurring() in app/api/events/route.ts,
  // read by components/events/event-card.tsx. Not part of the stored document.
  "recurringCount",
  "recurrenceType",
] as const;

export type PublicEventField = (typeof PUBLIC_EVENT_FIELDS)[number];

/**
 * Copies only allowlisted fields off an event. Allowlist, not blocklist — a new
 * field added to the document is omitted until it is named here, so the default
 * for anything new is private.
 *
 * Absent keys are skipped rather than emitted as undefined, so the JSON payload
 * carries no dead keys.
 */
export function pickPublicFields<T extends Record<string, unknown>>(
  event: T,
): Partial<Record<PublicEventField, unknown>> {
  const out: Partial<Record<PublicEventField, unknown>> = {};
  for (const field of PUBLIC_EVENT_FIELDS) {
    if (event[field] !== undefined) {
      out[field] = event[field];
    }
  }
  return out;
}

/**
 * The only fields of a user document that may be shown to somebody else.
 *
 * The user document is not world-readable, but several routes hydrate it and
 * return the result — rosters, follower lists, attendee lists. Every one of
 * those previously spread the whole document, which carries `email`,
 * `lastKnownLocation` (a GeoPoint), `geohash`, `fcmTokens` and `blockedUsers`.
 *
 * Same discipline as PUBLIC_EVENT_FIELDS: an allowlist, so a field added to the
 * user document is private until it is deliberately named here.
 */
export const PUBLIC_USER_FIELDS = [
  "uid",
  "displayName",
  "name",
  "photoURL",
  "isOrganizerVerified",
] as const;

export type PublicUserField = (typeof PUBLIC_USER_FIELDS)[number];

/**
 * Copies only allowlisted fields off a user document. Use this anywhere a user
 * record is returned to somebody who is not that user.
 */
export function pickPublicUserFields<T extends Record<string, unknown>>(
  user: T,
): Partial<Record<PublicUserField, unknown>> {
  const out: Partial<Record<PublicUserField, unknown>> = {};
  for (const field of PUBLIC_USER_FIELDS) {
    if (user[field] !== undefined) {
      out[field] = user[field];
    }
  }
  return out;
}
