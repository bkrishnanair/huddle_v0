# Ongoing event lifecycle fix

Branch: `fix/ongoing-event-lifecycle`, based on the merged landing release `5d3eec9`.

Local verification (2026-10-03): TypeScript, lint, production build, preflight, and all 275 unit tests across 30 files pass. Release status and emulator verification are recorded in the fix PR checks.

## Root cause and changes

- Cleanup previously archived by start date, ignoring a future end date. It also permanently skipped long-running events once their starts left a seven-day scan window.
- Cleanup now uses the canonical end-time helper and a 48-hour elapsed retention period. A transaction rechecks event versions on contention and commits the archive writes with a private `cronState/eventCleanup` cursor. Each invocation scans at most 200 event documents plus one cursor read before retries; later invocations resume and wrap. This is eventual cleanup, not a guarantee of archival at exactly 48 hours.
- General discovery, SEO directories/sitemap, and organizer listings share two bounded queries: recent/future starts and older starts whose end dates overlap the window. Normal public-field projections and private-event filtering remain in the callers.
- An explicit end date without an end time lasts through the end of that local calendar day. Events with neither end field retain the existing two-hour fallback. Invalid explicit end dates/times are not silently treated as finished.
- The map's geospatial queries, RSVP logic, and importer are unchanged. This fixes premature removal, not the separate absence of a scheduled TerpLink importer.

## Deployment prerequisites

Create these additive indexes in `huddle-dca59` and wait for `READY` before deploying this code:

- `events`: `endDate ASC`, `date ASC`.
- `events`: `createdBy ASC`, `endDate ASC`, `date ASC`.

Both are declared in `firestore.indexes.json`. Preserve unrelated deployed indexes; do not use a forced index deletion. No new environment variables or security-rule changes are needed. The cursor collection inherits the existing client deny-by-default rules.

Read limits are explicit: general discovery at most 602 documents, SEO at most 1,102, and organizer discovery at most 202, before filtering. Index-entry billing is separate for multi-range queries. Truncation is reported by the helper; full pagination is not part of this fix.

## Recovery and verification

Do not bulk-unarchive events. Existing archived records might be intentionally ended or moderated. A previously incorrect archival needs an organizer/admin-approved, event-specific status restoration after checking its stored end date and moderation history. This code never restores archived records automatically and no production event records were changed during implementation.

Regression suites: `__tests__/event-lifecycle.test.ts`, `__tests__/event-discovery.test.ts`, and `__tests__/event-cleanup.test.ts`. They cover long-running events, date-only ends, DST, the 48-hour boundary, invalid dates, public projection, bounded reads, cursor continuation, transaction failures, and extension re-evaluation on retry. The transaction retry unit test models contention; it is not a live concurrency test.
