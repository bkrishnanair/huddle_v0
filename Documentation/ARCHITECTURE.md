# Huddle System Architecture

This document details the high-level system design of the Huddle platform, focusing on our usage of Next.js 15, Turbopack, and advanced spatial rendering strategies in the browser.

## 1. High-Level System Design

Huddle is a **Serverless Full-Stack Application** built on the Next.js App Router paradigm.

*   **Frontend**: React Server Components (RSCs) and Client Components compiled via Turbopack and deployed to Vercel's Edge Network.
*   **Backend (Data)**: Cloud Firestore (NoSQL), offering sub-100ms read latency globally.
*   **Backend (Logic)**: Next.js API Routes (`app/api/*`) executing Node.js serverless functions on Vercel.
*   **Authentication**: Firebase Authentication (Client/Admin hybrid).
*   **Geospatial**: Google Maps Platform (`@vis.gl/react-google-maps`) handling complex map UI and Geofire for backend radial proximity queries.

## 2. In-App Notification System

Huddle features a robust notification system designed for real-time engagement without the overhead of immediate web push.

### Polling Mechanism
In the absence of Firebase Cloud Messaging (FCM) on a per-device level, Huddle uses an intelligent **Polling Strategy** in the `NotificationBell` component. It periodically fetches the `notifications` subcollection and tracks unread counts. This provides a "near real-time" feel for waitlist promotions and event announcements while maintaining minimal battery and data impact.

### Waitlist Promotions
When an attendee leaves an event, a backend **Transaction** automatically promotes the first person from the waitlist into the roster. The transaction also triggers a `createNotification` event, which adds a document to the promoted user's `notifications` subcollection.

## 3. Reliability & Trust Surfaces (Reliability Score)

To help organizers build high-quality communities, Huddle calculates a **Reliability Score (Show Rate)** for every user.

### Logic & Calculation
A user's show rate is a weighted percentage calculated by comparing:
- **Events RSVP'd**: The count of events the user has joined.
- **Checked-In Events**: The count of events where the organizer manually marked them as present or they used self-check-in.

This data is exposed on public profiles and in the **Organizer Dashboard** to help hosts prioritize reliable attendees.

## 4. Organizer Studio (Dashboard) Architecture

The **Organizer Dashboard (`/dashboard`)** is an analytical hub for event hosts.

### Data Aggregation
The dashboard API route performs high-performance aggregation across all events created by a user. It calculates:
- **Total RSVP Volume**: Across all historical and upcoming events.
- **Attendence Metrics**: Aggregated check-in rates to measure community engagement.
- **Event Performance Table**: A sortable, historical view of every event's success metrics.

### CSV Export Logic
The dashboard features an asynchronous CSV export tool. It sanitizes denormalized event data (like custom questions and pickup point strings) into a flattened format suitable for Excel or Google Sheets.

## 5. Map Rendering & Interaction Architecture

The heart of Huddle is `components/map-view.tsx`. Rendering a Google Map with hundreds of dynamic data points in React is handled via strict state management and debouncing.

### The "onIdle" Trigger
The `Map` component only fires its fetch function when the map *stops* moving (`onIdle` event). This prevents rapid-fire API calls during pan/zoom.

### Advanced Marker UX
We use `@vis.gl/react-google-maps` `<AdvancedMarker>` tags to inject Tailwind-styled React HTML directly onto the map canvas. This enables emojis, gradients, and CSS-based micro-animations (like `animate-pulse` for boosted events).

## 6. Secure Route Group Governance
The folder structure utilizes Next.js App Router Route Groups to enforce authorization at the layout level.

*   `app/(public)/*`: Allows unauthenticated access (Landing, `/login`).
*   `app/(app)/*`: Acts as an **authentication gateway**. The layout file observes the Firebase Auth Context and forces a redirect to `/login` for any non-public route.
