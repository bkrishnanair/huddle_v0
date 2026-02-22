# Huddle - V2 Enhanced

Huddle is a modern, full-stack web application designed to help users discover, create, and join local pickup sports events. Centered around an interactive map, it provides a seamless experience for finding nearby games, creating events, and engaging with other participants through real-time chat, social profiles, and automated reminders.

This production-ready application features a complete authentication system, real-time event management, and interactive social features, creating an engaging and reliable user experience for sports enthusiasts.

## Screenshots

| Landing Page 1 | Landing Page 2 | Login/Signup |
| :---: | :---: | :---: |
| ![alt text](Pages/landingpage-1.png) | ![alt text](Pages/landingpage-2.png) | ![alt text](Pages/old/image-5.png) |

| Discover Events | Events Page | Event Search |
| :---: | :---: | :---: |
| ![alt text](Pages/old/image-4.png) | ![alt text](Pages/old/image-1.png) | ![alt text](Pages/old/image-6.png) |

| Create Event | Chat | Profile |
| :---: | :---: | :---: |
| ![alt text](Pages/old/image-7.png) | ![alt text](Pages/old/image-3.png) | ![alt text](Pages/old/image.png) |

## Key Features & Functionality

*   **🌍 Frictionless Discovery & Interactive Map**: Unauthenticated users can instantly explore the live map, densely populated with hyperlocal, realistic events (College Park / DC Area). No sign-up required to browse!
*   **📍 Advanced Map UX (Emoji Pins & Hover States)**: Replaced clunky native popups with sleek, custom-built intuitive React nodes. Pins display category-specific emojis and elegantly expand to show event details on hover or when zooming in close.
*   **🔗 Social Deep Linking & Open Graph**: Shareable event links (`/map?eventId=xyz`) automatically generate rich Open Graph previews (Title, Category) for iMessage/Discord. Clicking the link instantly pans the map to the coordinates and opens the event drawer.
*   **🔐 Secure Hybrid Authentication**: Complete session management with Next.js 15 App Router compatibility. Combines Firebase Auth on the client with the Firebase Admin SDK on the server using secure HTTP-only cookies.
*   **📅 AI-Powered Event Creation**: Create single or recurring events with an intuitive modal featuring a global location search bar, draggable map pins, server-side validation, and instant Gemini AI-powered description generation.
*   **👥 RSVP & Unjoin Optimization**: Users can join/unjoin events seamlessly with optimistic UI updates. Added a dedicated "Unjoin" button to the "Joined" tab on the "My Events" page for quick action.
*   **🗑️ Event Deletion & Management**: Organizers can now delete their events directly from the event details drawer or organized feed. Securely enforced via server-side permission checks.
*   **🔄 Map/List View Toggle**: Instantly switch between the interactive map and a scrollable vertical feed (List View) of events without losing state.
*   **🕒 Time-Based Discovery Filters**: Surface events happening "Next 2 Hrs", "Today", or "This Weekend" with a single tap using new horizontal chip filters.
*   **🕵️ Private Events & Deep Linking**: Added support for link-only private events that are hidden from the discovery feed but accessible via secure deep links.
*   **💬 Live Event Chat**: Each event features instantaneous live messaging for participants to coordinate logistics, powered by optimistic UI updates.
*   **👤 Elegant User Profiles**: Premium "glassmorphic" profile pages showcasing user bios, dynamic "Interests" tags, unlocked achievement badges, and a history of organized/joined events.
*   **🔍 Global Search & Filtering**: Dedicated Discover page with persistent search, functional category tags (Sports, Music, Tech, etc.), and sorting constraints (Soonest vs. Closest). Added immediate "Show on Map" routing from any event card.

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
