# Mobile fixes handoff

## Workspace

- Working branch: `codex/mobile-launch-fixes`, based on `3f67c9a`.
- Changes are local and uncommitted. No deployment, production import, notification run, or Firestore rules change was performed.
- Preserve the older dirty `huddle_technical_lead` worktree. Its edits are not part of this task.

## Implemented

- RSVP: normalize Firebase GeoPoint values at the public payload boundary, preventing successful RSVP responses from breaking map coordinates.
- Mobile overlays: shared visualViewport sizing, disabled competing Vaul input repositioning, constrained scroll regions, compact create footer, and chat-only scrolling. Preserve text typed while a send is in flight.
- Discovery: public events no longer wait for geolocation/profile requests. Heavy dialogs load on demand. Compact search/sort/filter rows and event cards; full category borders/tints and distinct community/sports/arts colors.
- Map: mobile map/list/help controls in the header, scrollable filter rows, clearable location search, valid-coordinate guards, shared timezone-aware filters, This Week reset/default and requested filter order.
- Recurrence: an ended occurrence no longer hides the next occurrence in grouped discovery results.
- Profiles/social: remove redundant history/location requests, link follower profiles, reusable follow buttons with rollback, list error/retry handling, profile sharing/discovery links, bounded name-prefix lookup and block filtering. Replace placeholder achievements with usable event links.
- My Events: lazy dialogs/dashboard, abort stale requests, no duplicate geolocation-triggered fetch, shared timezone classification, retry action, no in-place sorting of React state.
- Recommendations: deterministic per-event notification IDs, transactional daily user cooldown and current eligibility checks, bidirectional blocks, preference filtering, bounded sends/queries, deterministic factual copy instead of per-candidate model calls. Unclaimed imported placeholder capacities are excluded.
- TerpLink: bounded four-worker import, source-ID matching, idempotent transaction updates of unclaimed source-owned events, specific category classification, stable coordinates, cached/capped/timed-out geocoding, local timezone conversion. Existing ownership/RSVP/privacy/moderation fields remain untouched.

## Verification boundary

An earlier checkpoint passed 206 tests, TypeScript, lint, build and preflight. The user subsequently requested no more checks or tests. **Final edits after that checkpoint have not been tested or built.** Do not describe the current working tree as verified or release-ready.

Next agent: inspect the final diff, then run the repository's five gates and the Firestore emulator integration suite. Include regression coverage for recurring groups with an ended instance earlier today, overnight My Events classification, aborted follow-list requests, and both block directions in recommendation transactions.

On real Android Chrome and iOS Safari, exercise authenticated RSVP/leave, chat send with keyboard open, chat tab switching, organizer-note entry, event creation, keyboard dismissal/reopening, and safe-area scrolling. Cover 320/390px widths, slow mobile data, denied geolocation, and dropped requests. A mocked desktop browser does not establish real keyboard correctness.

## Operational limits

- TerpLink remains an admin-triggered import of up to 100 upcoming source results, not a complete paginated/cancellation synchronization. Existing category updates take effect on the next authorized import. Do not delete absent source events automatically.
- Old notification history is retained. New cooldown/deduplication behavior applies to future runs; imported listings are excluded until claimed.
- Name search uses existing case-sensitive Firestore indexes with common case variants and a bounded legacy fallback, not exhaustive fuzzy/full-text search.
- Live push delivery, cron execution, source geocoding quality and device keyboard behavior require production/staging verification. Do not trigger production notifications or writes merely to test them.
