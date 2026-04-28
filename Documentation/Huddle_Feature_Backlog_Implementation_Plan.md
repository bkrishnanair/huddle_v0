# HUDDLE — Feature Backlog Implementation Plan
## Organized by Phase: Quick Fixes → Pre-Summer → Summer Sprint → Fall Launch → Future
## Date: April 2026

---

## ARCHITECTURAL CONTEXT FOR AGENTS

This document is designed to be fed directly into Antigravity (Gemini) or Claude Code agents with full workspace context. All implementations must follow these rules:

- **Framework:** Next.js 15 App Router, Turbopack, TypeScript strict
- **Backend:** Firebase (Auth, Firestore, Admin SDK, Storage), Vercel deployment
- **Styling:** Tailwind CSS + Shadcn/ui, dark glassmorphism aesthetic (bg-slate-950)
- **Icons:** Lucide React only
- **Server isolation:** `import 'server-only'` on all server modules. Admin SDK never in client bundles.
- **Validation:** Zod on every API route input
- **Counters:** `FieldValue.increment()` — never read-then-write
- **Existing patterns:** Review `lib/constants.ts` for CATEGORY_COLORS and CATEGORY_EMOJI maps

---

## PHASE 0: IMMEDIATE FIXES (Ship Today)
*These are bugs or credibility gaps. Fix before any new features.*

---

### 0.1 — Favicon Update (Completed)
**What:** Replace the default Next.js favicon with the Huddle logo in the browser tab.
**Why:** Default favicon = "student project." Custom favicon = "real product." Every judge, advisor, and user notices this.
**How:** Place `favicon.ico` (32x32) and `icon.png` (192x192) in `app/` directory. Next.js App Router auto-detects files named `favicon.ico`, `icon.png`, and `apple-icon.png` in the `app/` root. Also add `opengraph-image.png` for social sharing previews.
**Files:** `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`
**Time:** 10 minutes
**Complexity:** Trivial

---

### 0.2 — Recurring Event Display Bug
**What:** Recurring events show as multiple separate entries in the Discover feed, cluttering the page.
**Why:** When an organizer creates a weekly recurring event for 8 weeks, the Discover feed shows 8 identical-looking cards. Users see the same event repeated and think the app is broken.
**How:** In the Discover page query and the map event fetch, add grouping logic for events sharing the same `parentEventId`. Show only the **next upcoming instance** of a recurring series. Add a small badge: "Recurring: Weekly" with a tap-to-expand that shows all future instances. The grouping should happen server-side in `GET /api/events` by deduplicating on `parentEventId` and returning only the instance with the nearest future `date`.
**Implementation detail:** Add a query parameter `?groupRecurring=true` to the events API. When set, the API groups events by `parentEventId`, picks the soonest future instance per group, and attaches a `recurringCount` field to the response indicating how many future instances exist.
**Files:** `app/api/events/route.ts` (grouping logic), `components/event-card.tsx` (recurring badge), `app/(app)/discover/page.tsx` (pass groupRecurring param)
**Time:** 1.5 hours
**Complexity:** Moderate

---

### 0.3 — Authenticated Route for In-App Icon Click
**What:** When a logged-in user clicks the Huddle logo/icon in the navbar, it currently navigates to the public landing page. It should navigate to the map or a feed page instead.
**Why:** The landing page is for unauthenticated visitors. Authenticated users clicking the logo and seeing a "Sign Up" page is a broken experience.
**How:** In the navbar/header component, check auth state. If authenticated, the logo links to `/map`. If unauthenticated, it links to `/` (landing page). This is a one-line conditional in the `href` prop.
**Files:** `components/bottom-nav.tsx` or `components/header.tsx` (wherever the logo link lives)
**Time:** 10 minutes
**Complexity:** Trivial

---

## PHASE 1: PRE-SUMMER (Build Before Graduation — May 2026)
*These directly support organizer onboarding and the xFoundry 75-user threshold.*

---

