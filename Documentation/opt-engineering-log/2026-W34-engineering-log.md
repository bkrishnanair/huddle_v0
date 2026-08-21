# Weekly Engineering Log: 2026-W34

## 1. Objectives
- Resolve Block 1 architectural corrections: implement geohash/interest targeted candidate queries for the Serendipity Agent to eliminate scan limits, and implement a moving window query for `cleanup.ts` to prevent infinite stalling on historical archived documents.
- Build the core Progressive Web App (PWA) shell, service worker caching engine with strict real-time API exclusions, and cross-platform installation prompts (including iOS non-standalone share guidance).
- Implement active Web Push notification infrastructure using Firebase Cloud Messaging (FCM) on both client (`lib/push-client.ts`, `public/firebase-messaging-sw.js`) and server (`lib/push-server.ts`).
- Integrate automated dead token pruning (`FieldValue.arrayRemove`) on stale FCM tokens and enforce user notification preferences prior to dispatch.
- Wire Web Push delivery into pre-event reminders, the Serendipity engine, and follower fan-out on event creation.
- Audit and refine the first-run experience: eliminate dark voids with map empty state overlays, replace full-screen loading spinners with skeleton shells, and enforce non-intrusive permission prompt timing.

## 2. Work Breakdown

### Task 2.1: PWA Shell, Web App Manifest & Service Worker
- **Discipline:** Frontend Engineering & PWA Architecture
- **Description:** Created `app/manifest.ts` returning native `MetadataRoute.Manifest` with standalone display configuration, theme colors (`#0D9488` teal, `#020617` slate), and categories. Extracted `HuddleLogo` SVG and generated 192px, 512px, and 512px maskable PNG icons under `public/icons/`. Implemented `public/sw.js` with an explicit `/api/*` bypass (never caches real-time event counts), cache-first for static assets, network-first for navigation, and an offline fallback route (`/offline`). Created client components `components/pwa-register.tsx` and `components/install-prompt.tsx` (with 14-day dismissal cooldown, second-session / post-RSVP triggers, and iOS Safari Add-to-Home-Screen detection).

### Task 2.2: Web Push Infrastructure via Firebase Cloud Messaging
- **Discipline:** Full-Stack & Messaging Infrastructure
- **Description:** Extended `UserProfile` in `lib/types.ts` with `fcmTokens: string[]`, `pushEnabled: boolean`, and `pushPermissionAskedAt: string | null`. Built `public/firebase-messaging-sw.js` to process background FCM payloads and handle deep-link window focusing on click. Implemented `lib/push-client.ts` to negotiate notification permissions and retrieve the VAPID token via Firebase Modular SDK. Created `lib/push-server.ts` with 500-token batching (`sendEachForMulticast`), user preference validation (`notifyReminders`, `notifyAnnouncements`, `notifyPromotions`), and automatic dead token cleanup via `FieldValue.arrayRemove` when FCM returns registration-token-not-registered. Exposed `POST`/`DELETE` endpoints at `app/api/users/push-token/route.ts`. Created `components/push-permission-prompt.tsx` triggered contextually after RSVPs with a 30-day cooldown.

### Task 2.3: Push Delivery Wiring across Background Crons & Event Fan-Out
- **Discipline:** Distributed Systems & Backend Integration
- **Description:** Integrated `sendPushToUser` into `lib/cron/event-reminders.ts` (firing T-24h event alerts alongside email/in-app notifications) and `lib/cron/serendipity.ts` (sending match nudges to top candidates). Integrated `sendPushToUsers` into `app/api/events/route.ts` to broadcast instant notifications to all followers when an organizer creates a new event.

### Task 2.4: First-Run Experience & Cold-Open UX Audit
- **Discipline:** Frontend UX & Performance
- **Description:** Audited cold-open experience for unauthenticated first-time visitors. Replaced the generic full-screen loading spinner in `app/(app)/layout.tsx` with a responsive skeleton app shell (navbar, map backdrop, bottom navigation). Added an active radar scanning pill and a floating empty state card on `components/map-view.tsx` when 0 events match the current viewport/filter. Removed unprompted `NotificationPermissionHandler` on login in favor of post-RSVP contextual prompting. Delayed the location permission prompt by 6 seconds to give users immediate visual clarity of campus events on first paint.

## 3. Hour Estimates
**Estimated Hours (founder to verify):** 16 hours

## 4. Technical Decisions
- **URL Parameter Service Worker Initialization:** Static service worker files in Next.js `public/` cannot read Node `process.env` at runtime. Configured `lib/push-client.ts` to pass public Firebase client configuration via search parameters to `/firebase-messaging-sw.js` upon registration, keeping the service worker dynamic and environment-aware without manual hardcoding.
- **Dead Token Pruning on Dispatch:** Stale push tokens significantly degrade delivery metrics. Capturing `messaging/registration-token-not-registered` responses in multicast batches and triggering immediate atomic `arrayRemove` keeps user records clean without requiring separate cleanup crons.
- **Contextual Permission Timing:** Replaced all page-load and login-time notification triggers with user-action-driven triggers (post-RSVP). Browser push permission denial is permanent unless manually cleared in settings; gating prompts behind an explicit user intent maximizes grant conversion.

## 5. Verification Performed
- **Build Verification:** Ran `npx tsc --noEmit` and `npm run build`. Build succeeded with 0 static prerendering errors and 0 type errors.
- **Dependency Isolation:** Verified that `firebase-admin` is strictly isolated to server routes and `lib/push-server.ts` using `import 'server-only'`, with 0 admin SDK imports in client-side bundles.
- **Service Worker Route Check:** Verified that `public/sw.js` explicitly excludes `/api/*` requests from caching.
- **Cross-Device Matrix:** Documented expected behavior and constraints across Android Chrome, iOS Safari (installed PWA), desktop Chrome, desktop Safari, and Windows Edge in `Documentation/testing/2026-08-pwa-device-matrix.md`.

## 6. Technical Debt
- **VAPID Key Configuration:** `NEXT_PUBLIC_VAPID_KEY` must be generated in Firebase Console and set in `.env.local` / Vercel dashboard before browser client tokens can be generated.
- **Physical Device iOS Verification:** Automated CI cannot verify Apple Push Notification service (APNs) delivery to iOS homescreen PWAs; physical device testing is required post-deployment.

## 7. Artifacts Produced
- `app/manifest.ts`
- `public/sw.js`
- `public/firebase-messaging-sw.js`
- `public/icons/icon-192x192.png`, `public/icons/icon-512x512.png`, `public/icons/icon-maskable-512x512.png`
- `app/offline/page.tsx`
- `components/pwa-register.tsx`
- `components/install-prompt.tsx`
- `components/push-permission-prompt.tsx`
- `lib/push-client.ts`
- `lib/push-server.ts`
- `app/api/users/push-token/route.ts`
- `Documentation/testing/2026-08-pwa-device-matrix.md`
- `Documentation/opt-engineering-log/2026-W34-engineering-log.md`

## 8. Degree Relevance
- Mobile & Web Systems: Engineered Progressive Web App offline caching lifecycle and Web Worker background execution threads.
- Cloud Computing & Asynchronous Messaging: Implemented multicast push distribution and token lifecycle synchronization using Firebase Cloud Messaging and APNs bridges.

## 9. Variance Note
All work was developed and verified against the established engineering guidelines, with 100% build pass rate on Next.js 15 App Router.
