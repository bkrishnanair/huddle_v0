# Launch readiness — UMD, rev 2

Verdict, evidence, and what was done about it. Audited against `main` at
`52e6fcd` on 2026-08-24; blockers fixed on this branch on 2026-08-25. Every
claim carries a file:line. Descriptive document — ranks below CLAUDE.md,
`firestore.rules`, TOKENS.md and SURFACES.md.

---

## Status

**All six blockers are fixed in code. The Serious tier is not.**

The original verdict was "not ready, do not send a link to students yet" —
three verified holes exposed student PII to anyone on the internet, and none of
them was fixed by enabling Vercel Pro.

> Before the fix: `curl -s https://huddlemap.live/api/events/<any-id>/details`
> returned, with no credentials, every RSVP'd student's **email address** and
> **last-known GPS coordinates**.

| Blocker | State | Commit |
|---|---|---|
| B1 unauthenticated route leaking attendee email + GPS | Fixed | `9053bd7` |
| B2 unbounded scan returning raw documents | Fixed | `9053bd7` |
| B3 whole `users` collection readable | Fixed — **needs a rules deploy** | `3e67231`, `9053bd7` |
| B4 event chat with no membership check | Fixed | `9053bd7` |
| B5 admin route failing open | Fixed | `9053bd7` |
| B6 scraper SSRF + unmetered geocoding | Fixed | `9053bd7` |
| B7 `"Bearer undefined"` cron bypass | Fixed — **needs `CRON_SECRET` set** | `9053bd7` |

Regression tests in `b3a34ab` (48 tests, 6 files). All five gates exit 0.

**Three things gate the fixes actually taking effect in production**, and none
can be done from a sandbox:

1. `npx firebase deploy --only firestore:rules` — B3 is inert until this runs.
   Editing the file does not publish it.
2. Set `CRON_SECRET` and `CRON_MODE=daily` in Vercel. B7 now returns **500 until
   the secret exists** — deliberate, but it means cron is down until you set it.
3. Set `ADMIN_UID`. B5 and B6 now deny **everyone** until it is set.

Also worth doing first: set `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_AUTH_TOKEN`.
Everything else is wired correctly, so it is a one-value fix
(`sentry.client.config.ts:5`), and without it you are flying blind.

### One verification that could not be completed here

Runtime reproduction against production was impossible from the build sandbox —
the agent proxy denies CONNECT to `huddlemap.live` (403 policy denial). B1 and
B2 were instead confirmed first-hand from source: the route file imports no auth
helper at all, and `lib/db.ts:365` spreads the whole user document. If you want
the runtime proof for the record, run the curl above against a real event id
before deploying the fix.

The architecture underneath is sound — the RSVP transaction discipline, the
roster subcollection design, the cron dispatcher and `scripts/preflight.mjs` are
genuinely good work. The failures were concentrated in routes added later
without the checks the earlier ones have.

### Auth model for launch — decided

Signup stays **open** (no `@umd.edu` restriction). Email verification gates
**event creation only**; browsing and RSVP stay frictionless. See F14 — this is
**not yet implemented**.

---

## Blockers — all fixed in `9053bd7`

Each entry keeps the original evidence, then records what changed.

### B1 — `/api/events/[id]/details` is unauthenticated and leaks attendee email + GPS

`app/api/events/[id]/details/route.ts:6-16` has no `getServerCurrentUser()`, no
auth of any kind. It calls `getEventWithPlayerDetails()`, which at
`lib/db.ts:361-368` does:

```ts
const userSnap = await adminDb.collection("users").doc(uid).get();
return { uid, ...(userSnap.exists ? userSnap.data() : {}) };   // whole user doc
```

That spread carries `email` (`app/api/auth/me/route.ts:49`),
`lastKnownLocation` GeoPoint + `geohash` (`lib/db.ts:701-704`), `fcmTokens`
(`app/api/users/push-token/route.ts:30`), and `blockedUsers` (`lib/db.ts:577`).
It also returns the raw event doc, so `attendeeNotes`, `attendeeAnswers`,
`attendeePickup`, `checkIns`, `waitlist` and `scheduledMessages` ride along.

This is not a forgotten route. `components/map-view.tsx:288` calls it for every
shared `?eventId=` deep link.

**Reproduce**
```bash
curl -s https://huddlemap.live/api/events/<id>/details | jq '.playerDetails[0]'
```

