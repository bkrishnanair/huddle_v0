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
| `/api/events` | `POST` | **Auth.** Creates single/recurring events with Zod validation | ✅ Working |
| `/api/events/[id]` | `DELETE` | **Auth.** Securely delete event (Creator only) | ✅ Working |
| `/api/events/[id]/details` | `GET` | Fetches detail info & player profiles (Publicly accessible) | ✅ Working |
| `/api/events/[id]/rsvp` | `POST` | **Auth.** Join/Unjoin events. Admin Transaction protected. | ✅ Working |
| `/api/users/[id]/profile`| `GET` | **Auth.** Secure user profile access (self-only) + Past Events history | ✅ Working |
| `/login` | `PAGE` | Dedicated auth entry point for guest redirects | ✅ Working |

## 6. Key Architecture Implementations

*   **Transactional Admin Overrides:** Firestore security rules purposefully restrict client manipulation. RSVPs (event joining/leaving) and Player Counts are executed securely on the backend using `adminDb.runTransaction()`. This ensures atomicity and prevents permission denial loops.
*   **Geospatial API Throttling:** The interactive map employs custom debouncing in `map-view.tsx` (500ms wait after scrolling) and strict geographical equality checks (`===`) before triggering API queries. This severed a previously critical infinite fetch loop.
*   **Server Component Deep Linking:** The `/map/page.tsx` is built as a Server Component. Sharing an event link (`?eventId=xyz`) queries the database server-side to generate dynamic **Open Graph (OG) Tags**, allowing rich previews (Title, Category) inside iMessage/Discord before the JS bundle even loads.
*   **Advanced Marker UX:** Dropped clunky Google Maps `InfoWindow` components in favor of customizable React DOM nodes injected into `@vis.gl/react-google-maps` `AdvancedMarker` tags. Emojis scale responsively, fixing persistent z-index layout shifts.
*   **Hoisted Location Context:** The `APIProvider` is hoisted to the root of the map view to ensure `LocationSearchInput` (Places Library) share the same singleton instance as the Map canvas, preventing initialization race conditions.
*   **Greedy Gesture Handling:** To solve trackpad/touch scrolling issues in embedded Google Maps, `gestureHandling: 'greedy'` is enforced. This ensures the map captures all scroll/pan inputs without requiring modifier keys (Cmd/Ctrl).
*   **Karma Gamification:** Profile pages include a `Karma Score` tracking system. This uses an experimental "Organizing vs. Participating" weighted logic, displayed with hoverable Radix tooltips for transparency.
*   **Dropdown Focus Locking:** Next.js Radix Dialog modals aggressively steal focus, breaking Google Places autocomplete dropdowns on mobile. We defeated this by capturing `mousedown`/`touchstart` events and invoking `e.preventDefault()` locally inside our search bar.

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
