# Huddle — Architectural Rules

Next.js 15 App Router + Turbopack, TypeScript strict, Firebase (Auth,
Firestore, Admin SDK, Storage), Google Maps, Gemini, Resend, Vercel.
Repo: huddle_v0. Production: huddlemap.live.

## Non-negotiables
1. `import 'server-only'` at the top of every server module.
2. Firebase Admin SDK never reachable from a "use client" component.
   Verify: grep -rn "firebase-admin" components/ hooks/ → must be empty.
3. Zod validation on every API route accepting a request body.
4. FieldValue.increment() for counters. Never read-then-write.
5. No secret gets a NEXT_PUBLIC_ prefix. Ever.
6. No dynamic require() — Turbopack requires static ESM imports.
7. All timezone math goes through lib/datetime.ts. Never write a naive
   new Date(`${date}T${time}`).

## Design system — "Dark / Vibrant V2"
Dark-first, energetic, category-colored. 
Bricolage Grotesque = headlines. Inter = body. IBM Plex Mono = numerals.

REQUIRED:
- Dark frosted glass (`bg-slate-900/70`, `backdrop-blur-md`, `border-white/10`) for major surfaces (cards, bottom nav, sheets).
- Use `getCategoryColor()` from `lib/utils.ts` for glowing accents, badges, and map pins.
- Keep category emojis (⚽, 🍕, 🎵) for instant recognition.
- Map clusters should use Bottom Sheets (Vaul / Radix Drawer) to keep geographical context on mobile.

BANNED: Stark white brutalist cards, removing emojis, heavy overlapping map labels ("Stamp Union Pile-up"), the words "premium", "cinematic", "AI-powered", "revolutionary", "seamless" · exclamation marks · title case in buttons.

Never fake a live state. Real `isEventLive()` gating only.

## Facts agents keep getting wrong
Verify against the repo before relying on any of these; they have each caused
real defects.
- `lib/constants.ts` does not exist and never did. Category colours are
  `getCategoryColor()` in lib/utils.ts. Category emoji are duplicated across 9
  files and have already diverged. Do not add a tenth copy.
- The user interest field is `favoriteSports`, not `interests`.
- `reliabilityScore` is not stored. It is derived per request in
  GET /api/users/[id]/profile as a 0-100 integer, or null.
- There is ONE cron entry in vercel.json: /api/cron/dispatch. The five handlers
  are selected inside it by lib/cron/schedule.ts. They are not independently
  scheduled. On a daily schedule CRON_MODE must be 'daily' or cleanup and
  post-event-prompt never fire.
- maxDuration in a route must be a literal. Next rejects MemberExpression and
  ConditionalExpression forms.
- `events/{id}` is `allow read: if true`. Rules cannot project fields, so any
  field on that document is world-readable. User-authored text goes in a
  deny-all subcollection (roster/, guestContacts/) and is served through an
  authorising API route.
- GET /api/events must return only PUBLIC_EVENT_FIELDS via pickPublicFields().
  It is an allowlist: new fields stay private until named.
- `reports` has no Firestore rule. That is the enforcement — do not add one.
- Guest RSVP is not implemented. POST /api/events/[id]/rsvp 401s without a
  session, regardless of what older docs and mockups show.
- Web push has never delivered a notification (NEXT_PUBLIC_VAPID_KEY unset).
  Do not describe it as working until verified on a real device.

## Documentation authority
CLAUDE.md wins over every other document. After it, in order:
firestore.rules for client permissions, .env.example plus `npm run preflight`
for environment, Documentation/DEPLOY-RUNBOOK.md for deploys,
Documentation/design/TOKENS.md for design tokens, and
Documentation/Engineering/ for architecture narrative.

`Documentation/All Features.md`, `Huddle_Feature_Backlog_Implementation_Plan.md`
and `README.md` are descriptive or historical. They predate the Instrument
design decision. Never brief an agent from them.

## Workflow
- One branch per task: feat/<slug> or fix/<slug> or design/<slug>.
- Run all five gates before every commit; all must exit 0:
  `npx tsc --noEmit && npm run lint && npm run build && npm run preflight && npx vitest run`
- Every authenticated write route calls checkRateLimit() from lib/rate-limit.ts.
  Coverage is not universal — adding it to a new route is your job.
- Editing firestore.rules does not publish it. Rules deploy separately via
  `npx firebase deploy --only firestore:rules`.
- Never commit directly to main. Open a PR and let CI gate it.
- If a task requires my access (env var, Firebase console, Vercel setting),
  implement the code path with graceful degradation and a TODO comment,
  add the item to a deferred list, and continue. Do not stop and wait.
- Report completion with grep-verifiable evidence, not summaries.