**Fix prompt**
> In `app/api/events/[id]/details/route.ts`, require a session via
> `getServerCurrentUser()` and return 401 without one. Then project the event
> through `pickPublicFields()` from `lib/types.ts:197`. Separately, change
> `getEventWithPlayerDetails()` in `lib/db.ts:361-368` so it never spreads the
> user document — return only `{ uid, displayName, photoURL }`, and add a
> `PUBLIC_USER_FIELDS` allowlist next to `PUBLIC_EVENT_FIELDS` so the shape is
> enforced in one place. Grep for every caller of
> `getEventWithPlayerDetails` before changing its return type.

> **Fixed.** The route now requires a session, projects the event through `pickPublicFields()`, and serves the roster only to an organizer, event admin or confirmed attendee via `lib/event-access.ts`. `getEventWithPlayerDetails` projects each attendee through the new `pickPublicUserFields()` instead of spreading the document. Private events 404 to non-participants.

---

### B2 — `/api/events/featured` is unauthenticated, unbounded, and returns raw documents

`app/api/events/featured/route.ts:32`:

```ts
const eventsSnap = await adminDb.collection('events').get();   // no where, no limit
```

`:38` pushes `{ id: doc.id, ...data }` — raw spread, no projection. Returned at
`:97-103`. The `getServerCurrentUser()` at `:77` only decorates
`serendipityPicks`; it does not gate the response.

Two problems stacked. Same PII surface as B1 minus `playerDetails`. And it is a
**full collection scan on every load of `/home`** (`app/(app)/home/page.tsx:49`)
with `Cache-Control: no-store` at `:103`. At 5,000 events and 1,000 students
loading five times a day that is ~25M Firestore reads/day. The `isPrivate` and
`status` filters at `:37` run *after* the scan, so you pay for private events
too. No `maxDuration` declared.

**Fix prompt**
> Rewrite `app/api/events/featured/route.ts` to run three bounded queries
> instead of one collection scan: `where('date','>=',today).orderBy('date').limit(50)`
> for each of the three sections, with `isPrivate` and `status` as query
> constraints rather than post-filters. Project every result through
> `pickPublicFields()`. Replace `no-store` with
> `s-maxage=60, stale-while-revalidate=300`. Add `export const maxDuration = 30`
> as a literal. Declare any composite index the new queries need in
> `firestore.indexes.json`.

> **Fixed.** Replaced with a date-bounded ordered query capped at 500, every section projected, `maxDuration = 30`. Cache header is `private, max-age=60` rather than a shared `s-maxage` — the response carries per-user `serendipityPicks`, so a CDN entry would have served one student's recommendations to the next caller.

---

### B3 — One-click anonymous accounts defeat every rate limit and unlock the `users` collection

`firestore.rules:8`:

```
match /users/{userId} { allow read: if request.auth != null; }
```

An anonymous user *is* authenticated. `components/event-details-drawer.tsx:516`
calls `signInAsGuest()` → `lib/auth.ts:71-84` → `signInAnonymously(auth)`. No
captcha, no cooldown. `lib/recaptcha.ts` exists with zero callers.

So, from any browser console:

```js
await signInAnonymously(auth);
await getDocs(collection(db, "users"));   // every email, GeoPoint, fcmToken
```

No server route can stop this — it uses the client SDK directly and bypasses
`app/api/` entirely.

Second consequence: `lib/rate-limit.ts:36` keys on
`` `${uid}_${action}_${windowId}` ``. Uid only, no IP dimension. A fresh
anonymous account resets **every limit in the app**.

**Fix prompt**
> Two changes, both required.
> (1) In `firestore.rules`, change the `users/{userId}` read rule to
> `allow read: if request.auth != null && request.auth.uid == userId;` and serve
> all other-user reads through the existing `/api/users/[id]/public-profile`
> route. Deploy with `npx firebase deploy --only firestore:rules` — editing the
> file does not publish it. Before deploying, grep `components/` and `hooks/`
> for client-SDK reads of other users' docs and route them through the API.
> (2) In `lib/rate-limit.ts`, add an IP dimension to the key using the
> `x-forwarded-for` header, and apply the stricter of the two limits.

> **Fixed.** Read rule narrowed to `request.auth.uid == userId`. Verified safe before narrowing: no client-side read of `users/{uid}` exists in `components/` or `hooks/`; the only client references are two follow writes to subcollections that have no rule and already deny. Follower/following hydration (`lib/db.ts:651,681`) also projected. `checkRateLimit` now counts per IP as well as per uid, with a looser IP multiplier so campus NAT is not punished. **Inert until the rules are deployed.**

---

### B4 — Event chat has no membership check on the server

