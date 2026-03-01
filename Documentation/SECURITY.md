# Huddle Security Architecture

Huddle employs a robust security model combining a Dual-Auth strategy for Next.js 15 Compatibility, strict atomic database transactions, and a proactive moderation layer.

## 1. The Dual-Auth System

In Next.js 15 App Router, sharing Firebase authentication state seamlessly between Client Components and Server Components/Endpoints is a complex challenge. Huddle uses a hybrid approach to ensure secure identity verification everywhere.

### Client-Side Authentication (`lib/auth.ts`)
On the frontend, standard `firebase/auth` functions (`signInWithEmailAndPassword`, `signInWithPopup` for Google) manage the session. The client SDK holds an ID token in memory. When the user interactively queries data via the client (e.g., using functions in `lib/db-client.ts`), the Firebase JS SDK handles the `Authorization` header automatically.

### Server-Side Authentication (`lib/auth-server.ts`)
The server *cannot* trust the client-side Firebase Auth object directly. Instead, any Next.js API Route (`app/api/*`) or secure Server Component must verify the user independently.

We achieve this using the `getServerCurrentUser()` function. This function uses a **fallback strategy** to ascertain identity:

1.  **Session Cookies**: Primarily, it looks for an HTTP-only secure `session` cookie (managed by the `next/headers` async `await cookies()` API) and verifies it using the Firebase Admin SDK (`adminAuth.verifySessionCookie()`).
2.  **Bearer Token Fallback**: If the cookie is absent or expired, it falls back to parsing the `Authorization: Bearer <token>` header from the request, verifying it via `adminAuth.verifyIdToken()`.

This dual strategy guarantees that API routes are impenetrable without cryptographic proof of identity.

## 2. Server-Side Firestore Access (Admin vs. Client)

Huddle explicitly separates database access into two distinct modules to prevent Webpack leaking and ensure security:

*   **`lib/db-client.ts`**: Uses the Firebase **Client** SDK. This is strictly for the frontend. All operations here are subject to stringent Firestore Security Rules (`firestore.rules`). Users can only edit their own profiles and read public events.
*   **`lib/db.ts` & `lib/firebase-admin.ts`**: Uses the Firebase **Admin** SDK (`lib/firebase-admin.ts`). The Admin SDK initializes using a highly guarded Service Account Private Key (`FIREBASE_PRIVATE_KEY` env var).
    *   **Crucially, the Admin SDK bypasses all Firestore Security Rules.**

## 3. Atomic Writes via Transactions

Because the Admin SDK bypasses security rules, it's used to orchestrate complex operations that clients cannot be trusted to perform reliably. The best example is the RSVP flow in `/api/events/[id]/rsvp/route.ts`.

### The Race Condition Problem
If two users tap "Join Event" simultaneously on an event with only 1 open slot, client-side writes would likely result in both users joining, putting the event over capacity (a race condition).

### The Solution: `adminDb.runTransaction()`
We solve this by routing all RSVPs to the backend API, where we execute a Firestore Transaction. This approach guarantees that:
- Capacity limits are respected.
- Waitlists are appended in strict order.
- Attendance counters remain accurate.

## 4. Moderation & Safety

To maintain a healthy community, Huddle implements several safety mechanisms:

### The Block System
Organizers can block disruptive users. This is enforced at the RSVP layer—if a user is on the organizer's `blockedUsers` list, the `adminDb.runTransaction()` in the RSVP backend will reject the attempt to join, preventing unwanted interactions.

### Reporting & Reviews
Any piece of content (user profiles, events, or gallery photos) can be reported. Reports are stored in a dedicated `reports` collection for administrative review. Reported gallery photos are flagged for immediate moderation to prevent the spread of inappropriate content.

## 5. Storage Security (Event Gallery)

Storage Rules (`storage.rules`) are configured to protect event photos:
- **Read Access**: Any authenticated user can view photos.
- **Write Access**: Restricted to authenticated users for files < 10MB. 
- **Ownership Verification**: Deletions and cleanup are handled by the event organizer or the original uploader, enforced strictly via file metadata checks.
