# Event discovery improvements — verification handoff

Implemented on `feat/event-discovery-improvements`; included in the `design/landing-motion` release branch.

Release verification (2026-10-03): TypeScript, lint, production build, preflight, environment-template checks, and all 253 unit tests across 27 files pass locally. Emulator integration checks are delegated to the GitHub CI gate because Java is unavailable locally. Live authenticated/device checks below remain outstanding. A new Firestore index and identity-protection rules **must be deployed** before release. There are no new packages.

## Changes

- Existing uncommitted RSVP work: confirmed joins show a friend-sharing prompt and calendar shortcuts; private invitations are disabled. Calendar exports use canonical event timezone and end-time helpers.
- Individual map events: desktop hover/focus shows a compact informational preview; click/Enter opens the existing drawer. Touch devices use a bottom preview with View details and Close. Clusters, deep links, list selection, and RSVP backend behavior are unchanged.
- Preview data comes from the already-loaded event list. It does not fetch a roster, create listeners, or increment views. Event-view tracking still occurs on opening details.
- Description assistance: AI responses are proposals, not immediate edits. Use suggestion, Keep mine, and Restore original control replacement. Changed inputs invalidate proposals. Requests are cancelled on modal reset/close, and expire after 30 seconds on the client.
- Both API inputs and generated output are bounded and validated. Unverified generated transit advice was removed. Manual transit tips and saved organizer presets remain available. AI failures must leave the draft editable.
- Optional AI title, category and basic emoji suggestions each have explicit Apply actions. Description undo restores only the description, not other individually accepted fields.
- `/organizers` and `/organizers/[id]`: single-owner public club/business/community pages, about/location/website, existing Follow controls, public upcoming events. Creation/editing lives in Organizer Studio. Existing hosts without a page fall back to their public profile. Identity changes reset verification; self-published pages are labeled community-submitted and are not indexed individually until approved.
- `/admin`: review organizer identity and event-access requests. Imported events can no longer be claimed by merely signing in. An admin reviews evidence, then the requester completes the ownership transfer. Ownership updates preserve RSVPs without auto-adding a participant or increasing capacity usage. There is no bulk attendee notification fan-out during transfer.
- Home: followed-organizer events and explicitly public event updates. Public updates replace the previous update for that event, can be removed in Studio, and disappear from the feed when the event ends/becomes private or the organizer unpublishes. Existing pinned attendee messages are not exposed. Removed fake match scores. Account changes abort/reload personalized feed requests and personalized responses are not cached.
- Import: natural-language single events or pasted schedules/CSV-style rows, 20-event limit, explicit venue selection and capacity, all fields editable, no assumed year/time/location. Publishing requires review and authorization confirmation. Atomic transactions write geohashes and private receipts, with stable retry keys and exact-payload duplicate protection even across a new submission ID. No file uploads or automatic calendar synchronization are included.
- `/partners`: local business onboarding and promotion pilot enquiry through the existing feedback email flow. No payment collection or paid ranking changes.
- Post-RSVP invitations can also send an in-app notification to a mutual follow. Server checks include membership, public/upcoming event, both follow directions, both block lists, daily limits, and a deterministic notification ID. No automatic RSVP or push fan-out. Notification cards now offer an explicit View event link.
- Client event writes can no longer transfer `createdBy` or modify trusted ownership/source/verification metadata. Normal gallery writes remain supported. New events no longer derive verification from a client-writable user profile; the reviewed organizer page is the authoritative verification surface. Review old event verification flags separately if they were set under the old trust model.

## Automated gates (verification agent)

Run the five gates documented in `CLAUDE.md` before committing:

```sh
npx tsc --noEmit
npm run lint
npm run build
npm run preflight
npx vitest run
```

New unit test files: `__tests__/rsvp-next-steps.test.ts`, `__tests__/event-description.test.ts`, and `__tests__/organizers-and-import.test.ts`. These cover sharing cancellation/fallback/privacy, calendar timezone/end-time handling, AI authentication/rate limits, field projection, organizer validation, and schedule validation.

New emulator-only integration files: `__tests__/integration/organizer-flows.test.ts` and `__tests__/integration/organizer-rules.test.ts`. They cover concurrent import retries, reviewed ownership transfers, mutual-follow invitations, update ownership, and rejected client identity forgery. Run `npm run test:rules` as well as the five gates; the default unit suite excludes integration tests. The new suites refuse non-local emulator addresses. Unit tests have passed; emulator tests require CI verification. Neither replaces the device checks below or live configuration review.

