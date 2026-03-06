# Huddle Database Schema (Firestore)

Huddle utilizes Firebase Cloud Firestore, a NoSQL database. Data is organized into collections of documents, taking heavily advantage of denormalization for fast, client-side read performance without excessive joins.

## Core Collections

### 1. `users` Collection
**Document ID**: User's Firebase `uid`.
**Description**: Stores public-facing and application-specific user information. This profile is distinct from the underlying Firebase Auth record.

*   `uid` (string): The Firebase Authentication ID.
*   `email` (string): User's email address.
*   `displayName` (string, optional): User's chosen display name.
*   `bio` (string, optional): User's biography.
*   `photoURL` (string, optional): URL to the user's avatar.
*   `badges` (array of strings): Achievements earned on the platform (e.g., `"first_game"`, `"🔥 Repeat Attendee"`).
*   `interests` (array of strings): User selected categories for discovery.
*   `reliabilityScore` (number): Percentage of attended events vs. RSVP'd (calculated from Check-In data).
*   `blockedUsers` (array of strings): List of `uid`s the user has blocked.
*   `notifyAnnouncements` (boolean): Preference for event-wide announcements.
*   `notifyPromotions` (boolean): Preference for waitlist promotions.
*   `notifyReminders` (boolean): Preference for event reminders and RSVP updates.
*   **Subcollections**:
    *   `connections/{userId}`: Stores connection requests and statuses between users.
    *   `notifications/{notifId}`: In-app notification documents.
        *   `type` (string): `"waitlist_promo" | "event_update" | "event_announcement" | "rsvp_update"`.
        *   `message` (string): Display text.
        *   `eventId` (string, optional): Linked event.
        *   `read` (boolean): Read/unread status.
        *   `createdAt` (string): ISO timestamp.

### 2. `events` Collection
**Document ID**: Auto-generated string.
**Description**: Stores all data for a single event instance.

*   `name` / `title` (string): Name of the event.
*   `category` / `sport` (string): Event categorization (e.g., "Sports", "Tech").
*   `description` (string, optional): Full event description.
*   `date` (string): ISO format date (YYYY-MM-DD).
*   `endDate` (string, optional): ISO format date (YYYY-MM-DD) for multi-day events.
*   `time` (string): Time string (HH:mm).
*   `endTime` (string, optional): Time string (HH:mm).
*   `geopoint` (Firestore GeoPoint): The exact coordinates (`latitude`, `longitude`).
*   `geohash` (string): Geofire geohash string for performant radial proximity queries.
*   `orgLocation` (string, optional): The name of the organization's HQ, if applicable.
*   `orgGeopoint` (Firestore GeoPoint, optional): The exact coordinates of the organization's HQ.
*   `createdBy` (string): `uid` of the event organizer.
*   `organizerName` (string): Display name of the organizer.
*   `maxPlayers` (number): Capacity limit for the event.
*   `currentPlayers` (number): Current confirmed attendee count.
*   `players` (array of strings): An array of `uid`s for all RSVP'd and confirmed users.
*   `waitlist` (array of strings): An ordered array of `uid`s representing users waiting for a slot to open.
*   `checkInOpen` (boolean): Flag indicating if the organizer has opened check-in.
*   `checkIns` (Map<string, boolean>): Key-value pairs tracking physical attendance (`uid` -> `true`).
*   `gallery` (array of objects): Post-event shared photos.
    *   `url` (string): Firebase Storage download URL.
    *   `path` (string): Internal storage path.
    *   `uploaderId` (string): `uid` of the contributor.
*   `attendeeAnswers` (Map<string, Map<string, string>>): Stores answers to custom organizer questions.
*   `pickupPoints` (array of objects): Locations organizers set for meeting logic.
*   `transitTips` (string, optional): Instructions on how to get to the location.
*   `isPrivate` (boolean, optional): If `true`, the event is hidden from the global Discover feed.
*   `createdAt` (Firestore Timestamp): The time the event was created.

*   **Subcollections**:
    *   `chat/{messageId}`: Real-time messaging container for the event.

### 3. `reports` Collection
**Document ID**: Auto-generated.
**Description**: Stores safety reports for moderation.

*   `reporterId` (string): `uid` of the reporting user.
*   `targetId` (string): `uid`, event ID, or photo path being reported.
*   `itemType` (string): `"user" | "event" | "photo"`.
*   `reason` (string): Category of report.
*   `details` (string, optional): Context provided by the reporter.
*   `status` (string): `"pending" | "reviewed" | "dismissed"`.
*   `createdAt` (Firestore Timestamp).

## Schema Design Principles

1.  **Denormalization for Speed**: The `players` and `waitlist` arrays on the `events` document allow us to query whether a user is attending an event without performing a secondary lookup on a subcollection. This is crucial for map rendering performance.
2.  **Atomic Integrity**: Critical state changes, like moving a user from `waitlist` to `players` or updating the `currentPlayers` integer, are **never** trusted to the client. They are handled exclusively by `adminDb.runTransaction()` via the Next.js API route to prevent race conditions during heavy traffic.
