# Huddle: Internal Technical Documentation (V2)

This document provides a comprehensive technical overview of the "Huddle" application, designed for onboarding new developers and serving as a reference for the existing team.

## 1. Project Overview & Architecture

Huddle is a production-ready geospatial social platform for local pickup sports. The application is built on a modern, serverless architecture designed for scalability, security, and performance with full Next.js 15 compatibility.

**Core Architectural Pattern: Secure Route Groups**
The app's foundation is a **secure route group** structure implemented with the Next.js App Router. This is a critical concept for any developer working on the project.

-   **Public Routes (`/`, `/map`, `/discover`, `/login`)**: The application allows guest access to the Landing page, Map, and Discover feeds. This is tracked via the `isPublicRoute` constant in the layout.
-   **Private Routes (`app/(app)/*`)**: Restricted pages like `/my-events` and `/profile` are gated. If a guest attempts to access these, the secure layout (`app/(app)/layout.tsx`) automatically redirects them to the dedicated `/login` page.
-   **Authentication Gateway**: The layout verifies the Firebase session cookie. Authenticated users can freely visit the Landing page (clicked via Logo) without being forced back into the app map, thanks to dynamic "Open App" CTA logic.

## 2. Technology Stack

*   **Framework**: Next.js (v15+) using the App Router with **Turbopack**
*   **Language**: TypeScript
*   **Backend**: Firebase (Serverless)
    *   **Authentication**: Firebase Authentication (Email/Password, Google Sign-In)
    *   **Database**: Cloud Firestore (NoSQL)
    *   **Serverless Functions**: Firebase Cloud Functions
*   **Validation**: Zod
*   **Mapping**: Google Maps Platform
*   **UI**: Tailwind CSS with Shadcn/ui components
*   **Deployment**: Vercel (Frontend) & Firebase (Backend)
*   **Package Manager**: PNPM

## 3. Database Schema (Cloud Firestore)

Data is organized into collections of documents. The schema uses denormalization for performance.

#### `users` collection
*   **Document ID**: User's Firebase `uid`.
*   **Description**: Stores public-facing and app-specific user information.
*   **Key Fields**: `uid`, `displayName`, `email`, `fcmTokens: Array<string>`, `bio: string`, `favoriteSports: Array<string>`, `badges: Array<string>`.
*   **Subcollections**:
    *   `connections/{userId}`: Stores connection requests and statuses. Each document represents a connection with another user.

#### `events` collection
*   **Document ID**: Auto-generated.
*   **Description**: Stores all data for a single event.
*   **Key Fields**:
    *   `title`, `sport`, `location`, `latitude`, `longitude`, `date`, `time`
    *   `maxPlayers`, `currentPlayers`
    *   `createdBy`: `uid` of the event organizer.
    *   `players: Array<string>`: An array of `uid`s for all RSVP'd users. (Denormalized for fast lookups)
    *   `checkedInPlayers: Array<string>`: An array of `uid`s for users the organizer has checked in. (Denormalized)
*   **Subcollections**:
    *   `chat/{messageId}`: Stores all messages for the event's real-time chat.

---

## 4. Authentication & Session Management (✅ PRODUCTION READY)

The app uses a robust hybrid authentication model that is fully compatible with Next.js 15 and production-ready.

*   **Client-Side (`lib/auth.ts`)**: Contains functions for browser-based auth flows (login, signup, Google Sign-In) and a `getCurrentUser` function for synchronous UI checks.
*   **Server-Side (`lib/auth-server.ts`)**: securely verifies session cookies using the Firebase Admin SDK with proper Next.js 15 async `cookies()` support. This is the source of truth for user identity on the backend.
*   **Firebase Admin (`lib/firebase-admin.ts`)**: Modular Firebase Admin SDK initialization using escaped private keys to bypass restrictive Cloud Firestore Security Rules securely.
*   **Module Separation (CRITICAL)**: To prevent Turbopack from leaking server-only modules into the client bundle, database logic is strictly separated into `lib/db.ts` (Server & Admin SDK only) and `lib/db-client.ts` (Client & Firebase SDK only). Never cross-contaminate these files.

## 5. API Endpoints (Next.js API Routes)

All API routes are located in the `app/api/` directory and are secured with Zod server-side validation.