### 1.1 — Bulk Event Creation (AI Schedule Import)
**What:** Let organizers upload or paste their entire semester event schedule, and Huddle creates all events at once using Gemini to parse the input.
**Why:** This is the single highest-impact organizer retention feature. Creating events one-by-one weekly causes drop-off. If the Running Club captain uploads their 15-week schedule in one session, the map stays populated for months with zero ongoing effort.
**How:**
1. Add a "Import Schedule" button to the create event modal or the organizer dashboard.
2. The organizer pastes text (a list of dates/times/locations), uploads a screenshot, or shares a Google Doc link.
3. The text/image is sent to `POST /api/ai/parse-schedule`.
4. The server passes the content to Gemini with a system prompt: "Extract a list of events from this schedule. For each event, return: title, date (ISO), time (HH:mm), location, capacity (default 50 if not specified), category, description. Return as a JSON array."
5. The parsed events are returned to the client as a preview list. The organizer reviews, edits any details, and confirms.
6. On confirmation, a batch `POST /api/events/bulk` creates all events in a single Firestore batch write, each linked via `parentScheduleId` to group them.
7. Each event in the batch gets the organizer's `createdBy` UID, their default presets (RSVP questions, transit tips), and the recurring metadata.

**API Routes to Create:**
- `POST /api/ai/parse-schedule` — Gemini parses raw text/image into structured events
- `POST /api/events/bulk` — Batch creates events from a confirmed array

**UI Components:**
- `components/schedule-import-modal.tsx` — Upload/paste interface with preview table
- Add button to `app/(app)/dashboard/page.tsx` and `components/create-event-modal.tsx`

**Model:** gemini-2.5-flash-preview (text or multimodal if image input)
**Time:** 4 hours
**Complexity:** Moderate-High

---

### 1.2 — Event Scraping Enhancement: "Claim This Event" Flow
**What:** Scraped TerpLink events currently appear as read-only pins. Add a "Claim This Event" CTA that lets the real organizer take ownership.
**Why:** Every scraped event is an acquisition funnel. When a club president sees their event on Huddle but can't manage RSVPs, the claim flow converts them from a passive observer to an active organizer — with zero cold outreach needed on your part.
**How:**
1. On scraped event detail drawers, show a prominent CTA: "Are you the organizer? Claim this event to enable RSVPs and manage attendance."
2. Tapping "Claim" opens the create-event-modal pre-filled with all scraped data (title, date, time, location, description, category).
3. The organizer verifies/edits the details and publishes. The new event replaces the scraped event (delete the scraped doc, create a new organizer-owned doc with `source: 'claimed'` and `claimedFrom: scrapedEventId`).
4. The organizer is now a Huddle user with a managed event, CRM access, waitlist tools, and analytics.

**Files:**
- `components/event-details-drawer.tsx` (claim CTA for scraped events)
- `components/create-event-modal.tsx` (pre-fill from scraped data)
- `app/api/events/claim/route.ts` (delete scraped doc, create owned doc)
- `types.ts` (add `source: 'claimed'` and `claimedFrom` fields)

**Time:** 2 hours
**Complexity:** Moderate

---

### 1.3 — Post-Event Attendance Prompt (Completed)
**What:** After an event ends, prompt the organizer: "How many people actually showed up?" + "Want to schedule this again next week?"
**Why:** This gives you the show-up rate metric (the single most important number for your pitch) and creates a one-tap retention loop for recurring organizers.
**How:**
1. Add a Vercel cron job that runs hourly: `api/cron/post-event-prompt`. It scans events that ended in the last 2 hours where `postEventPromptSent !== true`.
2. For each, write a notification to the organizer's subcollection: type `'post_event'`, with a custom payload: `{ eventId, eventName, message: "Your event just ended! How many showed up?", actions: ['report_attendance', 'clone_event'] }`.
3. When the organizer taps "Report Attendance," show a simple number input. Save to the event doc as `reportedAttendance: number`.
4. When the organizer taps "Schedule Again," open the clone flow with the same event pre-filled and date advanced by 7 days.
5. The reported attendance data feeds your admin metrics dashboard and the reliability score computation.