## Required configuration and deployment

- Deploy `firestore.indexes.json` with `firebase deploy --only firestore:indexes` to the intended staging/production project after checking the CLI project selection. The new index is `events(createdBy ASC, date ASC)`. Wait for it to finish building before deploying the organizer pages.
- After emulator coverage and reviewing the actual deployed rules, deploy `firestore.rules` with `firebase deploy --only firestore:rules`. These edits are not active merely because the Next.js app is deployed. Exercise gallery uploads, authorized edits, rejected owner/verification forgery, and server-approved transfers before rollout.
- `ADMIN_UID` must identify the actual admin Firebase account. Reviews fail closed when unset. Verify a normal user gets 403 from both admin review handlers.
- `GEMINI_API_KEY` remains server-only. `GEMINI_MODEL` optionally overrides the new stable default `gemini-2.5-flash`. Google’s current [model lifecycle documentation](https://ai.google.dev/gemini-api/docs/deprecations) lists that stable model. Run a real staging parse and enhancement; no provider call was made here. The old dated preview default was removed.
- New collections `organizers`, `organizerUpdates`, `eventClaims`, `scheduleImports` use Admin-only routes and the existing rules' implicit deny. Do not add public client write rules. Verify this against the actual deployed rules, not just the repo copy.

## Device checks

- Desktop mouse: hover both a dot and a full pin, move into the preview, then away; it should persist while hovered and dismiss on Escape. Clicking opens the drawer once. Check map edges for clipping and verify hover alone does not send a view request.
- Keyboard: focus markers, read their previews, press Enter/Space to open details; no hover-only controls should be required.
- Mobile Safari/Chrome: tap a dot/full pin, switch to another pin, close, then reopen details. Search, location prompt, and floating buttons must not overlap the preview; bottom navigation stays usable. Test a short landscape viewport and a touch-capable laptop too.
- Filters/list/create dialog: opening another surface or changing filters must dismiss old previews. Deep links must still open details directly. Cluster expansion must remain unchanged.
- AI: generate, Keep mine, generate again, Use suggestion, Restore original. Type or change date/location while a request is pending; the old proposal must not replace those changes. Close/reopen during the request. Verify malformed output, provider failure, rate limiting, and slow/offline connections preserve the draft.
- Verify the deployed Gemini configuration serves the model configured in `lib/gemini.ts`; provider selection changed, and no live call has been made.
- RSVP: successful join, repeated join, waitlist, leave, private event, native share cancellation, clipboard denial, and multi-day calendar download.
- Organizer ownership: user A cannot edit B's page, submit verification flags, or publish/delete B's updates. Anonymous accounts cannot publish/import/request organizer access. Test publish/unpublish and identity edits after approval. Test private and expired event exclusion, missing index error state, and following when signed out.
- Claims: requesting access must return 202 without changing ownership; pending/rejected requests must not transfer events. Test two approved applicants racing: only one transfer succeeds. Repeated completion must be idempotent. Stale admin review versions must return 409. Reject unsupported claim-update fields.
- Import: concurrent identical publishes, lost response/retry, repeated payload under a new submission ID, conflict using one submission ID for different payloads, missing locations, invalid dates/times/timezones, duplicate rows, expired events, >20 entries, limits and account switching. Inspect that each created event has a geohash and that retries return existing IDs.
- Updates: only a public event's creator can post; expire/hide on event ending/privacy/ownership change and page unpublish. Remove an update and verify the event itself is unchanged. Ensure no attendee-only pinned text appears in the feed.
- Friend invitations: signed-out/anonymous, not joined, one-way follow, self-invite, both directions of blocking, private/ended events, repeated/concurrent sends, account switching and denied notification requests. Confirm one stored in-app notification per sender/event/recipient and correct navigation. Do not call push delivery verified.

## Still separate phases

- Multi-owner club membership, role invitations, ownership handoff between club officers, and multiple organizations per account. Current pages deliberately retain existing creator-only permissions.
- Paid subscriptions, ticket checkout, sponsorship delivery and billing webhooks. Payment/provider credentials, commercial terms and explicit sponsored-placement policy are prerequisites. Promotion enquiries are not bookings.
- Uploaded PDF/calendar files and automatic calendar synchronization (pasted rows, schedules, and single-event descriptions are supported).
- Directory/feed pagination beyond current bounded windows, automated moderation, and durable background job infrastructure. These are not claimed implemented.
