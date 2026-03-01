# Huddle: Master Feature List

This document cleanly separates the core value propositions and technical features of the Huddle platform, split into our two primary user bases: **Users (Players/Attendees)** and **Organizers (Captains/Club Leaders)**.

---

## 🛠️ For Organizers (The B2B SaaS Layer)
*Huddle acts as a powerful, hidden CRM and event management tool for organizers, masquerading as a simple social app.*

*   **⚡ Frictionless Event Creation**: Drop a pin anywhere on the live global map, set your player capacity, date, and description in seconds. Uses native date/time pickers and deeply integrated Google Places autocomplete.
*   **🔗 Secure Deep-Linking**: Stop fighting algorithmic feeds. Instantly generate a sharable `huddle://map?eventId=xyz` link that generates rich Open Graph previews in iMessage, Discord, or GroupMe and instantly pans the map to your event when clicked.
*   **⏳ Smart Waitlists (Atomic)**: Never over-sell and never leave empty seats. Huddle places excess capacity gracefully into a dynamic waitlist. If a confirmed RSVP cancels, the platform automatically pops the first waitlisted user into the active roster.
*   **📊 CRM & Loyalty Badges**: View a live roster of every player attending your event directly from the map. Huddle automatically calculates the historical attendance of everyone on your roster and highlights reliable users with a "🔥 Repeat Attendee" badge so you know who your real fans are.
*   **📥 CSV Exporting**: Need to supply a roster to your University or Club Sports administration? Click one button to download your exact Attendee list instantly into an Excel-ready `.csv` file.
*   **🔄 One-Click Event Cloning**: Running a weekly intramural practice? Hit "Duplicate" on your past event to spawn a pre-filled identical instance, perfectly clearing out the date & time to prevent accidental scheduling overlaps.
*   **💬 Integrated Chat Rooms**: Stop collecting phone numbers. Every single event spins up its own isolated, real-time chat room, allowing organizers to broadcast updates like *"We are on Court 2"* or *"Bring a white and dark shirt"* instantly.
*   **🗑️ Administrative Command**: Full CRUD capability. Have the undisputed power to delete your event directly from the feed or the map drawer if plans fall through.
*   **👻 Private "Stealth" Events**: The ability to host link-only private sessions that deliberately hide themselves from the global Discover feed, keeping your inner-circle runs exclusive.

---

## 🏃 For Users (The Social Consumer Layer)
*Huddle is the fastest way to find local, active pickup games and community events without needing a pre-existing social group.*

*   **🌍 Frictionless Guest Access**: Unauthenticated users can instantly explore the live map and Discover feed without hitting an aggressive auth wall. "Continue as Guest" allows you to browse freely until you actually want to join an event.
*   **📍 Interactive "Video Game" Map**: A high-performance, decluttered Google Map filled with responsive, custom teardrop pins. Hover over a pin to see micro-animations and category-specific emojis (🏀, 💻, 🍕). Click a pin to summon the Event Details.
*   **🔍 Unified Global Search**: A powerful Discover page that filters across Event Name, Event Category (Tech, Outdoors, Music, etc.), AND Location in real-time.
*   **🕙 Intelligent Discovery Filters**: 
    *   **Time-Based**: Tap chips for "Next 2 Hrs", "Today", or "This Weekend".
    *   **Distance-Based**: Adjust a slider from 5 to 50 miles away—powered by precise client-side Haversine math calculating exactly how far the event is from your actual current latitude/longitude.
*   **👥 One-Tap RSVPs**: Join an event with a single tap. See exactly how many slots are open. Unjoin with the same ease.
*   **👤 Glassmorphic Social Profiles**: Tap on a user's face to see their "Premium" dark-mode profile featuring their Bio, custom "Interests" tags, and a public history of what events they've hosted and attended.
*   **🏆 Karma Score**: Users earn a gamified "Karma Score" calculated by their active participation and dependability in the ecosystem.
*   **📱 Native Mobile UX**: Scrollable horizontal filter chips and dedicated bottom-padding ensures nothing gets cut off by the floating glass navigation bar when using Huddle on your phone.


Phase 1 — Conversion & Reliability (DONE on feature/guest-rsvp)

Guest RSVP (Anonymous): Join with name (+ optional note) without signup.
Organizer Notes CRM: Notes visible inline in Organizer roster & CSV.
Real‑time Event CRM: onSnapshot() live roster + capacity meter.
Organizer Controls: Kick attendee → auto‑promote from waitlist; edit event (PUT /api/events/[id]).
Pinned Announcements: Organizer can pin messages; proper guest display names.
Auto‑refresh UI: Key views re-render on data change.

Phase 2 — Organizer Ops & Logistics Toolkit (Sprint A, DONE on feature/guest-rsvp)

RSVP Questions (Presets): Ride? Dietary? (forced answers at RSVP).
Pickup Points & Times: Organizer defines; attendee must select at RSVP.
“Limited Seating” Badges: Feed cards + drawer when ≤3 seats left.
Logistics Summary: Grouped counts (rides/pickups) + CSV columns.
Scheduled Messages (Cron): /api/cron/scheduled-messages posts timed announcements to chat.

Phase 3 — Growth, Quality & Comms (DONE on feature/guest-rsvp)

1. Organizer Presets: Save/Load questions and transit tips from profile.
2. Scheduled Messages Builder: UI for relative timed broadcasts (-24h, -2h, etc).
3. Conflict Detection: Real-time warning for overlapping organized events (+/- 1.5h).
4. Calendar Integration: "Add to Calendar" buttons (Google & ICS) for attendees.
5. Live Check-ins: Mark attendance in-app; status reflected in CSV export.
6. Attendance History: New tab in My Events for past activity tracking.
7. Responsive Drawer Fix: Capped height (96vh) and scrollable containers for all screen sizes.
