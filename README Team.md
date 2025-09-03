# Huddle: Internal Technical Documentation (V2)

This document provides a comprehensive technical overview of the "Huddle" application, designed for onboarding new developers and serving as a reference for the existing team.

## 1. Project Overview & Architecture

Huddle is a geospatial social platform for local pickup sports. The application is built on a modern, serverless architecture designed for scalability, security, and performance.

**Core Architectural Pattern: Secure Route Groups**
The app's foundation is a **secure route group** structure implemented with the Next.js App Router. This is a critical concept for any developer working on the project.

-   **Public Routes (`/`)**: The root of the application is the public-facing landing and authentication page. It has its own simple layout and is the only part of the app accessible to unauthenticated users.
-   **Private Routes (`app/(app)/*`)**: All main application pages (`/map`, `/events`, `/chat`, `/profile`) are located inside a route group folder named `(app)`. This group is governed by a secure layout (`app/(app)/layout.tsx`) that acts as an **authentication gateway**. It automatically verifies the user's session and redirects any unauthenticated requests to the login page, ensuring the application is secure by default.

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

## 4. Authentication & Session Management

The app uses a hybrid model that separates client and server-side concerns.

*   **Client-Side (`lib/auth.ts`)**: Contains functions for browser-based auth flows (login, signup, etc.) and a `getCurrentUser` function for synchronous UI checks.
*   **Server-Side (`lib/auth-server.ts`)**: Contains a `getServerCurrentUser` function that **must** be used in all API Routes. It securely verifies a session cookie sent from the client using the Firebase Admin SDK. This is the source of truth for user identity on the backend.
*   **Session State (`lib/firebase-context.tsx`)**: A central React Context provider (`FirebaseProvider`) uses the `onAuthStateChanged` listener to manage the user's session state in the browser, making it available to all components via the `useAuth` hook.

## 5. API Endpoints (Next.js API Routes)

All API routes are located in the `app/api/` directory and are secured with Zod server-side validation.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/events` | `GET` | Fetches a list of all events, or nearby events if location data is provided. |
| `/api/events` | `POST` | **Authenticated.** Creates a new single or recurring event. |
| `/api/events/[id]/details` | `GET` | **Authenticated.** Fetches detailed information for a single event, including the profile data of all players. |
| `/api/events/[id]/rsvp` | `POST` | **Authenticated.** Allows a user to RSVP for or leave an event. Awards "first_game" badge. |
| `/api/events/[id]/checkin` | `POST` | **Authenticated & Organizer Only.** Checks a player into an event. |
| `/api/events/[id]/chat` | `POST` | **Authenticated.** Posts a new message to an event's chat. |
| `/api/users/[id]/events`| `GET` | **Authenticated.** Fetches all events a specific user has organized or joined. |
| `/api/users/profile`| `POST` | **Authenticated.** Updates a user's profile (displayName, bio, favoriteSports). |
| `/api/connections/request`| `POST` | **Authenticated.** Sends a connection request to another user. |
| `/api/connections/accept`| `POST` | **Authenticated.** Accepts a pending connection request. |


## 6. Key Feature Implementations

*   **Server-Side Validation**: All critical API endpoints use `zod` schemas to validate incoming data, preventing invalid data from reaching the database.
*   **Global Error Notifications**: The app uses `sonner` to provide users with toast notifications for success and error states on all major actions.
*   **Automated Push Notifications (Cloud Function)**:
    *   A scheduled Cloud Function (`functions/send-reminders.js`) runs every 10 minutes.
    *   It queries for events starting in the near future, retrieves the `fcmTokens` for all RSVP'd users, and sends a reminder notification via Firebase Cloud Messaging.
*   **Gamification (Achievements)**:
    *   The `/api/events/[id]/rsvp` route contains logic to detect when a user joins their first event.
    *   When this occurs, the user's document is updated with a "first_game" badge, which is then displayed on their profile.

## 7. Local Development Setup

1.  **Environment Variables**: Create a `.env.local` file in the project root. It needs credentials for the Firebase Client SDK, Google Maps, and the Firebase Admin SDK (for server-side authentication). Refer to `README.md` for the full list of required variables.
2.  **Install Dependencies**: This project uses PNPM. You only need to install dependencies in the root directory.
    \`\`\`bash
    pnpm install
    \`\`\`
3.  **Run the App**:
    \`\`\`bash
    pnpm run dev
    \`\`\`
