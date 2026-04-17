# Huddle - V4.0 Platform Maturity Release

Huddle is a modern, full-stack web application designed to help users discover, create, and join local events. Centered around an interactive map and a curated Home feed, it provides a seamless experience for finding nearby events, creating events, and engaging with other participants through real-time chat, social profiles, and automated reminders.

This production-ready application features a complete authentication system, real-time event management, and interactive social features, creating an engaging and reliable user experience for sports enthusiasts.

| Landing Page | Maps Feed | Discover |
| :---: | :---: | :---: |
| ![Landing Page](Pages/landing%20page.jpeg) | ![Maps View](Pages/Maps.png) | ![Discover Feed](Pages/discover.jpeg) |

| My Events | Create Event | Profile |
| :---: | :---: | :---: |
| ![My Events](Pages/My%20events.jpeg) | ![Create Event](Pages/create%20event.jpeg) | ![Profile Page](Pages/Profile.jpeg) |

---

## 🚀 Key Features & Functionality

### 🌍 Frictionless Guest Access & Discovery
*   **Live Interactive Map**: Unauthenticated users can instantly explore the live map and Discover feed. 
*   **Transit-Inspired Color Theming**: A vibrant "Sunset Transit" color palette universally paints event cards, discovery filters, and map pins based on category for rapid visual scanning.
*   **Premium Map Pins**: Custom React teardrop nodes featuring rich gradients, drop shadows, and scale-on-hover micro-animations. Categorizes events via custom emojis. **Zoom-adaptive sizing** — pins shrink at low zoom to reduce overlap and improve click accuracy.
*   **Discovery Filters**: Surface events happening "Live", "Today", "This Week", or "This Weekend" with a single tap. Defaults to "This Week" for best initial relevance. Collapsible "More Filters" panel for Range and Date Range to keep the UI clean.
*   **👁️ View Count Tracking**: Every unique event view is tracked via `POST /api/events/[id]/view` with session-level deduplication. View counts appear on event cards alongside RSVP counts.
*   **🔴 "Happening Now" Live Badge**: The Map tab in the bottom navigation displays a real-time red badge showing the count of currently live events, refreshing every 5 minutes.
*   **💡 First-Visit Onboarding**: A 3-step walkthrough tooltip guides new users through map exploration, filter usage, and event creation. Dismissed via skip or completion, persisted in localStorage.
*   **🌙 Night-Light Pin Tiers**: At low zoom levels, the map simplifies to three visual tiers: glowing dot pins (future), medium emoji pins (imminent ≤6h), and pulsing live pins (ongoing) — reducing visual clutter while preserving at-a-glance information.
*   **Virtual & Hybrid Events**: Create events as In-Person, Virtual (Zoom/Meet link), or Hybrid. Virtual events hide the map picker and show a meeting link field instead.
*   **Cloud Console Styling**: Map visual themes (like Dark Mode and Point of Interest decluttering) are natively controlled via Google Cloud Map IDs without local style overrides.


### 📊 Organizer Logistics & CRM (Organizer Studio)
*   **Organizer Dashboard**: High-level analytics to track event performance, total RSVPs, and average show rates.
*   **Advanced RSVP Logic**: Require answers to custom logistics questions ("Dietary restrictions?") and force selection of specific **Pickup Points**. Save and delete question presets.
*   **Multi-Location Organization Support**: Traveling clubs can define an "Org HQ" location alongside the actual event venue to ensure local members easily discover the event.
*   **CSV Exports**: One-click roster downloads now include attendee notes, question responses, and checkout flags.
*   **One-Click Cloning**: Instantly duplicate repetitive events while safely blanking date/time fields to prevent scheduling overlaps.
*   **📍 Use Current Location**: One-tap GPS button in the event creation form auto-fills the address via reverse geocoding.

### 👥 Reliability & Trust Signal
*   **Live Check-Ins**: Organizers can open check-in at the event start; attendees use "self-check-in" to verify presence.
*   **Reliability Score**: Public profiles now feature a calculated "Show Rate" based on historical check-in data to reduce no-shows.
*   **Smart Waitlists (Atomic)**: Built-in waitlist system preventing over-selling. Uses `adminDb.runTransaction()` to safely handle overflow and automatic promotion when a slot becomes available.

### 🛡️ Safety & Moderation Layer
*   **User Blocking**: Organizers can block problematic users from seeing or joining their future events.
*   **Reporting Suite**: Users can report events, profiles, or gallery photos for administrative review.
*   **Event Photo Gallery**: Shared memory spaces post-event. Contributors can upload photos (< 10MB) to preserve the game's highlights. Includes upload cancel functionality.
*   **📊 Most Joined Categories**: Profile page shows your top 3 most-joined event categories with emoji icons and counts.
*   **🎯 Smart Recommended Filter**: Map and Discover "Recommended" filter merges your profile interests with your top joined categories for personalized event discovery.

### 🌐 Social Graph & Serendipity Engine
*   **Atomic Follow System**: Users can build their network by following active organizers and friends. Transactions securely synchronize follower/following counts globally.
*   **Optimized Social Proof**: Event cards instantly highlight `"🔥 N friends attending"` if someone in your network RSVPs.
*   **The Serendipity Filter**: A highly-targeted algorithm that evaluates physical distance (`geofire-common`) and declared user interests to ping followers with high-urgency app notifications ("`🔥 Your friend is playing basketball near you! Join them?`") when relevant games are created. Location tracking is aggressively debounced on the client to drastically conserve database writes.

