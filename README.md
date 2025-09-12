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

## Key Features
*   **🔐 Secure Authentication System**: Complete session management with Next.js 15 compatibility and Firebase Auth integration
*   **🗺️ Interactive Map & Event Discovery**: Users can discover events in their vicinity, powered by Google Maps with custom-styled pins and real-time location services
*   **📅 Advanced Event Creation**: Create single or recurring events with an intuitive modal featuring location search, server-side validation, and AI-powered content generation
*   **👥 RSVP & Real-Time Management**: Users can join/leave events instantly. Organizers get a dedicated "Players" tab to view attendees and manage check-ins in real-time
*   **💬 Real-Time Event Chat**: Each event includes live messaging for participants to coordinate and communicate
*   **👤 Engaging User Profiles**: Personalized profiles with bio, favorite sports, achievements, and comprehensive event history
*   **🏆 Gamification & Achievements**: Badge system rewards users for milestones like joining their first game
*   **📱 Mobile-First Design**: Responsive "glassmorphism" UI built with Tailwind CSS and Shadcn/ui, optimized for touch interactions
*   **🔔 Smart Notifications**: Automated push notifications remind RSVP'd users 30 minutes before events start
*   **🤝 Social Connectivity**: Friend/connection system allows users to build their sports community

## Tech Stack

| Category      | Technology                                                                                             |
| :------------ | :----------------------------------------------------------------------------------------------------- |
| **Framework** | [**Next.js**](https://nextjs.org/) (v15+ with App Router) & [**Turbopack**](https://turbo.build/pack) |
| **Language**  | [**TypeScript**](https://www.typescriptlang.org/)                                                      |
| **Backend**   | [**Firebase**](https://firebase.google.com/) (Serverless: Auth, Firestore, Cloud Functions)              |
| **Validation**| [**Zod**](https://zod.dev/) (for server-side data validation)                                            |
| **Mapping**   | [**Google Maps Platform**](https://developers.google.com/maps)                                           |
| **Styling**   | [**Tailwind CSS**](https://tailwindcss.com/) & [**Shadcn/ui**](https://ui.shadcn.com/)                   |
| **Deployment**| [**Vercel**](https://vercel.com/) (Frontend) & [**Firebase**](https://firebase.google.com/) (Backend)    |
| **Package Manager**| [**PNPM**](https://pnpm.io/)                                                                           |

---

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing purposes.

### 1. Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18 or later)
*   [PNPM](https://pnpm.io/installation)
*   [Firebase CLI](https://firebase.google.com/docs/cli) (for deploying Cloud Functions)

### 2. Clone the Repository

\`\`\`bash
git clone https://github.com/bkrishnanair/huddle_v0.git
cd huddle_v0
\`\`\`

### 3. Set Up Environment Variables

This project requires API keys from Firebase and Google Cloud to function.

1.  Create a `.env.local` file in the root of the project:
    \`\`\`bash
    touch .env.local
    \`\`\`
2.  Add the following environment variables to the file, replacing the placeholders with your actual project credentials:
    \`\`\`env
    # Firebase Client SDK Configuration (for the browser)
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_fcm_vapid_key

    # Google Maps Configuration
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_google_maps_map_id

    # Firebase Admin SDK Configuration (for the server - get from Firebase Console)
    FIREBASE_PROJECT_ID=your_firebase_project_id
    FIREBASE_CLIENT_EMAIL=your_service_account_client_email
    FIREBASE_PRIVATE_KEY=your_service_account_private_key
    \`\`\`
    > **Note:** For the Google Maps API Key, ensure you have enabled the **Maps JavaScript API**, **Places API**, and **Geocoding API** in your Google Cloud Console.

### 4. Install Dependencies and Run

The repository includes an `.npmrc` file to automatically handle peer dependency issues during installation.

\`\`\`bash
# Install root project dependencies
pnpm install

# Run the development server with Turbopack
pnpm run dev
\`\`\`

The application should now be running on [http://localhost:3000](http://localhost:3000).

---

## Core Architectural Decisions

This project has been architected with a modern, secure, and production-ready structure.

*   **Secure by Default (Route Groups)**: Uses Next.js App Router's Route Groups to separate public routes (landing/login) from private, authenticated routes (`/discover`, `/map`, `/profile`, etc.). A secure layout acts as an authentication gateway, automatically redirecting unauthenticated users.
*   **Next.js 15 Compatibility**: Fully compatible with Next.js 15 async cookies() API and modern React patterns, ensuring future-proof development.
*   **Robust Authentication**: Hybrid authentication system with Firebase Auth for client-side and Firebase Admin SDK for server-side session verification using secure HTTP-only cookies.
*   **Server-Side Validation**: All critical API endpoints are secured with Zod schemas and proper authentication middleware, ensuring data integrity and security.
*   **Real-Time Features**: Combines server-side API routes for secure operations with Firestore real-time listeners for live chat and event updates.
*   **Performance Optimized**: Denormalized Firestore schema with geospatial indexing for fast location-based queries and viewport-optimized data fetching.
*   **Modern UI Architecture**: Consistent "glassmorphism" design system with Tailwind CSS, featuring responsive components and mobile-first approach.
---
