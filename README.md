# Huddle - V2 Enhanced

Huddle is a modern, full-stack web application designed to help users discover, create, and join local pickup sports events. Centered around an interactive map, it provides a seamless experience for finding nearby games, creating events, and engaging with other participants through real-time chat, social profiles, and automated reminders.

This production-ready application features a complete authentication system, real-time event management, and interactive social features, creating an engaging and reliable user experience for sports enthusiasts.

| Landing Page | Maps Feed | Discover |
| :---: | :---: | :---: |
| ![Landing Page](Pages/landing%20page.jpeg) | ![Maps View](Pages/Maps.png) | ![Discover Feed](Pages/discover.jpeg) |

| My Events | Create Event | Profile |
| :---: | :---: | :---: |
| ![My Events](Pages/My%20events.jpeg) | ![Create Event](Pages/create%20event.jpeg) | ![Profile Page](Pages/Profile.jpeg) |

| Login / Signup | 
| :---: |
| ![Auth Screen](Pages/login.jpeg) | 

## Key Features & Functionality

*   **🌍 Frictionless Guest Access**: Unauthenticated users can instantly explore the live map and Discover feed. Secure interceptions (`router.push`) reroute guests trying to host to a login page without jarring full-page reloads.
*   **📍 Premium Map Pins**: Custom React teardrop nodes featuring rich south-facing gradients, drop shadows, and scale-on-hover micro-animations. Replaces generic Google clusters while visually categorizing events via custom emojis.
*   **🔗 Strict Deep Link Priority**: Shareable event links (`/map?eventId=xyz`) use a rigid `useRef` map lock. The map instantly pans to the deep-linked coordinates on mount, guaranteeing HTML5 geolocation prompts cannot steal focus away from the shared event.
*   **🔐 Secure Hybrid Authentication**: Complete session management with Next.js 15 App Router compatibility. Combines Firebase Auth on the client with the Firebase Admin SDK on the server using secure HTTP-only cookies.
*   **📅 Event Creation UX**: Native date/time picker integrations forcing high-contrast dark mode icons. Fully touch-responsive Google Places dropdown searches ensuring stable mobile entries.
*   **👥 RSVP & Unjoin Optimization**: Users can join/unjoin events seamlessly with optimistic UI updates. Added a dedicated "Unjoin" button to the "Joined" tab on the "My Events" page for quick action.
*   **🗑️ Event Deletion & Management**: Organizers can now delete their events directly from the event details drawer or organized feed. Securely enforced via server-side permission checks.
*   **🔄 Map/List View Toggle**: Instantly switch between the interactive map and a scrollable vertical feed (List View) of events without losing state.
*   **🕙 Discovery Filters (Time & Range)**: Surface events happening "Next 2 Hrs", "Today", or "This Weekend" with a single tap. Added a functional "Within Range" filter (5-50 miles) powered by client-side Haversine math for precise DMV area discoveries.
*   **🕵️ Private Events & Deep Linking**: Added support for link-only private events that are hidden from the discovery feed but accessible via secure deep links.
*   **💬 Live Event Chat**: Each event features instantaneous live messaging for participants to coordinate logistics, powered by optimistic UI updates.
*   **👤 Elegant User Profiles**: Premium "glassmorphic" profile pages showcasing user bios, dynamic "Interests" tags, and a history of organized/joined events.
*   **🏆 Karma Score & Gamification**: Added a "Karma Score" system to reward organizers and active participants, complete with hoverable info tooltips explaining the calculation.
*   **🔍 Global Search & Filtering**: Dedicated Discover page featuring unified search across Name, Category, AND Location simultaneously. Expanded filter arrays (Tech, Outdoors, etc.) housed in horizontal scrolling panes.
*   **💾 Persistent Map State**: Utilizing `sessionStorage` to remember your last map position, zoom level, and UI states (like prompt dismissals). Navigation between pages no longer resets your perspective.
*   **🧹 Decluttered Maps UX**: Custom map styling that intelligently hides business POIs (restaurants, shops) globally, ensuring your event pins are the primary focus of the experience.
*   **📱 Native-Feel Mobile Navigation**: Fully responsive layouts with horizontal-scroll filter chips and optimized bottom padding to prevent content from being cut off by the floating glass navigation bar.
*   **🎓 University-Specific Mock Seeding**: Includes a powerful Node.js seeding suite (`scripts/seed_umd.ts`) to populate the map with realistic, landmark-specific events at UMD (McKeldin, Iribe, Eppley) and other Top 20 US universities.