### 💬 Real-Time Communication & Automation
*   **Live Event Chat**: Instant messaging for all confirmed participants with **Pinned Announcements** from the host.
*   **In-App Notifications**: Near real-time alerts for waitlist promotions, event changes, and host updates.
*   **Automated Scheduling (Cron)**: Vercel Cron jobs automatically broadcast scheduled messages to the event chat at pre-defined intervals.
*   **🧹 Event Expiry Auto-Cleanup**: Nightly cron (`/api/cron/cleanup`) auto-archives events older than 48 hours to keep the feed fresh.
*   **⏱️ Event Countdown Timer**: Events starting within 6 hours show a live "Starts in Xh Ym" countdown pill in the event details drawer, updating every minute.
*   **🎉 Post-Creation Share Card**: After creating an event, a glassmorphic overlay displays the deep link with one-tap copy and native share support for instant distribution.
*   **🌐 TerpLink Event Scraper**: `POST /api/scrape/terplink` imports upcoming campus events from UMD's TerpLink Engage API, with automatic category mapping and deduplication.
*   **📊 Admin Dashboard**: Protected `/admin` page displaying platform-wide metrics (total events, users, views, RSVPs, live count) with category distribution charts and one-click TerpLink import.
*   **✨ AI Description Enhancer**: Click the ✨ button in the event creation modal to automatically rewrite rough descriptions into engaging, structured text (powered by Gemini) and receive suggested transit tips & RSVP questions.
*   **🤖 Natural Language Vibe Search**: Search for "free food near me" or "coding workshop this weekend" and watch the AI parse intent into precise category, time, location, and keyword filters.

### 🏠 Home Feed & Discovery
*   **Home Feed Page**: Dedicated `/home` page as the default authenticated landing page with curated sections: "Happening Now" (horizontal carousel with pulsing live indicators), "Browse by Category" (color-coded grid with event counts), "Popular This Week" (sorted by RSVPs), and "New on Huddle" (recently created).
*   **Recurring Event Deduplication**: Server-side grouping via `?groupRecurring=true` — recurring event series show as a single card with a teal "🔁 Recurring: Weekly · N upcoming" badge instead of cluttering the feed with duplicates.
*   **Search by Organizer Name**: Typing 2+ characters in the Discover search bar triggers a debounced organizer search, showing matching user profiles as clickable cards above event results.

### 🎯 Organizer Acquisition & Retention
*   **Claim This Event**: Scraped TerpLink events display a "Claim This Event" CTA in the event drawer. Club organizers can claim ownership with one tap — the scraped doc is archived and a new organizer-owned event doc is created with all data pre-filled.
*   **Post-Event Attendance Prompt**: An hourly cron job detects recently-ended events and sends organizers a notification: "How many people showed up?" plus "Schedule again next week?" Builds the show-rate metric for every pitch.

### 📢 Communication & Privacy
*   **Announcement Update Indicator**: When an organizer pins an announcement, event cards on My Events show a pulsing orange "New update" dot with badge. `lastAnnouncementAt` timestamp drives the indicator.
*   **Guest Contact Sharing Toggle**: Guest RSVP flow now includes an opt-in "Share my email with the organizer?" toggle (off by default). Respects guest privacy while enabling organizer-attendee communication when wanted.

---

## 🛠️ Tech Stack

| Category      | Technology                                                                                             |
| :------------ | :----------------------------------------------------------------------------------------------------- |
| **Framework** | [**Next.js**](https://nextjs.org/) (v15 App Router) & [**Turbopack**](https://turbo.build/pack)        |
| **Language**  | [**TypeScript**](https://www.typescriptlang.org/) (Strictly typed with `GameEvent` interfaces)         |
| **Backend**   | [**Firebase**](https://firebase.google.com/) (Auth, Firestore, Admin SDK, Storage)                     |
| **Validation**| [**Zod**](https://zod.dev/) (Strict server-side validation)                                            |
| **Mapping**   | [**Google Maps Platform**](https://developers.google.com/maps) (`@vis.gl/react-google-maps`)           |
| **Styling**   | [**Tailwind CSS**](https://tailwindcss.com/) & [**Shadcn/ui**](https://ui.shadcn.com/)                 |
| **Deployment**| [**Vercel**](https://vercel.com/) (Frontend edge network & Cron jobs)                                  |

---

## 🤝 Getting Started

### 1. Installation
1.  Clone the repository.
2.  Install dependencies: `pnpm install`.
3.  Configure `.env.local` using the template provided in the documentation.

### 2. Local Data Seeding
To populate your local map with realistic, UMD-specific events (centered around the March 3rd – 30th range), run the idempotent seeding suite:
```bash
npx ts-node scripts/seed_umd.ts
```

### 3. Run Development Server
```bash
pnpm run dev
```

---

## 📂 Internal Documentation

For more detailed guides, please refer to our **Documentation** folder:
- [DATABASE.md](./Documentation/DATABASE.md): Schema and core collections.
- [API_ROUTES.md](./Documentation/API_ROUTES.md): Reference for all Next.js 15 endpoints.
- [SECURITY.md](./Documentation/SECURITY.md): Dual-Auth and Atomic Transaction model.
- [ARCHITECTURE.md](./Documentation/ARCHITECTURE.md): System design and spatial rendering strategies.
- [DEPLOYMENT.md](./Documentation/DEPLOYMENT.md): Guide for deploying to Vercel/Firebase.
- [DEVELOPER_GUIDE.md](./Documentation/DEVELOPER_GUIDE.md): Local setup and coding standards.
