# Huddle: Internal Onboarding Guide

Here is a comprehensive overview of the "Huddle" application, designed to get you contributing effectively from day one.

## Project Overview

Huddle is a geospatial social platform designed to help users discover, create, and join local pickup sports events. The application is centered around an interactive map where users can find nearby games. Core features include a robust event creation process with precise location pinning, real-time chat for event attendees, and a comprehensive user profile system. The project has recently undergone significant performance and user experience enhancements, making it a scalable and polished V1 product.

## Tech Stack

*   **Framework**: Next.js (v15+) using the App Router
*   **Language**: TypeScript
*   **Backend**: Firebase (Serverless)
    *   **Authentication**: Firebase Authentication (Email/Password, Google Sign-In)
    *   **Database**: Cloud Firestore (NoSQL)
    *   **Serverless Functions**: Firebase Cloud Functions
*   **Generative AI**: Google Gemini
*   **Geospatial**: Google Maps Platform & `geofire-common` library for location-based queries
*   **UI**: Tailwind CSS with Shadcn/ui components
*   **Deployment**: Vercel (Frontend) & Firebase (Backend)
*   **Package Manager**: PNPM

## Project Structure
```
/
├── app/                      # Next.js App Router: Contains all pages and API routes.
│   ├── api/                  # Backend API endpoints.
├── components/               # All reusable React components.
├── functions/                # NEW: Contains all backend Firebase Cloud Functions.
│   ├── index.js              # Main entry point for Cloud Functions.
│   └── package.json          # Dependencies for the Cloud Functions.
├── lib/                      # Core logic, context, and Firebase utilities.
├── .npmrc                    # Configuration file for PNPM.
├── firestore.rules           # CRITICAL: Security rules for the Firestore database.
└── ...                       # Other project configuration files.
```

## Significant Files & Functionalities

| File Name | Path | Functionality |
| :--- | :--- | :--- |
| **`events-page.tsx`** | `components/events-page.tsx` | **Core Component.** Manages the "Discover" experience, fetches nearby events, and handles client-side filtering. |
| **`create-event-modal.tsx`**| `components/create-event-modal.tsx` | **Modified.** A modal for creating events, now with a "Generate with AI" button that calls our Cloud Function. |
| **`index.js`** | `functions/index.js` | **New.** Contains the `generateEventCopy` HTTP Callable Cloud Function. This is the secure backend endpoint that communicates with the Google Gemini API. |
| **`db.ts`** | `lib/db.ts` | **Crucial Logic.** Contains functions for all Firestore interactions, including `getNearbyEvents` for geospatial queries. |
| **`route.ts`** | `app/api/events/nearby/route.ts` | **New API Endpoint.** The backend route that performs the efficient, location-based query for nearby events using geohashing. |
| **`auth.ts`** | `lib/auth.ts` | **Modified.** Contains all client-side authentication logic, including the `signInWithGoogle` function. |

## Application Flow

1.  **Onboarding**: A new user signs in via the `AuthScreen` using Email or Google Sign-In.
2.  **Event Discovery**: The `EventsPage` requests location permission. On success, it calls `GET /api/events/nearby` to fetch local events. If permission is denied, it renders the `ManualLocationSearch` component.
3.  **Event Creation**: A user opens the `CreateEventModal`. They use the map and search to set a precise location.
4.  **AI Content Generation**: The user can click "Generate with AI ✨". This triggers a call to the `generateEventCopy` Firebase Cloud Function, passing the sport, location, and time. The secure backend function constructs a prompt, queries the Gemini API, and returns three title/description pairs. The user can click a suggestion to auto-populate the form.
5.  **Submission**: When submitted, the form data is sent to `POST /api/events`. The backend enriches this data with a geohash and denormalized organizer info before saving it to Firestore.

## Key Architectural Decisions

1.  **Scalability (Geospatial Queries)**: By storing a `geohash` for each event, the backend can efficiently query for events within a specific geographic area without checking every document.
2.  **Performance (Data Denormalization)**: Event documents are created with `organizerName` and `organizerPhotoURL` saved directly on them. This denormalization strategy avoids extra database requests and significantly reduces latency.
3.  **Secure Server-Side AI Integration**: To protect the expensive and sensitive Gemini API key, all AI-related logic is handled in a secure, authenticated Firebase Cloud Function (`generateEventCopy`). The client provides minimal context, and the server constructs the full prompt and communicates with the AI, ensuring the API key is never exposed on the client side.

## Getting Started: Next Steps & Advice

1.  **Setup Environment Variables (CRITICAL)**:
    *   Create a `.env.local` file in the **root directory** for your frontend keys (Firebase SDK, Google Maps).
    *   For the Cloud Function, you must set the Gemini API key in a secure way. From the `functions` directory, run:
        ```bash
        # This will securely store your key with Google Cloud Secret Manager
        firebase functions:secrets:set GEMINI_API_KEY
        ```
2.  **Install All Dependencies**: Remember that the `functions` directory has its own `package.json`.
    ```bash
    # Install root dependencies
    pnpm install
    # Install functions dependencies
    cd functions
    pnpm install
    cd ..
    ```
3.  **Start at `create-event-modal.tsx`**: To understand the new AI feature, start here. Trace how it calls the `generateEventCopy` function and handles the response.
4.  **Review the Cloud Function**: Examine `functions/index.js` to see how the secure, authenticated backend function is structured, how it constructs the prompt, and how it communicates with the Gemini API. This is a key example of a secure client-server interaction pattern.
5.  **Understand Denormalization Trade-offs**: Be aware that if a user updates their name, their old name will still be on events they've created. A future task would be to write a Cloud Function to automatically update these events when a user's profile changes.
