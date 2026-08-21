# HUDDLE ENGINEERING ONBOARDING HANDBOOK
**Version:** 4.0 (Platform Maturity & Campus Scale)  
**Target Audience:** New Software Engineers, Full-Stack Contributors, Technical Leads  
**Authors:** Staff Engineering, Technical Leadership, Onboarding Mentorship  
**Last Updated:** August 2026  

---

## TABLE OF CONTENTS
1. [Product Overview & Business Mission](#1-product-overview--business-mission)
2. [High-Level System Architecture](#2-high-level-system-architecture)
3. [Repository Tour & Directory Breakdown](#3-repository-tour--directory-breakdown)
4. [Data Model & Firestore Schema Design](#4-data-model--firestore-schema-design)
5. [Core User Flows & Lifecycle Engineering](#5-core-user-flows--lifecycle-engineering)
6. [Engineering Principles, Invariants & Anti-Patterns](#6-engineering-principles-invariants--anti-patterns)
7. [Security Model, Dual-Auth & Permissions](#7-security-model-dual-auth--permissions)
8. [Development Workflow, Testing & CI/CD](#8-development-workflow-testing--cicd)
9. [Known Technical Debt & Scaling Tradeoffs](#9-known-technical-debt--scaling-tradeoffs)
10. [Troubleshooting & Emergency Runbook](#10-troubleshooting--emergency-runbook)
11. [Step-by-Step Feature Implementation Guide](#11-step-by-step-feature-implementation-guide)
12. [The First 7 Days Onboarding Plan](#12-the-first-7-days-onboarding-plan)
13. [The Unwritten Rules & Founder Context](#13-the-unwritten-rules--founder-context)

---

## 0. WHERE THE OTHER DOCS LIVE
This handbook is narrative. When it disagrees with one of these, they win:

| Source | Authority over |
| :--- | :--- |
| `CLAUDE.md` (repo root) | Architectural non-negotiables and the Instrument design system. **Highest authority.** |
| `firestore.rules` | What the client SDK may actually read and write. |
| `.env.example` + `npm run preflight` | Required environment variables and what breaks without them. |
| `Documentation/DEPLOY-RUNBOOK.md` | Ordered deploy steps, migrations, rollback. |
| `Documentation/design/TOKENS.md` | The design token contract. |
| `Documentation/Engineering/Huddle-System-Map.md` | Diagram-first companion to this handbook. |

Older docs (`Documentation/All Features.md`, `Huddle_Feature_Backlog_Implementation_Plan.md`,
`README.md`) are **descriptive or historical**. They predate the Instrument design
decision and describe intent rather than shipped behaviour. Do not brief an agent
from them.

---

## 1. PRODUCT OVERVIEW & BUSINESS MISSION

### 1.1 What is Huddle?
Huddle (`huddlemap.live`) is a real-time, spatial social platform designed to solve the **Campus Event Crisis**—the pervasive disconnect between vibrant campus life and student awareness. While university campuses host hundreds of club activities, pickup games, academic workshops, and spontaneous social gatherings each week, discovery is fragmented across disparate channels (Instagram stories, GroupMe chats, bulletin boards, and clunky enterprise portals like CampusLabs/TerpLink).

Huddle unifies campus activities into an interactive, live-updating geographic map and curated social feeds, enabling students to discover, organize, and attend nearby events with zero friction.

```
       ┌────────────────────────────────────────────────────────┐
       │                 THE CAMPUS EVENT CRISIS                │
       │  Fragmented Portals • Ghost RSVPs • High Friction Apps │
       └───────────────────────────┬────────────────────────────┘
                                   │
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │                   HUDDLE PLATFORM                      │
       │   Spatial Discovery • Instant RSVPs • Agentic Nudges   │
       └───────────────────────────┬────────────────────────────┘
                                   │
        ┌──────────────────────────┼───────────────────────────┐
        ▼                          ▼                           ▼
┌───────────────┐          ┌───────────────┐           ┌───────────────┐
│   STUDENTS    │          │  ORGANIZERS   │           │ UNIVERSITIES  │
│ Zero-friction │          │ Organizer CRM │           │ B2B SaaS for  │
│  spontaneous  │          │ & Show-Rate   │           │    Student    │
│  discovery    │          │  Analytics    │           │    Affairs    │
└───────────────┘          └───────────────┘           └───────────────┘
```

### 1.2 Who Are the Users?
1. **Students / Attendees:** Look for immediate, low-commitment social and sporting activities within walking distance. They prioritize fast visual scanning, social proof ("Are my friends going?"), and minimal onboarding steps.
2. **Student Organizers & Club Executives:** Leaders of campus clubs, intramural captains, and residence hall advisors. They need frictionless event creation, automated waitlist handling, multi-admin coordination, and reliable show-up rates.
3. **University Administrators (Divisions of Student Affairs / RecWell):** Institutional buyers interested in student retention, belonging metrics, campus vitality, and verified attendance data.

### 1.3 Core Product Philosophy
- **Frictionless by Default:** Unauthenticated guest users can explore the live map, inspect event details, and browse feeds without forced sign-up walls until an active write action (RSVP or Create) is taken.
- **Spatial Over Categorical:** Campus life happens in physical spaces. Map-centric exploration models how students actually move through campus.
- **Sunset Transit Aesthetic:** Inspired by modern public transit route systems (e.g., Transit App), Huddle uses a vibrant color-coded palette (`#E74C3C` Sports, `#9B59B6` Music, `#00796B` Tech, etc.) to enable instantaneous categorization.
- **Atomic Reliability:** An RSVP is a social contract. Capacity limits, check-ins, and waitlist promotions are strictly atomic to eliminate ghost reservations.

### 1.4 Business Model & Institutional Economics
Huddle operates as an **Enterprise B2B SaaS Platform** licensed to University Divisions of Student Affairs:
- **Pricing:** Estimated annual enterprise subscription of **$25,000 / campus**.
- **Unit Economics:** Cloud infrastructure and Gemini AI costs average ~$42 annually per 1,000 active students ($3.50/month), delivering gross margins in excess of **98%** on a 40,000-student campus.
- **Institutional ROI:** Student retention is the primary ROI driver. A single student dropout costs a university ~$12,000–$30,000 in lost annual tuition. Retaining just 2–3 students through enhanced social belonging yields a net-positive return on the institution's software license.
- **Corporate Entity:** Huddle Map, LLC (Maryland registered entity), backed by Dingman Center E-Fund grants.

### 1.5 Key Domain Concepts
| Concept | Definition | Engineering Manifestation |
| :--- | :--- | :--- |
| **Spontaneous Foot Traffic** | Decisions to attend events starting within ≤30 minutes within 0.5 miles. | Dynamic proximity radius tightening in `lib/serendipity-scorer.ts`. |
| **Reliability Score** | Percentage ratio of attended (checked-in) events vs. total RSVP'd events. | **Computed per request**, not stored. `GET /api/users/[id]/profile` derives it as a 0–100 integer (`null` when nothing is tracked yet). Also fed into `lib/serendipity-scorer.ts`. |
| **At-Risk Event** | An event occurring in <48h with a capacity fill rate <50%. | Trigger for the Serendipity Agent perceive-reason-act loop (`lib/cron/serendipity.ts`). |
| **Night-Light Pin Tiers** | Three-tier visual map pin rendering: Glowing Dots (future), Medium Badges (≤6h imminent), Pulsing Live (ongoing). | Zoom-adaptive SVG/HTML markers in `components/map-view.tsx`. |
| **Claimed Event** | Scraped campus event transferred to an active organizer while retaining all historical RSVPs. | `POST /api/events/claim` atomic transfer preserving 10+ sub-attributes. |

---

## 2. HIGH-LEVEL SYSTEM ARCHITECTURE

Huddle is a serverless, full-stack application built on Next.js 15 App Router, TypeScript strict mode, Tailwind CSS, Google Maps Platform, Firebase Cloud Firestore, and Google Gemini AI.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER (BROWSER)                          │
│  Next.js App Router (RSC & Client Components) • React 19 • Tailwind CSS     │
│  @vis.gl/react-google-maps • Service Worker (PWA) • Firebase Auth Client    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / JSON / WebSockets
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EDGE & SERVERLESS LAYER (VERCEL)                         │
│  Next.js 15 API Routes (`app/api/*`) • Node.js Serverless Functions         │
│  Dual-Auth Verifier (`getServerCurrentUser()`) • Zod Payload Validation     │
└──────┬───────────────────────────────┬───────────────────────────────┬──────┘
       │                               │                               │
       ▼                               ▼                               ▼
┌──────────────┐             ┌────────────────────┐          ┌────────────────┐
│ GOOGLE MAPS  │             │ FIREBASE BACKEND   │          │ GEMINI 2.5 AI  │
│  PLATFORM    │             │ Firestore (NoSQL)  │          │ Flash Model    │
│ Places API   │             │ Firebase Auth      │          │ Description    │
│ Maps JS API  │             │ Cloud Storage      │          │ Enhancer &     │
│ Geocoding    │             │ Cloud Messaging    │          │ Vibe Search    │
└──────────────┘             └────────────────────┘          └────────────────┘
```

### 2.1 Frontend Architecture
- **Framework:** Next.js 15 with App Router (`app/`), compiled via Turbopack.
- **Component Model:** Hybrid architecture. Static marketing and structure use React Server Components; interactive maps, drawers, and forms use `"use client"` boundaries.
- **Mapping Canvas:** `@vis.gl/react-google-maps` utilizing `<AdvancedMarker>` nodes for custom DOM injection (Tailwind gradients, emojis, pulsing CSS rings).
- **Styling & UI:** Tailwind CSS v3 with Shadcn/UI primitives (`@radix-ui/react-*`). The shipped UI is a dark-glassmorphism theme (`bg-slate-950/80`, `backdrop-blur-xl`, `border-white/10`), **but that is the state being migrated away from.** The target system is "Instrument" — light-first, paper-and-ink — specified in `CLAUDE.md`, which is the source of truth for all new UI. Its token layer already ships additively as `--ins-*` in `app/globals.css`; no component consumes it yet.
- **State Management:** React Context (`FirebaseContext`, `useFollowing`), URL search parameter synchronization for deep linking (`?eventId=xxx`), and localized `useReducer`/`useState`.

### 2.2 Backend Architecture
- **API Runtime:** Vercel Serverless Functions running Node.js.
- **Server Isolation:** Enforced via `import 'server-only'` across all private modules (`lib/firebase-admin.ts`, `lib/auth-server.ts`, `lib/gemini.ts`, `lib/push-server.ts`).
- **Validation Engine:** Strict Zod schema validation on every inbound request payload before processing.
- **Transaction Engine:** Firestore Transactions (`adminDb.runTransaction()`) for all capacity modifications, RSVP joins/leaves, and ownership claims.

### 2.3 Firebase Architecture
- **Firestore Client SDK (`lib/firebase.ts`):** Used on client components for real-time listeners (`onSnapshot` on event chat, notifications, user profiles). Restricted by `firestore.rules`.
- **Firestore Admin SDK (`lib/firebase-admin.ts`):** Used exclusively in API routes and cron tasks. Bypasses security rules with service account privileges to execute complex atomic operations.
- **Firebase Auth:** Dual-engine authentication supporting Google OAuth, Email/Password, and Anonymous Guest sessions.
- **Firebase Cloud Messaging (FCM):** Web push dispatched via `firebase-admin/messaging` multicast batches (up to 500 tokens per chunk), with dead-token pruning via `FieldValue.arrayRemove`.
  > **Status check before you build on push:** the infrastructure is complete but
  > has, as of August 2026, never delivered a notification — `NEXT_PUBLIC_VAPID_KEY`
  > was never generated, so `getToken()` cannot mint a token and every dispatch is
  > a no-op. `npm run preflight` reports this. Confirm a real push arrives on a real
  > device before treating push as a working channel; until then the in-app
  > notification bell is the only delivery path that works.

### 2.4 AI Subsystem (Gemini 2.5 Flash)
- **Model:** `gemini-2.5-flash-preview-04-17` accessed via `@google/generative-ai`.
- **Capabilities:**
  1. *Description Enhancer:* `POST /api/ai/enhance-description` rewrites rough user notes into formatted event overviews with auto-generated transit tips and RSVP questions.
  2. *Schedule Importer:* `POST /api/ai/parse-schedule` parses unstructured semester syllabi, club flyers, or raw text into structured JSON event arrays.
  3. *Natural Language Vibe Search:* `POST /api/ai/search` converts queries like *"free pizza tech workshops this weekend"* into structured filter constraints (category, timeFilter, keywords).
  4. *Serendipity Message Composer:* `lib/serendipity-composer.ts` personalizes push notification copy based on user interests, distance, and friend attendance.

### 2.5 Scheduled Subsystem (Vercel Cron)

**There is exactly one scheduled entry in `vercel.json`.** The five handlers are
not independently scheduled — a single dispatcher fans out to them. This matters
because Vercel Hobby permits only one cron per day, so consolidating was the
only way to keep five jobs.

```json
// vercel.json — the entire cron configuration
"crons": [{ "path": "/api/cron/dispatch", "schedule": "0 14 * * *" }]
```

`/api/cron/dispatch` authenticates with `Bearer ${CRON_SECRET}`, then selects
handlers via `selectHandlers()` in `lib/cron/schedule.ts`:

| Handler (`lib/cron/*.ts`) | Runs when `CRON_MODE=hourly` | Deferrable |
| :--- | :--- | :---: |
| `event-reminders` | every invocation | No |
| `scheduled-messages` | every invocation | No |
| `serendipity` | UTC hours 14, 18, 22, 1 | No |
| `cleanup` | UTC hour 6 | Yes |
| `post-event-prompt` | UTC hour 2 | Yes |

**`CRON_MODE=daily` runs all five on every invocation.** On a daily schedule you
*must* set this, or `cleanup` and `post-event-prompt` never fire at all — their
UTC hours will never coincide with the single daily trigger. The guard is
covered by `__tests__/cron-schedule.test.ts` (14 assertions across all 24 hours).

**Plan coupling.** `vercel.json` cannot read environment variables, so three
things must be edited together when changing plan:

| Plan | `CRON_PLAN` | `CRON_MODE` | `vercel.json` | `maxDuration` literal |
| :--- | :--- | :--- | :--- | :--- |
| Hobby (shipped default) | `hobby` | `daily` | `"0 14 * * *"` | `60` |
| Pro | `pro` | `hourly` | `"0 * * * *"` | `300` |

`maxDuration` in `app/api/cron/dispatch/route.ts` **must be a literal** — Next
parses it statically and rejects `MemberExpression` and `ConditionalExpression`
forms, so it cannot be env-driven. It defaults to `60`, which is valid on both
plans; `300` is a hard deploy error on Hobby. The dispatcher logs a warning at
startup if `CRON_PLAN` disagrees with the literal or with `CRON_MODE`.

Deferrable handlers are dropped first when the time budget (derived from
`maxDuration`) runs out, so the hourly ones always finish.

---

## 3. REPOSITORY TOUR & DIRECTORY BREAKDOWN

```
huddle_v0/
├── app/                        # Next.js App Router root
│   ├── (app)/                  # Authenticated app layout group
│   │   ├── admin/              # Platform-wide administration metrics
│   │   ├── dashboard/          # Organizer Studio & CRM analytics
│   │   ├── discover/           # List-based event discovery feed
│   │   ├── home/               # Curated Home feed (Happening Now, Categories)
│   │   ├── map/                # Interactive Google Map canvas
│   │   ├── my-events/          # User's hosting, attending & past events
│   │   └── profile/            # User profile view and edit screens
│   ├── auth/, login/, event/, offline/  # Public routes (no (app) layout group)
│   ├── api/                    # Serverless API routes
│   │   ├── admin/              # Metrics & administrative operations
│   │   ├── ai/                 # Gemini text enhancement, search, parsing
│   │   ├── auth/               # Session creation, login, logout, user profile
│   │   ├── cron/               # Automated cron handlers
│   │   ├── events/             # Event CRUD, RSVPs, check-in, claims, views
│   │   ├── reports/            # User/event moderation reporting
│   │   ├── scrape/             # TerpLink campus data scraper
│   │   └── users/              # Profiles, follows, notifications, FCM tokens
│   ├── layout.tsx              # Root HTML shell & ThemeProvider
│   └── globals.css             # Tailwind base, glassmorphism utilities
├── components/                 # React UI component library
│   ├── events/                 # EventCard, EventGallery, SectionCarousels
│   ├── map-pins/               # Custom SVG/HTML marker pins (Live, Medium, Dot)
│   ├── modals/                 # ReportModal, AuthGateModal, HuddleProModal
│   ├── profile/                # FollowButton, ProfileHeader, StatsCards
│   ├── ui/                     # Shadcn primitives (button, dialog, drawer, tabs)
│   ├── create-event-modal.tsx  # Multi-step event creation wizard
│   ├── event-chat.tsx          # Real-time event chat with pinned messages
│   ├── event-details-drawer.tsx# Slide-up event detail inspector
│   ├── map-view.tsx            # Core Google Maps spatial interface
│   ├── notification-bell.tsx   # Header notification dropdown with polling
│   ├── organizer-studio.tsx    # Detailed host analytics and roster manager
│   └── top-navbar.tsx          # Sticky glass header with search & theme toggle
├── hooks/                      # Custom React hooks (useFollowing, useDebounce)
├── lib/                        # Shared utility libraries & backend modules
│   ├── auth-server.ts          # Server-only dual-auth verifier
│   ├── auth.ts                 # Client-side Firebase auth handlers
│   ├── cron/                   # Cron handlers + pure schedule logic (schedule.ts)
│   ├── datetime.ts             # Timezone-aware UTC converters (date-fns-tz)
│   ├── db-client.ts            # Client-side Firestore reads
│   ├── db.ts                   # Hybrid and server database helpers
│   ├── firebase-admin.ts       # Server-only Firebase Admin SDK singleton
│   ├── firebase-context.tsx    # React AuthContext provider
│   ├── firebase.ts             # Client-side Firebase App singleton
│   ├── gemini.ts               # Google Generative AI client singleton
│   ├── push-client.ts          # Browser ServiceWorker & FCM token registration
│   ├── push-server.ts          # Server-only FCM multicast dispatcher
│   ├── serendipity-composer.ts # AI notification copy generator
│   ├── serendipity-scorer.ts   # 4-factor candidate scoring algorithm
│   ├── rate-limit.ts           # Firestore-backed per-user request limiter
│   └── types.ts                # Strict TS interfaces + PUBLIC_EVENT_FIELDS
├── Documentation/              # System documentation & runbooks
├── public/                     # Static assets, icons, manifest.json, sw.js
├── firestore.rules             # Client-side Firestore security rules
└── vercel.json                 # Vercel deployment & Cron configuration
```

### Detailed Area Breakdown
- **`app/api/events/[id]/rsvp/route.ts`**: The most critical transactional endpoint in the codebase. Executes `adminDb.runTransaction()` to atomically modify `players`, `waitlist`, and `currentPlayers`.
- **`components/map-view.tsx`**: Largest UI component (~1,150 lines). Controls map instance lifecycle, geofence debouncing, marker clustering, floating mobile search, and deep link navigation.
- **`components/event-details-drawer.tsx`**: Primary user engagement drawer (~1,260 lines). Houses RSVP action buttons, Google/Apple calendar exports, capacity gauges, real-time chat, and photo gallery.
- **`lib/serendipity-scorer.ts`**: Implements the candidate scoring algorithm for autonomous event amplification. Scores are **0–100 points**, not normalised weights: Interest (max 30) + Proximity (max 25) + Social (max 25) + Reliability (max 20). `scoreCandidates()` keeps candidates scoring **≥ 40**.
- **`lib/rate-limit.ts`**: `checkRateLimit(uid, action, limit, windowMs)` — fixed-window counter in the `rateLimits` collection using `FieldValue.increment()`. Returns `retryAfterSeconds` for the `Retry-After` header. **Every new write route must call it.**

---

## 4. DATA MODEL & FIRESTORE SCHEMA DESIGN

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FIRESTORE DATA GRAPH                              │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐                     ┌──────────────────────┐
    │   users Collection   │                     │  events Collection   │
    │ ──────────────────── │                     │ ──────────────────── │
    │ uid (PK)             │                     │ id (PK)              │
    │ email                │                     │ name / title         │
    │ displayName          │                     │ category / sport     │
    │ (reliability: derived│                     │ date / time / tz     │
    │ accountType          │                     │ geopoint / geohash   │
    │ verificationStatus   │                     │ createdBy (User UID) │
    │ fcmTokens: string[]  │                     │ maxPlayers           │
    │ blockedUsers: []     │                     │ currentPlayers       │
    │ favoriteSports: str[]│                     │ players: string[]    │
    └──────────┬───────────┘                     │ waitlist: string[]   │
               │ 1                               │ checkIns: Map        │
               │                                 │ source: terplink/... │
               │ Subcollections                  └──────────┬───────────┘
               ├─────────────────────────┐                  │ 1
               ▼                         ▼                  │
    ┌──────────────────────┐  ┌──────────────────────┐      │ Subcollections
    │  notifications/{id}  │  │   following/{uid}    │      ▼
    │ ──────────────────── │  │ ──────────────────── │  ┌──────────────────────┐
    │ type, message, read  │  │ timestamp, name      │  │      chat/{id}       │
    │ eventId, createdAt   │  └──────────────────────┘  │ ──────────────────── │
    └──────────────────────┘                            │ senderId, text       │
                                                        │ isAnnouncement       │
                                                        │ timestamp            │
                                                        └──────────────────────┘
```

### 4.1 Schema Specifications

#### 1. `users` Collection
- `uid` (string, Document ID): Matches Firebase Auth UID.
- `email` (string): Normalized email address.
- `displayName` (string): Public profile name.
- `bio` (string, optional): Short biographical summary.
- `photoURL` (string, optional): Avatar image URL.
- ~~`reliabilityScore`~~ — **not a stored field.** Derived per request in `GET /api/users/[id]/profile` as a 0–100 integer from check-in history, or `null` when nothing is tracked. Do not write it to the user document.
- `accountType` (string): `'individual' | 'organization'`.
- `verificationStatus` (string): `'pending' | 'verified' | 'rejected'`. Verified organizations receive a blue checkmark badge.
- `favoriteSports` (string[]): Selected categories (e.g., `["Sports", "Tech", "Music"]`). **The field is named `favoriteSports`, not `interests`** — a legacy name from the pickup-sports era. `lib/cron/serendipity.ts` queries it directly with `array-contains` and falls back to `favoriteCategories`.
- `blockedUsers` (string[]): UIDs blocked by this user.
- `fcmTokens` (string[]): Device registration tokens for Web Push notifications.
- `pushEnabled` (boolean): Master push notification toggle.
- `notifyAnnouncements` (boolean, default: true): Push preference for host announcements.
- `notifyPromotions` (boolean, default: true): Push preference for waitlist promotions.
- `notifyReminders` (boolean, default: true): Push preference for 2h/30m start alerts.

**Subcollections:**
- `users/{uid}/notifications/{notifId}`: In-app notification logs (`type`, `message`, `eventId`, `read`, `createdAt`).
- `users/{uid}/following/{targetUid}`: Follow relationships (`timestamp`, `displayName`).
- `users/{uid}/followers/{sourceUid}`: Reverse follow index for O(1) audience querying.
- `users/{uid}/connections/{connectionId}`: Connection requests (`status: 'pending' | 'accepted'`). Governed by its own rule in `firestore.rules` and largely superseded by the follow graph — check before building on it.

#### 2. `events` Collection
- `id` (string, Document ID): Auto-generated unique Firestore ID.
- `name` (string): Event title (with `title` as backward-compatible alias).
- `category` (string): Event genre (`Sports`, `Music`, `Community`, `Learning`, `Food & Drink`, `Tech`, `Arts & Culture`, `Outdoors`).
- `eventType` (string): `'in-person' | 'virtual' | 'hybrid'`.
- `virtualLink` (string, optional): URL for Zoom, Google Meet, or Microsoft Teams.
- `date` (string): ISO date string (`YYYY-MM-DD`).
- `time` (string): 24-hour start time (`HH:mm`).
- `endDate` / `endTime` (string, optional): End bounds for multi-hour/multi-day events.
- `timezone` (string): IANA timezone string (default: `'America/New_York'`).
- `geopoint` (Firestore GeoPoint): `latitude` and `longitude`.
- `geohash` (string): Geofire geohash string for spatial bounding box queries.
- `location` (string): Plain text venue name or address (e.g., "McKeldin Mall").
- `createdBy` (string): UID of event creator.
- `organizerName` (string): Cached display name of organizer.
- `maxPlayers` (number): Hard capacity limit.
- `currentPlayers` (number): Count of confirmed attendees (`players.length`).
- `players` (string[]): Array of confirmed attendee UIDs.
- `waitlist` (string[]): Ordered array of waitlisted attendee UIDs.
- `checkInOpen` (boolean): Whether self check-in is active.
- `checkIns` (Map<string, boolean>): Key-value map of `{ [uid]: true }` for verified attendance.
- `source` (string): `'manual' | 'terplink' | 'claimed'`.
- `sourceUrl` (string, optional): External link for scraped events.
- `claimedFrom` (string, optional): Document ID of original scraped record if claimed.
- `viewCount` (number): Atomically incremented total views.
- `status` (string): `'active' | 'past' | 'archived'`.
- `lastAnnouncementAt` (string, optional): Timestamp of last pinned message.
- `postEventPromptSent` (boolean): Whether organizer feedback cron has fired.
- `reportedAttendance` (number, optional): Actual headcount reported by organizer.

**Subcollections:**
- `events/{id}/chat/{messageId}`: Chat messages (`senderId`, `senderName`, `text`, `timestamp`, `isAnnouncement`).
- `events/{id}/guestContacts/{contactId}`: Guest contact PII. **Deny-all to clients** in `firestore.rules`; Admin SDK only.
- `events/{id}/roster/{uid}`: Attendee free-text — `{ note, answers, pickup, updatedAt }`. **Deny-all to clients**, served only by `GET /api/events/[id]/attendees`. See §4.4.

#### 2a. Why roster data is not on the event document
The `events` document is `allow read: if true` — world-readable, by design, because
guest browsing is core positioning. Firestore rules **cannot project fields**: a
document is readable or it is not. So anything left on the event document is
public, including free text a student typed.

`attendeeNotes`, `attendeeAnswers` and `attendeePickup` were therefore moved off
the parent into `events/{id}/roster/{uid}`, which is deny-all. Two rules follow
and neither is optional:

1. **Never add a field containing user-authored text to the `events` document.**
   It is public the moment it is written.
2. **`GET /api/events` returns an allowlist, not the document.** `pickPublicFields()`
   in `lib/types.ts` copies only `PUBLIC_EVENT_FIELDS`. It is an allowlist, so a new
   field is private until someone names it there. Add fields deliberately.

Writes to the roster happen inside the same `runTransaction()` as the membership
change in `POST /api/events/[id]/rsvp`, so roster and `players[]` cannot diverge.

#### 3. `reports` Collection
- `id` (string, Document ID): Auto-generated.
- `reporterId` (string): UID of user filing the report.
- `targetId` (string): Reported UID, Event ID, or Photo path.
- `itemType` (string): `'user' | 'event' | 'photo'`.
- `reason` (string): Violation category (e.g., "Harassment", "Spam", "Inappropriate").
- `details` (string, optional): Additional text context.
- `status` (string): `'pending' | 'reviewed' | 'dismissed'`.
- `createdAt` (Firestore Timestamp).

#### 4. `serendipityLogs` Collection
- `runId` (string, Document ID): Unique execution batch ID (`run_${timestamp}`).
- `timestamp` (string): ISO timestamp of execution.
- `perceive` (object): Scanned events count, at-risk events identified, latency.
- `reason` (object): Candidate users evaluated, score breakdown, qualification count.
- `act` (object): Notifications dispatched, push delivery counts, AI copy generation latency.
- `totalDurationMs` (number): Total execution time.

---

## 5. CORE USER FLOWS & LIFECYCLE ENGINEERING

### 5.1 Authenticated & Guest RSVP Flow
```
User clicks "Join Event"
      │
      ▼
Check Auth State
      ├──────────────────────────────┐
      ▼ (Unauthenticated)            ▼ (Authenticated)
Open AuthGateModal (sign-in)      Call POST /api/events/[id]/rsvp
      │                                  │
      └──────────────────────────────────┤
                                         ▼
                             adminDb.runTransaction()
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
       currentPlayers < maxPlayers               currentPlayers >= maxPlayers
                    │                                         │
                    ▼                                         ▼
      Add UID to players[]                      Add UID to waitlist[]
      Increment currentPlayers                  Keep currentPlayers unchanged
      Return status: "joined"                   Return status: "waitlisted"
```

> **Guest RSVP is not currently implemented.** `POST /api/events/[id]/rsvp`
> returns `401 Authentication required` for any caller without a session
> (`app/api/events/[id]/rsvp/route.ts`). A `guestRsvps` map appears in the claim
> route and in older design material, but no endpoint writes it and no
> guest-RSVP component exists. Guests can browse and open events; joining
> requires an account. Treat any doc or mockup showing "Join as guest" as a
> product intention, not shipped behaviour.

**Edge Case Handling:**
- *Concurrent Join Race:* Handled atomically by Firestore transaction. If two users join simultaneously with 1 slot remaining, User A joins `players[]` and User B is placed on `waitlist[]`.
- *Organizer Leaving:* Organizers cannot leave their own event. They must cancel/delete it or transfer ownership.
- *Waitlist Auto-Promotion:* When an active attendee calls `POST /api/events/[id]/rsvp` with `action: 'leave'`, the transaction checks `waitlist.length > 0`. If true, `waitlist[0]` is popped, added to `players[]`, and receives an instant `waitlist_promo` notification + Web Push.

### 5.2 Event Creation Lifecycle
1. **Entry:** User taps the floating `+` FAB (`components/map-view.tsx`) or clicks "Create Event" in Navigation.
2. **Modal Wizard (`components/create-event-modal.tsx`):**
   - Step 1: Basic Info (Title, Category, Event Type [In-Person/Virtual/Hybrid]).
   - Step 2: Date, Time, Duration, Timezone capture (`Intl.DateTimeFormat().resolvedOptions().timeZone`).
   - Step 3: Location (Google Places Autocomplete, or "Use Current Location" reverse-geocoded client-side through the Maps JS Geocoder — there is no `/api/events/reverse-geocode` route).
   - Step 4: AI Description Enhancer (Optional trigger to `POST /api/ai/enhance-description`).
   - Step 5: Capacity, Custom RSVP Questions, Pickup Points, Transit Tips.
3. **Submission (`POST /api/events`):**
   - Server validates payload with Zod.
   - Calculates 9-character Geohash via `geofire-common.geohashForLocation([lat, lng])`.
   - Writes event document to Firestore using Admin SDK.
4. **Post-Creation:** Returns newly created event ID. Client displays glassmorphic Share Card overlay with one-tap deep link copying and native Web Share API triggering.

### 5.3 Event Claiming Flow
Converting passive, scraped TerpLink events into active organizer-managed events:
1. User views a scraped event (`isScraped: true` or `source: 'terplink'`) in `EventDetailsDrawer`.
2. Organizer clicks **"Are you the organizer? Claim this event"**.
3. Opens `CreateEventModal` pre-populated with scraped title, category, date, location, and description.
4. Organizer modifies details and submits to `POST /api/events/claim`.
5. **Atomic Transfer:** Server executes a transaction:
   - Verifies target event is unclaimed (`source !== 'claimed'`).
   - Updates `createdBy` to the claimant's UID, `organizerName` to claimant's name, `source: 'claimed'`, and sets `claimedAt: Timestamp.now()`.
   - **Preserves All Attendee Data:** `players[]`, `waitlist[]`, `checkIns`, `viewCount`, and subcollection `chat` messages are untouched.
   - Claimant UID is merged into `players[]` via `FieldValue.arrayUnion()`.
   - Dispatches `event_update` notifications to all existing attendees announcing the verified organizer.

### 5.4 The Serendipity Agent Engine (PERCEIVE → REASON → ACT → ADAPT)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SERENDIPITY AGENT PIPELINE                          │
│        (via /api/cron/dispatch — see §2.5 for the real schedule)            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. PERCEIVE: Scan 0–48h events with fillRate < 0.50 (At-Risk Events)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. REASON: 4-Factor Candidate Scoring — 0-100 POINTS, not weights           │
│    Interest(≤30) + Proximity(≤25) + Social(≤25) + Reliability(≤20)          │
│    Threshold: score >= 40 qualifies (lib/serendipity-scorer.ts)             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. ACT: Gemini 2.5 Flash crafts context-aware push copy                     │
│    Dispatches In-App Notification + FCM Web Push (Max 3 nudges/user/day)    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. ADAPT: Post-event handler collects organizer attendance feedback         │
│    Feeds reportedAttendance/checkIns, which reliability is derived from     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. ENGINEERING PRINCIPLES, INVARIANTS & ANTI-PATTERNS

### 6.1 Architectural Invariants (Never Violate)
1. **Never Perform Atomic State Writes from the Client SDK:**
   - *Forbidden:* `updateDoc(eventRef, { currentPlayers: event.currentPlayers + 1 })`
   - *Required:* Always route capacity, attendance, and roster modifications through Next.js API routes wrapped in `adminDb.runTransaction()`.
2. **Strict Server-Only Guarding:**
   - Every file under `lib/` that touches `firebase-admin`, `process.env.FIREBASE_PRIVATE_KEY`, or `gemini` MUST begin with `import 'server-only';`.
3. **Zod Validation on All Inbound API Payloads:**
   - Never trust request bodies. Parse and validate headers, query params, and JSON bodies with strict Zod schemas.
4. **Timezone Preservation:**
   - Dates (`YYYY-MM-DD`) and times (`HH:mm`) are stored as wall-clock strings accompanied by an IANA `timezone` string. Never store raw un-zoned UTC timestamps for event start dates without the local timezone context.

### 6.2 Frontend Map & Rendering Invariants
- **Uncontrolled Map Props:** The `<Map>` component in `map-view.tsx` must use `defaultCenter` and `defaultZoom`. Never bind dynamic React state to `center` and `zoom` with inline `onCenterChanged`/`onZoomChanged` listeners—this creates a severe state thrashing loop that causes map jitter during touch gestures.
- **Debounced Spatial Fetching:** Spatial queries must be bound exclusively to the Google Maps `onIdle` event debounced by at least 300–500ms.

### 6.3 Common Engineering Mistakes & Pitfalls
| Anti-Pattern | Why It Fails | Correct Implementation |
| :--- | :--- | :--- |
| Destructuring `useFollowing()` as `{ following }` | Hook returns `followingSet` (a `Set<string>`). Calling `following.has()` throws `Cannot read properties of undefined (reading 'has')`. | `const { followingSet } = useFollowing();` |
| Calling `.includes()` on `event.date` without type checks | Scraped or legacy events may have missing or non-string dates, throwing a fatal client exception. | Use robust fallback: `typeof event.date === 'string' && event.date.includes('/') ? ...` |
| Direct string replacement of `\n` in private keys | Breaking newline escaping on Vercel environment deployments causes `ASN1_BAD_KEY` errors. | `privateKey.replace(/\\n/g, '\n').replace(/^"|"$/g, '')` |
| Reading Firestore document before transaction write | Read-then-write causes race conditions during high-concurrency ticket drops. | Read inside the `transaction.get()` scope and write via `transaction.update()`. |
| Adding a polling `setInterval` without a visibility guard | A backgrounded tab polls forever. `notification-bell.tsx` at 30s was issuing 2,880 requests/user/day and would exhaust Vercel's 1M monthly invocations at ~350 daily actives. | Gate on `document.visibilityState === 'visible'`, use a multi-minute interval, and refetch on `visibilitychange`. See `NOTIFICATION_POLL_INTERVAL_MS`. |
| Writing user-authored text onto the `events` document | `events` is `allow read: if true`. Rules cannot project fields, so anything on the document is world-readable. | Put it in a deny-all subcollection (`roster/`, `guestContacts/`) and serve it through an authorising API route. |
| Naive `new Date(\`${date}T${time}\`)` | Parses in the server's local zone, not the event's. Silently shifts events across day boundaries. | Always use `getEventStartUTC()` / `getEventEndUTC()` from `lib/datetime.ts`. |

---

## 7. SECURITY MODEL, DUAL-AUTH & PERMISSIONS

### 7.1 The Dual-Auth Strategy
Next.js 15 App Router executes in hybrid edge and node environments where client-side Firebase Auth tokens are not automatically attached to server fetches. Huddle implements a dual verification strategy in `lib/auth-server.ts`:

```typescript
// lib/auth-server.ts
export const getServerCurrentUser = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  // 1. Primary: Verify HTTP-only Session Cookie
  if (sessionCookie) {
    try {
      if (adminAuth) {
        return await adminAuth.verifySessionCookie(sessionCookie, true);
      }
    } catch (error) {
      console.warn("Session cookie invalid, trying Bearer fallback");
    }
  }

  // 2. Secondary Fallback: Authorization: Bearer <idToken>
  const headersList = await headers();
  const authHeader = headersList.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const idToken = authHeader.split("Bearer ")[1];
    if (adminAuth) {
      return await adminAuth.verifyIdToken(idToken);
    }
  }

  return null;
};
```

### 7.2 Firestore Security Rules (`firestore.rules`)
Read the file — it is short, and these are the rules as written, not as intended:

- **`users/{uid}`**: `allow read: if request.auth != null` — **signed-in readable, not public.** An unauthenticated visitor cannot read any user document. Writable only when `request.auth.uid == uid`.
- **`users/{uid}/connections/{connectionId}`**: Owner may read. Writes allowed either to send a request (`request.auth.uid == connectionId` and `status == 'pending'`) or to accept one (`request.auth.uid == userId` and `status == 'accepted'`).
- **`events/{eventId}`**: `allow read: if true` — genuinely public, including to signed-out visitors. Create requires `request.auth.uid == request.resource.data.createdBy`. **Update is not creator-only:** the creator *or* any uid in `resource.data.admins` may write any field, and a uid in `players` may append to `gallery` only (`affectedKeys().hasOnly(['gallery'])` plus `gallery.hasAll(existing)`). Delete is creator-only.
- **`events/{eventId}/chat/{messageId}`**: Read and create for event participants via the `isEventParticipant()` helper (creator or in `players`). Delete only by the message sender.
- **`events/{eventId}/guestContacts/{contactId}`**: `allow read, write: if false`. Admin SDK only.
- **`events/{eventId}/roster/{uid}`**: `allow read, write: if false`. Admin SDK only. **Shipping in launch wave 2 — verify it is live before trusting it.**
- **`reports/{reportId}`**: **No rule exists.** Firestore denies by default, so the client SDK cannot touch `reports` at all. Reports are written exclusively through `POST /api/reports` using the Admin SDK. The absence of a rule is the enforcement — do not add a permissive one.

> Rules are deployed separately from code: `npx firebase deploy --only firestore:rules`.
> Merging a PR that edits `firestore.rules` does **not** publish it. Check the
> published timestamp in the Firebase console after any rules change.

### 7.3 Rate Limiting
Every authenticated write path must call `checkRateLimit()` from `lib/rate-limit.ts`
before doing work. It is a fixed-window counter in the `rateLimits` collection
using `FieldValue.increment()` — never read-then-write.

```typescript
const limitCheck = await checkRateLimit(user.uid, 'event_rsvp', 30, 60_000);
if (!limitCheck.success) {
  return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(limitCheck.retryAfterSeconds) } });
}
```

Currently applied to 11 route files. **Coverage is not universal** — if you add a
write route, adding the limiter is your job, not a framework guarantee.

### 7.4 Cron Endpoint Authentication
All `/api/cron/*` routes compare `authHeader === \`Bearer ${process.env.CRON_SECRET}\``.
Note the failure mode: **if `CRON_SECRET` is unset that string is literally
`"Bearer undefined"`**, which any caller can send. Legitimate Vercel cron
invocations get 401 while an attacker succeeds. Confirm the variable is set in
every environment (`npm run preflight`).

---

## 8. DEVELOPMENT WORKFLOW, TESTING & CI/CD

### 8.1 Environment Configuration (`.env.local`)
To run Huddle locally, configure the following keys in `.env.local`:
```bash
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="huddle-xxx.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="huddle-xxx"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="huddle-xxx.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456:web:abcdef"

# Firebase Admin SDK (Server Only)
FIREBASE_PROJECT_ID="huddle-xxx"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@huddle-xxx.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# Google Maps Platform
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSy..."
NEXT_PUBLIC_GOOGLE_MAPS_STYLE_MAP_ID="huddle-main-map"   # single Map ID, not per-theme
GOOGLE_MAPS_SERVER_KEY="AIzaSy..."   # unrestricted/IP-restricted; server geocoding has no HTTP referrer

# Google Gemini AI
GEMINI_API_KEY="AIzaSy..."

# Platform Security & Cron
CRON_SECRET="your-secure-random-cron-secret"
ADMIN_UID="firebase-uid-of-super-admin"
CRON_PLAN="hobby"   # hobby | pro  — see §2.5, must agree with vercel.json
CRON_MODE="daily"   # daily | hourly — on Hobby this MUST be daily

# Email (Resend) — without this, reminder emails silently do not send
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="Huddle <noreply@huddlemap.live>"

# Web Push — without this, getToken() mints nothing and ZERO push is delivered
NEXT_PUBLIC_VAPID_KEY="B..."   # Firebase Console > Cloud Messaging > Web Push certificates

# Optional
NEXT_PUBLIC_APP_URL="https://huddlemap.live"   # used by calendar links + reminder emails
```

**`.env.example` is the authoritative list.** Run `npm run preflight` to see what
is missing and, more importantly, *what silently breaks* when it is — several
subsystems degrade without erroring. **Vercel does not read `.env.local`**; every
variable must be set separately in the Vercel dashboard.

### 8.2 Local Development Commands
```bash
# Install dependencies with strict lockfile
npm ci

# Launch local Turbopack development server on port 3000
npm run dev

# Run TypeScript compilation check
npx tsc --noEmit

# Run Next.js production build
npm run build

# Check environment readiness — reports what is missing and what it breaks
npm run preflight

# Run the vitest suite (config: vitest.config.mts, `@/*` alias mirrored from tsconfig)
npm test
```

**All five gates must exit 0 before any commit:**
`npx tsc --noEmit && npm run lint && npm run build && npm run preflight && npx vitest run`

### 8.3 Branching & Deployment Strategy
- **`main`**: Production branch, intended to auto-deploy to `huddlemap.live` on merge.
  > **Verify before relying on this.** As of August 2026 production was serving
  > months-old code and pushes to release branches were producing no deployment
  > at all — the most recent successful build had cloned an unrelated branch.
  > Confirm in Vercel → Deployments that your merge actually produced a build,
  > and check Settings → Git for an Ignored Build Step before assuming a merge shipped.
- **`feature/*`**: Feature branches for active development. Pull requests generate preview environments with isolated preview URLs.
- **Merge Invariant:** Never merge PRs with failing TypeScript checks (`tsc --noEmit`).

---

## 9. KNOWN TECHNICAL DEBT & SCALING TRADEOFFS

1. **Serendipity Candidate Full-Collection Scan:**
   - *Current State:* `lib/cron/serendipity.ts` fetches all user documents to evaluate candidate scoring.
   - *Scale Limit:* Performs well up to ~500 active users (<200ms).
   - *Refactoring Path:* At >1,000 users, implement a pre-computed interest inverted index (`interests/{category}/subscribers`) to avoid linear document scans.
2. **Dual Field Naming Aliases:**
   - *Current State:* Legacy schemas used `sport` and `title`; current schemas use `category` and `name`. Code currently carries fallback checks: `event.name || event.title`.
   - *Refactoring Path:* Write a Firestore migration to normalise documents to `name` and `category`. **No such script exists yet** — model it on `scripts/migrate-roster-fields.ts`, which is the reference for safe migrations here: `DRY_RUN` on by default, copy → re-read and verify → only then delete, and idempotent so it can be re-run.
3. **In-Memory Geofencing vs. Geofire Clusters:**
   - *Current State:* Viewport bounding queries fetch events in rectangular bounds; distance filtering happens in memory.
   - *Refactoring Path:* Transition to native Firestore distributed geohash queries (`geohashQueryBounds`) for campuses exceeding 5,000 concurrent active events.

---

## 10. TROUBLESHOOTING & EMERGENCY RUNBOOK

### 10.1 `ASN1_BAD_KEY` / Firebase Admin Init Failure
- **Symptom:** API routes throw `Firebase Admin initialization error: Error: error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt`.
- **Cause:** Newlines (`\n`) in `FIREBASE_PRIVATE_KEY` were improperly escaped or wrapped in double quotes in Vercel environment settings.
- **Fix:** In `lib/firebase-admin.ts`, ensure `.replace(/\\n/g, '\n').replace(/^"|"$/g, '')` is applied to `process.env.FIREBASE_PRIVATE_KEY`.

### 10.2 Google Maps Rendering Blank Grid / Zoom Limits
- **Symptom:** Map tiles render as gray grids or blurry textures after deep-linking.
- **Cause:** Google Maps tile resolution maxes out at level 21–22 in non-major metropolitan areas. Setting zoom to 26–28 exceeds available tile mipmaps.
- **Fix:** Keep maximum focus zoom levels bounded between **19 and 21** in `components/map-view.tsx`.

### 10.3 Missing Firestore Composite Index
- **Symptom:** Query fails with `FirebaseError: The query requires an index`.
- **Fix:** Inspect the error URL in Vercel runtime logs. Click the generated Firebase Console link to auto-create the composite index (e.g., `events` collection: `date` ASC + `category` ASC + `status` ASC).

---

## 11. STEP-BY-STEP FEATURE IMPLEMENTATION GUIDE

When tasked with building a new feature for Huddle (e.g., *Multi-Admin Event Co-Hosting*):

1. **Step 1: Schema & Type Definition (`lib/types.ts`)**
   - Add new fields to interfaces (e.g., `admins?: string[]` on `GameEvent`).
2. **Step 2: Security & Backend API Route (`app/api/...`)**
   - Create route file with `import 'server-only';`.
   - Define Zod input schema.
   - Verify caller via `getServerCurrentUser()`.
   - Implement business logic inside `adminDb.runTransaction()` if state is mutated.
3. **Step 3: Client Data Fetching & Hooks (`hooks/...`)**
   - Create custom React hook with optimistic UI updates and error rollbacks.
4. **Step 4: UI Component Implementation (`components/...`)**
   - **Follow the "Instrument" design system in `CLAUDE.md`** — light-first, paper-and-ink. Glassmorphism, gradients, dark backgrounds on new surfaces, emoji in chrome and arbitrary Tailwind values are **banned in new work**. The existing dark `glass-surface` styling across ~26 files is migration debt, not a pattern to copy. Tokens live in `app/globals.css` as `--ins-*`; semantic names are in `tailwind.config.ts`. See `Documentation/design/TOKENS.md`.
   - Use Lucide icons exclusively.
   - Add touch-friendly target dimensions (min 44×44px on mobile).
5. **Step 5: Verification & Typecheck**
   - Run `npx tsc --noEmit` locally to guarantee zero type regressions.
   - Test flow under guest, attendee, and organizer roles.

---

## 12. THE FIRST 7 DAYS ONBOARDING PLAN

```
┌─────────┬───────────────────────────────┬───────────────────────────────────────────┐
│ Day     │ Focus Area                    │ Core Deliverables & Key Files             │
├─────────┼───────────────────────────────┼───────────────────────────────────────────┤
│ Day 1   │ Setup, Architecture & Runbook │ Clone repo, configure .env.local, boot dev│
│         │                               │ Read ARCHITECTURE.md, DATABASE.md         │
├─────────┼───────────────────────────────┼───────────────────────────────────────────┤
│ Day 2   │ Map Rendering & Spatial Engine│ Study components/map-view.tsx             │
│         │                               │ Trace onIdle debouncing and pin clustering│
├─────────┼───────────────────────────────┼───────────────────────────────────────────┤
│ Day 3   │ Dual-Auth & API Pipelines     │ Trace lib/auth-server.ts & getServerUser  │
│         │                               │ Inspect POST /api/events/[id]/rsvp        │
├─────────┼───────────────────────────────┼───────────────────────────────────────────┤
│ Day 4   │ Atomic Transactions & Roster  │ Deep-dive into EventDetailsDrawer.tsx     │
│         │                               │ Test guest RSVP vs authenticated waitlist │
├─────────┼───────────────────────────────┼───────────────────────────────────────────┤
│ Day 5   │ Serendipity Agent & AI Engine │ Review lib/cron/serendipity.ts & Gemini   │
│         │                               │ Test POST /api/ai/enhance-description     │
├─────────┼───────────────────────────────┼───────────────────────────────────────────┤
│ Day 6   │ Organizer Studio & Safety     │ Test /dashboard aggregation & CSV export  │
│         │                               │ Review reports and user block mechanics   │
├─────────┼───────────────────────────────┼───────────────────────────────────────────┤
│ Day 7   │ First Production Pull Request │ Pick a Phase 1 backlog task, write code,  │
│         │                               │ run typechecks, and ship to feature branch│
└─────────┴───────────────────────────────┴───────────────────────────────────────────┘
```

---

## 13. THE UNWRITTEN RULES & FOUNDER CONTEXT

1. **Why the 50m Pin Clustering Threshold Was Chosen:**
   Campus hubs like Stamp Student Union and McKeldin Library host dozens of simultaneous tables and club meetings in a tiny geographic footprint. Without the custom 50m centroid clustering algorithm in `map-view.tsx`, markers render directly on top of each other, making pins unclickable on mobile devices.
2. **Why the Floating Search Bar is Separated from the Sheet:**
   During mobile usability testing, nesting the search bar inside the collapsible bottom drawer caused severe disorientation: when students minimized the drawer to view the map, the search bar vanished. The floating bottom search bar (`bottom-[92px]`) must remain permanently accessible in map view.
3. **Why TerpLink Events Must Preserve RSVPs Upon Claiming:**
   Campus clubs frequently discover that their TerpLink event was scraped and students have already RSVP'd on Huddle. If claiming deleted the event and recreated it, those student RSVPs would be destroyed, burning organizer trust. The `POST /api/events/claim` endpoint was engineered to swap the ownership pointer in place while preserving 100% of attendee records.
4. **The 3-Click RSVP Law:**
   College students abandon event apps if forced through multi-step onboarding. An attendee must be able to discover an event and confirm their spot in 3 taps or fewer from cold launch.

---
*Welcome to Huddle Engineering. Build with precision, protect atomic state, and ship features that bring campus communities together.*