`app/api/events/[id]/chat/route.ts:37-52` (GET) requires auth but performs **no
participant check**, and `getChatMessages()` at `lib/db.ts:241-254` reads the
whole subcollection with no filter and no limit. `:95` (POST) has the same gap.

`firestore.rules:57-68` gates chat correctly behind `isEventParticipant()` — but
the Admin SDK bypasses rules (`lib/firebase-admin.ts:76`), so the route is the
enforcement point and it does not enforce. Combined with B3, every event chat in
the product is effectively public.

**Fix prompt**
> In `app/api/events/[id]/chat/route.ts`, add a shared
> `assertParticipant(eventId, uid)` helper that loads the event and returns 403
> unless `players.includes(uid) || createdBy === uid`. Call it in both GET and
> POST before any read or write. Add `.limit(200)` and
> `.orderBy('timestamp','desc')` to `getChatMessages()` in `lib/db.ts:241`.

> **Fixed.** Both handlers gate on participation via `loadEventAccess()` before any read or write, and `getChatMessages` is bounded to the newest 200.

---

### B5 — `/api/admin/serendipity-logs` fails open

`app/api/admin/serendipity-logs/route.ts:22-25`:

```ts
const adminUid = process.env.ADMIN_UID;
if (adminUid && user.uid !== adminUid) { return 403 }
```

When `ADMIN_UID` is empty the guard is skipped entirely and any authenticated
user reads the logs — which contain per-student targeting data: `userId`,
`userName`, score factors, and the exact notification text sent to each person.
`.env.example:96` ships `ADMIN_UID=` blank.

The sibling route gets this right: `app/api/admin/metrics/route.ts:10-18` builds
`new Set([process.env.ADMIN_UID || ''])` and fails **closed**.

**Fix prompt**
> One line. In `app/api/admin/serendipity-logs/route.ts:22-25`, change the guard
> to `if (!adminUid || user.uid !== adminUid) return 403`. Then grep
> `app/api/admin/` for any other `if (envVar && ...)` guard with the same shape.

> **Fixed.** Now `isAdminUid()` from `lib/admin-auth.ts`, which returns false when `ADMIN_UID` is unset. `admin/metrics` moved onto the same helper so the two gates cannot drift again.

---

### B6 — SSRF and unmetered geocoding spend in the TerpLink scraper

`app/api/scrape/terplink/route.ts:144-146` gates on *any* authenticated user,
not an admin. `:13-16` declares `apiUrl: z.string().url().optional()`, which is
passed straight to `fetch` at `:168`. `.url()` accepts any scheme and any host,
so the server will fetch an arbitrary URL and parse the response — an open
server-side fetch proxy.

Cost side: 5 runs/hour/account × up to 100 events, each hitting Google Geocoding
(`:63-64`) at roughly $5/1000 ≈ **$2.50/hour per account**, and accounts are
free and unlimited (B3). No `maxDuration`.

**Fix prompt**
> In `app/api/scrape/terplink/route.ts`, gate on `ADMIN_UID` using the
> fail-closed pattern from `app/api/admin/metrics/route.ts:10-18`. Remove the
> `apiUrl` field from the Zod schema entirely and hardcode the TerpLink host; if
> it must stay configurable, validate `new URL(apiUrl).hostname === 'terplink.umd.edu'`
> and reject anything else. Add `export const maxDuration = 60` as a literal.

> **Fixed.** `apiUrl` removed from the Zod schema and the host hardcoded; route gated on `ADMIN_UID`; `maxDuration = 60`.

---

### B7 — `CRON_SECRET` unset is a live auth bypass

Every cron route checks `` authHeader === `Bearer ${process.env.CRON_SECRET}` ``.
Unset, that template literal evaluates to the string `"Bearer undefined"`. So
today Vercel Cron gets 401 and **anyone sending `Authorization: Bearer undefined`
gets 200** and can trigger the reminder, cleanup and serendipity jobs at will.

Already documented at `Documentation/DEPLOY-RUNBOOK.md:51`. Setting the variable
closes it.

**Fix prompt**
> Set `CRON_SECRET` in Vercel Production. Then harden the check so it cannot
> regress: in `app/api/cron/dispatch/route.ts:113-120`, return 500 with a clear
> log line if `process.env.CRON_SECRET` is falsy, before comparing anything.
> Also set `CRON_MODE=daily` — `vercel.json` fires once at 14:00 UTC, and in
> hourly mode `cleanup` and `post-event-prompt` never run at all.

---

