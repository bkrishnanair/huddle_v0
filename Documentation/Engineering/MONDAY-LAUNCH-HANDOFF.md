# Monday launch handoff

Release pass: September 13, 2026. Base commit: `3185387`.
Work is local on `codex/programmatic-seo`; this report is not evidence of a
commit, push, deployment, or production configuration change.

## What changed

- SEO: public event JSON-LD, semantic category directories, sitemap entries,
  and landing footer links. See `PROGRAMMATIC-SEO.md` for privacy and data limits.
- `app/api/events/[id]/details/route.ts`: guests can open public shared links.
  Authorisation precedes roster reads; private events remain hidden from
  outsiders. Responses use the public allowlist, no-store caching, and normalized
  Firestore coordinates. Authorised rosters contain public profile fields only.
- `app/(app)/map/page.tsx`: private titles/coordinates are excluded from server
  previews, repeated query parameters are rejected, and page titles no longer
  repeat the site name.
- Logout route, `lib/auth.ts`, Firebase context, Discover, and Profile: clear the
  server session before Firebase sign-out; failures do not report success. The
  server route no longer imports client authentication code.
- `components/map-view.tsx`: defer event drawer/creation code; remove dead wheel
  code and unreachable duplicate filters; separate the creation intent from the
  location-prompt timer; surface fetch errors with retry; encode shared IDs;
  let map idle refresh pins instead of an unowned delayed refresh.
- `components/onboarding-tooltip.tsx`: optional help instead of an automatic
  blocking tour; shared Radix dialog provides focus containment and Escape
  dismissal, with the existing safe-area-aware mobile bottom sheet.
- Discover: bounded geolocation wait with explicit College Park fallback,
  request cancellation/account-change guards, retryable fetch failure, and no
  sign-out button for guests.
- Landing, search, creation, and schedule-import copy: sentence-case actions,
  specific feedback instead of hype, explicit draft review, corrected heading
  hierarchy, and removal of stale/contradictory comments. Category styling and
  the map coordinate/clustering algorithms remain intact.

## Verification

- Unit tests: **141 passed, 18 files**, including SEO, sharing/privacy,
  coordinate normalization, logout, accessibility tokens, and PWA lifecycle.
- Firestore emulator: **11 rules checks passed**; **6 RSVP integration tests
  passed**. Test project `huddlev0git-test`, not production.
- TypeScript, ESLint, preflight, production build, and whitespace checks passed.
  Build uses Node 22; 25 static pages are generated. Existing edge/static and
  standalone-preview notices remain; neither is a compilation failure.
- Production-preview HTTP checks: public directory links, guest details 200,
  missing-event 404, private field exclusion and no-store response header.
- Browser: landing at 390×844; map/help and Discover at 320×568. Guest navigation,
  keyboard dismissal, loaded Discover with unavailable location, and absence of
  the guest sign-out action verified. Emulation is not real iOS device testing.

## Performance: do not overstate readiness

Sequential local mobile Lighthouse runs (headless Edge, simulated throttling):

| Surface | Performance | Accessibility | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Landing | 85 | 100 | 4.4 s | 90 ms | 0 |
| Map, optional walkthrough | 65 | 100 | 17.2 s | 290 ms | 0 |

Landing SEO score: 100. Best practices: 96 on both; localhost analytics endpoints
produce console errors. Reports are in ignored `.artifacts/lighthouse-*-polish.json`.
These are laboratory observations, not field Core Web Vitals or FPS guarantees.
Map LCP remains poor. A prior trace attributed most script execution to Google's
WebGL bundle, not card shadow painting. Do not add blanket GPU layers or swap
map renderers without marker/clustering validation. Test a mid-range Android
phone on cellular before a broad announcement. If the map is unusably slow,
delay broad promotion and use the lightweight directory for a controlled pilot.

`npm audit --omit=dev`: **8 moderate, 0 high, 0 critical** advisories remain in
Firebase Admin's dependency tree. Resolving them includes a major Admin upgrade;
no forced dependency upgrade was performed during this release pass. This is an
outstanding dependency-maintenance risk, not a zero-vulnerability claim.

## Before Monday's announcement

- [ ] Review and commit the local release changes, including new files; push the
  exact branch/SHA intended for deployment. Do not deploy the old `3185387` SHA
  expecting these fixes to be present. Keep the previously working Vercel
  deployment available for rollback.
- [ ] Deploy a preview of that SHA. Confirm production environment variables,
  Firebase authorized domains, Maps key restrictions/billing, and cron mode.
  Local preflight proves presence/format, not live provider delivery or billing.
- [ ] Compare deployed Firestore rules/indexes with the repository in the intended
  project. This pass did not deploy rules or migrate event data. Never run an old
  migration script against production without reviewing its target and writes.
- [ ] With designated test accounts/events, verify Google/email login, reload,
  logout followed by a protected API request, join/leave, capacity/full waitlist,
  duplicate submission, and interrupted-network retry. Do not use real student
  RSVPs as disposable test records.
- [ ] On iPhone Safari and Android Chrome: open a public shared link while signed
  out; check drawer CTA/keyboard/safe areas; deny location; test offline fallback,
  install dismissal, and user-approved service-worker update with two versions.
- [ ] Verify push and email delivery using an explicitly consented test recipient.
  No production push/email or new user account was created by this pass.
- [ ] Confirm Sentry receives a designated test error and review API failure rates.
  Pause promotion for auth loops, private data exposure, duplicate RSVPs, or a
  reproducible map/drawer failure; roll back the deployment for a code regression.
- [ ] Confirm canonical redirects to `https://huddlemap.live`, submit the sitemap
  in Search Console, and inspect a real event with a complete address. Structured
  data alone does not guarantee rich results or ranking.

## Repeatable local gates

Use Node 22 and Java 21 for the emulator.

```sh
npm ci
npm test
npx tsc --noEmit
npm run lint
npm run preflight
npm run build
npm run test:rules
git diff --check
```

The emulator rewrites tracked `firestore-debug.log`; do not include that generated
log in a release commit. Never run `git reset --hard` to clean a working tree.
