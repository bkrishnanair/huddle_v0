├── .gitignore
├── .idx
    └── dev.nix
├── .npmrc
├── COPY_DECK.md
├── DEPLOYMENT.md
├── DESIGN_DECISIONS.md
├── Pages
    ├── create events page.png
    ├── create new game.png
    ├── events page search location.png
    ├── events page.png
    ├── landingpage-1.png
    ├── landingpage-2.png
    ├── login page.png
    ├── maps.png
    ├── old
    │   ├── IMG-20250821-WA0036.jpg
    │   ├── IMG-20250821-WA0037.jpg
    │   ├── IMG-20250821-WA0038.jpg
    │   ├── image-1.png
    │   ├── image-2.png
    │   ├── image-3.png
    │   ├── image-4.png
    │   ├── image-5.png
    │   ├── image-6.png
    │   ├── image-7.png
    │   └── image.png
    └── profile.png
├── README Team.md
├── README.md
├── app
    ├── (app)
    │   ├── discover
    │   │   └── page.tsx
    │   ├── layout.tsx
    │   ├── map
    │   │   └── page.tsx
    │   ├── my-events
    │   │   └── page.tsx
    │   └── profile
    │   │   └── page.tsx
    ├── api
    │   ├── auth
    │   │   ├── login
    │   │   │   └── route.ts
    │   │   ├── logout
    │   │   │   └── route.ts
    │   │   ├── me
    │   │   │   └── route.ts
    │   │   └── signup
    │   │   │   └── route.ts
    │   ├── connections
    │   │   ├── accept
    │   │   │   └── route.ts
    │   │   └── request
    │   │   │   └── route.ts
    │   ├── events
    │   │   ├── [id]
    │   │   │   ├── boost
    │   │   │   │   └── route.ts
    │   │   │   ├── chat
    │   │   │   │   └── route.ts
    │   │   │   ├── checkin
    │   │   │   │   └── route.ts
    │   │   │   ├── details
    │   │   │   │   └── route.ts
    │   │   │   └── rsvp
    │   │   │   │   └── route.ts
    │   │   └── route.ts
    │   ├── maps
    │   │   └── config
    │   │   │   └── route.ts
    │   └── users
    │   │   ├── [id]
    │   │       ├── events
    │   │       │   └── route.ts
    │   │       └── public-profile
    │   │       │   └── route.ts
    │   │   └── profile
    │   │       └── route.ts
    ├── globals.css
    ├── layout.tsx
    └── page.tsx
├── components.json
├── components
    ├── ai-generate-button.tsx
    ├── ai-suggestions-list.tsx
    ├── auth-screen.tsx
    ├── bottom-navigation.tsx
    ├── create-event-modal.tsx
    ├── error-boundary.tsx
    ├── event-chat.tsx
    ├── event-details-drawer.tsx
    ├── events
    │   ├── event-card.tsx
    │   └── summary-header.tsx
    ├── huddle-pro-modal.tsx
    ├── landing-page.tsx
    ├── location-search.tsx
    ├── manual-location-search.tsx
    ├── map-view.tsx
    ├── maps-api-validator.tsx
    ├── maps-debug.tsx
    ├── notification-permission-handler.tsx
    ├── profile
    │   ├── edit-profile-modal.tsx
    │   ├── event-list.tsx
    │   └── public-profile-modal.tsx
    ├── shared-header.tsx
    ├── theme-provider.tsx
    └── ui
    │   ├── avatar.tsx
    │   ├── badge.tsx
    │   ├── button.tsx
    │   ├── calendar.tsx
    │   ├── card.tsx
    │   ├── chip.tsx
    │   ├── command.tsx
    │   ├── dialog.tsx
    │   ├── drawer.tsx
    │   ├── input.tsx
    │   ├── label.tsx
    │   ├── multi-select.tsx
    │   ├── popover.tsx
    │   ├── scroll-area.tsx
    │   ├── select.tsx
    │   ├── skeleton.tsx
    │   ├── sonner.tsx
    │   ├── switch.tsx
    │   ├── tabs.tsx
    │   └── textarea.tsx
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── functions
    ├── generateEventCopy.js
    ├── index.js
    ├── package.json
    └── send-reminders.js
├── lib
    ├── auth-server.ts
    ├── auth.ts
    ├── db.ts
    ├── fallback-db.ts
    ├── firebase-admin.ts
    ├── firebase-context.tsx
    ├── firebase-env.ts
    ├── firebase-messaging.ts
    ├── firebase.ts
    ├── map-styles.ts
    ├── maps-config.ts
    ├── maps-debug.ts
    ├── recaptcha.ts
    ├── types.ts
    └── utils.ts
├── my folder
    ├── README copy.md
    ├── daily updates.txt
    └── git commands.txt
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
    ├── placeholder-logo.png
    ├── placeholder-logo.svg
    ├── placeholder-user.jpg
    ├── placeholder.jpg
    └── placeholder.svg
├── styles
    └── globals.css
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json


/.gitignore:
--------------------------------------------------------------------------------
 1 | # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
 2 | 
 3 | # dependencies
 4 | /node_modules
 5 | 
 6 | # next.js
 7 | /.next/
 8 | /out/
 9 | 
10 | # production
11 | /build
12 | 
13 | # debug
14 | npm-debug.log*
15 | yarn-debug.log*
16 | yarn-error.log*
17 | .pnpm-debug.log*
18 | 
19 | # env files
20 | .env*
21 | 
22 | # vercel
23 | .vercel
24 | 
25 | # typescript
26 | *.tsbuildinfo
27 | next-env.d.ts
28 | 


--------------------------------------------------------------------------------
/.idx/dev.nix:
--------------------------------------------------------------------------------
 1 | {pkgs}: {
 2 |   channel = "stable-24.05";
 3 |   packages = [
 4 |     pkgs.nodejs_20
 5 |   ];
 6 |   idx.extensions = [
 7 |     
 8 |   ];
 9 |   idx.previews = {
10 |     previews = {
11 |       web = {
12 |         command = [
13 |           "npm"
14 |           "run"
15 |           "dev"
16 |           "--"
17 |           "--port"
18 |           "$PORT"
19 |           "--hostname"
20 |           "0.0.0.0"
21 |         ];
22 |         manager = "web";
23 |       };
24 |     };
25 |   };
26 | }
27 | 


--------------------------------------------------------------------------------
/.npmrc:
--------------------------------------------------------------------------------
1 | auto-install-peers=true
2 | 


--------------------------------------------------------------------------------
/COPY_DECK.md:
--------------------------------------------------------------------------------
 1 | # Copy Deck
 2 | 
 3 | This document contains all the new copy for the Huddle application, written to be benefit-led, concise, and student-friendly.
 4 | 
 5 | ## Headlines & Subheads
 6 | 
 7 | - **H1:** Stop the group-chat chaos. Find your game now.
 8 | - **Subhead:** Real-time map, instant RSVPs, and AI that fills rosters fast.
 9 | - **Discover Page H1:** Find Your Arena
10 | - **Discover Page Subhead:** The best games, picked just for you.
11 | 
12 | ## Button Labels
13 | 
14 | - **Primary CTA:** Start Playing Today
15 | - **In-app:** Find games nearby, Create pickup game, Invite friends, Boost visibility, Host the First Game, Share Invite Link
16 | 
17 | ## Empty States
18 | 
19 | - **Events List:** No games yet—be the first to host tonight at 7:00 PM.
20 | - **Discover Page:** No Games Nearby. Your area is waiting for a leader. Be the one to get the ball rolling.
21 | - **Achievements:** Your trophy case is waiting. Join a game to start collecting!
22 | 
23 | ## Value Propositions
24 | 
25 | - Fill a roster in minutes with real-time RSVPs.
26 | - AI helps plan the when and where—players just tap to join.
27 | - Check-ins build reliability so organizers trust you.
28 | 


--------------------------------------------------------------------------------
/DEPLOYMENT.md:
--------------------------------------------------------------------------------
 1 | # Deployment Guide
 2 | 
 3 | ## Deploy to Vercel
 4 | 
 5 | ### Prerequisites
 6 | 1. GitHub repository with your Huddle app code
 7 | 2. Vercel account (free at vercel.com)
 8 | 3. Firebase project set up with Authentication and Firestore
 9 | 4. Google Maps API key with proper restrictions
10 | 
11 | ### Step 1: Connect Repository to Vercel
12 | 1. Go to [vercel.com](https://vercel.com) and sign in
13 | 2. Click "New Project"
14 | 3. Import your GitHub repository
15 | 4. Vercel will automatically detect it's a Next.js project
16 | 
17 | ### Step 2: Configure Environment Variables
18 | In your Vercel project settings, add these environment variables:
19 | 
20 | \`\`\`
21 | NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
22 | NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
23 | NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
24 | NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
25 | NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
26 | NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
27 | GOOGLE_MAPS_API_KEY=your_google_maps_api_key
28 | \`\`\`
29 | 
30 | **Important**: The Google Maps API key is now server-side only (no NEXT_PUBLIC_ prefix) for security.
31 | 
32 | ### Step 3: Secure Your Google Maps API Key
33 | 1. In Google Cloud Console, go to APIs & Services > Credentials
34 | 2. Click on your API key
35 | 3. Under "Application restrictions", select "HTTP referrers"
36 | 4. Add your domains:
37 |    - `localhost:3000/*` (for development)
38 |    - `your-app-name.vercel.app/*` (for production)
39 |    - `*.vercel.app/*` (for preview deployments)
40 | 
41 | ### Step 4: Deploy
42 | 1. Click "Deploy" in Vercel
43 | 2. Wait for the build to complete
44 | 3. Your app will be live at `https://your-app-name.vercel.app`
45 | 
46 | ### Step 5: Configure Firebase for Production
47 | 1. In Firebase Console, go to Authentication > Settings
48 | 2. Add your Vercel domain to "Authorized domains"
49 | 3. Deploy your Firestore security rules:
50 |    \`\`\`bash
51 |    firebase deploy --only firestore:rules
52 |    \`\`\`
53 | 
54 | ### Step 6: Enable Google Sign-in
55 | 1. In Firebase Console, go to Authentication > Sign-in method
56 | 2. Enable Google provider
57 | 3. Add your Vercel domain to authorized domains
58 | 
59 | ## Post-Deployment Checklist
60 | - [ ] Test authentication (email/password and Google)
61 | - [ ] Test event creation and RSVP
62 | - [ ] Test Google Maps integration
63 | - [ ] Test real-time chat functionality
64 | - [ ] Verify Firestore security rules are active
65 | - [ ] Test on mobile devices
66 | - [ ] Verify API key restrictions are working
67 | 
68 | ## Security Notes
69 | - Google Maps API key is now secured server-side and only accessible to authenticated users
70 | - API key is never exposed in the client bundle
71 | - Security is enforced through server-side authentication checks
72 | - Always set up proper domain restrictions in Google Cloud Console
73 | 
74 | ## Troubleshooting
75 | - **Firebase errors**: Check environment variables are correctly set
76 | - **Google Maps not loading**: Verify API key is set as GOOGLE_MAPS_API_KEY (without NEXT_PUBLIC_)
77 | - **Authentication issues**: Ensure domains are authorized in Firebase
78 | - **Build failures**: Check Next.js configuration and dependencies
79 | - **Maps config errors**: Ensure user is authenticated before accessing maps
80 | 


--------------------------------------------------------------------------------
/DESIGN_DECISIONS.md:
--------------------------------------------------------------------------------
 1 | ything# Design Decisions
 2 | 
 3 | This document outlines the key design decisions made during the UI/UX overhaul of the Huddle application.
 4 | 
 5 | ## Color System
 6 | 
 7 | The color system is designed to create a calm, focused experience with clear calls to action.
 8 | 
 9 | - **Primary Accent (`emerald`):** Used for all primary actions to guide the user and create a consistent visual hierarchy.
10 | - **Background (`slate`):** A dark, desaturated background reduces visual noise and allows the accent color to stand out.
11 | - **Surface (`white/10`):** A subtle glassmorphism effect is used for cards and modals to create a sense of depth and hierarchy.
12 | - **Text (`slate-50`, `slate-300`, `slate-400`):** A range of neutral grays ensures readability and a clear typographic scale.
13 | 
14 | ## Typography
15 | 
16 | The typographic scale is designed for clarity and scannability across all devices.
17 | 
18 | - **Headlines:** Large, bold headlines are used to grab attention and quickly communicate the purpose of a screen.
19 | - **Body:** A clean, legible font is used for body copy to ensure readability.
20 | - **Labels:** A smaller, lighter font is used for labels and secondary information to reduce visual clutter.
21 | 
22 | ## Component Styling
23 | 
24 | All components have been updated to align with the new design system, with a focus on consistency and usability.
25 | 
26 | - **Buttons:** Buttons have clear visual distinctions between primary, secondary, and tertiary actions.
27 | - **Cards:** Cards use a consistent glassmorphism effect with a subtle border to create a sense of depth.
28 | - **Modals:** Modals use a consistent layout with a clear title, description, and actions.
29 | - **Chips:** Filter chips have a distinct active state to provide clear visual feedback.
30 | 
31 | ## Spacing
32 | 
33 | Generous whitespace is used throughout the application to create a sense of calm and improve scannability. A consistent spacing scale is used to ensure visual harmony between all elements.
34 | 
35 | ## UX & User Flow
36 | 
37 | - **Personalized Discovery:** The Discover page is the primary landing screen for authenticated users, providing a personalized and actionable view of nearby games.
38 | - **Actionable Empty States:** Empty states are designed to be opportunities for engagement, with clear calls to action to create the first game in an area.
39 | - **Public Profiles:** Users can view each other's profiles to build trust and community.
40 | - **Performance:** The application is designed to be fast and responsive, with viewport-based event fetching and memoized components to prevent unnecessary re-renders.
41 | 


--------------------------------------------------------------------------------
/Pages/create events page.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/create events page.png


--------------------------------------------------------------------------------
/Pages/create new game.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/create new game.png


--------------------------------------------------------------------------------
/Pages/events page search location.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/events page search location.png


--------------------------------------------------------------------------------
/Pages/events page.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/events page.png


--------------------------------------------------------------------------------
/Pages/landingpage-1.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/landingpage-1.png


--------------------------------------------------------------------------------
/Pages/landingpage-2.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/landingpage-2.png


--------------------------------------------------------------------------------
/Pages/login page.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/login page.png


--------------------------------------------------------------------------------
/Pages/maps.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/maps.png


--------------------------------------------------------------------------------
/Pages/old/IMG-20250821-WA0036.jpg:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/old/IMG-20250821-WA0036.jpg


--------------------------------------------------------------------------------
/Pages/old/IMG-20250821-WA0037.jpg:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/old/IMG-20250821-WA0037.jpg


--------------------------------------------------------------------------------
/Pages/old/IMG-20250821-WA0038.jpg:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/old/IMG-20250821-WA0038.jpg


--------------------------------------------------------------------------------
/Pages/old/image-1.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/old/image-1.png


--------------------------------------------------------------------------------
/Pages/old/image-2.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/old/image-2.png


--------------------------------------------------------------------------------
/Pages/old/image-3.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/old/image-3.png


--------------------------------------------------------------------------------
/Pages/old/image-4.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/old/image-4.png


--------------------------------------------------------------------------------
/Pages/old/image-5.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/old/image-5.png


--------------------------------------------------------------------------------
/Pages/old/image-6.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/old/image-6.png


--------------------------------------------------------------------------------
/Pages/old/image-7.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/old/image-7.png


--------------------------------------------------------------------------------
/Pages/old/image.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/old/image.png


--------------------------------------------------------------------------------
/Pages/profile.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/Pages/profile.png


--------------------------------------------------------------------------------
/README Team.md:
--------------------------------------------------------------------------------
  1 | # Huddle: Internal Technical Documentation (V2)
  2 | 
  3 | This document provides a comprehensive technical overview of the "Huddle" application, designed for onboarding new developers and serving as a reference for the existing team.
  4 | 
  5 | ## 1. Project Overview & Architecture
  6 | 
  7 | Huddle is a geospatial social platform for local pickup sports. The application is built on a modern, serverless architecture designed for scalability, security, and performance.
  8 | 
  9 | **Core Architectural Pattern: Secure Route Groups**
 10 | The app's foundation is a **secure route group** structure implemented with the Next.js App Router. This is a critical concept for any developer working on the project.
 11 | 
 12 | -   **Public Routes (`/`)**: The root of the application is the public-facing landing and authentication page. It has its own simple layout and is the only part of the app accessible to unauthenticated users.
 13 | -   **Private Routes (`app/(app)/*`)**: All main application pages (`/map`, `/events`, `/chat`, `/profile`) are located inside a route group folder named `(app)`. This group is governed by a secure layout (`app/(app)/layout.tsx`) that acts as an **authentication gateway**. It automatically verifies the user's session and redirects any unauthenticated requests to the login page, ensuring the application is secure by default.
 14 | 
 15 | ## 2. Technology Stack
 16 | 
 17 | *   **Framework**: Next.js (v15+) using the App Router with **Turbopack**
 18 | *   **Language**: TypeScript
 19 | *   **Backend**: Firebase (Serverless)
 20 |     *   **Authentication**: Firebase Authentication (Email/Password, Google Sign-In)
 21 |     *   **Database**: Cloud Firestore (NoSQL)
 22 |     *   **Serverless Functions**: Firebase Cloud Functions
 23 | *   **Validation**: Zod
 24 | *   **Mapping**: Google Maps Platform
 25 | *   **UI**: Tailwind CSS with Shadcn/ui components
 26 | *   **Deployment**: Vercel (Frontend) & Firebase (Backend)
 27 | *   **Package Manager**: PNPM
 28 | 
 29 | ## 3. Database Schema (Cloud Firestore)
 30 | 
 31 | Data is organized into collections of documents. The schema uses denormalization for performance.
 32 | 
 33 | #### `users` collection
 34 | *   **Document ID**: User's Firebase `uid`.
 35 | *   **Description**: Stores public-facing and app-specific user information.
 36 | *   **Key Fields**: `uid`, `displayName`, `email`, `fcmTokens: Array<string>`, `bio: string`, `favoriteSports: Array<string>`, `badges: Array<string>`.
 37 | *   **Subcollections**:
 38 |     *   `connections/{userId}`: Stores connection requests and statuses. Each document represents a connection with another user.
 39 | 
 40 | #### `events` collection
 41 | *   **Document ID**: Auto-generated.
 42 | *   **Description**: Stores all data for a single event.
 43 | *   **Key Fields**:
 44 |     *   `title`, `sport`, `location`, `latitude`, `longitude`, `date`, `time`
 45 |     *   `maxPlayers`, `currentPlayers`
 46 |     *   `createdBy`: `uid` of the event organizer.
 47 |     *   `players: Array<string>`: An array of `uid`s for all RSVP'd users. (Denormalized for fast lookups)
 48 |     *   `checkedInPlayers: Array<string>`: An array of `uid`s for users the organizer has checked in. (Denormalized)
 49 | *   **Subcollections**:
 50 |     *   `chat/{messageId}`: Stores all messages for the event's real-time chat.
 51 | 
 52 | ---
 53 | 
 54 | ## 4. Authentication & Session Management
 55 | 
 56 | The app uses a hybrid model that separates client and server-side concerns.
 57 | 
 58 | *   **Client-Side (`lib/auth.ts`)**: Contains functions for browser-based auth flows (login, signup, etc.) and a `getCurrentUser` function for synchronous UI checks.
 59 | *   **Server-Side (`lib/auth-server.ts`)**: Contains a `getServerCurrentUser` function that **must** be used in all API Routes. It securely verifies a session cookie sent from the client using the Firebase Admin SDK. This is the source of truth for user identity on the backend.
 60 | *   **Session State (`lib/firebase-context.tsx`)**: A central React Context provider (`FirebaseProvider`) uses the `onAuthStateChanged` listener to manage the user's session state in the browser, making it available to all components via the `useAuth` hook.
 61 | 
 62 | ## 5. API Endpoints (Next.js API Routes)
 63 | 
 64 | All API routes are located in the `app/api/` directory and are secured with Zod server-side validation.
 65 | 
 66 | | Endpoint | Method | Description |
 67 | | :--- | :--- | :--- |
 68 | | `/api/events` | `GET` | Fetches a list of all events, or nearby events if location data is provided. |
 69 | | `/api/events` | `POST` | **Authenticated.** Creates a new single or recurring event. |
 70 | | `/api/events/[id]/details` | `GET` | **Authenticated.** Fetches detailed information for a single event, including the profile data of all players. |
 71 | | `/api/events/[id]/rsvp` | `POST` | **Authenticated.** Allows a user to RSVP for or leave an event. Awards "first_game" badge. |
 72 | | `/api/events/[id]/checkin` | `POST` | **Authenticated & Organizer Only.** Checks a player into an event. |
 73 | | `/api/events/[id]/chat` | `POST` | **Authenticated.** Posts a new message to an event's chat. |
 74 | | `/api/users/[id]/events`| `GET` | **Authenticated.** Fetches all events a specific user has organized or joined. |
 75 | | `/api/users/profile`| `POST` | **Authenticated.** Updates a user's profile (displayName, bio, favoriteSports). |
 76 | | `/api/connections/request`| `POST` | **Authenticated.** Sends a connection request to another user. |
 77 | | `/api/connections/accept`| `POST` | **Authenticated.** Accepts a pending connection request. |
 78 | 
 79 | 
 80 | ## 6. Key Feature Implementations
 81 | 
 82 | *   **Server-Side Validation**: All critical API endpoints use `zod` schemas to validate incoming data, preventing invalid data from reaching the database.
 83 | *   **Global Error Notifications**: The app uses `sonner` to provide users with toast notifications for success and error states on all major actions.
 84 | *   **Automated Push Notifications (Cloud Function)**:
 85 |     *   A scheduled Cloud Function (`functions/send-reminders.js`) runs every 10 minutes.
 86 |     *   It queries for events starting in the near future, retrieves the `fcmTokens` for all RSVP'd users, and sends a reminder notification via Firebase Cloud Messaging.
 87 | *   **Gamification (Achievements)**:
 88 |     *   The `/api/events/[id]/rsvp` route contains logic to detect when a user joins their first event.
 89 |     *   When this occurs, the user's document is updated with a "first_game" badge, which is then displayed on their profile.
 90 | 
 91 | ## 7. Local Development Setup
 92 | 
 93 | 1.  **Environment Variables**: Create a `.env.local` file in the project root. It needs credentials for the Firebase Client SDK, Google Maps, and the Firebase Admin SDK (for server-side authentication). Refer to `README.md` for the full list of required variables.
 94 | 2.  **Install Dependencies**: This project uses PNPM. You only need to install dependencies in the root directory.
 95 |     \`\`\`bash
 96 |     pnpm install
 97 |     \`\`\`
 98 | 3.  **Run the App**:
 99 |     \`\`\`bash
100 |     pnpm run dev
101 |     \`\`\`
102 | 


--------------------------------------------------------------------------------
/README.md:
--------------------------------------------------------------------------------
  1 | # Huddle - V2 Enhanced
  2 | 
  3 | Huddle is a modern, full-stack web application designed to help users discover, create, and join local pickup sports events. Centered around an interactive map, it provides a seamless experience for finding nearby games, creating events, and engaging with other participants through real-time chat, social profiles, and automated reminders.
  4 | 
  5 | This V2 release enhances the stable V1 foundation with social connectivity features, gamification, and a hardened, production-ready backend, creating a more engaging and resilient user experience.
  6 | 
  7 | ## Screenshots
  8 | 
  9 | | Landing Page 1 | Landing Page 2 | Login/Signup |
 10 | | :---: | :---: | :---: |
 11 | | ![alt text](Pages/landingpage-1.png) | ![alt text](Pages/landingpage-2.png) | ![alt text](Pages/old/image-5.png) |
 12 | 
 13 | | Discover Events | Events Page | Event Search |
 14 | | :---: | :---: | :---: |
 15 | | ![alt text](Pages/old/image-4.png) | ![alt text](Pages/old/image-1.png) | ![alt text](Pages/old/image-6.png) |
 16 | 
 17 | | Create Event | Chat | Profile |
 18 | | :---: | :---: | :---: |
 19 | | ![alt text](Pages/old/image-7.png) | ![alt text](Pages/old/image-3.png) | ![alt text](Pages/old/image.png) |
 20 | 
 21 | ## Key Features
 22 | *   **Engaging User Profiles**: Users can personalize their profiles with a bio and favorite sports, turning their profile into a social hub.
 23 | *   **Social Connectivity**: A friend/connection system allows users to send and accept friend requests, fostering a sense of community.
 24 | *   **Gamification & Achievements**: Users are rewarded with badges for reaching milestones, such as joining their first game.
 25 | *   **Automated Push Notifications**: All RSVP'd users automatically receive a reminder notification 30 minutes before an event is scheduled to start, powered by a scheduled Firebase Cloud Function.
 26 | *   **Interactive Map & Event Discovery**: Users can discover events in their vicinity, powered by an interactive map with custom-styled pins.
 27 | *   **Advanced Event Creation**: Create single or recurring events with a powerful and user-friendly modal that includes robust, server-side validation.
 28 | *   **RSVP & Real-Time Check-in**: Users can RSVP for events with a single click. Event organizers have a dedicated "Players" tab to view the attendee list and check players in in real-time.
 29 | *   **Real-Time Event Chat**: Each event includes a real-time chat for participants to coordinate and communicate.
 30 | *   **Modern UI/UX**: A beautiful "glassmorphism" design system built with Tailwind CSS and Shadcn/ui, featuring a global notification system for user feedback.
 31 | 
 32 | ## Tech Stack
 33 | 
 34 | | Category      | Technology                                                                                             |
 35 | | :------------ | :----------------------------------------------------------------------------------------------------- |
 36 | | **Framework** | [**Next.js**](https://nextjs.org/) (v15+ with App Router) & [**Turbopack**](https://turbo.build/pack) |
 37 | | **Language**  | [**TypeScript**](https://www.typescriptlang.org/)                                                      |
 38 | | **Backend**   | [**Firebase**](https://firebase.google.com/) (Serverless: Auth, Firestore, Cloud Functions)              |
 39 | | **Validation**| [**Zod**](https://zod.dev/) (for server-side data validation)                                            |
 40 | | **Mapping**   | [**Google Maps Platform**](https://developers.google.com/maps)                                           |
 41 | | **Styling**   | [**Tailwind CSS**](https://tailwindcss.com/) & [**Shadcn/ui**](https://ui.shadcn.com/)                   |
 42 | | **Deployment**| [**Vercel**](https://vercel.com/) (Frontend) & [**Firebase**](https://firebase.google.com/) (Backend)    |
 43 | | **Package Manager**| [**PNPM**](https://pnpm.io/)                                                                           |
 44 | 
 45 | ---
 46 | 
 47 | ## Getting Started
 48 | 
 49 | Follow these instructions to get the project running on your local machine for development and testing purposes.
 50 | 
 51 | ### 1. Prerequisites
 52 | 
 53 | Ensure you have the following installed:
 54 | *   [Node.js](https://nodejs.org/) (v18 or later)
 55 | *   [PNPM](https://pnpm.io/installation)
 56 | *   [Firebase CLI](https://firebase.google.com/docs/cli) (for deploying Cloud Functions)
 57 | 
 58 | ### 2. Clone the Repository
 59 | 
 60 | \`\`\`bash
 61 | git clone https://github.com/bkrishnanair/huddle_v0.git
 62 | cd huddle_v0
 63 | \`\`\`
 64 | 
 65 | ### 3. Set Up Environment Variables
 66 | 
 67 | This project requires API keys from Firebase and Google Cloud to function.
 68 | 
 69 | 1.  Create a `.env.local` file in the root of the project:
 70 |     \`\`\`bash
 71 |     touch .env.local
 72 |     \`\`\`
 73 | 2.  Add the following environment variables to the file, replacing the placeholders with your actual project credentials:
 74 |     \`\`\`env
 75 |     # Firebase Client SDK Configuration (for the browser)
 76 |     NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
 77 |     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
 78 |     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
 79 |     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
 80 |     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
 81 |     NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
 82 |     NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_fcm_vapid_key
 83 | 
 84 |     # Google Maps Configuration
 85 |     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
 86 |     NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_google_maps_map_id
 87 | 
 88 |     # Firebase Admin SDK Configuration (for the server - get from Firebase Console)
 89 |     FIREBASE_PROJECT_ID=your_firebase_project_id
 90 |     FIREBASE_CLIENT_EMAIL=your_service_account_client_email
 91 |     FIREBASE_PRIVATE_KEY=your_service_account_private_key
 92 |     \`\`\`
 93 |     > **Note:** For the Google Maps API Key, ensure you have enabled the **Maps JavaScript API**, **Places API**, and **Geocoding API** in your Google Cloud Console.
 94 | 
 95 | ### 4. Install Dependencies and Run
 96 | 
 97 | The repository includes an `.npmrc` file to automatically handle peer dependency issues during installation.
 98 | 
 99 | \`\`\`bash
100 | # Install root project dependencies
101 | pnpm install
102 | 
103 | # Run the development server with Turbopack
104 | pnpm run dev
105 | \`\`\`
106 | 
107 | The application should now be running on [http://localhost:3000](http://localhost:3000).
108 | 
109 | ---
110 | 
111 | ## Core Architectural Decisions
112 | 
113 | This project has been architected with a modern, secure, and scalable structure.
114 | 
115 | *   **Secure by Default (Route Groups)**: The Next.js App Router's Route Groups are used to create a clear separation between public routes (the landing/login page) and private, authenticated routes (`/map`, `/events`, etc.). A secure layout file acts as a gateway, automatically redirecting unauthenticated users to the login page.
116 | *   **Cohesive UI/UX:** A new, consistent design system has been implemented using a "glassmorphism" aesthetic. All colors, typography, and component styles are defined as tokens in `tailwind.config.ts` and `globals.css`.
117 | *   **Server-Side Validation**: All critical API endpoints are secured with Zod schemas, ensuring that only valid data reaches the database.
118 | *   **Hybrid Data Fetching**: The app uses a hybrid model. Secure actions (like creating an event or sending a message) are handled by server-side API Routes, while real-time data (like chat messages) is streamed directly to the client using Firestore's `onSnapshot` listeners for maximum performance.
119 | *   **Performance (Data Denormalization)**: The Firestore schema uses denormalization for key relationships. For example, the `players` and `checkedInPlayers` arrays are stored directly on an event document. This avoids costly database joins and significantly speeds up data retrieval for common user flows.
120 | ---
121 | 


--------------------------------------------------------------------------------
/app/(app)/discover/page.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import { useState, useEffect, useMemo } from "react"
  4 | import { useAuth } from "@/lib/firebase-context"
  5 | import { Input } from "@/components/ui/input"
  6 | import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
  7 | import { EventCard, EventCardSkeleton } from "@/components/events/event-card"
  8 | import EventDetailsDrawer from "@/components/event-details-drawer"
  9 | import CreateEventModal from "@/components/create-event-modal"
 10 | import { Chip } from "@/components/ui/chip"
 11 | import { Search, SlidersHorizontal, PlusCircle, Star } from "lucide-react"
 12 | import { Button } from "@/components/ui/button"
 13 | import { GameEvent } from "@/lib/types"
 14 | 
 15 | const SPORTS_FILTERS = ["All", "Basketball", "Soccer", "Tennis", "Volleyball", "Football"];
 16 | 
 17 | const ActionableEmptyState = ({ onOpenCreateModal }: { onOpenCreateModal: () => void }) => (
 18 |     <div className="text-center glass-surface border-white/15 rounded-2xl p-8 mt-8">
 19 |         <PlusCircle className="w-16 h-16 text-primary mx-auto mb-4" />
 20 |         <h3 className="text-2xl font-bold text-slate-50 mb-2">No Games Nearby</h3>
 21 |         <p className="text-slate-300 mb-6">Your area is waiting for a leader. Be the one to get the ball rolling.</p>
 22 |         <Button size="lg" onClick={onOpenCreateModal} className="h-12 px-8 text-lg">
 23 |             Host the First Game
 24 |         </Button>
 25 |     </div>
 26 | );
 27 | 
 28 | export default function DiscoverPage() {
 29 |     const { user } = useAuth();
 30 |     const [allNearbyEvents, setAllNearbyEvents] = useState<GameEvent[]>([]);
 31 |     const [userProfile, setUserProfile] = useState<any>(null);
 32 |     const [loading, setLoading] = useState(true);
 33 |     const [initialLoadComplete, setInitialLoadComplete] = useState(false);
 34 |     const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);
 35 |     const [showCreateModal, setShowCreateModal] = useState(false);
 36 |     const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
 37 |     
 38 |     const [searchQuery, setSearchQuery] = useState("");
 39 |     const [activeSport, setActiveSport] = useState("All");
 40 |     const [sortBy, setSortBy] = useState("soonest");
 41 | 
 42 |     useEffect(() => {
 43 |         navigator.geolocation.getCurrentPosition(position => {
 44 |             setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
 45 |         });
 46 | 
 47 |         const fetchInitialData = async () => {
 48 |             if (!user || !userLocation) return;
 49 |             setLoading(true);
 50 |             try {
 51 |                 const radius = 50000;
 52 |                 const [profileRes, eventsRes] = await Promise.all([
 53 |                     fetch(`/api/users/${user.uid}/profile`),
 54 |                     fetch(`/api/events?lat=${userLocation.lat}&lon=${userLocation.lng}&radius=${radius}`)
 55 |                 ]);
 56 |                 
 57 |                 if (profileRes.ok) setUserProfile((await profileRes.json()).profile);
 58 |                 if (eventsRes.ok) setAllNearbyEvents((await eventsRes.json()).events || []);
 59 |             } catch (error) {
 60 |                 console.error("Failed to fetch initial data:", error);
 61 |             } finally {
 62 |                 setLoading(false);
 63 |                 setInitialLoadComplete(true);
 64 |             }
 65 |         };
 66 |         
 67 |         fetchInitialData();
 68 |     }, [user, userLocation]);
 69 | 
 70 |     const { recommendedEvents, otherEvents } = useMemo(() => {
 71 |         const filtered = allNearbyEvents.filter(event => {
 72 |             const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
 73 |             const matchesSport = activeSport === 'All' || event.sport === activeSport;
 74 |             return matchesSearch && matchesSport;
 75 |         });
 76 | 
 77 |         const favoriteSports = userProfile?.favoriteSports || [];
 78 |         const recommended: GameEvent[] = [];
 79 |         const others: GameEvent[] = [];
 80 | 
 81 |         if (favoriteSports.length > 0 && activeSport === 'All' && searchQuery === '') {
 82 |             filtered.forEach(event => {
 83 |                 if (favoriteSports.includes(event.sport)) recommended.push(event);
 84 |                 else others.push(event);
 85 |             });
 86 |         } else {
 87 |             others.push(...filtered);
 88 |         }
 89 | 
 90 |         others.sort((a, b) => {
 91 |             if (sortBy === 'soonest') return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
 92 |             if (sortBy === 'closest') return (a.distance || 999) - (b.distance || 999);
 93 |             return 0;
 94 |         });
 95 | 
 96 |         return { recommendedEvents: recommended, otherEvents: others };
 97 |     }, [allNearbyEvents, searchQuery, activeSport, sortBy, userProfile]);
 98 | 
 99 |     const renderContent = () => {
100 |         if (!initialLoadComplete) {
101 |             return (
102 |                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
103 |                     <EventCardSkeleton />
104 |                     <EventCardSkeleton />
105 |                     <EventCardSkeleton />
106 |                 </div>
107 |             )
108 |         }
109 |         
110 |         const hasRecommended = recommendedEvents.length > 0;
111 |         const hasOther = otherEvents.length > 0;
112 | 
113 |         if (!hasRecommended && !hasOther) {
114 |             return <ActionableEmptyState onOpenCreateModal={() => setShowCreateModal(true)} />
115 |         }
116 | 
117 |         return (
118 |             <>
119 |                 {hasRecommended && (
120 |                     <section className="mb-8">
121 |                         <h2 className="text-2xl font-bold text-slate-50 mb-4 flex items-center gap-2"><Star className="w-6 h-6 text-yellow-400" /> Recommended For You</h2>
122 |                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
123 |                             {recommendedEvents.map(event => <EventCard key={event.id} event={event} onSelectEvent={setSelectedEvent} />)}
124 |                         </div>
125 |                     </section>
126 |                 )}
127 |                  <section>
128 |                         {hasRecommended && <h2 className="text-2xl font-bold text-slate-50 mb-4">All Other Games</h2>}
129 |                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
130 |                             {otherEvents.map(event => <EventCard key={event.id} event={event} onSelectEvent={setSelectedEvent} />)}
131 |                         </div>
132 |                  </section>
133 |             </>
134 |         )
135 |     }
136 | 
137 |     return (
138 |         <div className="min-h-screen liquid-gradient p-4 md:p-8">
139 |             <header className="mb-8">
140 |                 <h1 className="text-3xl font-bold text-slate-50 mb-2">Discover</h1>
141 |                 <p className="text-slate-300">Find games happening around you.</p>
142 |             </header>
143 | 
144 |             <div className="space-y-4 mb-8">
145 |                  <div className="relative">
146 |                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
147 |                     <Input placeholder="Search by name or sport..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 glass-surface border-white/15 h-12" />
148 |                 </div>
149 |                 <div className="flex flex-col md:flex-row items-center justify-between gap-4">
150 |                      <div className="flex flex-wrap gap-2">
151 |                         {SPORTS_FILTERS.map(sport => <Chip key={sport} isActive={activeSport === sport} onClick={() => setActiveSport(sport)}>{sport}</Chip>)}
152 |                      </div>
153 |                      <Select value={sortBy} onValueChange={setSortBy}>
154 |                         <SelectTrigger className="w-full md:w-[180px] glass-surface border-white/15 h-11">
155 |                              <SlidersHorizontal className="w-4 h-4 mr-2" />
156 |                              <SelectValue />
157 |                         </SelectTrigger>
158 |                         <SelectContent>
159 |                              <SelectItem value="soonest">Sort: Soonest</SelectItem>
160 |                              <SelectItem value="closest">Sort: Closest</SelectItem>
161 |                         </SelectContent>
162 |                      </Select>
163 |                 </div>
164 |             </div>
165 | 
166 |             {renderContent()}
167 | 
168 |              {selectedEvent && <EventDetailsDrawer event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} onEventUpdated={() => {}} />}
169 |              {showCreateModal && <CreateEventModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onEventCreated={() => {}} userLocation={userLocation} />}
170 |         </div>
171 |     );
172 | }
173 | 


--------------------------------------------------------------------------------
/app/(app)/layout.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import type React from "react"
 4 | 
 5 | import { useEffect } from "react"
 6 | import { useRouter } from "next/navigation"
 7 | import { useFirebase } from "@/lib/firebase-context"
 8 | import BottomNavigation from "@/components/bottom-navigation"
 9 | 
10 | export default function AppLayout({
11 |   children,
12 | }: {
13 |   children: React.ReactNode
14 | }) {
15 |   const { user, loading } = useFirebase()
16 |   const router = useRouter()
17 | 
18 |   useEffect(() => {
19 |     if (!loading && !user) {
20 |       router.push("/")
21 |     }
22 |   }, [user, loading, router])
23 | 
24 |   if (loading) {
25 |     return (
26 |       <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
27 |         <div className="text-center">
28 |           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
29 |           <p>Loading...</p>
30 |         </div>
31 |       </div>
32 |     )
33 |   }
34 | 
35 |   if (!user) {
36 |     return null
37 |   }
38 | 
39 |   return (
40 |     <div className="relative">
41 |       {children}
42 |       <BottomNavigation />
43 |     </div>
44 |   )
45 | }
46 | 


--------------------------------------------------------------------------------
/app/(app)/map/page.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import { useFirebase } from "@/lib/firebase-context"
 4 | import MapView from "@/components/map-view"
 5 | 
 6 | export default function MapPage() {
 7 |   const { user } = useFirebase()
 8 | 
 9 |   if (!user) return null
10 | 
11 |   return <MapView user={user} onLogout={() => {}} />
12 | }
13 | 


--------------------------------------------------------------------------------
/app/(app)/my-events/page.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | import { useState } from "react"
 3 | import { useAuth } from "@/lib/firebase-context"
 4 | import { Button } from "@/components/ui/button"
 5 | import CreateEventModal from "@/components/create-event-modal"
 6 | import { EventList } from "@/components/profile/event-list"
 7 | import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
 8 | import { Plus } from "lucide-react"
 9 | 
10 | export default function MyEventsPage() {
11 |   const { user, loading } = useAuth()
12 |   const [showCreateModal, setShowCreateModal] = useState(false)
13 |   const [refreshKey, setRefreshKey] = useState(0) // State to trigger re-fetch
14 | 
15 |   if (loading) {
16 |     return (
17 |       <div className="flex justify-center items-center h-screen liquid-gradient">
18 |         <div className="text-white">Loading...</div>
19 |       </div>
20 |     )
21 |   }
22 | 
23 |   if (!user) {
24 |     return (
25 |       <div className="flex justify-center items-center h-screen liquid-gradient">
26 |         <div className="text-white">Please sign in to see your events.</div>
27 |       </div>
28 |     )
29 |   }
30 |   
31 |   const handleEventCreated = () => {
32 |     setShowCreateModal(false);
33 |     setRefreshKey(prevKey => prevKey + 1); // Increment key to force re-render and re-fetch
34 |   };
35 | 
36 |   return (
37 |     <div className="min-h-screen liquid-gradient p-4 md:p-8">
38 |       <header className="flex flex-col md:flex-row justify-between items-center mb-8">
39 |         <div>
40 |             <h1 className="text-3xl font-bold text-white">My Events</h1>
41 |             <p className="text-white/80">View and manage your created and joined events.</p>
42 |         </div>
43 |         <Button onClick={() => setShowCreateModal(true)} className="glass-card mt-4 md:mt-0">
44 |           <Plus className="w-4 h-4 mr-2" />
45 |           Create Event
46 |         </Button>
47 |       </header>
48 | 
49 |       <Tabs defaultValue="organized" key={refreshKey} className="glass-card p-4 rounded-2xl">
50 |         <TabsList className="grid w-full grid-cols-2 bg-white/10">
51 |           <TabsTrigger value="organized" className="text-white data-[state=active]:bg-white/20">Organized</TabsTrigger>
52 |           <TabsTrigger value="joined" className="text-white data-[state=active]:bg-white/20">Joined</TabsTrigger>
53 |         </TabsList>
54 |         <TabsContent value="organized" className="mt-4">
55 |           <EventList userId={user.uid} eventType="organized" />
56 |         </TabsContent>
57 |         <TabsContent value="joined" className="mt-4">
58 |           <EventList userId={user.uid} eventType="joined" />
59 |         </TabsContent>
60 |       </Tabs>
61 | 
62 |       {showCreateModal && (
63 |         <CreateEventModal
64 |           isOpen={showCreateModal}
65 |           onClose={() => setShowCreateModal(false)}
66 |           onEventCreated={handleEventCreated}
67 |           userLocation={null} 
68 |         />
69 |       )}
70 |     </div>
71 |   )
72 | }


--------------------------------------------------------------------------------
/app/(app)/profile/page.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import { useEffect, useState } from "react"
  4 | import { useAuth } from "@/lib/firebase-context"
  5 | import { useRouter } from "next/navigation"
  6 | import { Button } from "@/components/ui/button"
  7 | import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  8 | import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  9 | import { Skeleton } from "@/components/ui/skeleton"
 10 | import { Trophy, LogOut, Settings, UserCircle, Pencil, Zap } from "lucide-react"
 11 | import EditProfileModal from "@/components/profile/edit-profile-modal"
 12 | import HuddleProModal from "@/components/huddle-pro-modal"
 13 | import { signOut } from "firebase/auth"
 14 | import { auth } from "@/lib/firebase"
 15 | import { toast } from "sonner"
 16 | import { Badge } from "@/components/ui/badge"
 17 | 
 18 | function ProfileSkeleton() {
 19 |     return (
 20 |         <div className="min-h-screen liquid-gradient p-4 md:p-6 pb-24 animate-pulse">
 21 |             <header className="flex justify-end items-center gap-2 mb-6">
 22 |                 <Skeleton className="h-10 w-10 rounded-lg bg-slate-700" />
 23 |                 <Skeleton className="h-10 w-10 rounded-lg bg-slate-700" />
 24 |             </header>
 25 |             <div className="flex flex-col items-center text-center -mt-10 space-y-6">
 26 |                 <div className="flex flex-col items-center text-center">
 27 |                     <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-800" />
 28 |                     <Skeleton className="h-8 w-48 mb-2 rounded-md bg-slate-700" />
 29 |                     <Skeleton className="h-5 w-64 rounded-md bg-slate-700" />
 30 |                     <Skeleton className="h-9 w-32 rounded-md mt-4 bg-slate-700" />
 31 |                 </div>
 32 |                 <div className="grid grid-cols-3 gap-4 w-full">
 33 |                     <Skeleton className="h-24 rounded-lg bg-slate-700" />
 34 |                     <Skeleton className="h-24 rounded-lg bg-slate-700" />
 35 |                     <Skeleton className="h-24 rounded-lg bg-slate-700" />
 36 |                 </div>
 37 |                 <Skeleton className="h-32 rounded-lg bg-slate-700 w-full" />
 38 |                 <Skeleton className="h-32 rounded-lg bg-slate-700 w-full" />
 39 |             </div>
 40 |         </div>
 41 |     )
 42 | }
 43 | 
 44 | const StatCard = ({ label, value }: { label: string; value: number }) => (
 45 |     <Card className="glass-surface border-none text-center">
 46 |         <CardContent className="p-4">
 47 |             <div className="text-2xl font-bold text-slate-50">{value}</div>
 48 |             <div className="text-sm text-slate-400">{label}</div>
 49 |         </CardContent>
 50 |     </Card>
 51 | )
 52 | export default function ProfilePage() {
 53 |   const { user, loading: authLoading } = useAuth()
 54 |   const router = useRouter()
 55 |   const [userProfile, setUserProfile] = useState<any>(null)
 56 |   const [userStats, setUserStats] = useState({ organized: 0, joined: 0, upcoming: 0 })
 57 |   const [loading, setLoading] = useState(true)
 58 |   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
 59 |   const [isProModalOpen, setIsProModalOpen] = useState(false)
 60 | 
 61 |   const loadUserData = async () => {
 62 |       if (!user) return
 63 |       setLoading(true)
 64 |       try {
 65 |         const res = await fetch(`/api/users/${user.uid}/profile`)
 66 |         if (res.ok) {
 67 |           const data = await res.json()
 68 |           setUserProfile(data.profile)
 69 |           setUserStats(data.stats)
 70 |         }
 71 |       } catch (error) {
 72 |         console.error("Error loading user data:", error)
 73 |       } finally {
 74 |         setLoading(false)
 75 |       }
 76 |     }
 77 | 
 78 |   useEffect(() => {
 79 |     if (user) loadUserData()
 80 |   }, [user])
 81 |   
 82 |   const handleLogout = async () => {
 83 |     try {
 84 |       await signOut(auth)
 85 |       toast.success("Logged out successfully")
 86 |       router.push("/")
 87 |     } catch (error) {
 88 |       toast.error("Failed to log out")
 89 |     }
 90 |   }
 91 | 
 92 |   const onProfileUpdate = () => {
 93 |     setIsEditModalOpen(false)
 94 |     loadUserData()
 95 |   }
 96 | 
 97 |   if (authLoading || loading) {
 98 |     return <ProfileSkeleton />
 99 |   }
100 | 
101 |   return (
102 |     <>
103 |       <div className="min-h-screen liquid-gradient pb-24">
104 |         <header className="p-4 flex justify-end items-center gap-2">
105 |             <Button variant="ghost" size="icon" onClick={() => { /* Open Settings */ }}>
106 |                 <Settings className="w-5 h-5" />
107 |             </Button>
108 |             <Button variant="ghost" size="icon" onClick={handleLogout}>
109 |                 <LogOut className="w-5 h-5" />
110 |             </Button>
111 |         </header>
112 | 
113 |         <div className="px-4 md:px-6 -mt-10 space-y-6">
114 |             <div className="flex flex-col items-center text-center">
115 |                 <Avatar className="w-24 h-24 mb-4 border-4 border-slate-800">
116 |                     <AvatarImage src={userProfile?.photoURL} />
117 |                     <AvatarFallback>
118 |                         <UserCircle className="w-full h-full text-slate-500" />
119 |                     </AvatarFallback>
120 |                 </Avatar>
121 |                 <h1 className="text-2xl font-bold text-slate-50">{userProfile?.displayName || "Huddle User"}</h1>
122 |                 <p className="text-slate-400">{userProfile?.email}</p>
123 |                  <Button variant="secondary" size="sm" className="mt-4" onClick={() => setIsEditModalOpen(true)}>
124 |                     <Pencil className="w-4 h-4 mr-2" />
125 |                     Edit Profile
126 |                 </Button>
127 |             </div>
128 |           
129 |             <div className="grid grid-cols-3 gap-4">
130 |               <StatCard label="Joined" value={userStats.joined} />
131 |               <StatCard label="Organized" value={userStats.organized} />
132 |               <StatCard label="Upcoming" value={userStats.upcoming} />
133 |             </div>
134 | 
135 |             <Card className="glass-surface border-white/15">
136 |               <CardHeader>
137 |                 <CardTitle className="text-slate-50">About Me</CardTitle>
138 |               </CardHeader>
139 |               <CardContent>
140 |                 <p className="text-slate-300 whitespace-pre-wrap">{userProfile?.bio || "No bio yet. Click 'Edit Profile' to add one."}</p>
141 |                 {userProfile?.favoriteSports && userProfile.favoriteSports.length > 0 && (
142 |                   <div className="mt-4 flex flex-wrap gap-2">
143 |                     {userProfile.favoriteSports.map((sport: string) => (
144 |                       <Badge key={sport} variant="secondary">
145 |                         {sport}
146 |                       </Badge>
147 |                     ))}
148 |                   </div>
149 |                 )}
150 |               </CardContent>
151 |             </Card>
152 | 
153 |             <Card className="glass-surface border-white/15">
154 |                 <CardContent className="p-6">
155 |                     <Button className="w-full" onClick={() => setIsProModalOpen(true)}>
156 |                         <Zap className="w-5 h-5 mr-2" />
157 |                         Upgrade to Huddle Pro ✨
158 |                     </Button>
159 |                 </CardContent>
160 |             </Card>
161 | 
162 |             <Card className="glass-surface border-white/15">
163 |               <CardHeader>
164 |                 <CardTitle className="flex items-center gap-2">
165 |                   <Trophy className="w-5 h-5 text-emerald-400" />
166 |                   Achievements
167 |                 </CardTitle>
168 |               </CardHeader>
169 |               <CardContent>
170 |                 <p className="text-slate-300">Your trophy case is waiting. Join a game to start collecting!</p>
171 |               </CardContent>
172 |             </Card>
173 |         </div>
174 |       </div>
175 |       {isEditModalOpen && (
176 |         <EditProfileModal
177 |           isOpen={isEditModalOpen}
178 |           onClose={() => setIsEditModalOpen(false)}
179 |           userProfile={userProfile}
180 |           onProfileUpdate={onProfileUpdate}
181 |         />
182 |       )}
183 |       <HuddleProModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
184 |     </>
185 |   )
186 | }
187 | 


--------------------------------------------------------------------------------
/app/api/auth/login/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server"
 2 | import { getFirebaseAdminAuth } from "@/lib/firebase-admin"
 3 | import { getUser } from "@/lib/db"
 4 | 
 5 | export async function POST(request: NextRequest) {
 6 |   try {
 7 |     const { idToken } = await request.json()
 8 | 
 9 |     if (!idToken) {
10 |       return NextResponse.json({ error: "ID token is required" }, { status: 400 })
11 |     }
12 | 
13 |     // Check if Firebase is configured
14 |     if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
15 |       return NextResponse.json({ error: "Firebase is not configured" }, { status: 500 })
16 |     }
17 | 
18 |     // Verify token with Firebase Admin SDK
19 |     const adminAuth = getFirebaseAdminAuth()
20 |     if (!adminAuth) {
21 |       throw new Error("Firebase Admin Auth is not initialized")
22 |     }
23 | 
24 |     const decodedToken = await adminAuth.verifyIdToken(idToken)
25 |     console.log("🔥 Server-side token verification successful")
26 | 
27 |     // Get user profile from database
28 |     const userProfile = await getUser(decodedToken.uid)
29 | 
30 |     const user = {
31 |       uid: decodedToken.uid,
32 |       email: decodedToken.email,
33 |       name: userProfile?.name || decodedToken.name || "User",
34 |     }
35 | 
36 |     return NextResponse.json({ user })
37 |   } catch (error: any) {
38 |     console.error("Login error:", error)
39 | 
40 |     if (error.code === "auth/id-token-expired") {
41 |       return NextResponse.json({ error: "Session expired. Please sign in again." }, { status: 401 })
42 |     }
43 | 
44 |     if (error.code === "auth/id-token-revoked") {
45 |       return NextResponse.json({ error: "Session revoked. Please sign in again." }, { status: 401 })
46 |     }
47 | 
48 |     return NextResponse.json({ error: "Authentication failed. Please try again." }, { status: 500 })
49 |   }
50 | }
51 | 


--------------------------------------------------------------------------------
/app/api/auth/logout/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server"
 2 | import { logOut } from "@/lib/auth"
 3 | 
 4 | export async function POST(request: NextRequest) {
 5 |   try {
 6 |     await logOut()
 7 |     return NextResponse.json({ success: true })
 8 |   } catch (error) {
 9 |     console.error("Logout error:", error)
10 |     return NextResponse.json({ error: "Logout failed" }, { status: 500 })
11 |   }
12 | }
13 | 


--------------------------------------------------------------------------------
/app/api/auth/me/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server"
 2 | import { verifyIdToken, getFirebaseAdminDb } from "@/lib/firebase-admin"
 3 | 
 4 | export async function GET(request: NextRequest) {
 5 |   try {
 6 |     const authHeader = request.headers.get("authorization")
 7 | 
 8 |     if (!authHeader || !authHeader.startsWith("Bearer ")) {
 9 |       console.log("🚨 Auth error: Missing or invalid authorization header")
10 |       return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
11 |     }
12 | 
13 |     const idToken = authHeader.split("Bearer ")[1]
14 |     console.log("🔍 Verifying token for /api/auth/me")
15 | 
16 |     // Verify token with Firebase Admin SDK
17 |     const decodedToken = await verifyIdToken(idToken)
18 | 
19 |     if (!decodedToken) {
20 |       console.log("🚨 Auth error: Invalid token")
21 |       return NextResponse.json({ error: "Invalid token" }, { status: 401 })
22 |     }
23 | 
24 |     console.log("✅ Token verified for user:", decodedToken.uid)
25 | 
26 |     const adminDb = getFirebaseAdminDb()
27 |     if (!adminDb) {
28 |       console.error("🚨 Firebase Admin Firestore not initialized")
29 |       return NextResponse.json({ error: "Database service unavailable" }, { status: 503 })
30 |     }
31 | 
32 |     // Get user profile using Firebase Admin SDK
33 |     console.log("🔍 Fetching user profile from Firestore using Admin SDK")
34 |     const userRef = adminDb.collection("users").doc(decodedToken.uid)
35 |     const userDoc = await userRef.get()
36 | 
37 |     let userProfile = null
38 |     if (userDoc.exists) {
39 |       userProfile = { id: userDoc.id, ...userDoc.data() }
40 |       console.log("✅ User profile found:", userProfile.name || userProfile.email)
41 |     } else {
42 |       console.log("⚠️ User profile not found, creating from token data")
43 |       // Create user profile if it doesn't exist
44 |       const newUserData = {
45 |         email: decodedToken.email,
46 |         name: decodedToken.name || decodedToken.email?.split("@")[0] || "User",
47 |         createdAt: new Date(),
48 |       }
49 |       await userRef.set(newUserData)
50 |       userProfile = { id: decodedToken.uid, ...newUserData }
51 |       console.log("✅ Created new user profile:", userProfile.name)
52 |     }
53 | 
54 |     const response = {
55 |       uid: decodedToken.uid,
56 |       email: decodedToken.email,
57 |       name: userProfile.name || decodedToken.name || "User",
58 |     }
59 | 
60 |     console.log("✅ /api/auth/me success for user:", response.name)
61 |     return NextResponse.json(response)
62 |   } catch (error: any) {
63 |     console.error("🚨 Error in /api/auth/me:", error)
64 |     console.error("🚨 Error details:", {
65 |       message: error.message,
66 |       code: error.code,
67 |       stack: error.stack?.split("\n").slice(0, 3).join("\n"),
68 |     })
69 | 
70 |     // Provide more specific error messages
71 |     if (error.code === "permission-denied") {
72 |       return NextResponse.json({ error: "Firestore permission denied. Check security rules." }, { status: 403 })
73 |     } else if (error.code === "unauthenticated") {
74 |       return NextResponse.json({ error: "Authentication failed. Invalid token." }, { status: 401 })
75 |     } else if (error.message?.includes("Firebase Admin")) {
76 |       return NextResponse.json({ error: "Firebase Admin SDK not properly configured." }, { status: 503 })
77 |     }
78 | 
79 |     return NextResponse.json({ error: "Internal server error. Check server logs." }, { status: 500 })
80 |   }
81 | }
82 | 


--------------------------------------------------------------------------------
/app/api/auth/signup/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server"
 2 | import { signUpWithEmail } from "@/lib/auth"
 3 | 
 4 | export async function POST(request: NextRequest) {
 5 |   try {
 6 |     const { email, password, name } = await request.json()
 7 | 
 8 |     if (!email || !password || !name) {
 9 |       return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
10 |     }
11 | 
12 |     // Check if Firebase is configured
13 |     if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
14 |       // Use fallback in-memory storage
15 |       const { fallbackCreateUser } = await import("@/lib/fallback-db")
16 |       const user = await fallbackCreateUser({ email, password, name })
17 |       return NextResponse.json({ user: { uid: user.uid, email: user.email, name: user.name } })
18 |     }
19 | 
20 |     // Use Firebase
21 |     const user = await signUpWithEmail(email, password, name)
22 |     return NextResponse.json({ user })
23 |   } catch (error: any) {
24 |     console.error("Signup error:", error)
25 | 
26 |     if (error.message.includes("email-already-in-use") || error.message.includes("User already exists")) {
27 |       return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 })
28 |     }
29 | 
30 |     if (error.message.includes("weak-password")) {
31 |       return NextResponse.json({ error: "Password should be at least 6 characters" }, { status: 400 })
32 |     }
33 | 
34 |     return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 })
35 |   }
36 | }
37 | 


--------------------------------------------------------------------------------
/app/api/connections/accept/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server"
 2 | import { getServerCurrentUser } from "@/lib/auth-server"
 3 | import { db } from "@/lib/firebase-admin"
 4 | import { z } from "zod"
 5 | 
 6 | const acceptSchema = z.object({
 7 |   requesterId: z.string().min(1, "Requester user ID is required"),
 8 | })
 9 | 
10 | export async function POST(request: NextRequest) {
11 |   try {
12 |     const user = await getServerCurrentUser()
13 |     if (!user) {
14 |       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
15 |     }
16 | 
17 |     const body = await request.json()
18 |     const validationResult = acceptSchema.safeParse(body)
19 | 
20 |     if (!validationResult.success) {
21 |       return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
22 |     }
23 | 
24 |     const { requesterId } = validationResult.data
25 | 
26 |     // A user cannot accept their own request
27 |     if (requesterId === user.uid) {
28 |       return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
29 |     }
30 | 
31 |     const currentUserConnectionRef = db
32 |       .collection("users")
33 |       .doc(user.uid)
34 |       .collection("connections")
35 |       .doc(requesterId)
36 |     
37 |     const requesterConnectionRef = db
38 |       .collection("users")
39 |       .doc(requesterId)
40 |       .collection("connections")
41 |       .doc(user.uid)
42 | 
43 |     // Use a transaction to ensure both documents are updated atomically
44 |     await db.runTransaction(async (transaction) => {
45 |       const connectionDoc = await transaction.get(currentUserConnectionRef)
46 | 
47 |       if (!connectionDoc.exists || connectionDoc.data()?.status !== "pending") {
48 |         throw new Error("No pending connection request found from this user.")
49 |       }
50 |       
51 |       // Update the current user's connection doc: pending -> accepted
52 |       transaction.update(currentUserConnectionRef, {
53 |         status: "accepted",
54 |         acceptedAt: new Date(),
55 |       })
56 |       
57 |       // Create the corresponding connection doc for the requester: accepted
58 |       transaction.set(requesterConnectionRef, {
59 |         status: "accepted",
60 |         acceptedAt: new Date(),
61 |       })
62 |     })
63 | 
64 |     return NextResponse.json({ success: true, message: "Connection accepted." })
65 |   } catch (error: any) {
66 |     console.error("Error accepting connection request:", error)
67 |     if (error.message.includes("No pending connection request")) {
68 |         return NextResponse.json({ error: error.message }, { status: 404 })
69 |     }
70 |     return NextResponse.json({ error: "Failed to accept connection request" }, { status: 500 })
71 |   }
72 | }
73 | 


--------------------------------------------------------------------------------
/app/api/connections/request/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server"
 2 | import { getServerCurrentUser } from "@/lib/auth-server"
 3 | import { db } from "@/lib/firebase-admin"
 4 | import { z } from "zod"
 5 | 
 6 | const requestSchema = z.object({
 7 |   targetUserId: z.string().min(1, "Target user ID is required"),
 8 | })
 9 | 
10 | export async function POST(request: NextRequest) {
11 |   try {
12 |     const user = await getServerCurrentUser()
13 |     if (!user) {
14 |       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
15 |     }
16 | 
17 |     const body = await request.json()
18 |     const validationResult = requestSchema.safeParse(body)
19 | 
20 |     if (!validationResult.success) {
21 |       return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
22 |     }
23 | 
24 |     const { targetUserId } = validationResult.data
25 | 
26 |     if (targetUserId === user.uid) {
27 |       return NextResponse.json({ error: "You cannot send a connection request to yourself" }, { status: 400 })
28 |     }
29 | 
30 |     const targetUserRef = db.collection("users").doc(targetUserId)
31 |     const connectionRef = targetUserRef.collection("connections").doc(user.uid)
32 | 
33 |     await connectionRef.set({
34 |       status: "pending",
35 |       requestedBy: user.uid,
36 |       requestedAt: new Date(),
37 |     })
38 | 
39 |     return NextResponse.json({ success: true })
40 |   } catch (error) {
41 |     console.error("Error sending connection request:", error)
42 |     return NextResponse.json({ error: "Failed to send connection request" }, { status: 500 })
43 |   }
44 | }
45 | 


--------------------------------------------------------------------------------
/app/api/events/[id]/boost/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server"
 2 | import { adminAuth, adminDb } from "@/lib/firebase-admin"
 3 | 
 4 | export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
 5 |   try {
 6 |     const authHeader = request.headers.get("authorization")
 7 |     if (!authHeader?.startsWith("Bearer ")) {
 8 |       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 9 |     }
10 | 
11 |     const token = authHeader.split("Bearer ")[1]
12 |     const decodedToken = await adminAuth.verifyIdToken(token)
13 |     const userId = decodedToken.uid
14 | 
15 |     const eventId = params.id
16 |     const eventRef = adminDb.collection("events").doc(eventId)
17 |     const eventDoc = await eventRef.get()
18 | 
19 |     if (!eventDoc.exists) {
20 |       return NextResponse.json({ error: "Event not found" }, { status: 404 })
21 |     }
22 | 
23 |     const eventData = eventDoc.data()
24 | 
25 |     // Verify that the user is the event organizer
26 |     if (eventData?.createdBy !== userId) {
27 |       return NextResponse.json({ error: "Only the event organizer can boost this event" }, { status: 403 })
28 |     }
29 | 
30 |     // Check if event is already boosted
31 |     if (eventData?.isBoosted) {
32 |       return NextResponse.json({ error: "Event is already boosted" }, { status: 400 })
33 |     }
34 | 
35 |     // Update the event to set isBoosted to true
36 |     await eventRef.update({
37 |       isBoosted: true,
38 |       boostedAt: new Date().toISOString(),
39 |     })
40 | 
41 |     return NextResponse.json({
42 |       success: true,
43 |       message: "Event boosted successfully",
44 |     })
45 |   } catch (error) {
46 |     console.error("Error boosting event:", error)
47 |     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
48 |   }
49 | }
50 | 


--------------------------------------------------------------------------------
/app/api/events/[id]/chat/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server"
 2 | import { getServerCurrentUser } from "@/lib/auth-server"
 3 | import { sendMessage, getChatMessages } from "@/lib/db"
 4 | import { z } from "zod"
 5 | 
 6 | const chatSchema = z.object({
 7 |   message: z.string().trim().min(1, "Message cannot be empty").max(500, "Message too long (max 500 characters)"),
 8 | })
 9 | 
10 | export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
11 |   try {
12 |     const { id } = params
13 |     const user = await getServerCurrentUser()
14 | 
15 |     if (!user) {
16 |       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
17 |     }
18 | 
19 |     const body = await request.json()
20 |     const validationResult = chatSchema.safeParse(body)
21 | 
22 |     if (!validationResult.success) {
23 |       return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
24 |     }
25 | 
26 |     const { message } = validationResult.data
27 |     const displayName = user.displayName || "Anonymous"
28 | 
29 |     await sendMessage(id, user.uid, displayName, message)
30 | 
31 |     return NextResponse.json({ success: true })
32 |   } catch (error) {
33 |     console.error("Chat message error:", error)
34 |     if (error instanceof z.ZodError) {
35 |       return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
36 |     }
37 |     return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
38 |   }
39 | }
40 | 
41 | export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
42 |   try {
43 |     const { id } = params
44 |     const user = await getServerCurrentUser()
45 | 
46 |     if (!user) {
47 |       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
48 |     }
49 | 
50 |     const messages = await getChatMessages(id)
51 | 
52 |     return NextResponse.json({ messages })
53 |   } catch (error) {
54 |     console.error("Get chat messages error:", error)
55 |     return NextResponse.json({ error: "Failed to get messages" }, { status: 500 })
56 |   }
57 | }
58 | 


--------------------------------------------------------------------------------
/app/api/events/[id]/checkin/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server"
 2 | import { getCurrentUser } from "@/lib/auth"
 3 | import { checkInPlayer } from "@/lib/db"
 4 | 
 5 | export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
 6 |   try {
 7 |     const { id } = await params
 8 |     const user = await getCurrentUser()
 9 | 
10 |     if (!user) {
11 |       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
12 |     }
13 | 
14 |     const { playerId } = await request.json()
15 | 
16 |     if (!playerId) {
17 |       return NextResponse.json({ error: "Player ID is required" }, { status: 400 })
18 |     }
19 | 
20 |     const updatedEvent = await checkInPlayer(id, playerId, user.uid)
21 | 
22 |     return NextResponse.json({ event: updatedEvent })
23 |   } catch (error) {
24 |     console.error("Check-in error:", error)
25 | 
26 |     if (error instanceof Error) {
27 |       if (error.message.includes("Only the event organizer")) {
28 |         return NextResponse.json({ error: error.message }, { status: 403 })
29 |       }
30 |       if (error.message.includes("not found") || error.message.includes("not joined")) {
31 |         return NextResponse.json({ error: error.message }, { status: 404 })
32 |       }
33 |     }
34 | 
35 |     return NextResponse.json({ error: "Failed to check in player" }, { status: 500 })
36 |   }
37 | }
38 | 


--------------------------------------------------------------------------------
/app/api/events/[id]/details/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server"
 2 | import { getEventWithPlayerDetails } from "@/lib/db"
 3 | 
 4 | export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
 5 |   try {
 6 |     const { id } = await params
 7 | 
 8 |     const eventWithDetails = await getEventWithPlayerDetails(id)
 9 | 
10 |     if (!eventWithDetails) {
11 |       return NextResponse.json({ error: "Event not found" }, { status: 404 })
12 |     }
13 | 
14 |     return NextResponse.json(eventWithDetails)
15 |   } catch (error) {
16 |     console.error("Error fetching event details:", error)
17 |     return NextResponse.json({ error: "Failed to fetch event details" }, { status: 500 })
18 |   }
19 | }
20 | 


--------------------------------------------------------------------------------
/app/api/events/[id]/rsvp/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server"
 2 | import { getServerCurrentUser } from "@/lib/auth-server"
 3 | import { db } from "@/lib/firebase-admin"
 4 | import { getEvent, joinEvent, leaveEvent } from "@/lib/db"
 5 | import { z } from "zod"
 6 | import { firestore } from "firebase-admin"
 7 | 
 8 | const rsvpSchema = z.object({
 9 |   action: z.enum(["join", "leave"]),
10 | })
11 | 
12 | export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
13 |   try {
14 |     const { id } = params
15 |     const user = await getServerCurrentUser()
16 | 
17 |     if (!user) {
18 |       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
19 |     }
20 | 
21 |     const body = await request.json()
22 |     const validationResult = rsvpSchema.safeParse(body)
23 | 
24 |     if (!validationResult.success) {
25 |       return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
26 |     }
27 | 
28 |     const { action } = validationResult.data
29 |     const event = await getEvent(id)
30 | 
31 |     if (!event) {
32 |       return NextResponse.json({ error: "Event not found" }, { status: 404 })
33 |     }
34 | 
35 |     let updatedEvent
36 | 
37 |     if (action === "join") {
38 |       if (event.players?.includes(user.uid)) {
39 |         return NextResponse.json({ error: "You have already joined this event" }, { status: 400 })
40 |       }
41 | 
42 |       if (event.currentPlayers >= event.maxPlayers) {
43 |         return NextResponse.json({ error: "This event is already full" }, { status: 400 })
44 |       }
45 | 
46 |       updatedEvent = await joinEvent(id, user.uid)
47 | 
48 |       // Gamification: Check for first game achievement
49 |       const userEventsQuery = await db.collection("events").where("players", "array-contains", user.uid).get()
50 |       if (userEventsQuery.size === 1) {
51 |         const userRef = db.collection("users").doc(user.uid)
52 |         await userRef.update({
53 |           badges: firestore.FieldValue.arrayUnion("first_game"),
54 |         })
55 |       }
56 |     } else {
57 |       // action === "leave"
58 |       if (!event.players?.includes(user.uid)) {
59 |         return NextResponse.json({ error: "You are not currently joined to this event" }, { status: 400 })
60 |       }
61 | 
62 |       updatedEvent = await leaveEvent(id, user.uid)
63 |     }
64 | 
65 |     return NextResponse.json({ event: updatedEvent })
66 |   } catch (error) {
67 |     console.error("RSVP error:", error)
68 |     if (error instanceof z.ZodError) {
69 |       return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
70 |     }
71 |     return NextResponse.json({ error: "Failed to update RSVP status" }, { status: 500 })
72 |   }
73 | }
74 | 


--------------------------------------------------------------------------------
/app/api/events/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server"
 2 | import { getServerCurrentUser } from "@/lib/auth-server"
 3 | import { getEvents, createEvent as dbCreateEvent, getNearbyEvents } from "@/lib/db"
 4 | import * as geofire from "geofire-common"
 5 | import { GeoPoint } from "firebase/firestore"
 6 | import { z } from "zod"
 7 | 
 8 | // ... (eventSchema remains the same)
 9 | 
10 | export async function GET(request: NextRequest) {
11 |   try {
12 |     const { searchParams } = new URL(request.url)
13 |     const lat = searchParams.get('lat')
14 |     const lon = searchParams.get('lon')
15 |     const radius = searchParams.get('radius')
16 | 
17 |     if (lat && lon && radius) {
18 |       const events = await getNearbyEvents(
19 |         [parseFloat(lat), parseFloat(lon)],
20 |         parseFloat(radius)
21 |       )
22 |       return NextResponse.json({ events })
23 |     }
24 | 
25 |     const events = await getEvents()
26 |     return NextResponse.json({ events })
27 |   } catch (error) {
28 |     console.error("Error fetching events:", error)
29 |     return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
30 |   }
31 | }
32 | 
33 | // ... (POST function remains the same)
34 | 


--------------------------------------------------------------------------------
/app/api/maps/config/route.ts:
--------------------------------------------------------------------------------
 1 | import { NextResponse } from "next/server"
 2 | import { getAuth } from "@/lib/auth"
 3 | 
 4 | export async function GET() {
 5 |   try {
 6 |     // Verify user is authenticated
 7 |     const user = await getAuth()
 8 |     if (!user) {
 9 |       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
10 |     }
11 | 
12 |     const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
13 | 
14 |     if (!apiKey) {
15 |       return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
16 |     }
17 | 
18 |     return NextResponse.json({
19 |       apiKey,
20 |     })
21 |   } catch (error) {
22 |     console.error("Maps config error:", error)
23 |     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
24 |   }
25 | }
26 | 


--------------------------------------------------------------------------------
/app/api/users/[id]/events/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server";
 2 | import { getServerCurrentUser } from "@/lib/auth-server";
 3 | import { getUserOrganizedEvents, getUserJoinedEvents } from "@/lib/db";
 4 | 
 5 | export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
 6 |   try {
 7 |     const { id } = params;
 8 |     const user = await getServerCurrentUser();
 9 |     
10 |     const { searchParams } = new URL(request.url);
11 |     const eventType = searchParams.get('type');
12 | 
13 |     if (!user) {
14 |       return NextResponse.json({ error: "Authentication required" }, { status: 401 });
15 |     }
16 | 
17 |     if (user.uid !== id) {
18 |       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
19 |     }
20 | 
21 |     let events;
22 |     if (eventType === 'organized') {
23 |       events = await getUserOrganizedEvents(id);
24 |     } else if (eventType === 'joined') {
25 |       events = await getUserJoinedEvents(id);
26 |     } else {
27 |       return NextResponse.json({ error: "Invalid event type specified" }, { status: 400 });
28 |     }
29 | 
30 |     return NextResponse.json({ events });
31 | 
32 |   } catch (error) {
33 |     console.error("Error in GET /api/users/[id]/events:", error);
34 |     return NextResponse.json({ error: "Failed to fetch user events" }, { status: 500 });
35 |   }
36 | }
37 | 


--------------------------------------------------------------------------------
/app/api/users/[id]/public-profile/route.ts:
--------------------------------------------------------------------------------
 1 | import { NextResponse } from "next/server";
 2 | import { db } from "@/lib/db";
 3 | import { doc, getDoc } from "firebase/firestore";
 4 | import { getEventCountsForUser } from "@/lib/db"; // Assuming this function exists
 5 | 
 6 | export async function GET(request: Request, { params }: { params: { id: string } }) {
 7 |     try {
 8 |         const userId = params.id;
 9 |         if (!userId) {
10 |             return NextResponse.json({ error: "User ID is required" }, { status: 400 });
11 |         }
12 | 
13 |         const userRef = doc(db, "users", userId);
14 |         const userSnap = await getDoc(userRef);
15 | 
16 |         if (!userSnap.exists()) {
17 |             return NextResponse.json({ error: "User not found" }, { status: 404 });
18 |         }
19 | 
20 |         const userData = userSnap.data();
21 |         const stats = await getEventCountsForUser(userId);
22 | 
23 |         const publicProfile = {
24 |             displayName: userData.displayName || "Huddle User",
25 |             photoURL: userData.photoURL || null,
26 |             bio: userData.bio || null,
27 |             favoriteSports: userData.favoriteSports || [],
28 |         };
29 | 
30 |         return NextResponse.json({ profile: publicProfile, stats });
31 | 
32 |     } catch (error) {
33 |         console.error(`Error fetching public profile for user ${params.id}:`, error);
34 |         return NextResponse.json({ error: "Failed to fetch public profile" }, { status: 500 });
35 |     }
36 | }
37 | 


--------------------------------------------------------------------------------
/app/api/users/profile/route.ts:
--------------------------------------------------------------------------------
 1 | import { type NextRequest, NextResponse } from "next/server"
 2 | import { getServerCurrentUser } from "@/lib/auth-server"
 3 | import { db } from "@/lib/firebase-admin"
 4 | import { z } from "zod"
 5 | 
 6 | const profileSchema = z.object({
 7 |   displayName: z.string().min(3, "Display name must be at least 3 characters long").max(50),
 8 |   bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
 9 |   favoriteSports: z.array(z.string()).max(5, "You can select up to 5 favorite sports").optional(),
10 | })
11 | 
12 | export async function POST(request: NextRequest) {
13 |   try {
14 |     const user = await getServerCurrentUser()
15 |     if (!user) {
16 |       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
17 |     }
18 | 
19 |     const body = await request.json()
20 |     const validationResult = profileSchema.safeParse(body)
21 | 
22 |     if (!validationResult.success) {
23 |       return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
24 |     }
25 | 
26 |     const { displayName, bio, favoriteSports } = validationResult.data
27 | 
28 |     const userRef = db.collection("users").doc(user.uid)
29 |     await userRef.update({
30 |       displayName,
31 |       bio: bio || "",
32 |       favoriteSports: favoriteSports || [],
33 |     })
34 | 
35 |     return NextResponse.json({ success: true })
36 |   } catch (error) {
37 |     console.error("Error updating profile:", error)
38 |     if (error instanceof z.ZodError) {
39 |       return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
40 |     }
41 |     return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
42 |   }
43 | }
44 | 


--------------------------------------------------------------------------------
/app/globals.css:
--------------------------------------------------------------------------------
  1 | @tailwind base;
  2 | @tailwind components;
  3 | @tailwind utilities;
  4 | 
  5 | @layer utilities {
  6 |   .text-balance {
  7 |     text-wrap: balance;
  8 |   }
  9 | 
 10 |   /* Refined Glassmorphism */
 11 |   .glass-surface {
 12 |     background: rgba(255, 255, 255, 0.1);
 13 |     backdrop-filter: blur(16px);
 14 |     -webkit-backdrop-filter: blur(16px);
 15 |     border: 1px solid rgba(255, 255, 255, 0.15);
 16 |   }
 17 | 
 18 |   @keyframes liquid-gradient-animation {
 19 |     0% { background-position: 0% 50%; }
 20 |     50% { background-position: 100% 50%; }
 21 |     100% { background-position: 0% 50%; }
 22 |   }
 23 | 
 24 |   .liquid-gradient {
 25 |     background: linear-gradient(-45deg, hsl(260, 50%, 12%), hsl(220, 60%, 15%), hsl(260, 50%, 12%));
 26 |     background-size: 200% 200%;
 27 |     animation: liquid-gradient-animation 20s ease infinite;
 28 |   }
 29 |   
 30 |   .no-scrollbar::-webkit-scrollbar {
 31 |     display: none;
 32 |   }
 33 | 
 34 |   .no-scrollbar {
 35 |     -ms-overflow-style: none;
 36 |     scrollbar-width: none;
 37 |   }
 38 | }
 39 | 
 40 | @layer base {
 41 |   :root {
 42 |     --background: 240 55% 14%; /* A new, richer dark base */
 43 |     --foreground: 210 40% 98%;
 44 | 
 45 |     --card: 222.2 84% 4.9%;
 46 |     --card-foreground: 210 40% 98%;
 47 | 
 48 |     --popover: 222.2 84% 4.9%;
 49 |     --popover-foreground: 210 40% 98%;
 50 | 
 51 |     --primary: 31 94% 52%; /* Sunny Orange */
 52 |     --primary-foreground: 210 40% 98%;
 53 | 
 54 |     --secondary: 217.2 32.6% 17.5%;
 55 |     --secondary-foreground: 210 40% 98%;
 56 | 
 57 |     --muted: 217.2 32.6% 17.5%;
 58 |     --muted-foreground: 215 20.2% 65.1%;
 59 | 
 60 |     --accent: 31 94% 52%;
 61 |     --accent-foreground: 210 40% 98%;
 62 |     
 63 |     --destructive: 0 62.8% 30.6%;
 64 |     --destructive-foreground: 210 40% 98%;
 65 | 
 66 |     --border: 217.2 32.6% 17.5%;
 67 |     --input: 217.2 32.6% 17.5%;
 68 |     --ring: 31 94% 52%;
 69 | 
 70 |     --radius: 1rem;
 71 |   }
 72 | 
 73 |   .dark {
 74 |     /* Keeping dark mode consistent with the primary theme */
 75 |     --background: 240 55% 14%;
 76 |     --foreground: 210 40% 98%;
 77 | 
 78 |     --card: 222.2 84% 4.9%;
 79 |     --card-foreground: 210 40% 98%;
 80 | 
 81 |     --popover: 222.2 84% 4.9%;
 82 |     --popover-foreground: 210 40% 98%;
 83 | 
 84 |     --primary: 31 94% 52%;
 85 |     --primary-foreground: 210 40% 98%;
 86 | 
 87 |     --secondary: 217.2 32.6% 17.5%;
 88 |     --secondary-foreground: 210 40% 98%;
 89 | 
 90 |     --muted: 217.2 32.6% 17.5%;
 91 |     --muted-foreground: 215 20.2% 65.1%;
 92 | 
 93 |     --accent: 31 94% 52%;
 94 |     --accent-foreground: 210 40% 98%;
 95 |     
 96 |     --destructive: 0 62.8% 30.6%;
 97 |     --destructive-foreground: 210 40% 98%;
 98 | 
 99 |     --border: 217.2 32.6% 17.5%;
100 |     --input: 217.2 32.6% 17.5%;
101 |     --ring: 31 94% 52%;
102 |   }
103 | }
104 | 
105 | @layer base {
106 |   * {
107 |     @apply border-border;
108 |   }
109 |   body {
110 |     @apply bg-background text-foreground;
111 |     font-size: 1.05rem;
112 |   }
113 | }
114 | 


--------------------------------------------------------------------------------
/app/layout.tsx:
--------------------------------------------------------------------------------
 1 | import type React from "react"
 2 | import type { Metadata } from "next"
 3 | import { Inter } from "next/font/google"
 4 | import "./globals.css"
 5 | import { FirebaseProvider } from "@/lib/firebase-context"
 6 | import { NotificationPermissionHandler } from "@/components/notification-permission-handler"
 7 | import { Analytics } from "@vercel/analytics/react"
 8 | import { SpeedInsights } from "@vercel/speed-insights/next"
 9 | import { Toaster } from "@/components/ui/sonner"
10 | 
11 | const inter = Inter({ subsets: ["latin"] })
12 | 
13 | export const metadata: Metadata = {
14 |   title: "Huddle - Find Pickup Sports Games",
15 |   description: "Find and join pickup sports games in your local community",
16 |     generator: 'v.dev'
17 | }
18 | 
19 | export default function RootLayout({
20 |   children,
21 | }: {
22 |   children: React.ReactNode
23 | }) {
24 |   return (
25 |     <html lang="en">
26 |       <body className={inter.className}>
27 |         <FirebaseProvider>
28 |           <NotificationPermissionHandler />
29 |           {children}
30 |           <Toaster />
31 |           <Analytics />
32 |           <SpeedInsights />
33 |         </FirebaseProvider>
34 |       </body>
35 |     </html>
36 |   )
37 | }
38 | 


--------------------------------------------------------------------------------
/app/page.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import { useState } from "react"
 4 | import { useAuth } from "@/lib/firebase-context"
 5 | import LandingPage from "@/components/landing-page"
 6 | import { Dialog, DialogContent } from "@/components/ui/dialog"
 7 | import AuthScreen from "@/components/auth-screen"
 8 | import { useRouter } from "next/navigation"
 9 | 
10 | export default function Home() {
11 |   const { user, loading, error } = useAuth()
12 |   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
13 |   const router = useRouter()
14 | 
15 |   if (user) {
16 |     router.push("/discover")
17 |     return null
18 |   }
19 | 
20 |   if (error) {
21 |     return (
22 |       <div className="min-h-screen liquid-gradient flex items-center justify-center p-4 text-white">
23 |         <div className="text-center max-w-md glass-card p-8 rounded-2xl">
24 |           <h1 className="text-2xl font-bold mb-4">Firebase Error</h1>
25 |           <p className="mb-6">{error}</p>
26 |         </div>
27 |       </div>
28 |     )
29 |   }
30 | 
31 |   if (loading) {
32 |     return (
33 |       <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
34 |         <div className="text-center">
35 |           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
36 |           <p>Connecting...</p>
37 |         </div>
38 |       </div>
39 |     )
40 |   }
41 | 
42 |   return (
43 |     <>
44 |       <LandingPage onGetStarted={() => setIsAuthModalOpen(true)} />
45 | 
46 |       <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
47 |         <DialogContent className="glass-surface border-white/15 bg-slate-900/80 max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
48 |           <AuthScreen onLogin={() => setIsAuthModalOpen(false)} />
49 |         </DialogContent>
50 |       </Dialog>
51 |     </>
52 |   )
53 | }
54 | 


--------------------------------------------------------------------------------
/components.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "$schema": "https://ui.shadcn.com/schema.json",
 3 |   "style": "default",
 4 |   "rsc": true,
 5 |   "tsx": true,
 6 |   "tailwind": {
 7 |     "config": "tailwind.config.ts",
 8 |     "css": "app/globals.css",
 9 |     "baseColor": "neutral",
10 |     "cssVariables": true,
11 |     "prefix": ""
12 |   },
13 |   "aliases": {
14 |     "components": "@/components",
15 |     "utils": "@/lib/utils",
16 |     "ui": "@/components/ui",
17 |     "lib": "@/lib",
18 |     "hooks": "@/hooks"
19 |   },
20 |   "iconLibrary": "lucide"
21 | }
22 | 


--------------------------------------------------------------------------------
/components/ai-generate-button.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import React from 'react';
 4 | import { Button } from "@/components/ui/button";
 5 | import { Sparkles, Loader2 } from 'lucide-react';
 6 | 
 7 | interface AIGenerateButtonProps {
 8 |   onClick: () => void;
 9 |   isLoading: boolean;
10 | }
11 | 
12 | const AIGenerateButton: React.FC<AIGenerateButtonProps> = ({ onClick, isLoading }) => {
13 |   return (
14 |     <Button
15 |       type="button"
16 |       variant="outline"
17 |       onClick={onClick}
18 |       disabled={isLoading}
19 |       className="w-full flex items-center justify-center gap-2 text-sm glass-card hover:glow text-white border-white/30"
20 |     >
21 |       {isLoading ? (
22 |         <>
23 |           <Loader2 className="h-4 w-4 animate-spin" />
24 |           <span>Generating...</span>
25 |         </>
26 |       ) : (
27 |         <>
28 |           <Sparkles className="h-4 w-4" />
29 |           <span>Generate with AI ✨</span>
30 |         </>
31 |       )}
32 |     </Button>
33 |   );
34 | };
35 | 
36 | export default AIGenerateButton;
37 | 


--------------------------------------------------------------------------------
/components/ai-suggestions-list.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import React from 'react';
 4 | import { Card, CardContent } from "@/components/ui/card";
 5 | 
 6 | interface Suggestion {
 7 |   title: string;
 8 |   description: string;
 9 | }
10 | 
11 | interface AISuggestionsListProps {
12 |   suggestions: Suggestion[];
13 |   onSelect: (suggestion: Suggestion) => void;
14 | }
15 | 
16 | const AISuggestionsList: React.FC<AISuggestionsListProps> = ({ suggestions, onSelect }) => {
17 |   if (suggestions.length === 0) {
18 |     return null;
19 |   }
20 | 
21 |   return (
22 |     <div className="space-y-2 mt-4">
23 |       {suggestions.map((suggestion, index) => (
24 |         <Card
25 |           key={index}
26 |           className="glass-card border-white/30 cursor-pointer hover:bg-white/20"
27 |           onClick={() => onSelect(suggestion)}
28 |         >
29 |           <CardContent className="p-4">
30 |             <p className="font-semibold text-white">{suggestion.title}</p>
31 |             <p className="text-sm text-white/80">{suggestion.description}</p>
32 |           </CardContent>
33 |         </Card>
34 |       ))}
35 |     </div>
36 |   );
37 | };
38 | 
39 | export default AISuggestionsList;
40 | 


--------------------------------------------------------------------------------
/components/auth-screen.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import { useState } from "react"
  4 | import { useAuth } from "@/lib/firebase-context"
  5 | import { Button } from "@/components/ui/button"
  6 | import { Input } from "@/components/ui/input"
  7 | import { Label } from "@/components/ui/label"
  8 | import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  9 | import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth"
 10 | 
 11 | interface AuthScreenProps {
 12 |   onLogin: (user: any) => void
 13 |   onBackToLanding?: () => void
 14 | }
 15 | 
 16 | export default function AuthScreen({ onLogin, onBackToLanding }: AuthScreenProps) {
 17 |   const [email, setEmail] = useState("")
 18 |   const [password, setPassword] = useState("")
 19 |   const [name, setName] = useState("")
 20 |   const [error, setError] = useState<string | null>(null)
 21 |   const [isLoading, setIsLoading] = useState(false)
 22 |   const { user } = useAuth()
 23 | 
 24 |   const handleAuthAction = async (action: "login" | "signup") => {
 25 |     setIsLoading(true)
 26 |     setError(null)
 27 |     try {
 28 |       let user
 29 |       if (action === "signup") {
 30 |         user = await signUpWithEmail(email, password, name)
 31 |       } else {
 32 |         user = await signInWithEmail(email, password)
 33 |       }
 34 |       onLogin(user)
 35 |     } catch (err: any) {
 36 |       setError(err.message)
 37 |     } finally {
 38 |       setIsLoading(false)
 39 |     }
 40 |   }
 41 | 
 42 |   const handleGoogleSignIn = async () => {
 43 |     setIsLoading(true)
 44 |     setError(null)
 45 |     try {
 46 |       const user = await signInWithGoogle()
 47 |       onLogin(user)
 48 |     } catch (err: any) {
 49 |       setError(err.message)
 50 |     } finally {
 51 |       setIsLoading(false)
 52 |     }
 53 |   }
 54 | 
 55 |   if (user) {
 56 |     return (
 57 |       <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
 58 |         <p>You are already logged in. Redirecting...</p>
 59 |       </div>
 60 |     )
 61 |   }
 62 | 
 63 |   return (
 64 |     <div className="p-6">
 65 |       {/* Hero Section */}
 66 |       <div className="text-center mb-8">
 67 |         <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
 68 |           Stop Searching, Start Playing. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Find Your Huddle.</span>
 69 |         </h2>
 70 |         <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
 71 |           Discover and join local sports games in real-time. Connect with players, organize events effortlessly, and never miss a moment of the action.
 72 |         </p>
 73 |       </div>
 74 | 
 75 |       <Tabs defaultValue="login" className="w-full max-w-sm mx-auto">
 76 |         <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20 rounded-lg p-1 h-auto">
 77 |           <TabsTrigger
 78 |             value="login"
 79 |             className="data-[state=active]:bg-white/20 data-[state=active]:shadow-md text-white"
 80 |           >
 81 |             Login
 82 |           </TabsTrigger>
 83 |           <TabsTrigger
 84 |             value="signup"
 85 |             className="data-[state=active]:bg-white/20 data-[state=active]:shadow-md text-white"
 86 |           >
 87 |             Sign Up
 88 |           </TabsTrigger>
 89 |         </TabsList>
 90 | 
 91 |         <div className="pt-6">
 92 |           <div className="space-y-4">
 93 |             <Button
 94 |               onClick={handleGoogleSignIn}
 95 |               className="w-full bg-white/90 text-black hover:bg-white"
 96 |               disabled={isLoading}
 97 |             >
 98 |               Continue with Google
 99 |             </Button>
100 |             <div className="relative">
101 |               <div className="absolute inset-0 flex items-center">
102 |                 <span className="w-full border-t border-white/30" />
103 |               </div>
104 |               <div className="relative flex justify-center text-xs uppercase">
105 |                 <span className="bg-transparent px-2 text-white/70">Or continue with email</span>
106 |               </div>
107 |             </div>
108 | 
109 |             {/* Login Tab */}
110 |             <TabsContent value="login" className="space-y-4">
111 |               <div className="space-y-2">
112 |                 <Label htmlFor="email-login" className="text-white/90">
113 |                   Email
114 |                 </Label>
115 |                 <Input
116 |                   id="email-login"
117 |                   type="email"
118 |                   placeholder="m@example.com"
119 |                   value={email}
120 |                   onChange={(e) => setEmail(e.target.value)}
121 |                   className="glass border-white/30 text-white placeholder:text-white/60"
122 |                 />
123 |               </div>
124 |               <div className="space-y-2">
125 |                 <Label htmlFor="password-login" className="text-white/90">
126 |                   Password
127 |                 </Label>
128 |                 <Input
129 |                   id="password-login"
130 |                   type="password"
131 |                   value={password}
132 |                   onChange={(e) => setPassword(e.target.value)}
133 |                   className="glass border-white/30 text-white"
134 |                 />
135 |               </div>
136 |               <Button
137 |                 onClick={() => handleAuthAction("login")}
138 |                 disabled={isLoading}
139 |                 className="w-full glass-card hover:glow text-white border-white/30"
140 |               >
141 |                 {isLoading ? "Logging in..." : "Login"}
142 |               </Button>
143 |             </TabsContent>
144 | 
145 |             {/* Sign Up Tab */}
146 |             <TabsContent value="signup" className="space-y-4">
147 |               <div className="space-y-2">
148 |                 <Label htmlFor="name-signup" className="text-white/90">
149 |                   Name
150 |                 </Label>
151 |                 <Input
152 |                   id="name-signup"
153 |                   placeholder="Your Name"
154 |                   value={name}
155 |                   onChange={(e) => setName(e.target.value)}
156 |                   className="glass border-white/30 text-white placeholder:text-white/60"
157 |                 />
158 |               </div>
159 |               <div className="space-y-2">
160 |                 <Label htmlFor="email-signup" className="text-white/90">
161 |                   Email
162 |                 </Label>
163 |                 <Input
164 |                   id="email-signup"
165 |                   type="email"
166 |                   placeholder="m@example.com"
167 |                   value={email}
168 |                   onChange={(e) => setEmail(e.target.value)}
169 |                   className="glass border-white/30 text-white placeholder:text-white/60"
170 |                 />
171 |               </div>
172 |               <div className="space-y-2">
173 |                 <Label htmlFor="password-signup" className="text-white/90">
174 |                   Password
175 |                 </Label>
176 |                 <Input
177 |                   id="password-signup"
178 |                   type="password"
179 |                   value={password}
180 |                   onChange={(e) => setPassword(e.target.value)}
181 |                   className="glass border-white/30 text-white"
182 |                 />
183 |               </div>
184 |               <Button
185 |                 onClick={() => handleAuthAction("signup")}
186 |                 disabled={isLoading}
187 |                 className="w-full glass-card hover:glow text-white border-white/30"
188 |               >
189 |                 {isLoading ? "Creating account..." : "Sign Up"}
190 |               </Button>
191 |             </TabsContent>
192 | 
193 |             {error && <p className="text-red-400 text-sm text-center">{error}</p>}
194 |           </div>
195 |         </div>
196 |       </Tabs>
197 |     </div>
198 |   )
199 | }
200 | 


--------------------------------------------------------------------------------
/components/bottom-navigation.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import Link from "next/link"
 4 | import { usePathname } from "next/navigation"
 5 | import { MapPin, Calendar, Search, User } from "lucide-react"
 6 | 
 7 | const HuddleLogo = () => (
 8 |   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-50">
 9 |     <path d="M4 4V20M20 4V20M4 12H20M12 4V12C12 14.2091 10.2091 16 8 16C5.79086 16 4 14.2091 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
10 |   </svg>
11 | )
12 | 
13 | export default function BottomNavigation() {
14 |   const pathname = usePathname()
15 | 
16 |   const tabs = [
17 |     { id: "map", label: "Map", icon: MapPin, href: "/map" },
18 |     { id: "discover", label: "Discover", icon: Search, href: "/discover" },
19 |     { id: "my-events", label: "My Events", icon: Calendar, href: "/my-events" },
20 |     { id: "profile", label: "Profile", icon: User, href: "/profile" },
21 |   ]
22 | 
23 |   return (
24 |     <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center px-4">
25 |       <div className="flex items-center justify-around gap-2 rounded-full p-2 glass-surface border-white/15 w-full max-w-md">
26 |         <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
27 |           <HuddleLogo />
28 |         </div>
29 |         {tabs.map((tab) => {
30 |           const Icon = tab.icon
31 |           const isActive = pathname === tab.href
32 | 
33 |           return (
34 |             <Link
35 |               key={tab.id}
36 |               id={`${tab.id}-button`}
37 |               href={tab.href}
38 |               className={`
39 |                 flex flex-col items-center justify-center w-16 h-16 rounded-2xl
40 |                 transition-colors duration-200
41 |                 ${isActive ? "bg-white/10" : "text-slate-400 hover:bg-white/5"}
42 |               `}
43 |             >
44 |               <Icon className={`w-6 h-6 mb-1 ${isActive ? "text-primary" : "text-slate-400"}`} />
45 |               <span className={`text-xs font-light ${isActive ? "text-slate-50" : "text-slate-400"}`}>{tab.label}</span>
46 |             </Link>
47 |           )
48 |         })}
49 |       </div>
50 |     </div>
51 |   )
52 | }
53 | 


--------------------------------------------------------------------------------
/components/create-event-modal.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import type React from "react"
  4 | import { useState, useEffect } from "react"
  5 | import {
  6 |   Dialog,
  7 |   DialogContent,
  8 |   DialogHeader,
  9 |   DialogTitle,
 10 |   DialogDescription,
 11 |   DialogFooter,
 12 | } from "@/components/ui/dialog"
 13 | import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps"
 14 | import { Button } from "@/components/ui/button"
 15 | import { Input } from "@/components/ui/input"
 16 | import { Label } from "@/components/ui/label"
 17 | import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
 18 | import { Switch } from "@/components/ui/switch"
 19 | import { Rocket, Loader2 } from "lucide-react"
 20 | import LocationSearchInput from "./location-search"
 21 | import AIGenerateButton from "./ai-generate-button"
 22 | import AISuggestionsList from "./ai-suggestions-list"
 23 | import { useFirebase } from "@/lib/firebase-context"
 24 | import { toast } from "sonner"
 25 | 
 26 | interface CreateEventModalProps {
 27 |   isOpen: boolean
 28 |   onClose: () => void
 29 |   onEventCreated: (event: any) => void
 30 |   userLocation: { lat: number; lng: number } | null
 31 | }
 32 | 
 33 | const SPORTS = [
 34 |   "Basketball", "Soccer", "Tennis", "Cricket", "Baseball", "Volleyball",
 35 |   "Football", "Hockey", "Badminton", "Table Tennis",
 36 | ]
 37 | 
 38 | export default function CreateEventModal({ isOpen, onClose, onEventCreated, userLocation }: CreateEventModalProps) {
 39 |   const [isLoading, setIsLoading] = useState(false)
 40 |   const [formData, setFormData] = useState({
 41 |     title: "",
 42 |     sport: "",
 43 |     location: "",
 44 |     date: "",
 45 |     time: "",
 46 |     maxPlayers: 10,
 47 |     description: "",
 48 |   })
 49 |   const [isAiLoading, setIsAiLoading] = useState(false)
 50 |   const [suggestions, setSuggestions] = useState([])
 51 |   const [boostEvent, setBoostEvent] = useState(false)
 52 |   const [mapCenter, setMapCenter] = useState(userLocation || { lat: 37.7749, lng: -122.4194 })
 53 |   const [markerPosition, setMarkerPosition] = useState(userLocation || { lat: 37.7749, lng: -122.4194 })
 54 | 
 55 |   useEffect(() => {
 56 |     if (isOpen && userLocation) {
 57 |       setMapCenter(userLocation)
 58 |       setMarkerPosition(userLocation)
 59 |     }
 60 |   }, [isOpen, userLocation])
 61 | 
 62 |   const handleInputChange = (field: string, value: any) => {
 63 |     setFormData((prev) => ({ ...prev, [field]: value }))
 64 |   }
 65 | 
 66 |   const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
 67 |     if (place?.geometry?.location) {
 68 |       const newPosition = {
 69 |         lat: place.geometry.location.lat(),
 70 |         lng: place.geometry.location.lng(),
 71 |       }
 72 |       handleInputChange("location", place.formatted_address || place.name || "")
 73 |       setMapCenter(newPosition)
 74 |       setMarkerPosition(newPosition)
 75 |     }
 76 |   }
 77 | 
 78 |   const handleSubmit = async (e: React.FormEvent) => {
 79 |     e.preventDefault()
 80 |     if (!formData.sport || !formData.location || !markerPosition) {
 81 |       toast.error("Please fill in all required fields.")
 82 |       return
 83 |     }
 84 |     setIsLoading(true)
 85 | 
 86 |     try {
 87 |       const response = await fetch("/api/events", {
 88 |         method: "POST",
 89 |         headers: { "Content-Type": "application/json" },
 90 |         body: JSON.stringify({ ...formData, latitude: markerPosition.lat, longitude: markerPosition.lng, isBoosted: boostEvent }),
 91 |       })
 92 | 
 93 |       if (response.ok) {
 94 |         const data = await response.json()
 95 |         toast.success("Event created successfully!")
 96 |         onEventCreated(data.event)
 97 |         onClose()
 98 |       } else {
 99 |         const errorData = await response.json()
100 |         toast.error(`Error: ${errorData.error}`)
101 |       }
102 |     } catch (error) {
103 |       toast.error("An unexpected error occurred.")
104 |     } finally {
105 |       setIsLoading(false)
106 |     }
107 |   }
108 | 
109 |   return (
110 |     <Dialog open={isOpen} onOpenChange={onClose}>
111 |       <DialogContent className="glass-surface border-white/15 text-foreground p-0 gap-0 sm:max-w-md max-h-[90vh] flex flex-col">
112 |         <DialogHeader className="p-6 pb-4">
113 |           <DialogTitle>Host a New Game</DialogTitle>
114 |           <DialogDescription>Fill in the details to get your game on the map.</DialogDescription>
115 |         </DialogHeader>
116 |         
117 |         <div className="flex-1 overflow-y-auto no-scrollbar px-6">
118 |           <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
119 |             <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
120 |               <div>
121 |                 <Label htmlFor="title">Event Title</Label>
122 |                 <Input id="title" placeholder="e.g., Evening Basketball Run" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} required />
123 |               </div>
124 | 
125 |               <AIGenerateButton onClick={() => {}} isLoading={isAiLoading} />
126 |               <AISuggestionsList suggestions={suggestions} onSelect={() => {}} />
127 | 
128 |               <div>
129 |                 <Label htmlFor="description">Description</Label>
130 |                 <Input id="description" placeholder="A short and friendly description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} />
131 |               </div>
132 | 
133 |               <div>
134 |                 <Label htmlFor="sport">Sport</Label>
135 |                 <Select required value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
136 |                   <SelectTrigger><SelectValue placeholder="Select a sport" /></SelectTrigger>
137 |                   <SelectContent>{SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
138 |                 </Select>
139 |               </div>
140 | 
141 |               <div>
142 |                 <Label htmlFor="location-search">Location</Label>
143 |                 <LocationSearchInput onPlaceSelect={handlePlaceSelect} />
144 |                 <div className="h-48 w-full rounded-lg overflow-hidden relative mt-2 border border-border">
145 |                   <Map defaultCenter={mapCenter} center={mapCenter} defaultZoom={15} gestureHandling={"greedy"} disableDefaultUI={true} mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}>
146 |                     <AdvancedMarker position={markerPosition} draggable={true} onDragEnd={(e) => setMarkerPosition({ lat: e.latLng!.lat(), lng: e.latLng!.lng() })} />
147 |                   </Map>
148 |                 </div>
149 |               </div>
150 | 
151 |               <div className="grid grid-cols-2 gap-4">
152 |                   <div>
153 |                       <Label htmlFor="date">Date</Label>
154 |                       <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} required />
155 |                   </div>
156 |                   <div>
157 |                       <Label htmlFor="time">Time</Label>
158 |                       <Input id="time" type="time" value={formData.time} onChange={(e) => handleInputChange("time", e.target.value)} required />
159 |                   </div>
160 |               </div>
161 | 
162 |               <div>
163 |                 <Label htmlFor="maxPlayers">Number of Players</Label>
164 |                 <Select value={String(formData.maxPlayers)} onValueChange={(v) => handleInputChange("maxPlayers", Number(v))}>
165 |                   <SelectTrigger><SelectValue /></SelectTrigger>
166 |                   <SelectContent>{Array.from({ length: 49 }, (_, i) => i + 2).map(n => <SelectItem key={n} value={String(n)}>{n} players</SelectItem>)}</SelectContent>
167 |                 </Select>
168 |               </div>
169 | 
170 |               <div className="space-y-4 pt-4 border-t border-border">
171 |                 <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
172 |                     <div>
173 |                         <Label htmlFor="boost" className="font-bold flex items-center gap-2">
174 |                             <Rocket className="w-5 h-5 text-yellow-400" />
175 |                             Boost Event
176 |                         </Label>
177 |                         <p className="text-sm text-slate-400 mt-1">Get your game featured to fill your roster faster.</p>
178 |                     </div>
179 |                     <Switch id="boost" checked={boostEvent} onCheckedChange={setBoostEvent} />
180 |                 </div>
181 |               </div>
182 |             </form>
183 |           </APIProvider>
184 |         </div>
185 | 
186 |         <DialogFooter className="p-6 pt-4 bg-slate-900/50 border-t border-border">
187 |           <Button type="submit" form="event-form" disabled={isLoading} className="w-full" size="lg">
188 |             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Host Game"}
189 |           </Button>
190 |         </DialogFooter>
191 |       </DialogContent>
192 |     </Dialog>
193 |   )
194 | }
195 | 


--------------------------------------------------------------------------------
/components/error-boundary.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import React from "react"
 4 | import { Button } from "@/components/ui/button"
 5 | 
 6 | interface ErrorBoundaryState {
 7 |   hasError: boolean
 8 |   error?: Error
 9 | }
10 | 
11 | interface ErrorBoundaryProps {
12 |   children: React.ReactNode
13 |   fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
14 | }
15 | 
16 | export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
17 |   constructor(props: ErrorBoundaryProps) {
18 |     super(props)
19 |     this.state = { hasError: false }
20 |   }
21 | 
22 |   static getDerivedStateFromError(error: Error): ErrorBoundaryState {
23 |     return { hasError: true, error }
24 |   }
25 | 
26 |   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
27 |     console.error("🚨 Error Boundary caught an error:", error, errorInfo)
28 |   }
29 | 
30 |   resetError = () => {
31 |     this.setState({ hasError: false, error: undefined })
32 |   }
33 | 
34 |   render() {
35 |     if (this.state.hasError) {
36 |       const FallbackComponent = this.props.fallback || DefaultErrorFallback
37 |       return <FallbackComponent error={this.state.error} resetError={this.resetError} />
38 |     }
39 | 
40 |     return this.props.children
41 |   }
42 | }
43 | 
44 | function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
45 |   return (
46 |     <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
47 |       <div className="text-center max-w-md">
48 |         <div className="glass-card rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
49 |           <span className="text-2xl">⚠️</span>
50 |         </div>
51 |         <h1 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Something went wrong</h1>
52 |         <p className="text-white/80 mb-6 drop-shadow">{error?.message || "An unexpected error occurred"}</p>
53 |         <div className="space-y-2">
54 |           <Button onClick={resetError} className="glass-card hover:glow text-white border-white/30 w-full">
55 |             Try Again
56 |           </Button>
57 |           <Button
58 |             onClick={() => window.location.reload()}
59 |             variant="outline"
60 |             className="glass-card text-white border-white/30 w-full"
61 |           >
62 |             Reload Page
63 |           </Button>
64 |         </div>
65 |         {process.env.NODE_ENV === "development" && error && (
66 |           <details className="mt-4 text-left">
67 |             <summary className="text-white/60 cursor-pointer">Error Details</summary>
68 |             <pre className="mt-2 text-xs text-white/60 bg-black/20 p-2 rounded overflow-auto">{error.stack}</pre>
69 |           </details>
70 |         )}
71 |       </div>
72 |     </div>
73 |   )
74 | }
75 | 


--------------------------------------------------------------------------------
/components/event-chat.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import type React from "react"
  4 | 
  5 | import { useState, useEffect, useRef } from "react"
  6 | import { Button } from "@/components/ui/button"
  7 | import { Input } from "@/components/ui/input"
  8 | import { ScrollArea } from "@/components/ui/scroll-area"
  9 | import { Send, MessageCircle } from "lucide-react"
 10 | import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
 11 | import { db } from "@/lib/firebase"
 12 | import { useAuth } from "@/lib/firebase-context"
 13 | import { toast } from "sonner"
 14 | 
 15 | interface ChatMessage {
 16 |   id: string
 17 |   userId: string
 18 |   userName: string
 19 |   message: string
 20 |   timestamp: any
 21 | }
 22 | 
 23 | interface EventChatProps {
 24 |   eventId: string
 25 | }
 26 | 
 27 | export default function EventChat({ eventId }: EventChatProps) {
 28 |   const { user } = useAuth();
 29 |   const [messages, setMessages] = useState<ChatMessage[]>([])
 30 |   const [newMessage, setNewMessage] = useState("")
 31 |   const [sending, setSending] = useState(false)
 32 |   const scrollAreaRef = useRef<HTMLDivElement>(null)
 33 |   const messagesEndRef = useRef<HTMLDivElement>(null)
 34 | 
 35 |   // Real-time listener for chat messages
 36 |   useEffect(() => {
 37 |     if (!db) return
 38 | 
 39 |     const chatRef = collection(db, "events", eventId, "chat")
 40 |     const q = query(chatRef, orderBy("timestamp", "asc"))
 41 | 
 42 |     const unsubscribe = onSnapshot(q, (snapshot) => {
 43 |       const newMessages = snapshot.docs.map((doc) => ({
 44 |         id: doc.id,
 45 |         ...doc.data(),
 46 |       })) as ChatMessage[]
 47 | 
 48 |       setMessages(newMessages)
 49 |     })
 50 | 
 51 |     return () => unsubscribe()
 52 |   }, [eventId])
 53 | 
 54 |   // Auto-scroll to bottom when new messages arrive
 55 |   useEffect(() => {
 56 |     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
 57 |   }, [messages])
 58 | 
 59 |   const handleSendMessage = async (e: React.FormEvent) => {
 60 |     e.preventDefault()
 61 | 
 62 |     if (!newMessage.trim() || sending || !user) return
 63 | 
 64 |     setSending(true)
 65 |     try {
 66 |       const response = await fetch(`/api/events/${eventId}/chat`, {
 67 |         method: "POST",
 68 |         headers: { "Content-Type": "application/json" },
 69 |         body: JSON.stringify({ message: newMessage, userId: user.uid, userName: user.displayName }),
 70 |       })
 71 | 
 72 |       if (response.ok) {
 73 |         setNewMessage("")
 74 |         // Do not show a toast for every message to avoid being noisy.
 75 |         // The message appearing in the chat is sufficient feedback.
 76 |       } else {
 77 |         const errorData = await response.json()
 78 |         toast.error(`Failed to send message: ${errorData.error}`)
 79 |       }
 80 |     } catch (error) {
 81 |       console.error("Error sending message:", error)
 82 |       toast.error("An unexpected error occurred while sending your message.")
 83 |     } finally {
 84 |       setSending(false)
 85 |     }
 86 |   }
 87 | 
 88 |   const formatTime = (timestamp: any) => {
 89 |     if (!timestamp) return ""
 90 | 
 91 |     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000)
 92 |     return date.toLocaleTimeString("en-US", {
 93 |       hour: "numeric",
 94 |       minute: "2-digit",
 95 |       hour12: true,
 96 |     })
 97 |   }
 98 | 
 99 |   return (
100 |     <div className="flex flex-col h-full">
101 |       {/* Chat Header */}
102 |       <div className="flex items-center space-x-2 p-3 border-b bg-gray-50">
103 |         <MessageCircle className="w-5 h-5 text-blue-600" />
104 |         <h3 className="font-semibold">Event Chat</h3>
105 |         <span className="text-sm text-gray-500">({messages.length} messages)</span>
106 |       </div>
107 | 
108 |       {/* Messages Area */}
109 |       <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
110 |         {messages.length === 0 ? (
111 |           <div className="text-center text-gray-500 py-8">
112 |             <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
113 |             <p className="text-sm">No messages yet. Start the conversation!</p>
114 |           </div>
115 |         ) : (
116 |           <div className="space-y-3">
117 |             {messages.map((message) => (
118 |               <div key={message.id} className={`flex ${message.userId === user?.uid ? "justify-end" : "justify-start"}`}>
119 |                 <div
120 |                   className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
121 |                     message.userId === user?.uid ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
122 |                   }`}
123 |                 >
124 |                   {message.userId !== user?.uid && (
125 |                     <p className="text-xs font-semibold mb-1 opacity-75">{message.userName}</p>
126 |                   )}
127 |                   <p className="text-sm">{message.message}</p>
128 |                   <p className={`text-xs mt-1 ${message.userId === user?.uid ? "text-blue-100" : "text-gray-500"}`}>
129 |                     {formatTime(message.timestamp)}
130 |                   </p>
131 |                 </div>
132 |               </div>
133 |             ))}
134 |             <div ref={messagesEndRef} />
135 |           </div>
136 |         )}
137 |       </ScrollArea>
138 | 
139 |       {/* Message Input */}
140 |       <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
141 |         <div className="flex space-x-2">
142 |           <Input
143 |             value={newMessage}
144 |             onChange={(e) => setNewMessage(e.target.value)}
145 |             placeholder="Type a message..."
146 |             maxLength={500}
147 |             disabled={sending}
148 |             className="flex-1"
149 |           />
150 |           <Button type="submit" disabled={!newMessage.trim() || sending} size="sm" className="px-3">
151 |             <Send className="w-4 h-4" />
152 |           </Button>
153 |         </div>
154 |         <p className="text-xs text-gray-500 mt-1">{newMessage.length}/500 characters</p>
155 |       </form>
156 |     </div>
157 |   )
158 | }
159 | 


--------------------------------------------------------------------------------
/components/event-details-drawer.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import {
 4 |   Drawer,
 5 |   DrawerContent,
 6 |   DrawerHeader,
 7 |   DrawerTitle,
 8 |   DrawerDescription,
 9 |   DrawerFooter,
10 |   DrawerClose,
11 | } from "@/components/ui/drawer"
12 | import { Button } from "@/components/ui/button"
13 | import { GameEvent } from "@/lib/types"
14 | import { Users, Calendar, Clock, MapPin } from "lucide-react"
15 | 
16 | interface EventDetailsDrawerProps {
17 |   event: GameEvent
18 |   isOpen: boolean
19 |   onClose: () => void
20 |   onEventUpdated: (event: GameEvent) => void
21 | }
22 | 
23 | export default function EventDetailsDrawer({ event, isOpen, onClose, onEventUpdated }: EventDetailsDrawerProps) {
24 |   if (!event) return null;
25 | 
26 |   return (
27 |     <Drawer open={isOpen} onOpenChange={onClose}>
28 |       <DrawerContent className="glass-surface border-white/15 text-foreground">
29 |         <DrawerHeader>
30 |           <DrawerTitle className="text-2xl font-bold">{event.title}</DrawerTitle>
31 |           <DrawerDescription>{event.description}</DrawerDescription>
32 |         </DrawerHeader>
33 |         <div className="px-4 space-y-4">
34 |           <div className="flex items-center">
35 |             <Users className="w-5 h-5 mr-2" />
36 |             <span>{event.rsvps.length} / {event.maxPlayers} players</span>
37 |           </div>
38 |           <div className="flex items-center">
39 |             <Calendar className="w-5 h-5 mr-2" />
40 |             <span>{new Date(event.date).toLocaleDateString()}</span>
41 |           </div>
42 |           <div className="flex items-center">
43 |             <Clock className="w-5 h-5 mr-2" />
44 |             <span>{event.time}</span>
45 |           </div>
46 |           <div className="flex items-center">
47 |             <MapPin className="w-5 h-5 mr-2" />
48 |             <span>{event.location}</span>
49 |           </div>
50 |         </div>
51 |         <DrawerFooter>
52 |           <Button size="lg">Join Game</Button>
53 |           <DrawerClose asChild>
54 |             <Button variant="outline">Close</Button>
55 |           </DrawerClose>
56 |         </DrawerFooter>
57 |       </DrawerContent>
58 |     </Drawer>
59 |   )
60 | }
61 | 


--------------------------------------------------------------------------------
/components/events/event-card.tsx:
--------------------------------------------------------------------------------
 1 | import React from "react";
 2 | import { Card, CardContent } from "@/components/ui/card";
 3 | import { Badge } from "@/components/ui/badge";
 4 | import { Button } from "@/components/ui/button";
 5 | import { Clock, MapPin, Users } from "lucide-react";
 6 | import { GameEvent } from "@/lib/types";
 7 | 
 8 | interface EventCardProps {
 9 |   event: GameEvent;
10 |   onSelectEvent: (event: GameEvent) => void;
11 | }
12 | 
13 | export const EventCard = React.memo(({ event, onSelectEvent }: EventCardProps) => {
14 |   const isFull = event.currentPlayers >= event.maxPlayers;
15 | 
16 |   const getTimeDifference = (date: string, time: string) => {
17 |     return "in 45m";
18 |   };
19 | 
20 |   return (
21 |     <Card className="glass-surface border-white/15 overflow-hidden flex flex-col">
22 |       <CardContent className="p-4 flex-grow">
23 |         <div className="flex justify-between items-start mb-3">
24 |           <h3 className="font-bold text-lg text-slate-50 pr-2">{event.title}</h3>
25 |           <Badge variant="secondary" className="bg-white/10 text-slate-300 border-none whitespace-nowrap">
26 |             {event.sport}
27 |           </Badge>
28 |         </div>
29 |         <div className="space-y-2 text-sm text-slate-300">
30 |           <div className="flex items-center">
31 |             <Clock className="w-4 h-4 mr-2 text-emerald-400" />
32 |             <span>{getTimeDifference(event.date, event.time)} • {event.time}</span>
33 |           </div>
34 |           <div className="flex items-center">
35 |             <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
36 |             <span>{event.distance ? `${event.distance} miles away` : event.location}</span>
37 |           </div>
38 |         </div>
39 |       </CardContent>
40 |       <div className="bg-white/5 px-4 py-3 flex justify-between items-center">
41 |         <div className="flex items-center">
42 |           <Users className="w-4 h-4 mr-2 text-slate-400" />
43 |           <span className="text-slate-300 font-medium">
44 |             {event.currentPlayers} / {event.maxPlayers}
45 |           </span>
46 |         </div>
47 |         <Button 
48 |             size="sm" 
49 |             onClick={() => onSelectEvent(event)} 
50 |             className="bg-primary text-primary-foreground h-9 px-4"
51 |             disabled={isFull}
52 |         >
53 |           {isFull ? "Full" : "View Details"}
54 |         </Button>
55 |       </div>
56 |     </Card>
57 |   );
58 | });
59 | 
60 | EventCard.displayName = 'EventCard';
61 | 
62 | export function EventCardSkeleton() {
63 |     return (
64 |       <Card className="glass-surface border-white/15 overflow-hidden flex flex-col animate-pulse">
65 |         <CardContent className="p-4 flex-grow">
66 |           <div className="flex justify-between items-start mb-3">
67 |             <div className="h-6 w-3/4 bg-slate-700 rounded-md"></div>
68 |             <div className="h-6 w-1/4 bg-slate-700 rounded-md"></div>
69 |           </div>
70 |           <div className="space-y-2">
71 |             <div className="h-4 w-5/6 bg-slate-700 rounded-md"></div>
72 |             <div className="h-4 w-4/6 bg-slate-700 rounded-md"></div>
73 |           </div>
74 |         </CardContent>
75 |         <div className="bg-white/5 px-4 py-3 flex justify-between items-center">
76 |           <div className="h-5 w-1/3 bg-slate-700 rounded-md"></div>
77 |           <div className="h-9 w-1/4 bg-primary rounded-md"></div>
78 |         </div>
79 |       </Card>
80 |     );
81 |   }
82 | 


--------------------------------------------------------------------------------
/components/events/summary-header.tsx:
--------------------------------------------------------------------------------
 1 | // components/events/summary-header.tsx
 2 | import React from "react";
 3 | import { Card, CardContent } from "@/components/ui/card";
 4 | import { Calendar, Users, Sun } from "lucide-react";
 5 | 
 6 | interface SummaryHeaderProps {
 7 |   totalEvents: number;
 8 |   eventsToday: number;
 9 |   yourUpcomingEvents: number;
10 | }
11 | 
12 | export function SummaryHeader({
13 |   totalEvents,
14 |   eventsToday,
15 |   yourUpcomingEvents,
16 | }: SummaryHeaderProps) {
17 |   return (
18 |     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
19 |       <Card className="glass-card p-4">
20 |         <CardContent className="flex items-center p-0">
21 |           <div className="bg-blue-500/20 p-3 rounded-full mr-4">
22 |             <Calendar className="w-6 h-6 text-blue-300" />
23 |           </div>
24 |           <div>
25 |             <div className="text-2xl font-bold text-white">{totalEvents}</div>
26 |             <p className="text-sm text-white/80">Total Events</p>
27 |           </div>
28 |         </CardContent>
29 |       </Card>
30 |       <Card className="glass-card p-4">
31 |         <CardContent className="flex items-center p-0">
32 |           <div className="bg-green-500/20 p-3 rounded-full mr-4">
33 |             <Sun className="w-6 h-6 text-green-300" />
34 |           </div>
35 |           <div>
36 |             <div className="text-2xl font-bold text-white">{eventsToday}</div>
37 |             <p className="text-sm text-white/80">Happening Today</p>
38 |           </div>
39 |         </CardContent>
40 |       </Card>
41 |       <Card className="glass-card p-4">
42 |         <CardContent className="flex items-center p-0">
43 |           <div className="bg-purple-500/20 p-3 rounded-full mr-4">
44 |             <Users className="w-6 h-6 text-purple-300" />
45 |           </div>
46 |           <div>
47 |             <div className="text-2xl font-bold text-white">{yourUpcomingEvents}</div>
48 |             <p className="text-sm text-white/80">Your Upcoming</p>
49 |           </div>
50 |         </CardContent>
51 |       </Card>
52 |     </div>
53 |   );
54 | }
55 | 
56 | export function SummaryHeaderSkeleton() {
57 |     return (
58 |         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-pulse">
59 |             <Card className="glass-card p-4">
60 |                 <CardContent className="flex items-center p-0">
61 |                     <div className="bg-white/20 p-3 rounded-full mr-4 h-12 w-12"></div>
62 |                     <div className="space-y-2">
63 |                         <div className="h-6 w-12 bg-white/20 rounded-md"></div>
64 |                         <div className="h-4 w-24 bg-white/20 rounded-md"></div>
65 |                     </div>
66 |                 </CardContent>
67 |             </Card>
68 |             <Card className="glass-card p-4">
69 |                 <CardContent className="flex items-center p-0">
70 |                     <div className="bg-white/20 p-3 rounded-full mr-4 h-12 w-12"></div>
71 |                     <div className="space-y-2">
72 |                         <div className="h-6 w-12 bg-white/20 rounded-md"></div>
73 |                         <div className="h-4 w-24 bg-white/20 rounded-md"></div>
74 |                     </div>
75 |                 </CardContent>
76 |             </Card>
77 |             <Card className="glass-card p-4">
78 |                 <CardContent className="flex items-center p-0">
79 |                     <div className="bg-white/20 p-3 rounded-full mr-4 h-12 w-12"></div>
80 |                     <div className="space-y-2">
81 |                         <div className="h-6 w-12 bg-white/20 rounded-md"></div>
82 |                         <div className="h-4 w-24 bg-white/20 rounded-md"></div>
83 |                     </div>
84 |                 </CardContent>
85 |             </Card>
86 |         </div>
87 |     )
88 | }
89 | 


--------------------------------------------------------------------------------
/components/huddle-pro-modal.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import {
 4 |   Dialog,
 5 |   DialogContent,
 6 |   DialogHeader,
 7 |   DialogTitle,
 8 |   DialogDescription,
 9 | } from "@/components/ui/dialog"
10 | import { Button } from "@/components/ui/button"
11 | import { CheckCircle, Zap } from "lucide-react"
12 | 
13 | interface HuddleProModalProps {
14 |   isOpen: boolean
15 |   onClose: () => void
16 | }
17 | 
18 | const proFeatures = [
19 |     { icon: <Zap className="w-5 h-5 text-primary" />, text: "Boost your games to the top of the map." },
20 |     { icon: <CheckCircle className="w-5 h-5 text-primary" />, text: "Create recurring weekly or bi-weekly events." },
21 |     { icon: <CheckCircle className="w-5 h-5 text-primary" />, text: "Get advanced analytics on your games." },
22 |     { icon: <CheckCircle className="w-5 h-5 text-primary" />, text: "Priority access to new features and support." },
23 | ]
24 | 
25 | export default function HuddleProModal({ isOpen, onClose }: HuddleProModalProps) {
26 |   return (
27 |     <Dialog open={isOpen} onOpenChange={onClose}>
28 |       <DialogContent className="glass-surface border-white/15 text-foreground">
29 |         <DialogHeader>
30 |           <DialogTitle className="text-2xl font-bold text-center">
31 |             Huddle Pro ✨
32 |           </DialogTitle>
33 |           <DialogDescription className="text-center">
34 |             Unlock exclusive features to take your games to the next level.
35 |           </DialogDescription>
36 |         </DialogHeader>
37 |         <div className="space-y-4 py-4">
38 |           {proFeatures.map((feature, index) => (
39 |             <div key={index} className="flex items-start gap-3">
40 |               {feature.icon}
41 |               <p className="text-slate-300">{feature.text}</p>
42 |             </div>
43 |           ))}
44 |         </div>
45 |         <Button size="lg" disabled>
46 |           Coming Soon!
47 |         </Button>
48 |       </DialogContent>
49 |     </Dialog>
50 |   )
51 | }
52 | 


--------------------------------------------------------------------------------
/components/landing-page.tsx:
--------------------------------------------------------------------------------
  1 | "use client";
  2 | 
  3 | import { useState, useEffect } from "react";
  4 | import { Button } from "@/components/ui/button";
  5 | import { Card, CardContent } from "@/components/ui/card";
  6 | import { 
  7 |   Users, 
  8 |   MapPin, 
  9 |   CheckCircle,
 10 |   ArrowRight,
 11 |   Cpu,
 12 |   Trophy
 13 | } from "lucide-react";
 14 | 
 15 | const HuddleLogo = () => (
 16 |   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-foreground">
 17 |     <path d="M4 4V20M20 4V20M4 12H20M12 4V12C12 14.2091 10.2091 16 8 16C5.79086 16 4 14.2091 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 18 |   </svg>
 19 | );
 20 | 
 21 | interface LandingPageProps {
 22 |   onGetStarted: () => void;
 23 | }
 24 | 
 25 | const features = [
 26 |     {
 27 |       icon: <MapPin className="w-8 h-8 text-primary" />,
 28 |       title: "Find Games Instantly",
 29 |       description: "See every pickup game happening around you on a real-time map. Your next game is just a tap away."
 30 |     },
 31 |     {
 32 |       icon: <Cpu className="w-8 h-8 text-primary" />,
 33 |       title: "AI-Assisted Events",
 34 |       description: "Let AI help you craft the perfect event title and description to attract players and fill your roster faster."
 35 |     },
 36 |     {
 37 |       icon: <CheckCircle className="w-8 h-8 text-primary" />,
 38 |       title: "Verified Check-ins",
 39 |       description: "Build your reputation with our check-in system. Organizers see you're reliable, so you get more invites."
 40 |     }
 41 |   ];
 42 | 
 43 | export default function LandingPage({ onGetStarted }: LandingPageProps) {
 44 |     const [currentFeature, setCurrentFeature] = useState(0);
 45 | 
 46 |     useEffect(() => {
 47 |         const interval = setInterval(() => {
 48 |           setCurrentFeature((prev) => (prev + 1) % features.length);
 49 |         }, 5000);
 50 |         return () => clearInterval(interval);
 51 |       }, []);
 52 | 
 53 |   return (
 54 |     <div className="min-h-screen liquid-gradient text-foreground overflow-hidden">
 55 |       <div className="relative z-10 flex flex-col min-h-screen">
 56 |         <header className="flex items-center justify-between p-6">
 57 |           <div className="flex items-center space-x-3">
 58 |             <div className="w-10 h-10 glass-surface rounded-lg flex items-center justify-center">
 59 |               <HuddleLogo />
 60 |             </div>
 61 |             <h1 className="text-2xl font-bold">Huddle</h1>
 62 |           </div>
 63 |           <Button variant="secondary" onClick={onGetStarted} className="px-6 h-11 rounded-full">
 64 |             Get Started
 65 |           </Button>
 66 |         </header>
 67 | 
 68 |         <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 text-center">
 69 |           <div className="max-w-4xl mx-auto">
 70 |             <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-50 to-slate-300 mb-6 leading-tight">
 71 |               Stop the group-chat chaos. Find your game now.
 72 |             </h1>
 73 |             <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
 74 |               Real-time map, instant RSVPs, and AI that fills rosters fast.
 75 |             </p>
 76 |             <div className="flex justify-center items-center">
 77 |               <Button onClick={onGetStarted} size="lg" className="h-14 px-10 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
 78 |                 Start Playing Today
 79 |                 <ArrowRight className="ml-2 w-5 h-5" />
 80 |               </Button>
 81 |             </div>
 82 |           </div>
 83 |           
 84 |           <div className="w-full max-w-4xl mx-auto mt-20 md:mt-32 px-4">
 85 |               <Card className="glass-surface border-white/15">
 86 |                 <CardContent className="p-8">
 87 |                   <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-left">
 88 |                     <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
 89 |                       {features[currentFeature].icon}
 90 |                     </div>
 91 |                     <div>
 92 |                       <h3 className="text-2xl font-semibold text-slate-50 mb-2">
 93 |                         {features[currentFeature].title}
 94 |                       </h3>
 95 |                       <p className="text-slate-300 text-lg">
 96 |                         {features[currentFeature].description}
 97 |                       </p>
 98 |                     </div>
 99 |                   </div>
100 |                   
101 |                   <div className="flex justify-center space-x-2 mt-8">
102 |                     {features.map((_, index) => (
103 |                       <div
104 |                         key={index}
105 |                         className={`w-2 h-2 rounded-full transition-all duration-300 ${
106 |                           index === currentFeature ? 'bg-primary w-6' : 'bg-slate-600'
107 |                         }`}
108 |                       />
109 |                     ))}
110 |                   </div>
111 |                 </CardContent>
112 |               </Card>
113 |             </div>
114 |         </main>
115 | 
116 |         <footer className="p-6 mt-16 md:mt-24 text-center">
117 |           <div className="flex justify-center items-center space-x-6 text-slate-400 text-sm">
118 |             <span>© 2024 Huddle. All rights reserved.</span>
119 |             <span className="hidden sm:inline">•</span>
120 |             <a href="#" className="hover:text-slate-300">Privacy Policy</a>
121 |             <span className="hidden sm:inline">•</span>
122 |             <a href="#" className="hover:text-slate-300">Terms of Service</a>
123 |           </div>
124 |         </footer>
125 |       </div>
126 |     </div>
127 |   );
128 | }
129 | 


--------------------------------------------------------------------------------
/components/location-search.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import React, { useRef, useEffect, useState } from "react";
 4 | import { Input } from "@/components/ui/input";
 5 | import { useMapsLibrary } from "@vis.gl/react-google-maps";
 6 | 
 7 | // SEARCH: Define the props for our new component.
 8 | interface LocationSearchInputProps {
 9 |   onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
10 | }
11 | 
12 | export default function LocationSearchInput({ onPlaceSelect }: LocationSearchInputProps) {
13 |   // SEARCH: Get a reference to the input element.
14 |   const inputRef = useRef<HTMLInputElement>(null);
15 |   // SEARCH: Load the 'places' library from Google Maps.
16 |   const places = useMapsLibrary("places");
17 |   // SEARCH: State to hold the Autocomplete instance.
18 |   const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
19 | 
20 |   useEffect(() => {
21 |     // SEARCH: This effect initializes the Autocomplete service.
22 |     if (!places || !inputRef.current) return;
23 | 
24 |     const options = {
25 |       fields: ["geometry", "name", "formatted_address"],
26 |     };
27 | 
28 |     // SEARCH: Create a new Autocomplete instance and bind it to our input field.
29 |     const ac = new places.Autocomplete(inputRef.current, options);
30 |     setAutocomplete(ac);
31 |   }, [places]);
32 | 
33 |   useEffect(() => {
34 |     // SEARCH: This effect adds a listener that fires when the user selects a place.
35 |     if (!autocomplete) return;
36 | 
37 |     const listener = autocomplete.addListener("place_changed", () => {
38 |       // SEARCH: When a place is selected, call the onPlaceSelect callback
39 |       // with the details of the selected place.
40 |       onPlaceSelect(autocomplete.getPlace());
41 |     });
42 | 
43 |     // SEARCH: Clean up the listener when the component unmounts.
44 |     return () => google.maps.event.removeListener(listener);
45 |   }, [autocomplete, onPlaceSelect]);
46 | 
47 |   return (
48 |     <div className="relative">
49 |       <Input
50 |         ref={inputRef}
51 |         placeholder="Search for an address or place..."
52 |         className="glass border-white/30 text-white placeholder:text-white/60 w-full"
53 |       />
54 |     </div>
55 |   );
56 | }
57 | 


--------------------------------------------------------------------------------
/components/manual-location-search.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import React, { useState } from "react";
 4 | import { Input } from "@/components/ui/input";
 5 | import { Button } from "@/components/ui/button";
 6 | import { MapPin } from "lucide-react";
 7 | 
 8 | interface ManualLocationSearchProps {
 9 |   onLocationSubmit: (location: { lat: number; lng: number }) => void;
10 | }
11 | 
12 | export default function ManualLocationSearch({ onLocationSubmit }: ManualLocationSearchProps) {
13 |   const [inputValue, setInputValue] = useState("");
14 |   const [error, setError] = useState<string | null>(null);
15 |   const [isLoading, setIsLoading] = useState(false);
16 | 
17 |   const handleSubmit = async (e: React.FormEvent) => {
18 |     e.preventDefault();
19 |     if (!inputValue) return;
20 | 
21 |     setIsLoading(true);
22 |     setError(null);
23 | 
24 |     try {
25 |       // This uses a simple, free geocoding service. 
26 |       // In a production app, you would use the Google Geocoding API with a proper key.
27 |       const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputValue)}&format=json&limit=1`);
28 |       const data = await response.json();
29 | 
30 |       if (data && data.length > 0) {
31 |         const { lat, lon } = data[0];
32 |         onLocationSubmit({ lat: parseFloat(lat), lng: parseFloat(lon) });
33 |       } else {
34 |         setError("Could not find that location. Please try a different city or zip code.");
35 |       }
36 |     } catch (err) {
37 |       setError("Failed to fetch location data. Please check your connection and try again.");
38 |     } finally {
39 |       setIsLoading(false);
40 |     }
41 |   };
42 | 
43 |   return (
44 |     <div className="text-center glass-card p-8 rounded-2xl max-w-lg mx-auto mt-10">
45 |       <MapPin className="w-12 h-12 text-white/80 mx-auto mb-4" />
46 |       <h3 className="text-xl font-semibold text-white mb-2">Enable Location to Discover Events</h3>
47 |       <p className="text-white/70 mb-6">
48 |         Huddle works best with your location. Please enable location permissions in your browser settings to find games near you, or enter a location manually.
49 |       </p>
50 |       <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
51 |         <Input
52 |           placeholder="Enter a city or zip code..."
53 |           value={inputValue}
54 |           onChange={(e) => setInputValue(e.target.value)}
55 |           className="glass border-white/20 text-white placeholder:text-white/60 flex-grow"
56 |         />
57 |         <Button type="submit" className="glass-card hover:glow text-white" disabled={isLoading}>
58 |           {isLoading ? "Searching..." : "Search"}
59 |         </Button>
60 |       </form>
61 |       {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
62 |     </div>
63 |   );
64 | }
65 | 


--------------------------------------------------------------------------------
/components/map-view.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import { useEffect, useState, useCallback, useMemo } from "react"
  4 | import { Button } from "@/components/ui/button"
  5 | import { Chip } from "@/components/ui/chip"
  6 | import { Plus, MapPin, LocateFixed, AlertCircle } from "lucide-react"
  7 | import EventDetailsDrawer from "./event-details-drawer"
  8 | import CreateEventModal from "./create-event-modal"
  9 | import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps"
 10 | import { mapStyles } from "@/lib/map-styles" 
 11 | import { GameEvent } from "@/lib/types"
 12 | 
 13 | interface MapViewProps {
 14 |   user: any
 15 | }
 16 | 
 17 | const getSportColor = (sport: string): string => {
 18 |   const colors: { [key: string]: string } = {
 19 |     Basketball: "#f97316",
 20 |     Soccer: "#22c55e",
 21 |     Tennis: "#eab308",
 22 |     Baseball: "#dc2626",
 23 |     Football: "#8b5cf6",
 24 |     Volleyball: "#06b6d4",
 25 |     default: "#ef4444",
 26 |   }
 27 |   return colors[sport] || colors.default
 28 | }
 29 | 
 30 | export default function MapView({ user }: MapViewProps) {
 31 |   const [events, setEvents] = useState<GameEvent[]>([])
 32 |   const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null)
 33 |   const [showCreateModal, setShowCreateModal] = useState(false)
 34 |   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
 35 |   const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 37.7749, lng: -122.4194 })
 36 |   const [mapsError, setMapsError] = useState<string | null>(null)
 37 |   const [map, setMap] = useState<google.maps.Map | null>(null)
 38 | 
 39 |   const [activeSport, setActiveSport] = useState("All");
 40 | 
 41 |   const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
 42 |   const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
 43 | 
 44 |   useEffect(() => {
 45 |     navigator.geolocation.getCurrentPosition(
 46 |       (position) => {
 47 |         const location = { lat: position.coords.latitude, lng: position.coords.longitude }
 48 |         setUserLocation(location)
 49 |         setMapCenter(location)
 50 |       },
 51 |       () => {
 52 |         setUserLocation({ lat: 37.7749, lng: -122.4194 })
 53 |         setMapCenter({ lat: 37.7749, lng: -122.4194 })
 54 |       }
 55 |     )
 56 |   }, [])
 57 | 
 58 |   const fetchEventsInView = useCallback(async () => {
 59 |     if (!map) return;
 60 |     const bounds = map.getBounds();
 61 |     if (!bounds) return;
 62 |     const center = bounds.getCenter();
 63 |     const ne = bounds.getNorthEast();
 64 |     const radius = google.maps.geometry.spherical.computeDistanceBetween(center, ne);
 65 |     
 66 |     try {
 67 |       const response = await fetch(`/api/events?lat=${center.lat()}&lon=${center.lng()}&radius=${radius}`);
 68 |       if (response.ok) {
 69 |         const data = await response.json();
 70 |         setEvents(data.events || []);
 71 |       }
 72 |     } catch (error) {
 73 |       console.error("Failed to load events:", error);
 74 |     }
 75 |   }, [map]);
 76 | 
 77 |   useEffect(() => {
 78 |     if (map) {
 79 |         fetchEventsInView();
 80 |     }
 81 |   }, [map, fetchEventsInView]);
 82 |   
 83 |   const handleRecenter = useCallback(() => {
 84 |     if (userLocation && map) {
 85 |       map.panTo(userLocation)
 86 |       map.setZoom(17)
 87 |     }
 88 |   }, [userLocation, map]);
 89 | 
 90 |   const filteredEvents = useMemo(() => {
 91 |     if (activeSport === 'All') return events;
 92 |     return events.filter(event => event.sport === activeSport);
 93 |   }, [events, activeSport]);
 94 | 
 95 |   if (!mapsApiKey) {
 96 |     return (
 97 |         <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
 98 |           <div className="text-center max-w-md space-y-4">
 99 |             <div className="glass-surface rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
100 |               <AlertCircle className="w-8 h-8 text-rose-400" />
101 |             </div>
102 |             <h1 className="text-2xl font-bold text-slate-50 mb-4 drop-shadow-lg">Maps Configuration Error</h1>
103 |             <p className="text-slate-300 mb-6 drop-shadow">Google Maps API key is missing.</p>
104 |           </div>
105 |         </div>
106 |     )
107 |   }
108 | 
109 |   if (!userLocation) {
110 |     return (
111 |       <div className="min-h-screen liquid-gradient flex items-center justify-center">
112 |         <div className="text-center">
113 |           <div className="glass-surface rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
114 |             <MapPin className="w-8 h-8 text-slate-50" />
115 |           </div>
116 |           <p className="text-slate-300 drop-shadow">Getting your location...</p>
117 |         </div>
118 |       </div>
119 |     )
120 |   }
121 | 
122 |   return (
123 |     <div className="h-screen flex flex-col liquid-gradient" id="map-view">
124 |       <div className="flex-1 relative">
125 |         <APIProvider apiKey={mapsApiKey}>
126 |           <Map
127 |             onLoad={(map) => setMap(map)}
128 |             mapId={mapId}
129 |             defaultCenter={mapCenter}
130 |             defaultZoom={17}
131 |             className="w-full h-full"
132 |             onIdle={fetchEventsInView}
133 |             options={{
134 |               disableDefaultUI: true,
135 |               styles: mapStyles,
136 |               gestureHandling: "greedy",
137 |               tilt: 45,
138 |             }}
139 |           >
140 |             {userLocation && <AdvancedMarker position={userLocation} />}
141 |             {filteredEvents.map((event) => (
142 |               <AdvancedMarker
143 |                 key={event.id}
144 |                 position={{ lat: event.latitude, lng: event.longitude }}
145 |                 onClick={() => setSelectedEvent(event)}
146 |               >
147 |                 <Pin
148 |                   background={getSportColor(event.sport)}
149 |                   borderColor={event.isBoosted ? "#fbbf24" : "#ffffff"}
150 |                   glyphColor="#ffffff"
151 |                 />
152 |               </AdvancedMarker>
153 |             ))}
154 |           </Map>
155 |         </APIProvider>
156 | 
157 |         <div className="absolute top-4 left-4 right-4 z-10">
158 |             <div className="flex items-center space-x-2 p-2 glass-surface rounded-full">
159 |                 <Chip isActive={activeSport === 'All'} onClick={() => setActiveSport('All')}>All</Chip>
160 |                 <Chip isActive={activeSport === 'Basketball'} onClick={() => setActiveSport('Basketball')}>Basketball</Chip>
161 |                 <Chip isActive={activeSport === 'Soccer'} onClick={() => setActiveSport('Soccer')}>Soccer</Chip>
162 |             </div>
163 |         </div>
164 | 
165 |         <Button
166 |             id="create-event-button"
167 |             onClick={() => setShowCreateModal(true)}
168 |             size="lg"
169 |             className="absolute bottom-44 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg"
170 |         >
171 |             <Plus className="w-6 h-6" />
172 |         </Button>
173 | 
174 |         <Button
175 |             onClick={handleRecenter}
176 |             variant="secondary"
177 |             size="lg"
178 |             className="absolute bottom-28 right-6 h-14 w-14 rounded-full shadow-lg"
179 |         >
180 |             <LocateFixed className="w-6 h-6" />
181 |         </Button>
182 |       </div>
183 | 
184 |       {selectedEvent && (
185 |         <EventDetailsDrawer
186 |           event={selectedEvent}
187 |           isOpen={!!selectedEvent}
188 |           onClose={() => setSelectedEvent(null)}
189 |           onEventUpdated={() => {}}
190 |         />
191 |       )}
192 | 
193 |       {showCreateModal && (
194 |         <CreateEventModal
195 |           isOpen={showCreateModal}
196 |           onClose={() => setShowCreateModal(false)}
197 |           onEventCreated={() => {}}
198 |           userLocation={userLocation}
199 |         />
200 |       )}
201 |     </div>
202 |   )
203 | }
204 | 


--------------------------------------------------------------------------------
/components/maps-api-validator.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import { useEffect, useState } from "react"
  4 | import { AlertCircle, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"
  5 | import { Button } from "@/components/ui/button"
  6 | import { mapsValidator, type MapsApiValidationResult } from "@/lib/maps-debug"
  7 | 
  8 | interface MapsApiValidatorProps {
  9 |   apiKey?: string
 10 |   mapId?: string
 11 |   onValidationComplete?: (result: MapsApiValidationResult) => void
 12 | }
 13 | 
 14 | export default function MapsApiValidator({ apiKey, mapId, onValidationComplete }: MapsApiValidatorProps) {
 15 |   const [validation, setValidation] = useState<MapsApiValidationResult | null>(null)
 16 |   const [testing, setTesting] = useState(false)
 17 |   const [apiTest, setApiTest] = useState<{ success: boolean; error?: string } | null>(null)
 18 | 
 19 |   useEffect(() => {
 20 |     const result = mapsValidator.validateApiKey(apiKey)
 21 |     setValidation(result)
 22 |     onValidationComplete?.(result)
 23 | 
 24 |     // Log status to console
 25 |     mapsValidator.logMapsApiStatus(apiKey, mapId)
 26 |   }, [apiKey, mapId, onValidationComplete])
 27 | 
 28 |   const testApiKey = async () => {
 29 |     if (!apiKey || !validation?.isValid) return
 30 | 
 31 |     setTesting(true)
 32 |     try {
 33 |       const result = await mapsValidator.testApiKeyDirectly(apiKey)
 34 |       setApiTest(result)
 35 |     } catch (error) {
 36 |       setApiTest({ success: false, error: `Test failed: ${error}` })
 37 |     } finally {
 38 |       setTesting(false)
 39 |     }
 40 |   }
 41 | 
 42 |   if (!validation) return null
 43 | 
 44 |   return (
 45 |     <div className="glass-card rounded-lg p-4 text-white space-y-4">
 46 |       <div className="flex items-center space-x-2">
 47 |         {validation.isValid ? (
 48 |           <CheckCircle className="w-5 h-5 text-green-400" />
 49 |         ) : (
 50 |           <AlertCircle className="w-5 h-5 text-red-400" />
 51 |         )}
 52 |         <h3 className="font-semibold">Maps API Validation</h3>
 53 |       </div>
 54 | 
 55 |       <div className="space-y-2 text-sm">
 56 |         <div className="flex justify-between">
 57 |           <span>API Key:</span>
 58 |           <span className="font-mono">{validation.apiKey.masked}</span>
 59 |         </div>
 60 |         <div className="flex justify-between">
 61 |           <span>Format:</span>
 62 |           <span className={validation.apiKey.format === "valid" ? "text-green-400" : "text-red-400"}>
 63 |             {validation.apiKey.format}
 64 |           </span>
 65 |         </div>
 66 |         <div className="flex justify-between">
 67 |           <span>Map ID:</span>
 68 |           <span className={validation.mapId.present ? "text-green-400" : "text-yellow-400"}>
 69 |             {validation.mapId.present ? "✓ Set" : "⚠ Missing"}
 70 |           </span>
 71 |         </div>
 72 |       </div>
 73 | 
 74 |       {validation.errors.length > 0 && (
 75 |         <div className="space-y-1">
 76 |           <div className="flex items-center space-x-1 text-red-400">
 77 |             <AlertCircle className="w-4 h-4" />
 78 |             <span className="text-sm font-medium">Errors:</span>
 79 |           </div>
 80 |           {validation.errors.map((error, index) => (
 81 |             <div key={index} className="text-sm text-red-300 ml-5">
 82 |               • {error}
 83 |             </div>
 84 |           ))}
 85 |         </div>
 86 |       )}
 87 | 
 88 |       {validation.warnings.length > 0 && (
 89 |         <div className="space-y-1">
 90 |           <div className="flex items-center space-x-1 text-yellow-400">
 91 |             <AlertTriangle className="w-4 h-4" />
 92 |             <span className="text-sm font-medium">Warnings:</span>
 93 |           </div>
 94 |           {validation.warnings.map((warning, index) => (
 95 |             <div key={index} className="text-sm text-yellow-300 ml-5">
 96 |               • {warning}
 97 |             </div>
 98 |           ))}
 99 |         </div>
100 |       )}
101 | 
102 |       {validation.isValid && (
103 |         <div className="space-y-2">
104 |           <Button
105 |             onClick={testApiKey}
106 |             disabled={testing}
107 |             className="w-full glass-card hover:glow text-white border-white/30"
108 |             size="sm"
109 |           >
110 |             {testing ? (
111 |               <>
112 |                 <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
113 |                 Testing API Key...
114 |               </>
115 |             ) : (
116 |               "Test API Key"
117 |             )}
118 |           </Button>
119 | 
120 |           {apiTest && (
121 |             <div
122 |               className={`text-sm p-2 rounded ${apiTest.success ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}
123 |             >
124 |               {apiTest.success ? "✅ API key is working!" : `❌ ${apiTest.error}`}
125 |             </div>
126 |           )}
127 |         </div>
128 |       )}
129 |     </div>
130 |   )
131 | }
132 | 


--------------------------------------------------------------------------------
/components/maps-debug.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import { useEffect, useState } from "react"
 4 | import { Button } from "@/components/ui/button"
 5 | 
 6 | interface MapsHealth {
 7 |   apiKey: boolean
 8 |   apiKeyFormat: boolean
 9 |   apiKeyValue: string
10 |   timestamp: string
11 | }
12 | 
13 | export default function MapsDebug() {
14 |   const [health, setHealth] = useState<MapsHealth | null>(null)
15 |   const [isVisible, setIsVisible] = useState(false)
16 | 
17 |   const runHealthCheck = () => {
18 |     const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
19 |     const healthStatus: MapsHealth = {
20 |       apiKey: !!apiKey,
21 |       apiKeyFormat: apiKey ? apiKey.startsWith("AIza") && apiKey.length === 39 : false,
22 |       apiKeyValue: apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : "Not set",
23 |       timestamp: new Date().toISOString(),
24 |     }
25 | 
26 |     setHealth(healthStatus)
27 |     console.log("🗺️ Google Maps Health Check:", healthStatus)
28 |   }
29 | 
30 |   useEffect(() => {
31 |     runHealthCheck()
32 |   }, [])
33 | 
34 |   if (!isVisible) {
35 |     return (
36 |       <Button
37 |         onClick={() => setIsVisible(true)}
38 |         className="fixed bottom-4 left-20 z-50 glass-card text-xs px-2 py-1 text-white border-white/30"
39 |         size="sm"
40 |       >
41 |         🗺️ Maps
42 |       </Button>
43 |     )
44 |   }
45 | 
46 |   return (
47 |     <div className="fixed bottom-4 left-20 z-50 glass-card rounded-lg p-4 max-w-sm text-white text-xs">
48 |       <div className="flex justify-between items-center mb-2">
49 |         <h3 className="font-semibold">Maps Status</h3>
50 |         <Button
51 |           onClick={() => setIsVisible(false)}
52 |           className="text-white/60 hover:text-white p-0 h-auto"
53 |           variant="ghost"
54 |           size="sm"
55 |         >
56 |           ✕
57 |         </Button>
58 |       </div>
59 | 
60 |       {health && (
61 |         <div className="space-y-1">
62 |           <div className="flex justify-between">
63 |             <span>API Key:</span>
64 |             <span className={health.apiKey ? "text-green-400" : "text-red-400"}>{health.apiKey ? "✓" : "✗"}</span>
65 |           </div>
66 |           <div className="flex justify-between">
67 |             <span>Format:</span>
68 |             <span className={health.apiKeyFormat ? "text-green-400" : "text-red-400"}>
69 |               {health.apiKeyFormat ? "✓" : "✗"}
70 |             </span>
71 |           </div>
72 |           <div className="mt-2 text-xs text-white/60">Key: {health.apiKeyValue}</div>
73 |         </div>
74 |       )}
75 | 
76 |       <Button onClick={runHealthCheck} className="mt-2 w-full text-xs py-1 bg-white/10 hover:bg-white/20" size="sm">
77 |         Refresh
78 |       </Button>
79 |     </div>
80 |   )
81 | }
82 | 


--------------------------------------------------------------------------------
/components/notification-permission-handler.tsx:
--------------------------------------------------------------------------------
 1 | // components/notification-permission-handler.tsx
 2 | "use client";
 3 | import { useEffect } from "react";
 4 | import { useAuth } from "@/lib/firebase-context";
 5 | import { requestNotificationPermission } from "@/lib/firebase-messaging";
 6 | import { saveFcmToken } from "@/lib/db";
 7 | 
 8 | export function NotificationPermissionHandler() {
 9 |   const { user } = useAuth();
10 | 
11 |   useEffect(() => {
12 |     // Only proceed if we have an authenticated user.
13 |     if (user) {
14 |       const handlePermission = async () => {
15 |         // We'll use local storage to remember if we've already asked for permission.
16 |         // This avoids bothering the user on every single page load.
17 |         const permissionRequested = localStorage.getItem("notificationPermissionRequested");
18 | 
19 |         if (!permissionRequested) {
20 |           const token = await requestNotificationPermission();
21 |           if (token) {
22 |             // If we get a token, save it to the user's document in Firestore.
23 |             await saveFcmToken(user.uid, token);
24 |           }
25 |           // Mark that we have now requested permission.
26 |           localStorage.setItem("notificationPermissionRequested", "true");
27 |         }
28 |       };
29 | 
30 |       handlePermission();
31 |     }
32 |   }, [user]);
33 | 
34 |   // This component does not render anything to the UI.
35 |   return null;
36 | }
37 | 


--------------------------------------------------------------------------------
/components/profile/edit-profile-modal.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import { useState } from "react"
  4 | import { Button } from "@/components/ui/button"
  5 | import { Input } from "@/components/ui/input"
  6 | import { Label } from "@/components/ui/label"
  7 | import { Textarea } from "@/components/ui/textarea"
  8 | import { X } from "lucide-react"
  9 | import { toast } from "sonner"
 10 | import { MultiSelect } from "@/components/ui/multi-select"
 11 | 
 12 | const SPORTS = [
 13 |   "Basketball",
 14 |   "Soccer",
 15 |   "Tennis",
 16 |   "Cricket",
 17 |   "Baseball",
 18 |   "Volleyball",
 19 |   "Football",
 20 |   "Hockey",
 21 |   "Badminton",
 22 |   "Table Tennis",
 23 | ]
 24 | 
 25 | interface EditProfileModalProps {
 26 |   isOpen: boolean
 27 |   onClose: () => void
 28 |   userProfile: any
 29 |   onProfileUpdate: () => void
 30 | }
 31 | 
 32 | export default function EditProfileModal({ isOpen, onClose, userProfile, onProfileUpdate }: EditProfileModalProps) {
 33 |   const [isLoading, setIsLoading] = useState(false)
 34 |   const [formData, setFormData] = useState({
 35 |     displayName: userProfile?.displayName || "",
 36 |     bio: userProfile?.bio || "",
 37 |     favoriteSports: userProfile?.favoriteSports || [],
 38 |   })
 39 | 
 40 |   const handleSubmit = async (e: React.FormEvent) => {
 41 |     e.preventDefault()
 42 |     setIsLoading(true)
 43 |     try {
 44 |       const response = await fetch("/api/users/profile", {
 45 |         method: "POST",
 46 |         headers: { "Content-Type": "application/json" },
 47 |         body: JSON.stringify(formData),
 48 |       })
 49 | 
 50 |       if (response.ok) {
 51 |         toast.success("Profile updated successfully!")
 52 |         onProfileUpdate()
 53 |       } else {
 54 |         const errorData = await response.json()
 55 |         toast.error(`Failed to update profile: ${errorData.error}`)
 56 |       }
 57 |     } catch (error) {
 58 |       console.error("Error updating profile:", error)
 59 |       toast.error("An unexpected error occurred. Please try again.")
 60 |     } finally {
 61 |       setIsLoading(false)
 62 |     }
 63 |   }
 64 | 
 65 |   if (!isOpen) return null
 66 | 
 67 |   return (
 68 |     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
 69 |       <div className="w-full max-w-md glass-card border-none rounded-2xl shadow-2xl">
 70 |         <div className="p-6">
 71 |           <div className="flex items-center justify-between mb-4">
 72 |             <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
 73 |             <Button
 74 |               variant="ghost"
 75 |               size="icon"
 76 |               onClick={onClose}
 77 |               className="text-white/80 hover:text-white hover:bg-white/20 rounded-full"
 78 |             >
 79 |               <X className="w-5 h-5" />
 80 |             </Button>
 81 |           </div>
 82 |           <form onSubmit={handleSubmit} className="space-y-4">
 83 |             <div>
 84 |               <Label htmlFor="displayName" className="text-white/90">
 85 |                 Display Name
 86 |               </Label>
 87 |               <Input
 88 |                 id="displayName"
 89 |                 value={formData.displayName}
 90 |                 onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
 91 |                 required
 92 |                 className="glass border-white/30 text-white"
 93 |               />
 94 |             </div>
 95 |             <div>
 96 |               <Label htmlFor="bio" className="text-white/90">
 97 |                 About Me
 98 |               </Label>
 99 |               <Textarea
100 |                 id="bio"
101 |                 value={formData.bio}
102 |                 onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
103 |                 placeholder="Tell us about yourself"
104 |                 className="glass border-white/30 text-white"
105 |               />
106 |             </div>
107 |             <div>
108 |               <Label htmlFor="favoriteSports" className="text-white/90">
109 |                 Favorite Sports
110 |               </Label>
111 |               <MultiSelect
112 |                 options={SPORTS.map((s) => ({ value: s, label: s }))}
113 |                 value={formData.favoriteSports}
114 |                 onChange={(value) => setFormData({ ...formData, favoriteSports: value })}
115 |                 placeholder="Select your favorite sports"
116 |               />
117 |             </div>
118 |             <div className="pt-4">
119 |               <Button type="submit" disabled={isLoading} className="w-full">
120 |                 {isLoading ? "Saving..." : "Save Changes"}
121 |               </Button>
122 |             </div>
123 |           </form>
124 |         </div>
125 |       </div>
126 |     </div>
127 |   )
128 | }
129 | 


--------------------------------------------------------------------------------
/components/profile/event-list.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | import React, { useState, useEffect } from "react";
  3 | import { Card, CardContent } from "@/components/ui/card";
  4 | import { Calendar, Users, Loader2 } from "lucide-react";
  5 | 
  6 | interface GameEvent {
  7 |   id: string;
  8 |   title: string;
  9 |   sport: string;
 10 |   location: string;
 11 |   date: string;
 12 |   time: string;
 13 |   maxPlayers: number;
 14 |   currentPlayers: number;
 15 | }
 16 | 
 17 | interface EventListProps {
 18 |   userId: string;
 19 |   eventType: 'organized' | 'joined';
 20 | }
 21 | 
 22 | export function EventList({ userId, eventType }: EventListProps) {
 23 |   const [events, setEvents] = useState<GameEvent[]>([]);
 24 |   const [loading, setLoading] = useState(true);
 25 |   const [error, setError] = useState<string | null>(null);
 26 | 
 27 |   useEffect(() => {
 28 |     const fetchEvents = async () => {
 29 |       setLoading(true);
 30 |       setError(null);
 31 |       try {
 32 |         const response = await fetch(`/api/users/${userId}/events?type=${eventType}`);
 33 |         if (!response.ok) {
 34 |           throw new Error(`Failed to fetch events with status: ${response.status}`);
 35 |         }
 36 |         const data = await response.json();
 37 |         setEvents(data.events || []);
 38 |       } catch (err: any) {
 39 |         setError(err.message);
 40 |         console.error(`Error fetching ${eventType} events:`, err);
 41 |       } finally {
 42 |         setLoading(false);
 43 |       }
 44 |     };
 45 | 
 46 |     if (userId) {
 47 |       fetchEvents();
 48 |     }
 49 |   }, [userId, eventType]);
 50 | 
 51 |   const formatDate = (dateStr: string) => {
 52 |     const date = new Date(dateStr);
 53 |     return date.toLocaleDateString("en-US", {
 54 |       month: "short",
 55 |       day: "numeric",
 56 |     });
 57 |   };
 58 | 
 59 |   if (loading) {
 60 |     return (
 61 |       <div className="flex justify-center items-center py-8">
 62 |         <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
 63 |       </div>
 64 |     );
 65 |   }
 66 | 
 67 |   if (error) {
 68 |     return (
 69 |       <div className="text-center py-8 text-red-400">
 70 |         <p>Error loading events: {error}</p>
 71 |       </div>
 72 |     );
 73 |   }
 74 | 
 75 |   const emptyStateMessage = eventType === 'organized'
 76 |     ? "You haven't organized any events yet."
 77 |     : "You haven't joined any events yet.";
 78 | 
 79 |   if (events.length === 0) {
 80 |     return (
 81 |       <div className="text-center py-8">
 82 |         <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
 83 |         <p className="text-white/70">{emptyStateMessage}</p>
 84 |       </div>
 85 |     );
 86 |   }
 87 | 
 88 |   return (
 89 |     <div className="space-y-3">
 90 |       {events.map((event) => (
 91 |         <Card key={event.id} className="bg-white/10 rounded-lg p-4">
 92 |           <CardContent className="p-0">
 93 |             <div className="flex items-center justify-between mb-2">
 94 |               <h3 className="font-medium text-white">{event.title}</h3>
 95 |               <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded">
 96 |                 {event.sport}
 97 |               </span>
 98 |             </div>
 99 |             <div className="flex items-center space-x-4 text-sm text-white/70">
100 |               <div className="flex items-center space-x-1">
101 |                 <Calendar className="w-3 h-3" />
102 |                 <span>{formatDate(event.date)}</span>
103 |               </div>
104 |               <div className="flex items-center space-x-1">
105 |                 <Users className="w-3 h-3" />
106 |                 <span>
107 |                   {event.currentPlayers}/{event.maxPlayers}
108 |                 </span>
109 |               </div>
110 |             </div>
111 |           </CardContent>
112 |         </Card>
113 |       ))}
114 |     </div>
115 |   );
116 | }
117 | 


--------------------------------------------------------------------------------
/components/profile/public-profile-modal.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import {
  4 |   Dialog,
  5 |   DialogContent,
  6 |   DialogHeader,
  7 |   DialogTitle,
  8 | } from "@/components/ui/dialog"
  9 | import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
 10 | import { Card, CardContent } from "@/components/ui/card"
 11 | import { Badge } from "@/components/ui/badge"
 12 | import { UserCircle, Trophy } from "lucide-react"
 13 | import { Skeleton } from "@/components/ui/skeleton"
 14 | 
 15 | interface PublicProfileModalProps {
 16 |   isOpen: boolean
 17 |   onClose: () => void
 18 |   userId: string
 19 | }
 20 | 
 21 | const StatCard = ({ label, value }: { label: string; value: number }) => (
 22 |     <Card className="glass-surface border-none text-center">
 23 |         <CardContent className="p-3">
 24 |             <div className="text-xl font-bold text-slate-50">{value}</div>
 25 |             <div className="text-xs text-slate-400">{label}</div>
 26 |         </CardContent>
 27 |     </Card>
 28 | )
 29 | 
 30 | const ProfileContentSkeleton = () => (
 31 |     <div className="space-y-6 animate-pulse">
 32 |         <div className="flex flex-col items-center text-center">
 33 |             <Skeleton className="w-24 h-24 rounded-full mb-4" />
 34 |             <Skeleton className="h-7 w-48 mb-2 rounded-md" />
 35 |             <Skeleton className="h-5 w-64 rounded-md" />
 36 |         </div>
 37 |         <div className="grid grid-cols-3 gap-4">
 38 |             <Skeleton className="h-20 rounded-lg" />
 39 |             <Skeleton className="h-20 rounded-lg" />
 40 |             <Skeleton className="h-20 rounded-lg" />
 41 |         </div>
 42 |         <Skeleton className="h-24 rounded-lg" />
 43 |     </div>
 44 | );
 45 | 
 46 | export default function PublicProfileModal({ isOpen, onClose, userId }: PublicProfileModalProps) {
 47 |     // In a real app, you would fetch the user's profile data here based on the userId
 48 |     const userProfile = {
 49 |         displayName: "Jane Doe",
 50 |         photoURL: "",
 51 |         email: "jane.doe@example.com",
 52 |         bio: "Loves playing basketball and soccer on weekends.",
 53 |         favoriteSports: ["Basketball", "Soccer"],
 54 |     };
 55 |     const userStats = {
 56 |         joined: 28,
 57 |         organized: 5,
 58 |         upcoming: 2,
 59 |     };
 60 |     const isLoading = false; // This would be managed by your data fetching state
 61 | 
 62 |   return (
 63 |     <Dialog open={isOpen} onOpenChange={onClose}>
 64 |       <DialogContent className="sm:max-w-md glass-surface border-white/15 text-foreground">
 65 |         <DialogHeader>
 66 |           <DialogTitle>Player Profile</DialogTitle>
 67 |         </DialogHeader>
 68 |         {isLoading ? (
 69 |             <ProfileContentSkeleton />
 70 |         ) : (
 71 |             <div className="space-y-6">
 72 |                 <div className="flex flex-col items-center text-center">
 73 |                     <Avatar className="w-24 h-24 mb-4 border-4 border-slate-800">
 74 |                         <AvatarImage src={userProfile?.photoURL} />
 75 |                         <AvatarFallback>
 76 |                             <UserCircle className="w-full h-full text-slate-500" />
 77 |                         </AvatarFallback>
 78 |                     </Avatar>
 79 |                     <h1 className="text-2xl font-bold text-slate-50">{userProfile?.displayName}</h1>
 80 |                     <p className="text-slate-400">{userProfile?.email}</p>
 81 |                 </div>
 82 |             
 83 |                 <div className="grid grid-cols-3 gap-4">
 84 |                     <StatCard label="Joined" value={userStats.joined} />
 85 |                     <StatCard label="Organized" value={userStats.organized} />
 86 |                     <StatCard label="Upcoming" value={userStats.upcoming} />
 87 |                 </div>
 88 | 
 89 |                 <Card className="glass-surface border-none">
 90 |                   <CardContent className="p-4">
 91 |                     <p className="text-slate-300 whitespace-pre-wrap">{userProfile?.bio || "No bio provided."}</p>
 92 |                     {userProfile?.favoriteSports && userProfile.favoriteSports.length > 0 && (
 93 |                       <div className="mt-4 flex flex-wrap gap-2">
 94 |                         {userProfile.favoriteSports.map((sport: string) => (
 95 |                           <Badge key={sport} variant="secondary">{sport}</Badge>
 96 |                         ))}
 97 |                       </div>
 98 |                     )}
 99 |                   </CardContent>
100 |                 </Card>
101 |             </div>
102 |         )}
103 |       </DialogContent>
104 |     </Dialog>
105 |   )
106 | }
107 | 


--------------------------------------------------------------------------------
/components/shared-header.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import { Button } from "@/components/ui/button"
 4 | import { User, LogOut, MapPin, UserCircle } from "lucide-react"
 5 | import Link from "next/link"
 6 | import { usePathname } from "next/navigation"
 7 | 
 8 | interface SharedHeaderProps {
 9 |   user: any
10 |   onLogout: () => void
11 | }
12 | 
13 | export default function SharedHeader({ user, onLogout }: SharedHeaderProps) {
14 |   const pathname = usePathname()
15 | 
16 |   const handleLogout = async () => {
17 |     try {
18 |       await fetch("/api/auth/logout", { method: "POST" })
19 |       onLogout()
20 |     } catch (error) {
21 |       console.error("Logout failed:", error)
22 |     }
23 |   }
24 | 
25 |   return (
26 |     <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
27 |       <div className="flex items-center space-x-2">
28 |         <MapPin className="w-6 h-6 text-blue-600" />
29 |         <h1 className="text-xl font-bold text-gray-900">Huddle</h1>
30 |       </div>
31 | 
32 |       <div className="flex items-center space-x-4">
33 |         {/* Navigation Links */}
34 |         <div className="flex items-center space-x-2">
35 |           <Link href="/">
36 |             <Button variant={pathname === "/" ? "default" : "ghost"} size="sm" className="text-sm">
37 |               Map
38 |             </Button>
39 |           </Link>
40 |           <Link href="/profile">
41 |             <Button variant={pathname === "/profile" ? "default" : "ghost"} size="sm" className="text-sm">
42 |               <UserCircle className="w-4 h-4 mr-1" />
43 |               Profile
44 |             </Button>
45 |           </Link>
46 |         </div>
47 | 
48 |         {/* User Info */}
49 |         <div className="flex items-center space-x-2">
50 |           <div className="flex items-center space-x-2 text-sm text-gray-600">
51 |             <User className="w-4 h-4" />
52 |             <span>{user.name}</span>
53 |           </div>
54 |           <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
55 |             <LogOut className="w-4 h-4" />
56 |           </Button>
57 |         </div>
58 |       </div>
59 |     </div>
60 |   )
61 | }
62 | 


--------------------------------------------------------------------------------
/components/theme-provider.tsx:
--------------------------------------------------------------------------------
 1 | 'use client'
 2 | 
 3 | import * as React from 'react'
 4 | import {
 5 |   ThemeProvider as NextThemesProvider,
 6 |   type ThemeProviderProps,
 7 | } from 'next-themes'
 8 | 
 9 | export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
10 |   return <NextThemesProvider {...props}>{children}</NextThemesProvider>
11 | }
12 | 


--------------------------------------------------------------------------------
/components/ui/avatar.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import * as AvatarPrimitive from "@radix-ui/react-avatar"
 5 | 
 6 | import { cn } from "@/lib/utils"
 7 | 
 8 | const Avatar = React.forwardRef<
 9 |   React.ElementRef<typeof AvatarPrimitive.Root>,
10 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
11 | >(({ className, ...props }, ref) => (
12 |   <AvatarPrimitive.Root
13 |     ref={ref}
14 |     className={cn(
15 |       "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
16 |       className
17 |     )}
18 |     {...props}
19 |   />
20 | ))
21 | Avatar.displayName = AvatarPrimitive.Root.displayName
22 | 
23 | const AvatarImage = React.forwardRef<
24 |   React.ElementRef<typeof AvatarPrimitive.Image>,
25 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
26 | >(({ className, ...props }, ref) => (
27 |   <AvatarPrimitive.Image
28 |     ref={ref}
29 |     className={cn("aspect-square h-full w-full", className)}
30 |     {...props}
31 |   />
32 | ))
33 | AvatarImage.displayName = AvatarPrimitive.Image.displayName
34 | 
35 | const AvatarFallback = React.forwardRef<
36 |   React.ElementRef<typeof AvatarPrimitive.Fallback>,
37 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
38 | >(({ className, ...props }, ref) => (
39 |   <AvatarPrimitive.Fallback
40 |     ref={ref}
41 |     className={cn(
42 |       "flex h-full w-full items-center justify-center rounded-full bg-muted",
43 |       className
44 |     )}
45 |     {...props}
46 |   />
47 | ))
48 | AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName
49 | 
50 | export { Avatar, AvatarImage, AvatarFallback }
51 | 


--------------------------------------------------------------------------------
/components/ui/badge.tsx:
--------------------------------------------------------------------------------
 1 | import type * as React from "react"
 2 | import { cva, type VariantProps } from "class-variance-authority"
 3 | 
 4 | import { cn } from "@/lib/utils"
 5 | 
 6 | const badgeVariants = cva(
 7 |   "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
 8 |   {
 9 |     variants: {
10 |       variant: {
11 |         default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
12 |         secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
13 |         destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
14 |         outline: "text-foreground",
15 |       },
16 |     },
17 |     defaultVariants: {
18 |       variant: "default",
19 |     },
20 |   },
21 | )
22 | 
23 | export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
24 | 
25 | function Badge({ className, variant, ...props }: BadgeProps) {
26 |   return <div className={cn(badgeVariants({ variant }), className)} {...props} />
27 | }
28 | 
29 | export { Badge, badgeVariants }
30 | 


--------------------------------------------------------------------------------
/components/ui/button.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | import { Slot } from "@radix-ui/react-slot"
 3 | import { cva, type VariantProps } from "class-variance-authority"
 4 | 
 5 | import { cn } from "@/lib/utils"
 6 | 
 7 | const buttonVariants = cva(
 8 |   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
 9 |   {
10 |     variants: {
11 |       variant: {
12 |         default: "bg-primary text-primary-foreground hover:bg-primary/90",
13 |         destructive:
14 |           "bg-destructive text-destructive-foreground hover:bg-destructive/90",
15 |         outline:
16 |           "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
17 |         secondary:
18 |           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
19 |         ghost: "hover:bg-accent hover:text-accent-foreground",
20 |         link: "text-primary underline-offset-4 hover:underline",
21 |       },
22 |       size: {
23 |         default: "h-10 px-4 py-2",
24 |         sm: "h-9 rounded-md px-3",
25 |         lg: "h-11 rounded-md px-8",
26 |         icon: "h-10 w-10",
27 |       },
28 |     },
29 |     defaultVariants: {
30 |       variant: "default",
31 |       size: "default",
32 |     },
33 |   }
34 | )
35 | 
36 | export interface ButtonProps
37 |   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
38 |     VariantProps<typeof buttonVariants> {
39 |   asChild?: boolean
40 | }
41 | 
42 | const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
43 |   ({ className, variant, size, asChild = false, ...props }, ref) => {
44 |     const Comp = asChild ? Slot : "button"
45 |     return (
46 |       <Comp
47 |         className={cn(buttonVariants({ variant, size, className }))}
48 |         ref={ref}
49 |         {...props}
50 |       />
51 |     )
52 |   }
53 | )
54 | Button.displayName = "Button"
55 | 
56 | export { Button, buttonVariants }
57 | 


--------------------------------------------------------------------------------
/components/ui/calendar.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import { ChevronLeft, ChevronRight } from "lucide-react"
 5 | import { DayPicker } from "react-day-picker"
 6 | 
 7 | import { cn } from "@/lib/utils"
 8 | import { buttonVariants } from "@/components/ui/button"
 9 | 
10 | export type CalendarProps = React.ComponentProps<typeof DayPicker>
11 | 
12 | function Calendar({
13 |   className,
14 |   classNames,
15 |   showOutsideDays = true,
16 |   ...props
17 | }: CalendarProps) {
18 |   return (
19 |     <DayPicker
20 |       showOutsideDays={showOutsideDays}
21 |       className={cn("p-3", className)}
22 |       classNames={{
23 |         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
24 |         month: "space-y-4",
25 |         caption: "flex justify-center pt-1 relative items-center",
26 |         caption_label: "text-sm font-medium",
27 |         nav: "space-x-1 flex items-center",
28 |         nav_button: cn(
29 |           buttonVariants({ variant: "outline" }),
30 |           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
31 |         ),
32 |         nav_button_previous: "absolute left-1",
33 |         nav_button_next: "absolute right-1",
34 |         table: "w-full border-collapse space-y-1",
35 |         head_row: "grid grid-cols-7",
36 |         head_cell:
37 |           "text-muted-foreground rounded-md font-normal text-[0.8rem] text-center",
38 |         row: "grid grid-cols-7 mt-2",
39 |         cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
40 |         day: cn(
41 |           buttonVariants({ variant: "ghost" }),
42 |           "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
43 |         ),
44 |         day_range_end: "day-range-end",
45 |         day_selected:
46 |           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
47 |         day_today: "bg-accent text-accent-foreground",
48 |         day_outside:
49 |           "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
50 |         day_disabled: "text-muted-foreground opacity-50",
51 |         day_range_middle:
52 |           "aria-selected:bg-accent aria-selected:text-accent-foreground",
53 |         day_hidden: "invisible",
54 |         ...classNames,
55 |       }}
56 |       components={{
57 |         Chevron: ({ orientation }) =>
58 |           orientation === "left" ? (
59 |             <ChevronLeft className="h-4 w-4" />
60 |           ) : (
61 |             <ChevronRight className="h-4 w-4" />
62 |           ),
63 |       }}
64 |       {...props}
65 |     />
66 |   )
67 | }
68 | Calendar.displayName = "Calendar"
69 | 
70 | export { Calendar }
71 | 


--------------------------------------------------------------------------------
/components/ui/card.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | 
 3 | import { cn } from "@/lib/utils"
 4 | 
 5 | const Card = React.forwardRef<
 6 |   HTMLDivElement,
 7 |   React.HTMLAttributes<HTMLDivElement>
 8 | >(({ className, ...props }, ref) => (
 9 |   <div
10 |     ref={ref}
11 |     className={cn(
12 |       "rounded-lg border bg-card text-card-foreground shadow-sm",
13 |       className
14 |     )}
15 |     {...props}
16 |   />
17 | ))
18 | Card.displayName = "Card"
19 | 
20 | const CardHeader = React.forwardRef<
21 |   HTMLDivElement,
22 |   React.HTMLAttributes<HTMLDivElement>
23 | >(({ className, ...props }, ref) => (
24 |   <div
25 |     ref={ref}
26 |     className={cn("flex flex-col space-y-1.5 p-6", className)}
27 |     {...props}
28 |   />
29 | ))
30 | CardHeader.displayName = "CardHeader"
31 | 
32 | const CardTitle = React.forwardRef<
33 |   HTMLDivElement,
34 |   React.HTMLAttributes<HTMLDivElement>
35 | >(({ className, ...props }, ref) => (
36 |   <div
37 |     ref={ref}
38 |     className={cn(
39 |       "text-2xl font-semibold leading-none tracking-tight",
40 |       className
41 |     )}
42 |     {...props}
43 |   />
44 | ))
45 | CardTitle.displayName = "CardTitle"
46 | 
47 | const CardDescription = React.forwardRef<
48 |   HTMLDivElement,
49 |   React.HTMLAttributes<HTMLDivElement>
50 | >(({ className, ...props }, ref) => (
51 |   <div
52 |     ref={ref}
53 |     className={cn("text-sm text-muted-foreground", className)}
54 |     {...props}
55 |   />
56 | ))
57 | CardDescription.displayName = "CardDescription"
58 | 
59 | const CardContent = React.forwardRef<
60 |   HTMLDivElement,
61 |   React.HTMLAttributes<HTMLDivElement>
62 | >(({ className, ...props }, ref) => (
63 |   <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
64 | ))
65 | CardContent.displayName = "CardContent"
66 | 
67 | const CardFooter = React.forwardRef<
68 |   HTMLDivElement,
69 |   React.HTMLAttributes<HTMLDivElement>
70 | >(({ className, ...props }, ref) => (
71 |   <div
72 |     ref={ref}
73 |     className={cn("flex items-center p-6 pt-0", className)}
74 |     {...props}
75 |   />
76 | ))
77 | CardFooter.displayName = "CardFooter"
78 | 
79 | export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
80 | 


--------------------------------------------------------------------------------
/components/ui/chip.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import { cva, type VariantProps } from "class-variance-authority"
 5 | 
 6 | import { cn } from "@/lib/utils"
 7 | 
 8 | const chipVariants = cva(
 9 |   "inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
10 |   {
11 |     variants: {
12 |       variant: {
13 |         default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
14 |         primary: "bg-primary text-primary-foreground hover:bg-primary/90",
15 |         destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
16 |         outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
17 |       },
18 |       size: {
19 |         sm: "h-8 px-3",
20 |         md: "h-9 px-4",
21 |         lg: "h-10 px-5",
22 |       },
23 |     },
24 |     defaultVariants: {
25 |       variant: "default",
26 |       size: "md",
27 |     },
28 |   }
29 | )
30 | 
31 | export interface ChipProps
32 |   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
33 |     VariantProps<typeof chipVariants> {
34 |   isActive?: boolean
35 | }
36 | 
37 | const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
38 |   ({ className, variant, size, isActive, ...props }, ref) => {
39 |     return (
40 |       <button
41 |         className={cn(
42 |           chipVariants({ variant: isActive ? "primary" : "default", size }),
43 |           className
44 |         )}
45 |         ref={ref}
46 |         {...props}
47 |       />
48 |     )
49 |   }
50 | )
51 | Chip.displayName = "Chip"
52 | 
53 | export { Chip, chipVariants }
54 | 


--------------------------------------------------------------------------------
/components/ui/command.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import * as React from "react"
  4 | import { DialogProps } from "@radix-ui/react-dialog"
  5 | import { Command as CommandPrimitive } from "cmdk"
  6 | import { Search } from "lucide-react"
  7 | 
  8 | import { cn } from "@/lib/utils"
  9 | import { Dialog, DialogContent } from "@/components/ui/dialog"
 10 | 
 11 | const Command = React.forwardRef<
 12 |   React.ElementRef<typeof CommandPrimitive>,
 13 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive>
 14 | >(({ className, ...props }, ref) => (
 15 |   <CommandPrimitive
 16 |     ref={ref}
 17 |     className={cn(
 18 |       "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
 19 |       className
 20 |     )}
 21 |     {...props}
 22 |   />
 23 | ))
 24 | Command.displayName = CommandPrimitive.displayName
 25 | 
 26 | interface CommandDialogProps extends DialogProps {}
 27 | 
 28 | const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
 29 |   return (
 30 |     <Dialog {...props}>
 31 |       <DialogContent className="overflow-hidden p-0 shadow-lg">
 32 |         <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
 33 |           {children}
 34 |         </Command>
 35 |       </DialogContent>
 36 |     </Dialog>
 37 |   )
 38 | }
 39 | 
 40 | const CommandInput = React.forwardRef<
 41 |   React.ElementRef<typeof CommandPrimitive.Input>,
 42 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
 43 | >(({ className, ...props }, ref) => (
 44 |   <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
 45 |     <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
 46 |     <CommandPrimitive.Input
 47 |       ref={ref}
 48 |       className={cn(
 49 |         "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
 50 |         className
 51 |       )}
 52 |       {...props}
 53 |     />
 54 |   </div>
 55 | ))
 56 | 
 57 | CommandInput.displayName = CommandPrimitive.Input.displayName
 58 | 
 59 | const CommandList = React.forwardRef<
 60 |   React.ElementRef<typeof CommandPrimitive.List>,
 61 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
 62 | >(({ className, ...props }, ref) => (
 63 |   <CommandPrimitive.List
 64 |     ref={ref}
 65 |     className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
 66 |     {...props}
 67 |   />
 68 | ))
 69 | 
 70 | CommandList.displayName = CommandPrimitive.List.displayName
 71 | 
 72 | const CommandEmpty = React.forwardRef<
 73 |   React.ElementRef<typeof CommandPrimitive.Empty>,
 74 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
 75 | >((props, ref) => (
 76 |   <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
 77 | ))
 78 | 
 79 | CommandEmpty.displayName = CommandPrimitive.Empty.displayName
 80 | 
 81 | const CommandGroup = React.forwardRef<
 82 |   React.ElementRef<typeof CommandPrimitive.Group>,
 83 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
 84 | >(({ className, ...props }, ref) => (
 85 |   <CommandPrimitive.Group
 86 |     ref={ref}
 87 |     className={cn(
 88 |       "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
 89 |       className
 90 |     )}
 91 |     {...props}
 92 |   />
 93 | ))
 94 | 
 95 | CommandGroup.displayName = CommandPrimitive.Group.displayName
 96 | 
 97 | const CommandSeparator = React.forwardRef<
 98 |   React.ElementRef<typeof CommandPrimitive.Separator>,
 99 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
100 | >(({ className, ...props }, ref) => (
101 |   <CommandPrimitive.Separator
102 |     ref={ref}
103 |     className={cn("-mx-1 h-px bg-border", className)}
104 |     {...props}
105 |   />
106 | ))
107 | CommandSeparator.displayName = CommandPrimitive.Separator.displayName
108 | 
109 | const CommandItem = React.forwardRef<
110 |   React.ElementRef<typeof CommandPrimitive.Item>,
111 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
112 | >(({ className, ...props }, ref) => (
113 |   <CommandPrimitive.Item
114 |     ref={ref}
115 |     className={cn(
116 |       "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
117 |       className
118 |     )}
119 |     {...props}
120 |   />
121 | ))
122 | 
123 | CommandItem.displayName = CommandPrimitive.Item.displayName
124 | 
125 | const CommandShortcut = ({
126 |   className,
127 |   ...props
128 | }: React.HTMLAttributes<HTMLSpanElement>) => {
129 |   return (
130 |     <span
131 |       className={cn(
132 |         "ml-auto text-xs tracking-widest text-muted-foreground",
133 |         className
134 |       )}
135 |       {...props}
136 |     />
137 |   )
138 | }
139 | CommandShortcut.displayName = "CommandShortcut"
140 | 
141 | export {
142 |   Command,
143 |   CommandDialog,
144 |   CommandInput,
145 |   CommandList,
146 |   CommandEmpty,
147 |   CommandGroup,
148 |   CommandItem,
149 |   CommandShortcut,
150 |   CommandSeparator,
151 | }
152 | 


--------------------------------------------------------------------------------
/components/ui/dialog.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import * as React from "react"
  4 | import * as DialogPrimitive from "@radix-ui/react-dialog"
  5 | import { X } from "lucide-react"
  6 | 
  7 | import { cn } from "@/lib/utils"
  8 | 
  9 | const Dialog = DialogPrimitive.Root
 10 | 
 11 | const DialogTrigger = DialogPrimitive.Trigger
 12 | 
 13 | const DialogPortal = DialogPrimitive.Portal
 14 | 
 15 | const DialogClose = DialogPrimitive.Close
 16 | 
 17 | const DialogOverlay = React.forwardRef<
 18 |   React.ElementRef<typeof DialogPrimitive.Overlay>,
 19 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
 20 | >(({ className, ...props }, ref) => (
 21 |   <DialogPrimitive.Overlay
 22 |     ref={ref}
 23 |     className={cn(
 24 |       "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
 25 |       className
 26 |     )}
 27 |     {...props}
 28 |   />
 29 | ))
 30 | DialogOverlay.displayName = DialogPrimitive.Overlay.displayName
 31 | 
 32 | const DialogContent = React.forwardRef<
 33 |   React.ElementRef<typeof DialogPrimitive.Content>,
 34 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
 35 | >(({ className, children, ...props }, ref) => (
 36 |   <DialogPortal>
 37 |     <DialogOverlay />
 38 |     <DialogPrimitive.Content
 39 |       ref={ref}
 40 |       className={cn(
 41 |         "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
 42 |         className
 43 |       )}
 44 |       {...props}
 45 |     >
 46 |       {children}
 47 |       <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
 48 |         <X className="h-4 w-4" />
 49 |         <span className="sr-only">Close</span>
 50 |       </DialogPrimitive.Close>
 51 |     </DialogPrimitive.Content>
 52 |   </DialogPortal>
 53 | ))
 54 | DialogContent.displayName = DialogPrimitive.Content.displayName
 55 | 
 56 | const DialogHeader = ({
 57 |   className,
 58 |   ...props
 59 | }: React.HTMLAttributes<HTMLDivElement>) => (
 60 |   <div
 61 |     className={cn(
 62 |       "flex flex-col space-y-1.5 text-center sm:text-left",
 63 |       className
 64 |     )}
 65 |     {...props}
 66 |   />
 67 | )
 68 | DialogHeader.displayName = "DialogHeader"
 69 | 
 70 | const DialogFooter = ({
 71 |   className,
 72 |   ...props
 73 | }: React.HTMLAttributes<HTMLDivElement>) => (
 74 |   <div
 75 |     className={cn(
 76 |       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
 77 |       className
 78 |     )}
 79 |     {...props}
 80 |   />
 81 | )
 82 | DialogFooter.displayName = "DialogFooter"
 83 | 
 84 | const DialogTitle = React.forwardRef<
 85 |   React.ElementRef<typeof DialogPrimitive.Title>,
 86 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
 87 | >(({ className, ...props }, ref) => (
 88 |   <DialogPrimitive.Title
 89 |     ref={ref}
 90 |     className={cn(
 91 |       "text-lg font-semibold leading-none tracking-tight",
 92 |       className
 93 |     )}
 94 |     {...props}
 95 |   />
 96 | ))
 97 | DialogTitle.displayName = DialogPrimitive.Title.displayName
 98 | 
 99 | const DialogDescription = React.forwardRef<
100 |   React.ElementRef<typeof DialogPrimitive.Description>,
101 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
102 | >(({ className, ...props }, ref) => (
103 |   <DialogPrimitive.Description
104 |     ref={ref}
105 |     className={cn("text-sm text-muted-foreground", className)}
106 |     {...props}
107 |   />
108 | ))
109 | DialogDescription.displayName = DialogPrimitive.Description.displayName
110 | 
111 | export {
112 |   Dialog,
113 |   DialogPortal,
114 |   DialogOverlay,
115 |   DialogClose,
116 |   DialogTrigger,
117 |   DialogContent,
118 |   DialogHeader,
119 |   DialogFooter,
120 |   DialogTitle,
121 |   DialogDescription,
122 | }
123 | 


--------------------------------------------------------------------------------
/components/ui/drawer.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import * as React from "react"
  4 | import { Drawer as DrawerPrimitive } from "vaul"
  5 | 
  6 | import { cn } from "@/lib/utils"
  7 | 
  8 | const Drawer = ({
  9 |   shouldScaleBackground = true,
 10 |   ...props
 11 | }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
 12 |   <DrawerPrimitive.Root
 13 |     shouldScaleBackground={shouldScaleBackground}
 14 |     {...props}
 15 |   />
 16 | )
 17 | Drawer.displayName = "Drawer"
 18 | 
 19 | const DrawerTrigger = DrawerPrimitive.Trigger
 20 | 
 21 | const DrawerPortal = DrawerPrimitive.Portal
 22 | 
 23 | const DrawerClose = DrawerPrimitive.Close
 24 | 
 25 | const DrawerOverlay = React.forwardRef<
 26 |   React.ElementRef<typeof DrawerPrimitive.Overlay>,
 27 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
 28 | >(({ className, ...props }, ref) => (
 29 |   <DrawerPrimitive.Overlay
 30 |     ref={ref}
 31 |     className={cn("fixed inset-0 z-50 bg-black/80", className)}
 32 |     {...props}
 33 |   />
 34 | ))
 35 | DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName
 36 | 
 37 | const DrawerContent = React.forwardRef<
 38 |   React.ElementRef<typeof DrawerPrimitive.Content>,
 39 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
 40 | >(({ className, children, ...props }, ref) => (
 41 |   <DrawerPortal>
 42 |     <DrawerOverlay />
 43 |     <DrawerPrimitive.Content
 44 |       ref={ref}
 45 |       className={cn(
 46 |         "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
 47 |         className
 48 |       )}
 49 |       {...props}
 50 |     >
 51 |       <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
 52 |       {children}
 53 |     </DrawerPrimitive.Content>
 54 |   </DrawerPortal>
 55 | ))
 56 | DrawerContent.displayName = "DrawerContent"
 57 | 
 58 | const DrawerHeader = ({
 59 |   className,
 60 |   ...props
 61 | }: React.HTMLAttributes<HTMLDivElement>) => (
 62 |   <div
 63 |     className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
 64 |     {...props}
 65 |   />
 66 | )
 67 | DrawerHeader.displayName = "DrawerHeader"
 68 | 
 69 | const DrawerFooter = ({
 70 |   className,
 71 |   ...props
 72 | }: React.HTMLAttributes<HTMLDivElement>) => (
 73 |   <div
 74 |     className={cn("mt-auto flex flex-col gap-2 p-4", className)}
 75 |     {...props}
 76 |   />
 77 | )
 78 | DrawerFooter.displayName = "DrawerFooter"
 79 | 
 80 | const DrawerTitle = React.forwardRef<
 81 |   React.ElementRef<typeof DrawerPrimitive.Title>,
 82 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
 83 | >(({ className, ...props }, ref) => (
 84 |   <DrawerPrimitive.Title
 85 |     ref={ref}
 86 |     className={cn(
 87 |       "text-lg font-semibold leading-none tracking-tight",
 88 |       className
 89 |     )}
 90 |     {...props}
 91 |   />
 92 | ))
 93 | DrawerTitle.displayName = DrawerPrimitive.Title.displayName
 94 | 
 95 | const DrawerDescription = React.forwardRef<
 96 |   React.ElementRef<typeof DrawerPrimitive.Description>,
 97 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
 98 | >(({ className, ...props }, ref) => (
 99 |   <DrawerPrimitive.Description
100 |     ref={ref}
101 |     className={cn("text-sm text-muted-foreground", className)}
102 |     {...props}
103 |   />
104 | ))
105 | DrawerDescription.displayName = DrawerPrimitive.Description.displayName
106 | 
107 | export {
108 |   Drawer,
109 |   DrawerPortal,
110 |   DrawerOverlay,
111 |   DrawerTrigger,
112 |   DrawerClose,
113 |   DrawerContent,
114 |   DrawerHeader,
115 |   DrawerFooter,
116 |   DrawerTitle,
117 |   DrawerDescription,
118 | }
119 | 


--------------------------------------------------------------------------------
/components/ui/input.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | 
 3 | import { cn } from "@/lib/utils"
 4 | 
 5 | const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
 6 |   ({ className, type, ...props }, ref) => {
 7 |     return (
 8 |       <input
 9 |         type={type}
10 |         className={cn(
11 |           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
12 |           className
13 |         )}
14 |         ref={ref}
15 |         {...props}
16 |       />
17 |     )
18 |   }
19 | )
20 | Input.displayName = "Input"
21 | 
22 | export { Input }
23 | 


--------------------------------------------------------------------------------
/components/ui/label.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import * as LabelPrimitive from "@radix-ui/react-label"
 5 | import { cva, type VariantProps } from "class-variance-authority"
 6 | 
 7 | import { cn } from "@/lib/utils"
 8 | 
 9 | const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")
10 | 
11 | const Label = React.forwardRef<
12 |   React.ElementRef<typeof LabelPrimitive.Root>,
13 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
14 | >(({ className, ...props }, ref) => (
15 |   <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
16 | ))
17 | Label.displayName = LabelPrimitive.Root.displayName
18 | 
19 | export { Label }
20 | 


--------------------------------------------------------------------------------
/components/ui/multi-select.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import * as React from "react"
  4 | import { cva, type VariantProps } from "class-variance-authority"
  5 | import { XIcon, ChevronsUpDown } from "lucide-react"
  6 | 
  7 | import { cn } from "@/lib/utils"
  8 | import { Badge } from "@/components/ui/badge"
  9 | import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
 10 | import {
 11 |   Popover,
 12 |   PopoverContent,
 13 |   PopoverTrigger,
 14 | } from "@/components/ui/popover"
 15 | 
 16 | const multiSelectVariants = cva(
 17 |   "flex items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
 18 |   {
 19 |     variants: {
 20 |       variant: {
 21 |         default: "w-full min-h-10 h-auto",
 22 |       },
 23 |     },
 24 |     defaultVariants: {
 25 |       variant: "default",
 26 |     },
 27 |   }
 28 | )
 29 | 
 30 | interface MultiSelectProps
 31 |   extends React.HTMLAttributes<HTMLDivElement>,
 32 |     VariantProps<typeof multiSelectVariants> {
 33 |   options: {
 34 |     value: string
 35 |     label: string
 36 |   }[]
 37 |   value: string[]
 38 |   onChange: (value: string[]) => void
 39 |   placeholder?: string
 40 | }
 41 | 
 42 | const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
 43 |   ({ options, value, onChange, placeholder = "Select options...", className, ...props }, ref) => {
 44 |     const [open, setOpen] = React.useState(false)
 45 | 
 46 |     const handleSelect = (selectedValue: string) => {
 47 |       if (value.includes(selectedValue)) {
 48 |         onChange(value.filter((v) => v !== selectedValue))
 49 |       } else {
 50 |         onChange([...value, selectedValue])
 51 |       }
 52 |     }
 53 | 
 54 |     return (
 55 |       <Popover open={open} onOpenChange={setOpen}>
 56 |         <PopoverTrigger asChild>
 57 |           <div
 58 |             ref={ref}
 59 |             onClick={() => setOpen(!open)}
 60 |             className={cn(multiSelectVariants(), className, "cursor-pointer")}
 61 |             {...props}
 62 |           >
 63 |             <div className="flex flex-wrap gap-1">
 64 |               {value.length > 0 ? (
 65 |                 value.map((val) => (
 66 |                   <Badge
 67 |                     key={val}
 68 |                     variant="secondary"
 69 |                     className="mr-1"
 70 |                     onClick={(e) => {
 71 |                       e.stopPropagation()
 72 |                       handleSelect(val)
 73 |                     }}
 74 |                   >
 75 |                     {options.find((o) => o.value === val)?.label}
 76 |                     <XIcon className="ml-2 h-4 w-4" />
 77 |                   </Badge>
 78 |                 ))
 79 |               ) : (
 80 |                 <span className="text-muted-foreground">{placeholder}</span>
 81 |               )}
 82 |             </div>
 83 |             <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
 84 |           </div>
 85 |         </PopoverTrigger>
 86 |         <PopoverContent className="w-full p-0">
 87 |           <Command>
 88 |             <CommandGroup>
 89 |               {options.map((option) => (
 90 |                 <CommandItem
 91 |                   key={option.value}
 92 |                   onSelect={() => handleSelect(option.value)}
 93 |                   className={cn(
 94 |                     "cursor-pointer",
 95 |                     value.includes(option.value) ? "font-bold" : ""
 96 |                   )}
 97 |                 >
 98 |                   {option.label}
 99 |                 </CommandItem>
100 |               ))}
101 |             </CommandGroup>
102 |           </Command>
103 |         </PopoverContent>
104 |       </Popover>
105 |     )
106 |   }
107 | )
108 | 
109 | MultiSelect.displayName = "MultiSelect"
110 | 
111 | export { MultiSelect }
112 | 


--------------------------------------------------------------------------------
/components/ui/popover.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import * as PopoverPrimitive from "@radix-ui/react-popover"
 5 | 
 6 | import { cn } from "@/lib/utils"
 7 | 
 8 | const Popover = PopoverPrimitive.Root
 9 | 
10 | const PopoverTrigger = PopoverPrimitive.Trigger
11 | 
12 | const PopoverContent = React.forwardRef<
13 |   React.ElementRef<typeof PopoverPrimitive.Content>,
14 |   React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
15 | >(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
16 |   <PopoverPrimitive.Portal>
17 |     <PopoverPrimitive.Content
18 |       ref={ref}
19 |       align={align}
20 |       sideOffset={sideOffset}
21 |       className={cn(
22 |         "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
23 |         className
24 |       )}
25 |       {...props}
26 |     />
27 |   </PopoverPrimitive.Portal>
28 | ))
29 | PopoverContent.displayName = PopoverPrimitive.Content.displayName
30 | 
31 | export { Popover, PopoverTrigger, PopoverContent }
32 | 


--------------------------------------------------------------------------------
/components/ui/scroll-area.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
 5 | 
 6 | import { cn } from "@/lib/utils"
 7 | 
 8 | const ScrollArea = React.forwardRef<
 9 |   React.ElementRef<typeof ScrollAreaPrimitive.Root>,
10 |   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
11 | >(({ className, children, ...props }, ref) => (
12 |   <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
13 |     <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
14 |     <ScrollBar />
15 |     <ScrollAreaPrimitive.Corner />
16 |   </ScrollAreaPrimitive.Root>
17 | ))
18 | ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName
19 | 
20 | const ScrollBar = React.forwardRef<
21 |   React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
22 |   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
23 | >(({ className, orientation = "vertical", ...props }, ref) => (
24 |   <ScrollAreaPrimitive.ScrollAreaScrollbar
25 |     ref={ref}
26 |     orientation={orientation}
27 |     className={cn(
28 |       "flex touch-none select-none transition-colors",
29 |       orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
30 |       orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
31 |       className,
32 |     )}
33 |     {...props}
34 |   >
35 |     <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
36 |   </ScrollAreaPrimitive.ScrollAreaScrollbar>
37 | ))
38 | ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName
39 | 
40 | export { ScrollArea, ScrollBar }
41 | 


--------------------------------------------------------------------------------
/components/ui/select.tsx:
--------------------------------------------------------------------------------
  1 | "use client"
  2 | 
  3 | import * as React from "react"
  4 | import * as SelectPrimitive from "@radix-ui/react-select"
  5 | import { Check, ChevronDown, ChevronUp } from "lucide-react"
  6 | 
  7 | import { cn } from "@/lib/utils"
  8 | 
  9 | const Select = SelectPrimitive.Root
 10 | 
 11 | const SelectGroup = SelectPrimitive.Group
 12 | 
 13 | const SelectValue = SelectPrimitive.Value
 14 | 
 15 | const SelectTrigger = React.forwardRef<
 16 |   React.ElementRef<typeof SelectPrimitive.Trigger>,
 17 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
 18 | >(({ className, children, ...props }, ref) => (
 19 |   <SelectPrimitive.Trigger
 20 |     ref={ref}
 21 |     className={cn(
 22 |       "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
 23 |       className,
 24 |     )}
 25 |     {...props}
 26 |   >
 27 |     {children}
 28 |     <SelectPrimitive.Icon asChild>
 29 |       <ChevronDown className="h-4 w-4 opacity-50" />
 30 |     </SelectPrimitive.Icon>
 31 |   </SelectPrimitive.Trigger>
 32 | ))
 33 | SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
 34 | 
 35 | const SelectScrollUpButton = React.forwardRef<
 36 |   React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
 37 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
 38 | >(({ className, ...props }, ref) => (
 39 |   <SelectPrimitive.ScrollUpButton
 40 |     ref={ref}
 41 |     className={cn("flex cursor-default items-center justify-center py-1", className)}
 42 |     {...props}
 43 |   >
 44 |     <ChevronUp className="h-4 w-4" />
 45 |   </SelectPrimitive.ScrollUpButton>
 46 | ))
 47 | SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName
 48 | 
 49 | const SelectScrollDownButton = React.forwardRef<
 50 |   React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
 51 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
 52 | >(({ className, ...props }, ref) => (
 53 |   <SelectPrimitive.ScrollDownButton
 54 |     ref={ref}
 55 |     className={cn("flex cursor-default items-center justify-center py-1", className)}
 56 |     {...props}
 57 |   >
 58 |     <ChevronDown className="h-4 w-4" />
 59 |   </SelectPrimitive.ScrollDownButton>
 60 | ))
 61 | SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName
 62 | 
 63 | const SelectContent = React.forwardRef<
 64 |   React.ElementRef<typeof SelectPrimitive.Content>,
 65 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
 66 | >(({ className, children, position = "popper", ...props }, ref) => (
 67 |   <SelectPrimitive.Portal>
 68 |     <SelectPrimitive.Content
 69 |       ref={ref}
 70 |       className={cn(
 71 |         "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
 72 |         position === "popper" &&
 73 |           "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
 74 |         className,
 75 |       )}
 76 |       position={position}
 77 |       {...props}
 78 |     >
 79 |       <SelectScrollUpButton />
 80 |       <SelectPrimitive.Viewport
 81 |         className={cn(
 82 |           "p-1",
 83 |           position === "popper" &&
 84 |             "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
 85 |         )}
 86 |       >
 87 |         {children}
 88 |       </SelectPrimitive.Viewport>
 89 |       <SelectScrollDownButton />
 90 |     </SelectPrimitive.Content>
 91 |   </SelectPrimitive.Portal>
 92 | ))
 93 | SelectContent.displayName = SelectPrimitive.Content.displayName
 94 | 
 95 | const SelectLabel = React.forwardRef<
 96 |   React.ElementRef<typeof SelectPrimitive.Label>,
 97 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
 98 | >(({ className, ...props }, ref) => (
 99 |   <SelectPrimitive.Label ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
100 | ))
101 | SelectLabel.displayName = SelectPrimitive.Label.displayName
102 | 
103 | const SelectItem = React.forwardRef<
104 |   React.ElementRef<typeof SelectPrimitive.Item>,
105 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
106 | >(({ className, children, ...props }, ref) => (
107 |   <SelectPrimitive.Item
108 |     ref={ref}
109 |     className={cn(
110 |       "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
111 |       className,
112 |     )}
113 |     {...props}
114 |   >
115 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
116 |       <SelectPrimitive.ItemIndicator>
117 |         <Check className="h-4 w-4" />
118 |       </SelectPrimitive.ItemIndicator>
119 |     </span>
120 | 
121 |     <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
122 |   </SelectPrimitive.Item>
123 | ))
124 | SelectItem.displayName = SelectPrimitive.Item.displayName
125 | 
126 | const SelectSeparator = React.forwardRef<
127 |   React.ElementRef<typeof SelectPrimitive.Separator>,
128 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
129 | >(({ className, ...props }, ref) => (
130 |   <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
131 | ))
132 | SelectSeparator.displayName = SelectPrimitive.Separator.displayName
133 | 
134 | export {
135 |   Select,
136 |   SelectGroup,
137 |   SelectValue,
138 |   SelectTrigger,
139 |   SelectContent,
140 |   SelectLabel,
141 |   SelectItem,
142 |   SelectSeparator,
143 |   SelectScrollUpButton,
144 |   SelectScrollDownButton,
145 | }
146 | 


--------------------------------------------------------------------------------
/components/ui/skeleton.tsx:
--------------------------------------------------------------------------------
 1 | import { cn } from "@/lib/utils"
 2 | 
 3 | function Skeleton({
 4 |   className,
 5 |   ...props
 6 | }: React.HTMLAttributes<HTMLDivElement>) {
 7 |   return (
 8 |     <div
 9 |       className={cn("animate-pulse rounded-md bg-slate-700", className)}
10 |       {...props}
11 |     />
12 |   )
13 | }
14 | 
15 | export { Skeleton }
16 | 


--------------------------------------------------------------------------------
/components/ui/sonner.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import { useTheme } from "next-themes"
 4 | import { Toaster as Sonner } from "sonner"
 5 | 
 6 | type ToasterProps = React.ComponentProps<typeof Sonner>
 7 | 
 8 | const Toaster = ({ ...props }: ToasterProps) => {
 9 |   const { theme = "system" } = useTheme()
10 | 
11 |   return (
12 |     <Sonner
13 |       theme={theme as ToasterProps["theme"]}
14 |       className="toaster group"
15 |       toastOptions={{
16 |         classNames: {
17 |           toast:
18 |             "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
19 |           description: "group-[.toast]:text-muted-foreground",
20 |           actionButton:
21 |             "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
22 |           cancelButton:
23 |             "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
24 |         },
25 |       }}
26 |       {...props}
27 |     />
28 |   )
29 | }
30 | 
31 | export { Toaster }
32 | 


--------------------------------------------------------------------------------
/components/ui/switch.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import * as SwitchPrimitives from "@radix-ui/react-switch"
 5 | 
 6 | import { cn } from "@/lib/utils"
 7 | 
 8 | const Switch = React.forwardRef<
 9 |   React.ElementRef<typeof SwitchPrimitives.Root>,
10 |   React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
11 | >(({ className, ...props }, ref) => (
12 |   <SwitchPrimitives.Root
13 |     className={cn(
14 |       "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
15 |       className
16 |     )}
17 |     {...props}
18 |     ref={ref}
19 |   >
20 |     <SwitchPrimitives.Thumb
21 |       className={cn(
22 |         "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
23 |       )}
24 |     />
25 |   </SwitchPrimitives.Root>
26 | ))
27 | Switch.displayName = SwitchPrimitives.Root.displayName
28 | 
29 | export { Switch }
30 | 


--------------------------------------------------------------------------------
/components/ui/tabs.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import * as React from "react"
 4 | import * as TabsPrimitive from "@radix-ui/react-tabs"
 5 | 
 6 | import { cn } from "@/lib/utils"
 7 | 
 8 | const Tabs = TabsPrimitive.Root
 9 | 
10 | const TabsList = React.forwardRef<
11 |   React.ElementRef<typeof TabsPrimitive.List>,
12 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
13 | >(({ className, ...props }, ref) => (
14 |   <TabsPrimitive.List
15 |     ref={ref}
16 |     className={cn(
17 |       "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
18 |       className
19 |     )}
20 |     {...props}
21 |   />
22 | ))
23 | TabsList.displayName = TabsPrimitive.List.displayName
24 | 
25 | const TabsTrigger = React.forwardRef<
26 |   React.ElementRef<typeof TabsPrimitive.Trigger>,
27 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
28 | >(({ className, ...props }, ref) => (
29 |   <TabsPrimitive.Trigger
30 |     ref={ref}
31 |     className={cn(
32 |       "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
33 |       className
34 |     )}
35 |     {...props}
36 |   />
37 | ))
38 | TabsTrigger.displayName = TabsPrimitive.Trigger.displayName
39 | 
40 | const TabsContent = React.forwardRef<
41 |   React.ElementRef<typeof TabsPrimitive.Content>,
42 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
43 | >(({ className, ...props }, ref) => (
44 |   <TabsPrimitive.Content
45 |     ref={ref}
46 |     className={cn(
47 |       "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
48 |       className
49 |     )}
50 |     {...props}
51 |   />
52 | ))
53 | TabsContent.displayName = TabsPrimitive.Content.displayName
54 | 
55 | export { Tabs, TabsList, TabsTrigger, TabsContent }
56 | 


--------------------------------------------------------------------------------
/components/ui/textarea.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react"
 2 | 
 3 | import { cn } from "@/lib/utils"
 4 | 
 5 | export interface TextareaProps
 6 |   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
 7 | 
 8 | const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
 9 |   ({ className, ...props }, ref) => {
10 |     return (
11 |       <textarea
12 |         className={cn(
13 |           "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
14 |           className
15 |         )}
16 |         ref={ref}
17 |         {...props}
18 |       />
19 |     )
20 |   }
21 | )
22 | Textarea.displayName = "Textarea"
23 | 
24 | export { Textarea }
25 | 


--------------------------------------------------------------------------------
/firebase.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "firestore": {
 3 |     "rules": "firestore.rules",
 4 |     "indexes": "firestore.indexes.json"
 5 |   },
 6 |   "hosting": {
 7 |     "public": "out",
 8 |     "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
 9 |     "rewrites": [
10 |       {
11 |         "source": "**",
12 |         "destination": "/index.html"
13 |       }
14 |     ]
15 |   }
16 | }
17 | 


--------------------------------------------------------------------------------
/firestore.indexes.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "indexes": [
 3 |     {
 4 |       "collectionGroup": "events",
 5 |       "queryScope": "COLLECTION",
 6 |       "fields": [
 7 |         {
 8 |           "fieldPath": "createdBy",
 9 |           "order": "ASCENDING"
10 |         },
11 |         {
12 |           "fieldPath": "createdAt",
13 |           "order": "DESCENDING"
14 |         }
15 |       ]
16 |     },
17 |     {
18 |       "collectionGroup": "chat",
19 |       "queryScope": "COLLECTION",
20 |       "fields": [
21 |         {
22 |           "fieldPath": "timestamp",
23 |           "order": "ASCENDING"
24 |         }
25 |       ]
26 |     }
27 |   ],
28 |   "fieldOverrides": []
29 | }
30 | 


--------------------------------------------------------------------------------
/firestore.rules:
--------------------------------------------------------------------------------
 1 | rules_version = '2';
 2 | 
 3 | service cloud.firestore {
 4 |   match /databases/{database}/documents {
 5 |     // Users collection
 6 |     match /users/{userId} {
 7 |       // Users can read their own profile, and other users can read public profiles
 8 |       allow read: if request.auth != null;
 9 |       // Users can only write to their own profile
10 |       allow write: if request.auth != null && request.auth.uid == userId;
11 | 
12 |       // Connections subcollection
13 |       match /connections/{connectionId} {
14 |         // A user can read their own connections list
15 |         allow read: if request.auth != null && request.auth.uid == userId;
16 | 
17 |         // A user can create a connection document in another user's subcollection (send a request)
18 |         // A user can also update their own connection document (accept a request)
19 |         allow write: if request.auth != null && 
20 |           (
21 |             // Case 1: Sending a request
22 |             // The connectionId is the ID of the user sending the request
23 |             (request.auth.uid == connectionId && request.resource.data.status == 'pending') ||
24 |             // Case 2: Accepting a request
25 |             // The userId is the ID of the user accepting the request
26 |             (request.auth.uid == userId && request.resource.data.status == 'accepted')
27 |           );
28 |       }
29 |     }
30 |     
31 |     // Events collection
32 |     match /events/{eventId} {
33 |       // Allow public read access for viewing events on the map
34 |       allow read: if true;
35 |       
36 |       // Only authenticated users can create events
37 |       allow create: if request.auth != null 
38 |         && request.auth.uid == request.resource.data.createdBy;
39 |       
40 |       allow update: if request.auth != null && (
41 |         // Event organizer can update any field
42 |         request.auth.uid == resource.data.createdBy ||
43 |         // Regular players can only update players and currentPlayers (for RSVP)
44 |         (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['players', 'currentPlayers'])) ||
45 |         // Only organizer can update checkedInPlayers array
46 |         (request.auth.uid == resource.data.createdBy && 
47 |          request.resource.data.diff(resource.data).affectedKeys().hasOnly(['checkedInPlayers']))
48 |       );
49 |       
50 |       // Only the event creator can delete events
51 |       allow delete: if request.auth != null 
52 |         && request.auth.uid == resource.data.createdBy;
53 |       
54 |       // Chat subcollection for each event
55 |       match /chat/{messageId} {
56 |         // Only event participants can read chat messages
57 |         allow read: if request.auth != null 
58 |           && isEventParticipant(eventId);
59 |         
60 |         allow create: if request.auth != null
61 |           && isEventParticipant(eventId)
62 |           && request.auth.uid == request.resource.data.senderId;
63 |         
64 |         allow delete: if request.auth != null 
65 |           && request.auth.uid == resource.data.senderId;
66 |       }
67 |     }
68 |     
69 |     function isEventParticipant(eventId) {
70 |       let eventData = get(/databases/$(database)/documents/events/$(eventId)).data;
71 |       return request.auth.uid == eventData.createdBy 
72 |         || request.auth.uid in eventData.players;
73 |     }
74 |   }
75 | }
76 | 


--------------------------------------------------------------------------------
/functions/generateEventCopy.js:
--------------------------------------------------------------------------------
 1 | const { onCall } = require("firebase-functions/v2/https");
 2 | const { GoogleGenerativeAI } = require("@google/generative-ai");
 3 | const functions = require("firebase-functions");
 4 | 
 5 | // Initialize the Gemini client with the API key from environment variables
 6 | const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 7 | 
 8 | exports.generateEventCopy = onCall(async (request) => {
 9 |   // 1. Authentication Check: Ensure the user is logged in.
10 |   if (!request.auth) {
11 |     throw new functions.https.HttpsError(
12 |       "unauthenticated",
13 |       "You must be logged in to use this feature."
14 |     );
15 |   }
16 | 
17 |   // 2. Data Validation: Ensure all required data is present.
18 |   const { sport, locationName, timeOfDay } = request.data;
19 |   if (!sport || !locationName || !timeOfDay) {
20 |     throw new functions.https.HttpsError(
21 |       "invalid-argument",
22 |       "Missing required fields: sport, locationName, or timeOfDay."
23 |     );
24 |   }
25 | 
26 |   // 3. Construct the Prompt for Gemini
27 |   const prompt = `You are an assistant for a sports app called Huddle. Generate 3 catchy and exciting options for a pickup game title and a short, friendly description. The game is for ${sport} and is happening at ${locationName} in the ${timeOfDay}. For cricket, use terms like 'sixes' or 'wickets'. For basketball, use terms like 'hoops' or 'showdown'. The tone should be fun and welcoming. Return the response as a valid JSON array of objects, where each object has a 'title' and a 'description' key. Do not include any markdown formatting.`;
28 | 
29 |   try {
30 |     // 4. Call the Gemini API
31 |     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
32 |     const result = await model.generateContent(prompt);
33 |     const response = await result.response;
34 |     let text = await response.text();
35 |     
36 |     // Clean the response to ensure it's valid JSON
37 |     text = text.replace(/```json/g, "").replace(/```/g, "").trim();
38 | 
39 |     // 5. Parse and Return the JSON Response
40 |     const suggestions = JSON.parse(text);
41 |     return { suggestions };
42 |   } catch (error) {
43 |     console.error("Error calling Gemini API:", error);
44 |     throw new functions.https.HttpsError(
45 |       "internal",
46 |       "An error occurred while generating suggestions."
47 |     );
48 |   }
49 | });
50 | 


--------------------------------------------------------------------------------
/functions/index.js:
--------------------------------------------------------------------------------
 1 | // functions/index.js
 2 | const functions = require("firebase-functions");
 3 | const admin = require("firebase-admin");
 4 | 
 5 | admin.initializeApp();
 6 | 
 7 | // Export the AI feature
 8 | exports.generateEventCopy = require('./generateEventCopy').generateEventCopy;
 9 | 
10 | // Export the scheduled function for sending event reminders
11 | exports.sendEventReminders = require('./send-reminders').sendEventReminders;
12 | 


--------------------------------------------------------------------------------
/functions/package.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "name": "huddle-functions",
 3 |   "description": "Cloud Functions for Huddle",
 4 |   "dependencies": {
 5 |     "@google/generative-ai": "^0.1.3",
 6 |     "firebase-admin": "^12.0.0",
 7 |     "firebase-functions": "^5.0.0"
 8 |   },
 9 |   "main": "index.js",
10 |   "private": true
11 | }
12 | 


--------------------------------------------------------------------------------
/functions/send-reminders.js:
--------------------------------------------------------------------------------
  1 | const functions = require("firebase-functions");
  2 | const admin = require("firebase-admin");
  3 | 
  4 | // Get a reference to the Firestore database
  5 | const db = admin.firestore();
  6 | 
  7 | /**
  8 |  * Scheduled Firebase Cloud Function to send push notification reminders for upcoming events.
  9 |  * This function runs every 10 minutes.
 10 |  */
 11 | exports.sendEventReminders = functions.pubsub.schedule("every 10 minutes").onRun(async (context) => {
 12 |   console.log("Starting to check for upcoming events...");
 13 | 
 14 |   // Calculate the time window for events starting in the next 30-40 minutes
 15 |   const now = new Date();
 16 |   const startTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
 17 |   const endTime = new Date(now.getTime() + 40 * 60 * 1000); // 40 minutes from now
 18 | 
 19 |   const eventsRef = db.collection("events");
 20 | 
 21 |   try {
 22 |     // 1. Query for events within the upcoming time window
 23 |     const upcomingEventsSnapshot = await eventsRef
 24 |       .where("date", "==", startTime.toISOString().split("T")[0]) // Events happening today
 25 |       .get();
 26 | 
 27 |     if (upcomingEventsSnapshot.empty) {
 28 |       console.log("No events scheduled for today.");
 29 |       return null;
 30 |     }
 31 | 
 32 |     const reminderPromises = [];
 33 | 
 34 |     // 2. Iterate through each event and check if it's within the time window
 35 |     upcomingEventsSnapshot.forEach((doc) => {
 36 |       const event = doc.data();
 37 |       const eventTime = new Date(`${event.date}T${event.time}`);
 38 | 
 39 |       if (eventTime >= startTime && eventTime <= endTime) {
 40 |         console.log(`Found upcoming event: ${event.title}`);
 41 |         
 42 |         // 3. For each upcoming event, fetch the FCM tokens of all RSVP'd players
 43 |         const playerIds = event.players || [];
 44 |         if (playerIds.length === 0) {
 45 |           console.log(`No players to notify for event: ${event.title}`);
 46 |           return;
 47 |         }
 48 | 
 49 |         const tokensPromise = getFcmTokens(playerIds);
 50 |         reminderPromises.push(
 51 |           tokensPromise.then((tokens) => {
 52 |             if (tokens.length > 0) {
 53 |               // 4. Send the push notification
 54 |               return sendPushNotification(tokens, event);
 55 |             }
 56 |             return null;
 57 |           })
 58 |         );
 59 |       }
 60 |     });
 61 | 
 62 |     await Promise.all(reminderPromises);
 63 |     console.log("Finished sending event reminders.");
 64 |   } catch (error) {
 65 |     console.error("Error sending event reminders:", error);
 66 |   }
 67 |   return null;
 68 | });
 69 | 
 70 | /**
 71 |  * Fetches the FCM tokens for a given array of user IDs.
 72 |  * @param {string[]} userIds The user IDs to fetch tokens for.
 73 |  * @returns {Promise<string[]>} A promise that resolves with an array of FCM tokens.
 74 |  */
 75 | async function getFcmTokens(userIds) {
 76 |   const tokens = [];
 77 |   const userPromises = userIds.map((userId) => db.collection("users").doc(userId).get());
 78 | 
 79 |   const userDocs = await Promise.all(userPromises);
 80 | 
 81 |   userDocs.forEach((doc) => {
 82 |     if (doc.exists) {
 83 |       const userData = doc.data();
 84 |       if (userData.fcmTokens && userData.fcmTokens.length > 0) {
 85 |         tokens.push(...userData.fcmTokens);
 86 |       }
 87 |     }
 88 |   });
 89 |   return tokens;
 90 | }
 91 | 
 92 | /**
 93 |  * Sends a push notification to a given array of FCM tokens.
 94 |  * @param {string[]} tokens The FCM tokens to send the notification to.
 95 |  * @param {object} event The event data.
 96 |  */
 97 | async function sendPushNotification(tokens, event) {
 98 |   const payload = {
 99 |     notification: {
100 |       title: `Reminder: ${event.title}`,
101 |       body: `Your game is starting in 30 minutes at ${event.location}!`,
102 |       click_action: `/events/${event.id}`, // Deep link to the event page
103 |     },
104 |   };
105 | 
106 |   try {
107 |     console.log(`Sending notification to ${tokens.length} tokens.`);
108 |     await admin.messaging().sendToDevice(tokens, payload);
109 |   } catch (error) {
110 |     console.error("Error sending push notification:", error);
111 |   }
112 | }
113 | 


--------------------------------------------------------------------------------
/lib/auth-server.ts:
--------------------------------------------------------------------------------
 1 | // lib/auth-server.ts
 2 | // This file contains authentication logic that is ONLY safe to run on the server.
 3 | import "server-only"; // Ensures this module is never imported into a client component.
 4 | 
 5 | import { cookies } from "next/headers";
 6 | import { admin } from "./firebase-admin";
 7 | 
 8 | /**
 9 |  * getServerCurrentUser (Server-Side)
10 |  * Verifies the session cookie from the incoming request to securely identify the user.
11 |  * This is the correct way to handle authentication in Next.js API Routes and Server Components.
12 |  */
13 | export const getServerCurrentUser = async () => {
14 |   const sessionCookie = cookies().get("session")?.value;
15 |   if (!sessionCookie) return null;
16 | 
17 |   try {
18 |     // Use the Firebase Admin SDK to verify the cookie and get user details.
19 |     const decodedIdToken = await admin.auth().verifySessionCookie(sessionCookie, true);
20 |     return decodedIdToken;
21 |   } catch (error) {
22 |     console.error("Error verifying session cookie:", error);
23 |     return null;
24 |   }
25 | };
26 | 


--------------------------------------------------------------------------------
/lib/auth.ts:
--------------------------------------------------------------------------------
 1 | // lib/auth.ts
 2 | // This file contains authentication logic that is safe to run on the CLIENT-SIDE.
 3 | import {
 4 |   createUserWithEmailAndPassword,
 5 |   signInWithEmailAndPassword,
 6 |   signInWithPopup,
 7 |   GoogleAuthProvider,
 8 |   signOut,
 9 |   type User,
10 | } from "firebase/auth";
11 | import { auth } from "./firebase";
12 | import { createUser, getUser } from "./db";
13 | 
14 | const googleProvider = new GoogleAuthProvider();
15 | 
16 | // These functions are designed to be called only in the browser.
17 | 
18 | export const signUpWithEmail = async (email: string, password: string, name: string) => {
19 |   if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
20 |   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
21 |   const user = userCredential.user;
22 |   // Use the more specific createUser function from db.ts
23 |   await createUser(user.uid, { email: user.email!, name });
24 |   return { uid: user.uid, email: user.email!, name };
25 | };
26 | 
27 | export const signInWithEmail = async (email: string, password: string) => {
28 |     if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
29 |     const userCredential = await signInWithEmailAndPassword(auth, email, password);
30 |     return userCredential.user;
31 | };
32 | 
33 | // SOCIAL LOGIN: This is the new function for handling Google Sign-In.
34 | export const signInWithGoogle = async () => {
35 |   if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
36 |   
37 |   // 1. Trigger the Google Sign-In popup.
38 |   const result = await signInWithPopup(auth, googleProvider);
39 |   const user = result.user;
40 | 
41 |   // 2. Check if the user already exists in our Firestore 'users' collection.
42 |   const userProfile = await getUser(user.uid);
43 | 
44 |   // 3. If the user is new (no profile exists), create a new document for them.
45 |   if (!userProfile) {
46 |     await createUser(user.uid, {
47 |       email: user.email!,
48 |       name: user.displayName || user.email?.split('@')[0] || 'New User',
49 |       photoURL: user.photoURL || null,
50 |     });
51 |   }
52 | 
53 |   // 4. Return the user object for the application to use.
54 |   return user;
55 | };
56 | 
57 | 
58 | export const logOut = async () => {
59 |     if (!auth) throw new Error("Firebase Auth is not initialized on the client.");
60 |     await signOut(auth);
61 | };
62 | 


--------------------------------------------------------------------------------
/lib/db.ts:
--------------------------------------------------------------------------------
  1 | // lib/db.ts
  2 | import {
  3 |   doc,
  4 |   getDoc,
  5 |   setDoc,
  6 |   collection,
  7 |   query,
  8 |   where,
  9 |   getDocs,
 10 |   Timestamp,
 11 |   addDoc,
 12 |   orderBy,
 13 |   updateDoc,
 14 |   arrayUnion,
 15 |   arrayRemove,
 16 |   getCountFromServer,
 17 | } from "firebase/firestore"
 18 | import { db } from "./firebase"
 19 | import * as geofire from "geofire-common"
 20 | 
 21 | export { db };
 22 | 
 23 | export const getUser = async (userId: string) => {
 24 |   const userRef = doc(db, "users", userId);
 25 |   const userSnap = await getDoc(userRef);
 26 |   return userSnap.exists() ? userSnap.data() : null;
 27 | };
 28 | 
 29 | export const createUser = async (userId: string, data: any) => {
 30 |   const userRef = doc(db, "users", userId);
 31 |   await setDoc(userRef, { ...data, createdAt: Timestamp.now() });
 32 | };
 33 | 
 34 | export const createEvent = async (eventData: any) => {
 35 |   try {
 36 |     const eventsCol = collection(db, "events")
 37 |     const newEventRef = await addDoc(eventsCol, {
 38 |       ...eventData,
 39 |       createdAt: Timestamp.now(),
 40 |     })
 41 |     return { id: newEventRef.id, ...eventData }
 42 |   } catch (error) {
 43 |     console.error("Error creating event in Firestore:", error)
 44 |     throw new Error("Failed to save event to the database.")
 45 |   }
 46 | }
 47 | 
 48 | export const getEvents = async () => {
 49 |   try {
 50 |     const eventsCol = collection(db, "events")
 51 |     const eventSnapshot = await getDocs(eventsCol)
 52 |     return eventSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
 53 |   } catch (error) {
 54 |     console.error("Error fetching events from Firestore:", error)
 55 |     throw new Error("Failed to retrieve events from the database.")
 56 |   }
 57 | }
 58 | 
 59 | export const getNearbyEvents = async (center: [number, number], radiusInM: number) => {
 60 |   try {
 61 |     const bounds = geofire.geohashQueryBounds(center, radiusInM)
 62 |     const promises = []
 63 | 
 64 |     for (const b of bounds) {
 65 |       const q = query(
 66 |         collection(db, "events"),
 67 |         orderBy("geohash"),
 68 |         where("geohash", ">=", b[0]),
 69 |         where("geohash", "<=", b[1]),
 70 |       )
 71 |       promises.push(getDocs(q))
 72 |     }
 73 | 
 74 |     const snapshots = await Promise.all(promises)
 75 |     const matchingDocs = []
 76 | 
 77 |     for (const snap of snapshots) {
 78 |       for (const doc of snap.docs) {
 79 |         const lat = doc.get("geopoint").latitude
 80 |         const lng = doc.get("geopoint").longitude
 81 | 
 82 |         const distanceInKm = geofire.distanceBetween([lat, lng], center)
 83 |         const distanceInM = distanceInKm * 1000
 84 |         if (distanceInM <= radiusInM) {
 85 |           matchingDocs.push({ id: doc.id, ...doc.data() })
 86 |         }
 87 |       }
 88 |     }
 89 |     return matchingDocs
 90 |   } catch (error) {
 91 |     console.error("Error fetching nearby events:", error)
 92 |     throw new Error("Failed to query nearby events.")
 93 |   }
 94 | }
 95 | 
 96 | export const saveFcmToken = async (userId: string, token: string) => {
 97 |   if (!userId || !token) return
 98 | 
 99 |   try {
100 |     const userRef = doc(db, "users", userId)
101 |     await updateDoc(userRef, {
102 |       fcmTokens: arrayUnion(token),
103 |     })
104 |     console.log(`FCM token saved for user: ${userId}`)
105 |   } catch (error) {
106 |     // Check if the document exists, if not create it
107 |     if ((error as any).code === 'not-found') {
108 |         await setDoc(doc(db, "users", userId), { fcmTokens: [token] }, { merge: true });
109 |         console.log(`FCM token saved for new user: ${userId}`)
110 |     } else {
111 |         console.error("Error saving FCM token:", error)
112 |     }
113 |   }
114 | }
115 | 
116 | // ... (existing functions)
117 | 
118 | export const getUserOrganizedEvents = async (userId: string) => {
119 |   if (!userId) return []
120 |   try {
121 |     const eventsRef = collection(db, "events")
122 |     const q = query(eventsRef, where("createdBy", "==", userId))
123 |     const querySnapshot = await getDocs(q)
124 |     return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
125 |   } catch (error) {
126 |     console.error("Error fetching organized events:", error)
127 |     throw new Error("Failed to fetch organized events.")
128 |   }
129 | }
130 | 
131 | export const getUserJoinedEvents = async (userId: string) => {
132 |   if (!userId) return []
133 |   try {
134 |     const eventsRef = collection(db, "events")
135 |     const q = query(eventsRef, where("players", "array-contains", userId))
136 |     const querySnapshot = await getDocs(q)
137 |     return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
138 |   } catch (error) {
139 |     console.error("Error fetching joined events:", error)
140 |     throw new Error("Failed to fetch joined events.")
141 |   }
142 | }
143 | 
144 | export const getEventCountsForUser = async (userId: string) => {
145 |     if (!userId) return { organized: 0, joined: 0, upcoming: 0 };
146 |     try {
147 |         const eventsRef = collection(db, "events");
148 |         const today = new Date().toISOString().split('T')[0];
149 | 
150 |         const organizedQuery = query(eventsRef, where("createdBy", "==", userId));
151 |         const joinedQuery = query(eventsRef, where("players", "array-contains", userId));
152 |         const upcomingQuery = query(eventsRef, 
153 |             where("players", "array-contains", userId),
154 |             where("date", ">=", today)
155 |         );
156 | 
157 |         const [organizedSnap, joinedSnap, upcomingSnap] = await Promise.all([
158 |             getCountFromServer(organizedQuery),
159 |             getCountFromServer(joinedQuery),
160 |             getCountFromServer(upcomingQuery)
161 |         ]);
162 |         
163 |         return {
164 |             organized: organizedSnap.data().count,
165 |             joined: joinedSnap.data().count,
166 |             upcoming: upcomingSnap.data().count
167 |         };
168 |     } catch (error) {
169 |         console.error("Error fetching event counts for user:", error);
170 |         return { organized: 0, joined: 0, upcoming: 0 };
171 |     }
172 | };
173 | 
174 | // ... (rest of the file)
175 | 


--------------------------------------------------------------------------------
/lib/fallback-db.ts:
--------------------------------------------------------------------------------
 1 | // Fallback in-memory database for when Firebase isn't configured
 2 | const users: any[] = []
 3 | const events: any[] = []
 4 | let userIdCounter = 1
 5 | let eventIdCounter = 1
 6 | 
 7 | export const fallbackCreateUser = async (userData: { email: string; name: string; password: string }) => {
 8 |   const existingUser = users.find((user) => user.email === userData.email)
 9 |   if (existingUser) {
10 |     throw new Error("User already exists")
11 |   }
12 | 
13 |   const newUser = {
14 |     id: userIdCounter++,
15 |     uid: `user_${userIdCounter}`,
16 |     ...userData,
17 |     createdAt: new Date().toISOString(),
18 |   }
19 | 
20 |   users.push(newUser)
21 |   return newUser
22 | }
23 | 
24 | export const fallbackSignIn = async (email: string, password: string) => {
25 |   const user = users.find((u) => u.email === email && u.password === password)
26 |   if (!user) {
27 |     throw new Error("Invalid credentials")
28 |   }
29 |   return user
30 | }
31 | 
32 | export const fallbackGetUser = async (uid: string) => {
33 |   return users.find((user) => user.uid === uid) || null
34 | }
35 | 
36 | export const fallbackCreateEvent = async (eventData: any) => {
37 |   const newEvent = {
38 |     id: eventIdCounter++,
39 |     ...eventData,
40 |     currentPlayers: 1,
41 |     players: [eventData.createdBy],
42 |     createdAt: new Date().toISOString(),
43 |   }
44 | 
45 |   events.push(newEvent)
46 |   return newEvent
47 | }
48 | 
49 | export const fallbackGetAllEvents = async () => {
50 |   return events
51 | }
52 | 
53 | export const fallbackGetEvent = async (eventId: string) => {
54 |   return events.find((event) => event.id === Number.parseInt(eventId)) || null
55 | }
56 | 
57 | export const fallbackJoinEvent = async (eventId: string, userId: string) => {
58 |   const event = events.find((e) => e.id === Number.parseInt(eventId))
59 |   if (!event) throw new Error("Event not found")
60 | 
61 |   if (!event.players.includes(userId)) {
62 |     event.players.push(userId)
63 |     event.currentPlayers++
64 |   }
65 | 
66 |   return event
67 | }
68 | 
69 | export const fallbackLeaveEvent = async (eventId: string, userId: string) => {
70 |   const event = events.find((e) => e.id === Number.parseInt(eventId))
71 |   if (!event) throw new Error("Event not found")
72 | 
73 |   event.players = event.players.filter((id: string) => id !== userId)
74 |   event.currentPlayers--
75 | 
76 |   return event
77 | }
78 | 


--------------------------------------------------------------------------------
/lib/firebase-admin.ts:
--------------------------------------------------------------------------------
 1 | // lib/firebase-admin.ts
 2 | import * as admin from "firebase-admin";
 3 | 
 4 | // This file is for SERVER-SIDE use only. It uses the Admin SDK.
 5 | 
 6 | // Securely parse the service account key from environment variables.
 7 | // This prevents sensitive credentials from being hardcoded in the source code.
 8 | const serviceAccount: admin.ServiceAccount = {
 9 |   projectId: process.env.FIREBASE_PROJECT_ID,
10 |   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Replaces escaped newlines
11 |   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
12 | };
13 | 
14 | // Check if the admin app has already been initialized to prevent errors.
15 | if (!admin.apps.length) {
16 |   try {
17 |     admin.initializeApp({
18 |       credential: admin.credential.cert(serviceAccount),
19 |     });
20 |     console.log("Firebase Admin SDK initialized successfully.");
21 |   } catch (error: any) {
22 |     // Provide a more helpful error message if initialization fails.
23 |     console.error("Firebase Admin initialization error:", `[${error.code}] ${error.message}`);
24 |   }
25 | }
26 | 
27 | // Export the initialized admin instance for use in other server-side files.
28 | export { admin };
29 | 


--------------------------------------------------------------------------------
/lib/firebase-context.tsx:
--------------------------------------------------------------------------------
 1 | "use client"
 2 | 
 3 | import type React from "react"
 4 | import { createContext, useContext, useEffect, useState, useCallback } from "react"
 5 | import { type User, onAuthStateChanged, signOut } from "firebase/auth"
 6 | import { auth, app } from "./firebase"
 7 | import { FirebaseApp } from "firebase/app"
 8 | 
 9 | interface FirebaseContextType {
10 |   user: User | null
11 |   loading: boolean
12 |   error: string | null
13 |   logout: () => Promise<void>;
14 |   app: FirebaseApp | null;
15 | }
16 | 
17 | const FirebaseContext = createContext<FirebaseContextType>({
18 |   user: null,
19 |   loading: true,
20 |   error: null,
21 |   logout: async () => {},
22 |   app: null
23 | })
24 | 
25 | export const useFirebase = () => {
26 |   const context = useContext(FirebaseContext)
27 |   if (!context) {
28 |     throw new Error("useFirebase must be used within a FirebaseProvider")
29 |   }
30 |   return context
31 | }
32 | 
33 | // Alias for useAuth (backward compatibility)
34 | export const useAuth = useFirebase
35 | 
36 | export function FirebaseProvider({ children }: { children: React.ReactNode }) {
37 |   const [user, setUser] = useState<User | null>(null)
38 |   const [loading, setLoading] = useState(true)
39 |   const [error, setError] = useState<string | null>(null)
40 | 
41 |   // Define the logout function
42 |   const logout = useCallback(async () => {
43 |     // FIX: Ensure auth object is not null before using it.
44 |     if (auth) {
45 |       try {
46 |         await signOut(auth);
47 |         setUser(null);
48 |       } catch (error) {
49 |         console.error("Error signing out:", error);
50 |       }
51 |     }
52 |   }, []);
53 | 
54 |   useEffect(() => {
55 |     // FIX: Ensure auth object is not null before setting up the listener.
56 |     if (auth) {
57 |       const unsubscribe = onAuthStateChanged(
58 |         auth,
59 |         (user) => {
60 |           setUser(user)
61 |           setLoading(false)
62 |           setError(null)
63 |         },
64 |         (error) => {
65 |           console.error("Auth state change error:", error)
66 |           setError("Authentication error occurred")
67 |           setLoading(false)
68 |         },
69 |       );
70 | 
71 |       return () => unsubscribe();
72 |     } else {
73 |       // If auth is not available, stop loading and do nothing.
74 |       setLoading(false);
75 |     }
76 |   }, []);
77 | 
78 |   return <FirebaseContext.Provider value={{ user, loading, error, logout, app }}>{children}</FirebaseContext.Provider>
79 | }
80 | 


--------------------------------------------------------------------------------
/lib/firebase-env.ts:
--------------------------------------------------------------------------------
 1 | import { initializeApp } from "firebase/app"
 2 | import { getAuth } from "firebase/auth"
 3 | import { getFirestore } from "firebase/firestore"
 4 | 
 5 | const firebaseConfig = {
 6 |   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
 7 |   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
 8 |   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
 9 |   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
10 |   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
11 |   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
12 | }
13 | 
14 | // Validate that all required config values are present
15 | const requiredConfig = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
16 | 
17 | const missingConfig = requiredConfig.filter((key) => !firebaseConfig[key as keyof typeof firebaseConfig])
18 | 
19 | if (missingConfig.length > 0) {
20 |   throw new Error(`Missing Firebase configuration: ${missingConfig.join(", ")}`)
21 | }
22 | 
23 | // 1. Initialize the Firebase app first
24 | const app = initializeApp(firebaseConfig)
25 | 
26 | // 2. Then, get the services from that initialized app
27 | export const auth = getAuth(app)
28 | export const db = getFirestore(app)
29 | 
30 | export default app
31 | 


--------------------------------------------------------------------------------
/lib/firebase-messaging.ts:
--------------------------------------------------------------------------------
 1 | // lib/firebase-messaging.ts
 2 | import { getMessaging, getToken } from "firebase/messaging";
 3 | import { app } from "./firebase"; // Assuming 'app' is your initialized Firebase app instance
 4 | 
 5 | /**
 6 |  * Requests permission from the user to send push notifications.
 7 |  * @returns {Promise<string | null>} The FCM token if permission is granted, otherwise null.
 8 |  */
 9 | export const requestNotificationPermission = async (): Promise<string | null> => {
10 |   // Ensure we are in a browser environment before proceeding.
11 |   if (typeof window === "undefined") {
12 |     return null;
13 |   }
14 | 
15 |   try {
16 |     const messaging = getMessaging(app);
17 |     const permission = await Notification.requestPermission();
18 | 
19 |     if (permission === "granted") {
20 |       console.log("Notification permission granted.");
21 |       // Retrieve the FCM token. The VAPID key is automatically sourced from your Firebase config.
22 |       const fcmToken = await getToken(messaging, {
23 |         vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY, // Add your VAPID key to .env.local
24 |       });
25 |       return fcmToken;
26 |     } else {
27 |       console.log("Unable to get permission to notify.");
28 |       return null;
29 |     }
30 |   } catch (error) {
31 |     console.error("An error occurred while retrieving the token.", error);
32 |     return null;
33 |   }
34 | };
35 | 


--------------------------------------------------------------------------------
/lib/firebase.ts:
--------------------------------------------------------------------------------
 1 | 
 2 | import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
 3 | import { getAuth, type Auth } from "firebase/auth";
 4 | import { getFirestore, type Firestore, doc, getDoc } from "firebase/firestore";
 5 | 
 6 | // Your Firebase config object, pulled from environment variables.
 7 | const firebaseConfig = {
 8 |   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
 9 |   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
10 |   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
11 |   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
12 |   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
13 |   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
14 | };
15 | 
16 | // Validate that all required config values are present.
17 | // This will throw a clear error during the build if a variable is missing.
18 | const requiredConfig = Object.keys(firebaseConfig);
19 | const missingConfig = requiredConfig.filter(
20 |   (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
21 | );
22 | 
23 | if (missingConfig.length > 0) {
24 |   throw new Error(
25 |     `Missing Firebase configuration variables: ${missingConfig.join(
26 |       ", "
27 |     )}. Please check your Vercel environment variables.`
28 |   );
29 | }
30 | 
31 | // Initialize Firebase App (Singleton Pattern)
32 | // This prevents re-initialization on hot-reloads in development.
33 | const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
34 | 
35 | // Initialize and export Firebase services.
36 | // By passing the 'app' object, we ensure they are always linked to the correct instance.
37 | const auth: Auth = getAuth(app);
38 | const db: Firestore = getFirestore(app);
39 | 
40 | export { app, auth, db };
41 | 
42 | export const checkFirebaseHealth = async () => {
43 |   const health = {
44 |     app: true,
45 |     auth: true,
46 |     db: true,
47 |     error: null,
48 |     timestamp: new Date().toISOString(),
49 |   };
50 | 
51 |   try {
52 |     // 1. App Health (already initialized, so if we're here, it's ok)
53 |     health.app = !!getApp();
54 | 
55 |     // 2. Auth Health (check if we can get a user, even if null)
56 |     try {
57 |       getAuth(app);
58 |     } catch (e) {
59 |       health.auth = false;
60 |       throw new Error("Auth service failed to initialize.");
61 |     }
62 | 
63 |     // 3. Firestore Health (try a simple read)
64 |     try {
65 |       await getDoc(doc(db, "health_check", "test"));
66 |     } catch (e: any) {
67 |       // Allow "permission-denied" as it means the service is running
68 |       if (e.code !== 'permission-denied') {
69 |         health.db = false;
70 |         throw new Error(`Firestore read failed: ${e.message}`);
71 |       }
72 |     }
73 | 
74 |   } catch (error: any) {
75 |     console.error("Firebase Health Check Failed:", error);
76 |     health.error = error.message;
77 |   }
78 | 
79 |   return health;
80 | };
81 | 
82 | export const debugFirebaseConfig = () => {
83 |   console.groupCollapsed("Firebase Config Debug");
84 |   console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
85 |   console.log("Auth Domain:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
86 |   console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Loaded" : "MISSING!");
87 |   console.groupEnd();
88 | };
89 | 


--------------------------------------------------------------------------------
/lib/map-styles.ts:
--------------------------------------------------------------------------------
 1 | export const mapStyles = [
 2 |   { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
 3 |   { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
 4 |   { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
 5 |   {
 6 |     featureType: "administrative.locality",
 7 |     elementType: "labels.text.fill",
 8 |     stylers: [{ color: "#d59563" }],
 9 |   },
10 |   {
11 |     featureType: "poi",
12 |     elementType: "labels.text.fill",
13 |     stylers: [{ color: "#d59563" }],
14 |   },
15 |   {
16 |     featureType: "poi.park",
17 |     elementType: "geometry",
18 |     stylers: [{ color: "#263c3f" }],
19 |   },
20 |   {
21 |     featureType: "poi.park",
22 |     elementType: "labels.text.fill",
23 |     stylers: [{ color: "#6b9a76" }],
24 |   },
25 |   {
26 |     featureType: "road",
27 |     elementType: "geometry",
28 |     stylers: [{ color: "#38414e" }],
29 |   },
30 |   {
31 |     featureType: "road",
32 |     elementType: "geometry.stroke",
33 |     stylers: [{ color: "#212a37" }],
34 |   },
35 |   {
36 |     featureType: "road",
37 |     elementType: "labels.text.fill",
38 |     stylers: [{ color: "#9ca5b3" }],
39 |   },
40 |   {
41 |     featureType: "road.highway",
42 |     elementType: "geometry",
43 |     stylers: [{ color: "#746855" }],
44 |   },
45 |   {
46 |     featureType: "road.highway",
47 |     elementType: "geometry.stroke",
48 |     stylers: [{ color: "#1f2835" }],
49 |   },
50 |   {
51 |     featureType: "road.highway",
52 |     elementType: "labels.text.fill",
53 |     stylers: [{ color: "#f3d19c" }],
54 |   },
55 |   {
56 |     featureType: "transit",
57 |     elementType: "geometry",
58 |     stylers: [{ color: "#2f3948" }],
59 |   },
60 |   {
61 |     featureType: "transit.station",
62 |     elementType: "labels.text.fill",
63 |     stylers: [{ color: "#d59563" }],
64 |   },
65 |   {
66 |     featureType: "water",
67 |     elementType: "geometry",
68 |     stylers: [{ color: "#17263c" }],
69 |   },
70 |   {
71 |     featureType: "water",
72 |     elementType: "labels.text.fill",
73 |     stylers: [{ color: "#515c6d" }],
74 |   },
75 |   {
76 |     featureType: "water",
77 |     elementType: "labels.text.stroke",
78 |     stylers: [{ color: "#17263c" }],
79 |   },
80 | ];
81 | 


--------------------------------------------------------------------------------
/lib/maps-config.ts:
--------------------------------------------------------------------------------
 1 | "use server"
 2 | 
 3 | export async function getGoogleMapsConfig() {
 4 |   const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
 5 | 
 6 |   if (!apiKey) {
 7 |     throw new Error(
 8 |       "Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.",
 9 |     )
10 |   }
11 | 
12 |   if (apiKey.length < 10) {
13 |     throw new Error("Invalid Google Maps API key format")
14 |   }
15 | 
16 |   return {
17 |     apiKey,
18 |     mapId: "huddle-map",
19 |     libraries: ["places", "geometry"] as const,
20 |     region: "US",
21 |     language: "en",
22 |   }
23 | }
24 | 
25 | export function validateApiKey(apiKey: string): boolean {
26 |   return apiKey && apiKey.startsWith("AIza") && apiKey.length === 39
27 | }
28 | 


--------------------------------------------------------------------------------
/lib/maps-debug.ts:
--------------------------------------------------------------------------------
  1 | // Maps API debugging utilities for troubleshooting ApiProjectMapError
  2 | 
  3 | export interface MapsApiValidationResult {
  4 |   isValid: boolean
  5 |   errors: string[]
  6 |   warnings: string[]
  7 |   apiKey: {
  8 |     present: boolean
  9 |     format: string
 10 |     masked: string
 11 |   }
 12 |   mapId: {
 13 |     present: boolean
 14 |     value: string
 15 |   }
 16 | }
 17 | 
 18 | export class MapsApiValidator {
 19 |   private static instance: MapsApiValidator
 20 |   private validationCache: Map<string, MapsApiValidationResult> = new Map()
 21 | 
 22 |   static getInstance(): MapsApiValidator {
 23 |     if (!MapsApiValidator.instance) {
 24 |       MapsApiValidator.instance = new MapsApiValidator()
 25 |     }
 26 |     return MapsApiValidator.instance
 27 |   }
 28 | 
 29 |   validateApiKey(apiKey: string | undefined): MapsApiValidationResult {
 30 |     const cacheKey = `apikey_${apiKey || "undefined"}`
 31 | 
 32 |     if (this.validationCache.has(cacheKey)) {
 33 |       return this.validationCache.get(cacheKey)!
 34 |     }
 35 | 
 36 |     const result: MapsApiValidationResult = {
 37 |       isValid: true,
 38 |       errors: [],
 39 |       warnings: [],
 40 |       apiKey: {
 41 |         present: !!apiKey,
 42 |         format: "unknown",
 43 |         masked: this.maskApiKey(apiKey),
 44 |       },
 45 |       mapId: {
 46 |         present: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
 47 |         value: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "not-set",
 48 |       },
 49 |     }
 50 | 
 51 |     // API Key validation
 52 |     if (!apiKey) {
 53 |       result.isValid = false
 54 |       result.errors.push("API key is missing")
 55 |       result.apiKey.format = "missing"
 56 |     } else if (apiKey === "undefined" || apiKey === "null") {
 57 |       result.isValid = false
 58 |       result.errors.push("API key is not properly set")
 59 |       result.apiKey.format = "invalid"
 60 |     } else if (apiKey.startsWith("your-") || apiKey.includes("placeholder")) {
 61 |       result.isValid = false
 62 |       result.errors.push("API key is still a placeholder")
 63 |       result.apiKey.format = "placeholder"
 64 |     } else if (!apiKey.startsWith("AIza")) {
 65 |       result.isValid = false
 66 |       result.errors.push("API key format is invalid (should start with AIza)")
 67 |       result.apiKey.format = "invalid-format"
 68 |     } else if (apiKey.length !== 39) {
 69 |       result.isValid = false
 70 |       result.errors.push(`API key length is invalid (${apiKey.length}, should be 39)`)
 71 |       result.apiKey.format = "invalid-length"
 72 |     } else {
 73 |       result.apiKey.format = "valid"
 74 |     }
 75 | 
 76 |     // Map ID validation
 77 |     if (!result.mapId.present) {
 78 |       result.warnings.push("Map ID not provided - Advanced Markers may not work")
 79 |     } else if (result.mapId.value.startsWith("your-") || result.mapId.value.includes("placeholder")) {
 80 |       result.warnings.push("Map ID appears to be a placeholder")
 81 |     }
 82 | 
 83 |     this.validationCache.set(cacheKey, result)
 84 |     return result
 85 |   }
 86 | 
 87 |   private maskApiKey(apiKey: string | undefined): string {
 88 |     if (!apiKey) return "not-provided"
 89 |     if (apiKey.length < 8) return "too-short"
 90 |     return `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
 91 |   }
 92 | 
 93 |   async testApiKeyDirectly(apiKey: string): Promise<{ success: boolean; error?: string }> {
 94 |     try {
 95 |       // Test with a simple Geocoding API call
 96 |       const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${apiKey}`
 97 | 
 98 |       const response = await fetch(testUrl)
 99 |       const data = await response.json()
100 | 
101 |       if (data.status === "OK") {
102 |         return { success: true }
103 |       } else if (data.status === "REQUEST_DENIED") {
104 |         return { success: false, error: `API key denied: ${data.error_message || "Unknown reason"}` }
105 |       } else if (data.status === "OVER_QUERY_LIMIT") {
106 |         return { success: false, error: "API quota exceeded" }
107 |       } else {
108 |         return { success: false, error: `API error: ${data.status}` }
109 |       }
110 |     } catch (error) {
111 |       return { success: false, error: `Network error: ${error}` }
112 |     }
113 |   }
114 | 
115 |   generateCacheBustingUrl(baseUrl: string): string {
116 |     const timestamp = Date.now()
117 |     const separator = baseUrl.includes("?") ? "&" : "?"
118 |     return `${baseUrl}${separator}_cb=${timestamp}`
119 |   }
120 | 
121 |   logMapsApiStatus(apiKey: string | undefined, mapId: string | undefined) {
122 |     console.group("🗺️ Google Maps API Status")
123 | 
124 |     const validation = this.validateApiKey(apiKey)
125 | 
126 |     console.log("API Key:", validation.apiKey.masked)
127 |     console.log("API Key Format:", validation.apiKey.format)
128 |     console.log("Map ID:", mapId || "not-provided")
129 |     console.log("Validation Status:", validation.isValid ? "✅ Valid" : "❌ Invalid")
130 | 
131 |     if (validation.errors.length > 0) {
132 |       console.error("Errors:", validation.errors)
133 |     }
134 | 
135 |     if (validation.warnings.length > 0) {
136 |       console.warn("Warnings:", validation.warnings)
137 |     }
138 | 
139 |     console.groupEnd()
140 |   }
141 | }
142 | 
143 | export const mapsValidator = MapsApiValidator.getInstance()
144 | 


--------------------------------------------------------------------------------
/lib/recaptcha.ts:
--------------------------------------------------------------------------------
 1 | // lib/recaptcha.ts
 2 | import axios from 'axios';
 3 | 
 4 | export async function verifyRecaptcha(token: string) {
 5 |   const secretKey = process.env.RECAPTCHA_SECRET_KEY;
 6 |   if (!secretKey) {
 7 |     console.error("RECAPTCHA_SECRET_KEY is not set");
 8 |     return { success: false, message: "Server configuration error." };
 9 |   }
10 | 
11 |   try {
12 |     const response = await axios.post(
13 |       `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
14 |     );
15 |     return response.data;
16 |   } catch (error) {
17 |     console.error("reCAPTCHA verification request failed:", error);
18 |     return { success: false, message: "Could not verify reCAPTCHA." };
19 |   }
20 | }
21 | 


--------------------------------------------------------------------------------
/lib/types.ts:
--------------------------------------------------------------------------------
 1 | export interface Player {
 2 |   id: string;
 3 |   displayName: string;
 4 |   photoURL?: string;
 5 | }
 6 | 
 7 | export interface GameEvent {
 8 |   id: string;
 9 |   title: string;
10 |   sport: string;
11 |   location: any;
12 |   latitude: number;
13 |   longitude: number;
14 |   date: string;
15 |   time: string;
16 |   maxPlayers: number;
17 |   currentPlayers: number;
18 |   createdBy: string;
19 |   organizerName: string;
20 |   organizerPhotoURL?: string;
21 |   players: string[];
22 |   playerDetails?: Player[];
23 |   checkedInPlayers?: string[];
24 |   distance?: number;
25 |   isBoosted?: boolean;
26 | }
27 | 


--------------------------------------------------------------------------------
/lib/utils.ts:
--------------------------------------------------------------------------------
1 | import { clsx, type ClassValue } from "clsx"
2 | import { twMerge } from "tailwind-merge"
3 | 
4 | export function cn(...inputs: ClassValue[]) {
5 |   return twMerge(clsx(inputs))
6 | }
7 | 


--------------------------------------------------------------------------------
/my folder/README copy.md:
--------------------------------------------------------------------------------
 1 | # Rork AI prompt
 2 | 
 3 | *Automatically synced with your [v0.app](https://v0.app) deployments*
 4 | 
 5 | [![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/balakrishnanair24-2934s-projects/v0-rork-ai-prompt)
 6 | [![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/fV40NUXiq1l)
 7 | 
 8 | ## Overview
 9 | 
10 | This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
11 | Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).
12 | 
13 | ## Deployment
14 | 
15 | Your project is live at:
16 | 
17 | **[https://vercel.com/balakrishnanair24-2934s-projects/v0-rork-ai-prompt](https://vercel.com/balakrishnanair24-2934s-projects/v0-rork-ai-prompt)**
18 | 
19 | ## Build your app
20 | 
21 | Continue building your app on:
22 | 
23 | **[https://v0.app/chat/projects/fV40NUXiq1l](https://v0.app/chat/projects/fV40NUXiq1l)**
24 | 
25 | ## How It Works
26 | 
27 | 1. Create and modify your project using [v0.dev](https://v0.dev)
28 | 2. Deploy your chats from the v0 interface
29 | 3. Changes are automatically pushed to this repository
30 | 4. Vercel deploys the latest version from this repository
31 | 


--------------------------------------------------------------------------------
/my folder/daily updates.txt:
--------------------------------------------------------------------------------
  1 | August 16th 
  2 | 
  3 | lib/db.ts` for fetching user events and sending/getting chat messages.
  4 |   - Created `components/chat-list.tsx` to display a list of user's events as chats.
  5 |   - Built the main `components/chat-page.tsx` to fetch user events, display the chat list, and manage selected chat state.
  6 |   - Updated `components/event-chat.tsx` to handle sending new messages and integrate with the chat page.
  7 |   - Implemented the backend API route `app/api/events/[id]/chat/route.ts` for sending messages securely.
  8 | - Refactored the profile page (`app/profile/page.tsx`):
  9 |   - Created a reusable `components/profile/event-list.tsx` component for displaying lists of events.
 10 |   - Implemented a tabbed layout ("Organized" and "Joined") using the new `EventList` component for better organization.
 11 | - Redesigned the events page (`components/events-page.tsx`):
 12 |   - Created a new, visually rich `components/events/event-card.tsx` component for displaying individual events.
 13 |   - Designed and implemented a `components/events/summary-header.tsx` to provide quick statistics (Total, Today, Your Upcoming).
 14 |   - Refactored the main events page to use the `SummaryHeader`, a responsive grid of `EventCard
 15 | 
 16 | 
 17 | - Implemented push notification feature:
 18 |   - Added frontend logic to request notification permission and get FCM token.
 19 |   - Created a new file (`lib/notifications.ts`) for FCM logic.
 20 |   - Modified `lib/db.ts` to save FCM tokens to user documents.
 21 |   - Integrated notification permission request into `app/layout.tsx` using a new component (`components/notification-permission-handler.tsx`).
 22 |   - Set up backend Cloud Functions directory and basic files manually (`functions/package.json`, `functions/index.js`) for scheduled notification logic (requires manual Firebase login and deployment).
 23 | - Enhanced events page (`components/events-page.tsx`):
 24 |   - Added client-side filtering and search.
 25 |   - Implemented a text input search bar, sport type filter, and date picker (using shadcn/ui components).
 26 |   - Updated filtering logic to filter events based on title, sport type, and selected date.
 27 | 
 28 | 
 29 | August 17th
 30 | 
 31 | - Resolved dependency conflicts (React 19) and fixed invalid packages.
 32 | - Set up development server by renaming `env.local` to `.env.local`.
 33 | - Created missing `components/ui/avatar.tsx` component.
 34 | - Fixed missing exports in `lib/db.ts`, `lib/firebase-context.tsx`, `components/chat-page.tsx`, and `components/event-chat.tsx`.
 35 | - Updated component import statements to match default/named exports.
 36 | 
 37 | logout` function to `FirebaseContextType` and implemented it using `signOut` from Firebase.
 38 |   - Imported the `Badge` component from `@/components/ui/badge` in `app/profile/page.tsx`.
 39 |   - Removed erroneous HTML tags (`<strong>`) from a comparison in `components/chat-page.tsx`.
 40 |   - Added null checks for the `auth` object in `lib/firebase-context.tsx` before using Firebase auth functions (`signOut`, `onAuthStateChanged`) to address TypeScript errors related to `Auth | null`.
 41 | - Continued refactoring and redesigning UI components:
 42 |   - Redesigned `components/chat-page.tsx` to match the "glassmorphism" aesthetic, improving layout and loading states.
 43 |   - Redesigned `app/profile/page.tsx` based on provided design reference, organizing content into distinct sections (header, stats, achievements, recent events, quick actions) using `glass-card
 44 | 
 45 | 
 46 | August 17th
 47 | 
 48 | - Completely redesigned the Profile Page (`app/profile/page.tsx`) to match the new "glassmorphism" design using `liquid-gradient` and `glass-card` components, while preserving all original functionality (stats, achievements, events, quick actions).
 49 | - Fixed a TypeScript error in `components/ui/calendar.tsx` by updating the `react-day-picker` component to use the correct `Chevron` component API for navigation icons (v8+).
 50 | - Overhauled the Create Event Modal (`components/create-event-modal.tsx`):
 51 |   - Fixed centering and scrolling issues using Flexbox and `ScrollArea`.
 52 |   - Added a dedicated time input field.
 53 |   - Applied consistent "glassmorphism" styling.
 54 | - Resolved a radix-ui error in `components/create-event-modal.tsx` by removing an invalid `<SelectItem value="">` and using the `<SelectValue placeholder="...">` prop correctly.
 55 | - Implemented a permanent architectural fix for authentication:
 56 |   - Created `lib/firebase-admin.ts` to securely initialize the Firebase Admin SDK for server-side use.
 57 |   - Refactored `lib/auth.ts` to separate client-side (`getCurrentUser`) and server-side (`getServerCurrentUser`) authentication logic.
 58 |   - Updated the Events API route (`app/api/events/route.ts`) to use the correct server-side `getServerCurrentUser` function, resolving the 401 Unauthorized error.
 59 |   - Further refactored auth by creating a dedicated `lib/auth-server.ts` file for server-only logic, importing `cookies` and `firebase-admin`, and ensuring `lib/auth.ts` is purely client-side compatible, fixing the "next/headers" build error.
 60 | 
 61 | 
 62 | August 26th :
 63 | 
 64 | Implemented several map optimizations:
 65 |   - Used client-side caching for event lists displayed on the map.
 66 |   - Optimized map queries by fetching events only within the current viewport.
 67 |   - Memoized map marker components to prevent unnecessary re-renders.
 68 |   - Configured the map to use a vector map with Map ID styling for better visual clarity and performance.
 69 | 
 70 | 
 71 | geofire-common` for geohash calculations.
 72 |   - Modified POST /api/events to add geohash and GeoPoint during event creation.
 73 |   - Created `createEvent` function in `lib/db.ts`.
 74 |   - Created new GET /api/events/nearby endpoint for radius-based event fetching.
 75 |   - Updated the Discover Events page to use /api/events/nearby for efficient, localized data fetching.
 76 |   - Implemented client-side filtering (search, sport, date, time of day, availability) on the fetched nearby events for instant results.
 77 |   - Established clear state management for `allNearbyEvents` and `filteredEvents` on the Discover page.
 78 | - Optimized event display by denormalizing data:
 79 |   - Modified the POST /api/events endpoint to embed `organizerName` and `organizerPhotoURL` into new event documents.
 80 |   - Updated `EventCard` and `EventCardSkeleton` components to display organizer info directly from the event object.
 81 | - Overhauled the Create Event modal location input:
 82 |   - Replaced static input with an interactive map (defaults to user location).
 83 |   - Added a draggable marker to pinpoint event location.
 84 |   - Integrated Google Places Autocomplete API for location search above the map.
 85 |   - Synced search selection to update form input, re-center map, and move marker.
 86 | - Implemented location permission fallback:
 87 |   - Created `ManualLocationSearch` component for denied permission states.
 88 |   - Updated `EventsPage` to conditionally render `ManualLocationSearch` if `locationAccessDenied`.
 89 |   - Added manual search functionality in fallback to geocode and fetch nearby events.
 90 | - Implemented Google Sign-In:
 91 |   - Added `signInWithGoogle` function to `lib/auth.ts` using `signInWithPopup`.
 92 |   - Added Firestore user creation logic within `signInWithGoogle` for new users.
 93 |   - Added "Continue with Google" button to `AuthScreen`.
 94 |   - Removed redundant `/api/auth/google
 95 | 
 96 | 
 97 | generateEventCopy` using the Gemini API in `functions/index.js`.
 98 |   - Added the `@google/generative-ai` dependency to `functions/package.json`.
 99 |   - Integrated a "Generate with AI" button into `components/create-event-modal.tsx
100 | 
101 | 
102 | Aug 30th:
103 | AuthScreen` component optimized for modal use, removing back button and card wrapper.
104 |   - Modal automatically closes upon successful authentication.
105 | - Implemented secure route group architecture by creating an `(app)` folder for protected routes.
106 |   - Authentication middleware in the secure layout (`app/(app)/layout.tsx`) redirects unauthenticated users.
107 |   - Separated public (landing/login) from private (map, events, chat, profile) pages.
108 |   - `bottom-navigation.tsx` now uses Next.js `Link` components for proper routing.
109 | - Implemented comprehensive RSVP attendee list and check-in system.
110 |   - Added database functions (`getEvent`, `joinEvent`, `leaveEvent`, `checkInPlayer`) in `lib/db.ts`.
111 |   - Created a tabbed interface in the `event-details-modal.tsx` with a dedicated "Players" section.
112 |   - Implemented organizer-only check-in functionality with loading states.
113 |   - Updated Firestore security rules to ensure only organizers can modify the `checkedInPlayers` array.
114 |   - Event documents now include a `checkedInPlayers` array for attendance tracking.
115 | - Implemented recurring events feature.
116 |   - Added a toggle switch in `CreateEventModal
117 | 
118 | 
119 | 
120 | Aug 31st:
121 | /api/users/[id]/events` was using client-side `getCurrentUser` instead of server-side `getServerCurrentUser` for authentication (violating architectural rule).
122 |   - Corrected the API route to use `getServerCurrentUser` from `lib/auth-server.ts`.
123 |   - Fixed a data structure mismatch in the `ProfilePage` component by mapping `organizedEvents` and `joinedEvents` from the API response to the expected `organized` and `joined` state properties.
124 |   - Implemented robust error handling and ensured `userEvents` state is always initialized with default empty arrays to prevent crashes, even on API failure.
125 | - Fixed build error caused by residual import after deleting a component:
126 |   - Removed the import and usage of `FirebaseDebug` from `components/map-view.tsx`.
127 | - Added missing Firebase health check functions:
128 |   - Implemented `checkFirebaseHealth` and `debugFirebaseConfig` functions in `lib/firebase.ts
129 | 
130 | sonner` toast library (`components/ui/sonner.tsx`).
131 |   - Integrated the `Toaster` component into the root layout (`app/layout.tsx`).
132 |   - Added toast notifications for success and error states to `components/create-event-modal.tsx` (event creation, AI copy).
133 |   - Added toast notifications to `components/event-details-modal.tsx` (RSVP, check-in, event boost).
134 |   - Added toast notifications to `components/event-chat.tsx` (sending messages).
135 | - Implemented server-side input validation using the `zod` library.
136 |   - Added `zod` as a project dependency.
137 |   - Created and enforced zod schemas for API endpoint validation:
138 |     - `/api/events` (for new event creation).
139 |     - `/api/events/[id]/rsvp` (for join/leave actions).
140 |     - `/api/events/[id]/chat
141 | 
142 | bio` and `favoriteSports` fields.
143 |   - Redesigned `app/profile/page.tsx` to display the user's bio and favorite sports using the new fields.
144 |   - Created `components/profile/edit-profile-modal.tsx` allowing users to update their display name, bio, and favorite sports.
145 |   - Created a reusable `components/ui/multi-select.tsx` component for selecting multiple favorite sports.
146 |   - Created necessary utility components: `components/ui/textarea.tsx`, `components/ui/command.tsx`, and integrated the `cmdk` library (`pnpm add cmdk`).
147 |   - Created a new API route `/api/users/profile/route.ts` to securely handle profile updates using Zod for validation.
148 |   - Implemented a friend/connection system backend:
149 |     - Created a `connections` subcollection within user documents in Firestore to store connection statuses.
150 |     - Created API route `/api/connections/request/route.ts` to handle sending connection requests.
151 |     - Created API route `/api/connections/accept/route.ts` to handle accepting connection requests using Firestore transactions.
152 |     - Updated `firestore.rules` to secure the `connections
153 | 
154 | functions/send-reminders.js` to send reminders 30 minutes before events.
155 |   - Updated `functions/index.js` to export the new function.
156 |   - Updated `firestore.rules` to allow the function to read necessary data.
157 | - Implemented simple gamification (Achievements):
158 |   - Modified `/api/events/[id]/rsvp` to award "first_game" badge on a user's first joined event.
159 |   - Updated `app/profile/page.tsx
160 | 
161 | Sep 2nd
162 | - **UI/UX Overhaul & Theming:**
163 |   - Implemented a new, cohesive design system with a "glassmorphism" aesthetic.
164 |   - Defined a new color palette, typography scale, and component styles in `tailwind.config.ts` and `globals.css`.
165 |   - Refactored all major UI components (`Button`, `Card`, `Modal`, `Chip`, etc.) to use the new design tokens.
166 | - **Landing Page Redesign:**
167 |   - Rewrote the hero section with new, benefit-led copy: "Stop the group-chat chaos. Find your game now."
168 |   - Replaced static value cards with a dynamic, auto-rotating feature showcase.
169 | - **In-App Screen Enhancements:**
170 |   - **Discover Page:** Added a persistent search bar, filter chips, sorting controls, and a "Recommended for You" section.
171 |   - **Map Page:** Added filter chips and a "Recenter" button.
172 |   - **Profile Page:** Redesigned the layout with a more visually engaging header and clearer information hierarchy.
173 |   - **Create Event Modal:** Introduced a disabled "Boost Event" feature to hint at future monetization.
174 | - **New Feature - Public Profile Viewing:**
175 |   - Created a new `PublicProfileModal` component to display a read-only view of a user's profile.
176 |   - Implemented a new API endpoint to fetch public profile data.
177 |   - Made the player list in the `EventDetailsModal` interactive, allowing users to tap on a player to view their profile.
178 | - **Performance Optimizations:**
179 |   - Refactored the events API to handle viewport-based queries, significantly reducing the amount of data fetched.
180 |   - Updated the Discover and Map pages to send map boundaries to the API.
181 |   - Memoized the `EventCard` component to prevent unnecessary re-renders.
182 | - **Build Fixes & Dependency Management:**
183 |   - Resolved a critical React version conflict by using `pnpm.overrides` to enforce consistent versions of `react` and `react-dom`.
184 |   - Fixed numerous build errors by restoring missing functions (`createUser`, `getEvents`, `saveFcmToken`, etc.) to the database library.
185 |   - Corrected several TypeScript errors by creating a centralized `GameEvent` type and fixing incorrect import paths.
186 |   - Enabled Turbopack for faster local development.
187 | 
188 | 
189 | You are an assistant specialized in summarizing daily development activities. I will provide you with a text file containing my chat log with an AI code agent for today's work. Your task is to review this chat and create a clear, concise, and simple journal entry for today's development. Focus on what was implemented, built, or significant decisions made regarding the app's features or architecture. The entry should be easy to understand and serve as a quick reference for my progress.
190 | 
191 | 
192 | 


--------------------------------------------------------------------------------
/my folder/git commands.txt:
--------------------------------------------------------------------------------
 1 | \`\`\`
 2 | git add .
 3 | git commit -m ""
 4 | git push origin main
 5 | \`\`\`
 6 | git pull origin main
 7 | git checkout -b new-feature
 8 | git merge new-feature
 9 | 
10 | 
11 | git branch -m feat/ui-redesign-pages master
12 | git fetch origin
13 | git branch -u origin/master master
14 | git remote set-head origin -a
15 | 


--------------------------------------------------------------------------------
/next.config.mjs:
--------------------------------------------------------------------------------
 1 | /** @type {import('next').NextConfig} */
 2 | const nextConfig = {
 3 |   // FIX: Reverted from a RegExp to a list of exact origin strings.
 4 |   // Next.js requires specific origins and does not support patterns here.
 5 |   // You will need to add the new URL to this list if the port changes again.
 6 |   experimental: {
 7 |     allowedDevOrigins: [
 8 |       "https://3000-firebase-huddlev0git-1754958256415.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev",
 9 |       "https://44551-firebase-huddlev0git-1754958256415.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev",
10 |       "https://38171-firebase-huddlev0git-1754958256415.cluster-wfwbjypkvnfkaqiqzlu3ikwjhe.cloudworkstations.dev",
11 |     ],
12 |   },
13 |   eslint: {
14 |     ignoreDuringBuilds: true,
15 |   },
16 |   typescript: {
17 |     ignoreBuildErrors: true,
18 |   },
19 |   images: {
20 |     unoptimized: true,
21 |   },
22 |   output: 'standalone',
23 | }
24 | 
25 | export default nextConfig
26 | 


--------------------------------------------------------------------------------
/package.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "name": "my-v0-project",
 3 |   "version": "0.1.0",
 4 |   "private": true,
 5 |   "scripts": {
 6 |     "build": "next build",
 7 |     "dev": "next dev --turbopack",
 8 |     "lint": "next lint",
 9 |     "start": "next start"
10 |   },
11 |   "dependencies": {
12 |     "@google/generative-ai": "latest",
13 |     "@googlemaps/js-api-loader": "^1.16.8",
14 |     "@hookform/resolvers": "^3.9.1",
15 |     "@radix-ui/react-accordion": "1.2.2",
16 |     "@radix-ui/react-alert-dialog": "1.1.4",
17 |     "@radix-ui/react-aspect-ratio": "1.1.1",
18 |     "@radix-ui/react-avatar": "latest",
19 |     "@radix-ui/react-checkbox": "1.1.3",
20 |     "@radix-ui/react-collapsible": "1.1.2",
21 |     "@radix-ui/react-context-menu": "2.2.4",
22 |     "@radix-ui/react-dialog": "1.1.4",
23 |     "@radix-ui/react-dropdown-menu": "2.1.4",
24 |     "@radix-ui/react-hover-card": "1.1.4",
25 |     "@radix-ui/react-label": "latest",
26 |     "@radix-ui/react-menubar": "1.1.4",
27 |     "@radix-ui/react-navigation-menu": "1.2.3",
28 |     "@radix-ui/react-popover": "latest",
29 |     "@radix-ui/react-progress": "1.1.1",
30 |     "@radix-ui/react-radio-group": "1.2.2",
31 |     "@radix-ui/react-scroll-area": "latest",
32 |     "@radix-ui/react-select": "latest",
33 |     "@radix-ui/react-separator": "1.1.1",
34 |     "@radix-ui/react-slot": "latest",
35 |     "@radix-ui/react-switch": "latest",
36 |     "@radix-ui/react-tabs": "latest",
37 |     "@radix-ui/react-toast": "1.2.4",
38 |     "@radix-ui/react-toggle": "1.1.1",
39 |     "@radix-ui/react-toggle-group": "1.1.1",
40 |     "@remix-run/react": "latest",
41 |     "@sveltejs/kit": "latest",
42 |     "@vercel/analytics": "latest",
43 |     "@vercel/speed-insights": "latest",
44 |     "@vis.gl/react-google-maps": "latest",
45 |     "autoprefixer": "^10.4.20",
46 |     "axios": "latest",
47 |     "class-variance-authority": "^0.7.1",
48 |     "clsx": "^2.1.1",
49 |     "cmdk": "1.0.4",
50 |     "date-fns": "latest",
51 |     "embla-carousel-react": "8.5.1",
52 |     "firebase": "latest",
53 |     "firebase-admin": "latest",
54 |     "firebase-functions": "latest",
55 |     "geist": "^1.3.1",
56 |     "geofire-common": "latest",
57 |     "google-auth-library": "latest",
58 |     "googlemaps": "latest",
59 |     "input-otp": "1.4.1",
60 |     "lucide-react": "^0.454.0",
61 |     "next": "15.2.4",
62 |     "next-themes": "latest",
63 |     "react": "^19",
64 |     "react-day-picker": "latest",
65 |     "react-dom": "^19",
66 |     "react-hook-form": "^7.54.1",
67 |     "react-resizable-panels": "^2.1.7",
68 |     "recharts": "2.15.0",
69 |     "server-only": "latest",
70 |     "sonner": "^1.7.1",
71 |     "svelte": "latest",
72 |     "tailwind-merge": "^2.5.5",
73 |     "tailwindcss-animate": "^1.0.7",
74 |     "vaul": "^0.9.6",
75 |     "vue": "latest",
76 |     "vue-router": "latest",
77 |     "zod": "^3.24.1"
78 |   },
79 |   "devDependencies": {
80 |     "@types/google.maps": "^3.58.1",
81 |     "@types/node": "^22",
82 |     "@types/react": "^19",
83 |     "@types/react-dom": "^19",
84 |     "postcss": "^8.5",
85 |     "tailwindcss": "^3.4.17",
86 |     "typescript": "^5"
87 |   },
88 |   "pnpm": {
89 |     "overrides": {
90 |       "react": "^19",
91 |       "@types/react": "^19",
92 |       "react-dom": "^19",
93 |       "@types/react-dom": "^19"
94 |     }
95 |   }
96 | }
97 | 


--------------------------------------------------------------------------------
/pnpm-lock.yaml:
--------------------------------------------------------------------------------
   1 | lockfileVersion: '9.0'
   2 | 
   3 | settings:
   4 |   autoInstallPeers: true
   5 |   excludeLinksFromLockfile: false
   6 | 
   7 | overrides:
   8 |   react: ^19
   9 |   '@types/react': ^19
  10 |   react-dom: ^19
  11 |   '@types/react-dom': ^19
  12 | 
  13 | importers:
  14 | 
  15 |   .:
  16 |     dependencies:
  17 |       '@google/generative-ai':
  18 |         specifier: latest
  19 |         version: 0.24.1
  20 |       '@googlemaps/js-api-loader':
  21 |         specifier: ^1.16.8
  22 |         version: 1.16.10
  23 |       '@hookform/resolvers':
  24 |         specifier: ^3.9.1
  25 |         version: 3.10.0(react-hook-form@7.62.0(react@19.1.1))
  26 |       '@radix-ui/react-accordion':
  27 |         specifier: 1.2.2
  28 |         version: 1.2.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  29 |       '@radix-ui/react-alert-dialog':
  30 |         specifier: 1.1.4
  31 |         version: 1.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  32 |       '@radix-ui/react-aspect-ratio':
  33 |         specifier: 1.1.1
  34 |         version: 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  35 |       '@radix-ui/react-avatar':
  36 |         specifier: latest
  37 |         version: 1.1.10(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  38 |       '@radix-ui/react-checkbox':
  39 |         specifier: 1.1.3
  40 |         version: 1.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  41 |       '@radix-ui/react-collapsible':
  42 |         specifier: 1.1.2
  43 |         version: 1.1.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  44 |       '@radix-ui/react-context-menu':
  45 |         specifier: 2.2.4
  46 |         version: 2.2.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  47 |       '@radix-ui/react-dialog':
  48 |         specifier: 1.1.4
  49 |         version: 1.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  50 |       '@radix-ui/react-dropdown-menu':
  51 |         specifier: 2.1.4
  52 |         version: 2.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  53 |       '@radix-ui/react-hover-card':
  54 |         specifier: 1.1.4
  55 |         version: 1.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  56 |       '@radix-ui/react-label':
  57 |         specifier: latest
  58 |         version: 2.1.7(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  59 |       '@radix-ui/react-menubar':
  60 |         specifier: 1.1.4
  61 |         version: 1.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  62 |       '@radix-ui/react-navigation-menu':
  63 |         specifier: 1.2.3
  64 |         version: 1.2.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  65 |       '@radix-ui/react-popover':
  66 |         specifier: latest
  67 |         version: 1.1.15(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  68 |       '@radix-ui/react-progress':
  69 |         specifier: 1.1.1
  70 |         version: 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  71 |       '@radix-ui/react-radio-group':
  72 |         specifier: 1.2.2
  73 |         version: 1.2.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  74 |       '@radix-ui/react-scroll-area':
  75 |         specifier: latest
  76 |         version: 1.2.10(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  77 |       '@radix-ui/react-select':
  78 |         specifier: latest
  79 |         version: 2.2.6(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  80 |       '@radix-ui/react-separator':
  81 |         specifier: 1.1.1
  82 |         version: 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  83 |       '@radix-ui/react-slot':
  84 |         specifier: latest
  85 |         version: 1.2.3(@types/react@19.1.12)(react@19.1.1)
  86 |       '@radix-ui/react-switch':
  87 |         specifier: latest
  88 |         version: 1.2.6(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  89 |       '@radix-ui/react-tabs':
  90 |         specifier: latest
  91 |         version: 1.1.13(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  92 |       '@radix-ui/react-toast':
  93 |         specifier: 1.2.4
  94 |         version: 1.2.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  95 |       '@radix-ui/react-toggle':
  96 |         specifier: 1.1.1
  97 |         version: 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
  98 |       '@radix-ui/react-toggle-group':
  99 |         specifier: 1.1.1
 100 |         version: 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
 101 |       '@remix-run/react':
 102 |         specifier: latest
 103 |         version: 2.17.0(react-dom@19.1.1(react@19.1.1))(react@19.1.1)(typescript@5.9.2)
 104 |       '@sveltejs/kit':
 105 |         specifier: latest
 106 |         version: 2.37.0(@opentelemetry/api@1.9.0)(@sveltejs/vite-plugin-svelte@6.1.4(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1))
 107 |       '@vercel/analytics':
 108 |         specifier: latest
 109 |         version: 1.5.0(@remix-run/react@2.17.0(react-dom@19.1.1(react@19.1.1))(react@19.1.1)(typescript@5.9.2))(@sveltejs/kit@2.37.0(@opentelemetry/api@1.9.0)(@sveltejs/vite-plugin-svelte@6.1.4(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(next@15.2.4(@opentelemetry/api@1.9.0)(react-dom@19.1.1(react@19.1.1))(react@19.1.1))(react@19.1.1)(svelte@5.38.6)(vue-router@4.5.1(vue@3.5.21(typescript@5.9.2)))(vue@3.5.21(typescript@5.9.2))
 110 |       '@vercel/speed-insights':
 111 |         specifier: latest
 112 |         version: 1.2.0(@sveltejs/kit@2.37.0(@opentelemetry/api@1.9.0)(@sveltejs/vite-plugin-svelte@6.1.4(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(next@15.2.4(@opentelemetry/api@1.9.0)(react-dom@19.1.1(react@19.1.1))(react@19.1.1))(react@19.1.1)(svelte@5.38.6)(vue-router@4.5.1(vue@3.5.21(typescript@5.9.2)))(vue@3.5.21(typescript@5.9.2))
 113 |       '@vis.gl/react-google-maps':
 114 |         specifier: latest
 115 |         version: 1.5.5(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
 116 |       autoprefixer:
 117 |         specifier: ^10.4.20
 118 |         version: 10.4.21(postcss@8.5.6)
 119 |       axios:
 120 |         specifier: latest
 121 |         version: 1.11.0
 122 |       class-variance-authority:
 123 |         specifier: ^0.7.1
 124 |         version: 0.7.1
 125 |       clsx:
 126 |         specifier: ^2.1.1
 127 |         version: 2.1.1
 128 |       cmdk:
 129 |         specifier: 1.0.4
 130 |         version: 1.0.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
 131 |       date-fns:
 132 |         specifier: latest
 133 |         version: 4.1.0
 134 |       embla-carousel-react:
 135 |         specifier: 8.5.1
 136 |         version: 8.5.1(react@19.1.1)
 137 |       firebase:
 138 |         specifier: latest
 139 |         version: 12.2.1
 140 |       firebase-admin:
 141 |         specifier: latest
 142 |         version: 13.5.0
 143 |       firebase-functions:
 144 |         specifier: latest
 145 |         version: 6.4.0(firebase-admin@13.5.0)
 146 |       geist:
 147 |         specifier: ^1.3.1
 148 |         version: 1.4.2(next@15.2.4(@opentelemetry/api@1.9.0)(react-dom@19.1.1(react@19.1.1))(react@19.1.1))
 149 |       geofire-common:
 150 |         specifier: latest
 151 |         version: 6.0.0
 152 |       google-auth-library:
 153 |         specifier: latest
 154 |         version: 10.3.0
 155 |       googlemaps:
 156 |         specifier: latest
 157 |         version: 1.12.0
 158 |       input-otp:
 159 |         specifier: 1.4.1
 160 |         version: 1.4.1(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
 161 |       lucide-react:
 162 |         specifier: ^0.454.0
 163 |         version: 0.454.0(react@19.1.1)
 164 |       next:
 165 |         specifier: 15.2.4
 166 |         version: 15.2.4(@opentelemetry/api@1.9.0)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
 167 |       next-themes:
 168 |         specifier: latest
 169 |         version: 0.4.6(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
 170 |       react:
 171 |         specifier: ^19
 172 |         version: 19.1.1
 173 |       react-day-picker:
 174 |         specifier: latest
 175 |         version: 9.9.0(react@19.1.1)
 176 |       react-dom:
 177 |         specifier: ^19
 178 |         version: 19.1.1(react@19.1.1)
 179 |       react-hook-form:
 180 |         specifier: ^7.54.1
 181 |         version: 7.62.0(react@19.1.1)
 182 |       react-resizable-panels:
 183 |         specifier: ^2.1.7
 184 |         version: 2.1.9(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
 185 |       recharts:
 186 |         specifier: 2.15.0
 187 |         version: 2.15.0(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
 188 |       server-only:
 189 |         specifier: latest
 190 |         version: 0.0.1
 191 |       sonner:
 192 |         specifier: ^1.7.1
 193 |         version: 1.7.4(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
 194 |       svelte:
 195 |         specifier: latest
 196 |         version: 5.38.6
 197 |       tailwind-merge:
 198 |         specifier: ^2.5.5
 199 |         version: 2.6.0
 200 |       tailwindcss-animate:
 201 |         specifier: ^1.0.7
 202 |         version: 1.0.7(tailwindcss@3.4.17)
 203 |       vaul:
 204 |         specifier: ^0.9.6
 205 |         version: 0.9.9(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
 206 |       vue:
 207 |         specifier: latest
 208 |         version: 3.5.21(typescript@5.9.2)
 209 |       vue-router:
 210 |         specifier: latest
 211 |         version: 4.5.1(vue@3.5.21(typescript@5.9.2))
 212 |       zod:
 213 |         specifier: ^3.24.1
 214 |         version: 3.25.76
 215 |     devDependencies:
 216 |       '@types/google.maps':
 217 |         specifier: ^3.58.1
 218 |         version: 3.58.1
 219 |       '@types/node':
 220 |         specifier: ^22
 221 |         version: 22.18.0
 222 |       '@types/react':
 223 |         specifier: ^19
 224 |         version: 19.1.12
 225 |       '@types/react-dom':
 226 |         specifier: ^19
 227 |         version: 19.1.9(@types/react@19.1.12)
 228 |       postcss:
 229 |         specifier: ^8.5
 230 |         version: 8.5.6
 231 |       tailwindcss:
 232 |         specifier: ^3.4.17
 233 |         version: 3.4.17
 234 |       typescript:
 235 |         specifier: ^5
 236 |         version: 5.9.2
 237 | 
 238 | packages:
 239 | 
 240 |   '@alloc/quick-lru@5.2.0':
 241 |     resolution: {integrity: sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==}
 242 |     engines: {node: '>=10'}
 243 | 
 244 |   '@babel/helper-string-parser@7.27.1':
 245 |     resolution: {integrity: sha512-qMlSxKbpRlAridDExk92nSobyDdpPijUq2DW6oDnUqd0iOGxmQjyqhMIihI9+zv4LPyZdRje2cavWPbCbWm3eA==}
 246 |     engines: {node: '>=6.9.0'}
 247 | 
 248 |   '@babel/helper-validator-identifier@7.27.1':
 249 |     resolution: {integrity: sha512-D2hP9eA+Sqx1kBZgzxZh0y1trbuU+JoDkiEwqhQ36nodYqJwyEIhPSdMNd7lOm/4io72luTPWH20Yda0xOuUow==}
 250 |     engines: {node: '>=6.9.0'}
 251 | 
 252 |   '@babel/parser@7.28.3':
 253 |     resolution: {integrity: sha512-7+Ey1mAgYqFAx2h0RuoxcQT5+MlG3GTV0TQrgr7/ZliKsm/MNDxVVutlWaziMq7wJNAz8MTqz55XLpWvva6StA==}
 254 |     engines: {node: '>=6.0.0'}
 255 |     hasBin: true
 256 | 
 257 |   '@babel/runtime@7.28.3':
 258 |     resolution: {integrity: sha512-9uIQ10o0WGdpP6GDhXcdOJPJuDgFtIDtN/9+ArJQ2NAfAmiuhTQdzkaTGR33v43GYS2UrSA0eX2pPPHoFVvpxA==}
 259 |     engines: {node: '>=6.9.0'}
 260 | 
 261 |   '@babel/types@7.28.2':
 262 |     resolution: {integrity: sha512-ruv7Ae4J5dUYULmeXw1gmb7rYRz57OWCPM57pHojnLq/3Z1CK2lNSLTCVjxVk1F/TZHwOZZrOWi0ur95BbLxNQ==}
 263 |     engines: {node: '>=6.9.0'}
 264 | 
 265 |   '@date-fns/tz@1.4.1':
 266 |     resolution: {integrity: sha512-P5LUNhtbj6YfI3iJjw5EL9eUAG6OitD0W3fWQcpQjDRc/QIsL0tRNuO1PcDvPccWL1fSTXXdE1ds+l95DV/OFA==}
 267 | 
 268 |   '@emnapi/runtime@1.5.0':
 269 |     resolution: {integrity: sha512-97/BJ3iXHww3djw6hYIfErCZFee7qCtrneuLa20UXFCOTCfBM2cvQHjWJ2EG0s0MtdNwInarqCTz35i4wWXHsQ==}
 270 | 
 271 |   '@esbuild/aix-ppc64@0.25.9':
 272 |     resolution: {integrity: sha512-OaGtL73Jck6pBKjNIe24BnFE6agGl+6KxDtTfHhy1HmhthfKouEcOhqpSL64K4/0WCtbKFLOdzD/44cJ4k9opA==}
 273 |     engines: {node: '>=18'}
 274 |     cpu: [ppc64]
 275 |     os: [aix]
 276 | 
 277 |   '@esbuild/android-arm64@0.25.9':
 278 |     resolution: {integrity: sha512-IDrddSmpSv51ftWslJMvl3Q2ZT98fUSL2/rlUXuVqRXHCs5EUF1/f+jbjF5+NG9UffUDMCiTyh8iec7u8RlTLg==}
 279 |     engines: {node: '>=18'}
 280 |     cpu: [arm64]
 281 |     os: [android]
 282 | 
 283 |   '@esbuild/android-arm@0.25.9':
 284 |     resolution: {integrity: sha512-5WNI1DaMtxQ7t7B6xa572XMXpHAaI/9Hnhk8lcxF4zVN4xstUgTlvuGDorBguKEnZO70qwEcLpfifMLoxiPqHQ==}
 285 |     engines: {node: '>=18'}
 286 |     cpu: [arm]
 287 |     os: [android]
 288 | 
 289 |   '@esbuild/android-x64@0.25.9':
 290 |     resolution: {integrity: sha512-I853iMZ1hWZdNllhVZKm34f4wErd4lMyeV7BLzEExGEIZYsOzqDWDf+y082izYUE8gtJnYHdeDpN/6tUdwvfiw==}
 291 |     engines: {node: '>=18'}
 292 |     cpu: [x64]
 293 |     os: [android]
 294 | 
 295 |   '@esbuild/darwin-arm64@0.25.9':
 296 |     resolution: {integrity: sha512-XIpIDMAjOELi/9PB30vEbVMs3GV1v2zkkPnuyRRURbhqjyzIINwj+nbQATh4H9GxUgH1kFsEyQMxwiLFKUS6Rg==}
 297 |     engines: {node: '>=18'}
 298 |     cpu: [arm64]
 299 |     os: [darwin]
 300 | 
 301 |   '@esbuild/darwin-x64@0.25.9':
 302 |     resolution: {integrity: sha512-jhHfBzjYTA1IQu8VyrjCX4ApJDnH+ez+IYVEoJHeqJm9VhG9Dh2BYaJritkYK3vMaXrf7Ogr/0MQ8/MeIefsPQ==}
 303 |     engines: {node: '>=18'}
 304 |     cpu: [x64]
 305 |     os: [darwin]
 306 | 
 307 |   '@esbuild/freebsd-arm64@0.25.9':
 308 |     resolution: {integrity: sha512-z93DmbnY6fX9+KdD4Ue/H6sYs+bhFQJNCPZsi4XWJoYblUqT06MQUdBCpcSfuiN72AbqeBFu5LVQTjfXDE2A6Q==}
 309 |     engines: {node: '>=18'}
 310 |     cpu: [arm64]
 311 |     os: [freebsd]
 312 | 
 313 |   '@esbuild/freebsd-x64@0.25.9':
 314 |     resolution: {integrity: sha512-mrKX6H/vOyo5v71YfXWJxLVxgy1kyt1MQaD8wZJgJfG4gq4DpQGpgTB74e5yBeQdyMTbgxp0YtNj7NuHN0PoZg==}
 315 |     engines: {node: '>=18'}
 316 |     cpu: [x64]
 317 |     os: [freebsd]
 318 | 
 319 |   '@esbuild/linux-arm64@0.25.9':
 320 |     resolution: {integrity: sha512-BlB7bIcLT3G26urh5Dmse7fiLmLXnRlopw4s8DalgZ8ef79Jj4aUcYbk90g8iCa2467HX8SAIidbL7gsqXHdRw==}
 321 |     engines: {node: '>=18'}
 322 |     cpu: [arm64]
 323 |     os: [linux]
 324 | 
 325 |   '@esbuild/linux-arm@0.25.9':
 326 |     resolution: {integrity: sha512-HBU2Xv78SMgaydBmdor38lg8YDnFKSARg1Q6AT0/y2ezUAKiZvc211RDFHlEZRFNRVhcMamiToo7bDx3VEOYQw==}
 327 |     engines: {node: '>=18'}
 328 |     cpu: [arm]
 329 |     os: [linux]
 330 | 
 331 |   '@esbuild/linux-ia32@0.25.9':
 332 |     resolution: {integrity: sha512-e7S3MOJPZGp2QW6AK6+Ly81rC7oOSerQ+P8L0ta4FhVi+/j/v2yZzx5CqqDaWjtPFfYz21Vi1S0auHrap3Ma3A==}
 333 |     engines: {node: '>=18'}
 334 |     cpu: [ia32]
 335 |     os: [linux]
 336 | 
 337 |   '@esbuild/linux-loong64@0.25.9':
 338 |     resolution: {integrity: sha512-Sbe10Bnn0oUAB2AalYztvGcK+o6YFFA/9829PhOCUS9vkJElXGdphz0A3DbMdP8gmKkqPmPcMJmJOrI3VYB1JQ==}
 339 |     engines: {node: '>=18'}
 340 |     cpu: [loong64]
 341 |     os: [linux]
 342 | 
 343 |   '@esbuild/linux-mips64el@0.25.9':
 344 |     resolution: {integrity: sha512-YcM5br0mVyZw2jcQeLIkhWtKPeVfAerES5PvOzaDxVtIyZ2NUBZKNLjC5z3/fUlDgT6w89VsxP2qzNipOaaDyA==}
 345 |     engines: {node: '>=18'}
 346 |     cpu: [mips64el]
 347 |     os: [linux]
 348 | 
 349 |   '@esbuild/linux-ppc64@0.25.9':
 350 |     resolution: {integrity: sha512-++0HQvasdo20JytyDpFvQtNrEsAgNG2CY1CLMwGXfFTKGBGQT3bOeLSYE2l1fYdvML5KUuwn9Z8L1EWe2tzs1w==}
 351 |     engines: {node: '>=18'}
 352 |     cpu: [ppc64]
 353 |     os: [linux]
 354 | 
 355 |   '@esbuild/linux-riscv64@0.25.9':
 356 |     resolution: {integrity: sha512-uNIBa279Y3fkjV+2cUjx36xkx7eSjb8IvnL01eXUKXez/CBHNRw5ekCGMPM0BcmqBxBcdgUWuUXmVWwm4CH9kg==}
 357 |     engines: {node: '>=18'}
 358 |     cpu: [riscv64]
 359 |     os: [linux]
 360 | 
 361 |   '@esbuild/linux-s390x@0.25.9':
 362 |     resolution: {integrity: sha512-Mfiphvp3MjC/lctb+7D287Xw1DGzqJPb/J2aHHcHxflUo+8tmN/6d4k6I2yFR7BVo5/g7x2Monq4+Yew0EHRIA==}
 363 |     engines: {node: '>=18'}
 364 |     cpu: [s390x]
 365 |     os: [linux]
 366 | 
 367 |   '@esbuild/linux-x64@0.25.9':
 368 |     resolution: {integrity: sha512-iSwByxzRe48YVkmpbgoxVzn76BXjlYFXC7NvLYq+b+kDjyyk30J0JY47DIn8z1MO3K0oSl9fZoRmZPQI4Hklzg==}
 369 |     engines: {node: '>=18'}
 370 |     cpu: [x64]
 371 |     os: [linux]
 372 | 
 373 |   '@esbuild/netbsd-arm64@0.25.9':
 374 |     resolution: {integrity: sha512-9jNJl6FqaUG+COdQMjSCGW4QiMHH88xWbvZ+kRVblZsWrkXlABuGdFJ1E9L7HK+T0Yqd4akKNa/lO0+jDxQD4Q==}
 375 |     engines: {node: '>=18'}
 376 |     cpu: [arm64]
 377 |     os: [netbsd]
 378 | 
 379 |   '@esbuild/netbsd-x64@0.25.9':
 380 |     resolution: {integrity: sha512-RLLdkflmqRG8KanPGOU7Rpg829ZHu8nFy5Pqdi9U01VYtG9Y0zOG6Vr2z4/S+/3zIyOxiK6cCeYNWOFR9QP87g==}
 381 |     engines: {node: '>=18'}
 382 |     cpu: [x64]
 383 |     os: [netbsd]
 384 | 
 385 |   '@esbuild/openbsd-arm64@0.25.9':
 386 |     resolution: {integrity: sha512-YaFBlPGeDasft5IIM+CQAhJAqS3St3nJzDEgsgFixcfZeyGPCd6eJBWzke5piZuZ7CtL656eOSYKk4Ls2C0FRQ==}
 387 |     engines: {node: '>=18'}
 388 |     cpu: [arm64]
 389 |     os: [openbsd]
 390 | 
 391 |   '@esbuild/openbsd-x64@0.25.9':
 392 |     resolution: {integrity: sha512-1MkgTCuvMGWuqVtAvkpkXFmtL8XhWy+j4jaSO2wxfJtilVCi0ZE37b8uOdMItIHz4I6z1bWWtEX4CJwcKYLcuA==}
 393 |     engines: {node: '>=18'}
 394 |     cpu: [x64]
 395 |     os: [openbsd]
 396 | 
 397 |   '@esbuild/openharmony-arm64@0.25.9':
 398 |     resolution: {integrity: sha512-4Xd0xNiMVXKh6Fa7HEJQbrpP3m3DDn43jKxMjxLLRjWnRsfxjORYJlXPO4JNcXtOyfajXorRKY9NkOpTHptErg==}
 399 |     engines: {node: '>=18'}
 400 |     cpu: [arm64]
 401 |     os: [openharmony]
 402 | 
 403 |   '@esbuild/sunos-x64@0.25.9':
 404 |     resolution: {integrity: sha512-WjH4s6hzo00nNezhp3wFIAfmGZ8U7KtrJNlFMRKxiI9mxEK1scOMAaa9i4crUtu+tBr+0IN6JCuAcSBJZfnphw==}
 405 |     engines: {node: '>=18'}
 406 |     cpu: [x64]
 407 |     os: [sunos]
 408 | 
 409 |   '@esbuild/win32-arm64@0.25.9':
 410 |     resolution: {integrity: sha512-mGFrVJHmZiRqmP8xFOc6b84/7xa5y5YvR1x8djzXpJBSv/UsNK6aqec+6JDjConTgvvQefdGhFDAs2DLAds6gQ==}
 411 |     engines: {node: '>=18'}
 412 |     cpu: [arm64]
 413 |     os: [win32]
 414 | 
 415 |   '@esbuild/win32-ia32@0.25.9':
 416 |     resolution: {integrity: sha512-b33gLVU2k11nVx1OhX3C8QQP6UHQK4ZtN56oFWvVXvz2VkDoe6fbG8TOgHFxEvqeqohmRnIHe5A1+HADk4OQww==}
 417 |     engines: {node: '>=18'}
 418 |     cpu: [ia32]
 419 |     os: [win32]
 420 | 
 421 |   '@esbuild/win32-x64@0.25.9':
 422 |     resolution: {integrity: sha512-PPOl1mi6lpLNQxnGoyAfschAodRFYXJ+9fs6WHXz7CSWKbOqiMZsubC+BQsVKuul+3vKLuwTHsS2c2y9EoKwxQ==}
 423 |     engines: {node: '>=18'}
 424 |     cpu: [x64]
 425 |     os: [win32]
 426 | 
 427 |   '@fastify/busboy@3.2.0':
 428 |     resolution: {integrity: sha512-m9FVDXU3GT2ITSe0UaMA5rU3QkfC/UXtCU8y0gSN/GugTqtVldOBWIB5V6V3sbmenVZUIpU6f+mPEO2+m5iTaA==}
 429 | 
 430 |   '@firebase/ai@2.2.1':
 431 |     resolution: {integrity: sha512-0VWlkGB18oDhwMqsgxpt/usMsyjnH3a7hTvQPcAbk7VhFg0QZMDX60mQKfLTFKrB5VwmlaIdVsSZznsTY2S0wA==}
 432 |     engines: {node: '>=20.0.0'}
 433 |     peerDependencies:
 434 |       '@firebase/app': 0.x
 435 |       '@firebase/app-types': 0.x
 436 | 
 437 |   '@firebase/analytics-compat@0.2.24':
 438 |     resolution: {integrity: sha512-jE+kJnPG86XSqGQGhXXYt1tpTbCTED8OQJ/PQ90SEw14CuxRxx/H+lFbWA1rlFtFSsTCptAJtgyRBwr/f00vsw==}
 439 |     peerDependencies:
 440 |       '@firebase/app-compat': 0.x
 441 | 
 442 |   '@firebase/analytics-types@0.8.3':
 443 |     resolution: {integrity: sha512-VrIp/d8iq2g501qO46uGz3hjbDb8xzYMrbu8Tp0ovzIzrvJZ2fvmj649gTjge/b7cCCcjT0H37g1gVtlNhnkbg==}
 444 | 
 445 |   '@firebase/analytics@0.10.18':
 446 |     resolution: {integrity: sha512-iN7IgLvM06iFk8BeFoWqvVpRFW3Z70f+Qe2PfCJ7vPIgLPjHXDE774DhCT5Y2/ZU/ZbXPDPD60x/XPWEoZLNdg==}
 447 |     peerDependencies:
 448 |       '@firebase/app': 0.x
 449 | 
 450 |   '@firebase/app-check-compat@0.4.0':
 451 |     resolution: {integrity: sha512-UfK2Q8RJNjYM/8MFORltZRG9lJj11k0nW84rrffiKvcJxLf1jf6IEjCIkCamykHE73C6BwqhVfhIBs69GXQV0g==}
 452 |     engines: {node: '>=20.0.0'}
 453 |     peerDependencies:
 454 |       '@firebase/app-compat': 0.x
 455 | 
 456 |   '@firebase/app-check-interop-types@0.3.3':
 457 |     resolution: {integrity: sha512-gAlxfPLT2j8bTI/qfe3ahl2I2YcBQ8cFIBdhAQA4I2f3TndcO+22YizyGYuttLHPQEpWkhmpFW60VCFEPg4g5A==}
 458 | 
 459 |   '@firebase/app-check-types@0.5.3':
 460 |     resolution: {integrity: sha512-hyl5rKSj0QmwPdsAxrI5x1otDlByQ7bvNvVt8G/XPO2CSwE++rmSVf3VEhaeOR4J8ZFaF0Z0NDSmLejPweZ3ng==}
 461 | 
 462 |   '@firebase/app-check@0.11.0':
 463 |     resolution: {integrity: sha512-XAvALQayUMBJo58U/rxW02IhsesaxxfWVmVkauZvGEz3vOAjMEQnzFlyblqkc2iAaO82uJ2ZVyZv9XzPfxjJ6w==}
 464 |     engines: {node: '>=20.0.0'}
 465 |     peerDependencies:
 466 |       '@firebase/app': 0.x
 467 | 
 468 |   '@firebase/app-compat@0.5.2':
 469 |     resolution: {integrity: sha512-cn+U27GDaBS/irsbvrfnPZdcCzeZPRGKieSlyb7vV6LSOL6mdECnB86PgYjYGxSNg8+U48L/NeevTV1odU+mOQ==}
 470 |     engines: {node: '>=20.0.0'}
 471 | 
 472 |   '@firebase/app-types@0.9.3':
 473 |     resolution: {integrity: sha512-kRVpIl4vVGJ4baogMDINbyrIOtOxqhkZQg4jTq3l8Lw6WSk0xfpEYzezFu+Kl4ve4fbPl79dvwRtaFqAC/ucCw==}
 474 | 
 475 |   '@firebase/app@0.14.2':
 476 |     resolution: {integrity: sha512-Ecx2ig/JLC9ayIQwZHqm41Tzlf4c1WUuFhFUZB1y+JIJqDRE579x7Uil7tKT8MwDpOPwrK5ZtpxdSsrfy/LF8Q==}
 477 |     engines: {node: '>=20.0.0'}
 478 | 
 479 |   '@firebase/auth-compat@0.6.0':
 480 |     resolution: {integrity: sha512-J0lGSxXlG/lYVi45wbpPhcWiWUMXevY4fvLZsN1GHh+po7TZVng+figdHBVhFheaiipU8HZyc7ljw1jNojM2nw==}
 481 |     engines: {node: '>=20.0.0'}
 482 |     peerDependencies:
 483 |       '@firebase/app-compat': 0.x
 484 | 
 485 |   '@firebase/auth-interop-types@0.2.4':
 486 |     resolution: {integrity: sha512-JPgcXKCuO+CWqGDnigBtvo09HeBs5u/Ktc2GaFj2m01hLarbxthLNm7Fk8iOP1aqAtXV+fnnGj7U28xmk7IwVA==}
 487 | 
 488 |   '@firebase/auth-types@0.13.0':
 489 |     resolution: {integrity: sha512-S/PuIjni0AQRLF+l9ck0YpsMOdE8GO2KU6ubmBB7P+7TJUCQDa3R1dlgYm9UzGbbePMZsp0xzB93f2b/CgxMOg==}
 490 |     peerDependencies:
 491 |       '@firebase/app-types': 0.x
 492 |       '@firebase/util': 1.x
 493 | 
 494 |   '@firebase/auth@1.11.0':
 495 |     resolution: {integrity: sha512-5j7+ua93X+IRcJ1oMDTClTo85l7Xe40WSkoJ+shzPrX7OISlVWLdE1mKC57PSD+/LfAbdhJmvKixINBw2ESK6w==}
 496 |     engines: {node: '>=20.0.0'}
 497 |     peerDependencies:
 498 |       '@firebase/app': 0.x
 499 |       '@react-native-async-storage/async-storage': ^1.18.1
 500 |     peerDependenciesMeta:
 501 |       '@react-native-async-storage/async-storage':
 502 |         optional: true
 503 | 
 504 |   '@firebase/component@0.7.0':
 505 |     resolution: {integrity: sha512-wR9En2A+WESUHexjmRHkqtaVH94WLNKt6rmeqZhSLBybg4Wyf0Umk04SZsS6sBq4102ZsDBFwoqMqJYj2IoDSg==}
 506 |     engines: {node: '>=20.0.0'}
 507 | 
 508 |   '@firebase/data-connect@0.3.11':
 509 |     resolution: {integrity: sha512-G258eLzAD6im9Bsw+Qm1Z+P4x0PGNQ45yeUuuqe5M9B1rn0RJvvsQCRHXgE52Z+n9+WX1OJd/crcuunvOGc7Vw==}
 510 |     peerDependencies:
 511 |       '@firebase/app': 0.x
 512 | 
 513 |   '@firebase/database-compat@2.1.0':
 514 |     resolution: {integrity: sha512-8nYc43RqxScsePVd1qe1xxvWNf0OBnbwHxmXJ7MHSuuTVYFO3eLyLW3PiCKJ9fHnmIz4p4LbieXwz+qtr9PZDg==}
 515 |     engines: {node: '>=20.0.0'}
 516 | 
 517 |   '@firebase/database-types@1.0.16':
 518 |     resolution: {integrity: sha512-xkQLQfU5De7+SPhEGAXFBnDryUWhhlFXelEg2YeZOQMCdoe7dL64DDAd77SQsR+6uoXIZY5MB4y/inCs4GTfcw==}
 519 | 
 520 |   '@firebase/database@1.1.0':
 521 |     resolution: {integrity: sha512-gM6MJFae3pTyNLoc9VcJNuaUDej0ctdjn3cVtILo3D5lpp0dmUHHLFN/pUKe7ImyeB1KAvRlEYxvIHNF04Filg==}
 522 |     engines: {node: '>=20.0.0'}
 523 | 
 524 |   '@firebase/firestore-compat@0.4.1':
 525 |     resolution: {integrity: sha512-BjalPTDh/K0vmR/M/DE148dpIqbcfvtFVTietbUDWDWYIl9YH0TTVp/EwXRbZwswPxyjx4GdHW61GB2AYVz1SQ==}
 526 |     engines: {node: '>=20.0.0'}
 527 |     peerDependencies:
 528 |       '@firebase/app-compat': 0.x
 529 | 
 530 |   '@firebase/firestore-types@3.0.3':
 531 |     resolution: {integrity: sha512-hD2jGdiWRxB/eZWF89xcK9gF8wvENDJkzpVFb4aGkzfEaKxVRD1kjz1t1Wj8VZEp2LCB53Yx1zD8mrhQu87R6Q==}
 532 |     peerDependencies:
 533 |       '@firebase/app-types': 0.x
 534 |       '@firebase/util': 1.x
 535 | 
 536 |   '@firebase/firestore@4.9.1':
 537 |     resolution: {integrity: sha512-PYVUTkhC9y8pydrqC3O1Oc4AMfkGSWdmuH9xgPJjiEbpUIUPQ4J8wJhyuash+o2u+axmyNRFP8ULNUKb+WzBzQ==}
 538 |     engines: {node: '>=20.0.0'}
 539 |     peerDependencies:
 540 |       '@firebase/app': 0.x
 541 | 
 542 |   '@firebase/functions-compat@0.4.1':
 543 |     resolution: {integrity: sha512-AxxUBXKuPrWaVNQ8o1cG1GaCAtXT8a0eaTDfqgS5VsRYLAR0ALcfqDLwo/QyijZj1w8Qf8n3Qrfy/+Im245hOQ==}
 544 |     engines: {node: '>=20.0.0'}
 545 |     peerDependencies:
 546 |       '@firebase/app-compat': 0.x
 547 | 
 548 |   '@firebase/functions-types@0.6.3':
 549 |     resolution: {integrity: sha512-EZoDKQLUHFKNx6VLipQwrSMh01A1SaL3Wg6Hpi//x6/fJ6Ee4hrAeswK99I5Ht8roiniKHw4iO0B1Oxj5I4plg==}
 550 | 
 551 |   '@firebase/functions@0.13.1':
 552 |     resolution: {integrity: sha512-sUeWSb0rw5T+6wuV2o9XNmh9yHxjFI9zVGFnjFi+n7drTEWpl7ZTz1nROgGrSu472r+LAaj+2YaSicD4R8wfbw==}
 553 |     engines: {node: '>=20.0.0'}
 554 |     peerDependencies:
 555 |       '@firebase/app': 0.x
 556 | 
 557 |   '@firebase/installations-compat@0.2.19':
 558 |     resolution: {integrity: sha512-khfzIY3EI5LePePo7vT19/VEIH1E3iYsHknI/6ek9T8QCozAZshWT9CjlwOzZrKvTHMeNcbpo/VSOSIWDSjWdQ==}
 559 |     peerDependencies:
 560 |       '@firebase/app-compat': 0.x
 561 | 
 562 |   '@firebase/installations-types@0.5.3':
 563 |     resolution: {integrity: sha512-2FJI7gkLqIE0iYsNQ1P751lO3hER+Umykel+TkLwHj6plzWVxqvfclPUZhcKFVQObqloEBTmpi2Ozn7EkCABAA==}
 564 |     peerDependencies:
 565 |       '@firebase/app-types': 0.x
 566 | 
 567 |   '@firebase/installations@0.6.19':
 568 |     resolution: {integrity: sha512-nGDmiwKLI1lerhwfwSHvMR9RZuIH5/8E3kgUWnVRqqL7kGVSktjLTWEMva7oh5yxQ3zXfIlIwJwMcaM5bK5j8Q==}
 569 |     peerDependencies:
 570 |       '@firebase/app': 0.x
 571 | 
 572 |   '@firebase/logger@0.5.0':
 573 |     resolution: {integrity: sha512-cGskaAvkrnh42b3BA3doDWeBmuHFO/Mx5A83rbRDYakPjO9bJtRL3dX7javzc2Rr/JHZf4HlterTW2lUkfeN4g==}
 574 |     engines: {node: '>=20.0.0'}
 575 | 
 576 |   '@firebase/messaging-compat@0.2.23':
 577 |     resolution: {integrity: sha512-SN857v/kBUvlQ9X/UjAqBoQ2FEaL1ZozpnmL1ByTe57iXkmnVVFm9KqAsTfmf+OEwWI4kJJe9NObtN/w22lUgg==}
 578 |     peerDependencies:
 579 |       '@firebase/app-compat': 0.x
 580 | 
 581 |   '@firebase/messaging-interop-types@0.2.3':
 582 |     resolution: {integrity: sha512-xfzFaJpzcmtDjycpDeCUj0Ge10ATFi/VHVIvEEjDNc3hodVBQADZ7BWQU7CuFpjSHE+eLuBI13z5F/9xOoGX8Q==}
 583 | 
 584 |   '@firebase/messaging@0.12.23':
 585 |     resolution: {integrity: sha512-cfuzv47XxqW4HH/OcR5rM+AlQd1xL/VhuaeW/wzMW1LFrsFcTn0GND/hak1vkQc2th8UisBcrkVcQAnOnKwYxg==}
 586 |     peerDependencies:
 587 |       '@firebase/app': 0.x
 588 | 
 589 |   '@firebase/performance-compat@0.2.22':
 590 |     resolution: {integrity: sha512-xLKxaSAl/FVi10wDX/CHIYEUP13jXUjinL+UaNXT9ByIvxII5Ne5150mx6IgM8G6Q3V+sPiw9C8/kygkyHUVxg==}
 591 |     peerDependencies:
 592 |       '@firebase/app-compat': 0.x
 593 | 
 594 |   '@firebase/performance-types@0.2.3':
 595 |     resolution: {integrity: sha512-IgkyTz6QZVPAq8GSkLYJvwSLr3LS9+V6vNPQr0x4YozZJiLF5jYixj0amDtATf1X0EtYHqoPO48a9ija8GocxQ==}
 596 | 
 597 |   '@firebase/performance@0.7.9':
 598 |     resolution: {integrity: sha512-UzybENl1EdM2I1sjYm74xGt/0JzRnU/0VmfMAKo2LSpHJzaj77FCLZXmYQ4oOuE+Pxtt8Wy2BVJEENiZkaZAzQ==}
 599 |     peerDependencies:
 600 |       '@firebase/app': 0.x
 601 | 
 602 |   '@firebase/remote-config-compat@0.2.19':
 603 |     resolution: {integrity: sha512-y7PZAb0l5+5oIgLJr88TNSelxuASGlXyAKj+3pUc4fDuRIdPNBoONMHaIUa9rlffBR5dErmaD2wUBJ7Z1a513Q==}
 604 |     peerDependencies:
 605 |       '@firebase/app-compat': 0.x
 606 | 
 607 |   '@firebase/remote-config-types@0.4.0':
 608 |     resolution: {integrity: sha512-7p3mRE/ldCNYt8fmWMQ/MSGRmXYlJ15Rvs9Rk17t8p0WwZDbeK7eRmoI1tvCPaDzn9Oqh+yD6Lw+sGLsLg4kKg==}
 609 | 
 610 |   '@firebase/remote-config@0.6.6':
 611 |     resolution: {integrity: sha512-Yelp5xd8hM4NO1G1SuWrIk4h5K42mNwC98eWZ9YLVu6Z0S6hFk1mxotAdCRmH2luH8FASlYgLLq6OQLZ4nbnCA==}
 612 |     peerDependencies:
 613 |       '@firebase/app': 0.x
 614 | 
 615 |   '@firebase/storage-compat@0.4.0':
 616 |     resolution: {integrity: sha512-vDzhgGczr1OfcOy285YAPur5pWDEvD67w4thyeCUh6Ys0izN9fNYtA1MJERmNBfqjqu0lg0FM5GLbw0Il21M+g==}
 617 |     engines: {node: '>=20.0.0'}
 618 |     peerDependencies:
 619 |       '@firebase/app-compat': 0.x
 620 | 
 621 |   '@firebase/storage-types@0.8.3':
 622 |     resolution: {integrity: sha512-+Muk7g9uwngTpd8xn9OdF/D48uiQ7I1Fae7ULsWPuKoCH3HU7bfFPhxtJYzyhjdniowhuDpQcfPmuNRAqZEfvg==}
 623 |     peerDependencies:
 624 |       '@firebase/app-types': 0.x
 625 |       '@firebase/util': 1.x
 626 | 
 627 |   '@firebase/storage@0.14.0':
 628 |     resolution: {integrity: sha512-xWWbb15o6/pWEw8H01UQ1dC5U3rf8QTAzOChYyCpafV6Xki7KVp3Yaw2nSklUwHEziSWE9KoZJS7iYeyqWnYFA==}
 629 |     engines: {node: '>=20.0.0'}
 630 |     peerDependencies:
 631 |       '@firebase/app': 0.x
 632 | 
 633 |   '@firebase/util@1.13.0':
 634 |     resolution: {integrity: sha512-0AZUyYUfpMNcztR5l09izHwXkZpghLgCUaAGjtMwXnCg3bj4ml5VgiwqOMOxJ+Nw4qN/zJAaOQBcJ7KGkWStqQ==}
 635 |     engines: {node: '>=20.0.0'}
 636 | 
 637 |   '@firebase/webchannel-wrapper@1.0.4':
 638 |     resolution: {integrity: sha512-6m8+P+dE/RPl4OPzjTxcTbQ0rGeRyeTvAi9KwIffBVCiAMKrfXfLZaqD1F+m8t4B5/Q5aHsMozOgirkH1F5oMQ==}
 639 | 
 640 |   '@floating-ui/core@1.7.3':
 641 |     resolution: {integrity: sha512-sGnvb5dmrJaKEZ+LDIpguvdX3bDlEllmv4/ClQ9awcmCZrlx5jQyyMWFM5kBI+EyNOCDDiKk8il0zeuX3Zlg/w==}
 642 | 
 643 |   '@floating-ui/dom@1.7.4':
 644 |     resolution: {integrity: sha512-OOchDgh4F2CchOX94cRVqhvy7b3AFb+/rQXyswmzmGakRfkMgoWVjfnLWkRirfLEfuD4ysVW16eXzwt3jHIzKA==}
 645 | 
 646 |   '@floating-ui/react-dom@2.1.6':
 647 |     resolution: {integrity: sha512-4JX6rEatQEvlmgU80wZyq9RT96HZJa88q8hp0pBd+LrczeDI4o6uA2M+uvxngVHo4Ihr8uibXxH6+70zhAFrVw==}
 648 |     peerDependencies:
 649 |       react: ^19
 650 |       react-dom: ^19
 651 | 
 652 |   '@floating-ui/utils@0.2.10':
 653 |     resolution: {integrity: sha512-aGTxbpbg8/b5JfU1HXSrbH3wXZuLPJcNEcZQFMxLs3oSzgtVu6nFPkbbGGUvBcUjKV2YyB9Wxxabo+HEH9tcRQ==}
 654 | 
 655 |   '@google-cloud/firestore@7.11.3':
 656 |     resolution: {integrity: sha512-qsM3/WHpawF07SRVvEJJVRwhYzM7o9qtuksyuqnrMig6fxIrwWnsezECWsG/D5TyYru51Fv5c/RTqNDQ2yU+4w==}
 657 |     engines: {node: '>=14.0.0'}
 658 | 
 659 |   '@google-cloud/paginator@5.0.2':
 660 |     resolution: {integrity: sha512-DJS3s0OVH4zFDB1PzjxAsHqJT6sKVbRwwML0ZBP9PbU7Yebtu/7SWMRzvO2J3nUi9pRNITCfu4LJeooM2w4pjg==}
 661 |     engines: {node: '>=14.0.0'}
 662 | 
 663 |   '@google-cloud/projectify@4.0.0':
 664 |     resolution: {integrity: sha512-MmaX6HeSvyPbWGwFq7mXdo0uQZLGBYCwziiLIGq5JVX+/bdI3SAq6bP98trV5eTWfLuvsMcIC1YJOF2vfteLFA==}
 665 |     engines: {node: '>=14.0.0'}
 666 | 
 667 |   '@google-cloud/promisify@4.0.0':
 668 |     resolution: {integrity: sha512-Orxzlfb9c67A15cq2JQEyVc7wEsmFBmHjZWZYQMUyJ1qivXyMwdyNOs9odi79hze+2zqdTtu1E19IM/FtqZ10g==}
 669 |     engines: {node: '>=14'}
 670 | 
 671 |   '@google-cloud/storage@7.17.0':
 672 |     resolution: {integrity: sha512-5m9GoZqKh52a1UqkxDBu/+WVFDALNtHg5up5gNmNbXQWBcV813tzJKsyDtKjOPrlR1em1TxtD7NSPCrObH7koQ==}
 673 |     engines: {node: '>=14'}
 674 | 
 675 |   '@google/generative-ai@0.24.1':
 676 |     resolution: {integrity: sha512-MqO+MLfM6kjxcKoy0p1wRzG3b4ZZXtPI+z2IE26UogS2Cm/XHO+7gGRBh6gcJsOiIVoH93UwKvW4HdgiOZCy9Q==}
 677 |     engines: {node: '>=18.0.0'}
 678 | 
 679 |   '@googlemaps/js-api-loader@1.16.10':
 680 |     resolution: {integrity: sha512-c2erv2k7P2ilYzMmtYcMgAR21AULosQuUHJbStnrvRk2dG93k5cqptDrh9A8p+ZNlyhiqEOgHW7N9PAizdUM7Q==}
 681 | 
 682 |   '@grpc/grpc-js@1.13.4':
 683 |     resolution: {integrity: sha512-GsFaMXCkMqkKIvwCQjCrwH+GHbPKBjhwo/8ZuUkWHqbI73Kky9I+pQltrlT0+MWpedCoosda53lgjYfyEPgxBg==}
 684 |     engines: {node: '>=12.10.0'}
 685 | 
 686 |   '@grpc/grpc-js@1.9.15':
 687 |     resolution: {integrity: sha512-nqE7Hc0AzI+euzUwDAy0aY5hCp10r734gMGRdU+qOPX0XSceI2ULrcXB5U2xSc5VkWwalCj4M7GzCAygZl2KoQ==}
 688 |     engines: {node: ^8.13.0 || >=10.10.0}
 689 | 
 690 |   '@grpc/proto-loader@0.7.15':
 691 |     resolution: {integrity: sha512-tMXdRCfYVixjuFK+Hk0Q1s38gV9zDiDJfWL3h1rv4Qc39oILCu1TRTDt7+fGUI8K4G1Fj125Hx/ru3azECWTyQ==}
 692 |     engines: {node: '>=6'}
 693 |     hasBin: true
 694 | 
 695 |   '@hookform/resolvers@3.10.0':
 696 |     resolution: {integrity: sha512-79Dv+3mDF7i+2ajj7SkypSKHhl1cbln1OGavqrsF7p6mbUv11xpqpacPsGDCTRvCSjEEIez2ef1NveSVL3b0Ag==}
 697 |     peerDependencies:
 698 |       react-hook-form: ^7.0.0
 699 | 
 700 |   '@img/sharp-darwin-arm64@0.33.5':
 701 |     resolution: {integrity: sha512-UT4p+iz/2H4twwAoLCqfA9UH5pI6DggwKEGuaPy7nCVQ8ZsiY5PIcrRvD1DzuY3qYL07NtIQcWnBSY/heikIFQ==}
 702 |     engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
 703 |     cpu: [arm64]
 704 |     os: [darwin]
 705 | 
 706 |   '@img/sharp-darwin-x64@0.33.5':
 707 |     resolution: {integrity: sha512-fyHac4jIc1ANYGRDxtiqelIbdWkIuQaI84Mv45KvGRRxSAa7o7d1ZKAOBaYbnepLC1WqxfpimdeWfvqqSGwR2Q==}
 708 |     engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
 709 |     cpu: [x64]
 710 |     os: [darwin]
 711 | 
 712 |   '@img/sharp-libvips-darwin-arm64@1.0.4':
 713 |     resolution: {integrity: sha512-XblONe153h0O2zuFfTAbQYAX2JhYmDHeWikp1LM9Hul9gVPjFY427k6dFEcOL72O01QxQsWi761svJ/ev9xEDg==}
 714 |     cpu: [arm64]
 715 |     os: [darwin]
 716 | 
 717 |   '@img/sharp-libvips-darwin-x64@1.0.4':
 718 |     resolution: {integrity: sha512-xnGR8YuZYfJGmWPvmlunFaWJsb9T/AO2ykoP3Fz/0X5XV2aoYBPkX6xqCQvUTKKiLddarLaxpzNe+b1hjeWHAQ==}
 719 |     cpu: [x64]
 720 |     os: [darwin]
 721 | 
 722 |   '@img/sharp-libvips-linux-arm64@1.0.4':
 723 |     resolution: {integrity: sha512-9B+taZ8DlyyqzZQnoeIvDVR/2F4EbMepXMc/NdVbkzsJbzkUjhXv/70GQJ7tdLA4YJgNP25zukcxpX2/SueNrA==}
 724 |     cpu: [arm64]
 725 |     os: [linux]
 726 | 
 727 |   '@img/sharp-libvips-linux-arm@1.0.5':
 728 |     resolution: {integrity: sha512-gvcC4ACAOPRNATg/ov8/MnbxFDJqf/pDePbBnuBDcjsI8PssmjoKMAz4LtLaVi+OnSb5FK/yIOamqDwGmXW32g==}
 729 |     cpu: [arm]
 730 |     os: [linux]
 731 | 
 732 |   '@img/sharp-libvips-linux-s390x@1.0.4':
 733 |     resolution: {integrity: sha512-u7Wz6ntiSSgGSGcjZ55im6uvTrOxSIS8/dgoVMoiGE9I6JAfU50yH5BoDlYA1tcuGS7g/QNtetJnxA6QEsCVTA==}
 734 |     cpu: [s390x]
 735 |     os: [linux]
 736 | 
 737 |   '@img/sharp-libvips-linux-x64@1.0.4':
 738 |     resolution: {integrity: sha512-MmWmQ3iPFZr0Iev+BAgVMb3ZyC4KeFc3jFxnNbEPas60e1cIfevbtuyf9nDGIzOaW9PdnDciJm+wFFaTlj5xYw==}
 739 |     cpu: [x64]
 740 |     os: [linux]
 741 | 
 742 |   '@img/sharp-libvips-linuxmusl-arm64@1.0.4':
 743 |     resolution: {integrity: sha512-9Ti+BbTYDcsbp4wfYib8Ctm1ilkugkA/uscUn6UXK1ldpC1JjiXbLfFZtRlBhjPZ5o1NCLiDbg8fhUPKStHoTA==}
 744 |     cpu: [arm64]
 745 |     os: [linux]
 746 | 
 747 |   '@img/sharp-libvips-linuxmusl-x64@1.0.4':
 748 |     resolution: {integrity: sha512-viYN1KX9m+/hGkJtvYYp+CCLgnJXwiQB39damAO7WMdKWlIhmYTfHjwSbQeUK/20vY154mwezd9HflVFM1wVSw==}
 749 |     cpu: [x64]
 750 |     os: [linux]
 751 | 
 752 |   '@img/sharp-linux-arm64@0.33.5':
 753 |     resolution: {integrity: sha512-JMVv+AMRyGOHtO1RFBiJy/MBsgz0x4AWrT6QoEVVTyh1E39TrCUpTRI7mx9VksGX4awWASxqCYLCV4wBZHAYxA==}
 754 |     engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
 755 |     cpu: [arm64]
 756 |     os: [linux]
 757 | 
 758 |   '@img/sharp-linux-arm@0.33.5':
 759 |     resolution: {integrity: sha512-JTS1eldqZbJxjvKaAkxhZmBqPRGmxgu+qFKSInv8moZ2AmT5Yib3EQ1c6gp493HvrvV8QgdOXdyaIBrhvFhBMQ==}
 760 |     engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
 761 |     cpu: [arm]
 762 |     os: [linux]
 763 | 
 764 |   '@img/sharp-linux-s390x@0.33.5':
 765 |     resolution: {integrity: sha512-y/5PCd+mP4CA/sPDKl2961b+C9d+vPAveS33s6Z3zfASk2j5upL6fXVPZi7ztePZ5CuH+1kW8JtvxgbuXHRa4Q==}
 766 |     engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
 767 |     cpu: [s390x]
 768 |     os: [linux]
 769 | 
 770 |   '@img/sharp-linux-x64@0.33.5':
 771 |     resolution: {integrity: sha512-opC+Ok5pRNAzuvq1AG0ar+1owsu842/Ab+4qvU879ippJBHvyY5n2mxF1izXqkPYlGuP/M556uh53jRLJmzTWA==}
 772 |     engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
 773 |     cpu: [x64]
 774 |     os: [linux]
 775 | 
 776 |   '@img/sharp-linuxmusl-arm64@0.33.5':
 777 |     resolution: {integrity: sha512-XrHMZwGQGvJg2V/oRSUfSAfjfPxO+4DkiRh6p2AFjLQztWUuY/o8Mq0eMQVIY7HJ1CDQUJlxGGZRw1a5bqmd1g==}
 778 |     engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
 779 |     cpu: [arm64]
 780 |     os: [linux]
 781 | 
 782 |   '@img/sharp-linuxmusl-x64@0.33.5':
 783 |     resolution: {integrity: sha512-WT+d/cgqKkkKySYmqoZ8y3pxx7lx9vVejxW/W4DOFMYVSkErR+w7mf2u8m/y4+xHe7yY9DAXQMWQhpnMuFfScw==}
 784 |     engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
 785 |     cpu: [x64]
 786 |     os: [linux]
 787 | 
 788 |   '@img/sharp-wasm32@0.33.5':
 789 |     resolution: {integrity: sha512-ykUW4LVGaMcU9lu9thv85CbRMAwfeadCJHRsg2GmeRa/cJxsVY9Rbd57JcMxBkKHag5U/x7TSBpScF4U8ElVzg==}
 790 |     engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
 791 |     cpu: [wasm32]
 792 | 
 793 |   '@img/sharp-win32-ia32@0.33.5':
 794 |     resolution: {integrity: sha512-T36PblLaTwuVJ/zw/LaH0PdZkRz5rd3SmMHX8GSmR7vtNSP5Z6bQkExdSK7xGWyxLw4sUknBuugTelgw2faBbQ==}
 795 |     engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
 796 |     cpu: [ia32]
 797 |     os: [win32]
 798 | 
 799 |   '@img/sharp-win32-x64@0.33.5':
 800 |     resolution: {integrity: sha512-MpY/o8/8kj+EcnxwvrP4aTJSWw/aZ7JIGR4aBeZkZw5B7/Jn+tY9/VNwtcoGmdT7GfggGIU4kygOMSbYnOrAbg==}
 801 |     engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
 802 |     cpu: [x64]
 803 |     os: [win32]
 804 | 
 805 |   '@isaacs/cliui@8.0.2':
 806 |     resolution: {integrity: sha512-O8jcjabXaleOG9DQ0+ARXWZBTfnP4WNAqzuiJK7ll44AmxGKv/J2M4TPjxjY3znBCfvBXFzucm1twdyFybFqEA==}
 807 |     engines: {node: '>=12'}
 808 | 
 809 |   '@jridgewell/gen-mapping@0.3.13':
 810 |     resolution: {integrity: sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==}
 811 | 
 812 |   '@jridgewell/remapping@2.3.5':
 813 |     resolution: {integrity: sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==}
 814 | 
 815 |   '@jridgewell/resolve-uri@3.1.2':
 816 |     resolution: {integrity: sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==}
 817 |     engines: {node: '>=6.0.0'}
 818 | 
 819 |   '@jridgewell/sourcemap-codec@1.5.5':
 820 |     resolution: {integrity: sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==}
 821 | 
 822 |   '@jridgewell/trace-mapping@0.3.30':
 823 |     resolution: {integrity: sha512-GQ7Nw5G2lTu/BtHTKfXhKHok2WGetd4XYcVKGx00SjAk8GMwgJM3zr6zORiPGuOE+/vkc90KtTosSSvaCjKb2Q==}
 824 | 
 825 |   '@js-sdsl/ordered-map@4.4.2':
 826 |     resolution: {integrity: sha512-iUKgm52T8HOE/makSxjqoWhe95ZJA1/G1sYsGev2JDKUSS14KAgg1LHb+Ba+IPow0xflbnSkOsZcO08C7w1gYw==}
 827 | 
 828 |   '@next/env@15.2.4':
 829 |     resolution: {integrity: sha512-+SFtMgoiYP3WoSswuNmxJOCwi06TdWE733D+WPjpXIe4LXGULwEaofiiAy6kbS0+XjM5xF5n3lKuBwN2SnqD9g==}
 830 | 
 831 |   '@next/swc-darwin-arm64@15.2.4':
 832 |     resolution: {integrity: sha512-1AnMfs655ipJEDC/FHkSr0r3lXBgpqKo4K1kiwfUf3iE68rDFXZ1TtHdMvf7D0hMItgDZ7Vuq3JgNMbt/+3bYw==}
 833 |     engines: {node: '>= 10'}
 834 |     cpu: [arm64]
 835 |     os: [darwin]
 836 | 
 837 |   '@next/swc-darwin-x64@15.2.4':
 838 |     resolution: {integrity: sha512-3qK2zb5EwCwxnO2HeO+TRqCubeI/NgCe+kL5dTJlPldV/uwCnUgC7VbEzgmxbfrkbjehL4H9BPztWOEtsoMwew==}
 839 |     engines: {node: '>= 10'}
 840 |     cpu: [x64]
 841 |     os: [darwin]
 842 | 
 843 |   '@next/swc-linux-arm64-gnu@15.2.4':
 844 |     resolution: {integrity: sha512-HFN6GKUcrTWvem8AZN7tT95zPb0GUGv9v0d0iyuTb303vbXkkbHDp/DxufB04jNVD+IN9yHy7y/6Mqq0h0YVaQ==}
 845 |     engines: {node: '>= 10'}
 846 |     cpu: [arm64]
 847 |     os: [linux]
 848 | 
 849 |   '@next/swc-linux-arm64-musl@15.2.4':
 850 |     resolution: {integrity: sha512-Oioa0SORWLwi35/kVB8aCk5Uq+5/ZIumMK1kJV+jSdazFm2NzPDztsefzdmzzpx5oGCJ6FkUC7vkaUseNTStNA==}
 851 |     engines: {node: '>= 10'}
 852 |     cpu: [arm64]
 853 |     os: [linux]
 854 | 
 855 |   '@next/swc-linux-x64-gnu@15.2.4':
 856 |     resolution: {integrity: sha512-yb5WTRaHdkgOqFOZiu6rHV1fAEK0flVpaIN2HB6kxHVSy/dIajWbThS7qON3W9/SNOH2JWkVCyulgGYekMePuw==}
 857 |     engines: {node: '>= 10'}
 858 |     cpu: [x64]
 859 |     os: [linux]
 860 | 
 861 |   '@next/swc-linux-x64-musl@15.2.4':
 862 |     resolution: {integrity: sha512-Dcdv/ix6srhkM25fgXiyOieFUkz+fOYkHlydWCtB0xMST6X9XYI3yPDKBZt1xuhOytONsIFJFB08xXYsxUwJLw==}
 863 |     engines: {node: '>= 10'}
 864 |     cpu: [x64]
 865 |     os: [linux]
 866 | 
 867 |   '@next/swc-win32-arm64-msvc@15.2.4':
 868 |     resolution: {integrity: sha512-dW0i7eukvDxtIhCYkMrZNQfNicPDExt2jPb9AZPpL7cfyUo7QSNl1DjsHjmmKp6qNAqUESyT8YFl/Aw91cNJJg==}
 869 |     engines: {node: '>= 10'}
 870 |     cpu: [arm64]
 871 |     os: [win32]
 872 | 
 873 |   '@next/swc-win32-x64-msvc@15.2.4':
 874 |     resolution: {integrity: sha512-SbnWkJmkS7Xl3kre8SdMF6F/XDh1DTFEhp0jRTj/uB8iPKoU2bb2NDfcu+iifv1+mxQEd1g2vvSxcZbXSKyWiQ==}
 875 |     engines: {node: '>= 10'}
 876 |     cpu: [x64]
 877 |     os: [win32]
 878 | 
 879 |   '@nodelib/fs.scandir@2.1.5':
 880 |     resolution: {integrity: sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==}
 881 |     engines: {node: '>= 8'}
 882 | 
 883 |   '@nodelib/fs.stat@2.0.5':
 884 |     resolution: {integrity: sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==}
 885 |     engines: {node: '>= 8'}
 886 | 
 887 |   '@nodelib/fs.walk@1.2.8':
 888 |     resolution: {integrity: sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==}
 889 |     engines: {node: '>= 8'}
 890 | 
 891 |   '@opentelemetry/api@1.9.0':
 892 |     resolution: {integrity: sha512-3giAOQvZiH5F9bMlMiv8+GSPMeqg0dbaeo58/0SlA9sxSqZhnUtxzX9/2FzyhS9sWQf5S0GJE0AKBrFqjpeYcg==}
 893 |     engines: {node: '>=8.0.0'}
 894 | 
 895 |   '@pkgjs/parseargs@0.11.0':
 896 |     resolution: {integrity: sha512-+1VkjdD0QBLPodGrJUeqarH8VAIvQODIbwh9XpP5Syisf7YoQgsJKPNFoqqLQlu+VQ/tVSshMR6loPMn8U+dPg==}
 897 |     engines: {node: '>=14'}
 898 | 
 899 |   '@polka/url@1.0.0-next.29':
 900 |     resolution: {integrity: sha512-wwQAWhWSuHaag8c4q/KN/vCoeOJYshAIvMQwD4GpSb3OiZklFfvAgmj0VCBBImRpuF/aFgIRzllXlVX93Jevww==}
 901 | 
 902 |   '@protobufjs/aspromise@1.1.2':
 903 |     resolution: {integrity: sha512-j+gKExEuLmKwvz3OgROXtrJ2UG2x8Ch2YZUxahh+s1F2HZ+wAceUNLkvy6zKCPVRkU++ZWQrdxsUeQXmcg4uoQ==}
 904 | 
 905 |   '@protobufjs/base64@1.1.2':
 906 |     resolution: {integrity: sha512-AZkcAA5vnN/v4PDqKyMR5lx7hZttPDgClv83E//FMNhR2TMcLUhfRUBHCmSl0oi9zMgDDqRUJkSxO3wm85+XLg==}
 907 | 
 908 |   '@protobufjs/codegen@2.0.4':
 909 |     resolution: {integrity: sha512-YyFaikqM5sH0ziFZCN3xDC7zeGaB/d0IUb9CATugHWbd1FRFwWwt4ld4OYMPWu5a3Xe01mGAULCdqhMlPl29Jg==}
 910 | 
 911 |   '@protobufjs/eventemitter@1.1.0':
 912 |     resolution: {integrity: sha512-j9ednRT81vYJ9OfVuXG6ERSTdEL1xVsNgqpkxMsbIabzSo3goCjDIveeGv5d03om39ML71RdmrGNjG5SReBP/Q==}
 913 | 
 914 |   '@protobufjs/fetch@1.1.0':
 915 |     resolution: {integrity: sha512-lljVXpqXebpsijW71PZaCYeIcE5on1w5DlQy5WH6GLbFryLUrBD4932W/E2BSpfRJWseIL4v/KPgBFxDOIdKpQ==}
 916 | 
 917 |   '@protobufjs/float@1.0.2':
 918 |     resolution: {integrity: sha512-Ddb+kVXlXst9d+R9PfTIxh1EdNkgoRe5tOX6t01f1lYWOvJnSPDBlG241QLzcyPdoNTsblLUdujGSE4RzrTZGQ==}
 919 | 
 920 |   '@protobufjs/inquire@1.1.0':
 921 |     resolution: {integrity: sha512-kdSefcPdruJiFMVSbn801t4vFK7KB/5gd2fYvrxhuJYg8ILrmn9SKSX2tZdV6V+ksulWqS7aXjBcRXl3wHoD9Q==}
 922 | 
 923 |   '@protobufjs/path@1.1.2':
 924 |     resolution: {integrity: sha512-6JOcJ5Tm08dOHAbdR3GrvP+yUUfkjG5ePsHYczMFLq3ZmMkAD98cDgcT2iA1lJ9NVwFd4tH/iSSoe44YWkltEA==}
 925 | 
 926 |   '@protobufjs/pool@1.1.0':
 927 |     resolution: {integrity: sha512-0kELaGSIDBKvcgS4zkjz1PeddatrjYcmMWOlAuAPwAeccUrPHdUqo/J6LiymHHEiJT5NrF1UVwxY14f+fy4WQw==}
 928 | 
 929 |   '@protobufjs/utf8@1.1.0':
 930 |     resolution: {integrity: sha512-Vvn3zZrhQZkkBE8LSuW3em98c0FwgO4nxzv6OdSxPKJIEKY2bGbHn+mhGIPerzI4twdxaP8/0+06HBpwf345Lw==}
 931 | 
 932 |   '@radix-ui/number@1.1.1':
 933 |     resolution: {integrity: sha512-MkKCwxlXTgz6CFoJx3pCwn07GKp36+aZyu/u2Ln2VrA5DcdyCZkASEDBTd8x5whTQQL5CiYf4prXKLcgQdv29g==}
 934 | 
 935 |   '@radix-ui/primitive@1.1.1':
 936 |     resolution: {integrity: sha512-SJ31y+Q/zAyShtXJc8x83i9TYdbAfHZ++tUZnvjJJqFjzsdUnKsxPL6IEtBlxKkU7yzer//GQtZSV4GbldL3YA==}
 937 | 
 938 |   '@radix-ui/primitive@1.1.3':
 939 |     resolution: {integrity: sha512-JTF99U/6XIjCBo0wqkU5sK10glYe27MRRsfwoiq5zzOEZLHU3A3KCMa5X/azekYRCJ0HlwI0crAXS/5dEHTzDg==}
 940 | 
 941 |   '@radix-ui/react-accordion@1.2.2':
 942 |     resolution: {integrity: sha512-b1oh54x4DMCdGsB4/7ahiSrViXxaBwRPotiZNnYXjLha9vfuURSAZErki6qjDoSIV0eXx5v57XnTGVtGwnfp2g==}
 943 |     peerDependencies:
 944 |       '@types/react': ^19
 945 |       '@types/react-dom': ^19
 946 |       react: ^19
 947 |       react-dom: ^19
 948 |     peerDependenciesMeta:
 949 |       '@types/react':
 950 |         optional: true
 951 |       '@types/react-dom':
 952 |         optional: true
 953 | 
 954 |   '@radix-ui/react-alert-dialog@1.1.4':
 955 |     resolution: {integrity: sha512-A6Kh23qZDLy3PSU4bh2UJZznOrUdHImIXqF8YtUa6CN73f8EOO9XlXSCd9IHyPvIquTaa/kwaSWzZTtUvgXVGw==}
 956 |     peerDependencies:
 957 |       '@types/react': ^19
 958 |       '@types/react-dom': ^19
 959 |       react: ^19
 960 |       react-dom: ^19
 961 |     peerDependenciesMeta:
 962 |       '@types/react':
 963 |         optional: true
 964 |       '@types/react-dom':
 965 |         optional: true
 966 | 
 967 |   '@radix-ui/react-arrow@1.1.1':
 968 |     resolution: {integrity: sha512-NaVpZfmv8SKeZbn4ijN2V3jlHA9ngBG16VnIIm22nUR0Yk8KUALyBxT3KYEUnNuch9sTE8UTsS3whzBgKOL30w==}
 969 |     peerDependencies:
 970 |       '@types/react': ^19
 971 |       '@types/react-dom': ^19
 972 |       react: ^19
 973 |       react-dom: ^19
 974 |     peerDependenciesMeta:
 975 |       '@types/react':
 976 |         optional: true
 977 |       '@types/react-dom':
 978 |         optional: true
 979 | 
 980 |   '@radix-ui/react-arrow@1.1.7':
 981 |     resolution: {integrity: sha512-F+M1tLhO+mlQaOWspE8Wstg+z6PwxwRd8oQ8IXceWz92kfAmalTRf0EjrouQeo7QssEPfCn05B4Ihs1K9WQ/7w==}
 982 |     peerDependencies:
 983 |       '@types/react': ^19
 984 |       '@types/react-dom': ^19
 985 |       react: ^19
 986 |       react-dom: ^19
 987 |     peerDependenciesMeta:
 988 |       '@types/react':
 989 |         optional: true
 990 |       '@types/react-dom':
 991 |         optional: true
 992 | 
 993 |   '@radix-ui/react-aspect-ratio@1.1.1':
 994 |     resolution: {integrity: sha512-kNU4FIpcFMBLkOUcgeIteH06/8JLBcYY6Le1iKenDGCYNYFX3TQqCZjzkOsz37h7r94/99GTb7YhEr98ZBJibw==}
 995 |     peerDependencies:
 996 |       '@types/react': ^19
 997 |       '@types/react-dom': ^19
 998 |       react: ^19
 999 |       react-dom: ^19
1000 |     peerDependenciesMeta:
1001 |       '@types/react':
1002 |         optional: true
1003 |       '@types/react-dom':
1004 |         optional: true
1005 | 
1006 |   '@radix-ui/react-avatar@1.1.10':
1007 |     resolution: {integrity: sha512-V8piFfWapM5OmNCXTzVQY+E1rDa53zY+MQ4Y7356v4fFz6vqCyUtIz2rUD44ZEdwg78/jKmMJHj07+C/Z/rcog==}
1008 |     peerDependencies:
1009 |       '@types/react': ^19
1010 |       '@types/react-dom': ^19
1011 |       react: ^19
1012 |       react-dom: ^19
1013 |     peerDependenciesMeta:
1014 |       '@types/react':
1015 |         optional: true
1016 |       '@types/react-dom':
1017 |         optional: true
1018 | 
1019 |   '@radix-ui/react-checkbox@1.1.3':
1020 |     resolution: {integrity: sha512-HD7/ocp8f1B3e6OHygH0n7ZKjONkhciy1Nh0yuBgObqThc3oyx+vuMfFHKAknXRHHWVE9XvXStxJFyjUmB8PIw==}
1021 |     peerDependencies:
1022 |       '@types/react': ^19
1023 |       '@types/react-dom': ^19
1024 |       react: ^19
1025 |       react-dom: ^19
1026 |     peerDependenciesMeta:
1027 |       '@types/react':
1028 |         optional: true
1029 |       '@types/react-dom':
1030 |         optional: true
1031 | 
1032 |   '@radix-ui/react-collapsible@1.1.2':
1033 |     resolution: {integrity: sha512-PliMB63vxz7vggcyq0IxNYk8vGDrLXVWw4+W4B8YnwI1s18x7YZYqlG9PLX7XxAJUi0g2DxP4XKJMFHh/iVh9A==}
1034 |     peerDependencies:
1035 |       '@types/react': ^19
1036 |       '@types/react-dom': ^19
1037 |       react: ^19
1038 |       react-dom: ^19
1039 |     peerDependenciesMeta:
1040 |       '@types/react':
1041 |         optional: true
1042 |       '@types/react-dom':
1043 |         optional: true
1044 | 
1045 |   '@radix-ui/react-collection@1.1.1':
1046 |     resolution: {integrity: sha512-LwT3pSho9Dljg+wY2KN2mrrh6y3qELfftINERIzBUO9e0N+t0oMTyn3k9iv+ZqgrwGkRnLpNJrsMv9BZlt2yuA==}
1047 |     peerDependencies:
1048 |       '@types/react': ^19
1049 |       '@types/react-dom': ^19
1050 |       react: ^19
1051 |       react-dom: ^19
1052 |     peerDependenciesMeta:
1053 |       '@types/react':
1054 |         optional: true
1055 |       '@types/react-dom':
1056 |         optional: true
1057 | 
1058 |   '@radix-ui/react-collection@1.1.7':
1059 |     resolution: {integrity: sha512-Fh9rGN0MoI4ZFUNyfFVNU4y9LUz93u9/0K+yLgA2bwRojxM8JU1DyvvMBabnZPBgMWREAJvU2jjVzq+LrFUglw==}
1060 |     peerDependencies:
1061 |       '@types/react': ^19
1062 |       '@types/react-dom': ^19
1063 |       react: ^19
1064 |       react-dom: ^19
1065 |     peerDependenciesMeta:
1066 |       '@types/react':
1067 |         optional: true
1068 |       '@types/react-dom':
1069 |         optional: true
1070 | 
1071 |   '@radix-ui/react-compose-refs@1.1.1':
1072 |     resolution: {integrity: sha512-Y9VzoRDSJtgFMUCoiZBDVo084VQ5hfpXxVE+NgkdNsjiDBByiImMZKKhxMwCbdHvhlENG6a833CbFkOQvTricw==}
1073 |     peerDependencies:
1074 |       '@types/react': ^19
1075 |       react: ^19
1076 |     peerDependenciesMeta:
1077 |       '@types/react':
1078 |         optional: true
1079 | 
1080 |   '@radix-ui/react-compose-refs@1.1.2':
1081 |     resolution: {integrity: sha512-z4eqJvfiNnFMHIIvXP3CY57y2WJs5g2v3X0zm9mEJkrkNv4rDxu+sg9Jh8EkXyeqBkB7SOcboo9dMVqhyrACIg==}
1082 |     peerDependencies:
1083 |       '@types/react': ^19
1084 |       react: ^19
1085 |     peerDependenciesMeta:
1086 |       '@types/react':
1087 |         optional: true
1088 | 
1089 |   '@radix-ui/react-context-menu@2.2.4':
1090 |     resolution: {integrity: sha512-ap4wdGwK52rJxGkwukU1NrnEodsUFQIooANKu+ey7d6raQ2biTcEf8za1zr0mgFHieevRTB2nK4dJeN8pTAZGQ==}
1091 |     peerDependencies:
1092 |       '@types/react': ^19
1093 |       '@types/react-dom': ^19
1094 |       react: ^19
1095 |       react-dom: ^19
1096 |     peerDependenciesMeta:
1097 |       '@types/react':
1098 |         optional: true
1099 |       '@types/react-dom':
1100 |         optional: true
1101 | 
1102 |   '@radix-ui/react-context@1.1.1':
1103 |     resolution: {integrity: sha512-UASk9zi+crv9WteK/NU4PLvOoL3OuE6BWVKNF6hPRBtYBDXQ2u5iu3O59zUlJiTVvkyuycnqrztsHVJwcK9K+Q==}
1104 |     peerDependencies:
1105 |       '@types/react': ^19
1106 |       react: ^19
1107 |     peerDependenciesMeta:
1108 |       '@types/react':
1109 |         optional: true
1110 | 
1111 |   '@radix-ui/react-context@1.1.2':
1112 |     resolution: {integrity: sha512-jCi/QKUM2r1Ju5a3J64TH2A5SpKAgh0LpknyqdQ4m6DCV0xJ2HG1xARRwNGPQfi1SLdLWZ1OJz6F4OMBBNiGJA==}
1113 |     peerDependencies:
1114 |       '@types/react': ^19
1115 |       react: ^19
1116 |     peerDependenciesMeta:
1117 |       '@types/react':
1118 |         optional: true
1119 | 
1120 |   '@radix-ui/react-dialog@1.1.4':
1121 |     resolution: {integrity: sha512-Ur7EV1IwQGCyaAuyDRiOLA5JIUZxELJljF+MbM/2NC0BYwfuRrbpS30BiQBJrVruscgUkieKkqXYDOoByaxIoA==}
1122 |     peerDependencies:
1123 |       '@types/react': ^19
1124 |       '@types/react-dom': ^19
1125 |       react: ^19
1126 |       react-dom: ^19
1127 |     peerDependenciesMeta:
1128 |       '@types/react':
1129 |         optional: true
1130 |       '@types/react-dom':
1131 |         optional: true
1132 | 
1133 |   '@radix-ui/react-direction@1.1.0':
1134 |     resolution: {integrity: sha512-BUuBvgThEiAXh2DWu93XsT+a3aWrGqolGlqqw5VU1kG7p/ZH2cuDlM1sRLNnY3QcBS69UIz2mcKhMxDsdewhjg==}
1135 |     peerDependencies:
1136 |       '@types/react': ^19
1137 |       react: ^19
1138 |     peerDependenciesMeta:
1139 |       '@types/react':
1140 |         optional: true
1141 | 
1142 |   '@radix-ui/react-direction@1.1.1':
1143 |     resolution: {integrity: sha512-1UEWRX6jnOA2y4H5WczZ44gOOjTEmlqv1uNW4GAJEO5+bauCBhv8snY65Iw5/VOS/ghKN9gr2KjnLKxrsvoMVw==}
1144 |     peerDependencies:
1145 |       '@types/react': ^19
1146 |       react: ^19
1147 |     peerDependenciesMeta:
1148 |       '@types/react':
1149 |         optional: true
1150 | 
1151 |   '@radix-ui/react-dismissable-layer@1.1.11':
1152 |     resolution: {integrity: sha512-Nqcp+t5cTB8BinFkZgXiMJniQH0PsUt2k51FUhbdfeKvc4ACcG2uQniY/8+h1Yv6Kza4Q7lD7PQV0z0oicE0Mg==}
1153 |     peerDependencies:
1154 |       '@types/react': ^19
1155 |       '@types/react-dom': ^19
1156 |       react: ^19
1157 |       react-dom: ^19
1158 |     peerDependenciesMeta:
1159 |       '@types/react':
1160 |         optional: true
1161 |       '@types/react-dom':
1162 |         optional: true
1163 | 
1164 |   '@radix-ui/react-dismissable-layer@1.1.3':
1165 |     resolution: {integrity: sha512-onrWn/72lQoEucDmJnr8uczSNTujT0vJnA/X5+3AkChVPowr8n1yvIKIabhWyMQeMvvmdpsvcyDqx3X1LEXCPg==}
1166 |     peerDependencies:
1167 |       '@types/react': ^19
1168 |       '@types/react-dom': ^19
1169 |       react: ^19
1170 |       react-dom: ^19
1171 |     peerDependenciesMeta:
1172 |       '@types/react':
1173 |         optional: true
1174 |       '@types/react-dom':
1175 |         optional: true
1176 | 
1177 |   '@radix-ui/react-dropdown-menu@2.1.4':
1178 |     resolution: {integrity: sha512-iXU1Ab5ecM+yEepGAWK8ZhMyKX4ubFdCNtol4sT9D0OVErG9PNElfx3TQhjw7n7BC5nFVz68/5//clWy+8TXzA==}
1179 |     peerDependencies:
1180 |       '@types/react': ^19
1181 |       '@types/react-dom': ^19
1182 |       react: ^19
1183 |       react-dom: ^19
1184 |     peerDependenciesMeta:
1185 |       '@types/react':
1186 |         optional: true
1187 |       '@types/react-dom':
1188 |         optional: true
1189 | 
1190 |   '@radix-ui/react-focus-guards@1.1.1':
1191 |     resolution: {integrity: sha512-pSIwfrT1a6sIoDASCSpFwOasEwKTZWDw/iBdtnqKO7v6FeOzYJ7U53cPzYFVR3geGGXgVHaH+CdngrrAzqUGxg==}
1192 |     peerDependencies:
1193 |       '@types/react': ^19
1194 |       react: ^19
1195 |     peerDependenciesMeta:
1196 |       '@types/react':
1197 |         optional: true
1198 | 
1199 |   '@radix-ui/react-focus-guards@1.1.3':
1200 |     resolution: {integrity: sha512-0rFg/Rj2Q62NCm62jZw0QX7a3sz6QCQU0LpZdNrJX8byRGaGVTqbrW9jAoIAHyMQqsNpeZ81YgSizOt5WXq0Pw==}
1201 |     peerDependencies:
1202 |       '@types/react': ^19
1203 |       react: ^19
1204 |     peerDependenciesMeta:
1205 |       '@types/react':
1206 |         optional: true
1207 | 
1208 |   '@radix-ui/react-focus-scope@1.1.1':
1209 |     resolution: {integrity: sha512-01omzJAYRxXdG2/he/+xy+c8a8gCydoQ1yOxnWNcRhrrBW5W+RQJ22EK1SaO8tb3WoUsuEw7mJjBozPzihDFjA==}
1210 |     peerDependencies:
1211 |       '@types/react': ^19
1212 |       '@types/react-dom': ^19
1213 |       react: ^19
1214 |       react-dom: ^19
1215 |     peerDependenciesMeta:
1216 |       '@types/react':
1217 |         optional: true
1218 |       '@types/react-dom':
1219 |         optional: true
1220 | 
1221 |   '@radix-ui/react-focus-scope@1.1.7':
1222 |     resolution: {integrity: sha512-t2ODlkXBQyn7jkl6TNaw/MtVEVvIGelJDCG41Okq/KwUsJBwQ4XVZsHAVUkK4mBv3ewiAS3PGuUWuY2BoK4ZUw==}
1223 |     peerDependencies:
1224 |       '@types/react': ^19
1225 |       '@types/react-dom': ^19
1226 |       react: ^19
1227 |       react-dom: ^19
1228 |     peerDependenciesMeta:
1229 |       '@types/react':
1230 |         optional: true
1231 |       '@types/react-dom':
1232 |         optional: true
1233 | 
1234 |   '@radix-ui/react-hover-card@1.1.4':
1235 |     resolution: {integrity: sha512-QSUUnRA3PQ2UhvoCv3eYvMnCAgGQW+sTu86QPuNb+ZMi+ZENd6UWpiXbcWDQ4AEaKF9KKpCHBeaJz9Rw6lRlaQ==}
1236 |     peerDependencies:
1237 |       '@types/react': ^19
1238 |       '@types/react-dom': ^19
1239 |       react: ^19
1240 |       react-dom: ^19
1241 |     peerDependenciesMeta:
1242 |       '@types/react':
1243 |         optional: true
1244 |       '@types/react-dom':
1245 |         optional: true
1246 | 
1247 |   '@radix-ui/react-id@1.1.0':
1248 |     resolution: {integrity: sha512-EJUrI8yYh7WOjNOqpoJaf1jlFIH2LvtgAl+YcFqNCa+4hj64ZXmPkAKOFs/ukjz3byN6bdb/AVUqHkI8/uWWMA==}
1249 |     peerDependencies:
1250 |       '@types/react': ^19
1251 |       react: ^19
1252 |     peerDependenciesMeta:
1253 |       '@types/react':
1254 |         optional: true
1255 | 
1256 |   '@radix-ui/react-id@1.1.1':
1257 |     resolution: {integrity: sha512-kGkGegYIdQsOb4XjsfM97rXsiHaBwco+hFI66oO4s9LU+PLAC5oJ7khdOVFxkhsmlbpUqDAvXw11CluXP+jkHg==}
1258 |     peerDependencies:
1259 |       '@types/react': ^19
1260 |       react: ^19
1261 |     peerDependenciesMeta:
1262 |       '@types/react':
1263 |         optional: true
1264 | 
1265 |   '@radix-ui/react-label@2.1.7':
1266 |     resolution: {integrity: sha512-YT1GqPSL8kJn20djelMX7/cTRp/Y9w5IZHvfxQTVHrOqa2yMl7i/UfMqKRU5V7mEyKTrUVgJXhNQPVCG8PBLoQ==}
1267 |     peerDependencies:
1268 |       '@types/react': ^19
1269 |       '@types/react-dom': ^19
1270 |       react: ^19
1271 |       react-dom: ^19
1272 |     peerDependenciesMeta:
1273 |       '@types/react':
1274 |         optional: true
1275 |       '@types/react-dom':
1276 |         optional: true
1277 | 
1278 |   '@radix-ui/react-menu@2.1.4':
1279 |     resolution: {integrity: sha512-BnOgVoL6YYdHAG6DtXONaR29Eq4nvbi8rutrV/xlr3RQCMMb3yqP85Qiw/3NReozrSW+4dfLkK+rc1hb4wPU/A==}
1280 |     peerDependencies:
1281 |       '@types/react': ^19
1282 |       '@types/react-dom': ^19
1283 |       react: ^19
1284 |       react-dom: ^19
1285 |     peerDependenciesMeta:
1286 |       '@types/react':
1287 |         optional: true
1288 |       '@types/react-dom':
1289 |         optional: true
1290 | 
1291 |   '@radix-ui/react-menubar@1.1.4':
1292 |     resolution: {integrity: sha512-+KMpi7VAZuB46+1LD7a30zb5IxyzLgC8m8j42gk3N4TUCcViNQdX8FhoH1HDvYiA8quuqcek4R4bYpPn/SY1GA==}
1293 |     peerDependencies:
1294 |       '@types/react': ^19
1295 |       '@types/react-dom': ^19
1296 |       react: ^19
1297 |       react-dom: ^19
1298 |     peerDependenciesMeta:
1299 |       '@types/react':
1300 |         optional: true
1301 |       '@types/react-dom':
1302 |         optional: true
1303 | 
1304 |   '@radix-ui/react-navigation-menu@1.2.3':
1305 |     resolution: {integrity: sha512-IQWAsQ7dsLIYDrn0WqPU+cdM7MONTv9nqrLVYoie3BPiabSfUVDe6Fr+oEt0Cofsr9ONDcDe9xhmJbL1Uq1yKg==}
1306 |     peerDependencies:
1307 |       '@types/react': ^19
1308 |       '@types/react-dom': ^19
1309 |       react: ^19
1310 |       react-dom: ^19
1311 |     peerDependenciesMeta:
1312 |       '@types/react':
1313 |         optional: true
1314 |       '@types/react-dom':
1315 |         optional: true
1316 | 
1317 |   '@radix-ui/react-popover@1.1.15':
1318 |     resolution: {integrity: sha512-kr0X2+6Yy/vJzLYJUPCZEc8SfQcf+1COFoAqauJm74umQhta9M7lNJHP7QQS3vkvcGLQUbWpMzwrXYwrYztHKA==}
1319 |     peerDependencies:
1320 |       '@types/react': ^19
1321 |       '@types/react-dom': ^19
1322 |       react: ^19
1323 |       react-dom: ^19
1324 |     peerDependenciesMeta:
1325 |       '@types/react':
1326 |         optional: true
1327 |       '@types/react-dom':
1328 |         optional: true
1329 | 
1330 |   '@radix-ui/react-popper@1.2.1':
1331 |     resolution: {integrity: sha512-3kn5Me69L+jv82EKRuQCXdYyf1DqHwD2U/sxoNgBGCB7K9TRc3bQamQ+5EPM9EvyPdli0W41sROd+ZU1dTCztw==}
1332 |     peerDependencies:
1333 |       '@types/react': ^19
1334 |       '@types/react-dom': ^19
1335 |       react: ^19
1336 |       react-dom: ^19
1337 |     peerDependenciesMeta:
1338 |       '@types/react':
1339 |         optional: true
1340 |       '@types/react-dom':
1341 |         optional: true
1342 | 
1343 |   '@radix-ui/react-popper@1.2.8':
1344 |     resolution: {integrity: sha512-0NJQ4LFFUuWkE7Oxf0htBKS6zLkkjBH+hM1uk7Ng705ReR8m/uelduy1DBo0PyBXPKVnBA6YBlU94MBGXrSBCw==}
1345 |     peerDependencies:
1346 |       '@types/react': ^19
1347 |       '@types/react-dom': ^19
1348 |       react: ^19
1349 |       react-dom: ^19
1350 |     peerDependenciesMeta:
1351 |       '@types/react':
1352 |         optional: true
1353 |       '@types/react-dom':
1354 |         optional: true
1355 | 
1356 |   '@radix-ui/react-portal@1.1.3':
1357 |     resolution: {integrity: sha512-NciRqhXnGojhT93RPyDaMPfLH3ZSl4jjIFbZQ1b/vxvZEdHsBZ49wP9w8L3HzUQwep01LcWtkUvm0OVB5JAHTw==}
1358 |     peerDependencies:
1359 |       '@types/react': ^19
1360 |       '@types/react-dom': ^19
1361 |       react: ^19
1362 |       react-dom: ^19
1363 |     peerDependenciesMeta:
1364 |       '@types/react':
1365 |         optional: true
1366 |       '@types/react-dom':
1367 |         optional: true
1368 | 
1369 |   '@radix-ui/react-portal@1.1.9':
1370 |     resolution: {integrity: sha512-bpIxvq03if6UNwXZ+HTK71JLh4APvnXntDc6XOX8UVq4XQOVl7lwok0AvIl+b8zgCw3fSaVTZMpAPPagXbKmHQ==}
1371 |     peerDependencies:
1372 |       '@types/react': ^19
1373 |       '@types/react-dom': ^19
1374 |       react: ^19
1375 |       react-dom: ^19
1376 |     peerDependenciesMeta:
1377 |       '@types/react':
1378 |         optional: true
1379 |       '@types/react-dom':
1380 |         optional: true
1381 | 
1382 |   '@radix-ui/react-presence@1.1.2':
1383 |     resolution: {integrity: sha512-18TFr80t5EVgL9x1SwF/YGtfG+l0BS0PRAlCWBDoBEiDQjeKgnNZRVJp/oVBl24sr3Gbfwc/Qpj4OcWTQMsAEg==}
1384 |     peerDependencies:
1385 |       '@types/react': ^19
1386 |       '@types/react-dom': ^19
1387 |       react: ^19
1388 |       react-dom: ^19
1389 |     peerDependenciesMeta:
1390 |       '@types/react':
1391 |         optional: true
1392 |       '@types/react-dom':
1393 |         optional: true
1394 | 
1395 |   '@radix-ui/react-presence@1.1.5':
1396 |     resolution: {integrity: sha512-/jfEwNDdQVBCNvjkGit4h6pMOzq8bHkopq458dPt2lMjx+eBQUohZNG9A7DtO/O5ukSbxuaNGXMjHicgwy6rQQ==}
1397 |     peerDependencies:
1398 |       '@types/react': ^19
1399 |       '@types/react-dom': ^19
1400 |       react: ^19
1401 |       react-dom: ^19
1402 |     peerDependenciesMeta:
1403 |       '@types/react':
1404 |         optional: true
1405 |       '@types/react-dom':
1406 |         optional: true
1407 | 
1408 |   '@radix-ui/react-primitive@2.0.1':
1409 |     resolution: {integrity: sha512-sHCWTtxwNn3L3fH8qAfnF3WbUZycW93SM1j3NFDzXBiz8D6F5UTTy8G1+WFEaiCdvCVRJWj6N2R4Xq6HdiHmDg==}
1410 |     peerDependencies:
1411 |       '@types/react': ^19
1412 |       '@types/react-dom': ^19
1413 |       react: ^19
1414 |       react-dom: ^19
1415 |     peerDependenciesMeta:
1416 |       '@types/react':
1417 |         optional: true
1418 |       '@types/react-dom':
1419 |         optional: true
1420 | 
1421 |   '@radix-ui/react-primitive@2.1.3':
1422 |     resolution: {integrity: sha512-m9gTwRkhy2lvCPe6QJp4d3G1TYEUHn/FzJUtq9MjH46an1wJU+GdoGC5VLof8RX8Ft/DlpshApkhswDLZzHIcQ==}
1423 |     peerDependencies:
1424 |       '@types/react': ^19
1425 |       '@types/react-dom': ^19
1426 |       react: ^19
1427 |       react-dom: ^19
1428 |     peerDependenciesMeta:
1429 |       '@types/react':
1430 |         optional: true
1431 |       '@types/react-dom':
1432 |         optional: true
1433 | 
1434 |   '@radix-ui/react-progress@1.1.1':
1435 |     resolution: {integrity: sha512-6diOawA84f/eMxFHcWut0aE1C2kyE9dOyCTQOMRR2C/qPiXz/X0SaiA/RLbapQaXUCmy0/hLMf9meSccD1N0pA==}
1436 |     peerDependencies:
1437 |       '@types/react': ^19
1438 |       '@types/react-dom': ^19
1439 |       react: ^19
1440 |       react-dom: ^19
1441 |     peerDependenciesMeta:
1442 |       '@types/react':
1443 |         optional: true
1444 |       '@types/react-dom':
1445 |         optional: true
1446 | 
1447 |   '@radix-ui/react-radio-group@1.2.2':
1448 |     resolution: {integrity: sha512-E0MLLGfOP0l8P/NxgVzfXJ8w3Ch8cdO6UDzJfDChu4EJDy+/WdO5LqpdY8PYnCErkmZH3gZhDL1K7kQ41fAHuQ==}
1449 |     peerDependencies:
1450 |       '@types/react': ^19
1451 |       '@types/react-dom': ^19
1452 |       react: ^19
1453 |       react-dom: ^19
1454 |     peerDependenciesMeta:
1455 |       '@types/react':
1456 |         optional: true
1457 |       '@types/react-dom':
1458 |         optional: true
1459 | 
1460 |   '@radix-ui/react-roving-focus@1.1.1':
1461 |     resolution: {integrity: sha512-QE1RoxPGJ/Nm8Qmk0PxP8ojmoaS67i0s7hVssS7KuI2FQoc/uzVlZsqKfQvxPE6D8hICCPHJ4D88zNhT3OOmkw==}
1462 |     peerDependencies:
1463 |       '@types/react': ^19
1464 |       '@types/react-dom': ^19
1465 |       react: ^19
1466 |       react-dom: ^19
1467 |     peerDependenciesMeta:
1468 |       '@types/react':
1469 |         optional: true
1470 |       '@types/react-dom':
1471 |         optional: true
1472 | 
1473 |   '@radix-ui/react-roving-focus@1.1.11':
1474 |     resolution: {integrity: sha512-7A6S9jSgm/S+7MdtNDSb+IU859vQqJ/QAtcYQcfFC6W8RS4IxIZDldLR0xqCFZ6DCyrQLjLPsxtTNch5jVA4lA==}
1475 |     peerDependencies:
1476 |       '@types/react': ^19
1477 |       '@types/react-dom': ^19
1478 |       react: ^19
1479 |       react-dom: ^19
1480 |     peerDependenciesMeta:
1481 |       '@types/react':
1482 |         optional: true
1483 |       '@types/react-dom':
1484 |         optional: true
1485 | 
1486 |   '@radix-ui/react-scroll-area@1.2.10':
1487 |     resolution: {integrity: sha512-tAXIa1g3sM5CGpVT0uIbUx/U3Gs5N8T52IICuCtObaos1S8fzsrPXG5WObkQN3S6NVl6wKgPhAIiBGbWnvc97A==}
1488 |     peerDependencies:
1489 |       '@types/react': ^19
1490 |       '@types/react-dom': ^19
1491 |       react: ^19
1492 |       react-dom: ^19
1493 |     peerDependenciesMeta:
1494 |       '@types/react':
1495 |         optional: true
1496 |       '@types/react-dom':
1497 |         optional: true
1498 | 
1499 |   '@radix-ui/react-select@2.2.6':
1500 |     resolution: {integrity: sha512-I30RydO+bnn2PQztvo25tswPH+wFBjehVGtmagkU78yMdwTwVf12wnAOF+AeP8S2N8xD+5UPbGhkUfPyvT+mwQ==}
1501 |     peerDependencies:
1502 |       '@types/react': ^19
1503 |       '@types/react-dom': ^19
1504 |       react: ^19
1505 |       react-dom: ^19
1506 |     peerDependenciesMeta:
1507 |       '@types/react':
1508 |         optional: true
1509 |       '@types/react-dom':
1510 |         optional: true
1511 | 
1512 |   '@radix-ui/react-separator@1.1.1':
1513 |     resolution: {integrity: sha512-RRiNRSrD8iUiXriq/Y5n4/3iE8HzqgLHsusUSg5jVpU2+3tqcUFPJXHDymwEypunc2sWxDUS3UC+rkZRlHedsw==}
1514 |     peerDependencies:
1515 |       '@types/react': ^19
1516 |       '@types/react-dom': ^19
1517 |       react: ^19
1518 |       react-dom: ^19
1519 |     peerDependenciesMeta:
1520 |       '@types/react':
1521 |         optional: true
1522 |       '@types/react-dom':
1523 |         optional: true
1524 | 
1525 |   '@radix-ui/react-slot@1.1.1':
1526 |     resolution: {integrity: sha512-RApLLOcINYJA+dMVbOju7MYv1Mb2EBp2nH4HdDzXTSyaR5optlm6Otrz1euW3HbdOR8UmmFK06TD+A9frYWv+g==}
1527 |     peerDependencies:
1528 |       '@types/react': ^19
1529 |       react: ^19
1530 |     peerDependenciesMeta:
1531 |       '@types/react':
1532 |         optional: true
1533 | 
1534 |   '@radix-ui/react-slot@1.2.3':
1535 |     resolution: {integrity: sha512-aeNmHnBxbi2St0au6VBVC7JXFlhLlOnvIIlePNniyUNAClzmtAUEY8/pBiK3iHjufOlwA+c20/8jngo7xcrg8A==}
1536 |     peerDependencies:
1537 |       '@types/react': ^19
1538 |       react: ^19
1539 |     peerDependenciesMeta:
1540 |       '@types/react':
1541 |         optional: true
1542 | 
1543 |   '@radix-ui/react-switch@1.2.6':
1544 |     resolution: {integrity: sha512-bByzr1+ep1zk4VubeEVViV592vu2lHE2BZY5OnzehZqOOgogN80+mNtCqPkhn2gklJqOpxWgPoYTSnhBCqpOXQ==}
1545 |     peerDependencies:
1546 |       '@types/react': ^19
1547 |       '@types/react-dom': ^19
1548 |       react: ^19
1549 |       react-dom: ^19
1550 |     peerDependenciesMeta:
1551 |       '@types/react':
1552 |         optional: true
1553 |       '@types/react-dom':
1554 |         optional: true
1555 | 
1556 |   '@radix-ui/react-tabs@1.1.13':
1557 |     resolution: {integrity: sha512-7xdcatg7/U+7+Udyoj2zodtI9H/IIopqo+YOIcZOq1nJwXWBZ9p8xiu5llXlekDbZkca79a/fozEYQXIA4sW6A==}
1558 |     peerDependencies:
1559 |       '@types/react': ^19
1560 |       '@types/react-dom': ^19
1561 |       react: ^19
1562 |       react-dom: ^19
1563 |     peerDependenciesMeta:
1564 |       '@types/react':
1565 |         optional: true
1566 |       '@types/react-dom':
1567 |         optional: true
1568 | 
1569 |   '@radix-ui/react-toast@1.2.4':
1570 |     resolution: {integrity: sha512-Sch9idFJHJTMH9YNpxxESqABcAFweJG4tKv+0zo0m5XBvUSL8FM5xKcJLFLXononpePs8IclyX1KieL5SDUNgA==}
1571 |     peerDependencies:
1572 |       '@types/react': ^19
1573 |       '@types/react-dom': ^19
1574 |       react: ^19
1575 |       react-dom: ^19
1576 |     peerDependenciesMeta:
1577 |       '@types/react':
1578 |         optional: true
1579 |       '@types/react-dom':
1580 |         optional: true
1581 | 
1582 |   '@radix-ui/react-toggle-group@1.1.1':
1583 |     resolution: {integrity: sha512-OgDLZEA30Ylyz8YSXvnGqIHtERqnUt1KUYTKdw/y8u7Ci6zGiJfXc02jahmcSNK3YcErqioj/9flWC9S1ihfwg==}
1584 |     peerDependencies:
1585 |       '@types/react': ^19
1586 |       '@types/react-dom': ^19
1587 |       react: ^19
1588 |       react-dom: ^19
1589 |     peerDependenciesMeta:
1590 |       '@types/react':
1591 |         optional: true
1592 |       '@types/react-dom':
1593 |         optional: true
1594 | 
1595 |   '@radix-ui/react-toggle@1.1.1':
1596 |     resolution: {integrity: sha512-i77tcgObYr743IonC1hrsnnPmszDRn8p+EGUsUt+5a/JFn28fxaM88Py6V2mc8J5kELMWishI0rLnuGLFD/nnQ==}
1597 |     peerDependencies:
1598 |       '@types/react': ^19
1599 |       '@types/react-dom': ^19
1600 |       react: ^19
1601 |       react-dom: ^19
1602 |     peerDependenciesMeta:
1603 |       '@types/react':
1604 |         optional: true
1605 |       '@types/react-dom':
1606 |         optional: true
1607 | 
1608 |   '@radix-ui/react-use-callback-ref@1.1.0':
1609 |     resolution: {integrity: sha512-CasTfvsy+frcFkbXtSJ2Zu9JHpN8TYKxkgJGWbjiZhFivxaeW7rMeZt7QELGVLaYVfFMsKHjb7Ak0nMEe+2Vfw==}
1610 |     peerDependencies:
1611 |       '@types/react': ^19
1612 |       react: ^19
1613 |     peerDependenciesMeta:
1614 |       '@types/react':
1615 |         optional: true
1616 | 
1617 |   '@radix-ui/react-use-callback-ref@1.1.1':
1618 |     resolution: {integrity: sha512-FkBMwD+qbGQeMu1cOHnuGB6x4yzPjho8ap5WtbEJ26umhgqVXbhekKUQO+hZEL1vU92a3wHwdp0HAcqAUF5iDg==}
1619 |     peerDependencies:
1620 |       '@types/react': ^19
1621 |       react: ^19
1622 |     peerDependenciesMeta:
1623 |       '@types/react':
1624 |         optional: true
1625 | 
1626 |   '@radix-ui/react-use-controllable-state@1.1.0':
1627 |     resolution: {integrity: sha512-MtfMVJiSr2NjzS0Aa90NPTnvTSg6C/JLCV7ma0W6+OMV78vd8OyRpID+Ng9LxzsPbLeuBnWBA1Nq30AtBIDChw==}
1628 |     peerDependencies:
1629 |       '@types/react': ^19
1630 |       react: ^19
1631 |     peerDependenciesMeta:
1632 |       '@types/react':
1633 |         optional: true
1634 | 
1635 |   '@radix-ui/react-use-controllable-state@1.2.2':
1636 |     resolution: {integrity: sha512-BjasUjixPFdS+NKkypcyyN5Pmg83Olst0+c6vGov0diwTEo6mgdqVR6hxcEgFuh4QrAs7Rc+9KuGJ9TVCj0Zzg==}
1637 |     peerDependencies:
1638 |       '@types/react': ^19
1639 |       react: ^19
1640 |     peerDependenciesMeta:
1641 |       '@types/react':
1642 |         optional: true
1643 | 
1644 |   '@radix-ui/react-use-effect-event@0.0.2':
1645 |     resolution: {integrity: sha512-Qp8WbZOBe+blgpuUT+lw2xheLP8q0oatc9UpmiemEICxGvFLYmHm9QowVZGHtJlGbS6A6yJ3iViad/2cVjnOiA==}
1646 |     peerDependencies:
1647 |       '@types/react': ^19
1648 |       react: ^19
1649 |     peerDependenciesMeta:
1650 |       '@types/react':
1651 |         optional: true
1652 | 
1653 |   '@radix-ui/react-use-escape-keydown@1.1.0':
1654 |     resolution: {integrity: sha512-L7vwWlR1kTTQ3oh7g1O0CBF3YCyyTj8NmhLR+phShpyA50HCfBFKVJTpshm9PzLiKmehsrQzTYTpX9HvmC9rhw==}
1655 |     peerDependencies:
1656 |       '@types/react': ^19
1657 |       react: ^19
1658 |     peerDependenciesMeta:
1659 |       '@types/react':
1660 |         optional: true
1661 | 
1662 |   '@radix-ui/react-use-escape-keydown@1.1.1':
1663 |     resolution: {integrity: sha512-Il0+boE7w/XebUHyBjroE+DbByORGR9KKmITzbR7MyQ4akpORYP/ZmbhAr0DG7RmmBqoOnZdy2QlvajJ2QA59g==}
1664 |     peerDependencies:
1665 |       '@types/react': ^19
1666 |       react: ^19
1667 |     peerDependenciesMeta:
1668 |       '@types/react':
1669 |         optional: true
1670 | 
1671 |   '@radix-ui/react-use-is-hydrated@0.1.0':
1672 |     resolution: {integrity: sha512-U+UORVEq+cTnRIaostJv9AGdV3G6Y+zbVd+12e18jQ5A3c0xL03IhnHuiU4UV69wolOQp5GfR58NW/EgdQhwOA==}
1673 |     peerDependencies:
1674 |       '@types/react': ^19
1675 |       react: ^19
1676 |     peerDependenciesMeta:
1677 |       '@types/react':
1678 |         optional: true
1679 | 
1680 |   '@radix-ui/react-use-layout-effect@1.1.0':
1681 |     resolution: {integrity: sha512-+FPE0rOdziWSrH9athwI1R0HDVbWlEhd+FR+aSDk4uWGmSJ9Z54sdZVDQPZAinJhJXwfT+qnj969mCsT2gfm5w==}
1682 |     peerDependencies:
1683 |       '@types/react': ^19
1684 |       react: ^19
1685 |     peerDependenciesMeta:
1686 |       '@types/react':
1687 |         optional: true
1688 | 
1689 |   '@radix-ui/react-use-layout-effect@1.1.1':
1690 |     resolution: {integrity: sha512-RbJRS4UWQFkzHTTwVymMTUv8EqYhOp8dOOviLj2ugtTiXRaRQS7GLGxZTLL1jWhMeoSCf5zmcZkqTl9IiYfXcQ==}
1691 |     peerDependencies:
1692 |       '@types/react': ^19
1693 |       react: ^19
1694 |     peerDependenciesMeta:
1695 |       '@types/react':
1696 |         optional: true
1697 | 
1698 |   '@radix-ui/react-use-previous@1.1.0':
1699 |     resolution: {integrity: sha512-Z/e78qg2YFnnXcW88A4JmTtm4ADckLno6F7OXotmkQfeuCVaKuYzqAATPhVzl3delXE7CxIV8shofPn3jPc5Og==}
1700 |     peerDependencies:
1701 |       '@types/react': ^19
1702 |       react: ^19
1703 |     peerDependenciesMeta:
1704 |       '@types/react':
1705 |         optional: true
1706 | 
1707 |   '@radix-ui/react-use-previous@1.1.1':
1708 |     resolution: {integrity: sha512-2dHfToCj/pzca2Ck724OZ5L0EVrr3eHRNsG/b3xQJLA2hZpVCS99bLAX+hm1IHXDEnzU6by5z/5MIY794/a8NQ==}
1709 |     peerDependencies:
1710 |       '@types/react': ^19
1711 |       react: ^19
1712 |     peerDependenciesMeta:
1713 |       '@types/react':
1714 |         optional: true
1715 | 
1716 |   '@radix-ui/react-use-rect@1.1.0':
1717 |     resolution: {integrity: sha512-0Fmkebhr6PiseyZlYAOtLS+nb7jLmpqTrJyv61Pe68MKYW6OWdRE2kI70TaYY27u7H0lajqM3hSMMLFq18Z7nQ==}
1718 |     peerDependencies:
1719 |       '@types/react': ^19
1720 |       react: ^19
1721 |     peerDependenciesMeta:
1722 |       '@types/react':
1723 |         optional: true
1724 | 
1725 |   '@radix-ui/react-use-rect@1.1.1':
1726 |     resolution: {integrity: sha512-QTYuDesS0VtuHNNvMh+CjlKJ4LJickCMUAqjlE3+j8w+RlRpwyX3apEQKGFzbZGdo7XNG1tXa+bQqIE7HIXT2w==}
1727 |     peerDependencies:
1728 |       '@types/react': ^19
1729 |       react: ^19
1730 |     peerDependenciesMeta:
1731 |       '@types/react':
1732 |         optional: true
1733 | 
1734 |   '@radix-ui/react-use-size@1.1.0':
1735 |     resolution: {integrity: sha512-XW3/vWuIXHa+2Uwcc2ABSfcCledmXhhQPlGbfcRXbiUQI5Icjcg19BGCZVKKInYbvUCut/ufbbLLPFC5cbb1hw==}
1736 |     peerDependencies:
1737 |       '@types/react': ^19
1738 |       react: ^19
1739 |     peerDependenciesMeta:
1740 |       '@types/react':
1741 |         optional: true
1742 | 
1743 |   '@radix-ui/react-use-size@1.1.1':
1744 |     resolution: {integrity: sha512-ewrXRDTAqAXlkl6t/fkXWNAhFX9I+CkKlw6zjEwk86RSPKwZr3xpBRso655aqYafwtnbpHLj6toFzmd6xdVptQ==}
1745 |     peerDependencies:
1746 |       '@types/react': ^19
1747 |       react: ^19
1748 |     peerDependenciesMeta:
1749 |       '@types/react':
1750 |         optional: true
1751 | 
1752 |   '@radix-ui/react-visually-hidden@1.1.1':
1753 |     resolution: {integrity: sha512-vVfA2IZ9q/J+gEamvj761Oq1FpWgCDaNOOIfbPVp2MVPLEomUr5+Vf7kJGwQ24YxZSlQVar7Bes8kyTo5Dshpg==}
1754 |     peerDependencies:
1755 |       '@types/react': ^19
1756 |       '@types/react-dom': ^19
1757 |       react: ^19
1758 |       react-dom: ^19
1759 |     peerDependenciesMeta:
1760 |       '@types/react':
1761 |         optional: true
1762 |       '@types/react-dom':
1763 |         optional: true
1764 | 
1765 |   '@radix-ui/react-visually-hidden@1.2.3':
1766 |     resolution: {integrity: sha512-pzJq12tEaaIhqjbzpCuv/OypJY/BPavOofm+dbab+MHLajy277+1lLm6JFcGgF5eskJ6mquGirhXY2GD/8u8Ug==}
1767 |     peerDependencies:
1768 |       '@types/react': ^19
1769 |       '@types/react-dom': ^19
1770 |       react: ^19
1771 |       react-dom: ^19
1772 |     peerDependenciesMeta:
1773 |       '@types/react':
1774 |         optional: true
1775 |       '@types/react-dom':
1776 |         optional: true
1777 | 
1778 |   '@radix-ui/rect@1.1.0':
1779 |     resolution: {integrity: sha512-A9+lCBZoaMJlVKcRBz2YByCG+Cp2t6nAnMnNba+XiWxnj6r4JUFqfsgwocMBZU9LPtdxC6wB56ySYpc7LQIoJg==}
1780 | 
1781 |   '@radix-ui/rect@1.1.1':
1782 |     resolution: {integrity: sha512-HPwpGIzkl28mWyZqG52jiqDJ12waP11Pa1lGoiyUkIEuMLBP0oeK/C89esbXrxsky5we7dfd8U58nm0SgAWpVw==}
1783 | 
1784 |   '@remix-run/react@2.17.0':
1785 |     resolution: {integrity: sha512-muOLHqcimMCrIk6VOuqIn51P3buYjKpdYc6qpNy6zE5HlKfyaKEY00a5pzdutRmevYTQy7FiEF/LK4M8sxk70Q==}
1786 |     engines: {node: '>=18.0.0'}
1787 |     peerDependencies:
1788 |       react: ^19
1789 |       react-dom: ^19
1790 |       typescript: ^5.1.0
1791 |     peerDependenciesMeta:
1792 |       typescript:
1793 |         optional: true
1794 | 
1795 |   '@remix-run/router@1.23.0':
1796 |     resolution: {integrity: sha512-O3rHJzAQKamUz1fvE0Qaw0xSFqsA/yafi2iqeE0pvdFtCO1viYx8QL6f3Ln/aCCTLxs68SLf0KPM9eSeM8yBnA==}
1797 |     engines: {node: '>=14.0.0'}
1798 | 
1799 |   '@remix-run/server-runtime@2.17.0':
1800 |     resolution: {integrity: sha512-X0zfGLgvukhuTIL0tdWKnlvHy4xUe7Z17iQ0KMQoITK0SkTZPSud/6cJCsKhPqC8kfdYT1GNFLJKRhHz7Aapmw==}
1801 |     engines: {node: '>=18.0.0'}
1802 |     peerDependencies:
1803 |       typescript: ^5.1.0
1804 |     peerDependenciesMeta:
1805 |       typescript:
1806 |         optional: true
1807 | 
1808 |   '@rollup/rollup-android-arm-eabi@4.50.0':
1809 |     resolution: {integrity: sha512-lVgpeQyy4fWN5QYebtW4buT/4kn4p4IJ+kDNB4uYNT5b8c8DLJDg6titg20NIg7E8RWwdWZORW6vUFfrLyG3KQ==}
1810 |     cpu: [arm]
1811 |     os: [android]
1812 | 
1813 |   '@rollup/rollup-android-arm64@4.50.0':
1814 |     resolution: {integrity: sha512-2O73dR4Dc9bp+wSYhviP6sDziurB5/HCym7xILKifWdE9UsOe2FtNcM+I4xZjKrfLJnq5UR8k9riB87gauiQtw==}
1815 |     cpu: [arm64]
1816 |     os: [android]
1817 | 
1818 |   '@rollup/rollup-darwin-arm64@4.50.0':
1819 |     resolution: {integrity: sha512-vwSXQN8T4sKf1RHr1F0s98Pf8UPz7pS6P3LG9NSmuw0TVh7EmaE+5Ny7hJOZ0M2yuTctEsHHRTMi2wuHkdS6Hg==}
1820 |     cpu: [arm64]
1821 |     os: [darwin]
1822 | 
1823 |   '@rollup/rollup-darwin-x64@4.50.0':
1824 |     resolution: {integrity: sha512-cQp/WG8HE7BCGyFVuzUg0FNmupxC+EPZEwWu2FCGGw5WDT1o2/YlENbm5e9SMvfDFR6FRhVCBePLqj0o8MN7Vw==}
1825 |     cpu: [x64]
1826 |     os: [darwin]
1827 | 
1828 |   '@rollup/rollup-freebsd-arm64@4.50.0':
1829 |     resolution: {integrity: sha512-UR1uTJFU/p801DvvBbtDD7z9mQL8J80xB0bR7DqW7UGQHRm/OaKzp4is7sQSdbt2pjjSS72eAtRh43hNduTnnQ==}
1830 |     cpu: [arm64]
1831 |     os: [freebsd]
1832 | 
1833 |   '@rollup/rollup-freebsd-x64@4.50.0':
1834 |     resolution: {integrity: sha512-G/DKyS6PK0dD0+VEzH/6n/hWDNPDZSMBmqsElWnCRGrYOb2jC0VSupp7UAHHQ4+QILwkxSMaYIbQ72dktp8pKA==}
1835 |     cpu: [x64]
1836 |     os: [freebsd]
1837 | 
1838 |   '@rollup/rollup-linux-arm-gnueabihf@4.50.0':
1839 |     resolution: {integrity: sha512-u72Mzc6jyJwKjJbZZcIYmd9bumJu7KNmHYdue43vT1rXPm2rITwmPWF0mmPzLm9/vJWxIRbao/jrQmxTO0Sm9w==}
1840 |     cpu: [arm]
1841 |     os: [linux]
1842 | 
1843 |   '@rollup/rollup-linux-arm-musleabihf@4.50.0':
1844 |     resolution: {integrity: sha512-S4UefYdV0tnynDJV1mdkNawp0E5Qm2MtSs330IyHgaccOFrwqsvgigUD29uT+B/70PDY1eQ3t40+xf6wIvXJyg==}
1845 |     cpu: [arm]
1846 |     os: [linux]
1847 | 
1848 |   '@rollup/rollup-linux-arm64-gnu@4.50.0':
1849 |     resolution: {integrity: sha512-1EhkSvUQXJsIhk4msxP5nNAUWoB4MFDHhtc4gAYvnqoHlaL9V3F37pNHabndawsfy/Tp7BPiy/aSa6XBYbaD1g==}
1850 |     cpu: [arm64]
1851 |     os: [linux]
1852 | 
1853 |   '@rollup/rollup-linux-arm64-musl@4.50.0':
1854 |     resolution: {integrity: sha512-EtBDIZuDtVg75xIPIK1l5vCXNNCIRM0OBPUG+tbApDuJAy9mKago6QxX+tfMzbCI6tXEhMuZuN1+CU8iDW+0UQ==}
1855 |     cpu: [arm64]
1856 |     os: [linux]
1857 | 
1858 |   '@rollup/rollup-linux-loongarch64-gnu@4.50.0':
1859 |     resolution: {integrity: sha512-BGYSwJdMP0hT5CCmljuSNx7+k+0upweM2M4YGfFBjnFSZMHOLYR0gEEj/dxyYJ6Zc6AiSeaBY8dWOa11GF/ppQ==}
1860 |     cpu: [loong64]
1861 |     os: [linux]
1862 | 
1863 |   '@rollup/rollup-linux-ppc64-gnu@4.50.0':
1864 |     resolution: {integrity: sha512-I1gSMzkVe1KzAxKAroCJL30hA4DqSi+wGc5gviD0y3IL/VkvcnAqwBf4RHXHyvH66YVHxpKO8ojrgc4SrWAnLg==}
1865 |     cpu: [ppc64]
1866 |     os: [linux]
1867 | 
1868 |   '@rollup/rollup-linux-riscv64-gnu@4.50.0':
1869 |     resolution: {integrity: sha512-bSbWlY3jZo7molh4tc5dKfeSxkqnf48UsLqYbUhnkdnfgZjgufLS/NTA8PcP/dnvct5CCdNkABJ56CbclMRYCA==}
1870 |     cpu: [riscv64]
1871 |     os: [linux]
1872 | 
1873 |   '@rollup/rollup-linux-riscv64-musl@4.50.0':
1874 |     resolution: {integrity: sha512-LSXSGumSURzEQLT2e4sFqFOv3LWZsEF8FK7AAv9zHZNDdMnUPYH3t8ZlaeYYZyTXnsob3htwTKeWtBIkPV27iQ==}
1875 |     cpu: [riscv64]
1876 |     os: [linux]
1877 | 
1878 |   '@rollup/rollup-linux-s390x-gnu@4.50.0':
1879 |     resolution: {integrity: sha512-CxRKyakfDrsLXiCyucVfVWVoaPA4oFSpPpDwlMcDFQvrv3XY6KEzMtMZrA+e/goC8xxp2WSOxHQubP8fPmmjOQ==}
1880 |     cpu: [s390x]
1881 |     os: [linux]
1882 | 
1883 |   '@rollup/rollup-linux-x64-gnu@4.50.0':
1884 |     resolution: {integrity: sha512-8PrJJA7/VU8ToHVEPu14FzuSAqVKyo5gg/J8xUerMbyNkWkO9j2ExBho/68RnJsMGNJq4zH114iAttgm7BZVkA==}
1885 |     cpu: [x64]
1886 |     os: [linux]
1887 | 
1888 |   '@rollup/rollup-linux-x64-musl@4.50.0':
1889 |     resolution: {integrity: sha512-SkE6YQp+CzpyOrbw7Oc4MgXFvTw2UIBElvAvLCo230pyxOLmYwRPwZ/L5lBe/VW/qT1ZgND9wJfOsdy0XptRvw==}
1890 |     cpu: [x64]
1891 |     os: [linux]
1892 | 
1893 |   '@rollup/rollup-openharmony-arm64@4.50.0':
1894 |     resolution: {integrity: sha512-PZkNLPfvXeIOgJWA804zjSFH7fARBBCpCXxgkGDRjjAhRLOR8o0IGS01ykh5GYfod4c2yiiREuDM8iZ+pVsT+Q==}
1895 |     cpu: [arm64]
1896 |     os: [openharmony]
1897 | 
1898 |   '@rollup/rollup-win32-arm64-msvc@4.50.0':
1899 |     resolution: {integrity: sha512-q7cIIdFvWQoaCbLDUyUc8YfR3Jh2xx3unO8Dn6/TTogKjfwrax9SyfmGGK6cQhKtjePI7jRfd7iRYcxYs93esg==}
1900 |     cpu: [arm64]
1901 |     os: [win32]
1902 | 
1903 |   '@rollup/rollup-win32-ia32-msvc@4.50.0':
1904 |     resolution: {integrity: sha512-XzNOVg/YnDOmFdDKcxxK410PrcbcqZkBmz+0FicpW5jtjKQxcW1BZJEQOF0NJa6JO7CZhett8GEtRN/wYLYJuw==}
1905 |     cpu: [ia32]
1906 |     os: [win32]
1907 | 
1908 |   '@rollup/rollup-win32-x64-msvc@4.50.0':
1909 |     resolution: {integrity: sha512-xMmiWRR8sp72Zqwjgtf3QbZfF1wdh8X2ABu3EaozvZcyHJeU0r+XAnXdKgs4cCAp6ORoYoCygipYP1mjmbjrsg==}
1910 |     cpu: [x64]
1911 |     os: [win32]
1912 | 
1913 |   '@standard-schema/spec@1.0.0':
1914 |     resolution: {integrity: sha512-m2bOd0f2RT9k8QJx1JN85cZYyH1RqFBdlwtkSlf4tBDYLCiiZnv1fIIwacK6cqwXavOydf0NPToMQgpKq+dVlA==}
1915 | 
1916 |   '@sveltejs/acorn-typescript@1.0.5':
1917 |     resolution: {integrity: sha512-IwQk4yfwLdibDlrXVE04jTZYlLnwsTT2PIOQQGNLWfjavGifnk1JD1LcZjZaBTRcxZu2FfPfNLOE04DSu9lqtQ==}
1918 |     peerDependencies:
1919 |       acorn: ^8.9.0
1920 | 
1921 |   '@sveltejs/kit@2.37.0':
1922 |     resolution: {integrity: sha512-xgKtpjQ6Ry4mdShd01ht5AODUsW7+K1iValPDq7QX8zI1hWOKREH9GjG8SRCN5tC4K7UXmMhuQam7gbLByVcnw==}
1923 |     engines: {node: '>=18.13'}
1924 |     hasBin: true
1925 |     peerDependencies:
1926 |       '@opentelemetry/api': ^1.0.0
1927 |       '@sveltejs/vite-plugin-svelte': ^3.0.0 || ^4.0.0-next.1 || ^5.0.0 || ^6.0.0-next.0
1928 |       svelte: ^4.0.0 || ^5.0.0-next.0
1929 |       vite: ^5.0.3 || ^6.0.0 || ^7.0.0-beta.0
1930 |     peerDependenciesMeta:
1931 |       '@opentelemetry/api':
1932 |         optional: true
1933 | 
1934 |   '@sveltejs/vite-plugin-svelte-inspector@5.0.1':
1935 |     resolution: {integrity: sha512-ubWshlMk4bc8mkwWbg6vNvCeT7lGQojE3ijDh3QTR6Zr/R+GXxsGbyH4PExEPpiFmqPhYiVSVmHBjUcVc1JIrA==}
1936 |     engines: {node: ^20.19 || ^22.12 || >=24}
1937 |     peerDependencies:
1938 |       '@sveltejs/vite-plugin-svelte': ^6.0.0-next.0
1939 |       svelte: ^5.0.0
1940 |       vite: ^6.3.0 || ^7.0.0
1941 | 
1942 |   '@sveltejs/vite-plugin-svelte@6.1.4':
1943 |     resolution: {integrity: sha512-4jfkfvsGI+U2OhHX8OPCKtMCf7g7ledXhs3E6UcA4EY0jQWsiVbe83pTAHp9XTifzYNOiD4AJieJUsI0qqxsbw==}
1944 |     engines: {node: ^20.19 || ^22.12 || >=24}
1945 |     peerDependencies:
1946 |       svelte: ^5.0.0
1947 |       vite: ^6.3.0 || ^7.0.0
1948 | 
1949 |   '@swc/counter@0.1.3':
1950 |     resolution: {integrity: sha512-e2BR4lsJkkRlKZ/qCHPw9ZaSxc0MVUd7gtbtaB7aMvHeJVYe8sOB8DBZkP2DtISHGSku9sCK6T6cnY0CtXrOCQ==}
1951 | 
1952 |   '@swc/helpers@0.5.15':
1953 |     resolution: {integrity: sha512-JQ5TuMi45Owi4/BIMAJBoSQoOJu12oOk/gADqlcUL9JEdHB8vyjUSsxqeNXnmXHjYKMi2WcYtezGEEhqUI/E2g==}
1954 | 
1955 |   '@tootallnate/once@2.0.0':
1956 |     resolution: {integrity: sha512-XCuKFP5PS55gnMVu3dty8KPatLqUoy/ZYzDzAGCQ8JNFCkLXzmI7vNHCR+XpbZaMWQK/vQubr7PkYq8g470J/A==}
1957 |     engines: {node: '>= 10'}
1958 | 
1959 |   '@types/body-parser@1.19.6':
1960 |     resolution: {integrity: sha512-HLFeCYgz89uk22N5Qg3dvGvsv46B8GLvKKo1zKG4NybA8U2DiEO3w9lqGg29t/tfLRJpJ6iQxnVw4OnB7MoM9g==}
1961 | 
1962 |   '@types/caseless@0.12.5':
1963 |     resolution: {integrity: sha512-hWtVTC2q7hc7xZ/RLbxapMvDMgUnDvKvMOpKal4DrMyfGBUfB1oKaZlIRr6mJL+If3bAP6sV/QneGzF6tJjZDg==}
1964 | 
1965 |   '@types/connect@3.4.38':
1966 |     resolution: {integrity: sha512-K6uROf1LD88uDQqJCktA4yzL1YYAK6NgfsI0v/mTgyPKWsX1CnJ0XPSDhViejru1GcRkLWb8RlzFYJRqGUbaug==}
1967 | 
1968 |   '@types/cookie@0.6.0':
1969 |     resolution: {integrity: sha512-4Kh9a6B2bQciAhf7FSuMRRkUWecJgJu9nPnx3yzpsfXX/c50REIqpHY4C82bXP90qrLtXtkDxTZosYO3UpOwlA==}
1970 | 
1971 |   '@types/cors@2.8.19':
1972 |     resolution: {integrity: sha512-mFNylyeyqN93lfe/9CSxOGREz8cpzAhH+E93xJ4xWQf62V8sQ/24reV2nyzUWM6H6Xji+GGHpkbLe7pVoUEskg==}
1973 | 
1974 |   '@types/d3-array@3.2.1':
1975 |     resolution: {integrity: sha512-Y2Jn2idRrLzUfAKV2LyRImR+y4oa2AntrgID95SHJxuMUrkNXmanDSed71sRNZysveJVt1hLLemQZIady0FpEg==}
1976 | 
1977 |   '@types/d3-color@3.1.3':
1978 |     resolution: {integrity: sha512-iO90scth9WAbmgv7ogoq57O9YpKmFBbmoEoCHDB2xMBY0+/KVrqAaCDyCE16dUspeOvIxFFRI+0sEtqDqy2b4A==}
1979 | 
1980 |   '@types/d3-ease@3.0.2':
1981 |     resolution: {integrity: sha512-NcV1JjO5oDzoK26oMzbILE6HW7uVXOHLQvHshBUW4UMdZGfiY6v5BeQwh9a9tCzv+CeefZQHJt5SRgK154RtiA==}
1982 | 
1983 |   '@types/d3-interpolate@3.0.4':
1984 |     resolution: {integrity: sha512-mgLPETlrpVV1YRJIglr4Ez47g7Yxjl1lj7YKsiMCb27VJH9W8NVM6Bb9d8kkpG/uAQS5AmbA48q2IAolKKo1MA==}
1985 | 
1986 |   '@types/d3-path@3.1.1':
1987 |     resolution: {integrity: sha512-VMZBYyQvbGmWyWVea0EHs/BwLgxc+MKi1zLDCONksozI4YJMcTt8ZEuIR4Sb1MMTE8MMW49v0IwI5+b7RmfWlg==}
1988 | 
1989 |   '@types/d3-scale@4.0.9':
1990 |     resolution: {integrity: sha512-dLmtwB8zkAeO/juAMfnV+sItKjlsw2lKdZVVy6LRr0cBmegxSABiLEpGVmSJJ8O08i4+sGR6qQtb6WtuwJdvVw==}
1991 | 
1992 |   '@types/d3-shape@3.1.7':
1993 |     resolution: {integrity: sha512-VLvUQ33C+3J+8p+Daf+nYSOsjB4GXp19/S/aGo60m9h1v6XaxjiT82lKVWJCfzhtuZ3yD7i/TPeC/fuKLLOSmg==}
1994 | 
1995 |   '@types/d3-time@3.0.4':
1996 |     resolution: {integrity: sha512-yuzZug1nkAAaBlBBikKZTgzCeA+k1uy4ZFwWANOfKw5z5LRhV0gNA7gNkKm7HoK+HRN0wX3EkxGk0fpbWhmB7g==}
1997 | 
1998 |   '@types/d3-timer@3.0.2':
1999 |     resolution: {integrity: sha512-Ps3T8E8dZDam6fUyNiMkekK3XUsaUEik+idO9/YjPtfj2qruF8tFBXS7XhtE4iIXBLxhmLjP3SXpLhVf21I9Lw==}
2000 | 
2001 |   '@types/estree@1.0.8':
2002 |     resolution: {integrity: sha512-dWHzHa2WqEXI/O1E9OjrocMTKJl2mSrEolh1Iomrv6U+JuNwaHXsXx9bLu5gG7BUWFIN0skIQJQ/L1rIex4X6w==}
2003 | 
2004 |   '@types/express-serve-static-core@4.19.6':
2005 |     resolution: {integrity: sha512-N4LZ2xG7DatVqhCZzOGb1Yi5lMbXSZcmdLDe9EzSndPV2HpWYWzRbaerl2n27irrm94EPpprqa8KpskPT085+A==}
2006 | 
2007 |   '@types/express@4.17.23':
2008 |     resolution: {integrity: sha512-Crp6WY9aTYP3qPi2wGDo9iUe/rceX01UMhnF1jmwDcKCFM6cx7YhGP/Mpr3y9AASpfHixIG0E6azCcL5OcDHsQ==}
2009 | 
2010 |   '@types/google.maps@3.58.1':
2011 |     resolution: {integrity: sha512-X9QTSvGJ0nCfMzYOnaVs/k6/4L+7F5uCS+4iUmkLEls6J9S/Phv+m/i3mDeyc49ZBgwab3EFO1HEoBY7k98EGQ==}
2012 | 
2013 |   '@types/http-errors@2.0.5':
2014 |     resolution: {integrity: sha512-r8Tayk8HJnX0FztbZN7oVqGccWgw98T/0neJphO91KkmOzug1KkofZURD4UaD5uH8AqcFLfdPErnBod0u71/qg==}
2015 | 
2016 |   '@types/jsonwebtoken@9.0.10':
2017 |     resolution: {integrity: sha512-asx5hIG9Qmf/1oStypjanR7iKTv0gXQ1Ov/jfrX6kS/EO0OFni8orbmGCn0672NHR3kXHwpAwR+B368ZGN/2rA==}
2018 | 
2019 |   '@types/long@4.0.2':
2020 |     resolution: {integrity: sha512-MqTGEo5bj5t157U6fA/BiDynNkn0YknVdh48CMPkTSpFTVmvao5UQmm7uEF6xBEo7qIMAlY/JSleYaE6VOdpaA==}
2021 | 
2022 |   '@types/mime@1.3.5':
2023 |     resolution: {integrity: sha512-/pyBZWSLD2n0dcHE3hq8s8ZvcETHtEuF+3E7XVt0Ig2nvsVQXdghHVcEkIWjy9A0wKfTn97a/PSDYohKIlnP/w==}
2024 | 
2025 |   '@types/ms@2.1.0':
2026 |     resolution: {integrity: sha512-GsCCIZDE/p3i96vtEqx+7dBUGXrc7zeSK3wwPHIaRThS+9OhWIXRqzs4d6k1SVU8g91DrNRWxWUGhp5KXQb2VA==}
2027 | 
2028 |   '@types/node@22.18.0':
2029 |     resolution: {integrity: sha512-m5ObIqwsUp6BZzyiy4RdZpzWGub9bqLJMvZDD0QMXhxjqMHMENlj+SqF5QxoUwaQNFe+8kz8XM8ZQhqkQPTgMQ==}
2030 | 
2031 |   '@types/qs@6.14.0':
2032 |     resolution: {integrity: sha512-eOunJqu0K1923aExK6y8p6fsihYEn/BYuQ4g0CxAAgFc4b/ZLN4CrsRZ55srTdqoiLzU2B2evC+apEIxprEzkQ==}
2033 | 
2034 |   '@types/range-parser@1.2.7':
2035 |     resolution: {integrity: sha512-hKormJbkJqzQGhziax5PItDUTMAM9uE2XXQmM37dyd4hVM+5aVl7oVxMVUiVQn2oCQFN/LKCZdvSM0pFRqbSmQ==}
2036 | 
2037 |   '@types/react-dom@19.1.9':
2038 |     resolution: {integrity: sha512-qXRuZaOsAdXKFyOhRBg6Lqqc0yay13vN7KrIg4L7N4aaHN68ma9OK3NE1BoDFgFOTfM7zg+3/8+2n8rLUH3OKQ==}
2039 |     peerDependencies:
2040 |       '@types/react': ^19
2041 | 
2042 |   '@types/react@19.1.12':
2043 |     resolution: {integrity: sha512-cMoR+FoAf/Jyq6+Df2/Z41jISvGZZ2eTlnsaJRptmZ76Caldwy1odD4xTr/gNV9VLj0AWgg/nmkevIyUfIIq5w==}
2044 | 
2045 |   '@types/request@2.48.13':
2046 |     resolution: {integrity: sha512-FGJ6udDNUCjd19pp0Q3iTiDkwhYup7J8hpMW9c4k53NrccQFFWKRho6hvtPPEhnXWKvukfwAlB6DbDz4yhH5Gg==}
2047 | 
2048 |   '@types/send@0.17.5':
2049 |     resolution: {integrity: sha512-z6F2D3cOStZvuk2SaP6YrwkNO65iTZcwA2ZkSABegdkAh/lf+Aa/YQndZVfmEXT5vgAp6zv06VQ3ejSVjAny4w==}
2050 | 
2051 |   '@types/serve-static@1.15.8':
2052 |     resolution: {integrity: sha512-roei0UY3LhpOJvjbIP6ZZFngyLKl5dskOtDhxY5THRSpO+ZI+nzJ+m5yUMzGrp89YRa7lvknKkMYjqQFGwA7Sg==}
2053 | 
2054 |   '@types/tough-cookie@4.0.5':
2055 |     resolution: {integrity: sha512-/Ad8+nIOV7Rl++6f1BdKxFSMgmoqEoYbHRpPcx3JEfv8VRsQe9Z4mCXeJBzxs7mbHY/XOZZuXlRNfhpVPbs6ZA==}
2056 | 
2057 |   '@vercel/analytics@1.5.0':
2058 |     resolution: {integrity: sha512-MYsBzfPki4gthY5HnYN7jgInhAZ7Ac1cYDoRWFomwGHWEX7odTEzbtg9kf/QSo7XEsEAqlQugA6gJ2WS2DEa3g==}
2059 |     peerDependencies:
2060 |       '@remix-run/react': ^2
2061 |       '@sveltejs/kit': ^1 || ^2
2062 |       next: '>= 13'
2063 |       react: ^19
2064 |       svelte: '>= 4'
2065 |       vue: ^3
2066 |       vue-router: ^4
2067 |     peerDependenciesMeta:
2068 |       '@remix-run/react':
2069 |         optional: true
2070 |       '@sveltejs/kit':
2071 |         optional: true
2072 |       next:
2073 |         optional: true
2074 |       react:
2075 |         optional: true
2076 |       svelte:
2077 |         optional: true
2078 |       vue:
2079 |         optional: true
2080 |       vue-router:
2081 |         optional: true
2082 | 
2083 |   '@vercel/speed-insights@1.2.0':
2084 |     resolution: {integrity: sha512-y9GVzrUJ2xmgtQlzFP2KhVRoCglwfRQgjyfY607aU0hh0Un6d0OUyrJkjuAlsV18qR4zfoFPs/BiIj9YDS6Wzw==}
2085 |     peerDependencies:
2086 |       '@sveltejs/kit': ^1 || ^2
2087 |       next: '>= 13'
2088 |       react: ^19
2089 |       svelte: '>= 4'
2090 |       vue: ^3
2091 |       vue-router: ^4
2092 |     peerDependenciesMeta:
2093 |       '@sveltejs/kit':
2094 |         optional: true
2095 |       next:
2096 |         optional: true
2097 |       react:
2098 |         optional: true
2099 |       svelte:
2100 |         optional: true
2101 |       vue:
2102 |         optional: true
2103 |       vue-router:
2104 |         optional: true
2105 | 
2106 |   '@vis.gl/react-google-maps@1.5.5':
2107 |     resolution: {integrity: sha512-LgHtK1AtE2/BN4dPoK05oWu0jWmeDdyX0Ffqi+mZc+M4apaHn2sUxxKXAxhPF90O9vcsiou/ntm6/XBWX+gpqw==}
2108 |     peerDependencies:
2109 |       react: ^19
2110 |       react-dom: ^19
2111 | 
2112 |   '@vue/compiler-core@3.5.21':
2113 |     resolution: {integrity: sha512-8i+LZ0vf6ZgII5Z9XmUvrCyEzocvWT+TeR2VBUVlzIH6Tyv57E20mPZ1bCS+tbejgUgmjrEh7q/0F0bibskAmw==}
2114 | 
2115 |   '@vue/compiler-dom@3.5.21':
2116 |     resolution: {integrity: sha512-jNtbu/u97wiyEBJlJ9kmdw7tAr5Vy0Aj5CgQmo+6pxWNQhXZDPsRr1UWPN4v3Zf82s2H3kF51IbzZ4jMWAgPlQ==}
2117 | 
2118 |   '@vue/compiler-sfc@3.5.21':
2119 |     resolution: {integrity: sha512-SXlyk6I5eUGBd2v8Ie7tF6ADHE9kCR6mBEuPyH1nUZ0h6Xx6nZI29i12sJKQmzbDyr2tUHMhhTt51Z6blbkTTQ==}
2120 | 
2121 |   '@vue/compiler-ssr@3.5.21':
2122 |     resolution: {integrity: sha512-vKQ5olH5edFZdf5ZrlEgSO1j1DMA4u23TVK5XR1uMhvwnYvVdDF0nHXJUblL/GvzlShQbjhZZ2uvYmDlAbgo9w==}
2123 | 
2124 |   '@vue/devtools-api@6.6.4':
2125 |     resolution: {integrity: sha512-sGhTPMuXqZ1rVOk32RylztWkfXTRhuS7vgAKv0zjqk8gbsHkJ7xfFf+jbySxt7tWObEJwyKaHMikV/WGDiQm8g==}
2126 | 
2127 |   '@vue/reactivity@3.5.21':
2128 |     resolution: {integrity: sha512-3ah7sa+Cwr9iiYEERt9JfZKPw4A2UlbY8RbbnH2mGCE8NwHkhmlZt2VsH0oDA3P08X3jJd29ohBDtX+TbD9AsA==}
2129 | 
2130 |   '@vue/runtime-core@3.5.21':
2131 |     resolution: {integrity: sha512-+DplQlRS4MXfIf9gfD1BOJpk5RSyGgGXD/R+cumhe8jdjUcq/qlxDawQlSI8hCKupBlvM+3eS1se5xW+SuNAwA==}
2132 | 
2133 |   '@vue/runtime-dom@3.5.21':
2134 |     resolution: {integrity: sha512-3M2DZsOFwM5qI15wrMmNF5RJe1+ARijt2HM3TbzBbPSuBHOQpoidE+Pa+XEaVN+czbHf81ETRoG1ltztP2em8w==}
2135 | 
2136 |   '@vue/server-renderer@3.5.21':
2137 |     resolution: {integrity: sha512-qr8AqgD3DJPJcGvLcJKQo2tAc8OnXRcfxhOJCPF+fcfn5bBGz7VCcO7t+qETOPxpWK1mgysXvVT/j+xWaHeMWA==}
2138 |     peerDependencies:
2139 |       vue: 3.5.21
2140 | 
2141 |   '@vue/shared@3.5.21':
2142 |     resolution: {integrity: sha512-+2k1EQpnYuVuu3N7atWyG3/xoFWIVJZq4Mz8XNOdScFI0etES75fbny/oU4lKWk/577P1zmg0ioYvpGEDZ3DLw==}
2143 | 
2144 |   '@web3-storage/multipart-parser@1.0.0':
2145 |     resolution: {integrity: sha512-BEO6al7BYqcnfX15W2cnGR+Q566ACXAT9UQykORCWW80lmkpWsnEob6zJS1ZVBKsSJC8+7vJkHwlp+lXG1UCdw==}
2146 | 
2147 |   abort-controller@3.0.0:
2148 |     resolution: {integrity: sha512-h8lQ8tacZYnR3vNQTgibj+tODHI5/+l06Au2Pcriv/Gmet0eaj4TwWH41sO9wnHDiQsEj19q0drzdWdeAHtweg==}
2149 |     engines: {node: '>=6.5'}
2150 | 
2151 |   accepts@1.3.8:
2152 |     resolution: {integrity: sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==}
2153 |     engines: {node: '>= 0.6'}
2154 | 
2155 |   acorn@8.15.0:
2156 |     resolution: {integrity: sha512-NZyJarBfL7nWwIq+FDL6Zp/yHEhePMNnnJ0y3qfieCrmNvYct8uvtiV41UvlSe6apAfk0fY1FbWx+NwfmpvtTg==}
2157 |     engines: {node: '>=0.4.0'}
2158 |     hasBin: true
2159 | 
2160 |   agent-base@6.0.2:
2161 |     resolution: {integrity: sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ==}
2162 |     engines: {node: '>= 6.0.0'}
2163 | 
2164 |   agent-base@7.1.4:
2165 |     resolution: {integrity: sha512-MnA+YT8fwfJPgBx3m60MNqakm30XOkyIoH1y6huTQvC0PwZG7ki8NacLBcrPbNoo8vEZy7Jpuk7+jMO+CUovTQ==}
2166 |     engines: {node: '>= 14'}
2167 | 
2168 |   ajv@6.12.6:
2169 |     resolution: {integrity: sha512-j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==}
2170 | 
2171 |   ansi-regex@5.0.1:
2172 |     resolution: {integrity: sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==}
2173 |     engines: {node: '>=8'}
2174 | 
2175 |   ansi-regex@6.2.0:
2176 |     resolution: {integrity: sha512-TKY5pyBkHyADOPYlRT9Lx6F544mPl0vS5Ew7BJ45hA08Q+t3GjbueLliBWN3sMICk6+y7HdyxSzC4bWS8baBdg==}
2177 |     engines: {node: '>=12'}
2178 | 
2179 |   ansi-styles@4.3.0:
2180 |     resolution: {integrity: sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==}
2181 |     engines: {node: '>=8'}
2182 | 
2183 |   ansi-styles@6.2.1:
2184 |     resolution: {integrity: sha512-bN798gFfQX+viw3R7yrGWRqnrN2oRkEkUjjl4JNn4E8GxxbjtG3FbrEIIY3l8/hrwUwIeCZvi4QuOTP4MErVug==}
2185 |     engines: {node: '>=12'}
2186 | 
2187 |   any-promise@1.3.0:
2188 |     resolution: {integrity: sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==}
2189 | 
2190 |   anymatch@3.1.3:
2191 |     resolution: {integrity: sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==}
2192 |     engines: {node: '>= 8'}
2193 | 
2194 |   arg@5.0.2:
2195 |     resolution: {integrity: sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==}
2196 | 
2197 |   aria-hidden@1.2.6:
2198 |     resolution: {integrity: sha512-ik3ZgC9dY/lYVVM++OISsaYDeg1tb0VtP5uL3ouh1koGOaUMDPpbFIei4JkFimWUFPn90sbMNMXQAIVOlnYKJA==}
2199 |     engines: {node: '>=10'}
2200 | 
2201 |   aria-query@5.3.2:
2202 |     resolution: {integrity: sha512-COROpnaoap1E2F000S62r6A60uHZnmlvomhfyT2DlTcrY1OrBKn2UhH7qn5wTC9zMvD0AY7csdPSNwKP+7WiQw==}
2203 |     engines: {node: '>= 0.4'}
2204 | 
2205 |   array-flatten@1.1.1:
2206 |     resolution: {integrity: sha512-PCVAQswWemu6UdxsDFFX/+gVeYqKAod3D3UVm91jHwynguOwAvYPhx8nNlM++NqRcK6CxxpUafjmhIdKiHibqg==}
2207 | 
2208 |   arrify@2.0.1:
2209 |     resolution: {integrity: sha512-3duEwti880xqi4eAMN8AyR4a0ByT90zoYdLlevfrvU43vb0YZwZVfxOgxWrLXXXpyugL0hNZc9G6BiB5B3nUug==}
2210 |     engines: {node: '>=8'}
2211 | 
2212 |   asn1@0.2.6:
2213 |     resolution: {integrity: sha512-ix/FxPn0MDjeyJ7i/yoHGFt/EX6LyNbxSEhPPXODPL+KB0VPk86UYfL0lMdy+KCnv+fmvIzySwaK5COwqVbWTQ==}
2214 | 
2215 |   assert-plus@1.0.0:
2216 |     resolution: {integrity: sha512-NfJ4UzBCcQGLDlQq7nHxH+tv3kyZ0hHQqF5BO6J7tNJeP5do1llPr8dZ8zHonfhAu0PHAdMkSo+8o0wxg9lZWw==}
2217 |     engines: {node: '>=0.8'}
2218 | 
2219 |   async-retry@1.3.3:
2220 |     resolution: {integrity: sha512-wfr/jstw9xNi/0teMHrRW7dsz3Lt5ARhYNZ2ewpadnhaIp5mbALhOAP+EAdsC7t4Z6wqsDVv9+W6gm1Dk9mEyw==}
2221 | 
2222 |   asynckit@0.4.0:
2223 |     resolution: {integrity: sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==}
2224 | 
2225 |   autoprefixer@10.4.21:
2226 |     resolution: {integrity: sha512-O+A6LWV5LDHSJD3LjHYoNi4VLsj/Whi7k6zG12xTYaU4cQ8oxQGckXNX8cRHK5yOZ/ppVHe0ZBXGzSV9jXdVbQ==}
2227 |     engines: {node: ^10 || ^12 || >=14}
2228 |     hasBin: true
2229 |     peerDependencies:
2230 |       postcss: ^8.1.0
2231 | 
2232 |   aws-sign2@0.7.0:
2233 |     resolution: {integrity: sha512-08kcGqnYf/YmjoRhfxyu+CLxBjUtHLXLXX/vUfx9l2LYzG3c1m61nrpyFUZI6zeS+Li/wWMMidD9KgrqtGq3mA==}
2234 | 
2235 |   aws4@1.13.2:
2236 |     resolution: {integrity: sha512-lHe62zvbTB5eEABUVi/AwVh0ZKY9rMMDhmm+eeyuuUQbQ3+J+fONVQOZyj+DdrvD4BY33uYniyRJ4UJIaSKAfw==}
2237 | 
2238 |   axios@1.11.0:
2239 |     resolution: {integrity: sha512-1Lx3WLFQWm3ooKDYZD1eXmoGO9fxYQjrycfHFC8P0sCfQVXyROp0p9PFWBehewBOdCwHc+f/b8I0fMto5eSfwA==}
2240 | 
2241 |   axobject-query@4.1.0:
2242 |     resolution: {integrity: sha512-qIj0G9wZbMGNLjLmg1PT6v2mE9AH2zlnADJD/2tC6E00hgmhUOfEB6greHPAfLRSufHqROIUTkw6E+M3lH0PTQ==}
2243 |     engines: {node: '>= 0.4'}
2244 | 
2245 |   balanced-match@1.0.2:
2246 |     resolution: {integrity: sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==}
2247 | 
2248 |   base64-js@1.5.1:
2249 |     resolution: {integrity: sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==}
2250 | 
2251 |   bcrypt-pbkdf@1.0.2:
2252 |     resolution: {integrity: sha512-qeFIXtP4MSoi6NLqO12WfqARWWuCKi2Rn/9hJLEmtB5yTNr9DqFWkJRCf2qShWzPeAMRnOgCrq0sg/KLv5ES9w==}
2253 | 
2254 |   bignumber.js@9.3.1:
2255 |     resolution: {integrity: sha512-Ko0uX15oIUS7wJ3Rb30Fs6SkVbLmPBAKdlm7q9+ak9bbIeFf0MwuBsQV6z7+X768/cHsfg+WlysDWJcmthjsjQ==}
2256 | 
2257 |   binary-extensions@2.3.0:
2258 |     resolution: {integrity: sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==}
2259 |     engines: {node: '>=8'}
2260 | 
2261 |   body-parser@1.20.3:
2262 |     resolution: {integrity: sha512-7rAxByjUMqQ3/bHJy7D6OGXvx/MMc4IqBn/X0fcM1QUcAItpZrBEYhWGem+tzXH90c+G01ypMcYJBO9Y30203g==}
2263 |     engines: {node: '>= 0.8', npm: 1.2.8000 || >= 1.4.16}
2264 | 
2265 |   brace-expansion@2.0.2:
2266 |     resolution: {integrity: sha512-Jt0vHyM+jmUBqojB7E1NIYadt0vI0Qxjxd2TErW94wDz+E2LAm5vKMXXwg6ZZBTHPuUlDgQHKXvjGBdfcF1ZDQ==}
2267 | 
2268 |   braces@3.0.3:
2269 |     resolution: {integrity: sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==}
2270 |     engines: {node: '>=8'}
2271 | 
2272 |   browserslist@4.25.4:
2273 |     resolution: {integrity: sha512-4jYpcjabC606xJ3kw2QwGEZKX0Aw7sgQdZCvIK9dhVSPh76BKo+C+btT1RRofH7B+8iNpEbgGNVWiLki5q93yg==}
2274 |     engines: {node: ^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7}
2275 |     hasBin: true
2276 | 
2277 |   buffer-equal-constant-time@1.0.1:
2278 |     resolution: {integrity: sha512-zRpUiDwd/xk6ADqPMATG8vc9VPrkck7T07OIx0gnjmJAnHnTVXNQG3vfvWNuiZIkwu9KrKdA1iJKfsfTVxE6NA==}
2279 | 
2280 |   busboy@1.6.0:
2281 |     resolution: {integrity: sha512-8SFQbg/0hQ9xy3UNTB0YEnsNBbWfhf7RtnzpL7TkBiTBRfrQ9Fxcnz7VJsleJpyp6rVLvXiuORqjlHi5q+PYuA==}
2282 |     engines: {node: '>=10.16.0'}
2283 | 
2284 |   bytes@3.1.2:
2285 |     resolution: {integrity: sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==}
2286 |     engines: {node: '>= 0.8'}
2287 | 
2288 |   call-bind-apply-helpers@1.0.2:
2289 |     resolution: {integrity: sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==}
2290 |     engines: {node: '>= 0.4'}
2291 | 
2292 |   call-bound@1.0.4:
2293 |     resolution: {integrity: sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==}
2294 |     engines: {node: '>= 0.4'}
2295 | 
2296 |   camelcase-css@2.0.1:
2297 |     resolution: {integrity: sha512-QOSvevhslijgYwRx6Rv7zKdMF8lbRmx+uQGx2+vDc+KI/eBnsy9kit5aj23AgGu3pa4t9AgwbnXWqS+iOY+2aA==}
2298 |     engines: {node: '>= 6'}
2299 | 
2300 |   caniuse-lite@1.0.30001739:
2301 |     resolution: {integrity: sha512-y+j60d6ulelrNSwpPyrHdl+9mJnQzHBr08xm48Qno0nSk4h3Qojh+ziv2qE6rXf4k3tadF4o1J/1tAbVm1NtnA==}
2302 | 
2303 |   caseless@0.12.0:
2304 |     resolution: {integrity: sha512-4tYFyifaFfGacoiObjJegolkwSU4xQNGbVgUiNYVUxbQ2x2lUsFvY4hVgVzGiIe6WLOPqycWXA40l+PWsxthUw==}
2305 | 
2306 |   check-types@1.3.2:
2307 |     resolution: {integrity: sha512-Du/XZpADU9LiHAvkaMdGFwhB0JMBbgBaCTgEl+HvY2qBVpBsi2htt2UiZkaMvoiyruBYXbvD1SxxH0IGdf/WJw==}
2308 | 
2309 |   chokidar@3.6.0:
2310 |     resolution: {integrity: sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==}
2311 |     engines: {node: '>= 8.10.0'}
2312 | 
2313 |   class-variance-authority@0.7.1:
2314 |     resolution: {integrity: sha512-Ka+9Trutv7G8M6WT6SeiRWz792K5qEqIGEGzXKhAE6xOWAY6pPH8U+9IY3oCMv6kqTmLsv7Xh/2w2RigkePMsg==}
2315 | 
2316 |   client-only@0.0.1:
2317 |     resolution: {integrity: sha512-IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==}
2318 | 
2319 |   cliui@8.0.1:
2320 |     resolution: {integrity: sha512-BSeNnyus75C4//NQ9gQt1/csTXyo/8Sb+afLAkzAptFuMsod9HFokGNudZpi/oQV73hnVK+sR+5PVRMd+Dr7YQ==}
2321 |     engines: {node: '>=12'}
2322 | 
2323 |   clsx@2.1.1:
2324 |     resolution: {integrity: sha512-eYm0QWBtUrBWZWG0d386OGAw16Z995PiOVo2B7bjWSbHedGl5e0ZWaq65kOGgUSNesEIDkB9ISbTg/JK9dhCZA==}
2325 |     engines: {node: '>=6'}
2326 | 
2327 |   cmdk@1.0.4:
2328 |     resolution: {integrity: sha512-AnsjfHyHpQ/EFeAnG216WY7A5LiYCoZzCSygiLvfXC3H3LFGCprErteUcszaVluGOhuOTbJS3jWHrSDYPBBygg==}
2329 |     peerDependencies:
2330 |       react: ^19
2331 |       react-dom: ^19
2332 | 
2333 |   color-convert@2.0.1:
2334 |     resolution: {integrity: sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==}
2335 |     engines: {node: '>=7.0.0'}
2336 | 
2337 |   color-name@1.1.4:
2338 |     resolution: {integrity: sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==}
2339 | 
2340 |   color-string@1.9.1:
2341 |     resolution: {integrity: sha512-shrVawQFojnZv6xM40anx4CkoDP+fZsw/ZerEMsW/pyzsRbElpsL/DBVW7q3ExxwusdNXI3lXpuhEZkzs8p5Eg==}
2342 | 
2343 |   color@4.2.3:
2344 |     resolution: {integrity: sha512-1rXeuUUiGGrykh+CeBdu5Ie7OJwinCgQY0bc7GCRxy5xVHy+moaqkpL/jqQq0MtQOeYcrqEz4abc5f0KtU7W4A==}
2345 |     engines: {node: '>=12.5.0'}
2346 | 
2347 |   combined-stream@1.0.8:
2348 |     resolution: {integrity: sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==}
2349 |     engines: {node: '>= 0.8'}
2350 | 
2351 |   commander@4.1.1:
2352 |     resolution: {integrity: sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==}
2353 |     engines: {node: '>= 6'}
2354 | 
2355 |   content-disposition@0.5.4:
2356 |     resolution: {integrity: sha512-FveZTNuGw04cxlAiWbzi6zTAL/lhehaWbTtgluJh4/E95DqMwTmha3KZN1aAWA8cFIhHzMZUvLevkw5Rqk+tSQ==}
2357 |     engines: {node: '>= 0.6'}
2358 | 
2359 |   content-type@1.0.5:
2360 |     resolution: {integrity: sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==}
2361 |     engines: {node: '>= 0.6'}
2362 | 
2363 |   cookie-signature@1.0.6:
2364 |     resolution: {integrity: sha512-QADzlaHc8icV8I7vbaJXJwod9HWYp8uCqf1xa4OfNu1T7JVxQIrUgOWtHdNDtPiywmFbiS12VjotIXLrKM3orQ==}
2365 | 
2366 |   cookie@0.6.0:
2367 |     resolution: {integrity: sha512-U71cyTamuh1CRNCfpGY6to28lxvNwPG4Guz/EVjgf3Jmzv0vlDp1atT9eS5dDjMYHucpHbWns6Lwf3BKz6svdw==}
2368 |     engines: {node: '>= 0.6'}
2369 | 
2370 |   cookie@0.7.1:
2371 |     resolution: {integrity: sha512-6DnInpx7SJ2AK3+CTUE/ZM0vWTUboZCegxhC2xiIydHR9jNuTAASBrfEpHhiGOZw/nX51bHt6YQl8jsGo4y/0w==}
2372 |     engines: {node: '>= 0.6'}
2373 | 
2374 |   cookie@0.7.2:
2375 |     resolution: {integrity: sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==}
2376 |     engines: {node: '>= 0.6'}
2377 | 
2378 |   core-util-is@1.0.2:
2379 |     resolution: {integrity: sha512-3lqz5YjWTYnW6dlDa5TLaTCcShfar1e40rmcJVwCBJC6mWlFuj0eCHIElmG1g5kyuJ/GD+8Wn4FFCcz4gJPfaQ==}
2380 | 
2381 |   cors@2.8.5:
2382 |     resolution: {integrity: sha512-KIHbLJqu73RGr/hnbrO9uBeixNGuvSQjul/jdFvS/KFSIH1hWVd1ng7zOHx+YrEfInLG7q4n6GHQ9cDtxv/P6g==}
2383 |     engines: {node: '>= 0.10'}
2384 | 
2385 |   cross-spawn@7.0.6:
2386 |     resolution: {integrity: sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==}
2387 |     engines: {node: '>= 8'}
2388 | 
2389 |   cssesc@3.0.0:
2390 |     resolution: {integrity: sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==}
2391 |     engines: {node: '>=4'}
2392 |     hasBin: true
2393 | 
2394 |   csstype@3.1.3:
2395 |     resolution: {integrity: sha512-M1uQkMl8rQK/szD0LNhtqxIPLpimGm8sOBwU7lLnCpSbTyY3yeU1Vc7l4KT5zT4s/yOxHH5O7tIuuLOCnLADRw==}
2396 | 
2397 |   d3-array@3.2.4:
2398 |     resolution: {integrity: sha512-tdQAmyA18i4J7wprpYq8ClcxZy3SC31QMeByyCFyRt7BVHdREQZ5lpzoe5mFEYZUWe+oq8HBvk9JjpibyEV4Jg==}
2399 |     engines: {node: '>=12'}
2400 | 
2401 |   d3-color@3.1.0:
2402 |     resolution: {integrity: sha512-zg/chbXyeBtMQ1LbD/WSoW2DpC3I0mpmPdW+ynRTj/x2DAWYrIY7qeZIHidozwV24m4iavr15lNwIwLxRmOxhA==}
2403 |     engines: {node: '>=12'}
2404 | 
2405 |   d3-ease@3.0.1:
2406 |     resolution: {integrity: sha512-wR/XK3D3XcLIZwpbvQwQ5fK+8Ykds1ip7A2Txe0yxncXSdq1L9skcG7blcedkOX+ZcgxGAmLX1FrRGbADwzi0w==}
2407 |     engines: {node: '>=12'}
2408 | 
2409 |   d3-format@3.1.0:
2410 |     resolution: {integrity: sha512-YyUI6AEuY/Wpt8KWLgZHsIU86atmikuoOmCfommt0LYHiQSPjvX2AcFc38PX0CBpr2RCyZhjex+NS/LPOv6YqA==}
2411 |     engines: {node: '>=12'}
2412 | 
2413 |   d3-interpolate@3.0.1:
2414 |     resolution: {integrity: sha512-3bYs1rOD33uo8aqJfKP3JWPAibgw8Zm2+L9vBKEHJ2Rg+viTR7o5Mmv5mZcieN+FRYaAOWX5SJATX6k1PWz72g==}
2415 |     engines: {node: '>=12'}
2416 | 
2417 |   d3-path@3.1.0:
2418 |     resolution: {integrity: sha512-p3KP5HCf/bvjBSSKuXid6Zqijx7wIfNW+J/maPs+iwR35at5JCbLUT0LzF1cnjbCHWhqzQTIN2Jpe8pRebIEFQ==}
2419 |     engines: {node: '>=12'}
2420 | 
2421 |   d3-scale@4.0.2:
2422 |     resolution: {integrity: sha512-GZW464g1SH7ag3Y7hXjf8RoUuAFIqklOAq3MRl4OaWabTFJY9PN/E1YklhXLh+OQ3fM9yS2nOkCoS+WLZ6kvxQ==}
2423 |     engines: {node: '>=12'}
2424 | 
2425 |   d3-shape@3.2.0:
2426 |     resolution: {integrity: sha512-SaLBuwGm3MOViRq2ABk3eLoxwZELpH6zhl3FbAoJ7Vm1gofKx6El1Ib5z23NUEhF9AsGl7y+dzLe5Cw2AArGTA==}
2427 |     engines: {node: '>=12'}
2428 | 
2429 |   d3-time-format@4.1.0:
2430 |     resolution: {integrity: sha512-dJxPBlzC7NugB2PDLwo9Q8JiTR3M3e4/XANkreKSUxF8vvXKqm1Yfq4Q5dl8budlunRVlUUaDUgFt7eA8D6NLg==}
2431 |     engines: {node: '>=12'}
2432 | 
2433 |   d3-time@3.1.0:
2434 |     resolution: {integrity: sha512-VqKjzBLejbSMT4IgbmVgDjpkYrNWUYJnbCGo874u7MMKIWsILRX+OpX/gTk8MqjpT1A/c6HY2dCA77ZN0lkQ2Q==}
2435 |     engines: {node: '>=12'}
2436 | 
2437 |   d3-timer@3.0.1:
2438 |     resolution: {integrity: sha512-ndfJ/JxxMd3nw31uyKoY2naivF+r29V+Lc0svZxe1JvvIRmi8hUsrMvdOwgS1o6uBHmiz91geQ0ylPP0aj1VUA==}
2439 |     engines: {node: '>=12'}
2440 | 
2441 |   dashdash@1.14.1:
2442 |     resolution: {integrity: sha512-jRFi8UDGo6j+odZiEpjazZaWqEal3w/basFjQHQEwVtZJGDpxbH1MeYluwCS8Xq5wmLJooDlMgvVarmWfGM44g==}
2443 |     engines: {node: '>=0.10'}
2444 | 
2445 |   data-uri-to-buffer@4.0.1:
2446 |     resolution: {integrity: sha512-0R9ikRb668HB7QDxT1vkpuUBtqc53YyAwMwGeUFKRojY/NWKvdZ+9UYtRfGmhqNbRkTSVpMbmyhXipFFv2cb/A==}
2447 |     engines: {node: '>= 12'}
2448 | 
2449 |   date-fns-jalali@4.1.0-0:
2450 |     resolution: {integrity: sha512-hTIP/z+t+qKwBDcmmsnmjWTduxCg+5KfdqWQvb2X/8C9+knYY6epN/pfxdDuyVlSVeFz0sM5eEfwIUQ70U4ckg==}
2451 | 
2452 |   date-fns@4.1.0:
2453 |     resolution: {integrity: sha512-Ukq0owbQXxa/U3EGtsdVBkR1w7KOQ5gIBqdH2hkvknzZPYvBxb/aa6E8L7tmjFtkwZBu3UXBbjIgPo/Ez4xaNg==}
2454 | 
2455 |   debug@2.6.9:
2456 |     resolution: {integrity: sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==}
2457 |     peerDependencies:
2458 |       supports-color: '*'
2459 |     peerDependenciesMeta:
2460 |       supports-color:
2461 |         optional: true
2462 | 
2463 |   debug@4.4.1:
2464 |     resolution: {integrity: sha512-KcKCqiftBJcZr++7ykoDIEwSa3XWowTfNPo92BYxjXiyYEVrUQh2aLyhxBCwww+heortUFxEJYcRzosstTEBYQ==}
2465 |     engines: {node: '>=6.0'}
2466 |     peerDependencies:
2467 |       supports-color: '*'
2468 |     peerDependenciesMeta:
2469 |       supports-color:
2470 |         optional: true
2471 | 
2472 |   decimal.js-light@2.5.1:
2473 |     resolution: {integrity: sha512-qIMFpTMZmny+MMIitAB6D7iVPEorVw6YQRWkvarTkT4tBeSLLiHzcwj6q0MmYSFCiVpiqPJTJEYIrpcPzVEIvg==}
2474 | 
2475 |   deepmerge@4.3.1:
2476 |     resolution: {integrity: sha512-3sUqbMEc77XqpdNO7FRyRog+eW3ph+GYCbj+rK+uYyRMuwsVy0rMiVtPn+QJlKFvWP/1PYpapqYn0Me2knFn+A==}
2477 |     engines: {node: '>=0.10.0'}
2478 | 
2479 |   delayed-stream@1.0.0:
2480 |     resolution: {integrity: sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==}
2481 |     engines: {node: '>=0.4.0'}
2482 | 
2483 |   depd@2.0.0:
2484 |     resolution: {integrity: sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==}
2485 |     engines: {node: '>= 0.8'}
2486 | 
2487 |   destroy@1.2.0:
2488 |     resolution: {integrity: sha512-2sJGJTaXIIaR1w4iJSNoN0hnMY7Gpc/n8D4qSCJw8QqFWXf7cuAgnEHxBpweaVcPevC2l3KpjYCx3NypQQgaJg==}
2489 |     engines: {node: '>= 0.8', npm: 1.2.8000 || >= 1.4.16}
2490 | 
2491 |   detect-libc@2.0.4:
2492 |     resolution: {integrity: sha512-3UDv+G9CsCKO1WKMGw9fwq/SWJYbI0c5Y7LU1AXYoDdbhE2AHQ6N6Nb34sG8Fj7T5APy8qXDCKuuIHd1BR0tVA==}
2493 |     engines: {node: '>=8'}
2494 | 
2495 |   detect-node-es@1.1.0:
2496 |     resolution: {integrity: sha512-ypdmJU/TbBby2Dxibuv7ZLW3Bs1QEmM7nHjEANfohJLvE0XVujisn1qPJcZxg+qDucsr+bP6fLD1rPS3AhJ7EQ==}
2497 | 
2498 |   devalue@5.3.2:
2499 |     resolution: {integrity: sha512-UDsjUbpQn9kvm68slnrs+mfxwFkIflOhkanmyabZ8zOYk8SMEIbJ3TK+88g70hSIeytu4y18f0z/hYHMTrXIWw==}
2500 | 
2501 |   didyoumean@1.2.2:
2502 |     resolution: {integrity: sha512-gxtyfqMg7GKyhQmb056K7M3xszy/myH8w+B4RT+QXBQsvAOdc3XymqDDPHx1BgPgsdAA5SIifona89YtRATDzw==}
2503 | 
2504 |   dlv@1.1.3:
2505 |     resolution: {integrity: sha512-+HlytyjlPKnIG8XuRG8WvmBP8xs8P71y+SKKS6ZXWoEgLuePxtDoUEiH7WkdePWrQ5JBpE6aoVqfZfJUQkjXwA==}
2506 | 
2507 |   dom-helpers@5.2.1:
2508 |     resolution: {integrity: sha512-nRCa7CK3VTrM2NmGkIy4cbK7IZlgBE/PYMn55rrXefr5xXDP0LdtfPnblFDoVdcAfslJ7or6iqAUnx0CCGIWQA==}
2509 | 
2510 |   dunder-proto@1.0.1:
2511 |     resolution: {integrity: sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==}
2512 |     engines: {node: '>= 0.4'}
2513 | 
2514 |   duplexify@4.1.3:
2515 |     resolution: {integrity: sha512-M3BmBhwJRZsSx38lZyhE53Csddgzl5R7xGJNk7CVddZD6CcmwMCH8J+7AprIrQKH7TonKxaCjcv27Qmf+sQ+oA==}
2516 | 
2517 |   eastasianwidth@0.2.0:
2518 |     resolution: {integrity: sha512-I88TYZWc9XiYHRQ4/3c5rjjfgkjhLyW2luGIheGERbNQ6OY7yTybanSpDXZa8y7VUP9YmDcYa+eyq4ca7iLqWA==}
2519 | 
2520 |   ecc-jsbn@0.1.2:
2521 |     resolution: {integrity: sha512-eh9O+hwRHNbG4BLTjEl3nw044CkGm5X6LoaCf7LPp7UU8Qrt47JYNi6nPX8xjW97TKGKm1ouctg0QSpZe9qrnw==}
2522 | 
2523 |   ecdsa-sig-formatter@1.0.11:
2524 |     resolution: {integrity: sha512-nagl3RYrbNv6kQkeJIpt6NJZy8twLB/2vtz6yN9Z4vRKHN4/QZJIEbqohALSgwKdnksuY3k5Addp5lg8sVoVcQ==}
2525 | 
2526 |   ee-first@1.1.1:
2527 |     resolution: {integrity: sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==}
2528 | 
2529 |   electron-to-chromium@1.5.212:
2530 |     resolution: {integrity: sha512-gE7ErIzSW+d8jALWMcOIgf+IB6lpfsg6NwOhPVwKzDtN2qcBix47vlin4yzSregYDxTCXOUqAZjVY/Z3naS7ww==}
2531 | 
2532 |   embla-carousel-react@8.5.1:
2533 |     resolution: {integrity: sha512-z9Y0K84BJvhChXgqn2CFYbfEi6AwEr+FFVVKm/MqbTQ2zIzO1VQri6w67LcfpVF0AjbhwVMywDZqY4alYkjW5w==}
2534 |     peerDependencies:
2535 |       react: ^19
2536 | 
2537 |   embla-carousel-reactive-utils@8.5.1:
2538 |     resolution: {integrity: sha512-n7VSoGIiiDIc4MfXF3ZRTO59KDp820QDuyBDGlt5/65+lumPHxX2JLz0EZ23hZ4eg4vZGUXwMkYv02fw2JVo/A==}
2539 |     peerDependencies:
2540 |       embla-carousel: 8.5.1
2541 | 
2542 |   embla-carousel@8.5.1:
2543 |     resolution: {integrity: sha512-JUb5+FOHobSiWQ2EJNaueCNT/cQU9L6XWBbWmorWPQT9bkbk+fhsuLr8wWrzXKagO3oWszBO7MSx+GfaRk4E6A==}
2544 | 
2545 |   emoji-regex@8.0.0:
2546 |     resolution: {integrity: sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==}
2547 | 
2548 |   emoji-regex@9.2.2:
2549 |     resolution: {integrity: sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==}
2550 | 
2551 |   encodeurl@1.0.2:
2552 |     resolution: {integrity: sha512-TPJXq8JqFaVYm2CWmPvnP2Iyo4ZSM7/QKcSmuMLDObfpH5fi7RUGmd/rTDf+rut/saiDiQEeVTNgAmJEdAOx0w==}
2553 |     engines: {node: '>= 0.8'}
2554 | 
2555 |   encodeurl@2.0.0:
2556 |     resolution: {integrity: sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==}
2557 |     engines: {node: '>= 0.8'}
2558 | 
2559 |   end-of-stream@1.4.5:
2560 |     resolution: {integrity: sha512-ooEGc6HP26xXq/N+GCGOT0JKCLDGrq2bQUZrQ7gyrJiZANJ/8YDTxTpQBXGMn+WbIQXNVpyWymm7KYVICQnyOg==}
2561 | 
2562 |   entities@4.5.0:
2563 |     resolution: {integrity: sha512-V0hjH4dGPh9Ao5p0MoRY6BVqtwCjhz6vI5LT8AJ55H+4g9/4vbHx1I54fS0XuclLhDHArPQCiMjDxjaL8fPxhw==}
2564 |     engines: {node: '>=0.12'}
2565 | 
2566 |   es-define-property@1.0.1:
2567 |     resolution: {integrity: sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==}
2568 |     engines: {node: '>= 0.4'}
2569 | 
2570 |   es-errors@1.3.0:
2571 |     resolution: {integrity: sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==}
2572 |     engines: {node: '>= 0.4'}
2573 | 
2574 |   es-object-atoms@1.1.1:
2575 |     resolution: {integrity: sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==}
2576 |     engines: {node: '>= 0.4'}
2577 | 
2578 |   es-set-tostringtag@2.1.0:
2579 |     resolution: {integrity: sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==}
2580 |     engines: {node: '>= 0.4'}
2581 | 
2582 |   esbuild@0.25.9:
2583 |     resolution: {integrity: sha512-CRbODhYyQx3qp7ZEwzxOk4JBqmD/seJrzPa/cGjY1VtIn5E09Oi9/dB4JwctnfZ8Q8iT7rioVv5k/FNT/uf54g==}
2584 |     engines: {node: '>=18'}
2585 |     hasBin: true
2586 | 
2587 |   escalade@3.2.0:
2588 |     resolution: {integrity: sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==}
2589 |     engines: {node: '>=6'}
2590 | 
2591 |   escape-html@1.0.3:
2592 |     resolution: {integrity: sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==}
2593 | 
2594 |   esm-env@1.2.2:
2595 |     resolution: {integrity: sha512-Epxrv+Nr/CaL4ZcFGPJIYLWFom+YeV1DqMLHJoEd9SYRxNbaFruBwfEX/kkHUJf55j2+TUbmDcmuilbP1TmXHA==}
2596 | 
2597 |   esrap@2.1.0:
2598 |     resolution: {integrity: sha512-yzmPNpl7TBbMRC5Lj2JlJZNPml0tzqoqP5B1JXycNUwtqma9AKCO0M2wHrdgsHcy1WRW7S9rJknAMtByg3usgA==}
2599 | 
2600 |   estree-walker@2.0.2:
2601 |     resolution: {integrity: sha512-Rfkk/Mp/DL7JVje3u18FxFujQlTNR2q6QfMSMB7AvCBx91NGj/ba3kCfza0f6dVDbw7YlRf/nDrn7pQrCCyQ/w==}
2602 | 
2603 |   etag@1.8.1:
2604 |     resolution: {integrity: sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==}
2605 |     engines: {node: '>= 0.6'}
2606 | 
2607 |   event-target-shim@5.0.1:
2608 |     resolution: {integrity: sha512-i/2XbnSz/uxRCU6+NdVJgKWDTM427+MqYbkQzD321DuCQJUqOuJKIA0IM2+W2xtYHdKOmZ4dR6fExsd4SXL+WQ==}
2609 |     engines: {node: '>=6'}
2610 | 
2611 |   eventemitter3@4.0.7:
2612 |     resolution: {integrity: sha512-8guHBZCwKnFhYdHr2ysuRWErTwhoN2X8XELRlrRwpmfeY2jjuUN4taQMsULKUVo1K4DvZl+0pgfyoysHxvmvEw==}
2613 | 
2614 |   express@4.21.2:
2615 |     resolution: {integrity: sha512-28HqgMZAmih1Czt9ny7qr6ek2qddF4FclbMzwhCREB6OFfH+rXAnuNCwo1/wFvrtbgsQDb4kSbX9de9lFbrXnA==}
2616 |     engines: {node: '>= 0.10.0'}
2617 | 
2618 |   extend@3.0.2:
2619 |     resolution: {integrity: sha512-fjquC59cD7CyW6urNXK0FBufkZcoiGG80wTuPujX590cB5Ttln20E2UB4S/WARVqhXffZl2LNgS+gQdPIIim/g==}
2620 | 
2621 |   extsprintf@1.3.0:
2622 |     resolution: {integrity: sha512-11Ndz7Nv+mvAC1j0ktTa7fAb0vLyGGX+rMHNBYQviQDGU0Hw7lhctJANqbPhu9nV9/izT/IntTgZ7Im/9LJs9g==}
2623 |     engines: {'0': node >=0.6.0}
2624 | 
2625 |   farmhash-modern@1.1.0:
2626 |     resolution: {integrity: sha512-6ypT4XfgqJk/F3Yuv4SX26I3doUjt0GTG4a+JgWxXQpxXzTBq8fPUeGHfcYMMDPHJHm3yPOSjaeBwBGAHWXCdA==}
2627 |     engines: {node: '>=18.0.0'}
2628 | 
2629 |   fast-deep-equal@3.1.3:
2630 |     resolution: {integrity: sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==}
2631 | 
2632 |   fast-equals@5.2.2:
2633 |     resolution: {integrity: sha512-V7/RktU11J3I36Nwq2JnZEM7tNm17eBJz+u25qdxBZeCKiX6BkVSZQjwWIr+IobgnZy+ag73tTZgZi7tr0LrBw==}
2634 |     engines: {node: '>=6.0.0'}
2635 | 
2636 |   fast-glob@3.3.3:
2637 |     resolution: {integrity: sha512-7MptL8U0cqcFdzIzwOTHoilX9x5BrNqye7Z/LuC7kCMRio1EMSyqRK3BEAUD7sXRq4iT4AzTVuZdhgQ2TCvYLg==}
2638 |     engines: {node: '>=8.6.0'}
2639 | 
2640 |   fast-json-stable-stringify@2.1.0:
2641 |     resolution: {integrity: sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==}
2642 | 
2643 |   fast-xml-parser@4.5.3:
2644 |     resolution: {integrity: sha512-RKihhV+SHsIUGXObeVy9AXiBbFwkVk7Syp8XgwN5U3JV416+Gwp/GO9i0JYKmikykgz/UHRrrV4ROuZEo/T0ig==}
2645 |     hasBin: true
2646 | 
2647 |   fastq@1.19.1:
2648 |     resolution: {integrity: sha512-GwLTyxkCXjXbxqIhTsMI2Nui8huMPtnxg7krajPJAjnEG/iiOS7i+zCtWGZR9G0NBKbXKh6X9m9UIsYX/N6vvQ==}
2649 | 
2650 |   faye-websocket@0.11.4:
2651 |     resolution: {integrity: sha512-CzbClwlXAuiRQAlUyfqPgvPoNKTckTPGfwZV4ZdAhVcP2lh9KUxJg2b5GkE7XbjKQ3YJnQ9z6D9ntLAlB+tP8g==}
2652 |     engines: {node: '>=0.8.0'}
2653 | 
2654 |   fdir@6.5.0:
2655 |     resolution: {integrity: sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==}
2656 |     engines: {node: '>=12.0.0'}
2657 |     peerDependencies:
2658 |       picomatch: ^3 || ^4
2659 |     peerDependenciesMeta:
2660 |       picomatch:
2661 |         optional: true
2662 | 
2663 |   fetch-blob@3.2.0:
2664 |     resolution: {integrity: sha512-7yAQpD2UMJzLi1Dqv7qFYnPbaPx7ZfFK6PiIxQ4PfkGPyNyl2Ugx+a/umUonmKqjhM4DnfbMvdX6otXq83soQQ==}
2665 |     engines: {node: ^12.20 || >= 14.13}
2666 | 
2667 |   fill-range@7.1.1:
2668 |     resolution: {integrity: sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==}
2669 |     engines: {node: '>=8'}
2670 | 
2671 |   finalhandler@1.3.1:
2672 |     resolution: {integrity: sha512-6BN9trH7bp3qvnrRyzsBz+g3lZxTNZTbVO2EV1CS0WIcDbawYVdYvGflME/9QP0h0pYlCDBCTjYa9nZzMDpyxQ==}
2673 |     engines: {node: '>= 0.8'}
2674 | 
2675 |   firebase-admin@13.5.0:
2676 |     resolution: {integrity: sha512-QZOpv1DJRJpH8NcWiL1xXE10tw3L/bdPFlgjcWrqU3ufyOJDYfxB1MMtxiVTwxK16NlybQbEM6ciSich2uWEIQ==}
2677 |     engines: {node: '>=18'}
2678 | 
2679 |   firebase-functions@6.4.0:
2680 |     resolution: {integrity: sha512-Q/LGhJrmJEhT0dbV60J4hCkVSeOM6/r7xJS/ccmkXzTWMjo+UPAYX9zlQmGlEjotstZ0U9GtQSJSgbB2Z+TJDg==}
2681 |     engines: {node: '>=14.10.0'}
2682 |     hasBin: true
2683 |     peerDependencies:
2684 |       firebase-admin: ^11.10.0 || ^12.0.0 || ^13.0.0
2685 | 
2686 |   firebase@12.2.1:
2687 |     resolution: {integrity: sha512-UkuW2ZYaq/QuOQ24bfaqmkVqoBFhkA/ptATfPuRtc5vdm+zhwc3mfZBwFe6LqH9yrCN/6rAblgxKz2/0tDvA7w==}
2688 | 
2689 |   follow-redirects@1.15.11:
2690 |     resolution: {integrity: sha512-deG2P0JfjrTxl50XGCDyfI97ZGVCxIpfKYmfyrQ54n5FO/0gfIES8C/Psl6kWVDolizcaaxZJnTS0QSMxvnsBQ==}
2691 |     engines: {node: '>=4.0'}
2692 |     peerDependencies:
2693 |       debug: '*'
2694 |     peerDependenciesMeta:
2695 |       debug:
2696 |         optional: true
2697 | 
2698 |   foreground-child@3.3.1:
2699 |     resolution: {integrity: sha512-gIXjKqtFuWEgzFRJA9WCQeSJLZDjgJUOMCMzxtvFq/37KojM1BFGufqsCy0r4qSQmYLsZYMeyRqzIWOMup03sw==}
2700 |     engines: {node: '>=14'}
2701 | 
2702 |   forever-agent@0.6.1:
2703 |     resolution: {integrity: sha512-j0KLYPhm6zeac4lz3oJ3o65qvgQCcPubiyotZrXqEaG4hNagNYO8qdlUrX5vwqv9ohqeT/Z3j6+yW067yWWdUw==}
2704 | 
2705 |   form-data@2.3.3:
2706 |     resolution: {integrity: sha512-1lLKB2Mu3aGP1Q/2eCOx0fNbRMe7XdwktwOruhfqqd0rIJWwN4Dh+E3hrPSlDCXnSR7UtZ1N38rVXm+6+MEhJQ==}
2707 |     engines: {node: '>= 0.12'}
2708 | 
2709 |   form-data@2.5.5:
2710 |     resolution: {integrity: sha512-jqdObeR2rxZZbPSGL+3VckHMYtu+f9//KXBsVny6JSX/pa38Fy+bGjuG8eW/H6USNQWhLi8Num++cU2yOCNz4A==}
2711 |     engines: {node: '>= 0.12'}
2712 | 
2713 |   form-data@4.0.4:
2714 |     resolution: {integrity: sha512-KrGhL9Q4zjj0kiUt5OO4Mr/A/jlI2jDYs5eHBpYHPcBEVSiipAvn2Ko2HnPe20rmcuuvMHNdZFp+4IlGTMF0Ow==}
2715 |     engines: {node: '>= 6'}
2716 | 
2717 |   formdata-polyfill@4.0.10:
2718 |     resolution: {integrity: sha512-buewHzMvYL29jdeQTVILecSaZKnt/RJWjoZCF5OW60Z67/GmSLBkOFM7qh1PI3zFNtJbaZL5eQu1vLfazOwj4g==}
2719 |     engines: {node: '>=12.20.0'}
2720 | 
2721 |   forwarded@0.2.0:
2722 |     resolution: {integrity: sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==}
2723 |     engines: {node: '>= 0.6'}
2724 | 
2725 |   fraction.js@4.3.7:
2726 |     resolution: {integrity: sha512-ZsDfxO51wGAXREY55a7la9LScWpwv9RxIrYABrlvOFBlH/ShPnrtsXeuUIfXKKOVicNxQ+o8JTbJvjS4M89yew==}
2727 | 
2728 |   fresh@0.5.2:
2729 |     resolution: {integrity: sha512-zJ2mQYM18rEFOudeV4GShTGIQ7RbzA7ozbU9I/XBpm7kqgMywgmylMwXHxZJmkVoYkna9d2pVXVXPdYTP9ej8Q==}
2730 |     engines: {node: '>= 0.6'}
2731 | 
2732 |   fsevents@2.3.3:
2733 |     resolution: {integrity: sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==}
2734 |     engines: {node: ^8.16.0 || ^10.6.0 || >=11.0.0}
2735 |     os: [darwin]
2736 | 
2737 |   function-bind@1.1.2:
2738 |     resolution: {integrity: sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==}
2739 | 
2740 |   functional-red-black-tree@1.0.1:
2741 |     resolution: {integrity: sha512-dsKNQNdj6xA3T+QlADDA7mOSlX0qiMINjn0cgr+eGHGsbSHzTabcIogz2+p/iqP1Xs6EP/sS2SbqH+brGTbq0g==}
2742 | 
2743 |   gaxios@6.7.1:
2744 |     resolution: {integrity: sha512-LDODD4TMYx7XXdpwxAVRAIAuB0bzv0s+ywFonY46k126qzQHT9ygyoa9tncmOiQmmDrik65UYsEkv3lbfqQ3yQ==}
2745 |     engines: {node: '>=14'}
2746 | 
2747 |   gaxios@7.1.1:
2748 |     resolution: {integrity: sha512-Odju3uBUJyVCkW64nLD4wKLhbh93bh6vIg/ZIXkWiLPBrdgtc65+tls/qml+un3pr6JqYVFDZbbmLDQT68rTOQ==}
2749 |     engines: {node: '>=18'}
2750 | 
2751 |   gcp-metadata@6.1.1:
2752 |     resolution: {integrity: sha512-a4tiq7E0/5fTjxPAaH4jpjkSv/uCaU2p5KC6HVGrvl0cDjA8iBZv4vv1gyzlmK0ZUKqwpOyQMKzZQe3lTit77A==}
2753 |     engines: {node: '>=14'}
2754 | 
2755 |   gcp-metadata@7.0.1:
2756 |     resolution: {integrity: sha512-UcO3kefx6dCcZkgcTGgVOTFb7b1LlQ02hY1omMjjrrBzkajRMCFgYOjs7J71WqnuG1k2b+9ppGL7FsOfhZMQKQ==}
2757 |     engines: {node: '>=18'}
2758 | 
2759 |   geist@1.4.2:
2760 |     resolution: {integrity: sha512-OQUga/KUc8ueijck6EbtT07L4tZ5+TZgjw8PyWfxo16sL5FWk7gNViPNU8hgCFjy6bJi9yuTP+CRpywzaGN8zw==}
2761 |     peerDependencies:
2762 |       next: '>=13.2.0'
2763 | 
2764 |   geofire-common@6.0.0:
2765 |     resolution: {integrity: sha512-dQ2qKWMtHUEKT41Kw4dmAtMjvEyhWv1XPnHHlK5p5l5+0CgwHYQjhonGE2QcPP60cBYijbJ/XloeKDMU4snUQg==}
2766 | 
2767 |   get-caller-file@2.0.5:
2768 |     resolution: {integrity: sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==}
2769 |     engines: {node: 6.* || 8.* || >= 10.*}
2770 | 
2771 |   get-intrinsic@1.3.0:
2772 |     resolution: {integrity: sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==}
2773 |     engines: {node: '>= 0.4'}
2774 | 
2775 |   get-nonce@1.0.1:
2776 |     resolution: {integrity: sha512-FJhYRoDaiatfEkUK8HKlicmu/3SGFD51q3itKDGoSTysQJBnfOcxU5GxnhE1E6soB76MbT0MBtnKJuXyAx+96Q==}
2777 |     engines: {node: '>=6'}
2778 | 
2779 |   get-proto@1.0.1:
2780 |     resolution: {integrity: sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==}
2781 |     engines: {node: '>= 0.4'}
2782 | 
2783 |   getpass@0.1.7:
2784 |     resolution: {integrity: sha512-0fzj9JxOLfJ+XGLhR8ze3unN0KZCgZwiSSDz168VERjK8Wl8kVSdcu2kspd4s4wtAa1y/qrVRiAA0WclVsu0ng==}
2785 | 
2786 |   glob-parent@5.1.2:
2787 |     resolution: {integrity: sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==}
2788 |     engines: {node: '>= 6'}
2789 | 
2790 |   glob-parent@6.0.2:
2791 |     resolution: {integrity: sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==}
2792 |     engines: {node: '>=10.13.0'}
2793 | 
2794 |   glob@10.4.5:
2795 |     resolution: {integrity: sha512-7Bv8RF0k6xjo7d4A/PxYLbUCfb6c+Vpd2/mB2yRDlew7Jb5hEXiCD9ibfO7wpk8i4sevK6DFny9h7EYbM3/sHg==}
2796 |     hasBin: true
2797 | 
2798 |   google-auth-library@10.3.0:
2799 |     resolution: {integrity: sha512-ylSE3RlCRZfZB56PFJSfUCuiuPq83Fx8hqu1KPWGK8FVdSaxlp/qkeMMX/DT/18xkwXIHvXEXkZsljRwfrdEfQ==}
2800 |     engines: {node: '>=18'}
2801 | 
2802 |   google-auth-library@9.15.1:
2803 |     resolution: {integrity: sha512-Jb6Z0+nvECVz+2lzSMt9u98UsoakXxA2HGHMCxh+so3n90XgYWkq5dur19JAJV7ONiJY22yBTyJB1TSkvPq9Ng==}
2804 |     engines: {node: '>=14'}
2805 | 
2806 |   google-gax@4.6.1:
2807 |     resolution: {integrity: sha512-V6eky/xz2mcKfAd1Ioxyd6nmA61gao3n01C+YeuIwu3vzM9EDR6wcVzMSIbLMDXWeoi9SHYctXuKYC5uJUT3eQ==}
2808 |     engines: {node: '>=14'}
2809 | 
2810 |   google-logging-utils@0.0.2:
2811 |     resolution: {integrity: sha512-NEgUnEcBiP5HrPzufUkBzJOD/Sxsco3rLNo1F1TNf7ieU8ryUzBhqba8r756CjLX7rn3fHl6iLEwPYuqpoKgQQ==}
2812 |     engines: {node: '>=14'}
2813 | 
2814 |   google-logging-utils@1.1.1:
2815 |     resolution: {integrity: sha512-rcX58I7nqpu4mbKztFeOAObbomBbHU2oIb/d3tJfF3dizGSApqtSwYJigGCooHdnMyQBIw8BrWyK96w3YXgr6A==}
2816 |     engines: {node: '>=14'}
2817 | 
2818 |   googlemaps@1.12.0:
2819 |     resolution: {integrity: sha512-TwcEvPJmpWtJFAVMApUGDX89dURJjJFTPr4EiaoYy8g3BIgKzeXwjUdDSJ1Id1fqJm/lbQedWFiDnV/1EE6wxg==}
2820 |     engines: {node: '>=0.3.6'}
2821 | 
2822 |   gopd@1.2.0:
2823 |     resolution: {integrity: sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==}
2824 |     engines: {node: '>= 0.4'}
2825 | 
2826 |   gtoken@7.1.0:
2827 |     resolution: {integrity: sha512-pCcEwRi+TKpMlxAQObHDQ56KawURgyAf6jtIY046fJ5tIv3zDe/LEIubckAO8fj6JnAxLdmWkUfNyulQ2iKdEw==}
2828 |     engines: {node: '>=14.0.0'}
2829 | 
2830 |   gtoken@8.0.0:
2831 |     resolution: {integrity: sha512-+CqsMbHPiSTdtSO14O51eMNlrp9N79gmeqmXeouJOhfucAedHw9noVe/n5uJk3tbKE6a+6ZCQg3RPhVhHByAIw==}
2832 |     engines: {node: '>=18'}
2833 | 
2834 |   har-schema@2.0.0:
2835 |     resolution: {integrity: sha512-Oqluz6zhGX8cyRaTQlFMPw80bSJVG2x/cFb8ZPhUILGgHka9SsokCCOQgpveePerqidZOrT14ipqfJb7ILcW5Q==}
2836 |     engines: {node: '>=4'}
2837 | 
2838 |   har-validator@5.1.5:
2839 |     resolution: {integrity: sha512-nmT2T0lljbxdQZfspsno9hgrG3Uir6Ks5afism62poxqBM6sDnMEuPmzTq8XN0OEwqKLLdh1jQI3qyE66Nzb3w==}
2840 |     engines: {node: '>=6'}
2841 |     deprecated: this library is no longer supported
2842 | 
2843 |   has-symbols@1.1.0:
2844 |     resolution: {integrity: sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==}
2845 |     engines: {node: '>= 0.4'}
2846 | 
2847 |   has-tostringtag@1.0.2:
2848 |     resolution: {integrity: sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==}
2849 |     engines: {node: '>= 0.4'}
2850 | 
2851 |   hasown@2.0.2:
2852 |     resolution: {integrity: sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==}
2853 |     engines: {node: '>= 0.4'}
2854 | 
2855 |   html-entities@2.6.0:
2856 |     resolution: {integrity: sha512-kig+rMn/QOVRvr7c86gQ8lWXq+Hkv6CbAH1hLu+RG338StTpE8Z0b44SDVaqVu7HGKf27frdmUYEs9hTUX/cLQ==}
2857 | 
2858 |   http-errors@2.0.0:
2859 |     resolution: {integrity: sha512-FtwrG/euBzaEjYeRqOgly7G0qviiXoJWnvEH2Z1plBdXgbyjv34pHTSb9zoeHMyDy33+DWy5Wt9Wo+TURtOYSQ==}
2860 |     engines: {node: '>= 0.8'}
2861 | 
2862 |   http-parser-js@0.5.10:
2863 |     resolution: {integrity: sha512-Pysuw9XpUq5dVc/2SMHpuTY01RFl8fttgcyunjL7eEMhGM3cI4eOmiCycJDVCo/7O7ClfQD3SaI6ftDzqOXYMA==}
2864 | 
2865 |   http-proxy-agent@5.0.0:
2866 |     resolution: {integrity: sha512-n2hY8YdoRE1i7r6M0w9DIw5GgZN0G25P8zLCRQ8rjXtTU3vsNFBI/vWK/UIeE6g5MUUz6avwAPXmL6Fy9D/90w==}
2867 |     engines: {node: '>= 6'}
2868 | 
2869 |   http-signature@1.2.0:
2870 |     resolution: {integrity: sha512-CAbnr6Rz4CYQkLYUtSNXxQPUH2gK8f3iWexVlsnMeD+GjlsQ0Xsy1cOX+mN3dtxYomRy21CiOzU8Uhw6OwncEQ==}
2871 |     engines: {node: '>=0.8', npm: '>=1.3.7'}
2872 | 
2873 |   https-proxy-agent@5.0.1:
2874 |     resolution: {integrity: sha512-dFcAjpTQFgoLMzC2VwU+C/CbS7uRL0lWmxDITmqm7C+7F0Odmj6s9l6alZc6AELXhrnggM2CeWSXHGOdX2YtwA==}
2875 |     engines: {node: '>= 6'}
2876 | 
2877 |   https-proxy-agent@7.0.6:
2878 |     resolution: {integrity: sha512-vK9P5/iUfdl95AI+JVyUuIcVtd4ofvtrOr3HNtM2yxC9bnMbEdp3x01OhQNnjb8IJYi38VlTE3mBXwcfvywuSw==}
2879 |     engines: {node: '>= 14'}
2880 | 
2881 |   iconv-lite@0.4.24:
2882 |     resolution: {integrity: sha512-v3MXnZAcvnywkTUEZomIActle7RXXeedOR31wwl7VlyoXO4Qi9arvSenNQWne1TcRwhCL1HwLI21bEqdpj8/rA==}
2883 |     engines: {node: '>=0.10.0'}
2884 | 
2885 |   idb@7.1.1:
2886 |     resolution: {integrity: sha512-gchesWBzyvGHRO9W8tzUWFDycow5gwjvFKfyV9FF32Y7F50yZMp7mP+T2mJIWFx49zicqyC4uefHM17o6xKIVQ==}
2887 | 
2888 |   inherits@2.0.4:
2889 |     resolution: {integrity: sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==}
2890 | 
2891 |   input-otp@1.4.1:
2892 |     resolution: {integrity: sha512-+yvpmKYKHi9jIGngxagY9oWiiblPB7+nEO75F2l2o4vs+6vpPZZmUl4tBNYuTCvQjhvEIbdNeJu70bhfYP2nbw==}
2893 |     peerDependencies:
2894 |       react: ^19
2895 |       react-dom: ^19
2896 | 
2897 |   internmap@2.0.3:
2898 |     resolution: {integrity: sha512-5Hh7Y1wQbvY5ooGgPbDaL5iYLAPzMTUrjMulskHLH6wnv/A+1q5rgEaiuqEjB+oxGXIVZs1FF+R/KPN3ZSQYYg==}
2899 |     engines: {node: '>=12'}
2900 | 
2901 |   ipaddr.js@1.9.1:
2902 |     resolution: {integrity: sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==}
2903 |     engines: {node: '>= 0.10'}
2904 | 
2905 |   is-arrayish@0.3.2:
2906 |     resolution: {integrity: sha512-eVRqCvVlZbuw3GrM63ovNSNAeA1K16kaR/LRY/92w0zxQ5/1YzwblUX652i4Xs9RwAGjW9d9y6X88t8OaAJfWQ==}
2907 | 
2908 |   is-binary-path@2.1.0:
2909 |     resolution: {integrity: sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==}
2910 |     engines: {node: '>=8'}
2911 | 
2912 |   is-core-module@2.16.1:
2913 |     resolution: {integrity: sha512-UfoeMA6fIJ8wTYFEUjelnaGI67v6+N7qXJEvQuIGa99l4xsCruSYOVSQ0uPANn4dAzm8lkYPaKLrrijLq7x23w==}
2914 |     engines: {node: '>= 0.4'}
2915 | 
2916 |   is-extglob@2.1.1:
2917 |     resolution: {integrity: sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==}
2918 |     engines: {node: '>=0.10.0'}
2919 | 
2920 |   is-fullwidth-code-point@3.0.0:
2921 |     resolution: {integrity: sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==}
2922 |     engines: {node: '>=8'}
2923 | 
2924 |   is-glob@4.0.3:
2925 |     resolution: {integrity: sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==}
2926 |     engines: {node: '>=0.10.0'}
2927 | 
2928 |   is-number@7.0.0:
2929 |     resolution: {integrity: sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==}
2930 |     engines: {node: '>=0.12.0'}
2931 | 
2932 |   is-reference@3.0.3:
2933 |     resolution: {integrity: sha512-ixkJoqQvAP88E6wLydLGGqCJsrFUnqoH6HnaczB8XmDH1oaWU+xxdptvikTgaEhtZ53Ky6YXiBuUI2WXLMCwjw==}
2934 | 
2935 |   is-stream@2.0.1:
2936 |     resolution: {integrity: sha512-hFoiJiTl63nn+kstHGBtewWSKnQLpyb155KHheA1l39uvtO9nWIop1p3udqPcUd/xbF1VLMO4n7OI6p7RbngDg==}
2937 |     engines: {node: '>=8'}
2938 | 
2939 |   is-typedarray@1.0.0:
2940 |     resolution: {integrity: sha512-cyA56iCMHAh5CdzjJIa4aohJyeO1YbwLi3Jc35MmRU6poroFjIGZzUzupGiRPOjgHg9TLu43xbpwXk523fMxKA==}
2941 | 
2942 |   isexe@2.0.0:
2943 |     resolution: {integrity: sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==}
2944 | 
2945 |   isstream@0.1.2:
2946 |     resolution: {integrity: sha512-Yljz7ffyPbrLpLngrMtZ7NduUgVvi6wG9RJ9IUcyCd59YQ911PBJphODUcbOVbqYfxe1wuYf/LJ8PauMRwsM/g==}
2947 | 
2948 |   jackspeak@3.4.3:
2949 |     resolution: {integrity: sha512-OGlZQpz2yfahA/Rd1Y8Cd9SIEsqvXkLVoSw/cgwhnhFMDbsQFeZYoJJ7bIZBS9BcamUW96asq/npPWugM+RQBw==}
2950 | 
2951 |   jiti@1.21.7:
2952 |     resolution: {integrity: sha512-/imKNG4EbWNrVjoNC/1H5/9GFy+tqjGBHCaSsN+P2RnPqjsLmv6UD3Ej+Kj8nBWaRAwyk7kK5ZUc+OEatnTR3A==}
2953 |     hasBin: true
2954 | 
2955 |   jose@4.15.9:
2956 |     resolution: {integrity: sha512-1vUQX+IdDMVPj4k8kOxgUqlcK518yluMuGZwqlr44FS1ppZB/5GWh4rZG89erpOBOJjU/OBsnCVFfapsRz6nEA==}
2957 | 
2958 |   js-tokens@4.0.0:
2959 |     resolution: {integrity: sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==}
2960 | 
2961 |   jsbn@0.1.1:
2962 |     resolution: {integrity: sha512-UVU9dibq2JcFWxQPA6KCqj5O42VOmAY3zQUfEKxU0KpTGXwNoCjkX1e13eHNvw/xPynt6pU0rZ1htjWTNTSXsg==}
2963 | 
2964 |   json-bigint@1.0.0:
2965 |     resolution: {integrity: sha512-SiPv/8VpZuWbvLSMtTDU8hEfrZWg/mH/nV/b4o0CYbSxu1UIQPLdwKOCIyLQX+VIPO5vrLX3i8qtqFyhdPSUSQ==}
2966 | 
2967 |   json-schema-traverse@0.4.1:
2968 |     resolution: {integrity: sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==}
2969 | 
2970 |   json-schema@0.4.0:
2971 |     resolution: {integrity: sha512-es94M3nTIfsEPisRafak+HDLfHXnKBhV3vU5eqPcS3flIWqcxJWgXHXiey3YrpaNsanY5ei1VoYEbOzijuq9BA==}
2972 | 
2973 |   json-stringify-safe@5.0.1:
2974 |     resolution: {integrity: sha512-ZClg6AaYvamvYEE82d3Iyd3vSSIjQ+odgjaTzRuO3s7toCdFKczob2i0zCh7JE8kWn17yvAWhUVxvqGwUalsRA==}
2975 | 
2976 |   jsonwebtoken@9.0.2:
2977 |     resolution: {integrity: sha512-PRp66vJ865SSqOlgqS8hujT5U4AOgMfhrwYIuIhfKaoSCZcirrmASQr8CX7cUg+RMih+hgznrjp99o+W4pJLHQ==}
2978 |     engines: {node: '>=12', npm: '>=6'}
2979 | 
2980 |   jsprim@1.4.2:
2981 |     resolution: {integrity: sha512-P2bSOMAc/ciLz6DzgjVlGJP9+BrJWu5UDGK70C2iweC5QBIeFf0ZXRvGjEj2uYgrY2MkAAhsSWHDWlFtEroZWw==}
2982 |     engines: {node: '>=0.6.0'}
2983 | 
2984 |   jwa@1.4.2:
2985 |     resolution: {integrity: sha512-eeH5JO+21J78qMvTIDdBXidBd6nG2kZjg5Ohz/1fpa28Z4CcsWUzJ1ZZyFq/3z3N17aZy+ZuBoHljASbL1WfOw==}
2986 | 
2987 |   jwa@2.0.1:
2988 |     resolution: {integrity: sha512-hRF04fqJIP8Abbkq5NKGN0Bbr3JxlQ+qhZufXVr0DvujKy93ZCbXZMHDL4EOtodSbCWxOqR8MS1tXA5hwqCXDg==}
2989 | 
2990 |   jwks-rsa@3.2.0:
2991 |     resolution: {integrity: sha512-PwchfHcQK/5PSydeKCs1ylNym0w/SSv8a62DgHJ//7x2ZclCoinlsjAfDxAAbpoTPybOum/Jgy+vkvMmKz89Ww==}
2992 |     engines: {node: '>=14'}
2993 | 
2994 |   jws@3.2.2:
2995 |     resolution: {integrity: sha512-YHlZCB6lMTllWDtSPHz/ZXTsi8S00usEV6v1tjq8tOUZzw7DpSDWVXjXDre6ed1w/pd495ODpHZYSdkRTsa0HA==}
2996 | 
2997 |   jws@4.0.0:
2998 |     resolution: {integrity: sha512-KDncfTmOZoOMTFG4mBlG0qUIOlc03fmzH+ru6RgYVZhPkyiy/92Owlt/8UEN+a4TXR1FQetfIpJE8ApdvdVxTg==}
2999 | 
3000 |   kleur@4.1.5:
3001 |     resolution: {integrity: sha512-o+NO+8WrRiQEE4/7nwRJhN1HWpVmJm511pBHUxPLtp0BUISzlBplORYSmTclCnJvQq2tKu/sgl3xVpkc7ZWuQQ==}
3002 |     engines: {node: '>=6'}
3003 | 
3004 |   lilconfig@3.1.3:
3005 |     resolution: {integrity: sha512-/vlFKAoH5Cgt3Ie+JLhRbwOsCQePABiU3tJ1egGvyQ+33R/vcwM2Zl2QR/LzjsBeItPt3oSVXapn+m4nQDvpzw==}
3006 |     engines: {node: '>=14'}
3007 | 
3008 |   limiter@1.1.5:
3009 |     resolution: {integrity: sha512-FWWMIEOxz3GwUI4Ts/IvgVy6LPvoMPgjMdQ185nN6psJyBJ4yOpzqm695/h5umdLJg2vW3GR5iG11MAkR2AzJA==}
3010 | 
3011 |   lines-and-columns@1.2.4:
3012 |     resolution: {integrity: sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==}
3013 | 
3014 |   locate-character@3.0.0:
3015 |     resolution: {integrity: sha512-SW13ws7BjaeJ6p7Q6CO2nchbYEc3X3J6WrmTTDto7yMPqVSZTUyY5Tjbid+Ab8gLnATtygYtiDIJGQRRn2ZOiA==}
3016 | 
3017 |   lodash.camelcase@4.3.0:
3018 |     resolution: {integrity: sha512-TwuEnCnxbc3rAvhf/LbG7tJUDzhqXyFnv3dtzLOPgCG/hODL7WFnsbwktkD7yUV0RrreP/l1PALq/YSg6VvjlA==}
3019 | 
3020 |   lodash.clonedeep@4.5.0:
3021 |     resolution: {integrity: sha512-H5ZhCF25riFd9uB5UCkVKo61m3S/xZk1x4wA6yp/L3RFP6Z/eHH1ymQcGLo7J3GMPfm0V/7m1tryHuGVxpqEBQ==}
3022 | 
3023 |   lodash.includes@4.3.0:
3024 |     resolution: {integrity: sha512-W3Bx6mdkRTGtlJISOvVD/lbqjTlPPUDTMnlXZFnVwi9NKJ6tiAk6LVdlhZMm17VZisqhKcgzpO5Wz91PCt5b0w==}
3025 | 
3026 |   lodash.isboolean@3.0.3:
3027 |     resolution: {integrity: sha512-Bz5mupy2SVbPHURB98VAcw+aHh4vRV5IPNhILUCsOzRmsTmSQ17jIuqopAentWoehktxGd9e/hbIXq980/1QJg==}
3028 | 
3029 |   lodash.isinteger@4.0.4:
3030 |     resolution: {integrity: sha512-DBwtEWN2caHQ9/imiNeEA5ys1JoRtRfY3d7V9wkqtbycnAmTvRRmbHKDV4a0EYc678/dia0jrte4tjYwVBaZUA==}
3031 | 
3032 |   lodash.isnumber@3.0.3:
3033 |     resolution: {integrity: sha512-QYqzpfwO3/CWf3XP+Z+tkQsfaLL/EnUlXWVkIk5FUPc4sBdTehEqZONuyRt2P67PXAk+NXmTBcc97zw9t1FQrw==}
3034 | 
3035 |   lodash.isplainobject@4.0.6:
3036 |     resolution: {integrity: sha512-oSXzaWypCMHkPC3NvBEaPHf0KsA5mvPrOPgQWDsbg8n7orZ290M0BmC/jgRZ4vcJ6DTAhjrsSYgdsW/F+MFOBA==}
3037 | 
3038 |   lodash.isstring@4.0.1:
3039 |     resolution: {integrity: sha512-0wJxfxH1wgO3GrbuP+dTTk7op+6L41QCXbGINEmD+ny/G/eCqGzxyCsh7159S+mgDDcoarnBw6PC1PS5+wUGgw==}
3040 | 
3041 |   lodash.once@4.1.1:
3042 |     resolution: {integrity: sha512-Sb487aTOCr9drQVL8pIxOzVhafOjZN9UU54hiN8PU3uAiSV7lx1yYNpbNmex2PK6dSJoNTSJUUswT651yww3Mg==}
3043 | 
3044 |   lodash@4.17.21:
3045 |     resolution: {integrity: sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==}
3046 | 
3047 |   long@5.3.2:
3048 |     resolution: {integrity: sha512-mNAgZ1GmyNhD7AuqnTG3/VQ26o760+ZYBPKjPvugO8+nLbYfX6TVpJPseBvopbdY+qpZ/lKUnmEc1LeZYS3QAA==}
3049 | 
3050 |   loose-envify@1.4.0:
3051 |     resolution: {integrity: sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==}
3052 |     hasBin: true
3053 | 
3054 |   lru-cache@10.4.3:
3055 |     resolution: {integrity: sha512-JNAzZcXrCt42VGLuYz0zfAzDfAvJWW6AfYlDBQyDV5DClI2m5sAmK+OIO7s59XfsRsWHp02jAJrRadPRGTt6SQ==}
3056 | 
3057 |   lru-cache@6.0.0:
3058 |     resolution: {integrity: sha512-Jo6dJ04CmSjuznwJSS3pUeWmd/H0ffTlkXXgwZi+eq1UCmqQwCh+eLsYOYCwY991i2Fah4h1BEMCx4qThGbsiA==}
3059 |     engines: {node: '>=10'}
3060 | 
3061 |   lru-memoizer@2.3.0:
3062 |     resolution: {integrity: sha512-GXn7gyHAMhO13WSKrIiNfztwxodVsP8IoZ3XfrJV4yH2x0/OeTO/FIaAHTY5YekdGgW94njfuKmyyt1E0mR6Ug==}
3063 | 
3064 |   lucide-react@0.454.0:
3065 |     resolution: {integrity: sha512-hw7zMDwykCLnEzgncEEjHeA6+45aeEzRYuKHuyRSOPkhko+J3ySGjGIzu+mmMfDFG1vazHepMaYFYHbTFAZAAQ==}
3066 |     peerDependencies:
3067 |       react: ^19
3068 | 
3069 |   magic-string@0.30.18:
3070 |     resolution: {integrity: sha512-yi8swmWbO17qHhwIBNeeZxTceJMeBvWJaId6dyvTSOwTipqeHhMhOrz6513r1sOKnpvQ7zkhlG8tPrpilwTxHQ==}
3071 | 
3072 |   math-intrinsics@1.1.0:
3073 |     resolution: {integrity: sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==}
3074 |     engines: {node: '>= 0.4'}
3075 | 
3076 |   media-typer@0.3.0:
3077 |     resolution: {integrity: sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==}
3078 |     engines: {node: '>= 0.6'}
3079 | 
3080 |   merge-descriptors@1.0.3:
3081 |     resolution: {integrity: sha512-gaNvAS7TZ897/rVaZ0nMtAyxNyi/pdbjbAwUpFQpN70GqnVfOiXpeUUMKRBmzXaSQ8DdTX4/0ms62r2K+hE6mQ==}
3082 | 
3083 |   merge2@1.4.1:
3084 |     resolution: {integrity: sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==}
3085 |     engines: {node: '>= 8'}
3086 | 
3087 |   methods@1.1.2:
3088 |     resolution: {integrity: sha512-iclAHeNqNm68zFtnZ0e+1L2yUIdvzNoauKU4WBA3VvH/vPFieF7qfRlwUZU+DA9P9bPXIS90ulxoUoCH23sV2w==}
3089 |     engines: {node: '>= 0.6'}
3090 | 
3091 |   micromatch@4.0.8:
3092 |     resolution: {integrity: sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==}
3093 |     engines: {node: '>=8.6'}
3094 | 
3095 |   mime-db@1.52.0:
3096 |     resolution: {integrity: sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==}
3097 |     engines: {node: '>= 0.6'}
3098 | 
3099 |   mime-types@2.1.35:
3100 |     resolution: {integrity: sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==}
3101 |     engines: {node: '>= 0.6'}
3102 | 
3103 |   mime@1.6.0:
3104 |     resolution: {integrity: sha512-x0Vn8spI+wuJ1O6S7gnbaQg8Pxh4NNHb7KSINmEWKiPE4RKOplvijn+NkmYmmRgP68mc70j2EbeTFRsrswaQeg==}
3105 |     engines: {node: '>=4'}
3106 |     hasBin: true
3107 | 
3108 |   mime@3.0.0:
3109 |     resolution: {integrity: sha512-jSCU7/VB1loIWBZe14aEYHU/+1UMEHoaO7qxCOVJOw9GgH72VAWppxNcjU+x9a2k3GSIBXNKxXQFqRvvZ7vr3A==}
3110 |     engines: {node: '>=10.0.0'}
3111 |     hasBin: true
3112 | 
3113 |   minimatch@9.0.5:
3114 |     resolution: {integrity: sha512-G6T0ZX48xgozx7587koeX9Ys2NYy6Gmv//P89sEte9V9whIapMNF4idKxnW2QtCcLiTWlb/wfCabAtAFWhhBow==}
3115 |     engines: {node: '>=16 || 14 >=14.17'}
3116 | 
3117 |   minipass@7.1.2:
3118 |     resolution: {integrity: sha512-qOOzS1cBTWYF4BH8fVePDBOO9iptMnGUEZwNc/cMWnTV2nVLZ7VoNWEPHkYczZA0pdoA7dl6e7FL659nX9S2aw==}
3119 |     engines: {node: '>=16 || 14 >=14.17'}
3120 | 
3121 |   mri@1.2.0:
3122 |     resolution: {integrity: sha512-tzzskb3bG8LvYGFF/mDTpq3jpI6Q9wc3LEmBaghu+DdCssd1FakN7Bc0hVNmEyGq1bq3RgfkCb3cmQLpNPOroA==}
3123 |     engines: {node: '>=4'}
3124 | 
3125 |   mrmime@2.0.1:
3126 |     resolution: {integrity: sha512-Y3wQdFg2Va6etvQ5I82yUhGdsKrcYox6p7FfL1LbK2J4V01F9TGlepTIhnK24t7koZibmg82KGglhA1XK5IsLQ==}
3127 |     engines: {node: '>=10'}
3128 | 
3129 |   ms@2.0.0:
3130 |     resolution: {integrity: sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==}
3131 | 
3132 |   ms@2.1.3:
3133 |     resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}
3134 | 
3135 |   mz@2.7.0:
3136 |     resolution: {integrity: sha512-z81GNO7nnYMEhrGh9LeymoE4+Yr0Wn5McHIZMK5cfQCl+NDX08sCZgUc9/6MHni9IWuFLm1Z3HTCXu2z9fN62Q==}
3137 | 
3138 |   nanoid@3.3.11:
3139 |     resolution: {integrity: sha512-N8SpfPUnUp1bK+PMYW8qSWdl9U+wwNWI4QKxOYDy9JAro3WMX7p2OeVRF9v+347pnakNevPmiHhNmZ2HbFA76w==}
3140 |     engines: {node: ^10 || ^12 || ^13.7 || ^14 || >=15.0.1}
3141 |     hasBin: true
3142 | 
3143 |   negotiator@0.6.3:
3144 |     resolution: {integrity: sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==}
3145 |     engines: {node: '>= 0.6'}
3146 | 
3147 |   next-themes@0.4.6:
3148 |     resolution: {integrity: sha512-pZvgD5L0IEvX5/9GWyHMf3m8BKiVQwsCMHfoFosXtXBMnaS0ZnIJ9ST4b4NqLVKDEm8QBxoNNGNaBv2JNF6XNA==}
3149 |     peerDependencies:
3150 |       react: ^19
3151 |       react-dom: ^19
3152 | 
3153 |   next@15.2.4:
3154 |     resolution: {integrity: sha512-VwL+LAaPSxEkd3lU2xWbgEOtrM8oedmyhBqaVNmgKB+GvZlCy9rgaEc+y2on0wv+l0oSFqLtYD6dcC1eAedUaQ==}
3155 |     engines: {node: ^18.18.0 || ^19.8.0 || >= 20.0.0}
3156 |     hasBin: true
3157 |     peerDependencies:
3158 |       '@opentelemetry/api': ^1.1.0
3159 |       '@playwright/test': ^1.41.2
3160 |       babel-plugin-react-compiler: '*'
3161 |       react: ^19
3162 |       react-dom: ^19
3163 |       sass: ^1.3.0
3164 |     peerDependenciesMeta:
3165 |       '@opentelemetry/api':
3166 |         optional: true
3167 |       '@playwright/test':
3168 |         optional: true
3169 |       babel-plugin-react-compiler:
3170 |         optional: true
3171 |       sass:
3172 |         optional: true
3173 | 
3174 |   node-domexception@1.0.0:
3175 |     resolution: {integrity: sha512-/jKZoMpw0F8GRwl4/eLROPA3cfcXtLApP0QzLmUT/HuPCZWyB7IY9ZrMeKw2O/nFIqPQB3PVM9aYm0F312AXDQ==}
3176 |     engines: {node: '>=10.5.0'}
3177 |     deprecated: Use your platform's native DOMException instead
3178 | 
3179 |   node-fetch@2.7.0:
3180 |     resolution: {integrity: sha512-c4FRfUm/dbcWZ7U+1Wq0AwCyFL+3nt2bEw05wfxSz+DWpWsitgmSgYmy2dQdWyKC1694ELPqMs/YzUSNozLt8A==}
3181 |     engines: {node: 4.x || >=6.0.0}
3182 |     peerDependencies:
3183 |       encoding: ^0.1.0
3184 |     peerDependenciesMeta:
3185 |       encoding:
3186 |         optional: true
3187 | 
3188 |   node-fetch@3.3.2:
3189 |     resolution: {integrity: sha512-dRB78srN/l6gqWulah9SrxeYnxeddIG30+GOqK/9OlLVyLg3HPnr6SqOWTWOXKRwC2eGYCkZ59NNuSgvSrpgOA==}
3190 |     engines: {node: ^12.20.0 || ^14.13.1 || >=16.0.0}
3191 | 
3192 |   node-forge@1.3.1:
3193 |     resolution: {integrity: sha512-dPEtOeMvF9VMcYV/1Wb8CPoVAXtp6MKMlcbAt4ddqmGqUJ6fQZFXkNZNkNlfevtNkGtaSoXf/vNNNSvgrdXwtA==}
3194 |     engines: {node: '>= 6.13.0'}
3195 | 
3196 |   node-releases@2.0.19:
3197 |     resolution: {integrity: sha512-xxOWJsBKtzAq7DY0J+DTzuz58K8e7sJbdgwkbMWQe8UYB6ekmsQ45q0M/tJDsGaZmbC+l7n57UV8Hl5tHxO9uw==}
3198 | 
3199 |   normalize-path@3.0.0:
3200 |     resolution: {integrity: sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==}
3201 |     engines: {node: '>=0.10.0'}
3202 | 
3203 |   normalize-range@0.1.2:
3204 |     resolution: {integrity: sha512-bdok/XvKII3nUpklnV6P2hxtMNrCboOjAcyBuQnWEhO665FwrSNRxU+AqpsyvO6LgGYPspN+lu5CLtw4jPRKNA==}
3205 |     engines: {node: '>=0.10.0'}
3206 | 
3207 |   oauth-sign@0.9.0:
3208 |     resolution: {integrity: sha512-fexhUFFPTGV8ybAtSIGbV6gOkSv8UtRbDBnAyLQw4QPKkgNlsH2ByPGtMUqdWkos6YCRmAqViwgZrJc/mRDzZQ==}
3209 | 
3210 |   object-assign@4.1.1:
3211 |     resolution: {integrity: sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==}
3212 |     engines: {node: '>=0.10.0'}
3213 | 
3214 |   object-hash@3.0.0:
3215 |     resolution: {integrity: sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==}
3216 |     engines: {node: '>= 6'}
3217 | 
3218 |   object-inspect@1.13.4:
3219 |     resolution: {integrity: sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==}
3220 |     engines: {node: '>= 0.4'}
3221 | 
3222 |   on-finished@2.4.1:
3223 |     resolution: {integrity: sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==}
3224 |     engines: {node: '>= 0.8'}
3225 | 
3226 |   once@1.4.0:
3227 |     resolution: {integrity: sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==}
3228 | 
3229 |   p-limit@3.1.0:
3230 |     resolution: {integrity: sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==}
3231 |     engines: {node: '>=10'}
3232 | 
3233 |   package-json-from-dist@1.0.1:
3234 |     resolution: {integrity: sha512-UEZIS3/by4OC8vL3P2dTXRETpebLI2NiI5vIrjaD/5UtrkFX/tNbwjTSRAGC/+7CAo2pIcBaRgWmcBBHcsaCIw==}
3235 | 
3236 |   parseurl@1.3.3:
3237 |     resolution: {integrity: sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==}
3238 |     engines: {node: '>= 0.8'}
3239 | 
3240 |   path-key@3.1.1:
3241 |     resolution: {integrity: sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==}
3242 |     engines: {node: '>=8'}
3243 | 
3244 |   path-parse@1.0.7:
3245 |     resolution: {integrity: sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==}
3246 | 
3247 |   path-scurry@1.11.1:
3248 |     resolution: {integrity: sha512-Xa4Nw17FS9ApQFJ9umLiJS4orGjm7ZzwUrwamcGQuHSzDyth9boKDaycYdDcZDuqYATXw4HFXgaqWTctW/v1HA==}
3249 |     engines: {node: '>=16 || 14 >=14.18'}
3250 | 
3251 |   path-to-regexp@0.1.12:
3252 |     resolution: {integrity: sha512-RA1GjUVMnvYFxuqovrEqZoxxW5NUZqbwKtYz/Tt7nXerk0LbLblQmrsgdeOxV5SFHf0UDggjS/bSeOZwt1pmEQ==}
3253 | 
3254 |   performance-now@2.1.0:
3255 |     resolution: {integrity: sha512-7EAHlyLHI56VEIdK57uwHdHKIaAGbnXPiw0yWbarQZOKaKpvUIgW0jWRVLiatnM+XXlSwsanIBH/hzGMJulMow==}
3256 | 
3257 |   picocolors@1.1.1:
3258 |     resolution: {integrity: sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==}
3259 | 
3260 |   picomatch@2.3.1:
3261 |     resolution: {integrity: sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==}
3262 |     engines: {node: '>=8.6'}
3263 | 
3264 |   picomatch@4.0.3:
3265 |     resolution: {integrity: sha512-5gTmgEY/sqK6gFXLIsQNH19lWb4ebPDLA4SdLP7dsWkIXHWlG66oPuVvXSGFPppYZz8ZDZq0dYYrbHfBCVUb1Q==}
3266 |     engines: {node: '>=12'}
3267 | 
3268 |   pify@2.3.0:
3269 |     resolution: {integrity: sha512-udgsAY+fTnvv7kI7aaxbqwWNb0AHiB0qBO89PZKPkoTmGOgdbrHDKD+0B2X4uTfJ/FT1R09r9gTsjUjNJotuog==}
3270 |     engines: {node: '>=0.10.0'}
3271 | 
3272 |   pirates@4.0.7:
3273 |     resolution: {integrity: sha512-TfySrs/5nm8fQJDcBDuUng3VOUKsd7S+zqvbOTiGXHfxX4wK31ard+hoNuvkicM/2YFzlpDgABOevKSsB4G/FA==}
3274 |     engines: {node: '>= 6'}
3275 | 
3276 |   postcss-import@15.1.0:
3277 |     resolution: {integrity: sha512-hpr+J05B2FVYUAXHeK1YyI267J/dDDhMU6B6civm8hSY1jYJnBXxzKDKDswzJmtLHryrjhnDjqqp/49t8FALew==}
3278 |     engines: {node: '>=14.0.0'}
3279 |     peerDependencies:
3280 |       postcss: ^8.0.0
3281 | 
3282 |   postcss-js@4.0.1:
3283 |     resolution: {integrity: sha512-dDLF8pEO191hJMtlHFPRa8xsizHaM82MLfNkUHdUtVEV3tgTp5oj+8qbEqYM57SLfc74KSbw//4SeJma2LRVIw==}
3284 |     engines: {node: ^12 || ^14 || >= 16}
3285 |     peerDependencies:
3286 |       postcss: ^8.4.21
3287 | 
3288 |   postcss-load-config@4.0.2:
3289 |     resolution: {integrity: sha512-bSVhyJGL00wMVoPUzAVAnbEoWyqRxkjv64tUl427SKnPrENtq6hJwUojroMz2VB+Q1edmi4IfrAPpami5VVgMQ==}
3290 |     engines: {node: '>= 14'}
3291 |     peerDependencies:
3292 |       postcss: '>=8.0.9'
3293 |       ts-node: '>=9.0.0'
3294 |     peerDependenciesMeta:
3295 |       postcss:
3296 |         optional: true
3297 |       ts-node:
3298 |         optional: true
3299 | 
3300 |   postcss-nested@6.2.0:
3301 |     resolution: {integrity: sha512-HQbt28KulC5AJzG+cZtj9kvKB93CFCdLvog1WFLf1D+xmMvPGlBstkpTEZfK5+AN9hfJocyBFCNiqyS48bpgzQ==}
3302 |     engines: {node: '>=12.0'}
3303 |     peerDependencies:
3304 |       postcss: ^8.2.14
3305 | 
3306 |   postcss-selector-parser@6.1.2:
3307 |     resolution: {integrity: sha512-Q8qQfPiZ+THO/3ZrOrO0cJJKfpYCagtMUkXbnEfmgUjwXg6z/WBeOyS9APBBPCTSiDV+s4SwQGu8yFsiMRIudg==}
3308 |     engines: {node: '>=4'}
3309 | 
3310 |   postcss-value-parser@4.2.0:
3311 |     resolution: {integrity: sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==}
3312 | 
3313 |   postcss@8.4.31:
3314 |     resolution: {integrity: sha512-PS08Iboia9mts/2ygV3eLpY5ghnUcfLV/EXTOW1E2qYxJKGGBUtNjN76FYHnMs36RmARn41bC0AZmn+rR0OVpQ==}
3315 |     engines: {node: ^10 || ^12 || >=14}
3316 | 
3317 |   postcss@8.5.6:
3318 |     resolution: {integrity: sha512-3Ybi1tAuwAP9s0r1UQ2J4n5Y0G05bJkpUIO0/bI9MhwmD70S5aTWbXGBwxHrelT+XM1k6dM0pk+SwNkpTRN7Pg==}
3319 |     engines: {node: ^10 || ^12 || >=14}
3320 | 
3321 |   prop-types@15.8.1:
3322 |     resolution: {integrity: sha512-oj87CgZICdulUohogVAR7AjlC0327U4el4L6eAvOqCeudMDVU0NThNaV+b9Df4dXgSP1gXMTnPdhfe/2qDH5cg==}
3323 | 
3324 |   proto3-json-serializer@2.0.2:
3325 |     resolution: {integrity: sha512-SAzp/O4Yh02jGdRc+uIrGoe87dkN/XtwxfZ4ZyafJHymd79ozp5VG5nyZ7ygqPM5+cpLDjjGnYFUkngonyDPOQ==}
3326 |     engines: {node: '>=14.0.0'}
3327 | 
3328 |   protobufjs@7.5.4:
3329 |     resolution: {integrity: sha512-CvexbZtbov6jW2eXAvLukXjXUW1TzFaivC46BpWc/3BpcCysb5Vffu+B3XHMm8lVEuy2Mm4XGex8hBSg1yapPg==}
3330 |     engines: {node: '>=12.0.0'}
3331 | 
3332 |   proxy-addr@2.0.7:
3333 |     resolution: {integrity: sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==}
3334 |     engines: {node: '>= 0.10'}
3335 | 
3336 |   proxy-from-env@1.1.0:
3337 |     resolution: {integrity: sha512-D+zkORCbA9f1tdWRK0RaCR3GPv50cMxcrz4X8k5LTSUD1Dkw47mKJEZQNunItRTkWwgtaUSo1RVFRIG9ZXiFYg==}
3338 | 
3339 |   psl@1.15.0:
3340 |     resolution: {integrity: sha512-JZd3gMVBAVQkSs6HdNZo9Sdo0LNcQeMNP3CozBJb3JYC/QUYZTnKxP+f8oWRX4rHP5EurWxqAHTSwUCjlNKa1w==}
3341 | 
3342 |   punycode@2.3.1:
3343 |     resolution: {integrity: sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==}
3344 |     engines: {node: '>=6'}
3345 | 
3346 |   qs@4.0.0:
3347 |     resolution: {integrity: sha512-8MPmJ83uBOPsQj5tQCv4g04/nTiY+d17yl9o3Bw73vC6XlEm2POIRRlOgWJ8i74bkGLII670cDJJZkgiZ2sIkg==}
3348 | 
3349 |   qs@6.13.0:
3350 |     resolution: {integrity: sha512-+38qI9SOr8tfZ4QmJNplMUxqjbe7LKvvZgWdExBOmd+egZTtjLB67Gu0HRX3u/XOq7UU2Nx6nsjvS16Z9uwfpg==}
3351 |     engines: {node: '>=0.6'}
3352 | 
3353 |   qs@6.5.3:
3354 |     resolution: {integrity: sha512-qxXIEh4pCGfHICj1mAJQ2/2XVZkjCDTcEgfoSQxc/fYivUZxTkk7L3bDBJSoNrEzXI17oUO5Dp07ktqE5KzczA==}
3355 |     engines: {node: '>=0.6'}
3356 | 
3357 |   queue-microtask@1.2.3:
3358 |     resolution: {integrity: sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==}
3359 | 
3360 |   range-parser@1.2.1:
3361 |     resolution: {integrity: sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==}
3362 |     engines: {node: '>= 0.6'}
3363 | 
3364 |   raw-body@2.5.2:
3365 |     resolution: {integrity: sha512-8zGqypfENjCIqGhgXToC8aB2r7YrBX+AQAfIPs/Mlk+BtPTztOvTS01NRW/3Eh60J+a48lt8qsCzirQ6loCVfA==}
3366 |     engines: {node: '>= 0.8'}
3367 | 
3368 |   react-day-picker@9.9.0:
3369 |     resolution: {integrity: sha512-NtkJbuX6cl/VaGNb3sVVhmMA6LSMnL5G3xNL+61IyoZj0mUZFWTg4hmj7PHjIQ8MXN9dHWhUHFoJWG6y60DKSg==}
3370 |     engines: {node: '>=18'}
3371 |     peerDependencies:
3372 |       react: ^19
3373 | 
3374 |   react-dom@19.1.1:
3375 |     resolution: {integrity: sha512-Dlq/5LAZgF0Gaz6yiqZCf6VCcZs1ghAJyrsu84Q/GT0gV+mCxbfmKNoGRKBYMJ8IEdGPqu49YWXD02GCknEDkw==}
3376 |     peerDependencies:
3377 |       react: ^19
3378 | 
3379 |   react-hook-form@7.62.0:
3380 |     resolution: {integrity: sha512-7KWFejc98xqG/F4bAxpL41NB3o1nnvQO1RWZT3TqRZYL8RryQETGfEdVnJN2fy1crCiBLLjkRBVK05j24FxJGA==}
3381 |     engines: {node: '>=18.0.0'}
3382 |     peerDependencies:
3383 |       react: ^19
3384 | 
3385 |   react-is@16.13.1:
3386 |     resolution: {integrity: sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==}
3387 | 
3388 |   react-is@18.3.1:
3389 |     resolution: {integrity: sha512-/LLMVyas0ljjAtoYiPqYiL8VWXzUUdThrmU5+n20DZv+a+ClRoevUzw5JxU+Ieh5/c87ytoTBV9G1FiKfNJdmg==}
3390 | 
3391 |   react-remove-scroll-bar@2.3.8:
3392 |     resolution: {integrity: sha512-9r+yi9+mgU33AKcj6IbT9oRCO78WriSj6t/cF8DWBZJ9aOGPOTEDvdUDz1FwKim7QXWwmHqtdHnRJfhAxEG46Q==}
3393 |     engines: {node: '>=10'}
3394 |     peerDependencies:
3395 |       '@types/react': ^19
3396 |       react: ^19
3397 |     peerDependenciesMeta:
3398 |       '@types/react':
3399 |         optional: true
3400 | 
3401 |   react-remove-scroll@2.7.1:
3402 |     resolution: {integrity: sha512-HpMh8+oahmIdOuS5aFKKY6Pyog+FNaZV/XyJOq7b4YFwsFHe5yYfdbIalI4k3vU2nSDql7YskmUseHsRrJqIPA==}
3403 |     engines: {node: '>=10'}
3404 |     peerDependencies:
3405 |       '@types/react': ^19
3406 |       react: ^19
3407 |     peerDependenciesMeta:
3408 |       '@types/react':
3409 |         optional: true
3410 | 
3411 |   react-resizable-panels@2.1.9:
3412 |     resolution: {integrity: sha512-z77+X08YDIrgAes4jl8xhnUu1LNIRp4+E7cv4xHmLOxxUPO/ML7PSrE813b90vj7xvQ1lcf7g2uA9GeMZonjhQ==}
3413 |     peerDependencies:
3414 |       react: ^19
3415 |       react-dom: ^19
3416 | 
3417 |   react-router-dom@6.30.0:
3418 |     resolution: {integrity: sha512-x30B78HV5tFk8ex0ITwzC9TTZMua4jGyA9IUlH1JLQYQTFyxr/ZxwOJq7evg1JX1qGVUcvhsmQSKdPncQrjTgA==}
3419 |     engines: {node: '>=14.0.0'}
3420 |     peerDependencies:
3421 |       react: ^19
3422 |       react-dom: ^19
3423 | 
3424 |   react-router@6.30.0:
3425 |     resolution: {integrity: sha512-D3X8FyH9nBcTSHGdEKurK7r8OYE1kKFn3d/CF+CoxbSHkxU7o37+Uh7eAHRXr6k2tSExXYO++07PeXJtA/dEhQ==}
3426 |     engines: {node: '>=14.0.0'}
3427 |     peerDependencies:
3428 |       react: ^19
3429 | 
3430 |   react-smooth@4.0.4:
3431 |     resolution: {integrity: sha512-gnGKTpYwqL0Iii09gHobNolvX4Kiq4PKx6eWBCYYix+8cdw+cGo3do906l1NBPKkSWx1DghC1dlWG9L2uGd61Q==}
3432 |     peerDependencies:
3433 |       react: ^19
3434 |       react-dom: ^19
3435 | 
3436 |   react-style-singleton@2.2.3:
3437 |     resolution: {integrity: sha512-b6jSvxvVnyptAiLjbkWLE/lOnR4lfTtDAl+eUC7RZy+QQWc6wRzIV2CE6xBuMmDxc2qIihtDCZD5NPOFl7fRBQ==}
3438 |     engines: {node: '>=10'}
3439 |     peerDependencies:
3440 |       '@types/react': ^19
3441 |       react: ^19
3442 |     peerDependenciesMeta:
3443 |       '@types/react':
3444 |         optional: true
3445 | 
3446 |   react-transition-group@4.4.5:
3447 |     resolution: {integrity: sha512-pZcd1MCJoiKiBR2NRxeCRg13uCXbydPnmB4EOeRrY7480qNWO8IIgQG6zlDkm6uRMsURXPuKq0GWtiM59a5Q6g==}
3448 |     peerDependencies:
3449 |       react: ^19
3450 |       react-dom: ^19
3451 | 
3452 |   react@19.1.1:
3453 |     resolution: {integrity: sha512-w8nqGImo45dmMIfljjMwOGtbmC/mk4CMYhWIicdSflH91J9TyCyczcPFXJzrZ/ZXcgGRFeP6BU0BEJTw6tZdfQ==}
3454 |     engines: {node: '>=0.10.0'}
3455 | 
3456 |   read-cache@1.0.0:
3457 |     resolution: {integrity: sha512-Owdv/Ft7IjOgm/i0xvNDZ1LrRANRfew4b2prF3OWMQLxLfu3bS8FVhCsrSCMK4lR56Y9ya+AThoTpDCTxCmpRA==}
3458 | 
3459 |   readable-stream@3.6.2:
3460 |     resolution: {integrity: sha512-9u/sniCrY3D5WdsERHzHE4G2YCXqoG5FTHUiCC4SIbr6XcLZBY05ya9EKjYek9O5xOAwjGq+1JdGBAS7Q9ScoA==}
3461 |     engines: {node: '>= 6'}
3462 | 
3463 |   readdirp@3.6.0:
3464 |     resolution: {integrity: sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==}
3465 |     engines: {node: '>=8.10.0'}
3466 | 
3467 |   recharts-scale@0.4.5:
3468 |     resolution: {integrity: sha512-kivNFO+0OcUNu7jQquLXAxz1FIwZj8nrj+YkOKc5694NbjCvcT6aSZiIzNzd2Kul4o4rTto8QVR9lMNtxD4G1w==}
3469 | 
3470 |   recharts@2.15.0:
3471 |     resolution: {integrity: sha512-cIvMxDfpAmqAmVgc4yb7pgm/O1tmmkl/CjrvXuW+62/+7jj/iF9Ykm+hb/UJt42TREHMyd3gb+pkgoa2MxgDIw==}
3472 |     engines: {node: '>=14'}
3473 |     peerDependencies:
3474 |       react: ^19
3475 |       react-dom: ^19
3476 | 
3477 |   request@2.88.2:
3478 |     resolution: {integrity: sha512-MsvtOrfG9ZcrOwAW+Qi+F6HbD0CWXEh9ou77uOb7FM2WPhwT7smM833PzanhJLsgXjN89Ir6V2PczXNnMpwKhw==}
3479 |     engines: {node: '>= 6'}
3480 |     deprecated: request has been deprecated, see https://github.com/request/request/issues/3142
3481 | 
3482 |   require-directory@2.1.1:
3483 |     resolution: {integrity: sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==}
3484 |     engines: {node: '>=0.10.0'}
3485 | 
3486 |   resolve@1.22.10:
3487 |     resolution: {integrity: sha512-NPRy+/ncIMeDlTAsuqwKIiferiawhefFJtkNSW0qZJEqMEb+qBt/77B/jGeeek+F0uOeN05CDa6HXbbIgtVX4w==}
3488 |     engines: {node: '>= 0.4'}
3489 |     hasBin: true
3490 | 
3491 |   retry-request@7.0.2:
3492 |     resolution: {integrity: sha512-dUOvLMJ0/JJYEn8NrpOaGNE7X3vpI5XlZS/u0ANjqtcZVKnIxP7IgCFwrKTxENw29emmwug53awKtaMm4i9g5w==}
3493 |     engines: {node: '>=14'}
3494 | 
3495 |   retry@0.13.1:
3496 |     resolution: {integrity: sha512-XQBQ3I8W1Cge0Seh+6gjj03LbmRFWuoszgK9ooCpwYIrhhoO80pfq4cUkU5DkknwfOfFteRwlZ56PYOGYyFWdg==}
3497 |     engines: {node: '>= 4'}
3498 | 
3499 |   reusify@1.1.0:
3500 |     resolution: {integrity: sha512-g6QUff04oZpHs0eG5p83rFLhHeV00ug/Yf9nZM6fLeUrPguBTkTQOdpAWWspMh55TZfVQDPaN3NQJfbVRAxdIw==}
3501 |     engines: {iojs: '>=1.0.0', node: '>=0.10.0'}
3502 | 
3503 |   rollup@4.50.0:
3504 |     resolution: {integrity: sha512-/Zl4D8zPifNmyGzJS+3kVoyXeDeT/GrsJM94sACNg9RtUE0hrHa1bNPtRSrfHTMH5HjRzce6K7rlTh3Khiw+pw==}
3505 |     engines: {node: '>=18.0.0', npm: '>=8.0.0'}
3506 |     hasBin: true
3507 | 
3508 |   run-parallel@1.2.0:
3509 |     resolution: {integrity: sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==}
3510 | 
3511 |   sade@1.8.1:
3512 |     resolution: {integrity: sha512-xal3CZX1Xlo/k4ApwCFrHVACi9fBqJ7V+mwhBsuf/1IOKbBy098Fex+Wa/5QMubw09pSZ/u8EY8PWgevJsXp1A==}
3513 |     engines: {node: '>=6'}
3514 | 
3515 |   safe-buffer@5.2.1:
3516 |     resolution: {integrity: sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==}
3517 | 
3518 |   safer-buffer@2.1.2:
3519 |     resolution: {integrity: sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==}
3520 | 
3521 |   scheduler@0.26.0:
3522 |     resolution: {integrity: sha512-NlHwttCI/l5gCPR3D1nNXtWABUmBwvZpEQiD4IXSbIDq8BzLIK/7Ir5gTFSGZDUu37K5cMNp0hFtzO38sC7gWA==}
3523 | 
3524 |   semver@7.7.2:
3525 |     resolution: {integrity: sha512-RF0Fw+rO5AMf9MAyaRXI4AV0Ulj5lMHqVxxdSgiVbixSCXoEmmX/jk0CuJw4+3SqroYO9VoUh+HcuJivvtJemA==}
3526 |     engines: {node: '>=10'}
3527 |     hasBin: true
3528 | 
3529 |   send@0.19.0:
3530 |     resolution: {integrity: sha512-dW41u5VfLXu8SJh5bwRmyYUbAoSB3c9uQh6L8h/KtsFREPWpbX1lrljJo186Jc4nmci/sGUZ9a0a0J2zgfq2hw==}
3531 |     engines: {node: '>= 0.8.0'}
3532 | 
3533 |   serve-static@1.16.2:
3534 |     resolution: {integrity: sha512-VqpjJZKadQB/PEbEwvFdO43Ax5dFBZ2UECszz8bQ7pi7wt//PWe1P6MN7eCnjsatYtBT6EuiClbjSWP2WrIoTw==}
3535 |     engines: {node: '>= 0.8.0'}
3536 | 
3537 |   server-only@0.0.1:
3538 |     resolution: {integrity: sha512-qepMx2JxAa5jjfzxG79yPPq+8BuFToHd1hm7kI+Z4zAq1ftQiP7HcxMhDDItrbtwVeLg/cY2JnKnrcFkmiswNA==}
3539 | 
3540 |   set-cookie-parser@2.7.1:
3541 |     resolution: {integrity: sha512-IOc8uWeOZgnb3ptbCURJWNjWUPcO3ZnTTdzsurqERrP6nPyv+paC55vJM0LpOlT2ne+Ix+9+CRG1MNLlyZ4GjQ==}
3542 | 
3543 |   setprototypeof@1.2.0:
3544 |     resolution: {integrity: sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==}
3545 | 
3546 |   sharp@0.33.5:
3547 |     resolution: {integrity: sha512-haPVm1EkS9pgvHrQ/F3Xy+hgcuMV0Wm9vfIBSiwZ05k+xgb0PkBQpGsAA/oWdDobNaZTH5ppvHtzCFbnSEwHVw==}
3548 |     engines: {node: ^18.17.0 || ^20.3.0 || >=21.0.0}
3549 | 
3550 |   shebang-command@2.0.0:
3551 |     resolution: {integrity: sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==}
3552 |     engines: {node: '>=8'}
3553 | 
3554 |   shebang-regex@3.0.0:
3555 |     resolution: {integrity: sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==}
3556 |     engines: {node: '>=8'}
3557 | 
3558 |   side-channel-list@1.0.0:
3559 |     resolution: {integrity: sha512-FCLHtRD/gnpCiCHEiJLOwdmFP+wzCmDEkc9y7NsYxeF4u7Btsn1ZuwgwJGxImImHicJArLP4R0yX4c2KCrMrTA==}
3560 |     engines: {node: '>= 0.4'}
3561 | 
3562 |   side-channel-map@1.0.1:
3563 |     resolution: {integrity: sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==}
3564 |     engines: {node: '>= 0.4'}
3565 | 
3566 |   side-channel-weakmap@1.0.2:
3567 |     resolution: {integrity: sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==}
3568 |     engines: {node: '>= 0.4'}
3569 | 
3570 |   side-channel@1.1.0:
3571 |     resolution: {integrity: sha512-ZX99e6tRweoUXqR+VBrslhda51Nh5MTQwou5tnUDgbtyM0dBgmhEDtWGP/xbKn6hqfPRHujUNwz5fy/wbbhnpw==}
3572 |     engines: {node: '>= 0.4'}
3573 | 
3574 |   signal-exit@4.1.0:
3575 |     resolution: {integrity: sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==}
3576 |     engines: {node: '>=14'}
3577 | 
3578 |   simple-swizzle@0.2.2:
3579 |     resolution: {integrity: sha512-JA//kQgZtbuY83m+xT+tXJkmJncGMTFT+C+g2h2R9uxkYIrE2yy9sgmcLhCnw57/WSD+Eh3J97FPEDFnbXnDUg==}
3580 | 
3581 |   sirv@3.0.1:
3582 |     resolution: {integrity: sha512-FoqMu0NCGBLCcAkS1qA+XJIQTR6/JHfQXl+uGteNCQ76T91DMUjPa9xfmeqMY3z80nLSg9yQmNjK0Px6RWsH/A==}
3583 |     engines: {node: '>=18'}
3584 | 
3585 |   sonner@1.7.4:
3586 |     resolution: {integrity: sha512-DIS8z4PfJRbIyfVFDVnK9rO3eYDtse4Omcm6bt0oEr5/jtLgysmjuBl1frJ9E/EQZrFmKx2A8m/s5s9CRXIzhw==}
3587 |     peerDependencies:
3588 |       react: ^19
3589 |       react-dom: ^19
3590 | 
3591 |   source-map-js@1.2.1:
3592 |     resolution: {integrity: sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==}
3593 |     engines: {node: '>=0.10.0'}
3594 | 
3595 |   source-map@0.7.6:
3596 |     resolution: {integrity: sha512-i5uvt8C3ikiWeNZSVZNWcfZPItFQOsYTUAOkcUPGd8DqDy1uOUikjt5dG+uRlwyvR108Fb9DOd4GvXfT0N2/uQ==}
3597 |     engines: {node: '>= 12'}
3598 | 
3599 |   sshpk@1.18.0:
3600 |     resolution: {integrity: sha512-2p2KJZTSqQ/I3+HX42EpYOa2l3f8Erv8MWKsy2I9uf4wA7yFIkXRffYdsx86y6z4vHtV8u7g+pPlr8/4ouAxsQ==}
3601 |     engines: {node: '>=0.10.0'}
3602 |     hasBin: true
3603 | 
3604 |   statuses@2.0.1:
3605 |     resolution: {integrity: sha512-RwNA9Z/7PrK06rYLIzFMlaF+l73iwpzsqRIFgbMLbTcLD6cOao82TaWefPXQvB2fOC4AjuYSEndS7N/mTCbkdQ==}
3606 |     engines: {node: '>= 0.8'}
3607 | 
3608 |   stream-events@1.0.5:
3609 |     resolution: {integrity: sha512-E1GUzBSgvct8Jsb3v2X15pjzN1tYebtbLaMg+eBOUOAxgbLoSbT2NS91ckc5lJD1KfLjId+jXJRgo0qnV5Nerg==}
3610 | 
3611 |   stream-shift@1.0.3:
3612 |     resolution: {integrity: sha512-76ORR0DO1o1hlKwTbi/DM3EXWGf3ZJYO8cXX5RJwnul2DEg2oyoZyjLNoQM8WsvZiFKCRfC1O0J7iCvie3RZmQ==}
3613 | 
3614 |   streamsearch@1.1.0:
3615 |     resolution: {integrity: sha512-Mcc5wHehp9aXz1ax6bZUyY5afg9u2rv5cqQI3mRrYkGC8rW2hM02jWuwjtL++LS5qinSyhj2QfLyNsuc+VsExg==}
3616 |     engines: {node: '>=10.0.0'}
3617 | 
3618 |   string-width@4.2.3:
3619 |     resolution: {integrity: sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==}
3620 |     engines: {node: '>=8'}
3621 | 
3622 |   string-width@5.1.2:
3623 |     resolution: {integrity: sha512-HnLOCR3vjcY8beoNLtcjZ5/nxn2afmME6lhrDrebokqMap+XbeW8n9TXpPDOqdGK5qcI3oT0GKTW6wC7EMiVqA==}
3624 |     engines: {node: '>=12'}
3625 | 
3626 |   string_decoder@1.3.0:
3627 |     resolution: {integrity: sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==}
3628 | 
3629 |   strip-ansi@6.0.1:
3630 |     resolution: {integrity: sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==}
3631 |     engines: {node: '>=8'}
3632 | 
3633 |   strip-ansi@7.1.0:
3634 |     resolution: {integrity: sha512-iq6eVVI64nQQTRYq2KtEg2d2uU7LElhTJwsH4YzIHZshxlgZms/wIc4VoDQTlG/IvVIrBKG06CrZnp0qv7hkcQ==}
3635 |     engines: {node: '>=12'}
3636 | 
3637 |   strnum@1.1.2:
3638 |     resolution: {integrity: sha512-vrN+B7DBIoTTZjnPNewwhx6cBA/H+IS7rfW68n7XxC1y7uoiGQBxaKzqucGUgavX15dJgiGztLJ8vxuEzwqBdA==}
3639 | 
3640 |   stubs@3.0.0:
3641 |     resolution: {integrity: sha512-PdHt7hHUJKxvTCgbKX9C1V/ftOcjJQgz8BZwNfV5c4B6dcGqlpelTbJ999jBGZ2jYiPAwcX5dP6oBwVlBlUbxw==}
3642 | 
3643 |   styled-jsx@5.1.6:
3644 |     resolution: {integrity: sha512-qSVyDTeMotdvQYoHWLNGwRFJHC+i+ZvdBRYosOFgC+Wg1vx4frN2/RG/NA7SYqqvKNLf39P2LSRA2pu6n0XYZA==}
3645 |     engines: {node: '>= 12.0.0'}
3646 |     peerDependencies:
3647 |       '@babel/core': '*'
3648 |       babel-plugin-macros: '*'
3649 |       react: ^19
3650 |     peerDependenciesMeta:
3651 |       '@babel/core':
3652 |         optional: true
3653 |       babel-plugin-macros:
3654 |         optional: true
3655 | 
3656 |   sucrase@3.35.0:
3657 |     resolution: {integrity: sha512-8EbVDiu9iN/nESwxeSxDKe0dunta1GOlHufmSSXxMD2z2/tMZpDMpvXQGsc+ajGo8y2uYUmixaSRUc/QPoQ0GA==}
3658 |     engines: {node: '>=16 || 14 >=14.17'}
3659 |     hasBin: true
3660 | 
3661 |   supports-preserve-symlinks-flag@1.0.0:
3662 |     resolution: {integrity: sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==}
3663 |     engines: {node: '>= 0.4'}
3664 | 
3665 |   svelte@5.38.6:
3666 |     resolution: {integrity: sha512-ltBPlkvqk3bgCK7/N323atUpP3O3Y+DrGV4dcULrsSn4fZaaNnOmdplNznwfdWclAgvSr5rxjtzn/zJhRm6TKg==}
3667 |     engines: {node: '>=18'}
3668 | 
3669 |   tailwind-merge@2.6.0:
3670 |     resolution: {integrity: sha512-P+Vu1qXfzediirmHOC3xKGAYeZtPcV9g76X+xg2FD4tYgR71ewMA35Y3sCz3zhiN/dwefRpJX0yBcgwi1fXNQA==}
3671 | 
3672 |   tailwindcss-animate@1.0.7:
3673 |     resolution: {integrity: sha512-bl6mpH3T7I3UFxuvDEXLxy/VuFxBk5bbzplh7tXI68mwMokNYd1t9qPBHlnyTwfa4JGC4zP516I1hYYtQ/vspA==}
3674 |     peerDependencies:
3675 |       tailwindcss: '>=3.0.0 || insiders'
3676 | 
3677 |   tailwindcss@3.4.17:
3678 |     resolution: {integrity: sha512-w33E2aCvSDP0tW9RZuNXadXlkHXqFzSkQew/aIa2i/Sj8fThxwovwlXHSPXTbAHwEIhBFXAedUhP2tueAKP8Og==}
3679 |     engines: {node: '>=14.0.0'}
3680 |     hasBin: true
3681 | 
3682 |   teeny-request@9.0.0:
3683 |     resolution: {integrity: sha512-resvxdc6Mgb7YEThw6G6bExlXKkv6+YbuzGg9xuXxSgxJF7Ozs+o8Y9+2R3sArdWdW8nOokoQb1yrpFB0pQK2g==}
3684 |     engines: {node: '>=14'}
3685 | 
3686 |   thenify-all@1.6.0:
3687 |     resolution: {integrity: sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==}
3688 |     engines: {node: '>=0.8'}
3689 | 
3690 |   thenify@3.3.1:
3691 |     resolution: {integrity: sha512-RVZSIV5IG10Hk3enotrhvz0T9em6cyHBLkH/YAZuKqd8hRkKhSfCGIcP2KUY0EPxndzANBmNllzWPwak+bheSw==}
3692 | 
3693 |   tiny-invariant@1.3.3:
3694 |     resolution: {integrity: sha512-+FbBPE1o9QAYvviau/qC5SE3caw21q3xkvWKBtja5vgqOWIHHJ3ioaq1VPfn/Szqctz2bU/oYeKd9/z5BL+PVg==}
3695 | 
3696 |   tinyglobby@0.2.14:
3697 |     resolution: {integrity: sha512-tX5e7OM1HnYr2+a2C/4V0htOcSQcoSTH9KgJnVvNm5zm/cyEWKJ7j7YutsH9CxMdtOkkLFy2AHrMci9IM8IPZQ==}
3698 |     engines: {node: '>=12.0.0'}
3699 | 
3700 |   to-regex-range@5.0.1:
3701 |     resolution: {integrity: sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==}
3702 |     engines: {node: '>=8.0'}
3703 | 
3704 |   toidentifier@1.0.1:
3705 |     resolution: {integrity: sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==}
3706 |     engines: {node: '>=0.6'}
3707 | 
3708 |   totalist@3.0.1:
3709 |     resolution: {integrity: sha512-sf4i37nQ2LBx4m3wB74y+ubopq6W/dIzXg0FDGjsYnZHVa1Da8FH853wlL2gtUhg+xJXjfk3kUZS3BRoQeoQBQ==}
3710 |     engines: {node: '>=6'}
3711 | 
3712 |   tough-cookie@2.5.0:
3713 |     resolution: {integrity: sha512-nlLsUzgm1kfLXSXfRZMc1KLAugd4hqJHDTvc2hDIwS3mZAfMEuMbc03SujMF+GEcpaX/qboeycw6iO8JwVv2+g==}
3714 |     engines: {node: '>=0.8'}
3715 | 
3716 |   tr46@0.0.3:
3717 |     resolution: {integrity: sha512-N3WMsuqV66lT30CrXNbEjx4GEwlow3v6rr4mCcv6prnfwhS01rkgyFdjPNBYd9br7LpXV1+Emh01fHnq2Gdgrw==}
3718 | 
3719 |   ts-interface-checker@0.1.13:
3720 |     resolution: {integrity: sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==}
3721 | 
3722 |   tslib@2.8.1:
3723 |     resolution: {integrity: sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==}
3724 | 
3725 |   tunnel-agent@0.6.0:
3726 |     resolution: {integrity: sha512-McnNiV1l8RYeY8tBgEpuodCC1mLUdbSN+CYBL7kJsJNInOP8UjDDEwdk6Mw60vdLLrr5NHKZhMAOSrR2NZuQ+w==}
3727 | 
3728 |   turbo-stream@2.4.1:
3729 |     resolution: {integrity: sha512-v8kOJXpG3WoTN/+at8vK7erSzo6nW6CIaeOvNOkHQVDajfz1ZVeSxCbc6tOH4hrGZW7VUCV0TOXd8CPzYnYkrw==}
3730 | 
3731 |   tweetnacl@0.14.5:
3732 |     resolution: {integrity: sha512-KXXFFdAbFXY4geFIwoyNK+f5Z1b7swfXABfL7HXCmoIWMKU3dmS26672A4EeQtDzLKy7SXmfBu51JolvEKwtGA==}
3733 | 
3734 |   type-is@1.6.18:
3735 |     resolution: {integrity: sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==}
3736 |     engines: {node: '>= 0.6'}
3737 | 
3738 |   typescript@5.9.2:
3739 |     resolution: {integrity: sha512-CWBzXQrc/qOkhidw1OzBTQuYRbfyxDXJMVJ1XNwUHGROVmuaeiEm3OslpZ1RV96d7SKKjZKrSJu3+t/xlw3R9A==}
3740 |     engines: {node: '>=14.17'}
3741 |     hasBin: true
3742 | 
3743 |   undici-types@6.21.0:
3744 |     resolution: {integrity: sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==}
3745 | 
3746 |   unpipe@1.0.0:
3747 |     resolution: {integrity: sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==}
3748 |     engines: {node: '>= 0.8'}
3749 | 
3750 |   update-browserslist-db@1.1.3:
3751 |     resolution: {integrity: sha512-UxhIZQ+QInVdunkDAaiazvvT/+fXL5Osr0JZlJulepYu6Jd7qJtDZjlur0emRlT71EN3ScPoE7gvsuIKKNavKw==}
3752 |     hasBin: true
3753 |     peerDependencies:
3754 |       browserslist: '>= 4.21.0'
3755 | 
3756 |   uri-js@4.4.1:
3757 |     resolution: {integrity: sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==}
3758 | 
3759 |   use-callback-ref@1.3.3:
3760 |     resolution: {integrity: sha512-jQL3lRnocaFtu3V00JToYz/4QkNWswxijDaCVNZRiRTO3HQDLsdu1ZtmIUvV4yPp+rvWm5j0y0TG/S61cuijTg==}
3761 |     engines: {node: '>=10'}
3762 |     peerDependencies:
3763 |       '@types/react': ^19
3764 |       react: ^19
3765 |     peerDependenciesMeta:
3766 |       '@types/react':
3767 |         optional: true
3768 | 
3769 |   use-sidecar@1.1.3:
3770 |     resolution: {integrity: sha512-Fedw0aZvkhynoPYlA5WXrMCAMm+nSWdZt6lzJQ7Ok8S6Q+VsHmHpRWndVRJ8Be0ZbkfPc5LRYH+5XrzXcEeLRQ==}
3771 |     engines: {node: '>=10'}
3772 |     peerDependencies:
3773 |       '@types/react': ^19
3774 |       react: ^19
3775 |     peerDependenciesMeta:
3776 |       '@types/react':
3777 |         optional: true
3778 | 
3779 |   use-sync-external-store@1.5.0:
3780 |     resolution: {integrity: sha512-Rb46I4cGGVBmjamjphe8L/UnvJD+uPPtTkNvX5mZgqdbavhI4EbgIWJiIHXJ8bc/i9EQGPRh4DwEURJ552Do0A==}
3781 |     peerDependencies:
3782 |       react: ^19
3783 | 
3784 |   util-deprecate@1.0.2:
3785 |     resolution: {integrity: sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==}
3786 | 
3787 |   utils-merge@1.0.1:
3788 |     resolution: {integrity: sha512-pMZTvIkT1d+TFGvDOqodOclx0QWkkgi6Tdoa8gC8ffGAAqz9pzPTZWAybbsHHoED/ztMtkv/VoYTYyShUn81hA==}
3789 |     engines: {node: '>= 0.4.0'}
3790 | 
3791 |   uuid@11.1.0:
3792 |     resolution: {integrity: sha512-0/A9rDy9P7cJ+8w1c9WD9V//9Wj15Ce2MPz8Ri6032usz+NfePxx5AcN3bN+r6ZL6jEo066/yNYB3tn4pQEx+A==}
3793 |     hasBin: true
3794 | 
3795 |   uuid@3.4.0:
3796 |     resolution: {integrity: sha512-HjSDRw6gZE5JMggctHBcjVak08+KEVhSIiDzFnT9S9aegmp85S/bReBVTb4QTFaRNptJ9kuYaNhnbNEOkbKb/A==}
3797 |     deprecated: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
3798 |     hasBin: true
3799 | 
3800 |   uuid@8.3.2:
3801 |     resolution: {integrity: sha512-+NYs2QeMWy+GWFOEm9xnn6HCDp0l7QBD7ml8zLUmJ+93Q5NF0NocErnwkTkXVFNiX3/fpC6afS8Dhb/gz7R7eg==}
3802 |     hasBin: true
3803 | 
3804 |   uuid@9.0.1:
3805 |     resolution: {integrity: sha512-b+1eJOlsR9K8HJpow9Ok3fiWOWSIcIzXodvv0rQjVoOVNpWMpxf1wZNpt4y9h10odCNrqnYp1OBzRktckBe3sA==}
3806 |     hasBin: true
3807 | 
3808 |   vary@1.1.2:
3809 |     resolution: {integrity: sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==}
3810 |     engines: {node: '>= 0.8'}
3811 | 
3812 |   vaul@0.9.9:
3813 |     resolution: {integrity: sha512-7afKg48srluhZwIkaU+lgGtFCUsYBSGOl8vcc8N/M3YQlZFlynHD15AE+pwrYdc826o7nrIND4lL9Y6b9WWZZQ==}
3814 |     peerDependencies:
3815 |       react: ^19
3816 |       react-dom: ^19
3817 | 
3818 |   verror@1.10.0:
3819 |     resolution: {integrity: sha512-ZZKSmDAEFOijERBLkmYfJ+vmk3w+7hOLYDNkRCuRuMJGEmqYNCNLyBBFwWKVMhfwaEF3WOd0Zlw86U/WC/+nYw==}
3820 |     engines: {'0': node >=0.6.0}
3821 | 
3822 |   victory-vendor@36.9.2:
3823 |     resolution: {integrity: sha512-PnpQQMuxlwYdocC8fIJqVXvkeViHYzotI+NJrCuav0ZYFoq912ZHBk3mCeuj+5/VpodOjPe1z0Fk2ihgzlXqjQ==}
3824 | 
3825 |   vite@7.1.4:
3826 |     resolution: {integrity: sha512-X5QFK4SGynAeeIt+A7ZWnApdUyHYm+pzv/8/A57LqSGcI88U6R6ipOs3uCesdc6yl7nl+zNO0t8LmqAdXcQihw==}
3827 |     engines: {node: ^20.19.0 || >=22.12.0}
3828 |     hasBin: true
3829 |     peerDependencies:
3830 |       '@types/node': ^20.19.0 || >=22.12.0
3831 |       jiti: '>=1.21.0'
3832 |       less: ^4.0.0
3833 |       lightningcss: ^1.21.0
3834 |       sass: ^1.70.0
3835 |       sass-embedded: ^1.70.0
3836 |       stylus: '>=0.54.8'
3837 |       sugarss: ^5.0.0
3838 |       terser: ^5.16.0
3839 |       tsx: ^4.8.1
3840 |       yaml: ^2.4.2
3841 |     peerDependenciesMeta:
3842 |       '@types/node':
3843 |         optional: true
3844 |       jiti:
3845 |         optional: true
3846 |       less:
3847 |         optional: true
3848 |       lightningcss:
3849 |         optional: true
3850 |       sass:
3851 |         optional: true
3852 |       sass-embedded:
3853 |         optional: true
3854 |       stylus:
3855 |         optional: true
3856 |       sugarss:
3857 |         optional: true
3858 |       terser:
3859 |         optional: true
3860 |       tsx:
3861 |         optional: true
3862 |       yaml:
3863 |         optional: true
3864 | 
3865 |   vitefu@1.1.1:
3866 |     resolution: {integrity: sha512-B/Fegf3i8zh0yFbpzZ21amWzHmuNlLlmJT6n7bu5e+pCHUKQIfXSYokrqOBGEMMe9UG2sostKQF9mml/vYaWJQ==}
3867 |     peerDependencies:
3868 |       vite: ^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0-beta.0
3869 |     peerDependenciesMeta:
3870 |       vite:
3871 |         optional: true
3872 | 
3873 |   vue-router@4.5.1:
3874 |     resolution: {integrity: sha512-ogAF3P97NPm8fJsE4by9dwSYtDwXIY1nFY9T6DyQnGHd1E2Da94w9JIolpe42LJGIl0DwOHBi8TcRPlPGwbTtw==}
3875 |     peerDependencies:
3876 |       vue: ^3.2.0
3877 | 
3878 |   vue@3.5.21:
3879 |     resolution: {integrity: sha512-xxf9rum9KtOdwdRkiApWL+9hZEMWE90FHh8yS1+KJAiWYh+iGWV1FquPjoO9VUHQ+VIhsCXNNyZ5Sf4++RVZBA==}
3880 |     peerDependencies:
3881 |       typescript: '*'
3882 |     peerDependenciesMeta:
3883 |       typescript:
3884 |         optional: true
3885 | 
3886 |   waitress@0.1.5:
3887 |     resolution: {integrity: sha512-+Q2lE4kNXu4W/Ik3BVxYsSbt+bdlBNriQuWQ6gXkn5b3Z/qxvC9NKAZSbSy8zVFgFihZPComSbdS0ZpvGq7PNQ==}
3888 | 
3889 |   web-streams-polyfill@3.3.3:
3890 |     resolution: {integrity: sha512-d2JWLCivmZYTSIoge9MsgFCZrt571BikcWGYkjC1khllbTeDlGqZ2D8vD8E/lJa8WGWbb7Plm8/XJYV7IJHZZw==}
3891 |     engines: {node: '>= 8'}
3892 | 
3893 |   web-vitals@4.2.4:
3894 |     resolution: {integrity: sha512-r4DIlprAGwJ7YM11VZp4R884m0Vmgr6EAKe3P+kO0PPj3Unqyvv59rczf6UiGcb9Z8QxZVcqKNwv/g0WNdWwsw==}
3895 | 
3896 |   webidl-conversions@3.0.1:
3897 |     resolution: {integrity: sha512-2JAn3z8AR6rjK8Sm8orRC0h/bcl/DqL7tRPdGZ4I1CjdF+EaMLmYxBHyXuKL849eucPFhvBoxMsflfOb8kxaeQ==}
3898 | 
3899 |   websocket-driver@0.7.4:
3900 |     resolution: {integrity: sha512-b17KeDIQVjvb0ssuSDF2cYXSg2iztliJ4B9WdsuB6J952qCPKmnVq4DyW5motImXHDC1cBT/1UezrJVsKw5zjg==}
3901 |     engines: {node: '>=0.8.0'}
3902 | 
3903 |   websocket-extensions@0.1.4:
3904 |     resolution: {integrity: sha512-OqedPIGOfsDlo31UNwYbCFMSaO9m9G/0faIHj5/dZFDMFqPTcx6UwqyOy3COEaEOg/9VsGIpdqn62W5KhoKSpg==}
3905 |     engines: {node: '>=0.8.0'}
3906 | 
3907 |   whatwg-url@5.0.0:
3908 |     resolution: {integrity: sha512-saE57nupxk6v3HY35+jzBwYa0rKSy0XR8JSxZPwgLr7ys0IBzhGviA1/TUGJLmSVqs8pb9AnvICXEuOHLprYTw==}
3909 | 
3910 |   which@2.0.2:
3911 |     resolution: {integrity: sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==}
3912 |     engines: {node: '>= 8'}
3913 |     hasBin: true
3914 | 
3915 |   wrap-ansi@7.0.0:
3916 |     resolution: {integrity: sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==}
3917 |     engines: {node: '>=10'}
3918 | 
3919 |   wrap-ansi@8.1.0:
3920 |     resolution: {integrity: sha512-si7QWI6zUMq56bESFvagtmzMdGOtoxfR+Sez11Mobfc7tm+VkUckk9bW2UeffTGVUbOksxmSw0AA2gs8g71NCQ==}
3921 |     engines: {node: '>=12'}
3922 | 
3923 |   wrappy@1.0.2:
3924 |     resolution: {integrity: sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==}
3925 | 
3926 |   y18n@5.0.8:
3927 |     resolution: {integrity: sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==}
3928 |     engines: {node: '>=10'}
3929 | 
3930 |   yallist@4.0.0:
3931 |     resolution: {integrity: sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==}
3932 | 
3933 |   yaml@2.8.1:
3934 |     resolution: {integrity: sha512-lcYcMxX2PO9XMGvAJkJ3OsNMw+/7FKes7/hgerGUYWIoWu5j/+YQqcZr5JnPZWzOsEBgMbSbiSTn/dv/69Mkpw==}
3935 |     engines: {node: '>= 14.6'}
3936 |     hasBin: true
3937 | 
3938 |   yargs-parser@21.1.1:
3939 |     resolution: {integrity: sha512-tVpsJW7DdjecAiFpbIB1e3qxIQsE6NoPc5/eTdrbbIC4h0LVsWhnoa3g+m2HclBIujHzsxZ4VJVA+GUuc2/LBw==}
3940 |     engines: {node: '>=12'}
3941 | 
3942 |   yargs@17.7.2:
3943 |     resolution: {integrity: sha512-7dSzzRQ++CKnNI/krKnYRV7JKKPUXMEh61soaHKg9mrWEhzFWhFnxPxGl+69cD1Ou63C13NUPCnmIcrvqCuM6w==}
3944 |     engines: {node: '>=12'}
3945 | 
3946 |   yocto-queue@0.1.0:
3947 |     resolution: {integrity: sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==}
3948 |     engines: {node: '>=10'}
3949 | 
3950 |   zimmerframe@1.1.2:
3951 |     resolution: {integrity: sha512-rAbqEGa8ovJy4pyBxZM70hg4pE6gDgaQ0Sl9M3enG3I0d6H4XSAM3GeNGLKnsBpuijUow064sf7ww1nutC5/3w==}
3952 | 
3953 |   zod@3.25.76:
3954 |     resolution: {integrity: sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==}
3955 | 
3956 | snapshots:
3957 | 
3958 |   '@alloc/quick-lru@5.2.0': {}
3959 | 
3960 |   '@babel/helper-string-parser@7.27.1': {}
3961 | 
3962 |   '@babel/helper-validator-identifier@7.27.1': {}
3963 | 
3964 |   '@babel/parser@7.28.3':
3965 |     dependencies:
3966 |       '@babel/types': 7.28.2
3967 | 
3968 |   '@babel/runtime@7.28.3': {}
3969 | 
3970 |   '@babel/types@7.28.2':
3971 |     dependencies:
3972 |       '@babel/helper-string-parser': 7.27.1
3973 |       '@babel/helper-validator-identifier': 7.27.1
3974 | 
3975 |   '@date-fns/tz@1.4.1': {}
3976 | 
3977 |   '@emnapi/runtime@1.5.0':
3978 |     dependencies:
3979 |       tslib: 2.8.1
3980 |     optional: true
3981 | 
3982 |   '@esbuild/aix-ppc64@0.25.9':
3983 |     optional: true
3984 | 
3985 |   '@esbuild/android-arm64@0.25.9':
3986 |     optional: true
3987 | 
3988 |   '@esbuild/android-arm@0.25.9':
3989 |     optional: true
3990 | 
3991 |   '@esbuild/android-x64@0.25.9':
3992 |     optional: true
3993 | 
3994 |   '@esbuild/darwin-arm64@0.25.9':
3995 |     optional: true
3996 | 
3997 |   '@esbuild/darwin-x64@0.25.9':
3998 |     optional: true
3999 | 
4000 |   '@esbuild/freebsd-arm64@0.25.9':
4001 |     optional: true
4002 | 
4003 |   '@esbuild/freebsd-x64@0.25.9':
4004 |     optional: true
4005 | 
4006 |   '@esbuild/linux-arm64@0.25.9':
4007 |     optional: true
4008 | 
4009 |   '@esbuild/linux-arm@0.25.9':
4010 |     optional: true
4011 | 
4012 |   '@esbuild/linux-ia32@0.25.9':
4013 |     optional: true
4014 | 
4015 |   '@esbuild/linux-loong64@0.25.9':
4016 |     optional: true
4017 | 
4018 |   '@esbuild/linux-mips64el@0.25.9':
4019 |     optional: true
4020 | 
4021 |   '@esbuild/linux-ppc64@0.25.9':
4022 |     optional: true
4023 | 
4024 |   '@esbuild/linux-riscv64@0.25.9':
4025 |     optional: true
4026 | 
4027 |   '@esbuild/linux-s390x@0.25.9':
4028 |     optional: true
4029 | 
4030 |   '@esbuild/linux-x64@0.25.9':
4031 |     optional: true
4032 | 
4033 |   '@esbuild/netbsd-arm64@0.25.9':
4034 |     optional: true
4035 | 
4036 |   '@esbuild/netbsd-x64@0.25.9':
4037 |     optional: true
4038 | 
4039 |   '@esbuild/openbsd-arm64@0.25.9':
4040 |     optional: true
4041 | 
4042 |   '@esbuild/openbsd-x64@0.25.9':
4043 |     optional: true
4044 | 
4045 |   '@esbuild/openharmony-arm64@0.25.9':
4046 |     optional: true
4047 | 
4048 |   '@esbuild/sunos-x64@0.25.9':
4049 |     optional: true
4050 | 
4051 |   '@esbuild/win32-arm64@0.25.9':
4052 |     optional: true
4053 | 
4054 |   '@esbuild/win32-ia32@0.25.9':
4055 |     optional: true
4056 | 
4057 |   '@esbuild/win32-x64@0.25.9':
4058 |     optional: true
4059 | 
4060 |   '@fastify/busboy@3.2.0': {}
4061 | 
4062 |   '@firebase/ai@2.2.1(@firebase/app-types@0.9.3)(@firebase/app@0.14.2)':
4063 |     dependencies:
4064 |       '@firebase/app': 0.14.2
4065 |       '@firebase/app-check-interop-types': 0.3.3
4066 |       '@firebase/app-types': 0.9.3
4067 |       '@firebase/component': 0.7.0
4068 |       '@firebase/logger': 0.5.0
4069 |       '@firebase/util': 1.13.0
4070 |       tslib: 2.8.1
4071 | 
4072 |   '@firebase/analytics-compat@0.2.24(@firebase/app-compat@0.5.2)(@firebase/app@0.14.2)':
4073 |     dependencies:
4074 |       '@firebase/analytics': 0.10.18(@firebase/app@0.14.2)
4075 |       '@firebase/analytics-types': 0.8.3
4076 |       '@firebase/app-compat': 0.5.2
4077 |       '@firebase/component': 0.7.0
4078 |       '@firebase/util': 1.13.0
4079 |       tslib: 2.8.1
4080 |     transitivePeerDependencies:
4081 |       - '@firebase/app'
4082 | 
4083 |   '@firebase/analytics-types@0.8.3': {}
4084 | 
4085 |   '@firebase/analytics@0.10.18(@firebase/app@0.14.2)':
4086 |     dependencies:
4087 |       '@firebase/app': 0.14.2
4088 |       '@firebase/component': 0.7.0
4089 |       '@firebase/installations': 0.6.19(@firebase/app@0.14.2)
4090 |       '@firebase/logger': 0.5.0
4091 |       '@firebase/util': 1.13.0
4092 |       tslib: 2.8.1
4093 | 
4094 |   '@firebase/app-check-compat@0.4.0(@firebase/app-compat@0.5.2)(@firebase/app@0.14.2)':
4095 |     dependencies:
4096 |       '@firebase/app-check': 0.11.0(@firebase/app@0.14.2)
4097 |       '@firebase/app-check-types': 0.5.3
4098 |       '@firebase/app-compat': 0.5.2
4099 |       '@firebase/component': 0.7.0
4100 |       '@firebase/logger': 0.5.0
4101 |       '@firebase/util': 1.13.0
4102 |       tslib: 2.8.1
4103 |     transitivePeerDependencies:
4104 |       - '@firebase/app'
4105 | 
4106 |   '@firebase/app-check-interop-types@0.3.3': {}
4107 | 
4108 |   '@firebase/app-check-types@0.5.3': {}
4109 | 
4110 |   '@firebase/app-check@0.11.0(@firebase/app@0.14.2)':
4111 |     dependencies:
4112 |       '@firebase/app': 0.14.2
4113 |       '@firebase/component': 0.7.0
4114 |       '@firebase/logger': 0.5.0
4115 |       '@firebase/util': 1.13.0
4116 |       tslib: 2.8.1
4117 | 
4118 |   '@firebase/app-compat@0.5.2':
4119 |     dependencies:
4120 |       '@firebase/app': 0.14.2
4121 |       '@firebase/component': 0.7.0
4122 |       '@firebase/logger': 0.5.0
4123 |       '@firebase/util': 1.13.0
4124 |       tslib: 2.8.1
4125 | 
4126 |   '@firebase/app-types@0.9.3': {}
4127 | 
4128 |   '@firebase/app@0.14.2':
4129 |     dependencies:
4130 |       '@firebase/component': 0.7.0
4131 |       '@firebase/logger': 0.5.0
4132 |       '@firebase/util': 1.13.0
4133 |       idb: 7.1.1
4134 |       tslib: 2.8.1
4135 | 
4136 |   '@firebase/auth-compat@0.6.0(@firebase/app-compat@0.5.2)(@firebase/app-types@0.9.3)(@firebase/app@0.14.2)':
4137 |     dependencies:
4138 |       '@firebase/app-compat': 0.5.2
4139 |       '@firebase/auth': 1.11.0(@firebase/app@0.14.2)
4140 |       '@firebase/auth-types': 0.13.0(@firebase/app-types@0.9.3)(@firebase/util@1.13.0)
4141 |       '@firebase/component': 0.7.0
4142 |       '@firebase/util': 1.13.0
4143 |       tslib: 2.8.1
4144 |     transitivePeerDependencies:
4145 |       - '@firebase/app'
4146 |       - '@firebase/app-types'
4147 |       - '@react-native-async-storage/async-storage'
4148 | 
4149 |   '@firebase/auth-interop-types@0.2.4': {}
4150 | 
4151 |   '@firebase/auth-types@0.13.0(@firebase/app-types@0.9.3)(@firebase/util@1.13.0)':
4152 |     dependencies:
4153 |       '@firebase/app-types': 0.9.3
4154 |       '@firebase/util': 1.13.0
4155 | 
4156 |   '@firebase/auth@1.11.0(@firebase/app@0.14.2)':
4157 |     dependencies:
4158 |       '@firebase/app': 0.14.2
4159 |       '@firebase/component': 0.7.0
4160 |       '@firebase/logger': 0.5.0
4161 |       '@firebase/util': 1.13.0
4162 |       tslib: 2.8.1
4163 | 
4164 |   '@firebase/component@0.7.0':
4165 |     dependencies:
4166 |       '@firebase/util': 1.13.0
4167 |       tslib: 2.8.1
4168 | 
4169 |   '@firebase/data-connect@0.3.11(@firebase/app@0.14.2)':
4170 |     dependencies:
4171 |       '@firebase/app': 0.14.2
4172 |       '@firebase/auth-interop-types': 0.2.4
4173 |       '@firebase/component': 0.7.0
4174 |       '@firebase/logger': 0.5.0
4175 |       '@firebase/util': 1.13.0
4176 |       tslib: 2.8.1
4177 | 
4178 |   '@firebase/database-compat@2.1.0':
4179 |     dependencies:
4180 |       '@firebase/component': 0.7.0
4181 |       '@firebase/database': 1.1.0
4182 |       '@firebase/database-types': 1.0.16
4183 |       '@firebase/logger': 0.5.0
4184 |       '@firebase/util': 1.13.0
4185 |       tslib: 2.8.1
4186 | 
4187 |   '@firebase/database-types@1.0.16':
4188 |     dependencies:
4189 |       '@firebase/app-types': 0.9.3
4190 |       '@firebase/util': 1.13.0
4191 | 
4192 |   '@firebase/database@1.1.0':
4193 |     dependencies:
4194 |       '@firebase/app-check-interop-types': 0.3.3
4195 |       '@firebase/auth-interop-types': 0.2.4
4196 |       '@firebase/component': 0.7.0
4197 |       '@firebase/logger': 0.5.0
4198 |       '@firebase/util': 1.13.0
4199 |       faye-websocket: 0.11.4
4200 |       tslib: 2.8.1
4201 | 
4202 |   '@firebase/firestore-compat@0.4.1(@firebase/app-compat@0.5.2)(@firebase/app-types@0.9.3)(@firebase/app@0.14.2)':
4203 |     dependencies:
4204 |       '@firebase/app-compat': 0.5.2
4205 |       '@firebase/component': 0.7.0
4206 |       '@firebase/firestore': 4.9.1(@firebase/app@0.14.2)
4207 |       '@firebase/firestore-types': 3.0.3(@firebase/app-types@0.9.3)(@firebase/util@1.13.0)
4208 |       '@firebase/util': 1.13.0
4209 |       tslib: 2.8.1
4210 |     transitivePeerDependencies:
4211 |       - '@firebase/app'
4212 |       - '@firebase/app-types'
4213 | 
4214 |   '@firebase/firestore-types@3.0.3(@firebase/app-types@0.9.3)(@firebase/util@1.13.0)':
4215 |     dependencies:
4216 |       '@firebase/app-types': 0.9.3
4217 |       '@firebase/util': 1.13.0
4218 | 
4219 |   '@firebase/firestore@4.9.1(@firebase/app@0.14.2)':
4220 |     dependencies:
4221 |       '@firebase/app': 0.14.2
4222 |       '@firebase/component': 0.7.0
4223 |       '@firebase/logger': 0.5.0
4224 |       '@firebase/util': 1.13.0
4225 |       '@firebase/webchannel-wrapper': 1.0.4
4226 |       '@grpc/grpc-js': 1.9.15
4227 |       '@grpc/proto-loader': 0.7.15
4228 |       tslib: 2.8.1
4229 | 
4230 |   '@firebase/functions-compat@0.4.1(@firebase/app-compat@0.5.2)(@firebase/app@0.14.2)':
4231 |     dependencies:
4232 |       '@firebase/app-compat': 0.5.2
4233 |       '@firebase/component': 0.7.0
4234 |       '@firebase/functions': 0.13.1(@firebase/app@0.14.2)
4235 |       '@firebase/functions-types': 0.6.3
4236 |       '@firebase/util': 1.13.0
4237 |       tslib: 2.8.1
4238 |     transitivePeerDependencies:
4239 |       - '@firebase/app'
4240 | 
4241 |   '@firebase/functions-types@0.6.3': {}
4242 | 
4243 |   '@firebase/functions@0.13.1(@firebase/app@0.14.2)':
4244 |     dependencies:
4245 |       '@firebase/app': 0.14.2
4246 |       '@firebase/app-check-interop-types': 0.3.3
4247 |       '@firebase/auth-interop-types': 0.2.4
4248 |       '@firebase/component': 0.7.0
4249 |       '@firebase/messaging-interop-types': 0.2.3
4250 |       '@firebase/util': 1.13.0
4251 |       tslib: 2.8.1
4252 | 
4253 |   '@firebase/installations-compat@0.2.19(@firebase/app-compat@0.5.2)(@firebase/app-types@0.9.3)(@firebase/app@0.14.2)':
4254 |     dependencies:
4255 |       '@firebase/app-compat': 0.5.2
4256 |       '@firebase/component': 0.7.0
4257 |       '@firebase/installations': 0.6.19(@firebase/app@0.14.2)
4258 |       '@firebase/installations-types': 0.5.3(@firebase/app-types@0.9.3)
4259 |       '@firebase/util': 1.13.0
4260 |       tslib: 2.8.1
4261 |     transitivePeerDependencies:
4262 |       - '@firebase/app'
4263 |       - '@firebase/app-types'
4264 | 
4265 |   '@firebase/installations-types@0.5.3(@firebase/app-types@0.9.3)':
4266 |     dependencies:
4267 |       '@firebase/app-types': 0.9.3
4268 | 
4269 |   '@firebase/installations@0.6.19(@firebase/app@0.14.2)':
4270 |     dependencies:
4271 |       '@firebase/app': 0.14.2
4272 |       '@firebase/component': 0.7.0
4273 |       '@firebase/util': 1.13.0
4274 |       idb: 7.1.1
4275 |       tslib: 2.8.1
4276 | 
4277 |   '@firebase/logger@0.5.0':
4278 |     dependencies:
4279 |       tslib: 2.8.1
4280 | 
4281 |   '@firebase/messaging-compat@0.2.23(@firebase/app-compat@0.5.2)(@firebase/app@0.14.2)':
4282 |     dependencies:
4283 |       '@firebase/app-compat': 0.5.2
4284 |       '@firebase/component': 0.7.0
4285 |       '@firebase/messaging': 0.12.23(@firebase/app@0.14.2)
4286 |       '@firebase/util': 1.13.0
4287 |       tslib: 2.8.1
4288 |     transitivePeerDependencies:
4289 |       - '@firebase/app'
4290 | 
4291 |   '@firebase/messaging-interop-types@0.2.3': {}
4292 | 
4293 |   '@firebase/messaging@0.12.23(@firebase/app@0.14.2)':
4294 |     dependencies:
4295 |       '@firebase/app': 0.14.2
4296 |       '@firebase/component': 0.7.0
4297 |       '@firebase/installations': 0.6.19(@firebase/app@0.14.2)
4298 |       '@firebase/messaging-interop-types': 0.2.3
4299 |       '@firebase/util': 1.13.0
4300 |       idb: 7.1.1
4301 |       tslib: 2.8.1
4302 | 
4303 |   '@firebase/performance-compat@0.2.22(@firebase/app-compat@0.5.2)(@firebase/app@0.14.2)':
4304 |     dependencies:
4305 |       '@firebase/app-compat': 0.5.2
4306 |       '@firebase/component': 0.7.0
4307 |       '@firebase/logger': 0.5.0
4308 |       '@firebase/performance': 0.7.9(@firebase/app@0.14.2)
4309 |       '@firebase/performance-types': 0.2.3
4310 |       '@firebase/util': 1.13.0
4311 |       tslib: 2.8.1
4312 |     transitivePeerDependencies:
4313 |       - '@firebase/app'
4314 | 
4315 |   '@firebase/performance-types@0.2.3': {}
4316 | 
4317 |   '@firebase/performance@0.7.9(@firebase/app@0.14.2)':
4318 |     dependencies:
4319 |       '@firebase/app': 0.14.2
4320 |       '@firebase/component': 0.7.0
4321 |       '@firebase/installations': 0.6.19(@firebase/app@0.14.2)
4322 |       '@firebase/logger': 0.5.0
4323 |       '@firebase/util': 1.13.0
4324 |       tslib: 2.8.1
4325 |       web-vitals: 4.2.4
4326 | 
4327 |   '@firebase/remote-config-compat@0.2.19(@firebase/app-compat@0.5.2)(@firebase/app@0.14.2)':
4328 |     dependencies:
4329 |       '@firebase/app-compat': 0.5.2
4330 |       '@firebase/component': 0.7.0
4331 |       '@firebase/logger': 0.5.0
4332 |       '@firebase/remote-config': 0.6.6(@firebase/app@0.14.2)
4333 |       '@firebase/remote-config-types': 0.4.0
4334 |       '@firebase/util': 1.13.0
4335 |       tslib: 2.8.1
4336 |     transitivePeerDependencies:
4337 |       - '@firebase/app'
4338 | 
4339 |   '@firebase/remote-config-types@0.4.0': {}
4340 | 
4341 |   '@firebase/remote-config@0.6.6(@firebase/app@0.14.2)':
4342 |     dependencies:
4343 |       '@firebase/app': 0.14.2
4344 |       '@firebase/component': 0.7.0
4345 |       '@firebase/installations': 0.6.19(@firebase/app@0.14.2)
4346 |       '@firebase/logger': 0.5.0
4347 |       '@firebase/util': 1.13.0
4348 |       tslib: 2.8.1
4349 | 
4350 |   '@firebase/storage-compat@0.4.0(@firebase/app-compat@0.5.2)(@firebase/app-types@0.9.3)(@firebase/app@0.14.2)':
4351 |     dependencies:
4352 |       '@firebase/app-compat': 0.5.2
4353 |       '@firebase/component': 0.7.0
4354 |       '@firebase/storage': 0.14.0(@firebase/app@0.14.2)
4355 |       '@firebase/storage-types': 0.8.3(@firebase/app-types@0.9.3)(@firebase/util@1.13.0)
4356 |       '@firebase/util': 1.13.0
4357 |       tslib: 2.8.1
4358 |     transitivePeerDependencies:
4359 |       - '@firebase/app'
4360 |       - '@firebase/app-types'
4361 | 
4362 |   '@firebase/storage-types@0.8.3(@firebase/app-types@0.9.3)(@firebase/util@1.13.0)':
4363 |     dependencies:
4364 |       '@firebase/app-types': 0.9.3
4365 |       '@firebase/util': 1.13.0
4366 | 
4367 |   '@firebase/storage@0.14.0(@firebase/app@0.14.2)':
4368 |     dependencies:
4369 |       '@firebase/app': 0.14.2
4370 |       '@firebase/component': 0.7.0
4371 |       '@firebase/util': 1.13.0
4372 |       tslib: 2.8.1
4373 | 
4374 |   '@firebase/util@1.13.0':
4375 |     dependencies:
4376 |       tslib: 2.8.1
4377 | 
4378 |   '@firebase/webchannel-wrapper@1.0.4': {}
4379 | 
4380 |   '@floating-ui/core@1.7.3':
4381 |     dependencies:
4382 |       '@floating-ui/utils': 0.2.10
4383 | 
4384 |   '@floating-ui/dom@1.7.4':
4385 |     dependencies:
4386 |       '@floating-ui/core': 1.7.3
4387 |       '@floating-ui/utils': 0.2.10
4388 | 
4389 |   '@floating-ui/react-dom@2.1.6(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4390 |     dependencies:
4391 |       '@floating-ui/dom': 1.7.4
4392 |       react: 19.1.1
4393 |       react-dom: 19.1.1(react@19.1.1)
4394 | 
4395 |   '@floating-ui/utils@0.2.10': {}
4396 | 
4397 |   '@google-cloud/firestore@7.11.3':
4398 |     dependencies:
4399 |       '@opentelemetry/api': 1.9.0
4400 |       fast-deep-equal: 3.1.3
4401 |       functional-red-black-tree: 1.0.1
4402 |       google-gax: 4.6.1
4403 |       protobufjs: 7.5.4
4404 |     transitivePeerDependencies:
4405 |       - encoding
4406 |       - supports-color
4407 |     optional: true
4408 | 
4409 |   '@google-cloud/paginator@5.0.2':
4410 |     dependencies:
4411 |       arrify: 2.0.1
4412 |       extend: 3.0.2
4413 |     optional: true
4414 | 
4415 |   '@google-cloud/projectify@4.0.0':
4416 |     optional: true
4417 | 
4418 |   '@google-cloud/promisify@4.0.0':
4419 |     optional: true
4420 | 
4421 |   '@google-cloud/storage@7.17.0':
4422 |     dependencies:
4423 |       '@google-cloud/paginator': 5.0.2
4424 |       '@google-cloud/projectify': 4.0.0
4425 |       '@google-cloud/promisify': 4.0.0
4426 |       abort-controller: 3.0.0
4427 |       async-retry: 1.3.3
4428 |       duplexify: 4.1.3
4429 |       fast-xml-parser: 4.5.3
4430 |       gaxios: 6.7.1
4431 |       google-auth-library: 9.15.1
4432 |       html-entities: 2.6.0
4433 |       mime: 3.0.0
4434 |       p-limit: 3.1.0
4435 |       retry-request: 7.0.2
4436 |       teeny-request: 9.0.0
4437 |       uuid: 8.3.2
4438 |     transitivePeerDependencies:
4439 |       - encoding
4440 |       - supports-color
4441 |     optional: true
4442 | 
4443 |   '@google/generative-ai@0.24.1': {}
4444 | 
4445 |   '@googlemaps/js-api-loader@1.16.10': {}
4446 | 
4447 |   '@grpc/grpc-js@1.13.4':
4448 |     dependencies:
4449 |       '@grpc/proto-loader': 0.7.15
4450 |       '@js-sdsl/ordered-map': 4.4.2
4451 |     optional: true
4452 | 
4453 |   '@grpc/grpc-js@1.9.15':
4454 |     dependencies:
4455 |       '@grpc/proto-loader': 0.7.15
4456 |       '@types/node': 22.18.0
4457 | 
4458 |   '@grpc/proto-loader@0.7.15':
4459 |     dependencies:
4460 |       lodash.camelcase: 4.3.0
4461 |       long: 5.3.2
4462 |       protobufjs: 7.5.4
4463 |       yargs: 17.7.2
4464 | 
4465 |   '@hookform/resolvers@3.10.0(react-hook-form@7.62.0(react@19.1.1))':
4466 |     dependencies:
4467 |       react-hook-form: 7.62.0(react@19.1.1)
4468 | 
4469 |   '@img/sharp-darwin-arm64@0.33.5':
4470 |     optionalDependencies:
4471 |       '@img/sharp-libvips-darwin-arm64': 1.0.4
4472 |     optional: true
4473 | 
4474 |   '@img/sharp-darwin-x64@0.33.5':
4475 |     optionalDependencies:
4476 |       '@img/sharp-libvips-darwin-x64': 1.0.4
4477 |     optional: true
4478 | 
4479 |   '@img/sharp-libvips-darwin-arm64@1.0.4':
4480 |     optional: true
4481 | 
4482 |   '@img/sharp-libvips-darwin-x64@1.0.4':
4483 |     optional: true
4484 | 
4485 |   '@img/sharp-libvips-linux-arm64@1.0.4':
4486 |     optional: true
4487 | 
4488 |   '@img/sharp-libvips-linux-arm@1.0.5':
4489 |     optional: true
4490 | 
4491 |   '@img/sharp-libvips-linux-s390x@1.0.4':
4492 |     optional: true
4493 | 
4494 |   '@img/sharp-libvips-linux-x64@1.0.4':
4495 |     optional: true
4496 | 
4497 |   '@img/sharp-libvips-linuxmusl-arm64@1.0.4':
4498 |     optional: true
4499 | 
4500 |   '@img/sharp-libvips-linuxmusl-x64@1.0.4':
4501 |     optional: true
4502 | 
4503 |   '@img/sharp-linux-arm64@0.33.5':
4504 |     optionalDependencies:
4505 |       '@img/sharp-libvips-linux-arm64': 1.0.4
4506 |     optional: true
4507 | 
4508 |   '@img/sharp-linux-arm@0.33.5':
4509 |     optionalDependencies:
4510 |       '@img/sharp-libvips-linux-arm': 1.0.5
4511 |     optional: true
4512 | 
4513 |   '@img/sharp-linux-s390x@0.33.5':
4514 |     optionalDependencies:
4515 |       '@img/sharp-libvips-linux-s390x': 1.0.4
4516 |     optional: true
4517 | 
4518 |   '@img/sharp-linux-x64@0.33.5':
4519 |     optionalDependencies:
4520 |       '@img/sharp-libvips-linux-x64': 1.0.4
4521 |     optional: true
4522 | 
4523 |   '@img/sharp-linuxmusl-arm64@0.33.5':
4524 |     optionalDependencies:
4525 |       '@img/sharp-libvips-linuxmusl-arm64': 1.0.4
4526 |     optional: true
4527 | 
4528 |   '@img/sharp-linuxmusl-x64@0.33.5':
4529 |     optionalDependencies:
4530 |       '@img/sharp-libvips-linuxmusl-x64': 1.0.4
4531 |     optional: true
4532 | 
4533 |   '@img/sharp-wasm32@0.33.5':
4534 |     dependencies:
4535 |       '@emnapi/runtime': 1.5.0
4536 |     optional: true
4537 | 
4538 |   '@img/sharp-win32-ia32@0.33.5':
4539 |     optional: true
4540 | 
4541 |   '@img/sharp-win32-x64@0.33.5':
4542 |     optional: true
4543 | 
4544 |   '@isaacs/cliui@8.0.2':
4545 |     dependencies:
4546 |       string-width: 5.1.2
4547 |       string-width-cjs: string-width@4.2.3
4548 |       strip-ansi: 7.1.0
4549 |       strip-ansi-cjs: strip-ansi@6.0.1
4550 |       wrap-ansi: 8.1.0
4551 |       wrap-ansi-cjs: wrap-ansi@7.0.0
4552 | 
4553 |   '@jridgewell/gen-mapping@0.3.13':
4554 |     dependencies:
4555 |       '@jridgewell/sourcemap-codec': 1.5.5
4556 |       '@jridgewell/trace-mapping': 0.3.30
4557 | 
4558 |   '@jridgewell/remapping@2.3.5':
4559 |     dependencies:
4560 |       '@jridgewell/gen-mapping': 0.3.13
4561 |       '@jridgewell/trace-mapping': 0.3.30
4562 | 
4563 |   '@jridgewell/resolve-uri@3.1.2': {}
4564 | 
4565 |   '@jridgewell/sourcemap-codec@1.5.5': {}
4566 | 
4567 |   '@jridgewell/trace-mapping@0.3.30':
4568 |     dependencies:
4569 |       '@jridgewell/resolve-uri': 3.1.2
4570 |       '@jridgewell/sourcemap-codec': 1.5.5
4571 | 
4572 |   '@js-sdsl/ordered-map@4.4.2':
4573 |     optional: true
4574 | 
4575 |   '@next/env@15.2.4': {}
4576 | 
4577 |   '@next/swc-darwin-arm64@15.2.4':
4578 |     optional: true
4579 | 
4580 |   '@next/swc-darwin-x64@15.2.4':
4581 |     optional: true
4582 | 
4583 |   '@next/swc-linux-arm64-gnu@15.2.4':
4584 |     optional: true
4585 | 
4586 |   '@next/swc-linux-arm64-musl@15.2.4':
4587 |     optional: true
4588 | 
4589 |   '@next/swc-linux-x64-gnu@15.2.4':
4590 |     optional: true
4591 | 
4592 |   '@next/swc-linux-x64-musl@15.2.4':
4593 |     optional: true
4594 | 
4595 |   '@next/swc-win32-arm64-msvc@15.2.4':
4596 |     optional: true
4597 | 
4598 |   '@next/swc-win32-x64-msvc@15.2.4':
4599 |     optional: true
4600 | 
4601 |   '@nodelib/fs.scandir@2.1.5':
4602 |     dependencies:
4603 |       '@nodelib/fs.stat': 2.0.5
4604 |       run-parallel: 1.2.0
4605 | 
4606 |   '@nodelib/fs.stat@2.0.5': {}
4607 | 
4608 |   '@nodelib/fs.walk@1.2.8':
4609 |     dependencies:
4610 |       '@nodelib/fs.scandir': 2.1.5
4611 |       fastq: 1.19.1
4612 | 
4613 |   '@opentelemetry/api@1.9.0':
4614 |     optional: true
4615 | 
4616 |   '@pkgjs/parseargs@0.11.0':
4617 |     optional: true
4618 | 
4619 |   '@polka/url@1.0.0-next.29': {}
4620 | 
4621 |   '@protobufjs/aspromise@1.1.2': {}
4622 | 
4623 |   '@protobufjs/base64@1.1.2': {}
4624 | 
4625 |   '@protobufjs/codegen@2.0.4': {}
4626 | 
4627 |   '@protobufjs/eventemitter@1.1.0': {}
4628 | 
4629 |   '@protobufjs/fetch@1.1.0':
4630 |     dependencies:
4631 |       '@protobufjs/aspromise': 1.1.2
4632 |       '@protobufjs/inquire': 1.1.0
4633 | 
4634 |   '@protobufjs/float@1.0.2': {}
4635 | 
4636 |   '@protobufjs/inquire@1.1.0': {}
4637 | 
4638 |   '@protobufjs/path@1.1.2': {}
4639 | 
4640 |   '@protobufjs/pool@1.1.0': {}
4641 | 
4642 |   '@protobufjs/utf8@1.1.0': {}
4643 | 
4644 |   '@radix-ui/number@1.1.1': {}
4645 | 
4646 |   '@radix-ui/primitive@1.1.1': {}
4647 | 
4648 |   '@radix-ui/primitive@1.1.3': {}
4649 | 
4650 |   '@radix-ui/react-accordion@1.2.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4651 |     dependencies:
4652 |       '@radix-ui/primitive': 1.1.1
4653 |       '@radix-ui/react-collapsible': 1.1.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4654 |       '@radix-ui/react-collection': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4655 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4656 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4657 |       '@radix-ui/react-direction': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4658 |       '@radix-ui/react-id': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4659 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4660 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4661 |       react: 19.1.1
4662 |       react-dom: 19.1.1(react@19.1.1)
4663 |     optionalDependencies:
4664 |       '@types/react': 19.1.12
4665 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4666 | 
4667 |   '@radix-ui/react-alert-dialog@1.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4668 |     dependencies:
4669 |       '@radix-ui/primitive': 1.1.1
4670 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4671 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4672 |       '@radix-ui/react-dialog': 1.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4673 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4674 |       '@radix-ui/react-slot': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4675 |       react: 19.1.1
4676 |       react-dom: 19.1.1(react@19.1.1)
4677 |     optionalDependencies:
4678 |       '@types/react': 19.1.12
4679 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4680 | 
4681 |   '@radix-ui/react-arrow@1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4682 |     dependencies:
4683 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4684 |       react: 19.1.1
4685 |       react-dom: 19.1.1(react@19.1.1)
4686 |     optionalDependencies:
4687 |       '@types/react': 19.1.12
4688 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4689 | 
4690 |   '@radix-ui/react-arrow@1.1.7(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4691 |     dependencies:
4692 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4693 |       react: 19.1.1
4694 |       react-dom: 19.1.1(react@19.1.1)
4695 |     optionalDependencies:
4696 |       '@types/react': 19.1.12
4697 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4698 | 
4699 |   '@radix-ui/react-aspect-ratio@1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4700 |     dependencies:
4701 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4702 |       react: 19.1.1
4703 |       react-dom: 19.1.1(react@19.1.1)
4704 |     optionalDependencies:
4705 |       '@types/react': 19.1.12
4706 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4707 | 
4708 |   '@radix-ui/react-avatar@1.1.10(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4709 |     dependencies:
4710 |       '@radix-ui/react-context': 1.1.2(@types/react@19.1.12)(react@19.1.1)
4711 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4712 |       '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4713 |       '@radix-ui/react-use-is-hydrated': 0.1.0(@types/react@19.1.12)(react@19.1.1)
4714 |       '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4715 |       react: 19.1.1
4716 |       react-dom: 19.1.1(react@19.1.1)
4717 |     optionalDependencies:
4718 |       '@types/react': 19.1.12
4719 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4720 | 
4721 |   '@radix-ui/react-checkbox@1.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4722 |     dependencies:
4723 |       '@radix-ui/primitive': 1.1.1
4724 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4725 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4726 |       '@radix-ui/react-presence': 1.1.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4727 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4728 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4729 |       '@radix-ui/react-use-previous': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4730 |       '@radix-ui/react-use-size': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4731 |       react: 19.1.1
4732 |       react-dom: 19.1.1(react@19.1.1)
4733 |     optionalDependencies:
4734 |       '@types/react': 19.1.12
4735 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4736 | 
4737 |   '@radix-ui/react-collapsible@1.1.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4738 |     dependencies:
4739 |       '@radix-ui/primitive': 1.1.1
4740 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4741 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4742 |       '@radix-ui/react-id': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4743 |       '@radix-ui/react-presence': 1.1.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4744 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4745 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4746 |       '@radix-ui/react-use-layout-effect': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4747 |       react: 19.1.1
4748 |       react-dom: 19.1.1(react@19.1.1)
4749 |     optionalDependencies:
4750 |       '@types/react': 19.1.12
4751 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4752 | 
4753 |   '@radix-ui/react-collection@1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4754 |     dependencies:
4755 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4756 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4757 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4758 |       '@radix-ui/react-slot': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4759 |       react: 19.1.1
4760 |       react-dom: 19.1.1(react@19.1.1)
4761 |     optionalDependencies:
4762 |       '@types/react': 19.1.12
4763 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4764 | 
4765 |   '@radix-ui/react-collection@1.1.7(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4766 |     dependencies:
4767 |       '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.1.12)(react@19.1.1)
4768 |       '@radix-ui/react-context': 1.1.2(@types/react@19.1.12)(react@19.1.1)
4769 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4770 |       '@radix-ui/react-slot': 1.2.3(@types/react@19.1.12)(react@19.1.1)
4771 |       react: 19.1.1
4772 |       react-dom: 19.1.1(react@19.1.1)
4773 |     optionalDependencies:
4774 |       '@types/react': 19.1.12
4775 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4776 | 
4777 |   '@radix-ui/react-compose-refs@1.1.1(@types/react@19.1.12)(react@19.1.1)':
4778 |     dependencies:
4779 |       react: 19.1.1
4780 |     optionalDependencies:
4781 |       '@types/react': 19.1.12
4782 | 
4783 |   '@radix-ui/react-compose-refs@1.1.2(@types/react@19.1.12)(react@19.1.1)':
4784 |     dependencies:
4785 |       react: 19.1.1
4786 |     optionalDependencies:
4787 |       '@types/react': 19.1.12
4788 | 
4789 |   '@radix-ui/react-context-menu@2.2.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4790 |     dependencies:
4791 |       '@radix-ui/primitive': 1.1.1
4792 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4793 |       '@radix-ui/react-menu': 2.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4794 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4795 |       '@radix-ui/react-use-callback-ref': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4796 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4797 |       react: 19.1.1
4798 |       react-dom: 19.1.1(react@19.1.1)
4799 |     optionalDependencies:
4800 |       '@types/react': 19.1.12
4801 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4802 | 
4803 |   '@radix-ui/react-context@1.1.1(@types/react@19.1.12)(react@19.1.1)':
4804 |     dependencies:
4805 |       react: 19.1.1
4806 |     optionalDependencies:
4807 |       '@types/react': 19.1.12
4808 | 
4809 |   '@radix-ui/react-context@1.1.2(@types/react@19.1.12)(react@19.1.1)':
4810 |     dependencies:
4811 |       react: 19.1.1
4812 |     optionalDependencies:
4813 |       '@types/react': 19.1.12
4814 | 
4815 |   '@radix-ui/react-dialog@1.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4816 |     dependencies:
4817 |       '@radix-ui/primitive': 1.1.1
4818 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4819 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4820 |       '@radix-ui/react-dismissable-layer': 1.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4821 |       '@radix-ui/react-focus-guards': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4822 |       '@radix-ui/react-focus-scope': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4823 |       '@radix-ui/react-id': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4824 |       '@radix-ui/react-portal': 1.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4825 |       '@radix-ui/react-presence': 1.1.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4826 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4827 |       '@radix-ui/react-slot': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4828 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4829 |       aria-hidden: 1.2.6
4830 |       react: 19.1.1
4831 |       react-dom: 19.1.1(react@19.1.1)
4832 |       react-remove-scroll: 2.7.1(@types/react@19.1.12)(react@19.1.1)
4833 |     optionalDependencies:
4834 |       '@types/react': 19.1.12
4835 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4836 | 
4837 |   '@radix-ui/react-direction@1.1.0(@types/react@19.1.12)(react@19.1.1)':
4838 |     dependencies:
4839 |       react: 19.1.1
4840 |     optionalDependencies:
4841 |       '@types/react': 19.1.12
4842 | 
4843 |   '@radix-ui/react-direction@1.1.1(@types/react@19.1.12)(react@19.1.1)':
4844 |     dependencies:
4845 |       react: 19.1.1
4846 |     optionalDependencies:
4847 |       '@types/react': 19.1.12
4848 | 
4849 |   '@radix-ui/react-dismissable-layer@1.1.11(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4850 |     dependencies:
4851 |       '@radix-ui/primitive': 1.1.3
4852 |       '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.1.12)(react@19.1.1)
4853 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4854 |       '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4855 |       '@radix-ui/react-use-escape-keydown': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4856 |       react: 19.1.1
4857 |       react-dom: 19.1.1(react@19.1.1)
4858 |     optionalDependencies:
4859 |       '@types/react': 19.1.12
4860 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4861 | 
4862 |   '@radix-ui/react-dismissable-layer@1.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4863 |     dependencies:
4864 |       '@radix-ui/primitive': 1.1.1
4865 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4866 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4867 |       '@radix-ui/react-use-callback-ref': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4868 |       '@radix-ui/react-use-escape-keydown': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4869 |       react: 19.1.1
4870 |       react-dom: 19.1.1(react@19.1.1)
4871 |     optionalDependencies:
4872 |       '@types/react': 19.1.12
4873 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4874 | 
4875 |   '@radix-ui/react-dropdown-menu@2.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4876 |     dependencies:
4877 |       '@radix-ui/primitive': 1.1.1
4878 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4879 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4880 |       '@radix-ui/react-id': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4881 |       '@radix-ui/react-menu': 2.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4882 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4883 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4884 |       react: 19.1.1
4885 |       react-dom: 19.1.1(react@19.1.1)
4886 |     optionalDependencies:
4887 |       '@types/react': 19.1.12
4888 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4889 | 
4890 |   '@radix-ui/react-focus-guards@1.1.1(@types/react@19.1.12)(react@19.1.1)':
4891 |     dependencies:
4892 |       react: 19.1.1
4893 |     optionalDependencies:
4894 |       '@types/react': 19.1.12
4895 | 
4896 |   '@radix-ui/react-focus-guards@1.1.3(@types/react@19.1.12)(react@19.1.1)':
4897 |     dependencies:
4898 |       react: 19.1.1
4899 |     optionalDependencies:
4900 |       '@types/react': 19.1.12
4901 | 
4902 |   '@radix-ui/react-focus-scope@1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4903 |     dependencies:
4904 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4905 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4906 |       '@radix-ui/react-use-callback-ref': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4907 |       react: 19.1.1
4908 |       react-dom: 19.1.1(react@19.1.1)
4909 |     optionalDependencies:
4910 |       '@types/react': 19.1.12
4911 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4912 | 
4913 |   '@radix-ui/react-focus-scope@1.1.7(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4914 |     dependencies:
4915 |       '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.1.12)(react@19.1.1)
4916 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4917 |       '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4918 |       react: 19.1.1
4919 |       react-dom: 19.1.1(react@19.1.1)
4920 |     optionalDependencies:
4921 |       '@types/react': 19.1.12
4922 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4923 | 
4924 |   '@radix-ui/react-hover-card@1.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4925 |     dependencies:
4926 |       '@radix-ui/primitive': 1.1.1
4927 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4928 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4929 |       '@radix-ui/react-dismissable-layer': 1.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4930 |       '@radix-ui/react-popper': 1.2.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4931 |       '@radix-ui/react-portal': 1.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4932 |       '@radix-ui/react-presence': 1.1.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4933 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4934 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4935 |       react: 19.1.1
4936 |       react-dom: 19.1.1(react@19.1.1)
4937 |     optionalDependencies:
4938 |       '@types/react': 19.1.12
4939 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4940 | 
4941 |   '@radix-ui/react-id@1.1.0(@types/react@19.1.12)(react@19.1.1)':
4942 |     dependencies:
4943 |       '@radix-ui/react-use-layout-effect': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4944 |       react: 19.1.1
4945 |     optionalDependencies:
4946 |       '@types/react': 19.1.12
4947 | 
4948 |   '@radix-ui/react-id@1.1.1(@types/react@19.1.12)(react@19.1.1)':
4949 |     dependencies:
4950 |       '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4951 |       react: 19.1.1
4952 |     optionalDependencies:
4953 |       '@types/react': 19.1.12
4954 | 
4955 |   '@radix-ui/react-label@2.1.7(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4956 |     dependencies:
4957 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4958 |       react: 19.1.1
4959 |       react-dom: 19.1.1(react@19.1.1)
4960 |     optionalDependencies:
4961 |       '@types/react': 19.1.12
4962 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4963 | 
4964 |   '@radix-ui/react-menu@2.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4965 |     dependencies:
4966 |       '@radix-ui/primitive': 1.1.1
4967 |       '@radix-ui/react-collection': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4968 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4969 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4970 |       '@radix-ui/react-direction': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4971 |       '@radix-ui/react-dismissable-layer': 1.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4972 |       '@radix-ui/react-focus-guards': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4973 |       '@radix-ui/react-focus-scope': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4974 |       '@radix-ui/react-id': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4975 |       '@radix-ui/react-popper': 1.2.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4976 |       '@radix-ui/react-portal': 1.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4977 |       '@radix-ui/react-presence': 1.1.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4978 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4979 |       '@radix-ui/react-roving-focus': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4980 |       '@radix-ui/react-slot': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4981 |       '@radix-ui/react-use-callback-ref': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4982 |       aria-hidden: 1.2.6
4983 |       react: 19.1.1
4984 |       react-dom: 19.1.1(react@19.1.1)
4985 |       react-remove-scroll: 2.7.1(@types/react@19.1.12)(react@19.1.1)
4986 |     optionalDependencies:
4987 |       '@types/react': 19.1.12
4988 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
4989 | 
4990 |   '@radix-ui/react-menubar@1.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
4991 |     dependencies:
4992 |       '@radix-ui/primitive': 1.1.1
4993 |       '@radix-ui/react-collection': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4994 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4995 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
4996 |       '@radix-ui/react-direction': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4997 |       '@radix-ui/react-id': 1.1.0(@types/react@19.1.12)(react@19.1.1)
4998 |       '@radix-ui/react-menu': 2.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
4999 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5000 |       '@radix-ui/react-roving-focus': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5001 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5002 |       react: 19.1.1
5003 |       react-dom: 19.1.1(react@19.1.1)
5004 |     optionalDependencies:
5005 |       '@types/react': 19.1.12
5006 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5007 | 
5008 |   '@radix-ui/react-navigation-menu@1.2.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5009 |     dependencies:
5010 |       '@radix-ui/primitive': 1.1.1
5011 |       '@radix-ui/react-collection': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5012 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5013 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5014 |       '@radix-ui/react-direction': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5015 |       '@radix-ui/react-dismissable-layer': 1.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5016 |       '@radix-ui/react-id': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5017 |       '@radix-ui/react-presence': 1.1.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5018 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5019 |       '@radix-ui/react-use-callback-ref': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5020 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5021 |       '@radix-ui/react-use-layout-effect': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5022 |       '@radix-ui/react-use-previous': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5023 |       '@radix-ui/react-visually-hidden': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5024 |       react: 19.1.1
5025 |       react-dom: 19.1.1(react@19.1.1)
5026 |     optionalDependencies:
5027 |       '@types/react': 19.1.12
5028 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5029 | 
5030 |   '@radix-ui/react-popover@1.1.15(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5031 |     dependencies:
5032 |       '@radix-ui/primitive': 1.1.3
5033 |       '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5034 |       '@radix-ui/react-context': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5035 |       '@radix-ui/react-dismissable-layer': 1.1.11(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5036 |       '@radix-ui/react-focus-guards': 1.1.3(@types/react@19.1.12)(react@19.1.1)
5037 |       '@radix-ui/react-focus-scope': 1.1.7(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5038 |       '@radix-ui/react-id': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5039 |       '@radix-ui/react-popper': 1.2.8(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5040 |       '@radix-ui/react-portal': 1.1.9(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5041 |       '@radix-ui/react-presence': 1.1.5(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5042 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5043 |       '@radix-ui/react-slot': 1.2.3(@types/react@19.1.12)(react@19.1.1)
5044 |       '@radix-ui/react-use-controllable-state': 1.2.2(@types/react@19.1.12)(react@19.1.1)
5045 |       aria-hidden: 1.2.6
5046 |       react: 19.1.1
5047 |       react-dom: 19.1.1(react@19.1.1)
5048 |       react-remove-scroll: 2.7.1(@types/react@19.1.12)(react@19.1.1)
5049 |     optionalDependencies:
5050 |       '@types/react': 19.1.12
5051 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5052 | 
5053 |   '@radix-ui/react-popper@1.2.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5054 |     dependencies:
5055 |       '@floating-ui/react-dom': 2.1.6(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5056 |       '@radix-ui/react-arrow': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5057 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5058 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5059 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5060 |       '@radix-ui/react-use-callback-ref': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5061 |       '@radix-ui/react-use-layout-effect': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5062 |       '@radix-ui/react-use-rect': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5063 |       '@radix-ui/react-use-size': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5064 |       '@radix-ui/rect': 1.1.0
5065 |       react: 19.1.1
5066 |       react-dom: 19.1.1(react@19.1.1)
5067 |     optionalDependencies:
5068 |       '@types/react': 19.1.12
5069 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5070 | 
5071 |   '@radix-ui/react-popper@1.2.8(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5072 |     dependencies:
5073 |       '@floating-ui/react-dom': 2.1.6(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5074 |       '@radix-ui/react-arrow': 1.1.7(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5075 |       '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5076 |       '@radix-ui/react-context': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5077 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5078 |       '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5079 |       '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5080 |       '@radix-ui/react-use-rect': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5081 |       '@radix-ui/react-use-size': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5082 |       '@radix-ui/rect': 1.1.1
5083 |       react: 19.1.1
5084 |       react-dom: 19.1.1(react@19.1.1)
5085 |     optionalDependencies:
5086 |       '@types/react': 19.1.12
5087 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5088 | 
5089 |   '@radix-ui/react-portal@1.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5090 |     dependencies:
5091 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5092 |       '@radix-ui/react-use-layout-effect': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5093 |       react: 19.1.1
5094 |       react-dom: 19.1.1(react@19.1.1)
5095 |     optionalDependencies:
5096 |       '@types/react': 19.1.12
5097 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5098 | 
5099 |   '@radix-ui/react-portal@1.1.9(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5100 |     dependencies:
5101 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5102 |       '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5103 |       react: 19.1.1
5104 |       react-dom: 19.1.1(react@19.1.1)
5105 |     optionalDependencies:
5106 |       '@types/react': 19.1.12
5107 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5108 | 
5109 |   '@radix-ui/react-presence@1.1.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5110 |     dependencies:
5111 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5112 |       '@radix-ui/react-use-layout-effect': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5113 |       react: 19.1.1
5114 |       react-dom: 19.1.1(react@19.1.1)
5115 |     optionalDependencies:
5116 |       '@types/react': 19.1.12
5117 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5118 | 
5119 |   '@radix-ui/react-presence@1.1.5(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5120 |     dependencies:
5121 |       '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5122 |       '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5123 |       react: 19.1.1
5124 |       react-dom: 19.1.1(react@19.1.1)
5125 |     optionalDependencies:
5126 |       '@types/react': 19.1.12
5127 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5128 | 
5129 |   '@radix-ui/react-primitive@2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5130 |     dependencies:
5131 |       '@radix-ui/react-slot': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5132 |       react: 19.1.1
5133 |       react-dom: 19.1.1(react@19.1.1)
5134 |     optionalDependencies:
5135 |       '@types/react': 19.1.12
5136 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5137 | 
5138 |   '@radix-ui/react-primitive@2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5139 |     dependencies:
5140 |       '@radix-ui/react-slot': 1.2.3(@types/react@19.1.12)(react@19.1.1)
5141 |       react: 19.1.1
5142 |       react-dom: 19.1.1(react@19.1.1)
5143 |     optionalDependencies:
5144 |       '@types/react': 19.1.12
5145 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5146 | 
5147 |   '@radix-ui/react-progress@1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5148 |     dependencies:
5149 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5150 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5151 |       react: 19.1.1
5152 |       react-dom: 19.1.1(react@19.1.1)
5153 |     optionalDependencies:
5154 |       '@types/react': 19.1.12
5155 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5156 | 
5157 |   '@radix-ui/react-radio-group@1.2.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5158 |     dependencies:
5159 |       '@radix-ui/primitive': 1.1.1
5160 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5161 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5162 |       '@radix-ui/react-direction': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5163 |       '@radix-ui/react-presence': 1.1.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5164 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5165 |       '@radix-ui/react-roving-focus': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5166 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5167 |       '@radix-ui/react-use-previous': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5168 |       '@radix-ui/react-use-size': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5169 |       react: 19.1.1
5170 |       react-dom: 19.1.1(react@19.1.1)
5171 |     optionalDependencies:
5172 |       '@types/react': 19.1.12
5173 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5174 | 
5175 |   '@radix-ui/react-roving-focus@1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5176 |     dependencies:
5177 |       '@radix-ui/primitive': 1.1.1
5178 |       '@radix-ui/react-collection': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5179 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5180 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5181 |       '@radix-ui/react-direction': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5182 |       '@radix-ui/react-id': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5183 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5184 |       '@radix-ui/react-use-callback-ref': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5185 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5186 |       react: 19.1.1
5187 |       react-dom: 19.1.1(react@19.1.1)
5188 |     optionalDependencies:
5189 |       '@types/react': 19.1.12
5190 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5191 | 
5192 |   '@radix-ui/react-roving-focus@1.1.11(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5193 |     dependencies:
5194 |       '@radix-ui/primitive': 1.1.3
5195 |       '@radix-ui/react-collection': 1.1.7(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5196 |       '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5197 |       '@radix-ui/react-context': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5198 |       '@radix-ui/react-direction': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5199 |       '@radix-ui/react-id': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5200 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5201 |       '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5202 |       '@radix-ui/react-use-controllable-state': 1.2.2(@types/react@19.1.12)(react@19.1.1)
5203 |       react: 19.1.1
5204 |       react-dom: 19.1.1(react@19.1.1)
5205 |     optionalDependencies:
5206 |       '@types/react': 19.1.12
5207 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5208 | 
5209 |   '@radix-ui/react-scroll-area@1.2.10(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5210 |     dependencies:
5211 |       '@radix-ui/number': 1.1.1
5212 |       '@radix-ui/primitive': 1.1.3
5213 |       '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5214 |       '@radix-ui/react-context': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5215 |       '@radix-ui/react-direction': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5216 |       '@radix-ui/react-presence': 1.1.5(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5217 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5218 |       '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5219 |       '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5220 |       react: 19.1.1
5221 |       react-dom: 19.1.1(react@19.1.1)
5222 |     optionalDependencies:
5223 |       '@types/react': 19.1.12
5224 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5225 | 
5226 |   '@radix-ui/react-select@2.2.6(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5227 |     dependencies:
5228 |       '@radix-ui/number': 1.1.1
5229 |       '@radix-ui/primitive': 1.1.3
5230 |       '@radix-ui/react-collection': 1.1.7(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5231 |       '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5232 |       '@radix-ui/react-context': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5233 |       '@radix-ui/react-direction': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5234 |       '@radix-ui/react-dismissable-layer': 1.1.11(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5235 |       '@radix-ui/react-focus-guards': 1.1.3(@types/react@19.1.12)(react@19.1.1)
5236 |       '@radix-ui/react-focus-scope': 1.1.7(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5237 |       '@radix-ui/react-id': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5238 |       '@radix-ui/react-popper': 1.2.8(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5239 |       '@radix-ui/react-portal': 1.1.9(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5240 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5241 |       '@radix-ui/react-slot': 1.2.3(@types/react@19.1.12)(react@19.1.1)
5242 |       '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5243 |       '@radix-ui/react-use-controllable-state': 1.2.2(@types/react@19.1.12)(react@19.1.1)
5244 |       '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5245 |       '@radix-ui/react-use-previous': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5246 |       '@radix-ui/react-visually-hidden': 1.2.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5247 |       aria-hidden: 1.2.6
5248 |       react: 19.1.1
5249 |       react-dom: 19.1.1(react@19.1.1)
5250 |       react-remove-scroll: 2.7.1(@types/react@19.1.12)(react@19.1.1)
5251 |     optionalDependencies:
5252 |       '@types/react': 19.1.12
5253 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5254 | 
5255 |   '@radix-ui/react-separator@1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5256 |     dependencies:
5257 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5258 |       react: 19.1.1
5259 |       react-dom: 19.1.1(react@19.1.1)
5260 |     optionalDependencies:
5261 |       '@types/react': 19.1.12
5262 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5263 | 
5264 |   '@radix-ui/react-slot@1.1.1(@types/react@19.1.12)(react@19.1.1)':
5265 |     dependencies:
5266 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5267 |       react: 19.1.1
5268 |     optionalDependencies:
5269 |       '@types/react': 19.1.12
5270 | 
5271 |   '@radix-ui/react-slot@1.2.3(@types/react@19.1.12)(react@19.1.1)':
5272 |     dependencies:
5273 |       '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5274 |       react: 19.1.1
5275 |     optionalDependencies:
5276 |       '@types/react': 19.1.12
5277 | 
5278 |   '@radix-ui/react-switch@1.2.6(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5279 |     dependencies:
5280 |       '@radix-ui/primitive': 1.1.3
5281 |       '@radix-ui/react-compose-refs': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5282 |       '@radix-ui/react-context': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5283 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5284 |       '@radix-ui/react-use-controllable-state': 1.2.2(@types/react@19.1.12)(react@19.1.1)
5285 |       '@radix-ui/react-use-previous': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5286 |       '@radix-ui/react-use-size': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5287 |       react: 19.1.1
5288 |       react-dom: 19.1.1(react@19.1.1)
5289 |     optionalDependencies:
5290 |       '@types/react': 19.1.12
5291 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5292 | 
5293 |   '@radix-ui/react-tabs@1.1.13(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5294 |     dependencies:
5295 |       '@radix-ui/primitive': 1.1.3
5296 |       '@radix-ui/react-context': 1.1.2(@types/react@19.1.12)(react@19.1.1)
5297 |       '@radix-ui/react-direction': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5298 |       '@radix-ui/react-id': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5299 |       '@radix-ui/react-presence': 1.1.5(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5300 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5301 |       '@radix-ui/react-roving-focus': 1.1.11(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5302 |       '@radix-ui/react-use-controllable-state': 1.2.2(@types/react@19.1.12)(react@19.1.1)
5303 |       react: 19.1.1
5304 |       react-dom: 19.1.1(react@19.1.1)
5305 |     optionalDependencies:
5306 |       '@types/react': 19.1.12
5307 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5308 | 
5309 |   '@radix-ui/react-toast@1.2.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5310 |     dependencies:
5311 |       '@radix-ui/primitive': 1.1.1
5312 |       '@radix-ui/react-collection': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5313 |       '@radix-ui/react-compose-refs': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5314 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5315 |       '@radix-ui/react-dismissable-layer': 1.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5316 |       '@radix-ui/react-portal': 1.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5317 |       '@radix-ui/react-presence': 1.1.2(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5318 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5319 |       '@radix-ui/react-use-callback-ref': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5320 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5321 |       '@radix-ui/react-use-layout-effect': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5322 |       '@radix-ui/react-visually-hidden': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5323 |       react: 19.1.1
5324 |       react-dom: 19.1.1(react@19.1.1)
5325 |     optionalDependencies:
5326 |       '@types/react': 19.1.12
5327 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5328 | 
5329 |   '@radix-ui/react-toggle-group@1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5330 |     dependencies:
5331 |       '@radix-ui/primitive': 1.1.1
5332 |       '@radix-ui/react-context': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5333 |       '@radix-ui/react-direction': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5334 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5335 |       '@radix-ui/react-roving-focus': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5336 |       '@radix-ui/react-toggle': 1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5337 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5338 |       react: 19.1.1
5339 |       react-dom: 19.1.1(react@19.1.1)
5340 |     optionalDependencies:
5341 |       '@types/react': 19.1.12
5342 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5343 | 
5344 |   '@radix-ui/react-toggle@1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5345 |     dependencies:
5346 |       '@radix-ui/primitive': 1.1.1
5347 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5348 |       '@radix-ui/react-use-controllable-state': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5349 |       react: 19.1.1
5350 |       react-dom: 19.1.1(react@19.1.1)
5351 |     optionalDependencies:
5352 |       '@types/react': 19.1.12
5353 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5354 | 
5355 |   '@radix-ui/react-use-callback-ref@1.1.0(@types/react@19.1.12)(react@19.1.1)':
5356 |     dependencies:
5357 |       react: 19.1.1
5358 |     optionalDependencies:
5359 |       '@types/react': 19.1.12
5360 | 
5361 |   '@radix-ui/react-use-callback-ref@1.1.1(@types/react@19.1.12)(react@19.1.1)':
5362 |     dependencies:
5363 |       react: 19.1.1
5364 |     optionalDependencies:
5365 |       '@types/react': 19.1.12
5366 | 
5367 |   '@radix-ui/react-use-controllable-state@1.1.0(@types/react@19.1.12)(react@19.1.1)':
5368 |     dependencies:
5369 |       '@radix-ui/react-use-callback-ref': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5370 |       react: 19.1.1
5371 |     optionalDependencies:
5372 |       '@types/react': 19.1.12
5373 | 
5374 |   '@radix-ui/react-use-controllable-state@1.2.2(@types/react@19.1.12)(react@19.1.1)':
5375 |     dependencies:
5376 |       '@radix-ui/react-use-effect-event': 0.0.2(@types/react@19.1.12)(react@19.1.1)
5377 |       '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5378 |       react: 19.1.1
5379 |     optionalDependencies:
5380 |       '@types/react': 19.1.12
5381 | 
5382 |   '@radix-ui/react-use-effect-event@0.0.2(@types/react@19.1.12)(react@19.1.1)':
5383 |     dependencies:
5384 |       '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5385 |       react: 19.1.1
5386 |     optionalDependencies:
5387 |       '@types/react': 19.1.12
5388 | 
5389 |   '@radix-ui/react-use-escape-keydown@1.1.0(@types/react@19.1.12)(react@19.1.1)':
5390 |     dependencies:
5391 |       '@radix-ui/react-use-callback-ref': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5392 |       react: 19.1.1
5393 |     optionalDependencies:
5394 |       '@types/react': 19.1.12
5395 | 
5396 |   '@radix-ui/react-use-escape-keydown@1.1.1(@types/react@19.1.12)(react@19.1.1)':
5397 |     dependencies:
5398 |       '@radix-ui/react-use-callback-ref': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5399 |       react: 19.1.1
5400 |     optionalDependencies:
5401 |       '@types/react': 19.1.12
5402 | 
5403 |   '@radix-ui/react-use-is-hydrated@0.1.0(@types/react@19.1.12)(react@19.1.1)':
5404 |     dependencies:
5405 |       react: 19.1.1
5406 |       use-sync-external-store: 1.5.0(react@19.1.1)
5407 |     optionalDependencies:
5408 |       '@types/react': 19.1.12
5409 | 
5410 |   '@radix-ui/react-use-layout-effect@1.1.0(@types/react@19.1.12)(react@19.1.1)':
5411 |     dependencies:
5412 |       react: 19.1.1
5413 |     optionalDependencies:
5414 |       '@types/react': 19.1.12
5415 | 
5416 |   '@radix-ui/react-use-layout-effect@1.1.1(@types/react@19.1.12)(react@19.1.1)':
5417 |     dependencies:
5418 |       react: 19.1.1
5419 |     optionalDependencies:
5420 |       '@types/react': 19.1.12
5421 | 
5422 |   '@radix-ui/react-use-previous@1.1.0(@types/react@19.1.12)(react@19.1.1)':
5423 |     dependencies:
5424 |       react: 19.1.1
5425 |     optionalDependencies:
5426 |       '@types/react': 19.1.12
5427 | 
5428 |   '@radix-ui/react-use-previous@1.1.1(@types/react@19.1.12)(react@19.1.1)':
5429 |     dependencies:
5430 |       react: 19.1.1
5431 |     optionalDependencies:
5432 |       '@types/react': 19.1.12
5433 | 
5434 |   '@radix-ui/react-use-rect@1.1.0(@types/react@19.1.12)(react@19.1.1)':
5435 |     dependencies:
5436 |       '@radix-ui/rect': 1.1.0
5437 |       react: 19.1.1
5438 |     optionalDependencies:
5439 |       '@types/react': 19.1.12
5440 | 
5441 |   '@radix-ui/react-use-rect@1.1.1(@types/react@19.1.12)(react@19.1.1)':
5442 |     dependencies:
5443 |       '@radix-ui/rect': 1.1.1
5444 |       react: 19.1.1
5445 |     optionalDependencies:
5446 |       '@types/react': 19.1.12
5447 | 
5448 |   '@radix-ui/react-use-size@1.1.0(@types/react@19.1.12)(react@19.1.1)':
5449 |     dependencies:
5450 |       '@radix-ui/react-use-layout-effect': 1.1.0(@types/react@19.1.12)(react@19.1.1)
5451 |       react: 19.1.1
5452 |     optionalDependencies:
5453 |       '@types/react': 19.1.12
5454 | 
5455 |   '@radix-ui/react-use-size@1.1.1(@types/react@19.1.12)(react@19.1.1)':
5456 |     dependencies:
5457 |       '@radix-ui/react-use-layout-effect': 1.1.1(@types/react@19.1.12)(react@19.1.1)
5458 |       react: 19.1.1
5459 |     optionalDependencies:
5460 |       '@types/react': 19.1.12
5461 | 
5462 |   '@radix-ui/react-visually-hidden@1.1.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5463 |     dependencies:
5464 |       '@radix-ui/react-primitive': 2.0.1(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5465 |       react: 19.1.1
5466 |       react-dom: 19.1.1(react@19.1.1)
5467 |     optionalDependencies:
5468 |       '@types/react': 19.1.12
5469 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5470 | 
5471 |   '@radix-ui/react-visually-hidden@1.2.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5472 |     dependencies:
5473 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5474 |       react: 19.1.1
5475 |       react-dom: 19.1.1(react@19.1.1)
5476 |     optionalDependencies:
5477 |       '@types/react': 19.1.12
5478 |       '@types/react-dom': 19.1.9(@types/react@19.1.12)
5479 | 
5480 |   '@radix-ui/rect@1.1.0': {}
5481 | 
5482 |   '@radix-ui/rect@1.1.1': {}
5483 | 
5484 |   '@remix-run/react@2.17.0(react-dom@19.1.1(react@19.1.1))(react@19.1.1)(typescript@5.9.2)':
5485 |     dependencies:
5486 |       '@remix-run/router': 1.23.0
5487 |       '@remix-run/server-runtime': 2.17.0(typescript@5.9.2)
5488 |       react: 19.1.1
5489 |       react-dom: 19.1.1(react@19.1.1)
5490 |       react-router: 6.30.0(react@19.1.1)
5491 |       react-router-dom: 6.30.0(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5492 |       turbo-stream: 2.4.1
5493 |     optionalDependencies:
5494 |       typescript: 5.9.2
5495 | 
5496 |   '@remix-run/router@1.23.0': {}
5497 | 
5498 |   '@remix-run/server-runtime@2.17.0(typescript@5.9.2)':
5499 |     dependencies:
5500 |       '@remix-run/router': 1.23.0
5501 |       '@types/cookie': 0.6.0
5502 |       '@web3-storage/multipart-parser': 1.0.0
5503 |       cookie: 0.7.2
5504 |       set-cookie-parser: 2.7.1
5505 |       source-map: 0.7.6
5506 |       turbo-stream: 2.4.1
5507 |     optionalDependencies:
5508 |       typescript: 5.9.2
5509 | 
5510 |   '@rollup/rollup-android-arm-eabi@4.50.0':
5511 |     optional: true
5512 | 
5513 |   '@rollup/rollup-android-arm64@4.50.0':
5514 |     optional: true
5515 | 
5516 |   '@rollup/rollup-darwin-arm64@4.50.0':
5517 |     optional: true
5518 | 
5519 |   '@rollup/rollup-darwin-x64@4.50.0':
5520 |     optional: true
5521 | 
5522 |   '@rollup/rollup-freebsd-arm64@4.50.0':
5523 |     optional: true
5524 | 
5525 |   '@rollup/rollup-freebsd-x64@4.50.0':
5526 |     optional: true
5527 | 
5528 |   '@rollup/rollup-linux-arm-gnueabihf@4.50.0':
5529 |     optional: true
5530 | 
5531 |   '@rollup/rollup-linux-arm-musleabihf@4.50.0':
5532 |     optional: true
5533 | 
5534 |   '@rollup/rollup-linux-arm64-gnu@4.50.0':
5535 |     optional: true
5536 | 
5537 |   '@rollup/rollup-linux-arm64-musl@4.50.0':
5538 |     optional: true
5539 | 
5540 |   '@rollup/rollup-linux-loongarch64-gnu@4.50.0':
5541 |     optional: true
5542 | 
5543 |   '@rollup/rollup-linux-ppc64-gnu@4.50.0':
5544 |     optional: true
5545 | 
5546 |   '@rollup/rollup-linux-riscv64-gnu@4.50.0':
5547 |     optional: true
5548 | 
5549 |   '@rollup/rollup-linux-riscv64-musl@4.50.0':
5550 |     optional: true
5551 | 
5552 |   '@rollup/rollup-linux-s390x-gnu@4.50.0':
5553 |     optional: true
5554 | 
5555 |   '@rollup/rollup-linux-x64-gnu@4.50.0':
5556 |     optional: true
5557 | 
5558 |   '@rollup/rollup-linux-x64-musl@4.50.0':
5559 |     optional: true
5560 | 
5561 |   '@rollup/rollup-openharmony-arm64@4.50.0':
5562 |     optional: true
5563 | 
5564 |   '@rollup/rollup-win32-arm64-msvc@4.50.0':
5565 |     optional: true
5566 | 
5567 |   '@rollup/rollup-win32-ia32-msvc@4.50.0':
5568 |     optional: true
5569 | 
5570 |   '@rollup/rollup-win32-x64-msvc@4.50.0':
5571 |     optional: true
5572 | 
5573 |   '@standard-schema/spec@1.0.0': {}
5574 | 
5575 |   '@sveltejs/acorn-typescript@1.0.5(acorn@8.15.0)':
5576 |     dependencies:
5577 |       acorn: 8.15.0
5578 | 
5579 |   '@sveltejs/kit@2.37.0(@opentelemetry/api@1.9.0)(@sveltejs/vite-plugin-svelte@6.1.4(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1))':
5580 |     dependencies:
5581 |       '@standard-schema/spec': 1.0.0
5582 |       '@sveltejs/acorn-typescript': 1.0.5(acorn@8.15.0)
5583 |       '@sveltejs/vite-plugin-svelte': 6.1.4(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1))
5584 |       '@types/cookie': 0.6.0
5585 |       acorn: 8.15.0
5586 |       cookie: 0.6.0
5587 |       devalue: 5.3.2
5588 |       esm-env: 1.2.2
5589 |       kleur: 4.1.5
5590 |       magic-string: 0.30.18
5591 |       mrmime: 2.0.1
5592 |       sade: 1.8.1
5593 |       set-cookie-parser: 2.7.1
5594 |       sirv: 3.0.1
5595 |       svelte: 5.38.6
5596 |       vite: 7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)
5597 |     optionalDependencies:
5598 |       '@opentelemetry/api': 1.9.0
5599 | 
5600 |   '@sveltejs/vite-plugin-svelte-inspector@5.0.1(@sveltejs/vite-plugin-svelte@6.1.4(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1))':
5601 |     dependencies:
5602 |       '@sveltejs/vite-plugin-svelte': 6.1.4(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1))
5603 |       debug: 4.4.1
5604 |       svelte: 5.38.6
5605 |       vite: 7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)
5606 |     transitivePeerDependencies:
5607 |       - supports-color
5608 | 
5609 |   '@sveltejs/vite-plugin-svelte@6.1.4(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1))':
5610 |     dependencies:
5611 |       '@sveltejs/vite-plugin-svelte-inspector': 5.0.1(@sveltejs/vite-plugin-svelte@6.1.4(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1))
5612 |       debug: 4.4.1
5613 |       deepmerge: 4.3.1
5614 |       magic-string: 0.30.18
5615 |       svelte: 5.38.6
5616 |       vite: 7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)
5617 |       vitefu: 1.1.1(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1))
5618 |     transitivePeerDependencies:
5619 |       - supports-color
5620 | 
5621 |   '@swc/counter@0.1.3': {}
5622 | 
5623 |   '@swc/helpers@0.5.15':
5624 |     dependencies:
5625 |       tslib: 2.8.1
5626 | 
5627 |   '@tootallnate/once@2.0.0':
5628 |     optional: true
5629 | 
5630 |   '@types/body-parser@1.19.6':
5631 |     dependencies:
5632 |       '@types/connect': 3.4.38
5633 |       '@types/node': 22.18.0
5634 | 
5635 |   '@types/caseless@0.12.5':
5636 |     optional: true
5637 | 
5638 |   '@types/connect@3.4.38':
5639 |     dependencies:
5640 |       '@types/node': 22.18.0
5641 | 
5642 |   '@types/cookie@0.6.0': {}
5643 | 
5644 |   '@types/cors@2.8.19':
5645 |     dependencies:
5646 |       '@types/node': 22.18.0
5647 | 
5648 |   '@types/d3-array@3.2.1': {}
5649 | 
5650 |   '@types/d3-color@3.1.3': {}
5651 | 
5652 |   '@types/d3-ease@3.0.2': {}
5653 | 
5654 |   '@types/d3-interpolate@3.0.4':
5655 |     dependencies:
5656 |       '@types/d3-color': 3.1.3
5657 | 
5658 |   '@types/d3-path@3.1.1': {}
5659 | 
5660 |   '@types/d3-scale@4.0.9':
5661 |     dependencies:
5662 |       '@types/d3-time': 3.0.4
5663 | 
5664 |   '@types/d3-shape@3.1.7':
5665 |     dependencies:
5666 |       '@types/d3-path': 3.1.1
5667 | 
5668 |   '@types/d3-time@3.0.4': {}
5669 | 
5670 |   '@types/d3-timer@3.0.2': {}
5671 | 
5672 |   '@types/estree@1.0.8': {}
5673 | 
5674 |   '@types/express-serve-static-core@4.19.6':
5675 |     dependencies:
5676 |       '@types/node': 22.18.0
5677 |       '@types/qs': 6.14.0
5678 |       '@types/range-parser': 1.2.7
5679 |       '@types/send': 0.17.5
5680 | 
5681 |   '@types/express@4.17.23':
5682 |     dependencies:
5683 |       '@types/body-parser': 1.19.6
5684 |       '@types/express-serve-static-core': 4.19.6
5685 |       '@types/qs': 6.14.0
5686 |       '@types/serve-static': 1.15.8
5687 | 
5688 |   '@types/google.maps@3.58.1': {}
5689 | 
5690 |   '@types/http-errors@2.0.5': {}
5691 | 
5692 |   '@types/jsonwebtoken@9.0.10':
5693 |     dependencies:
5694 |       '@types/ms': 2.1.0
5695 |       '@types/node': 22.18.0
5696 | 
5697 |   '@types/long@4.0.2':
5698 |     optional: true
5699 | 
5700 |   '@types/mime@1.3.5': {}
5701 | 
5702 |   '@types/ms@2.1.0': {}
5703 | 
5704 |   '@types/node@22.18.0':
5705 |     dependencies:
5706 |       undici-types: 6.21.0
5707 | 
5708 |   '@types/qs@6.14.0': {}
5709 | 
5710 |   '@types/range-parser@1.2.7': {}
5711 | 
5712 |   '@types/react-dom@19.1.9(@types/react@19.1.12)':
5713 |     dependencies:
5714 |       '@types/react': 19.1.12
5715 | 
5716 |   '@types/react@19.1.12':
5717 |     dependencies:
5718 |       csstype: 3.1.3
5719 | 
5720 |   '@types/request@2.48.13':
5721 |     dependencies:
5722 |       '@types/caseless': 0.12.5
5723 |       '@types/node': 22.18.0
5724 |       '@types/tough-cookie': 4.0.5
5725 |       form-data: 2.5.5
5726 |     optional: true
5727 | 
5728 |   '@types/send@0.17.5':
5729 |     dependencies:
5730 |       '@types/mime': 1.3.5
5731 |       '@types/node': 22.18.0
5732 | 
5733 |   '@types/serve-static@1.15.8':
5734 |     dependencies:
5735 |       '@types/http-errors': 2.0.5
5736 |       '@types/node': 22.18.0
5737 |       '@types/send': 0.17.5
5738 | 
5739 |   '@types/tough-cookie@4.0.5':
5740 |     optional: true
5741 | 
5742 |   '@vercel/analytics@1.5.0(@remix-run/react@2.17.0(react-dom@19.1.1(react@19.1.1))(react@19.1.1)(typescript@5.9.2))(@sveltejs/kit@2.37.0(@opentelemetry/api@1.9.0)(@sveltejs/vite-plugin-svelte@6.1.4(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(next@15.2.4(@opentelemetry/api@1.9.0)(react-dom@19.1.1(react@19.1.1))(react@19.1.1))(react@19.1.1)(svelte@5.38.6)(vue-router@4.5.1(vue@3.5.21(typescript@5.9.2)))(vue@3.5.21(typescript@5.9.2))':
5743 |     optionalDependencies:
5744 |       '@remix-run/react': 2.17.0(react-dom@19.1.1(react@19.1.1))(react@19.1.1)(typescript@5.9.2)
5745 |       '@sveltejs/kit': 2.37.0(@opentelemetry/api@1.9.0)(@sveltejs/vite-plugin-svelte@6.1.4(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1))
5746 |       next: 15.2.4(@opentelemetry/api@1.9.0)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5747 |       react: 19.1.1
5748 |       svelte: 5.38.6
5749 |       vue: 3.5.21(typescript@5.9.2)
5750 |       vue-router: 4.5.1(vue@3.5.21(typescript@5.9.2))
5751 | 
5752 |   '@vercel/speed-insights@1.2.0(@sveltejs/kit@2.37.0(@opentelemetry/api@1.9.0)(@sveltejs/vite-plugin-svelte@6.1.4(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(next@15.2.4(@opentelemetry/api@1.9.0)(react-dom@19.1.1(react@19.1.1))(react@19.1.1))(react@19.1.1)(svelte@5.38.6)(vue-router@4.5.1(vue@3.5.21(typescript@5.9.2)))(vue@3.5.21(typescript@5.9.2))':
5753 |     optionalDependencies:
5754 |       '@sveltejs/kit': 2.37.0(@opentelemetry/api@1.9.0)(@sveltejs/vite-plugin-svelte@6.1.4(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)))(svelte@5.38.6)(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1))
5755 |       next: 15.2.4(@opentelemetry/api@1.9.0)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
5756 |       react: 19.1.1
5757 |       svelte: 5.38.6
5758 |       vue: 3.5.21(typescript@5.9.2)
5759 |       vue-router: 4.5.1(vue@3.5.21(typescript@5.9.2))
5760 | 
5761 |   '@vis.gl/react-google-maps@1.5.5(react-dom@19.1.1(react@19.1.1))(react@19.1.1)':
5762 |     dependencies:
5763 |       '@types/google.maps': 3.58.1
5764 |       fast-deep-equal: 3.1.3
5765 |       react: 19.1.1
5766 |       react-dom: 19.1.1(react@19.1.1)
5767 | 
5768 |   '@vue/compiler-core@3.5.21':
5769 |     dependencies:
5770 |       '@babel/parser': 7.28.3
5771 |       '@vue/shared': 3.5.21
5772 |       entities: 4.5.0
5773 |       estree-walker: 2.0.2
5774 |       source-map-js: 1.2.1
5775 | 
5776 |   '@vue/compiler-dom@3.5.21':
5777 |     dependencies:
5778 |       '@vue/compiler-core': 3.5.21
5779 |       '@vue/shared': 3.5.21
5780 | 
5781 |   '@vue/compiler-sfc@3.5.21':
5782 |     dependencies:
5783 |       '@babel/parser': 7.28.3
5784 |       '@vue/compiler-core': 3.5.21
5785 |       '@vue/compiler-dom': 3.5.21
5786 |       '@vue/compiler-ssr': 3.5.21
5787 |       '@vue/shared': 3.5.21
5788 |       estree-walker: 2.0.2
5789 |       magic-string: 0.30.18
5790 |       postcss: 8.5.6
5791 |       source-map-js: 1.2.1
5792 | 
5793 |   '@vue/compiler-ssr@3.5.21':
5794 |     dependencies:
5795 |       '@vue/compiler-dom': 3.5.21
5796 |       '@vue/shared': 3.5.21
5797 | 
5798 |   '@vue/devtools-api@6.6.4': {}
5799 | 
5800 |   '@vue/reactivity@3.5.21':
5801 |     dependencies:
5802 |       '@vue/shared': 3.5.21
5803 | 
5804 |   '@vue/runtime-core@3.5.21':
5805 |     dependencies:
5806 |       '@vue/reactivity': 3.5.21
5807 |       '@vue/shared': 3.5.21
5808 | 
5809 |   '@vue/runtime-dom@3.5.21':
5810 |     dependencies:
5811 |       '@vue/reactivity': 3.5.21
5812 |       '@vue/runtime-core': 3.5.21
5813 |       '@vue/shared': 3.5.21
5814 |       csstype: 3.1.3
5815 | 
5816 |   '@vue/server-renderer@3.5.21(vue@3.5.21(typescript@5.9.2))':
5817 |     dependencies:
5818 |       '@vue/compiler-ssr': 3.5.21
5819 |       '@vue/shared': 3.5.21
5820 |       vue: 3.5.21(typescript@5.9.2)
5821 | 
5822 |   '@vue/shared@3.5.21': {}
5823 | 
5824 |   '@web3-storage/multipart-parser@1.0.0': {}
5825 | 
5826 |   abort-controller@3.0.0:
5827 |     dependencies:
5828 |       event-target-shim: 5.0.1
5829 |     optional: true
5830 | 
5831 |   accepts@1.3.8:
5832 |     dependencies:
5833 |       mime-types: 2.1.35
5834 |       negotiator: 0.6.3
5835 | 
5836 |   acorn@8.15.0: {}
5837 | 
5838 |   agent-base@6.0.2:
5839 |     dependencies:
5840 |       debug: 4.4.1
5841 |     transitivePeerDependencies:
5842 |       - supports-color
5843 |     optional: true
5844 | 
5845 |   agent-base@7.1.4: {}
5846 | 
5847 |   ajv@6.12.6:
5848 |     dependencies:
5849 |       fast-deep-equal: 3.1.3
5850 |       fast-json-stable-stringify: 2.1.0
5851 |       json-schema-traverse: 0.4.1
5852 |       uri-js: 4.4.1
5853 | 
5854 |   ansi-regex@5.0.1: {}
5855 | 
5856 |   ansi-regex@6.2.0: {}
5857 | 
5858 |   ansi-styles@4.3.0:
5859 |     dependencies:
5860 |       color-convert: 2.0.1
5861 | 
5862 |   ansi-styles@6.2.1: {}
5863 | 
5864 |   any-promise@1.3.0: {}
5865 | 
5866 |   anymatch@3.1.3:
5867 |     dependencies:
5868 |       normalize-path: 3.0.0
5869 |       picomatch: 2.3.1
5870 | 
5871 |   arg@5.0.2: {}
5872 | 
5873 |   aria-hidden@1.2.6:
5874 |     dependencies:
5875 |       tslib: 2.8.1
5876 | 
5877 |   aria-query@5.3.2: {}
5878 | 
5879 |   array-flatten@1.1.1: {}
5880 | 
5881 |   arrify@2.0.1:
5882 |     optional: true
5883 | 
5884 |   asn1@0.2.6:
5885 |     dependencies:
5886 |       safer-buffer: 2.1.2
5887 | 
5888 |   assert-plus@1.0.0: {}
5889 | 
5890 |   async-retry@1.3.3:
5891 |     dependencies:
5892 |       retry: 0.13.1
5893 |     optional: true
5894 | 
5895 |   asynckit@0.4.0: {}
5896 | 
5897 |   autoprefixer@10.4.21(postcss@8.5.6):
5898 |     dependencies:
5899 |       browserslist: 4.25.4
5900 |       caniuse-lite: 1.0.30001739
5901 |       fraction.js: 4.3.7
5902 |       normalize-range: 0.1.2
5903 |       picocolors: 1.1.1
5904 |       postcss: 8.5.6
5905 |       postcss-value-parser: 4.2.0
5906 | 
5907 |   aws-sign2@0.7.0: {}
5908 | 
5909 |   aws4@1.13.2: {}
5910 | 
5911 |   axios@1.11.0:
5912 |     dependencies:
5913 |       follow-redirects: 1.15.11
5914 |       form-data: 4.0.4
5915 |       proxy-from-env: 1.1.0
5916 |     transitivePeerDependencies:
5917 |       - debug
5918 | 
5919 |   axobject-query@4.1.0: {}
5920 | 
5921 |   balanced-match@1.0.2: {}
5922 | 
5923 |   base64-js@1.5.1: {}
5924 | 
5925 |   bcrypt-pbkdf@1.0.2:
5926 |     dependencies:
5927 |       tweetnacl: 0.14.5
5928 | 
5929 |   bignumber.js@9.3.1: {}
5930 | 
5931 |   binary-extensions@2.3.0: {}
5932 | 
5933 |   body-parser@1.20.3:
5934 |     dependencies:
5935 |       bytes: 3.1.2
5936 |       content-type: 1.0.5
5937 |       debug: 2.6.9
5938 |       depd: 2.0.0
5939 |       destroy: 1.2.0
5940 |       http-errors: 2.0.0
5941 |       iconv-lite: 0.4.24
5942 |       on-finished: 2.4.1
5943 |       qs: 6.13.0
5944 |       raw-body: 2.5.2
5945 |       type-is: 1.6.18
5946 |       unpipe: 1.0.0
5947 |     transitivePeerDependencies:
5948 |       - supports-color
5949 | 
5950 |   brace-expansion@2.0.2:
5951 |     dependencies:
5952 |       balanced-match: 1.0.2
5953 | 
5954 |   braces@3.0.3:
5955 |     dependencies:
5956 |       fill-range: 7.1.1
5957 | 
5958 |   browserslist@4.25.4:
5959 |     dependencies:
5960 |       caniuse-lite: 1.0.30001739
5961 |       electron-to-chromium: 1.5.212
5962 |       node-releases: 2.0.19
5963 |       update-browserslist-db: 1.1.3(browserslist@4.25.4)
5964 | 
5965 |   buffer-equal-constant-time@1.0.1: {}
5966 | 
5967 |   busboy@1.6.0:
5968 |     dependencies:
5969 |       streamsearch: 1.1.0
5970 | 
5971 |   bytes@3.1.2: {}
5972 | 
5973 |   call-bind-apply-helpers@1.0.2:
5974 |     dependencies:
5975 |       es-errors: 1.3.0
5976 |       function-bind: 1.1.2
5977 | 
5978 |   call-bound@1.0.4:
5979 |     dependencies:
5980 |       call-bind-apply-helpers: 1.0.2
5981 |       get-intrinsic: 1.3.0
5982 | 
5983 |   camelcase-css@2.0.1: {}
5984 | 
5985 |   caniuse-lite@1.0.30001739: {}
5986 | 
5987 |   caseless@0.12.0: {}
5988 | 
5989 |   check-types@1.3.2: {}
5990 | 
5991 |   chokidar@3.6.0:
5992 |     dependencies:
5993 |       anymatch: 3.1.3
5994 |       braces: 3.0.3
5995 |       glob-parent: 5.1.2
5996 |       is-binary-path: 2.1.0
5997 |       is-glob: 4.0.3
5998 |       normalize-path: 3.0.0
5999 |       readdirp: 3.6.0
6000 |     optionalDependencies:
6001 |       fsevents: 2.3.3
6002 | 
6003 |   class-variance-authority@0.7.1:
6004 |     dependencies:
6005 |       clsx: 2.1.1
6006 | 
6007 |   client-only@0.0.1: {}
6008 | 
6009 |   cliui@8.0.1:
6010 |     dependencies:
6011 |       string-width: 4.2.3
6012 |       strip-ansi: 6.0.1
6013 |       wrap-ansi: 7.0.0
6014 | 
6015 |   clsx@2.1.1: {}
6016 | 
6017 |   cmdk@1.0.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1):
6018 |     dependencies:
6019 |       '@radix-ui/react-dialog': 1.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
6020 |       '@radix-ui/react-id': 1.1.1(@types/react@19.1.12)(react@19.1.1)
6021 |       '@radix-ui/react-primitive': 2.1.3(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
6022 |       react: 19.1.1
6023 |       react-dom: 19.1.1(react@19.1.1)
6024 |       use-sync-external-store: 1.5.0(react@19.1.1)
6025 |     transitivePeerDependencies:
6026 |       - '@types/react'
6027 |       - '@types/react-dom'
6028 | 
6029 |   color-convert@2.0.1:
6030 |     dependencies:
6031 |       color-name: 1.1.4
6032 | 
6033 |   color-name@1.1.4: {}
6034 | 
6035 |   color-string@1.9.1:
6036 |     dependencies:
6037 |       color-name: 1.1.4
6038 |       simple-swizzle: 0.2.2
6039 |     optional: true
6040 | 
6041 |   color@4.2.3:
6042 |     dependencies:
6043 |       color-convert: 2.0.1
6044 |       color-string: 1.9.1
6045 |     optional: true
6046 | 
6047 |   combined-stream@1.0.8:
6048 |     dependencies:
6049 |       delayed-stream: 1.0.0
6050 | 
6051 |   commander@4.1.1: {}
6052 | 
6053 |   content-disposition@0.5.4:
6054 |     dependencies:
6055 |       safe-buffer: 5.2.1
6056 | 
6057 |   content-type@1.0.5: {}
6058 | 
6059 |   cookie-signature@1.0.6: {}
6060 | 
6061 |   cookie@0.6.0: {}
6062 | 
6063 |   cookie@0.7.1: {}
6064 | 
6065 |   cookie@0.7.2: {}
6066 | 
6067 |   core-util-is@1.0.2: {}
6068 | 
6069 |   cors@2.8.5:
6070 |     dependencies:
6071 |       object-assign: 4.1.1
6072 |       vary: 1.1.2
6073 | 
6074 |   cross-spawn@7.0.6:
6075 |     dependencies:
6076 |       path-key: 3.1.1
6077 |       shebang-command: 2.0.0
6078 |       which: 2.0.2
6079 | 
6080 |   cssesc@3.0.0: {}
6081 | 
6082 |   csstype@3.1.3: {}
6083 | 
6084 |   d3-array@3.2.4:
6085 |     dependencies:
6086 |       internmap: 2.0.3
6087 | 
6088 |   d3-color@3.1.0: {}
6089 | 
6090 |   d3-ease@3.0.1: {}
6091 | 
6092 |   d3-format@3.1.0: {}
6093 | 
6094 |   d3-interpolate@3.0.1:
6095 |     dependencies:
6096 |       d3-color: 3.1.0
6097 | 
6098 |   d3-path@3.1.0: {}
6099 | 
6100 |   d3-scale@4.0.2:
6101 |     dependencies:
6102 |       d3-array: 3.2.4
6103 |       d3-format: 3.1.0
6104 |       d3-interpolate: 3.0.1
6105 |       d3-time: 3.1.0
6106 |       d3-time-format: 4.1.0
6107 | 
6108 |   d3-shape@3.2.0:
6109 |     dependencies:
6110 |       d3-path: 3.1.0
6111 | 
6112 |   d3-time-format@4.1.0:
6113 |     dependencies:
6114 |       d3-time: 3.1.0
6115 | 
6116 |   d3-time@3.1.0:
6117 |     dependencies:
6118 |       d3-array: 3.2.4
6119 | 
6120 |   d3-timer@3.0.1: {}
6121 | 
6122 |   dashdash@1.14.1:
6123 |     dependencies:
6124 |       assert-plus: 1.0.0
6125 | 
6126 |   data-uri-to-buffer@4.0.1: {}
6127 | 
6128 |   date-fns-jalali@4.1.0-0: {}
6129 | 
6130 |   date-fns@4.1.0: {}
6131 | 
6132 |   debug@2.6.9:
6133 |     dependencies:
6134 |       ms: 2.0.0
6135 | 
6136 |   debug@4.4.1:
6137 |     dependencies:
6138 |       ms: 2.1.3
6139 | 
6140 |   decimal.js-light@2.5.1: {}
6141 | 
6142 |   deepmerge@4.3.1: {}
6143 | 
6144 |   delayed-stream@1.0.0: {}
6145 | 
6146 |   depd@2.0.0: {}
6147 | 
6148 |   destroy@1.2.0: {}
6149 | 
6150 |   detect-libc@2.0.4:
6151 |     optional: true
6152 | 
6153 |   detect-node-es@1.1.0: {}
6154 | 
6155 |   devalue@5.3.2: {}
6156 | 
6157 |   didyoumean@1.2.2: {}
6158 | 
6159 |   dlv@1.1.3: {}
6160 | 
6161 |   dom-helpers@5.2.1:
6162 |     dependencies:
6163 |       '@babel/runtime': 7.28.3
6164 |       csstype: 3.1.3
6165 | 
6166 |   dunder-proto@1.0.1:
6167 |     dependencies:
6168 |       call-bind-apply-helpers: 1.0.2
6169 |       es-errors: 1.3.0
6170 |       gopd: 1.2.0
6171 | 
6172 |   duplexify@4.1.3:
6173 |     dependencies:
6174 |       end-of-stream: 1.4.5
6175 |       inherits: 2.0.4
6176 |       readable-stream: 3.6.2
6177 |       stream-shift: 1.0.3
6178 |     optional: true
6179 | 
6180 |   eastasianwidth@0.2.0: {}
6181 | 
6182 |   ecc-jsbn@0.1.2:
6183 |     dependencies:
6184 |       jsbn: 0.1.1
6185 |       safer-buffer: 2.1.2
6186 | 
6187 |   ecdsa-sig-formatter@1.0.11:
6188 |     dependencies:
6189 |       safe-buffer: 5.2.1
6190 | 
6191 |   ee-first@1.1.1: {}
6192 | 
6193 |   electron-to-chromium@1.5.212: {}
6194 | 
6195 |   embla-carousel-react@8.5.1(react@19.1.1):
6196 |     dependencies:
6197 |       embla-carousel: 8.5.1
6198 |       embla-carousel-reactive-utils: 8.5.1(embla-carousel@8.5.1)
6199 |       react: 19.1.1
6200 | 
6201 |   embla-carousel-reactive-utils@8.5.1(embla-carousel@8.5.1):
6202 |     dependencies:
6203 |       embla-carousel: 8.5.1
6204 | 
6205 |   embla-carousel@8.5.1: {}
6206 | 
6207 |   emoji-regex@8.0.0: {}
6208 | 
6209 |   emoji-regex@9.2.2: {}
6210 | 
6211 |   encodeurl@1.0.2: {}
6212 | 
6213 |   encodeurl@2.0.0: {}
6214 | 
6215 |   end-of-stream@1.4.5:
6216 |     dependencies:
6217 |       once: 1.4.0
6218 |     optional: true
6219 | 
6220 |   entities@4.5.0: {}
6221 | 
6222 |   es-define-property@1.0.1: {}
6223 | 
6224 |   es-errors@1.3.0: {}
6225 | 
6226 |   es-object-atoms@1.1.1:
6227 |     dependencies:
6228 |       es-errors: 1.3.0
6229 | 
6230 |   es-set-tostringtag@2.1.0:
6231 |     dependencies:
6232 |       es-errors: 1.3.0
6233 |       get-intrinsic: 1.3.0
6234 |       has-tostringtag: 1.0.2
6235 |       hasown: 2.0.2
6236 | 
6237 |   esbuild@0.25.9:
6238 |     optionalDependencies:
6239 |       '@esbuild/aix-ppc64': 0.25.9
6240 |       '@esbuild/android-arm': 0.25.9
6241 |       '@esbuild/android-arm64': 0.25.9
6242 |       '@esbuild/android-x64': 0.25.9
6243 |       '@esbuild/darwin-arm64': 0.25.9
6244 |       '@esbuild/darwin-x64': 0.25.9
6245 |       '@esbuild/freebsd-arm64': 0.25.9
6246 |       '@esbuild/freebsd-x64': 0.25.9
6247 |       '@esbuild/linux-arm': 0.25.9
6248 |       '@esbuild/linux-arm64': 0.25.9
6249 |       '@esbuild/linux-ia32': 0.25.9
6250 |       '@esbuild/linux-loong64': 0.25.9
6251 |       '@esbuild/linux-mips64el': 0.25.9
6252 |       '@esbuild/linux-ppc64': 0.25.9
6253 |       '@esbuild/linux-riscv64': 0.25.9
6254 |       '@esbuild/linux-s390x': 0.25.9
6255 |       '@esbuild/linux-x64': 0.25.9
6256 |       '@esbuild/netbsd-arm64': 0.25.9
6257 |       '@esbuild/netbsd-x64': 0.25.9
6258 |       '@esbuild/openbsd-arm64': 0.25.9
6259 |       '@esbuild/openbsd-x64': 0.25.9
6260 |       '@esbuild/openharmony-arm64': 0.25.9
6261 |       '@esbuild/sunos-x64': 0.25.9
6262 |       '@esbuild/win32-arm64': 0.25.9
6263 |       '@esbuild/win32-ia32': 0.25.9
6264 |       '@esbuild/win32-x64': 0.25.9
6265 | 
6266 |   escalade@3.2.0: {}
6267 | 
6268 |   escape-html@1.0.3: {}
6269 | 
6270 |   esm-env@1.2.2: {}
6271 | 
6272 |   esrap@2.1.0:
6273 |     dependencies:
6274 |       '@jridgewell/sourcemap-codec': 1.5.5
6275 | 
6276 |   estree-walker@2.0.2: {}
6277 | 
6278 |   etag@1.8.1: {}
6279 | 
6280 |   event-target-shim@5.0.1:
6281 |     optional: true
6282 | 
6283 |   eventemitter3@4.0.7: {}
6284 | 
6285 |   express@4.21.2:
6286 |     dependencies:
6287 |       accepts: 1.3.8
6288 |       array-flatten: 1.1.1
6289 |       body-parser: 1.20.3
6290 |       content-disposition: 0.5.4
6291 |       content-type: 1.0.5
6292 |       cookie: 0.7.1
6293 |       cookie-signature: 1.0.6
6294 |       debug: 2.6.9
6295 |       depd: 2.0.0
6296 |       encodeurl: 2.0.0
6297 |       escape-html: 1.0.3
6298 |       etag: 1.8.1
6299 |       finalhandler: 1.3.1
6300 |       fresh: 0.5.2
6301 |       http-errors: 2.0.0
6302 |       merge-descriptors: 1.0.3
6303 |       methods: 1.1.2
6304 |       on-finished: 2.4.1
6305 |       parseurl: 1.3.3
6306 |       path-to-regexp: 0.1.12
6307 |       proxy-addr: 2.0.7
6308 |       qs: 6.13.0
6309 |       range-parser: 1.2.1
6310 |       safe-buffer: 5.2.1
6311 |       send: 0.19.0
6312 |       serve-static: 1.16.2
6313 |       setprototypeof: 1.2.0
6314 |       statuses: 2.0.1
6315 |       type-is: 1.6.18
6316 |       utils-merge: 1.0.1
6317 |       vary: 1.1.2
6318 |     transitivePeerDependencies:
6319 |       - supports-color
6320 | 
6321 |   extend@3.0.2: {}
6322 | 
6323 |   extsprintf@1.3.0: {}
6324 | 
6325 |   farmhash-modern@1.1.0: {}
6326 | 
6327 |   fast-deep-equal@3.1.3: {}
6328 | 
6329 |   fast-equals@5.2.2: {}
6330 | 
6331 |   fast-glob@3.3.3:
6332 |     dependencies:
6333 |       '@nodelib/fs.stat': 2.0.5
6334 |       '@nodelib/fs.walk': 1.2.8
6335 |       glob-parent: 5.1.2
6336 |       merge2: 1.4.1
6337 |       micromatch: 4.0.8
6338 | 
6339 |   fast-json-stable-stringify@2.1.0: {}
6340 | 
6341 |   fast-xml-parser@4.5.3:
6342 |     dependencies:
6343 |       strnum: 1.1.2
6344 |     optional: true
6345 | 
6346 |   fastq@1.19.1:
6347 |     dependencies:
6348 |       reusify: 1.1.0
6349 | 
6350 |   faye-websocket@0.11.4:
6351 |     dependencies:
6352 |       websocket-driver: 0.7.4
6353 | 
6354 |   fdir@6.5.0(picomatch@4.0.3):
6355 |     optionalDependencies:
6356 |       picomatch: 4.0.3
6357 | 
6358 |   fetch-blob@3.2.0:
6359 |     dependencies:
6360 |       node-domexception: 1.0.0
6361 |       web-streams-polyfill: 3.3.3
6362 | 
6363 |   fill-range@7.1.1:
6364 |     dependencies:
6365 |       to-regex-range: 5.0.1
6366 | 
6367 |   finalhandler@1.3.1:
6368 |     dependencies:
6369 |       debug: 2.6.9
6370 |       encodeurl: 2.0.0
6371 |       escape-html: 1.0.3
6372 |       on-finished: 2.4.1
6373 |       parseurl: 1.3.3
6374 |       statuses: 2.0.1
6375 |       unpipe: 1.0.0
6376 |     transitivePeerDependencies:
6377 |       - supports-color
6378 | 
6379 |   firebase-admin@13.5.0:
6380 |     dependencies:
6381 |       '@fastify/busboy': 3.2.0
6382 |       '@firebase/database-compat': 2.1.0
6383 |       '@firebase/database-types': 1.0.16
6384 |       '@types/node': 22.18.0
6385 |       farmhash-modern: 1.1.0
6386 |       fast-deep-equal: 3.1.3
6387 |       google-auth-library: 9.15.1
6388 |       jsonwebtoken: 9.0.2
6389 |       jwks-rsa: 3.2.0
6390 |       node-forge: 1.3.1
6391 |       uuid: 11.1.0
6392 |     optionalDependencies:
6393 |       '@google-cloud/firestore': 7.11.3
6394 |       '@google-cloud/storage': 7.17.0
6395 |     transitivePeerDependencies:
6396 |       - encoding
6397 |       - supports-color
6398 | 
6399 |   firebase-functions@6.4.0(firebase-admin@13.5.0):
6400 |     dependencies:
6401 |       '@types/cors': 2.8.19
6402 |       '@types/express': 4.17.23
6403 |       cors: 2.8.5
6404 |       express: 4.21.2
6405 |       firebase-admin: 13.5.0
6406 |       protobufjs: 7.5.4
6407 |     transitivePeerDependencies:
6408 |       - supports-color
6409 | 
6410 |   firebase@12.2.1:
6411 |     dependencies:
6412 |       '@firebase/ai': 2.2.1(@firebase/app-types@0.9.3)(@firebase/app@0.14.2)
6413 |       '@firebase/analytics': 0.10.18(@firebase/app@0.14.2)
6414 |       '@firebase/analytics-compat': 0.2.24(@firebase/app-compat@0.5.2)(@firebase/app@0.14.2)
6415 |       '@firebase/app': 0.14.2
6416 |       '@firebase/app-check': 0.11.0(@firebase/app@0.14.2)
6417 |       '@firebase/app-check-compat': 0.4.0(@firebase/app-compat@0.5.2)(@firebase/app@0.14.2)
6418 |       '@firebase/app-compat': 0.5.2
6419 |       '@firebase/app-types': 0.9.3
6420 |       '@firebase/auth': 1.11.0(@firebase/app@0.14.2)
6421 |       '@firebase/auth-compat': 0.6.0(@firebase/app-compat@0.5.2)(@firebase/app-types@0.9.3)(@firebase/app@0.14.2)
6422 |       '@firebase/data-connect': 0.3.11(@firebase/app@0.14.2)
6423 |       '@firebase/database': 1.1.0
6424 |       '@firebase/database-compat': 2.1.0
6425 |       '@firebase/firestore': 4.9.1(@firebase/app@0.14.2)
6426 |       '@firebase/firestore-compat': 0.4.1(@firebase/app-compat@0.5.2)(@firebase/app-types@0.9.3)(@firebase/app@0.14.2)
6427 |       '@firebase/functions': 0.13.1(@firebase/app@0.14.2)
6428 |       '@firebase/functions-compat': 0.4.1(@firebase/app-compat@0.5.2)(@firebase/app@0.14.2)
6429 |       '@firebase/installations': 0.6.19(@firebase/app@0.14.2)
6430 |       '@firebase/installations-compat': 0.2.19(@firebase/app-compat@0.5.2)(@firebase/app-types@0.9.3)(@firebase/app@0.14.2)
6431 |       '@firebase/messaging': 0.12.23(@firebase/app@0.14.2)
6432 |       '@firebase/messaging-compat': 0.2.23(@firebase/app-compat@0.5.2)(@firebase/app@0.14.2)
6433 |       '@firebase/performance': 0.7.9(@firebase/app@0.14.2)
6434 |       '@firebase/performance-compat': 0.2.22(@firebase/app-compat@0.5.2)(@firebase/app@0.14.2)
6435 |       '@firebase/remote-config': 0.6.6(@firebase/app@0.14.2)
6436 |       '@firebase/remote-config-compat': 0.2.19(@firebase/app-compat@0.5.2)(@firebase/app@0.14.2)
6437 |       '@firebase/storage': 0.14.0(@firebase/app@0.14.2)
6438 |       '@firebase/storage-compat': 0.4.0(@firebase/app-compat@0.5.2)(@firebase/app-types@0.9.3)(@firebase/app@0.14.2)
6439 |       '@firebase/util': 1.13.0
6440 |     transitivePeerDependencies:
6441 |       - '@react-native-async-storage/async-storage'
6442 | 
6443 |   follow-redirects@1.15.11: {}
6444 | 
6445 |   foreground-child@3.3.1:
6446 |     dependencies:
6447 |       cross-spawn: 7.0.6
6448 |       signal-exit: 4.1.0
6449 | 
6450 |   forever-agent@0.6.1: {}
6451 | 
6452 |   form-data@2.3.3:
6453 |     dependencies:
6454 |       asynckit: 0.4.0
6455 |       combined-stream: 1.0.8
6456 |       mime-types: 2.1.35
6457 | 
6458 |   form-data@2.5.5:
6459 |     dependencies:
6460 |       asynckit: 0.4.0
6461 |       combined-stream: 1.0.8
6462 |       es-set-tostringtag: 2.1.0
6463 |       hasown: 2.0.2
6464 |       mime-types: 2.1.35
6465 |       safe-buffer: 5.2.1
6466 |     optional: true
6467 | 
6468 |   form-data@4.0.4:
6469 |     dependencies:
6470 |       asynckit: 0.4.0
6471 |       combined-stream: 1.0.8
6472 |       es-set-tostringtag: 2.1.0
6473 |       hasown: 2.0.2
6474 |       mime-types: 2.1.35
6475 | 
6476 |   formdata-polyfill@4.0.10:
6477 |     dependencies:
6478 |       fetch-blob: 3.2.0
6479 | 
6480 |   forwarded@0.2.0: {}
6481 | 
6482 |   fraction.js@4.3.7: {}
6483 | 
6484 |   fresh@0.5.2: {}
6485 | 
6486 |   fsevents@2.3.3:
6487 |     optional: true
6488 | 
6489 |   function-bind@1.1.2: {}
6490 | 
6491 |   functional-red-black-tree@1.0.1:
6492 |     optional: true
6493 | 
6494 |   gaxios@6.7.1:
6495 |     dependencies:
6496 |       extend: 3.0.2
6497 |       https-proxy-agent: 7.0.6
6498 |       is-stream: 2.0.1
6499 |       node-fetch: 2.7.0
6500 |       uuid: 9.0.1
6501 |     transitivePeerDependencies:
6502 |       - encoding
6503 |       - supports-color
6504 | 
6505 |   gaxios@7.1.1:
6506 |     dependencies:
6507 |       extend: 3.0.2
6508 |       https-proxy-agent: 7.0.6
6509 |       node-fetch: 3.3.2
6510 |     transitivePeerDependencies:
6511 |       - supports-color
6512 | 
6513 |   gcp-metadata@6.1.1:
6514 |     dependencies:
6515 |       gaxios: 6.7.1
6516 |       google-logging-utils: 0.0.2
6517 |       json-bigint: 1.0.0
6518 |     transitivePeerDependencies:
6519 |       - encoding
6520 |       - supports-color
6521 | 
6522 |   gcp-metadata@7.0.1:
6523 |     dependencies:
6524 |       gaxios: 7.1.1
6525 |       google-logging-utils: 1.1.1
6526 |       json-bigint: 1.0.0
6527 |     transitivePeerDependencies:
6528 |       - supports-color
6529 | 
6530 |   geist@1.4.2(next@15.2.4(@opentelemetry/api@1.9.0)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)):
6531 |     dependencies:
6532 |       next: 15.2.4(@opentelemetry/api@1.9.0)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
6533 | 
6534 |   geofire-common@6.0.0: {}
6535 | 
6536 |   get-caller-file@2.0.5: {}
6537 | 
6538 |   get-intrinsic@1.3.0:
6539 |     dependencies:
6540 |       call-bind-apply-helpers: 1.0.2
6541 |       es-define-property: 1.0.1
6542 |       es-errors: 1.3.0
6543 |       es-object-atoms: 1.1.1
6544 |       function-bind: 1.1.2
6545 |       get-proto: 1.0.1
6546 |       gopd: 1.2.0
6547 |       has-symbols: 1.1.0
6548 |       hasown: 2.0.2
6549 |       math-intrinsics: 1.1.0
6550 | 
6551 |   get-nonce@1.0.1: {}
6552 | 
6553 |   get-proto@1.0.1:
6554 |     dependencies:
6555 |       dunder-proto: 1.0.1
6556 |       es-object-atoms: 1.1.1
6557 | 
6558 |   getpass@0.1.7:
6559 |     dependencies:
6560 |       assert-plus: 1.0.0
6561 | 
6562 |   glob-parent@5.1.2:
6563 |     dependencies:
6564 |       is-glob: 4.0.3
6565 | 
6566 |   glob-parent@6.0.2:
6567 |     dependencies:
6568 |       is-glob: 4.0.3
6569 | 
6570 |   glob@10.4.5:
6571 |     dependencies:
6572 |       foreground-child: 3.3.1
6573 |       jackspeak: 3.4.3
6574 |       minimatch: 9.0.5
6575 |       minipass: 7.1.2
6576 |       package-json-from-dist: 1.0.1
6577 |       path-scurry: 1.11.1
6578 | 
6579 |   google-auth-library@10.3.0:
6580 |     dependencies:
6581 |       base64-js: 1.5.1
6582 |       ecdsa-sig-formatter: 1.0.11
6583 |       gaxios: 7.1.1
6584 |       gcp-metadata: 7.0.1
6585 |       google-logging-utils: 1.1.1
6586 |       gtoken: 8.0.0
6587 |       jws: 4.0.0
6588 |     transitivePeerDependencies:
6589 |       - supports-color
6590 | 
6591 |   google-auth-library@9.15.1:
6592 |     dependencies:
6593 |       base64-js: 1.5.1
6594 |       ecdsa-sig-formatter: 1.0.11
6595 |       gaxios: 6.7.1
6596 |       gcp-metadata: 6.1.1
6597 |       gtoken: 7.1.0
6598 |       jws: 4.0.0
6599 |     transitivePeerDependencies:
6600 |       - encoding
6601 |       - supports-color
6602 | 
6603 |   google-gax@4.6.1:
6604 |     dependencies:
6605 |       '@grpc/grpc-js': 1.13.4
6606 |       '@grpc/proto-loader': 0.7.15
6607 |       '@types/long': 4.0.2
6608 |       abort-controller: 3.0.0
6609 |       duplexify: 4.1.3
6610 |       google-auth-library: 9.15.1
6611 |       node-fetch: 2.7.0
6612 |       object-hash: 3.0.0
6613 |       proto3-json-serializer: 2.0.2
6614 |       protobufjs: 7.5.4
6615 |       retry-request: 7.0.2
6616 |       uuid: 9.0.1
6617 |     transitivePeerDependencies:
6618 |       - encoding
6619 |       - supports-color
6620 |     optional: true
6621 | 
6622 |   google-logging-utils@0.0.2: {}
6623 | 
6624 |   google-logging-utils@1.1.1: {}
6625 | 
6626 |   googlemaps@1.12.0:
6627 |     dependencies:
6628 |       check-types: 1.3.2
6629 |       qs: 4.0.0
6630 |       request: 2.88.2
6631 |       waitress: 0.1.5
6632 | 
6633 |   gopd@1.2.0: {}
6634 | 
6635 |   gtoken@7.1.0:
6636 |     dependencies:
6637 |       gaxios: 6.7.1
6638 |       jws: 4.0.0
6639 |     transitivePeerDependencies:
6640 |       - encoding
6641 |       - supports-color
6642 | 
6643 |   gtoken@8.0.0:
6644 |     dependencies:
6645 |       gaxios: 7.1.1
6646 |       jws: 4.0.0
6647 |     transitivePeerDependencies:
6648 |       - supports-color
6649 | 
6650 |   har-schema@2.0.0: {}
6651 | 
6652 |   har-validator@5.1.5:
6653 |     dependencies:
6654 |       ajv: 6.12.6
6655 |       har-schema: 2.0.0
6656 | 
6657 |   has-symbols@1.1.0: {}
6658 | 
6659 |   has-tostringtag@1.0.2:
6660 |     dependencies:
6661 |       has-symbols: 1.1.0
6662 | 
6663 |   hasown@2.0.2:
6664 |     dependencies:
6665 |       function-bind: 1.1.2
6666 | 
6667 |   html-entities@2.6.0:
6668 |     optional: true
6669 | 
6670 |   http-errors@2.0.0:
6671 |     dependencies:
6672 |       depd: 2.0.0
6673 |       inherits: 2.0.4
6674 |       setprototypeof: 1.2.0
6675 |       statuses: 2.0.1
6676 |       toidentifier: 1.0.1
6677 | 
6678 |   http-parser-js@0.5.10: {}
6679 | 
6680 |   http-proxy-agent@5.0.0:
6681 |     dependencies:
6682 |       '@tootallnate/once': 2.0.0
6683 |       agent-base: 6.0.2
6684 |       debug: 4.4.1
6685 |     transitivePeerDependencies:
6686 |       - supports-color
6687 |     optional: true
6688 | 
6689 |   http-signature@1.2.0:
6690 |     dependencies:
6691 |       assert-plus: 1.0.0
6692 |       jsprim: 1.4.2
6693 |       sshpk: 1.18.0
6694 | 
6695 |   https-proxy-agent@5.0.1:
6696 |     dependencies:
6697 |       agent-base: 6.0.2
6698 |       debug: 4.4.1
6699 |     transitivePeerDependencies:
6700 |       - supports-color
6701 |     optional: true
6702 | 
6703 |   https-proxy-agent@7.0.6:
6704 |     dependencies:
6705 |       agent-base: 7.1.4
6706 |       debug: 4.4.1
6707 |     transitivePeerDependencies:
6708 |       - supports-color
6709 | 
6710 |   iconv-lite@0.4.24:
6711 |     dependencies:
6712 |       safer-buffer: 2.1.2
6713 | 
6714 |   idb@7.1.1: {}
6715 | 
6716 |   inherits@2.0.4: {}
6717 | 
6718 |   input-otp@1.4.1(react-dom@19.1.1(react@19.1.1))(react@19.1.1):
6719 |     dependencies:
6720 |       react: 19.1.1
6721 |       react-dom: 19.1.1(react@19.1.1)
6722 | 
6723 |   internmap@2.0.3: {}
6724 | 
6725 |   ipaddr.js@1.9.1: {}
6726 | 
6727 |   is-arrayish@0.3.2:
6728 |     optional: true
6729 | 
6730 |   is-binary-path@2.1.0:
6731 |     dependencies:
6732 |       binary-extensions: 2.3.0
6733 | 
6734 |   is-core-module@2.16.1:
6735 |     dependencies:
6736 |       hasown: 2.0.2
6737 | 
6738 |   is-extglob@2.1.1: {}
6739 | 
6740 |   is-fullwidth-code-point@3.0.0: {}
6741 | 
6742 |   is-glob@4.0.3:
6743 |     dependencies:
6744 |       is-extglob: 2.1.1
6745 | 
6746 |   is-number@7.0.0: {}
6747 | 
6748 |   is-reference@3.0.3:
6749 |     dependencies:
6750 |       '@types/estree': 1.0.8
6751 | 
6752 |   is-stream@2.0.1: {}
6753 | 
6754 |   is-typedarray@1.0.0: {}
6755 | 
6756 |   isexe@2.0.0: {}
6757 | 
6758 |   isstream@0.1.2: {}
6759 | 
6760 |   jackspeak@3.4.3:
6761 |     dependencies:
6762 |       '@isaacs/cliui': 8.0.2
6763 |     optionalDependencies:
6764 |       '@pkgjs/parseargs': 0.11.0
6765 | 
6766 |   jiti@1.21.7: {}
6767 | 
6768 |   jose@4.15.9: {}
6769 | 
6770 |   js-tokens@4.0.0: {}
6771 | 
6772 |   jsbn@0.1.1: {}
6773 | 
6774 |   json-bigint@1.0.0:
6775 |     dependencies:
6776 |       bignumber.js: 9.3.1
6777 | 
6778 |   json-schema-traverse@0.4.1: {}
6779 | 
6780 |   json-schema@0.4.0: {}
6781 | 
6782 |   json-stringify-safe@5.0.1: {}
6783 | 
6784 |   jsonwebtoken@9.0.2:
6785 |     dependencies:
6786 |       jws: 3.2.2
6787 |       lodash.includes: 4.3.0
6788 |       lodash.isboolean: 3.0.3
6789 |       lodash.isinteger: 4.0.4
6790 |       lodash.isnumber: 3.0.3
6791 |       lodash.isplainobject: 4.0.6
6792 |       lodash.isstring: 4.0.1
6793 |       lodash.once: 4.1.1
6794 |       ms: 2.1.3
6795 |       semver: 7.7.2
6796 | 
6797 |   jsprim@1.4.2:
6798 |     dependencies:
6799 |       assert-plus: 1.0.0
6800 |       extsprintf: 1.3.0
6801 |       json-schema: 0.4.0
6802 |       verror: 1.10.0
6803 | 
6804 |   jwa@1.4.2:
6805 |     dependencies:
6806 |       buffer-equal-constant-time: 1.0.1
6807 |       ecdsa-sig-formatter: 1.0.11
6808 |       safe-buffer: 5.2.1
6809 | 
6810 |   jwa@2.0.1:
6811 |     dependencies:
6812 |       buffer-equal-constant-time: 1.0.1
6813 |       ecdsa-sig-formatter: 1.0.11
6814 |       safe-buffer: 5.2.1
6815 | 
6816 |   jwks-rsa@3.2.0:
6817 |     dependencies:
6818 |       '@types/express': 4.17.23
6819 |       '@types/jsonwebtoken': 9.0.10
6820 |       debug: 4.4.1
6821 |       jose: 4.15.9
6822 |       limiter: 1.1.5
6823 |       lru-memoizer: 2.3.0
6824 |     transitivePeerDependencies:
6825 |       - supports-color
6826 | 
6827 |   jws@3.2.2:
6828 |     dependencies:
6829 |       jwa: 1.4.2
6830 |       safe-buffer: 5.2.1
6831 | 
6832 |   jws@4.0.0:
6833 |     dependencies:
6834 |       jwa: 2.0.1
6835 |       safe-buffer: 5.2.1
6836 | 
6837 |   kleur@4.1.5: {}
6838 | 
6839 |   lilconfig@3.1.3: {}
6840 | 
6841 |   limiter@1.1.5: {}
6842 | 
6843 |   lines-and-columns@1.2.4: {}
6844 | 
6845 |   locate-character@3.0.0: {}
6846 | 
6847 |   lodash.camelcase@4.3.0: {}
6848 | 
6849 |   lodash.clonedeep@4.5.0: {}
6850 | 
6851 |   lodash.includes@4.3.0: {}
6852 | 
6853 |   lodash.isboolean@3.0.3: {}
6854 | 
6855 |   lodash.isinteger@4.0.4: {}
6856 | 
6857 |   lodash.isnumber@3.0.3: {}
6858 | 
6859 |   lodash.isplainobject@4.0.6: {}
6860 | 
6861 |   lodash.isstring@4.0.1: {}
6862 | 
6863 |   lodash.once@4.1.1: {}
6864 | 
6865 |   lodash@4.17.21: {}
6866 | 
6867 |   long@5.3.2: {}
6868 | 
6869 |   loose-envify@1.4.0:
6870 |     dependencies:
6871 |       js-tokens: 4.0.0
6872 | 
6873 |   lru-cache@10.4.3: {}
6874 | 
6875 |   lru-cache@6.0.0:
6876 |     dependencies:
6877 |       yallist: 4.0.0
6878 | 
6879 |   lru-memoizer@2.3.0:
6880 |     dependencies:
6881 |       lodash.clonedeep: 4.5.0
6882 |       lru-cache: 6.0.0
6883 | 
6884 |   lucide-react@0.454.0(react@19.1.1):
6885 |     dependencies:
6886 |       react: 19.1.1
6887 | 
6888 |   magic-string@0.30.18:
6889 |     dependencies:
6890 |       '@jridgewell/sourcemap-codec': 1.5.5
6891 | 
6892 |   math-intrinsics@1.1.0: {}
6893 | 
6894 |   media-typer@0.3.0: {}
6895 | 
6896 |   merge-descriptors@1.0.3: {}
6897 | 
6898 |   merge2@1.4.1: {}
6899 | 
6900 |   methods@1.1.2: {}
6901 | 
6902 |   micromatch@4.0.8:
6903 |     dependencies:
6904 |       braces: 3.0.3
6905 |       picomatch: 2.3.1
6906 | 
6907 |   mime-db@1.52.0: {}
6908 | 
6909 |   mime-types@2.1.35:
6910 |     dependencies:
6911 |       mime-db: 1.52.0
6912 | 
6913 |   mime@1.6.0: {}
6914 | 
6915 |   mime@3.0.0:
6916 |     optional: true
6917 | 
6918 |   minimatch@9.0.5:
6919 |     dependencies:
6920 |       brace-expansion: 2.0.2
6921 | 
6922 |   minipass@7.1.2: {}
6923 | 
6924 |   mri@1.2.0: {}
6925 | 
6926 |   mrmime@2.0.1: {}
6927 | 
6928 |   ms@2.0.0: {}
6929 | 
6930 |   ms@2.1.3: {}
6931 | 
6932 |   mz@2.7.0:
6933 |     dependencies:
6934 |       any-promise: 1.3.0
6935 |       object-assign: 4.1.1
6936 |       thenify-all: 1.6.0
6937 | 
6938 |   nanoid@3.3.11: {}
6939 | 
6940 |   negotiator@0.6.3: {}
6941 | 
6942 |   next-themes@0.4.6(react-dom@19.1.1(react@19.1.1))(react@19.1.1):
6943 |     dependencies:
6944 |       react: 19.1.1
6945 |       react-dom: 19.1.1(react@19.1.1)
6946 | 
6947 |   next@15.2.4(@opentelemetry/api@1.9.0)(react-dom@19.1.1(react@19.1.1))(react@19.1.1):
6948 |     dependencies:
6949 |       '@next/env': 15.2.4
6950 |       '@swc/counter': 0.1.3
6951 |       '@swc/helpers': 0.5.15
6952 |       busboy: 1.6.0
6953 |       caniuse-lite: 1.0.30001739
6954 |       postcss: 8.4.31
6955 |       react: 19.1.1
6956 |       react-dom: 19.1.1(react@19.1.1)
6957 |       styled-jsx: 5.1.6(react@19.1.1)
6958 |     optionalDependencies:
6959 |       '@next/swc-darwin-arm64': 15.2.4
6960 |       '@next/swc-darwin-x64': 15.2.4
6961 |       '@next/swc-linux-arm64-gnu': 15.2.4
6962 |       '@next/swc-linux-arm64-musl': 15.2.4
6963 |       '@next/swc-linux-x64-gnu': 15.2.4
6964 |       '@next/swc-linux-x64-musl': 15.2.4
6965 |       '@next/swc-win32-arm64-msvc': 15.2.4
6966 |       '@next/swc-win32-x64-msvc': 15.2.4
6967 |       '@opentelemetry/api': 1.9.0
6968 |       sharp: 0.33.5
6969 |     transitivePeerDependencies:
6970 |       - '@babel/core'
6971 |       - babel-plugin-macros
6972 | 
6973 |   node-domexception@1.0.0: {}
6974 | 
6975 |   node-fetch@2.7.0:
6976 |     dependencies:
6977 |       whatwg-url: 5.0.0
6978 | 
6979 |   node-fetch@3.3.2:
6980 |     dependencies:
6981 |       data-uri-to-buffer: 4.0.1
6982 |       fetch-blob: 3.2.0
6983 |       formdata-polyfill: 4.0.10
6984 | 
6985 |   node-forge@1.3.1: {}
6986 | 
6987 |   node-releases@2.0.19: {}
6988 | 
6989 |   normalize-path@3.0.0: {}
6990 | 
6991 |   normalize-range@0.1.2: {}
6992 | 
6993 |   oauth-sign@0.9.0: {}
6994 | 
6995 |   object-assign@4.1.1: {}
6996 | 
6997 |   object-hash@3.0.0: {}
6998 | 
6999 |   object-inspect@1.13.4: {}
7000 | 
7001 |   on-finished@2.4.1:
7002 |     dependencies:
7003 |       ee-first: 1.1.1
7004 | 
7005 |   once@1.4.0:
7006 |     dependencies:
7007 |       wrappy: 1.0.2
7008 |     optional: true
7009 | 
7010 |   p-limit@3.1.0:
7011 |     dependencies:
7012 |       yocto-queue: 0.1.0
7013 |     optional: true
7014 | 
7015 |   package-json-from-dist@1.0.1: {}
7016 | 
7017 |   parseurl@1.3.3: {}
7018 | 
7019 |   path-key@3.1.1: {}
7020 | 
7021 |   path-parse@1.0.7: {}
7022 | 
7023 |   path-scurry@1.11.1:
7024 |     dependencies:
7025 |       lru-cache: 10.4.3
7026 |       minipass: 7.1.2
7027 | 
7028 |   path-to-regexp@0.1.12: {}
7029 | 
7030 |   performance-now@2.1.0: {}
7031 | 
7032 |   picocolors@1.1.1: {}
7033 | 
7034 |   picomatch@2.3.1: {}
7035 | 
7036 |   picomatch@4.0.3: {}
7037 | 
7038 |   pify@2.3.0: {}
7039 | 
7040 |   pirates@4.0.7: {}
7041 | 
7042 |   postcss-import@15.1.0(postcss@8.5.6):
7043 |     dependencies:
7044 |       postcss: 8.5.6
7045 |       postcss-value-parser: 4.2.0
7046 |       read-cache: 1.0.0
7047 |       resolve: 1.22.10
7048 | 
7049 |   postcss-js@4.0.1(postcss@8.5.6):
7050 |     dependencies:
7051 |       camelcase-css: 2.0.1
7052 |       postcss: 8.5.6
7053 | 
7054 |   postcss-load-config@4.0.2(postcss@8.5.6):
7055 |     dependencies:
7056 |       lilconfig: 3.1.3
7057 |       yaml: 2.8.1
7058 |     optionalDependencies:
7059 |       postcss: 8.5.6
7060 | 
7061 |   postcss-nested@6.2.0(postcss@8.5.6):
7062 |     dependencies:
7063 |       postcss: 8.5.6
7064 |       postcss-selector-parser: 6.1.2
7065 | 
7066 |   postcss-selector-parser@6.1.2:
7067 |     dependencies:
7068 |       cssesc: 3.0.0
7069 |       util-deprecate: 1.0.2
7070 | 
7071 |   postcss-value-parser@4.2.0: {}
7072 | 
7073 |   postcss@8.4.31:
7074 |     dependencies:
7075 |       nanoid: 3.3.11
7076 |       picocolors: 1.1.1
7077 |       source-map-js: 1.2.1
7078 | 
7079 |   postcss@8.5.6:
7080 |     dependencies:
7081 |       nanoid: 3.3.11
7082 |       picocolors: 1.1.1
7083 |       source-map-js: 1.2.1
7084 | 
7085 |   prop-types@15.8.1:
7086 |     dependencies:
7087 |       loose-envify: 1.4.0
7088 |       object-assign: 4.1.1
7089 |       react-is: 16.13.1
7090 | 
7091 |   proto3-json-serializer@2.0.2:
7092 |     dependencies:
7093 |       protobufjs: 7.5.4
7094 |     optional: true
7095 | 
7096 |   protobufjs@7.5.4:
7097 |     dependencies:
7098 |       '@protobufjs/aspromise': 1.1.2
7099 |       '@protobufjs/base64': 1.1.2
7100 |       '@protobufjs/codegen': 2.0.4
7101 |       '@protobufjs/eventemitter': 1.1.0
7102 |       '@protobufjs/fetch': 1.1.0
7103 |       '@protobufjs/float': 1.0.2
7104 |       '@protobufjs/inquire': 1.1.0
7105 |       '@protobufjs/path': 1.1.2
7106 |       '@protobufjs/pool': 1.1.0
7107 |       '@protobufjs/utf8': 1.1.0
7108 |       '@types/node': 22.18.0
7109 |       long: 5.3.2
7110 | 
7111 |   proxy-addr@2.0.7:
7112 |     dependencies:
7113 |       forwarded: 0.2.0
7114 |       ipaddr.js: 1.9.1
7115 | 
7116 |   proxy-from-env@1.1.0: {}
7117 | 
7118 |   psl@1.15.0:
7119 |     dependencies:
7120 |       punycode: 2.3.1
7121 | 
7122 |   punycode@2.3.1: {}
7123 | 
7124 |   qs@4.0.0: {}
7125 | 
7126 |   qs@6.13.0:
7127 |     dependencies:
7128 |       side-channel: 1.1.0
7129 | 
7130 |   qs@6.5.3: {}
7131 | 
7132 |   queue-microtask@1.2.3: {}
7133 | 
7134 |   range-parser@1.2.1: {}
7135 | 
7136 |   raw-body@2.5.2:
7137 |     dependencies:
7138 |       bytes: 3.1.2
7139 |       http-errors: 2.0.0
7140 |       iconv-lite: 0.4.24
7141 |       unpipe: 1.0.0
7142 | 
7143 |   react-day-picker@9.9.0(react@19.1.1):
7144 |     dependencies:
7145 |       '@date-fns/tz': 1.4.1
7146 |       date-fns: 4.1.0
7147 |       date-fns-jalali: 4.1.0-0
7148 |       react: 19.1.1
7149 | 
7150 |   react-dom@19.1.1(react@19.1.1):
7151 |     dependencies:
7152 |       react: 19.1.1
7153 |       scheduler: 0.26.0
7154 | 
7155 |   react-hook-form@7.62.0(react@19.1.1):
7156 |     dependencies:
7157 |       react: 19.1.1
7158 | 
7159 |   react-is@16.13.1: {}
7160 | 
7161 |   react-is@18.3.1: {}
7162 | 
7163 |   react-remove-scroll-bar@2.3.8(@types/react@19.1.12)(react@19.1.1):
7164 |     dependencies:
7165 |       react: 19.1.1
7166 |       react-style-singleton: 2.2.3(@types/react@19.1.12)(react@19.1.1)
7167 |       tslib: 2.8.1
7168 |     optionalDependencies:
7169 |       '@types/react': 19.1.12
7170 | 
7171 |   react-remove-scroll@2.7.1(@types/react@19.1.12)(react@19.1.1):
7172 |     dependencies:
7173 |       react: 19.1.1
7174 |       react-remove-scroll-bar: 2.3.8(@types/react@19.1.12)(react@19.1.1)
7175 |       react-style-singleton: 2.2.3(@types/react@19.1.12)(react@19.1.1)
7176 |       tslib: 2.8.1
7177 |       use-callback-ref: 1.3.3(@types/react@19.1.12)(react@19.1.1)
7178 |       use-sidecar: 1.1.3(@types/react@19.1.12)(react@19.1.1)
7179 |     optionalDependencies:
7180 |       '@types/react': 19.1.12
7181 | 
7182 |   react-resizable-panels@2.1.9(react-dom@19.1.1(react@19.1.1))(react@19.1.1):
7183 |     dependencies:
7184 |       react: 19.1.1
7185 |       react-dom: 19.1.1(react@19.1.1)
7186 | 
7187 |   react-router-dom@6.30.0(react-dom@19.1.1(react@19.1.1))(react@19.1.1):
7188 |     dependencies:
7189 |       '@remix-run/router': 1.23.0
7190 |       react: 19.1.1
7191 |       react-dom: 19.1.1(react@19.1.1)
7192 |       react-router: 6.30.0(react@19.1.1)
7193 | 
7194 |   react-router@6.30.0(react@19.1.1):
7195 |     dependencies:
7196 |       '@remix-run/router': 1.23.0
7197 |       react: 19.1.1
7198 | 
7199 |   react-smooth@4.0.4(react-dom@19.1.1(react@19.1.1))(react@19.1.1):
7200 |     dependencies:
7201 |       fast-equals: 5.2.2
7202 |       prop-types: 15.8.1
7203 |       react: 19.1.1
7204 |       react-dom: 19.1.1(react@19.1.1)
7205 |       react-transition-group: 4.4.5(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
7206 | 
7207 |   react-style-singleton@2.2.3(@types/react@19.1.12)(react@19.1.1):
7208 |     dependencies:
7209 |       get-nonce: 1.0.1
7210 |       react: 19.1.1
7211 |       tslib: 2.8.1
7212 |     optionalDependencies:
7213 |       '@types/react': 19.1.12
7214 | 
7215 |   react-transition-group@4.4.5(react-dom@19.1.1(react@19.1.1))(react@19.1.1):
7216 |     dependencies:
7217 |       '@babel/runtime': 7.28.3
7218 |       dom-helpers: 5.2.1
7219 |       loose-envify: 1.4.0
7220 |       prop-types: 15.8.1
7221 |       react: 19.1.1
7222 |       react-dom: 19.1.1(react@19.1.1)
7223 | 
7224 |   react@19.1.1: {}
7225 | 
7226 |   read-cache@1.0.0:
7227 |     dependencies:
7228 |       pify: 2.3.0
7229 | 
7230 |   readable-stream@3.6.2:
7231 |     dependencies:
7232 |       inherits: 2.0.4
7233 |       string_decoder: 1.3.0
7234 |       util-deprecate: 1.0.2
7235 |     optional: true
7236 | 
7237 |   readdirp@3.6.0:
7238 |     dependencies:
7239 |       picomatch: 2.3.1
7240 | 
7241 |   recharts-scale@0.4.5:
7242 |     dependencies:
7243 |       decimal.js-light: 2.5.1
7244 | 
7245 |   recharts@2.15.0(react-dom@19.1.1(react@19.1.1))(react@19.1.1):
7246 |     dependencies:
7247 |       clsx: 2.1.1
7248 |       eventemitter3: 4.0.7
7249 |       lodash: 4.17.21
7250 |       react: 19.1.1
7251 |       react-dom: 19.1.1(react@19.1.1)
7252 |       react-is: 18.3.1
7253 |       react-smooth: 4.0.4(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
7254 |       recharts-scale: 0.4.5
7255 |       tiny-invariant: 1.3.3
7256 |       victory-vendor: 36.9.2
7257 | 
7258 |   request@2.88.2:
7259 |     dependencies:
7260 |       aws-sign2: 0.7.0
7261 |       aws4: 1.13.2
7262 |       caseless: 0.12.0
7263 |       combined-stream: 1.0.8
7264 |       extend: 3.0.2
7265 |       forever-agent: 0.6.1
7266 |       form-data: 2.3.3
7267 |       har-validator: 5.1.5
7268 |       http-signature: 1.2.0
7269 |       is-typedarray: 1.0.0
7270 |       isstream: 0.1.2
7271 |       json-stringify-safe: 5.0.1
7272 |       mime-types: 2.1.35
7273 |       oauth-sign: 0.9.0
7274 |       performance-now: 2.1.0
7275 |       qs: 6.5.3
7276 |       safe-buffer: 5.2.1
7277 |       tough-cookie: 2.5.0
7278 |       tunnel-agent: 0.6.0
7279 |       uuid: 3.4.0
7280 | 
7281 |   require-directory@2.1.1: {}
7282 | 
7283 |   resolve@1.22.10:
7284 |     dependencies:
7285 |       is-core-module: 2.16.1
7286 |       path-parse: 1.0.7
7287 |       supports-preserve-symlinks-flag: 1.0.0
7288 | 
7289 |   retry-request@7.0.2:
7290 |     dependencies:
7291 |       '@types/request': 2.48.13
7292 |       extend: 3.0.2
7293 |       teeny-request: 9.0.0
7294 |     transitivePeerDependencies:
7295 |       - encoding
7296 |       - supports-color
7297 |     optional: true
7298 | 
7299 |   retry@0.13.1:
7300 |     optional: true
7301 | 
7302 |   reusify@1.1.0: {}
7303 | 
7304 |   rollup@4.50.0:
7305 |     dependencies:
7306 |       '@types/estree': 1.0.8
7307 |     optionalDependencies:
7308 |       '@rollup/rollup-android-arm-eabi': 4.50.0
7309 |       '@rollup/rollup-android-arm64': 4.50.0
7310 |       '@rollup/rollup-darwin-arm64': 4.50.0
7311 |       '@rollup/rollup-darwin-x64': 4.50.0
7312 |       '@rollup/rollup-freebsd-arm64': 4.50.0
7313 |       '@rollup/rollup-freebsd-x64': 4.50.0
7314 |       '@rollup/rollup-linux-arm-gnueabihf': 4.50.0
7315 |       '@rollup/rollup-linux-arm-musleabihf': 4.50.0
7316 |       '@rollup/rollup-linux-arm64-gnu': 4.50.0
7317 |       '@rollup/rollup-linux-arm64-musl': 4.50.0
7318 |       '@rollup/rollup-linux-loongarch64-gnu': 4.50.0
7319 |       '@rollup/rollup-linux-ppc64-gnu': 4.50.0
7320 |       '@rollup/rollup-linux-riscv64-gnu': 4.50.0
7321 |       '@rollup/rollup-linux-riscv64-musl': 4.50.0
7322 |       '@rollup/rollup-linux-s390x-gnu': 4.50.0
7323 |       '@rollup/rollup-linux-x64-gnu': 4.50.0
7324 |       '@rollup/rollup-linux-x64-musl': 4.50.0
7325 |       '@rollup/rollup-openharmony-arm64': 4.50.0
7326 |       '@rollup/rollup-win32-arm64-msvc': 4.50.0
7327 |       '@rollup/rollup-win32-ia32-msvc': 4.50.0
7328 |       '@rollup/rollup-win32-x64-msvc': 4.50.0
7329 |       fsevents: 2.3.3
7330 | 
7331 |   run-parallel@1.2.0:
7332 |     dependencies:
7333 |       queue-microtask: 1.2.3
7334 | 
7335 |   sade@1.8.1:
7336 |     dependencies:
7337 |       mri: 1.2.0
7338 | 
7339 |   safe-buffer@5.2.1: {}
7340 | 
7341 |   safer-buffer@2.1.2: {}
7342 | 
7343 |   scheduler@0.26.0: {}
7344 | 
7345 |   semver@7.7.2: {}
7346 | 
7347 |   send@0.19.0:
7348 |     dependencies:
7349 |       debug: 2.6.9
7350 |       depd: 2.0.0
7351 |       destroy: 1.2.0
7352 |       encodeurl: 1.0.2
7353 |       escape-html: 1.0.3
7354 |       etag: 1.8.1
7355 |       fresh: 0.5.2
7356 |       http-errors: 2.0.0
7357 |       mime: 1.6.0
7358 |       ms: 2.1.3
7359 |       on-finished: 2.4.1
7360 |       range-parser: 1.2.1
7361 |       statuses: 2.0.1
7362 |     transitivePeerDependencies:
7363 |       - supports-color
7364 | 
7365 |   serve-static@1.16.2:
7366 |     dependencies:
7367 |       encodeurl: 2.0.0
7368 |       escape-html: 1.0.3
7369 |       parseurl: 1.3.3
7370 |       send: 0.19.0
7371 |     transitivePeerDependencies:
7372 |       - supports-color
7373 | 
7374 |   server-only@0.0.1: {}
7375 | 
7376 |   set-cookie-parser@2.7.1: {}
7377 | 
7378 |   setprototypeof@1.2.0: {}
7379 | 
7380 |   sharp@0.33.5:
7381 |     dependencies:
7382 |       color: 4.2.3
7383 |       detect-libc: 2.0.4
7384 |       semver: 7.7.2
7385 |     optionalDependencies:
7386 |       '@img/sharp-darwin-arm64': 0.33.5
7387 |       '@img/sharp-darwin-x64': 0.33.5
7388 |       '@img/sharp-libvips-darwin-arm64': 1.0.4
7389 |       '@img/sharp-libvips-darwin-x64': 1.0.4
7390 |       '@img/sharp-libvips-linux-arm': 1.0.5
7391 |       '@img/sharp-libvips-linux-arm64': 1.0.4
7392 |       '@img/sharp-libvips-linux-s390x': 1.0.4
7393 |       '@img/sharp-libvips-linux-x64': 1.0.4
7394 |       '@img/sharp-libvips-linuxmusl-arm64': 1.0.4
7395 |       '@img/sharp-libvips-linuxmusl-x64': 1.0.4
7396 |       '@img/sharp-linux-arm': 0.33.5
7397 |       '@img/sharp-linux-arm64': 0.33.5
7398 |       '@img/sharp-linux-s390x': 0.33.5
7399 |       '@img/sharp-linux-x64': 0.33.5
7400 |       '@img/sharp-linuxmusl-arm64': 0.33.5
7401 |       '@img/sharp-linuxmusl-x64': 0.33.5
7402 |       '@img/sharp-wasm32': 0.33.5
7403 |       '@img/sharp-win32-ia32': 0.33.5
7404 |       '@img/sharp-win32-x64': 0.33.5
7405 |     optional: true
7406 | 
7407 |   shebang-command@2.0.0:
7408 |     dependencies:
7409 |       shebang-regex: 3.0.0
7410 | 
7411 |   shebang-regex@3.0.0: {}
7412 | 
7413 |   side-channel-list@1.0.0:
7414 |     dependencies:
7415 |       es-errors: 1.3.0
7416 |       object-inspect: 1.13.4
7417 | 
7418 |   side-channel-map@1.0.1:
7419 |     dependencies:
7420 |       call-bound: 1.0.4
7421 |       es-errors: 1.3.0
7422 |       get-intrinsic: 1.3.0
7423 |       object-inspect: 1.13.4
7424 | 
7425 |   side-channel-weakmap@1.0.2:
7426 |     dependencies:
7427 |       call-bound: 1.0.4
7428 |       es-errors: 1.3.0
7429 |       get-intrinsic: 1.3.0
7430 |       object-inspect: 1.13.4
7431 |       side-channel-map: 1.0.1
7432 | 
7433 |   side-channel@1.1.0:
7434 |     dependencies:
7435 |       es-errors: 1.3.0
7436 |       object-inspect: 1.13.4
7437 |       side-channel-list: 1.0.0
7438 |       side-channel-map: 1.0.1
7439 |       side-channel-weakmap: 1.0.2
7440 | 
7441 |   signal-exit@4.1.0: {}
7442 | 
7443 |   simple-swizzle@0.2.2:
7444 |     dependencies:
7445 |       is-arrayish: 0.3.2
7446 |     optional: true
7447 | 
7448 |   sirv@3.0.1:
7449 |     dependencies:
7450 |       '@polka/url': 1.0.0-next.29
7451 |       mrmime: 2.0.1
7452 |       totalist: 3.0.1
7453 | 
7454 |   sonner@1.7.4(react-dom@19.1.1(react@19.1.1))(react@19.1.1):
7455 |     dependencies:
7456 |       react: 19.1.1
7457 |       react-dom: 19.1.1(react@19.1.1)
7458 | 
7459 |   source-map-js@1.2.1: {}
7460 | 
7461 |   source-map@0.7.6: {}
7462 | 
7463 |   sshpk@1.18.0:
7464 |     dependencies:
7465 |       asn1: 0.2.6
7466 |       assert-plus: 1.0.0
7467 |       bcrypt-pbkdf: 1.0.2
7468 |       dashdash: 1.14.1
7469 |       ecc-jsbn: 0.1.2
7470 |       getpass: 0.1.7
7471 |       jsbn: 0.1.1
7472 |       safer-buffer: 2.1.2
7473 |       tweetnacl: 0.14.5
7474 | 
7475 |   statuses@2.0.1: {}
7476 | 
7477 |   stream-events@1.0.5:
7478 |     dependencies:
7479 |       stubs: 3.0.0
7480 |     optional: true
7481 | 
7482 |   stream-shift@1.0.3:
7483 |     optional: true
7484 | 
7485 |   streamsearch@1.1.0: {}
7486 | 
7487 |   string-width@4.2.3:
7488 |     dependencies:
7489 |       emoji-regex: 8.0.0
7490 |       is-fullwidth-code-point: 3.0.0
7491 |       strip-ansi: 6.0.1
7492 | 
7493 |   string-width@5.1.2:
7494 |     dependencies:
7495 |       eastasianwidth: 0.2.0
7496 |       emoji-regex: 9.2.2
7497 |       strip-ansi: 7.1.0
7498 | 
7499 |   string_decoder@1.3.0:
7500 |     dependencies:
7501 |       safe-buffer: 5.2.1
7502 |     optional: true
7503 | 
7504 |   strip-ansi@6.0.1:
7505 |     dependencies:
7506 |       ansi-regex: 5.0.1
7507 | 
7508 |   strip-ansi@7.1.0:
7509 |     dependencies:
7510 |       ansi-regex: 6.2.0
7511 | 
7512 |   strnum@1.1.2:
7513 |     optional: true
7514 | 
7515 |   stubs@3.0.0:
7516 |     optional: true
7517 | 
7518 |   styled-jsx@5.1.6(react@19.1.1):
7519 |     dependencies:
7520 |       client-only: 0.0.1
7521 |       react: 19.1.1
7522 | 
7523 |   sucrase@3.35.0:
7524 |     dependencies:
7525 |       '@jridgewell/gen-mapping': 0.3.13
7526 |       commander: 4.1.1
7527 |       glob: 10.4.5
7528 |       lines-and-columns: 1.2.4
7529 |       mz: 2.7.0
7530 |       pirates: 4.0.7
7531 |       ts-interface-checker: 0.1.13
7532 | 
7533 |   supports-preserve-symlinks-flag@1.0.0: {}
7534 | 
7535 |   svelte@5.38.6:
7536 |     dependencies:
7537 |       '@jridgewell/remapping': 2.3.5
7538 |       '@jridgewell/sourcemap-codec': 1.5.5
7539 |       '@sveltejs/acorn-typescript': 1.0.5(acorn@8.15.0)
7540 |       '@types/estree': 1.0.8
7541 |       acorn: 8.15.0
7542 |       aria-query: 5.3.2
7543 |       axobject-query: 4.1.0
7544 |       clsx: 2.1.1
7545 |       esm-env: 1.2.2
7546 |       esrap: 2.1.0
7547 |       is-reference: 3.0.3
7548 |       locate-character: 3.0.0
7549 |       magic-string: 0.30.18
7550 |       zimmerframe: 1.1.2
7551 | 
7552 |   tailwind-merge@2.6.0: {}
7553 | 
7554 |   tailwindcss-animate@1.0.7(tailwindcss@3.4.17):
7555 |     dependencies:
7556 |       tailwindcss: 3.4.17
7557 | 
7558 |   tailwindcss@3.4.17:
7559 |     dependencies:
7560 |       '@alloc/quick-lru': 5.2.0
7561 |       arg: 5.0.2
7562 |       chokidar: 3.6.0
7563 |       didyoumean: 1.2.2
7564 |       dlv: 1.1.3
7565 |       fast-glob: 3.3.3
7566 |       glob-parent: 6.0.2
7567 |       is-glob: 4.0.3
7568 |       jiti: 1.21.7
7569 |       lilconfig: 3.1.3
7570 |       micromatch: 4.0.8
7571 |       normalize-path: 3.0.0
7572 |       object-hash: 3.0.0
7573 |       picocolors: 1.1.1
7574 |       postcss: 8.5.6
7575 |       postcss-import: 15.1.0(postcss@8.5.6)
7576 |       postcss-js: 4.0.1(postcss@8.5.6)
7577 |       postcss-load-config: 4.0.2(postcss@8.5.6)
7578 |       postcss-nested: 6.2.0(postcss@8.5.6)
7579 |       postcss-selector-parser: 6.1.2
7580 |       resolve: 1.22.10
7581 |       sucrase: 3.35.0
7582 |     transitivePeerDependencies:
7583 |       - ts-node
7584 | 
7585 |   teeny-request@9.0.0:
7586 |     dependencies:
7587 |       http-proxy-agent: 5.0.0
7588 |       https-proxy-agent: 5.0.1
7589 |       node-fetch: 2.7.0
7590 |       stream-events: 1.0.5
7591 |       uuid: 9.0.1
7592 |     transitivePeerDependencies:
7593 |       - encoding
7594 |       - supports-color
7595 |     optional: true
7596 | 
7597 |   thenify-all@1.6.0:
7598 |     dependencies:
7599 |       thenify: 3.3.1
7600 | 
7601 |   thenify@3.3.1:
7602 |     dependencies:
7603 |       any-promise: 1.3.0
7604 | 
7605 |   tiny-invariant@1.3.3: {}
7606 | 
7607 |   tinyglobby@0.2.14:
7608 |     dependencies:
7609 |       fdir: 6.5.0(picomatch@4.0.3)
7610 |       picomatch: 4.0.3
7611 | 
7612 |   to-regex-range@5.0.1:
7613 |     dependencies:
7614 |       is-number: 7.0.0
7615 | 
7616 |   toidentifier@1.0.1: {}
7617 | 
7618 |   totalist@3.0.1: {}
7619 | 
7620 |   tough-cookie@2.5.0:
7621 |     dependencies:
7622 |       psl: 1.15.0
7623 |       punycode: 2.3.1
7624 | 
7625 |   tr46@0.0.3: {}
7626 | 
7627 |   ts-interface-checker@0.1.13: {}
7628 | 
7629 |   tslib@2.8.1: {}
7630 | 
7631 |   tunnel-agent@0.6.0:
7632 |     dependencies:
7633 |       safe-buffer: 5.2.1
7634 | 
7635 |   turbo-stream@2.4.1: {}
7636 | 
7637 |   tweetnacl@0.14.5: {}
7638 | 
7639 |   type-is@1.6.18:
7640 |     dependencies:
7641 |       media-typer: 0.3.0
7642 |       mime-types: 2.1.35
7643 | 
7644 |   typescript@5.9.2: {}
7645 | 
7646 |   undici-types@6.21.0: {}
7647 | 
7648 |   unpipe@1.0.0: {}
7649 | 
7650 |   update-browserslist-db@1.1.3(browserslist@4.25.4):
7651 |     dependencies:
7652 |       browserslist: 4.25.4
7653 |       escalade: 3.2.0
7654 |       picocolors: 1.1.1
7655 | 
7656 |   uri-js@4.4.1:
7657 |     dependencies:
7658 |       punycode: 2.3.1
7659 | 
7660 |   use-callback-ref@1.3.3(@types/react@19.1.12)(react@19.1.1):
7661 |     dependencies:
7662 |       react: 19.1.1
7663 |       tslib: 2.8.1
7664 |     optionalDependencies:
7665 |       '@types/react': 19.1.12
7666 | 
7667 |   use-sidecar@1.1.3(@types/react@19.1.12)(react@19.1.1):
7668 |     dependencies:
7669 |       detect-node-es: 1.1.0
7670 |       react: 19.1.1
7671 |       tslib: 2.8.1
7672 |     optionalDependencies:
7673 |       '@types/react': 19.1.12
7674 | 
7675 |   use-sync-external-store@1.5.0(react@19.1.1):
7676 |     dependencies:
7677 |       react: 19.1.1
7678 | 
7679 |   util-deprecate@1.0.2: {}
7680 | 
7681 |   utils-merge@1.0.1: {}
7682 | 
7683 |   uuid@11.1.0: {}
7684 | 
7685 |   uuid@3.4.0: {}
7686 | 
7687 |   uuid@8.3.2:
7688 |     optional: true
7689 | 
7690 |   uuid@9.0.1: {}
7691 | 
7692 |   vary@1.1.2: {}
7693 | 
7694 |   vaul@0.9.9(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1):
7695 |     dependencies:
7696 |       '@radix-ui/react-dialog': 1.1.4(@types/react-dom@19.1.9(@types/react@19.1.12))(@types/react@19.1.12)(react-dom@19.1.1(react@19.1.1))(react@19.1.1)
7697 |       react: 19.1.1
7698 |       react-dom: 19.1.1(react@19.1.1)
7699 |     transitivePeerDependencies:
7700 |       - '@types/react'
7701 |       - '@types/react-dom'
7702 | 
7703 |   verror@1.10.0:
7704 |     dependencies:
7705 |       assert-plus: 1.0.0
7706 |       core-util-is: 1.0.2
7707 |       extsprintf: 1.3.0
7708 | 
7709 |   victory-vendor@36.9.2:
7710 |     dependencies:
7711 |       '@types/d3-array': 3.2.1
7712 |       '@types/d3-ease': 3.0.2
7713 |       '@types/d3-interpolate': 3.0.4
7714 |       '@types/d3-scale': 4.0.9
7715 |       '@types/d3-shape': 3.1.7
7716 |       '@types/d3-time': 3.0.4
7717 |       '@types/d3-timer': 3.0.2
7718 |       d3-array: 3.2.4
7719 |       d3-ease: 3.0.1
7720 |       d3-interpolate: 3.0.1
7721 |       d3-scale: 4.0.2
7722 |       d3-shape: 3.2.0
7723 |       d3-time: 3.1.0
7724 |       d3-timer: 3.0.1
7725 | 
7726 |   vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1):
7727 |     dependencies:
7728 |       esbuild: 0.25.9
7729 |       fdir: 6.5.0(picomatch@4.0.3)
7730 |       picomatch: 4.0.3
7731 |       postcss: 8.5.6
7732 |       rollup: 4.50.0
7733 |       tinyglobby: 0.2.14
7734 |     optionalDependencies:
7735 |       '@types/node': 22.18.0
7736 |       fsevents: 2.3.3
7737 |       jiti: 1.21.7
7738 |       yaml: 2.8.1
7739 | 
7740 |   vitefu@1.1.1(vite@7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)):
7741 |     optionalDependencies:
7742 |       vite: 7.1.4(@types/node@22.18.0)(jiti@1.21.7)(yaml@2.8.1)
7743 | 
7744 |   vue-router@4.5.1(vue@3.5.21(typescript@5.9.2)):
7745 |     dependencies:
7746 |       '@vue/devtools-api': 6.6.4
7747 |       vue: 3.5.21(typescript@5.9.2)
7748 | 
7749 |   vue@3.5.21(typescript@5.9.2):
7750 |     dependencies:
7751 |       '@vue/compiler-dom': 3.5.21
7752 |       '@vue/compiler-sfc': 3.5.21
7753 |       '@vue/runtime-dom': 3.5.21
7754 |       '@vue/server-renderer': 3.5.21(vue@3.5.21(typescript@5.9.2))
7755 |       '@vue/shared': 3.5.21
7756 |     optionalDependencies:
7757 |       typescript: 5.9.2
7758 | 
7759 |   waitress@0.1.5: {}
7760 | 
7761 |   web-streams-polyfill@3.3.3: {}
7762 | 
7763 |   web-vitals@4.2.4: {}
7764 | 
7765 |   webidl-conversions@3.0.1: {}
7766 | 
7767 |   websocket-driver@0.7.4:
7768 |     dependencies:
7769 |       http-parser-js: 0.5.10
7770 |       safe-buffer: 5.2.1
7771 |       websocket-extensions: 0.1.4
7772 | 
7773 |   websocket-extensions@0.1.4: {}
7774 | 
7775 |   whatwg-url@5.0.0:
7776 |     dependencies:
7777 |       tr46: 0.0.3
7778 |       webidl-conversions: 3.0.1
7779 | 
7780 |   which@2.0.2:
7781 |     dependencies:
7782 |       isexe: 2.0.0
7783 | 
7784 |   wrap-ansi@7.0.0:
7785 |     dependencies:
7786 |       ansi-styles: 4.3.0
7787 |       string-width: 4.2.3
7788 |       strip-ansi: 6.0.1
7789 | 
7790 |   wrap-ansi@8.1.0:
7791 |     dependencies:
7792 |       ansi-styles: 6.2.1
7793 |       string-width: 5.1.2
7794 |       strip-ansi: 7.1.0
7795 | 
7796 |   wrappy@1.0.2:
7797 |     optional: true
7798 | 
7799 |   y18n@5.0.8: {}
7800 | 
7801 |   yallist@4.0.0: {}
7802 | 
7803 |   yaml@2.8.1: {}
7804 | 
7805 |   yargs-parser@21.1.1: {}
7806 | 
7807 |   yargs@17.7.2:
7808 |     dependencies:
7809 |       cliui: 8.0.1
7810 |       escalade: 3.2.0
7811 |       get-caller-file: 2.0.5
7812 |       require-directory: 2.1.1
7813 |       string-width: 4.2.3
7814 |       y18n: 5.0.8
7815 |       yargs-parser: 21.1.1
7816 | 
7817 |   yocto-queue@0.1.0:
7818 |     optional: true
7819 | 
7820 |   zimmerframe@1.1.2: {}
7821 | 
7822 |   zod@3.25.76: {}
7823 | 


--------------------------------------------------------------------------------
/postcss.config.mjs:
--------------------------------------------------------------------------------
1 | /** @type {import('postcss-load-config').Config} */
2 | const config = {
3 |   plugins: {
4 |     tailwindcss: {},
5 |   },
6 | };
7 | 
8 | export default config;
9 | 


--------------------------------------------------------------------------------
/public/placeholder-logo.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/public/placeholder-logo.png


--------------------------------------------------------------------------------
/public/placeholder-logo.svg:
--------------------------------------------------------------------------------
1 | <svg xmlns="http://www.w3.org/2000/svg" width="215" height="48" fill="none"><path fill="#000" d="M57.588 9.6h6L73.828 38h-5.2l-2.36-6.88h-11.36L52.548 38h-5.2l10.24-28.4Zm7.16 17.16-4.16-12.16-4.16 12.16h8.32Zm23.694-2.24c-.186-1.307-.706-2.32-1.56-3.04-.853-.72-1.866-1.08-3.04-1.08-1.68 0-2.986.613-3.92 1.84-.906 1.227-1.36 2.947-1.36 5.16s.454 3.933 1.36 5.16c.934 1.227 2.24 1.84 3.92 1.84 1.254 0 2.307-.373 3.16-1.12.854-.773 1.387-1.867 1.6-3.28l5.12.24c-.186 1.68-.733 3.147-1.64 4.4-.906 1.227-2.08 2.173-3.52 2.84-1.413.667-2.986 1-4.72 1-2.08 0-3.906-.453-5.48-1.36-1.546-.907-2.76-2.2-3.64-3.88-.853-1.68-1.28-3.627-1.28-5.84 0-2.24.427-4.187 1.28-5.84.88-1.68 2.094-2.973 3.64-3.88 1.574-.907 3.4-1.36 5.48-1.36 1.68 0 3.227.32 4.64.96 1.414.64 2.56 1.56 3.44 2.76.907 1.2 1.454 2.6 1.64 4.2l-5.12.28Zm11.486-7.72.12 3.4c.534-1.227 1.307-2.173 2.32-2.84 1.04-.693 2.267-1.04 3.68-1.04 1.494 0 2.76.387 3.8 1.16 1.067.747 1.827 1.813 2.28 3.2.507-1.44 1.294-2.52 2.36-3.24 1.094-.747 2.414-1.12 3.96-1.12 1.414 0 2.64.307 3.68.92s1.84 1.52 2.4 2.72c.56 1.2.84 2.667.84 4.4V38h-4.96V25.92c0-1.813-.293-3.187-.88-4.12-.56-.96-1.413-1.44-2.56-1.44-.906 0-1.68.213-2.32.64-.64.427-1.133 1.053-1.48 1.88-.32.827-.48 1.84-.48 3.04V38h-4.56V25.92c0-1.2-.133-2.213-.4-3.04-.24-.827-.626-1.453-1.16-1.88-.506-.427-1.133-.64-1.88-.64-.906 0-1.68.227-2.32.68-.64.427-1.133 1.053-1.48 1.88-.32.827-.48 1.827-.48 3V38h-4.96V16.8h4.48Zm26.723 10.6c0-2.24.427-4.187 1.28-5.84.854-1.68 2.067-2.973 3.64-3.88 1.574-.907 3.4-1.36 5.48-1.36 1.84 0 3.494.413 4.96 1.24 1.467.827 2.64 2.08 3.52 3.76.88 1.653 1.347 3.693 1.4 6.12v1.32h-15.08c.107 1.813.614 3.227 1.52 4.24.907.987 2.134 1.48 3.68 1.48.987 0 1.88-.253 2.68-.76a4.803 4.803 0 0 0 1.84-2.2l5.08.36c-.64 2.027-1.84 3.64-3.6 4.84-1.733 1.173-3.733 1.76-6 1.76-2.08 0-3.906-.453-5.48-1.36-1.573-.907-2.786-2.2-3.64-3.88-.853-1.68-1.28-3.627-1.28-5.84Zm15.16-2.04c-.213-1.733-.76-3.013-1.64-3.84-.853-.827-1.893-1.24-3.12-1.24-1.44 0-2.6.453-3.48 1.36-.88.88-1.44 2.12-1.68 3.72h9.92ZM163.139 9.6V38h-5.04V9.6h5.04Zm8.322 7.2.24 5.88-.64-.36c.32-2.053 1.094-3.56 2.32-4.52 1.254-.987 2.787-1.48 4.6-1.48 2.32 0 4.107.733 5.36 2.2 1.254 1.44 1.88 3.387 1.88 5.84V38h-4.96V25.92c0-1.253-.12-2.28-.36-3.08-.24-.8-.64-1.413-1.2-1.84-.533-.427-1.253-.64-2.16-.64-1.44 0-2.573.48-3.4 1.44-.8.933-1.2 2.307-1.2 4.12V38h-4.96V16.8h4.48Zm30.003 7.72c-.186-1.307-.706-2.32-1.56-3.04-.853-.72-1.866-1.08-3.04-1.08-1.68 0-2.986.613-3.92 1.84-.906 1.227-1.36 2.947-1.36 5.16s.454 3.933 1.36 5.16c.934 1.227 2.24 1.84 3.92 1.84 1.254 0 2.307-.373 3.16-1.12.854-.773 1.387-1.867 1.6-3.28l5.12.24c-.186 1.68-.733 3.147-1.64 4.4-.906 1.227-2.08 2.173-3.52 2.84-1.413.667-2.986 1-4.72 1-2.08 0-3.906-.453-5.48-1.36-1.546-.907-2.76-2.2-3.64-3.88-.853-1.68-1.28-3.627-1.28-5.84 0-2.24.427-4.187 1.28-5.84.88-1.68 2.094-2.973 3.64-3.88 1.574-.907 3.4-1.36 5.48-1.36 1.68 0 3.227.32 4.64.96 1.414.64 2.56 1.56 3.44 2.76.907 1.2 1.454 2.6 1.64 4.2l-5.12.28Zm11.443 8.16V38h-5.6v-5.32h5.6Z"/><path fill="#171717" fill-rule="evenodd" d="m7.839 40.783 16.03-28.054L20 6 0 40.783h7.839Zm8.214 0H40L27.99 19.894l-4.02 7.032 3.976 6.914H20.02l-3.967 6.943Z" clip-rule="evenodd"/></svg>


--------------------------------------------------------------------------------
/public/placeholder-user.jpg:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/public/placeholder-user.jpg


--------------------------------------------------------------------------------
/public/placeholder.jpg:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/bkrishnanair/huddle_v0/master/public/placeholder.jpg


--------------------------------------------------------------------------------
/public/placeholder.svg:
--------------------------------------------------------------------------------
1 | <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" fill="none"><rect width="1200" height="1200" fill="#EAEAEA" rx="3"/><g opacity=".5"><g opacity=".5"><path fill="#FAFAFA" d="M600.709 736.5c-75.454 0-136.621-61.167-136.621-136.62 0-75.454 61.167-136.621 136.621-136.621 75.453 0 136.62 61.167 136.62 136.621 0 75.453-61.167 136.62-136.62 136.62Z"/><path stroke="#C9C9C9" stroke-width="2.418" d="M600.709 736.5c-75.454 0-136.621-61.167-136.621-136.62 0-75.454 61.167-136.621 136.621-136.621 75.453 0 136.62 61.167 136.62 136.621 0 75.453-61.167 136.62-136.62 136.62Z"/></g><path stroke="url(#a)" stroke-width="2.418" d="M0-1.209h553.581" transform="scale(1 -1) rotate(45 1163.11 91.165)"/><path stroke="url(#b)" stroke-width="2.418" d="M404.846 598.671h391.726"/><path stroke="url(#c)" stroke-width="2.418" d="M599.5 795.742V404.017"/><path stroke="url(#d)" stroke-width="2.418" d="m795.717 796.597-391.441-391.44"/><path fill="#fff" d="M600.709 656.704c-31.384 0-56.825-25.441-56.825-56.824 0-31.384 25.441-56.825 56.825-56.825 31.383 0 56.824 25.441 56.824 56.825 0 31.383-25.441 56.824-56.824 56.824Z"/><g clip-path="url(#e)"><path fill="#666" fill-rule="evenodd" d="M616.426 586.58h-31.434v16.176l3.553-3.554.531-.531h9.068l.074-.074 8.463-8.463h2.565l7.18 7.181V586.58Zm-15.715 14.654 3.698 3.699 1.283 1.282-2.565 2.565-1.282-1.283-5.2-5.199h-6.066l-5.514 5.514-.073.073v2.876a2.418 2.418 0 0 0 2.418 2.418h26.598a2.418 2.418 0 0 0 2.418-2.418v-8.317l-8.463-8.463-7.181 7.181-.071.072Zm-19.347 5.442v4.085a6.045 6.045 0 0 0 6.046 6.045h26.598a6.044 6.044 0 0 0 6.045-6.045v-7.108l1.356-1.355-1.282-1.283-.074-.073v-17.989h-38.689v23.43l-.146.146.146.147Z" clip-rule="evenodd"/></g><path stroke="#C9C9C9" stroke-width="2.418" d="M600.709 656.704c-31.384 0-56.825-25.441-56.825-56.824 0-31.384 25.441-56.825 56.825-56.825 31.383 0 56.824 25.441 56.824 56.825 0 31.383-25.441 56.824-56.824 56.824Z"/></g><defs><linearGradient id="a" x1="554.061" x2="-.48" y1=".083" y2=".087" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><linearGradient id="b" x1="796.912" x2="404.507" y1="599.963" y2="599.965" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><linearGradient id="c" x1="600.792" x2="600.794" y1="403.677" y2="796.082" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><linearGradient id="d" x1="404.85" x2="796.972" y1="403.903" y2="796.02" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><clipPath id="e"><path fill="#fff" d="M581.364 580.535h38.689v38.689h-38.689z"/></clipPath></defs></svg>


--------------------------------------------------------------------------------
/styles/globals.css:
--------------------------------------------------------------------------------
 1 | @tailwind base;
 2 | @tailwind components;
 3 | @tailwind utilities;
 4 | 
 5 | @layer utilities {
 6 |   .text-balance {
 7 |     text-wrap: balance;
 8 |   }
 9 | }
10 | 
11 | @layer base {
12 |   :root {
13 |     --background: 0 0% 100%;
14 |     --foreground: 0 0% 3.9%;
15 |     --card: 0 0% 100%;
16 |     --card-foreground: 0 0% 3.9%;
17 |     --popover: 0 0% 100%;
18 |     --popover-foreground: 0 0% 3.9%;
19 |     --primary: 0 0% 9%;
20 |     --primary-foreground: 0 0% 98%;
21 |     --secondary: 0 0% 96.1%;
22 |     --secondary-foreground: 0 0% 9%;
23 |     --muted: 0 0% 96.1%;
24 |     --muted-foreground: 0 0% 45.1%;
25 |     --accent: 0 0% 96.1%;
26 |     --accent-foreground: 0 0% 9%;
27 |     --destructive: 0 84.2% 60.2%;
28 |     --destructive-foreground: 0 0% 98%;
29 |     --border: 0 0% 89.8%;
30 |     --input: 0 0% 89.8%;
31 |     --ring: 0 0% 3.9%;
32 |     --chart-1: 12 76% 61%;
33 |     --chart-2: 173 58% 39%;
34 |     --chart-3: 197 37% 24%;
35 |     --chart-4: 43 74% 66%;
36 |     --chart-5: 27 87% 67%;
37 |     --radius: 0.5rem;
38 |     --sidebar-background: 0 0% 98%;
39 |     --sidebar-foreground: 240 5.3% 26.1%;
40 |     --sidebar-primary: 240 5.9% 10%;
41 |     --sidebar-primary-foreground: 0 0% 98%;
42 |     --sidebar-accent: 240 4.8% 95.9%;
43 |     --sidebar-accent-foreground: 240 5.9% 10%;
44 |     --sidebar-border: 220 13% 91%;
45 |     --sidebar-ring: 217.2 91.2% 59.8%;
46 |   }
47 |   .dark {
48 |     --background: 0 0% 3.9%;
49 |     --foreground: 0 0% 98%;
50 |     --card: 0 0% 3.9%;
51 |     --card-foreground: 0 0% 98%;
52 |     --popover: 0 0% 3.9%;
53 |     --popover-foreground: 0 0% 98%;
54 |     --primary: 0 0% 98%;
55 |     --primary-foreground: 0 0% 9%;
56 |     --secondary: 0 0% 14.9%;
57 |     --secondary-foreground: 0 0% 98%;
58 |     --muted: 0 0% 14.9%;
59 |     --muted-foreground: 0 0% 63.9%;
60 |     --accent: 0 0% 14.9%;
61 |     --accent-foreground: 0 0% 98%;
62 |     --destructive: 0 62.8% 30.6%;
63 |     --destructive-foreground: 0 0% 98%;
64 |     --border: 0 0% 14.9%;
65 |     --input: 0 0% 14.9%;
66 |     --ring: 0 0% 83.1%;
67 |     --chart-1: 220 70% 50%;
68 |     --chart-2: 160 60% 45%;
69 |     --chart-3: 30 80% 55%;
70 |     --chart-4: 280 65% 60%;
71 |     --chart-5: 340 75% 55%;
72 |     --sidebar-background: 240 5.9% 10%;
73 |     --sidebar-foreground: 240 4.8% 95.9%;
74 |     --sidebar-primary: 224.3 76.3% 48%;
75 |     --sidebar-primary-foreground: 0 0% 100%;
76 |     --sidebar-accent: 240 3.7% 15.9%;
77 |     --sidebar-accent-foreground: 240 4.8% 95.9%;
78 |     --sidebar-border: 240 3.7% 15.9%;
79 |     --sidebar-ring: 217.2 91.2% 59.8%;
80 |   }
81 | }
82 | 
83 | @layer base {
84 |   * {
85 |     @apply border-border;
86 |   }
87 |   body {
88 |     @apply bg-background text-foreground;
89 |   }
90 | }
91 | 


--------------------------------------------------------------------------------
/tailwind.config.ts:
--------------------------------------------------------------------------------
 1 | import type { Config } from "tailwindcss"
 2 | 
 3 | const config = {
 4 |   darkMode: ["class"],
 5 |   content: [
 6 |     './pages/**/*.{ts,tsx}',
 7 |     './components/**/*.{ts,tsx}',
 8 |     './app/**/*.{ts,tsx}',
 9 |     './src/**/*.{ts,tsx}',
10 |   ],
11 |   prefix: "",
12 |   theme: {
13 |     container: {
14 |       center: true,
15 |       padding: "2rem",
16 |       screens: {
17 |         "2xl": "1400px",
18 |       },
19 |     },
20 |     extend: {
21 |       colors: {
22 |         border: "hsl(var(--border))",
23 |         input: "hsl(var(--input))",
24 |         ring: "hsl(var(--ring))",
25 |         background: "hsl(var(--background))",
26 |         foreground: "hsl(var(--foreground))",
27 |         primary: {
28 |           DEFAULT: "hsl(var(--primary))",
29 |           foreground: "hsl(var(--primary-foreground))",
30 |         },
31 |         secondary: {
32 |           DEFAULT: "hsl(var(--secondary))",
33 |           foreground: "hsl(var(--secondary-foreground))",
34 |         },
35 |         destructive: {
36 |           DEFAULT: "hsl(var(--destructive))",
37 |           foreground: "hsl(var(--destructive-foreground))",
38 |         },
39 |         muted: {
40 |           DEFAULT: "hsl(var(--muted))",
41 |           foreground: "hsl(var(--muted-foreground))",
42 |         },
43 |         accent: {
44 |           DEFAULT: "hsl(var(--accent))",
45 |           foreground: "hsl(var(--accent-foreground))",
46 |         },
47 |         popover: {
48 |           DEFAULT: "hsl(var(--popover))",
49 |           foreground: "hsl(var(--popover-foreground))",
50 |         },
51 |         card: {
52 |           DEFAULT: "hsl(var(--card))",
53 |           foreground: "hsl(var(--card-foreground))",
54 |         },
55 |       },
56 |       borderRadius: {
57 |         lg: "var(--radius)",
58 |         md: "calc(var(--radius) - 2px)",
59 |         sm: "calc(var(--radius) - 4px)",
60 |       },
61 |       keyframes: {
62 |         "accordion-down": {
63 |           from: { height: "0" },
64 |           to: { height: "var(--radix-accordion-content-height)" },
65 |         },
66 |         "accordion-up": {
67 |           from: { height: "var(--radix-accordion-content-height)" },
68 |           to: { height: "0" },
69 |         },
70 |       },
71 |       animation: {
72 |         "accordion-down": "accordion-down 0.2s ease-out",
73 |         "accordion-up": "accordion-up 0.2s ease-out",
74 |       },
75 |     },
76 |   },
77 |   plugins: [require("tailwindcss-animate")],
78 | } satisfies Config
79 | 
80 | export default config


--------------------------------------------------------------------------------
/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "compilerOptions": {
 3 |     "lib": ["dom", "dom.iterable", "esnext"],
 4 |     "allowJs": true,
 5 |     "target": "ES6",
 6 |     "skipLibCheck": true,
 7 |     "strict": true,
 8 |     "noEmit": true,
 9 |     "esModuleInterop": true,
10 |     "module": "esnext",
11 |     "moduleResolution": "bundler",
12 |     "resolveJsonModule": true,
13 |     "isolatedModules": true,
14 |     "jsx": "preserve",
15 |     "incremental": true,
16 |     "plugins": [
17 |       {
18 |         "name": "next"
19 |       }
20 |     ],
21 |     "baseUrl": ".",
22 |     "paths": {
23 |       "@/*": ["./*"]
24 |     }
25 |   },
26 |   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
27 |   "exclude": ["node_modules"]
28 | }
29 | 


--------------------------------------------------------------------------------
/vercel.json:
--------------------------------------------------------------------------------
1 | {
2 |   "buildCommand": "pnpm run build",
3 |   "outputDirectory": ".next",
4 |   "installCommand": "pnpm install",
5 |   "framework": "nextjs"
6 | }
7 | 


--------------------------------------------------------------------------------