## Serious

Ranked by how quickly a real student hits them.

| # | Issue | Evidence |
|---|---|---|
| S1 | **Every user's event history is permanently empty.** The query filters on `attendees`, a field that does not exist; the stored field is `players`. | `app/(app)/api/events/past/route.ts:42` vs `app/api/events/route.ts:343`, `lib/types.ts:57` |
| S2 | **`/profile/[uid]` 403s for everyone but yourself**, then bounces to the map with "Profile not found". It calls the self-only endpoint; the correct unauthenticated `public-profile` route exists and is referenced by zero UI files. | `app/(app)/profile/[uid]/page.tsx:87` → `app/api/users/[id]/profile/route.ts:26-29` |
| S3 | **Follow is broken on the two most visible buttons.** `components/follow-button.tsx:44-64` writes to `users/{uid}/following` and `/followers` from the client — subcollections with **no Firestore rule**, so default-deny throws every time. A second, working implementation exists at `components/profile/follow-button.tsx:48`. | as cited |
| S4 | **Two missing composite indexes.** One 500s the organizer roster; the other is swallowed by a try/catch so every profile silently reports 0 organized / 0 joined / 0 upcoming. | `app/api/events/[id]/attendees/route.ts:96-100`; `lib/db.ts:452-453` with the catch at `:465-468` |
| S5 | **Private events are publicly rendered and SEO-indexed.** No `isPrivate` or `status` check anywhere in the file, and `generateMetadata` emits OG cards. `app/sitemap.ts:22` filters correctly — the page does not. | `app/event/[id]/page.tsx:8-45` |
| S6 | **The client subscribes to the raw event doc**, bypassing the allowlist entirely. `firestore.rules:34` is `allow read: if true`, so every field lands in every visitor's browser. | `components/event-details-drawer.tsx:164-170` |
| S7 | **`/api/events/bulk` has no rate limit** and accepts 100 events per call, while `/api/events` caps at 20/day. This is the hole in event-spam defence. | `app/api/events/bulk/route.ts:26` vs `app/api/events/route.ts:240` |
| S8 | **Organizer roster is O(N) round-trips per attendee** — a count query plus a full collection query each. A 50-person event is 100+ sequential Firestore calls in one request, no `maxDuration`. | `app/api/events/[id]/attendees/route.ts:96-103`, `lib/db.ts:402` |
| S9 | **A 50 km unbounded query polls from every page every 5 minutes**, just to render a badge count — and it uses hardcoded UMD coordinates regardless of where the user is. `getEvents()` was deliberately bounded to 500; `getNearbyEvents()` was not. | `components/bottom-navigation.tsx:22,33`, `lib/db.ts:85-118` vs `:44-46` |
| S10 | **Service worker caches authenticated HTML** into shared Cache Storage with no auth awareness and no expiry; nothing clears it on logout. `CACHE_VERSION` is a hardcoded literal, so a deploy that does not bump it reuses the old cache indefinitely. | `public/sw.js:1,70-95`, `lib/firebase-context.tsx:42-53` |
| S11 | **`/api/auth/signup` runs the client Firebase SDK on the server**, mutating shared module-level auth state — concurrent signups race. Same class of bug in `logout` and in `public-profile`, which returns 500 on every request in production. | `app/api/auth/signup/route.ts:23` → `lib/auth.ts:25-38`; `app/api/users/[id]/public-profile/route.ts:5,16-17` |
| S12 | **`rateLimits` grows forever.** `expiresAt` is written as an ISO string, not a Timestamp, so no TTL policy can apply, and nothing deletes them. | `lib/rate-limit.ts:41-47`, `firestore.indexes.json:42` |
| S13 | **Renaming an event does not rename it anywhere the list renders.** The `title`/`sport` alias sync is nested inside `if (updates.geopoint)`. | `app/api/events/[id]/route.ts:125-131` |
| S14 | **The "share my email with the organizer" toggle discards the email.** `rsvpSchema` does not declare `guestContactEmail` or `guestContactShared`, so Zod strips both silently. Nothing ever writes to `events/{id}/guestContacts`. | `components/event-details-drawer.tsx:1246-1256,530` vs `app/api/events/[id]/rsvp/route.ts:89-95` |
| S15 | **No middleware, no server-side route protection.** Unauthenticated visitors to `/dashboard`, `/profile`, `/my-events` and `/admin` get the real page under a dismissible modal. Not a flash — permanent. | no `middleware.ts`; `app/(app)/layout.tsx:30-39,94,100` |
| S16 | **`NEXT_PUBLIC_CRON_SECRET` inlined into the client bundle** — violates CLAUDE.md non-negotiable #5. Currently blank, so harmless today, but the pattern is shipped. | `app/(app)/admin/page.tsx:152` |