**Files:**
- `app/api/cron/post-event-prompt/route.ts`
- `components/post-event-modal.tsx` (attendance input + clone CTA)
- `types.ts` (add `reportedAttendance`, `postEventPromptSent` fields)
- `vercel.json` (add cron)

**Time:** 2 hours
**Complexity:** Moderate

---

### 1.4 — Organizer Onboarding Wizard
**What:** A 3-step guided flow for new organizers: (1) Create org profile with logo and description, (2) Create first event or import schedule, (3) Share the link.
**Why:** New organizers currently land on a blank dashboard. A guided wizard increases completion rate from "signed up" to "first event published."
**How:**
1. Track onboarding state: `users/{uid}.onboardingComplete: boolean`.
2. If `false` and the user navigates to `/dashboard`, redirect to `/onboarding`.
3. Step 1: Upload profile photo + bio + org name. Save to user doc.
4. Step 2: Choose "Create One Event" or "Import Schedule." Routes to the appropriate creation flow.
5. Step 3: After event creation, show the post-creation share card (already built) with the deep link and native share button.
6. Set `onboardingComplete: true` on completion.

**Files:**
- `app/(app)/onboarding/page.tsx` (3-step wizard)
- `app/(app)/dashboard/page.tsx` (redirect check)
- `types.ts` (add `onboardingComplete` to User type)

**Time:** 2.5 hours
**Complexity:** Moderate

---

### 1.5 — Individual vs. Organizational Event Distinction (Completed)
**What:** Visual and data distinction between events created by individuals (casual pickup games) and events created by verified organizations (official club events).
**Why:** As the platform grows, users need to distinguish "random person's pickup basketball" from "UMD Intramural Sports official practice." Organizations get a blue check badge. Individual events are unmarked.
**How:**
1. Add `accountType: 'individual' | 'organization'` to the user schema.
2. Organizations apply for verification through a simple form (org name, affiliation, proof). Store as `verificationStatus: 'pending' | 'verified' | 'rejected'`.
3. Verified orgs get a blue checkmark badge on their profile and on all their event cards/pins.
4. Add filter chips to map and discover: "All Events," "Organizations Only," "Individuals Only."
5. TerpLink-scraped events display a separate "Campus Official" badge (already built). Claimed events inherit the organizer's verification status.

**Files:**
- `types.ts` (accountType, verificationStatus on User)
- `app/(app)/settings/verification/page.tsx` (verification form)
- `components/event-card.tsx` (badge rendering)
- `components/map-view.tsx` (filter chips)
- `app/api/admin/verify/route.ts` (admin approves/rejects verification requests)

**Time:** 3 hours
**Complexity:** Moderate

---

## PHASE 2: SUMMER SPRINT (June — August 2026)
*These improve discovery, retention, and prepare for the Fall new-student rush.*

---

### 2.1 — Feed / Home Page (Completed)
**What:** A new "Home" tab (replacing or complementing the current landing page link) showing curated event content: "Happening Now," "Popular This Week," "New on Huddle," and "Browse by Category." (Includes Task 7 Discover Sections separating Organic vs Scraped events).
**Why:** The map is for geographic exploration. The feed is for curated browsing. Users who habitually check "what's happening today" need a scroll-friendly interface, not a map zoom. This is the Luma-style discovery page adapted for campus.
**How:**
1. New route: `app/(app)/home/page.tsx`.
2. Sections:
   - **Happening Now:** Events where current time is between start and end. Pulsating live indicator. Horizontal scroll carousel.
   - **Popular This Week:** Events sorted by `currentPlayers` desc within the next 7 days. Vertical card list.
   - **New on Huddle:** Events sorted by `createdAt` desc, limited to 10. Shows "just added" timestamp.
   - **Browse by Category:** Grid of category cards (Sports, Tech, Music, etc.) with event counts per category and the Sunset Transit color coding. Tap a category to filter.
   - **From Your Network:** Events where users you follow are attending. Uses the social proof badge data already computed.
3. Add "Home" as the first tab in the bottom nav. Tab order becomes: Home, Map, Discover, My Events, Profile.
4. The Huddle logo in-app now navigates to Home (not the landing page).