| Endpoint | Method | Description | Status |
| :--- | :--- | :--- | :--- |
| `/api/events` | `GET` | Fetches nearby events with geospatial filtering and viewport optimization | ✅ Working |
| `/api/events` | `POST` | **Auth.** Creates events with advanced logistics support (Questions, Pickups) | ✅ Working |
| `/api/events/[id]` | `PUT` | **Auth.** Edit event details (Creator only) | ✅ Working |
| `/api/events/[id]` | `DELETE` | **Auth.** Securely delete event (Creator only) | ✅ Working |
| `/api/events/[id]/details` | `GET` | Fetches detail info & player profiles (Publicly accessible) | ✅ Working |
| `/api/events/[id]/rsvp` | `POST` | **Auth/Guest.** Join/Unjoin events. Admin Transaction + Logistics answers. | ✅ Working |
| `/api/events/[id]/chat` | `POST` | **Auth.** Pin messages (Organizer only) | ✅ Working |
| `/api/events/[id]/chat/schedule` | `POST` | **Auth.** Queue messages for future broadcast (Organizer only) | ✅ Working |
| `/api/cron/scheduled-messages` | `GET` | **System.** Vercel Cron endpoint to process and send queued messages | ✅ Working |
| `/api/events/[id]/checkin` | `POST` | **Auth.** Toggle attendee check-in status (Organizer only) | ✅ Working |
| `/api/users/[id]/profile`| `GET/PUT` | **Auth.** Profile access + Past Events history + Preset saves | ✅ Working |
| `/login` | `PAGE` | Dedicated auth entry point for guest redirects | ✅ Working |

## 6. Key Architecture Implementations

