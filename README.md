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

*   **🌍 Frictionless Guest Access**: Unauthenticated users can instantly explore the live map and Discover feed. Recent updates allow for **Anonymous Guest RSVPs**, letting users join events with just a name and optional note without ever seeing a signup screen.
*   **📍 Premium Map Pins**: Custom React teardrop nodes featuring rich south-facing gradients, drop shadows, and scale-on-hover micro-animations. Replaces generic Google clusters while visually categorizing events via custom emojis.
*   **⏳ Smart Waitlists (Atomic)**: Built-in waitlist system preventing over-selling. Uses `adminDb.runTransaction()` to safely push excess users to a waitlist. If a seated attendee cancels, the system automatically pops the first waitlisted user into the active roster.
*   **📊 Organizer Logistics & CRM (Phase 1 & 2)**:
    *   **Advanced RSVP Logic**: Organizers can now require answers to custom logistics questions (e.g., "Need a ride?", "Dietary restrictions?") and force selection of specific **Pickup Points**.
    *   **Real-Time Dashboard**: A live-updating roster via `onSnapshot()` featuring a capacity meter and "🔥 Repeat Attendee" loyalty badges.
    *   **Automated Scheduling (Cron)**: Built-in support for Vercel Cron jobs that automatically broadcast scheduled messages and announcements to the event chat.
    *   **CSV Exports**: Enhanced one-click roster downloads now include columns for user notes, question answers, and pickup selections.
    *   **One-Click Cloning**: Instantly duplicate repetitive intramural/club events pre-filled with location and copy, while safely blanking date/time fields to prevent overlaps.
*   **🚩 Limited Seating Alerts**: Automatic red flashing badges injected into feed cards and detail drawers when remaining spots hit critical thresholds (≤ 3).
*   **💬 Live Event Chat & Pinned Comms**: Each event features instantaneous live messaging. Organizers can "Pin" essential announcements to the top of the chat viewport for high visibility.
*   **🗑️ Event Deletion & Editing**: Creators can delete or live-edit event details (time, venue, capacity) directly from the details drawer with server-side permission enforcement.
*   **🕙 Discovery Filters (Time & Range)**: Surface events happening "Next 2 Hrs", "Today", or "This Weekend" with a single tap. Functional "Within Range" filter powered by client-side Haversine math.
*   **🕵️ Private Events & Deep Linking**: Support for link-only private events hidden from the discovery feed but accessible via secure deep links with `useRef` map locking.
*   **👤 Elegant User Profiles**: Premium glassmorphic pages showcasing bios, interests, and an updated **Attendance History** (Past Events) view.
*   **🏆 Karma Score & Gamification**: A weighted "Karma" system to reward reliable organizers and active participants.
*   **📱 Native-Feel Mobile UX**: Fully responsive layouts with horizontal-scroll filter chips and optimized bottom padding for the floating glass navigation bar.
*   **🎓 University-Specific Mock Seeding**: Powerful Node.js seeding suite (`scripts/seed_umd.ts`) to populate the map with realistic, landmark-specific events.

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