**Files:**
- `app/(app)/home/page.tsx`
- `components/home-section-carousel.tsx` (horizontal scroll section)
- `components/category-browse-card.tsx` (category grid)
- `components/bottom-nav.tsx` (add Home tab)
- `app/api/events/featured/route.ts` (aggregation endpoint for home sections)

**Time:** 6 hours
**Complexity:** Moderate-High

---

### 2.2 — Multi-Admin Events
**What:** Event creators can add co-admins who can manage the roster, send announcements, open check-in, and export CSV.
**Why:** Clubs have exec boards. The VP of Events creates the event, but the President and Secretary need to manage it too. Single-admin events create a bottleneck.
**How:**
1. Add `admins: string[]` field to the event schema (array of UIDs). The creator's UID is always included.
2. In the event settings (edit flow), add an "Add Co-Admin" field. The organizer searches for a Huddle user by name/email and adds them.
3. All admin-gated operations (kick user, pin announcement, open check-in, export CSV, edit event) check `admins.includes(currentUser.uid)` instead of `createdBy === currentUser.uid`.
4. Co-admins see the event in their "My Events" page under an "Admin" tab alongside "Hosting" and "Attending."

**Files:**
- `types.ts` (add `admins: string[]` to GameEvent)
- `app/api/events/[id]/admins/route.ts` (add/remove co-admin)
- All admin-gated API routes (rsvp/remove, chat/pin, checkin, edit) — update auth check
- `app/(app)/my-events/page.tsx` (add "Admin" tab)
- `components/event-settings.tsx` (co-admin UI)

**Time:** 4 hours
**Complexity:** Moderate

---

### 2.3 — Search by Organizer Name
**What:** Users can search for an organizer (e.g., "UMD Running Club") in the Discover search bar and see all their upcoming events.
**Why:** Users who know the org name but not the event title need a direct path. This also supports Mary Kate's "program directory" concept — browse all events from a specific organization.
**How:**
1. In the Discover search bar, detect if the query matches a user/org name rather than an event title.
2. Add a `GET /api/users/search?q=running+club` endpoint that queries users by `displayName` (case-insensitive prefix match).
3. If results are found, show an "Organizer" result card above event results. Tap to see an organizer profile page with all their upcoming events listed.
4. The organizer profile page already exists — this just adds a search entry point to it.

**Files:**
- `app/api/users/search/route.ts`
- `app/(app)/discover/page.tsx` (dual search: events + organizers)
- `components/organizer-search-result.tsx`

**Time:** 2 hours
**Complexity:** Low-Moderate

---

### 2.4 — Anonymous Guest RSVP with Optional Contact Sharing
**What:** Enhance the existing guest RSVP flow with an opt-in toggle: "Share your name and email with the organizer?"
**Why:** Some guests want to remain anonymous. Others want the organizer to be able to contact them. Giving the choice respects privacy while enabling organizer-attendee communication.
**How:**
1. In the guest RSVP flow, add a toggle: "Share contact info with organizer" (default: off).
2. If toggled on, show optional fields: name (already exists), email, phone.
3. Store the contact info in the event's `guestRsvps` map, flagged as `contactShared: true`.
4. In the organizer's roster view, contacts from guests who opted in show their info. Others show "Anonymous Guest."
5. For organizer profiles: add a "Contact" section in profile settings where they can choose to display their email, phone, or social links publicly.

**Files:**
- `components/guest-rsvp-modal.tsx` (contact toggle + fields)
- `components/event-roster.tsx` (conditional contact display)
- `app/(app)/profile/settings/page.tsx` (organizer contact visibility)
- `types.ts` (update guestRsvp type)

**Time:** 1.5 hours
**Complexity:** Low-Moderate

---