*   **Transactional Admin Overrides:** Firestore security rules purposefully restrict client manipulation. RSVPs (event joining/leaving) and Player Counts are executed securely on the backend using `adminDb.runTransaction()`. This ensures atomicity and prevents permission denial loops.
*   **Atomic Waitlist Queuing:** Integrated a smart waitlist mechanism directly into the RSVP route. If an event is full, users are securely shifted into a distinct `waitlist` array. When a confirmed player leaves, the system transactionally `pop()`s the first waitlist element and promotes them to a player without manual intervention.
*   **Organizer CRM (Secondary Sweeps):** To support B2B loyalty features without denormalizing massive amounts of read-heavy data, the `/api/events/[id]/attendees` route chunks users in sizes of 10 (`whereIn` limit) and performs high-speed `adminDb.collection('events').where(...).count().get()` operations. This safely calculates "repeat attendee" loyalty badges on the fly.
*   **Geospatial API Throttling:** The interactive map employs custom debouncing in `map-view.tsx` (500ms wait after scrolling) and strict geographical equality checks (`===`) before triggering API queries. This severed a previously critical infinite fetch loop.
*   **Sequential Deep-Link Locking**: Enforced a strict map pan sequence using a component-scoped `useRef`(`isProcessingDeepLink`). Deep links shared via URL (`?eventId`) successfully lock out native HTML5 browser geolocation API calls from abruptly stealing the viewport until the pin coordinates have stabilized.
*   **Server Component Deep Linking:** The `/map/page.tsx` is built as a Server Component. Sharing an event link queries the database server-side to generate dynamic **Open Graph (OG) Tags**, allowing rich previews (Title, Category) inside iMessage/Discord before the JS bundle even loads.
*   **Teardrop Marker UX:** Dropped clunky Google Maps `InfoWindow` components in favor of customizable React DOM nodes injected into `@vis.gl/react-google-maps` `AdvancedMarker` tags. Features south-facing teardrops, pulsating hover glows, and category-specific emojis.
*   **Hoisted Location Context:** The `APIProvider` is hoisted to the root of the map view to ensure `LocationSearchInput` (Places Library) share the same singleton instance as the Map canvas, preventing initialization race conditions.
*   **Trackpad Panning Optimization:** To maintain a "Native App" feel on macOS, `gestureHandling: 'greedy'` was explicitly removed. This allows the Google Map to respect standard trackpad pan gestures without forcing a zoom-only feedback loop.
*   **Karma Gamification:** Profile pages include a `Karma Score` tracking system. This uses an experimental "Organizing vs. Participating" weighted logic, displayed with hoverable Radix tooltips for transparency.
*   **Dropdown Native Touch Interactions:** Reinstated native browser event bubbling via the Places API `.pac-container`. We purposefully disabled overzealous custom `e.preventDefault()` mousedown capturing to restore functional mobile tap-to-select entries in location bars.
*   **Session State Persistence:** Implemented a session-persistence layer for the map view using `sessionStorage`. This caches the user's viewport (center/zoom) and UI states (like prompt dismissals), ensuring a continuous UX when navigating between different app sections.
*   **POI-Free Map Styling:** Leveraged the `styles` property of the Google Map component to inject absolute POI visibility overrides. This programmatic "decluttering" removes commercial noise (restaurants/shops) without requiring separate Map styles in the Google Cloud Console.
*   **Haversine Distance Math:** The "Within Range" discover filter implements a client-side Haversine formula to compute exact distances from `userLocation`. This allows for highly accurate mile-based filtering even when backend queries are geohash-bounded.
*   **Infrastructure Seeding:** The `scripts/` directory contains Node.js utilities (`seed_umd.ts`, `seed_top20.ts`) that utilize the `Firebase Admin SDK` to bypass security rules and populate the production database with realistic, landmark-specific mock data for development.
*   **Vercel Cron Automation:** Implemented a `/api/cron/scheduled-messages` endpoint triggered by `vercel.json` configurations. This provides a serverless "sweep" every 10 minutes to process `scheduledMessages` arrays within events, pushing due messages to the chat and updating pinned states.
*   **Transactional Logistics & RSVPs:** Expanded the RSVP transaction to handle complex payloads including custom answers and pickup selections. This ensures that user logistics data remains consistent with the roster count during high-concurrency "Join" bursts.
*   **Geospatial Conflict Resolution:** `CreateEventModal` now performs an asynchronous lookup against the organizer's active roster to detect temporal overlaps. This prevents double-booking resources or venues by surfacing `ConflictWarning` banners during the draft phase.
*   **Calendar RFC Integration:** Built a standard-compliant `lib/calendar.ts` utility that generates `.ics` files and Google Calendar deep links by parsing event ISO strings and geocoordinates into valid URI components.
*   **Check-In State Management:** Added a dynamic `checkIns` Record to the `GameEvent` schema. Organizers use `checkInPlayer()` (Admin SDK) to persist attendance data, which is then used by the CSV exporter to differentiate between "RSVP'd" and "Attended" for post-event analytics.
*   **Drawer Height Normalization:** To prevent viewport clipping on diverse screen ratios (especially iOS Safari), the `EventDetailsDrawer` enforces a `max-h-[96vh]` constraint. Main content blocks are wrapped in scrollable flex-containers to maintain 100% button visibility.
*   **Mobile-Optimized Layouts:** Standardized `pb-28` padding across all scrollable views and implemented `overflow-x-auto` on filter groups. This ensures a 100% collision-free experience with the floating bottom navigation bar on small devices.

## 7. Local Development Setup

1.  **Environment Variables**: Create a `.env.local` file in the project root. It needs credentials for the Firebase Client SDK, Google Maps, and the Firebase Admin SDK (for server-side authentication). Refer to `README.md` for the full list of required variables.
2.  **Install Dependencies**: This project uses PNPM. You only need to install dependencies in the root directory.
    ```bash
    pnpm install
    ```
3.  **Run the App**:
    ```bash
    pnpm run dev
    ```

## 8. Production Deployment Status

### ✅ **FULLY FUNCTIONAL SYSTEMS**
- **Authentication**: Complete Next.js 15 compatible session management
- **Event Management**: CRUD operations with real-time updates and transactional RSVPs
- **Performance Architecture**: Strict separation of client/server Next.js modules (0 build errors)
- **Real-time Chat**: Firebase Firestore listeners with optimistic updates
- **Maps Integration**: Google Maps with deep linking, debouncing, and custom emoji DOM pins.
- **Mobile Responsive**: Touch interactions and dropdown focus bugs solved.

### 🔧 **CONFIGURATION NEEDED FOR PRODUCTION**
- Firebase environment variables (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)
- Google Maps API keys with proper API restrictions (Maps JS API, Places API, Geocoding)
- Domain configuration in `next.config.mjs` for production CNAME routing.
