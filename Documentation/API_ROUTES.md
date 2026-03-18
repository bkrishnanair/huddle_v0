# Huddle API Routes Reference

Huddle utilizes Next.js 15 App Router API routes to securely handle complex, transactional, or high-privilege operations, bypassing the restrictive Firestore Client SDK rules through the Firebase Admin SDK.

All protected routes require authentication.

---

## 📅 Events Subsystem

### `GET /api/events`
Fetches a list of events. Supports both global fetching and radial geospacial querying.

*   **Authentication**: Optional. If unauthenticated, returns public events. If authenticated, can return events utilizing the auth token context.
*   **Query Parameters**:
    *   `lat` (string, optional): Center latitude for search.
    *   `lon` (string, optional): Center longitude for search.
    *   `radius` (string, optional): Search radius in meters.
*   **Response (200 OK)**:
    ```json
    {
      "events": [
        {
          "id": "event_uuid_string",
          "name": "Pickup Basketball",
          "category": "Sports",
          "geopoint": { "_latitude": 38.989, "_longitude": -76.937 },
          "...": "other properties"
        }
      ]
    }
    ```

---

### `POST /api/events`
Creates a new event.

*   **Authentication**: **Required** (Verifies via `getServerCurrentUser()`).
*   **Content-Type**: `application/json`
*   **Body** (Validated via Zod):
    ```json
    {
      "name": "Tech Meetup",
      "category": "Tech",
      "date": "2026-05-15",
      "time": "14:00",
      "location": "Library",
      "maxPlayers": 50,
      "geopoint": {
        "latitude": 38.989,
        "longitude": -76.937
      }
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "message": "Event created successfully",
      "event": {
        "id": "new_event_id",
        "...": "inserted properties"
      }
    }
    ```
*   **Errors**: `400 Bad Request` (Zod validation failed), `401 Unauthorized`.

---

### `POST /api/events/[id]/rsvp`
Handles joining, waitlisting, and leaving an event. This route utilizes a secure Firestore **Transaction** to ensure atomic edits to the `players`, `waitlist`, and `currentPlayers` count.

*   **Authentication**: **Required**.
*   **Content-Type**: `application/json`
*   **URL Parameter**: `id` - The Event ID.
*   **Body**:
    ```json
    {
      "action": "join", // ENUM: "join" | "leave" | "remove"
      "note": "Bringing a +1", // Optional
      "answers": { "Question 1": "Yes" }, // Optional
      "pickupPointId": "station_id", // Optional
      "targetUserId": "uid" // Required ONLY if action === "remove"
    }
    ```
*   **Transaction Logic**:
    *   If `action: "join"` and `currentPlayers < maxPlayers`: Appends user to `players` list.
    *   If `action: "join"` and `currentPlayers >= maxPlayers`: Appends user to `waitlist` list.
    *   If `action: "leave"` and user is in `players` AND `waitlist.length > 0`: Pops first user off `waitlist`, appends them to `players`, removes acting user from `players`.
*   **Response (200 OK)**:
    ```json
    {
      "event": {
        "id": "event_id",
        "players": ["user_1"],
        "waitlist": [],
        "currentPlayers": 1
      }
    }
    ```
*   **Errors**: `400 Bad Request` ("ALREADY_JOINED", "NOT_JOINED"), `401 Unauthorized`, `404 Not Found`.

---

### `POST /api/events/[id]/view`
Tracks a unique view for the given event. No authentication required.

*   **Authentication**: None.
*   **URL Parameter**: `id` - The Event ID.
*   **Behavior**: Atomically increments the event's `viewCount` field using `FieldValue.increment(1)`. The client should deduplicate calls per session.
*   **Response (200 OK)**: Empty body.
*   **Errors**: `400 Bad Request` (missing id), `404 Not Found`, `503 Service Unavailable`.

---

## 👤 Users Subsystem

### `GET /api/users/[id]/dashboard`
Fetches analytics for the organizer dashboard (Studio).