### 2.5 — SEO for Event Pages (Completed)
**What:** Make each event page discoverable on Google with proper meta tags, Open Graph data, and JSON-LD structured data.
**Why:** When someone Googles "pickup basketball UMD" or "events near College Park tonight," your event pages should appear. This is free organic traffic.
**How:**
1. Each event needs a public URL: `huddlemap.live/event/[id]` (not behind auth).
2. Use Next.js `generateMetadata()` in the event page to output dynamic title, description, and OG tags.
3. Add JSON-LD structured data using schema.org/Event format: name, startDate, endDate, location (with geo coordinates), organizer, offers (free), eventAttendanceMode.
4. Create a dynamic `sitemap.xml` that lists all active public events. Next.js App Router supports `app/sitemap.ts` that generates this automatically.
5. Ensure Googlebot can crawl these pages (no auth wall on public event detail pages).

**Files:**
- `app/event/[id]/page.tsx` (public event page with generateMetadata)
- `app/sitemap.ts` (dynamic sitemap generator)
- `lib/seo.ts` (JSON-LD schema builder)

**Time:** 3 hours
**Complexity:** Moderate

---

### 2.6 — Weekly Organizer Digest Email
**What:** Every Monday, send active organizers a summary email: "Last week: 3 events, 47 RSVPs, 38 attended (81% show rate). Your most reliable attendees: [names]."
**Why:** This keeps organizers engaged even when they don't open the app. It's the dashboard experience delivered to their inbox. And it reminds them their data lives on Huddle, increasing switching costs.
**How:**
1. Vercel Cron job: `api/cron/organizer-digest`, runs Monday 9 AM EST.
2. For each user who created at least 1 event in the past 14 days:
   - Aggregate: events hosted, total RSVPs, total check-ins, show rate, top 3 reliable attendees.
   - Generate email HTML using a template.
   - Send via a transactional email service (Resend, SendGrid, or Amazon SES — Resend is cheapest and has a generous free tier).
3. Include CTA buttons: "View Dashboard," "Create Next Event," "Share Your Page."
4. Store `emailPreferences.digest: boolean` on user doc to allow opt-out.

**Files:**
- `app/api/cron/organizer-digest/route.ts`
- `lib/email.ts` (Resend SDK wrapper, server-only)
- `lib/email-templates/organizer-digest.tsx` (React email template)
- `vercel.json` (add cron)
- `types.ts` (add emailPreferences to User)

**Time:** 4 hours
**Complexity:** Moderate (new external dependency: email service)

---

### 2.7 — Announcement/Update Visibility for Joined Events
**What:** When an organizer posts an update to an event a user has joined, show a visual indicator on the event card in "My Events" and in the notification drawer.
**Why:** After RSVPing, users miss critical updates ("moved to Court 3," "event delayed 30 min") because they don't re-open the event detail. Making updates visible on the card surface ensures attendees stay informed.
**How:**
1. When an organizer pins an announcement or sends a scheduled message, update a `lastAnnouncementAt` timestamp on the event doc.
2. On the "My Events" page, compare `lastAnnouncementAt` with the user's `lastViewedAt` timestamp for that event.
3. If the announcement is newer, show a small orange dot indicator on the event card: "New update."
4. Tapping the card opens the drawer, which shows the pinned announcement prominently at the top.
5. On open, update the user's `lastViewedAt` for that event.

**Files:**
- `types.ts` (add `lastAnnouncementAt` to GameEvent)
- `app/(app)/my-events/page.tsx` (new update indicator)
- `components/event-card.tsx` (orange dot rendering)
- Chat/announcement API routes (update `lastAnnouncementAt` on pin)

**Time:** 2 hours
**Complexity:** Low-Moderate

---

## PHASE 3: FALL 2026 LAUNCH FEATURES
*Build during September for the new-student acquisition sprint.*

---

### 3.1 — Under-18 Event Verification (Youth Safety)
**What:** Events marked as "youth" or "under-18" require additional organizer verification (government ID or organizational affiliation proof) and display a safety badge.
**Why:** Mary Kate Crawford flagged youth safety as critical for the Montgomery County partnership. This is a compliance requirement, not a nice-to-have.
**How:** Add an `ageRestriction: 'all' | '18+' | 'under-18' | 'family'` field to events. Events with `under-18` require the organizer to have `verificationStatus: 'verified'`. Unverified organizers cannot create youth events. Youth events display a prominent safety badge and require attendees to acknowledge a safety waiver at RSVP time.
**Time:** 4 hours
**Complexity:** Moderate

