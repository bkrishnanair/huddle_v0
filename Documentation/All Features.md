# Huddle: Master Feature List

This document cleanly separates the core value propositions and technical features of the Huddle platform, split into our two primary user bases: **Users (Players/Attendees)** and **Organizers (Captains/Club Leaders)**.

---

## 🛠️ For Organizers (The B2B SaaS Layer)
*Huddle acts as a powerful, hidden CRM and event management tool for organizers, masquerading as a simple social app.*

*   **⚡ Frictionless Event Creation**: Drop a pin anywhere on the live global map, set your player capacity, date, and description in seconds. Uses native date/time pickers and deeply integrated Google Places autocomplete. **📍 Use Current Location** button auto-fills via reverse geocoding.
*   **🖥️ Virtual & Hybrid Events**: Create events as In-Person, Virtual (Zoom/Meet link), or Hybrid. Virtual events replace the map picker with a meeting link field.
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
*   **📍 Interactive "Video Game" Map**: A high-performance, decluttered Google Map filled with responsive, custom teardrop pins. Hover over a pin to see micro-animations and category-specific emojis (🏀, 💻, 🍕). Click a pin to summon the Event Details. **Zoom-adaptive sizing** — pins shrink at low zoom to reduce overlap.
*   **🔍 Unified Global Search**: A powerful Discover page that filters across Event Name, Event Category (Tech, Outdoors, Music, etc.), AND Location in real-time.
*   **🕙 Intelligent Discovery Filters**: 
    *   **Time-Based**: Tap chips for "Live" (happening right now), "Today", "This Week", or "This Weekend".
    *   **Distance-Based**: Adjust a slider from 5 to 50 miles away—powered by precise client-side Haversine math calculating exactly how far the event is from your actual current latitude/longitude.
    *   **Date Range**: Pick start and end dates via collapsible "More Filters" panel.
    *   **🎯 Recommended**: Smart filter merging profile interests with top joined categories.
*   **👥 One-Tap RSVPs**: Join an event with a single tap. See exactly how many slots are open. Unjoin with the same ease.
*   **👤 Glassmorphic Social Profiles**: Tap on a user's face to see their "Premium" dark-mode profile featuring their Bio, custom "Interests" tags, and a public history of what events they've hosted and attended.
*   **📊 Most Joined Categories**: Profile page shows your top 3 most-joined event categories with emoji icons, counts, and rank.
*   **🏆 Karma Score**: Users earn a gamified "Karma Score" calculated by their active participation and dependability in the ecosystem.
*   **🤝 Friends & Network (Social Graph)**: Users can build their profile by following other players and active organizers. Event cards display powerful social proof (`"🔥 N friends attending"`) when someone in their network joins an event.
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
7. Responsive Drawer Fix: Z-index layering overhauled so the Event Drawer rests exactly above the Map but safely behind the floating Bottom Navigation bar for continuous deep-linking.
8. Cloud Map Styles: Map UI aesthetics strictly bound to Google Cloud Console IDs, effortlessly suppressing Point of Interest (POI) clutter.

Phase 4 — UX Polish, Virtual Events & Personalization (DONE)

1. Virtual & Hybrid Events: `eventType` (in-person/virtual/hybrid) + `virtualLink` fields. Segmented toggle in Create Event. Virtual hides map, shows meeting link input.
2. Discover Filter Redesign: Category + Time chips always visible. Range + Date Range collapsed under "More Filters" toggle. Active filter indicator.
3. Emoji Icons Everywhere: Category-based emoji fallback (⚽🎵🤝📚🍕💻🎨🌲) in event cards, event details drawer, and map pins.
4. Zoom-Adaptive Map Pins: Pins scale from 28px (zoom ≤13) → 32px (14-15) → 40px (≥16) to reduce overlap at low zoom.
5. Profile Top Categories: "Most Joined Categories" card showing top 3 categories from past events with emoji, count, and rank.
6. Smart Recommended Filter: Merges `favoriteSports` + top joined categories (deduped) for broader recommendations on Map and Discover.
7. Use Current Location: GPS button in Create Event form — reverse geocodes to auto-fill address field.
8. Map Button Intent: Event card "Map" button zooms to pin without opening drawer (`intent=locate`).
9. Gallery Upload Cancel: Cancel button during photo uploads; graceful handling of `storage/canceled` errors.
10. Custom Question Delete: Trash button on saved question presets with API persistence.
11. Navbar Optimization: Height reduced ~15% (w-14/h-14 tabs, smaller icons/text). Z-index hierarchy: navbar z-[60], dialog/drawer z-[70], select dropdown z-[80].
12. Pin Reliability: Initial fetch on map mount ensures pins always load without requiring manual zoom.

Phase 5 — Social Graph & The Serendipity Engine (DONE)
1. Foundational Follow System: Atomic Firestore transactions reliably handle Follow/Unfollow/Block interactions. Custom `useFollowing` React Context stores the user's network in a local runtime `Set` for `O(1)` list lookups.
2. Network Building CTA: Profile pages show a sleek Call-to-Action to "Build your network" when a user has fewer than 5 followers, driving social engagement.
3. The Serendipity Filter (Background Fan-out): When a user joins an event, the system batches their followers and runs a strict filtering mechanism:
   - Interest Match: The follower must have the Event's category in their `favoriteSports` array (or have no filters set).
   - Distance Match: Utilizing `geofire-common`, the follower's `lastKnownLocation` must be within 25 miles of the Event.
4. Smart Location Debouncing: Custom background map-layer caches the `lastLocationSync` payload in `localStorage` and utilizes Google Maps Geometry to calculate real-world movement. It only POSTs to the DB if the user has physically moved >500 meters, saving massive horizontal scaling costs.