## UI/UX & Design Philosophy

*   **Premium Dark Glassmorphism**: Transitioned to a highly cinematic, dark aesthetic utilizing `slate-950`, radiant glowing orbs, and elegant frosted glass cards.
*   **Action-Oriented Landing Page**: Rebranded completely for campus organizers—focusing on beating algorithmic suppression ("Stop fighting the algorithm. Drop a pin, share the link..."). Features social proof from the *2026 Pitch Dingman Competition*.
*   **Mobile-First & Touch Optimized**: Fixed classic dropdown z-index bugs, optimized gesture handling on the map, and ensured a 60fps Native-App feel purely in the browser.

## Tech Stack

| Category      | Technology                                                                                             |
| :------------ | :----------------------------------------------------------------------------------------------------- |
| **Framework** | [**Next.js**](https://nextjs.org/) (v15 App Router) & [**Turbopack**](https://turbo.build/pack)        |
| **Language**  | [**TypeScript**](https://www.typescriptlang.org/) (Strictly typed with `GameEvent` interfaces)         |
| **Backend**   | [**Firebase**](https://firebase.google.com/) (Auth, Firestore, Admin SDK, Cloud Functions)             |
| **Validation**| [**Zod**](https://zod.dev/) (Strict server-side validation)                                            |
| **Mapping**   | [**Google Maps Platform**](https://developers.google.com/maps) (`@vis.gl/react-google-maps`)           |
| **Styling**   | [**Tailwind CSS**](https://tailwindcss.com/) & [**Shadcn/ui**](https://ui.shadcn.com/)                 |
| **Deployment**| [**Vercel**](https://vercel.com/) (Frontend edge network)                                              |
| **Package Manager**| [**PNPM**](https://pnpm.io/)                                                                           |

---

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing purposes.

### 1. Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18 or later)
*   [PNPM](https://pnpm.io/installation)
*   Google Cloud Console Account (For Maps API)
*   Firebase Project Credentials

### 2. Clone the Repository

```bash
git clone https://github.com/bkrishnanair/huddle_v0.git
cd huddle_v0
```

### 3. Set Up Environment Variables

1.  Create a `.env.local` file in the root of the project:
    ```bash
    touch .env.local
    ```
2.  Add the following environment variables to the file (refer to the Firebase Console & GCP):
    ```env
    # Firebase Client SDK
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=...

    # Google Maps Configuration
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
    NEXT_PUBLIC_GOOGLE_MAPS_STYLE_MAP_ID=...

    # Firebase Admin SDK (Server Bypass)
    FIREBASE_PROJECT_ID=...
    FIREBASE_CLIENT_EMAIL=...
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
    ```

### 4. Install Dependencies and Run

```bash
# Install root project dependencies via strict lockfile
pnpm install

# Run the development server with Turbopack acceleration
pnpm run dev
```

The application should now be running on [http://localhost:3000](http://localhost:3000).

---

## Core Architectural Decisions

This project is architected to be highly resilient, secure, and performant.

*   **Turbopack Stabilization & Module Splitting**: We explicitly separate Client-only database operations (`lib/db-client.ts`) from Server-exclusive Admin SDK logic (`lib/db.ts`). This guarantees zero Webpack leaking and ensures strict compilation safety in Next.js 15.
*   **Transactions & Admin Overrides**: Firestore security rules purposefully restrict client manipulation. RSVPs and Player Counts are executed securely on the backend using `adminDb.runTransaction()` to prevent race conditions and permission denial loops.
*   **Geospatial Throttling**: The interactive map employs custom debouncing (500ms bounds wait) and strict geographical equality checks (`===`) before triggering API queries. This effectively neutralized infinite fetch loops while maintaining a fluid user experience. 
*   **Graceful Map Degradation**: If Google Geometry libraries fail to load instantly, the application prevents fatal crashes by safely falling back to hardcoded geographical radii formulas.