---

### 3.2 — Global/Local View Toggle (Completed)
**What:** A toggle that switches between hyperlocal view (your campus) and a zoomed-out regional view (city/county). (Includes Task 5 Pin Clustering and Task 6 Map List Mobile Merge/Limits).
**Why:** Needed for multi-campus expansion and the Montgomery County pilot. When browsing locally, show full-detail pins. When browsing globally, show aggregated activity clusters.
**How:** Add a toggle button on the map. Local mode: zoom to user's campus, show individual pins. Global mode: zoom to metropolitan area, cluster nearby events into count bubbles (use Google Maps MarkerClusterer). Tapping a cluster zooms in to reveal individual pins.
**Time:** 3 hours
**Complexity:** Moderate

---

### 3.3 — PWA (Progressive Web App)
**What:** Add manifest.json, service worker, and meta tags so users can "install" Huddle to their home screen.
**Why:** App Store presence without App Store review. Users get a full-screen, native-feeling experience with an icon on their phone.
**How:** Install `next-pwa`. Configure `manifest.json` with Huddle icons, theme colors, and display mode. The service worker caches static assets and the last-loaded map region for instant re-render on reopening.
**Time:** 3 hours
**Complexity:** Moderate

---

## PHASE 4: FUTURE (Post-Funding)
*These require user scale, team growth, or external partnerships.*

---

### 4.1 — Capacitor Native App Wrapper
iOS and Android app store listings. Wrap the existing Next.js app in Capacitor. Add FCM push notifications. Requires Apple Developer Account ($99/yr) and Google Play Developer Account ($25). Build after PWA validates mobile usage patterns.

### 4.2 — Payment Integration (Huddle Pro + Ticket Fees)
Stripe Connect for organizer subscriptions and event ticket transaction fees. Requires Delaware C-Corp conversion and bank account setup. Build after hitting 50 active organizers.

### 4.3 — University Enterprise Dashboard
White-labeled admin portal for Student Affairs: aggregated event attendance data, category breakdown, venue utilization, retention correlation metrics. Build after landing a university pilot agreement.

### 4.4 — Multi-Campus Expansion Playbook
Campus ambassador program, per-campus data seeding, campus-specific category customization, cross-campus event discovery. Build after achieving local monopoly at UMD (1,000 WAU).

### 4.5 — Agentic RAG + A2A Migration
Decompose Gemini features into ADK agents. Deploy on Vertex AI Agent Engine. Enable A2A protocol for inter-agent communication. Build after Series A when infrastructure investment is justified.

---

## EXECUTION SUMMARY

| Phase | Items | Total Time | Deadline |
|-------|-------|------------|----------|
| Phase 0: Immediate Fixes | 3 items | 2 hours | This week |
| Phase 1: Pre-Summer | 5 items | 14 hours | Before May 20 graduation |
| Phase 2: Summer Sprint | 7 items | 22.5 hours | June-August 2026 |
| Phase 3: Fall Launch | 3 items | 10 hours | September 2026 |
| Phase 4: Future | 5 items | TBD | Post-funding |

**Total estimated pre-Fall engineering:** ~48.5 hours
**With agentic coding assistants at 2-3x speed:** ~16-24 hours actual

---

## PRIORITY DECISION FRAMEWORK

When deciding what to build next, ask these three questions in order:

1. **Does this help an organizer create or manage events with less friction?** If yes, build it. Organizers are the supply side. No organizers = no events = dead map.

2. **Does this help a student discover or commit to an event?** If yes, build it. Students are the demand side. No attendees = organizers leave.

3. **Does this generate data I can show in a pitch or dashboard?** If yes, build it. Traction proof is what unlocks funding, co-founders, and university partnerships.

If a feature doesn't serve at least one of these three goals in the next 90 days, it goes on the backlog. The backlog is not a graveyard — it's a queue. Everything gets built eventually. The question is always: what gets built *now*?
