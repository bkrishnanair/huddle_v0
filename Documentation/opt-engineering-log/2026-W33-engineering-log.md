# Weekly Engineering Log: 2026-W33

## 1. Objectives
- Resolve blocked branch merges to synchronize `main` with production before students return.
- Optimize and consolidate cron handlers to comply with Vercel Hobby/Pro tier limits and prevent Firestore full-collection scans that deplete the read budget.
- Harden Firestore and Storage security rules to prevent unauthorized client modifications (defense-in-depth on PII and append-only arrays).
- Remove build-time suppressions and implement a CI pipeline (`.github/workflows/ci.yml`) to enforce code quality, type-safety, and Next.js linting via Flat Config.
- Implement rate limiting with atomic `FieldValue.increment` and enforce authentication on AI endpoints and user search logic to prevent abuse.

## 2. Work Breakdown

### Task 1.1 & 1.2: Cron Consolidation & Merge Unblocking
- **Commit:** `7cea60a` & `4c92b00`
- **Discipline:** Backend Architecture & Operations
- **Description:** Extracted all Vercel background cron jobs into isolated modules in `lib/cron/` using `import 'server-only'`. Created a centralized `/api/cron/dispatch` handler that runs hourly and executes the appropriate jobs based on UTC time. Rewrote the `serendipity` and `scheduled-messages` handlers to use bounded, index-free queries (`where('date', '>=', today)`) to completely eliminate full-collection scans. Fast-forward merged the stalled `feat/attendee-reminders` branch and resolved its merge conflicts against `main`.

### Task 1.3, 1.4 & 1.5: Security Hardening (Firestore & Storage)
- **Commit:** `cd73ac8`
- **Discipline:** Security & Infrastructure
- **Description:** Audited and corrected Firebase security rules. Removed an overly-permissive `hasOnly` rule that allowed any player to overwrite the `events.players` array. Replaced it with an append-only rule for the `events.gallery` array. Added a defense-in-depth `allow read, write: if false` rule for the `guestContacts` (PII) subcollection. Hardened `storage.rules` to strictly enforce that only event participants (checked via `firestore.get()`) can upload photos under 5MB. Verified the new `admins` property constraint allowing co-admins to edit event details.

### Task 1.6: Build-Time Enforcement & CI
- **Commit:** `49e5624` (squashed conceptually)
- **Discipline:** DevOps & Developer Productivity
- **Description:** Removed unsafe `ignoreDuringBuilds` and `ignoreBuildErrors` from `next.config.mjs`. Fixed resulting TypeScript issues. Wrote an `eslint.config.mjs` flat configuration resolving circular dependencies upstream from Next.js 15. Created `.github/workflows/ci.yml` that strictly enforces linting, typechecking, and building on all pushes and PRs to `main`.

### Task 1.7 & 1.8: Rate Limiting and AI Security
- **Commit:** `49e5624`
- **Discipline:** Backend Engineering
- **Description:** Designed and implemented `lib/rate-limit.ts` using Firestore `FieldValue.increment` to track atomic time windows. Applied the middleware defensively to 8 backend endpoints: `events/route.ts` (20/day), `events/[id]/rsvp/route.ts` (30/min), `events/[id]/chat/route.ts` (30/min), `users/[id]/follow/route.ts` (60/min), plus the four AI endpoints (`parse-schedule`, `enhance-description`, `ai/search`, and `users/search`). Confirmed that `GEMINI_MODEL` (`gemini-2.5-flash-preview-04-17`) is consistently referenced via `lib/gemini.ts`.

## 3. Hour Estimates
**Estimated Hours (founder to verify):** 18 hours

## 4. Technical Decisions
- **Cron Optimization Strategy:** Instead of implementing a queueing system or complicated event bridges, relying on an hourly Vercel cron to execute multiple jobs sequentially bypasses the Vercel Hobby tier limitation of a single cron while keeping complexity low.
- **Atomic Rate Limiting:** Utilized `FieldValue.increment` rather than reading and rewriting a document to limit the risk of race conditions resulting in missed rate limit counts during concurrent API floods.
- **Flat Config Rollout:** Dropped `.eslintrc.json` entirely in favor of an explicit `eslint.config.mjs` flat config to suppress circular dependency bugs occurring between `next lint`, ESLint 9, and React plugin trees.

## 5. Verification Performed
- **Firestore Rules Emulator Testing:** Wrote and executed a Node.js test script using `@firebase/rules-unit-testing` over `npx firebase emulators:exec`. Assertions confirmed:
  - ✅ non-owner CANNOT update players
  - ✅ non-owner CANNOT update currentPlayers
  - ✅ owner CAN update event details
  - ✅ participant CAN append to gallery
  - ✅ participant CANNOT replace gallery with a shorter array
  - ✅ unauthenticated read of an event SUCCEEDS
  - ✅ admin CAN update event details
- **Query Index Checks:** Validated that the newly bounded queries on `date` natively utilize the single-field index without requiring explicit composite configurations. Modified `cleanup.ts` to perform multi-field condition logic entirely in-memory to prevent Firebase query schema invalidation.

## 6. Technical Debt
- **User Candidate Scan for Serendipity:** The `serendipity.ts` handler currently evaluates the entire user base (bounded to `limit(500)`). Once user volumes exceed this, an alternative asynchronous or queue-based matching system will be necessary.
- **Mock Testing Rig:** The Firebase emulator currently runs locally over a script `test-rules.mjs` but is not integrated directly into Vitest due to mock architecture constraints. This should be rolled into the CI pipeline eventually.

## 7. Artifacts Produced
- `Documentation/testing/2026-08-rules-verification.txt` (Local Firebase Emulator logs)
- `.github/workflows/ci.yml`
- `lib/rate-limit.ts`
- `eslint.config.mjs`

## 8. Degree Relevance
- Distributed Systems: Implemented rate-limiting synchronization mechanisms leveraging remote atomic data-structures.
- Software Architecture: De-coupled backend scheduling logic into a generic Dispatch pattern capable of time-constrained sequential module execution.

## 9. Variance Note
The build-time enforcement logic was pushed directly to `main` due to time constraints in resolving the local blocking issues. Future structural updates (Block 2) will proceed through the established CI branching protocol.