> **Fixed.** `authorizeCronRequest()` in `lib/cron/auth.ts` refuses every request when the secret is absent, applied to **all six** cron routes rather than just dispatch. **Returns 500 until `CRON_SECRET` is set.**

### Validation and rate-limit coverage

**11 of 32 authenticated write endpoints call `checkRateLimit`.** Uncovered
includes `events/bulk`, `events/claim`, `events/[id]` PUT and DELETE,
`check-in`, `attendance`, `connections/request`, `users/block`,
`users/profile`, `users/[id]/location`, `push-token`, and **`auth/signup`** —
account creation is uncapped.

**Six routes accept a body with no Zod**, against CLAUDE.md non-negotiable #3:
`auth/login:8`, `auth/signup:8`, `events/[id]/status:14`, `events/[id]/checkin:16-23`,
`users/[id]/notifications:51-52`, and worst, `users/[id]/profile:133-143` — a
manual key allowlist with no type or length check, so a display name can be an
arbitrarily long string, an object, or an array. The sibling
`app/api/users/profile/route.ts:9-12` enforces `min(3).max(50)`. Two endpoints,
two rulesets, and the unvalidated one wins.

---

## Documentation that must be corrected, not code

`Documentation/testing/2026-08-pwa-device-matrix.md` claims push delivery
verified green on five platforms including "Background push notification
delivered to iOS Lock Screen." This contradicts the code and `CLAUDE.md:56`.
Web push has never delivered a notification. **Do not show that document to
anyone** — mark it superseded.

---

## Fix sequence

### F1–F7 — before any public link goes out (~1 day)

1. **F1** B1 — auth + projection on `/details`, and stop spreading user docs.
2. **F2** B2 — bound `/featured`, project it, cache it.
3. **F3** B4 — participant checks on both chat handlers.
4. **F4** B5 — one-line fail-closed fix.
5. **F5** B6 — admin-gate the scraper, drop the caller-supplied URL.
6. **F6** B3 — lock the `users` read rule, deploy rules, add the IP dimension.
7. **F7** B7 — set `CRON_SECRET` and `CRON_MODE=daily`; harden the check.

Also set `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_AUTH_TOKEN` first, so you can see
what breaks. As shipped, Sentry reports nothing — everything else is wired
correctly, it is a one-value fix (`sentry.client.config.ts:5`).

### F8–F14 — before you tell students it works (~1 day)

8. **F8** S4 — add both composite indexes, deploy, confirm the roster loads and profile stats are non-zero.
9. **F9** S1 — `attendees` → `players`.
10. **F10** S2 — point `/profile/[uid]` at `public-profile`, and fix S11's client-SDK bug in that route first or it 500s.
11. **F11** S3 — delete `components/follow-button.tsx` and use the API-backed one everywhere.
12. **F12** S5 — `isPrivate`/`status` guards on `/event/[id]`, and `robots: noindex` for private events.
13. **F13** S7, S9 — rate-limit `bulk`; bound `getNearbyEvents` and stop the every-page poll.
14. **F14** Restore the event-creation verification gate. The check is commented out at `app/api/events/route.ts:249-255` and `isGoogleUser` / `isAnonymous` are still computed at `:247-248` and currently unused. Per the launch decision: browsing and RSVP stay open, hosting requires a verified email.

### F15+ — first week

S6, S8, S10, S12, S13, S14, S15, S16, plus the Zod and rate-limit coverage gaps.

---

## What is already correct

Worth protecting during the fixes. `pickPublicFields()` and the
`PUBLIC_EVENT_FIELDS` allowlist are a good design, correctly applied in
`app/api/events/route.ts:106`. Path-param IDOR is well covered — 15 routes check
ownership properly, and `events/[id]/attendees` has a genuinely well-built
organizer/member tiering. The RSVP flow is transactional and cannot oversubscribe
(`app/api/events/[id]/rsvp/route.ts:133-190`). `checkRateLimit` is
Firestore-backed and survives cold starts. `grep -rn "firebase-admin" components/ hooks/`
is empty. No secret currently carries a `NEXT_PUBLIC_` prefix. Session cookie
flags are correct and `verifySessionCookie` uses `checkRevoked: true`.
`scripts/preflight.mjs` is a real asset — extend it rather than replacing it.