*   **Authentication**: **Required** (Verifies via `getServerCurrentUser()`).
*   **URL Parameter**: `id` - The User's UID.
*   **Query Parameters**:
    *   `startDate` (string, optional): ISO date string.
    *   `endDate` (string, optional): ISO date string.
*   **Response (200 OK)**: Returns event performance stats, total RSVPs, and average show rate.

### `GET /api/users/[id]/notifications`
Fetches the user's latest in-app notifications.

*   **Authentication**: **Required**.
*   **Response (200 OK)**:
    ```json
    {
      "notifications": [
        {
          "id": "notif_id",
          "type": "waitlist_promo",
          "message": "You've been promoted from the waitlist!",
          "read": false,
          "createdAt": "2026-03-01T12:00:00Z"
        }
      ],
      "unreadCount": 1
    }
    ```

### `PATCH /api/users/[id]/notifications`
Marks a specific notification or all notifications as read.

---

## 🛡️ Moderation & Safety

### `POST /api/reports`
Submits a safety report against a user, event, or photo.

*   **Authentication**: **Required**.
*   **Body**:
    ```json
    {
      "targetId": "uid_or_event_id",
      "itemType": "user", // "user" | "event" | "photo"
      "reason": "Harassment",
      "details": "Context here"
    }
    ```

### `PATCH /api/users/block`
Toggle blocked status for a target user. Prevents filtered RSVPs for organized events.

---

## ⏱️ CRON Subsystem

### `GET /api/cron/scheduled-messages`
Scans the database for specific scheduled messages and dispatches them to their respective chat rooms.

*   **Authentication**: Handled via Vercel Cron Secret authorization header (configured in Vercel project settings).
*   **Trigger**: Configured in `vercel.json` (`schedule: "0 0 * * *"`).
*   **Behavior**: Searches the `scheduledMessages` schema array on events. If `scheduledFor` is in the past, and `sent === false`, it generates a new document in the `events/{id}/chat` subcollection. If `isAnnouncement` is true, updates the parent event's `pinnedMessage`.
*   **Response**: Standard `200 OK` upon successful execution.

### `GET /api/cron/cleanup`
Archives stale events that have ended more than 48 hours ago.

*   **Authentication**: Handled via Vercel Cron Secret authorization header.
*   **Trigger**: Configured in `vercel.json` (`schedule: "0 6 * * *"`).
*   **Behavior**: Queries events where `date < (now - 48h)` and `status != 'archived'`. Batch-updates up to 100 events per run, setting `status: 'archived'`.
*   **Response (200 OK)**:
    ```json
    {
      "archived": 5,
      "message": "Archived 5 stale events"
    }
    ```

---

### `POST /api/scrape/terplink`
Imports upcoming events from UMD's TerpLink Engage API.

*   **Authentication**: Requires a valid Firebase user (admin preferred).
*   **Request Body** (optional): `{ "apiUrl": "..." }` to override the default TerpLink API URL.
*   **Behavior**: Fetches events from TerpLink, maps categories, deduplicates by `sourceUrl`, batch-creates up to 20 events per run. Events are tagged with `isScraped: true`, `source: "terplink"`.
*   **Response (200 OK)**:
    ```json
    { "imported": 5, "message": "Imported 5 events from TerpLink" }
    ```

---

### `GET /api/admin/metrics`
Returns platform-wide aggregate metrics.

*   **Authentication**: Requires a valid Firebase user whose UID is in the `ADMIN_UIDS` set (configured via `ADMIN_UID` env var).
*   **Response (200 OK)**:
    ```json
    {
      "metrics": {
        "totalEvents": 42, "totalUsers": 150, "totalViews": 1200,
        "totalRSVPs": 300, "liveEvents": 3, "archivedEvents": 10,
        "scrapedEvents": 15,
        "categoryDistribution": [{ "name": "Sports", "count": 18 }]
      }
    }
    ```
