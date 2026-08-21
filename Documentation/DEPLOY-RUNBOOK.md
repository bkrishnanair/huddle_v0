# Deploy runbook — launch waves 1 and 2

Production is on May 4 code (`e2349a7`). Two PRs ship it forward, split by
blast radius: **wave 1 touches no user data, wave 2 migrates it.** Ship them
separately so a regression is bisectable to one of the two.

Timebox: wave 1 ~30 min including verification. Wave 2 ~30 min. Do not start
wave 2 until wave 1 has been live and healthy for at least 20 minutes.

---

## STEP 0 — Before you merge anything (10 min, console only)

These are prerequisites, not optional. Two of them are irreversible if skipped.

### 0.1 Enable Point-in-Time Recovery — **do this first**

Firebase Console → Firestore → Backups → **Enable PITR** (7-day window).

Wave 2 runs a migration that permanently deletes three fields from live
documents. You currently have **no recovery window at all**. Two clicks, small
storage cost, and it is the difference between a bad migration being an
inconvenience and being unrecoverable. **Do not run the wave 2 migration
without this.**

### 0.2 Set the Vercel environment variables

Vercel → Settings → Environment Variables → Production. Locally all of these
now pass `npm run preflight`, but **Vercel does not read `.env.local`.**

| Variable | Why it matters tonight |
|---|---|
| `CRON_SECRET` | See 0.3 — this one is urgent |
| `RESEND_API_KEY` | Without it no reminder email has ever sent |
| `RESEND_FROM_EMAIL` | Deliverability; must be your verified domain |
| `NEXT_PUBLIC_VAPID_KEY` | Without it push mints no token |
| `GEMINI_API_KEY` | AI routes 500 without it |
| `ADMIN_UID` | `/admin` refuses everyone without it |
| `GOOGLE_MAPS_SERVER_KEY` | Scraper geocoding silently falls back to campus centre |
| `NEXT_PUBLIC_APP_URL` | `https://huddlemap.live` — new in wave 1, used by calendar links and reminder emails |

After deploy, confirm from the deployment logs that this line is **absent**:

```
🔧 Initializing Firebase Admin SDK in fallback mode
```

Its absence is the proof credentials resolved. The `✅ Firebase Admin SDK
initialized successfully` line prints either way and proves nothing.

### 0.3 `CRON_SECRET` is a live auth bypass while unset

All six cron routes check:

```js
authHeader === `Bearer ${process.env.CRON_SECRET}`
```

Unset, that string is literally `"Bearer undefined"`. So today: Vercel Cron
gets 401, and **anyone sending `Authorization: Bearer undefined` gets a 200**
and can trigger your reminder, cleanup and serendipity jobs at will. Setting
the variable closes it.

### 0.4 Delete the duplicate Cloud Function

Firebase Console → Functions → delete **`sendEventReminders`** and
**`generateEventCopy`**.

Wave 1 deletes the source, but the *deployed* function keeps running every 10
minutes until you delete it in the console. It has never found an event, but
once `RESEND_API_KEY` is set there is a live risk of a second reminder system
waking up. Delete it before the env var lands.

---

## STEP 1 — Ship wave 1

**PR:** https://github.com/bkrishnanair/huddle_v0/pull/new/release/launch-wave-1

24 commits. No user data touched, no migration, no rules change.

1. Open the PR, confirm CI is green.
2. Merge to `main`.
3. Watch the Vercel deployment to completion.

### Verify — production, ~10 min

| # | Check | Where | Pass |
|---|---|---|---|
| 1 | Map renders, pins visible | `huddlemap.live/map` | pins draw |
| 2 | No fallback-mode line | Vercel → Logs | line absent |
| 3 | Event drawer opens, RSVP works | any pin → Join | RSVP persists |
| 4 | Notification poll is 5 min | DevTools → Network, filter `notifications` | one request per 5 min, **none while tab hidden** |
| 5 | Cron auth works | Vercel → Logs, wait for `:00` | `/api/cron/dispatch` 200, not 401 |
| 6 | Reminder email actually sends | Resend → Logs | a delivered event |
| 7 | Next version | Vercel → deployment detail | `15.2.8` |

**Check 4 is the one that matters for cost.** Before this change a single open
tab issued 2,880 requests/day.

**Check 6 is the one nobody has ever confirmed.** If Resend shows nothing after
a cron run, the channel is still dead — treat that as a finding, not a pass.

### If wave 1 is bad → rollback (~2 min)

Vercel → Deployments → the last known-good deployment → **Promote to
Production**. Instant, no rebuild. Then revert the merge on `main`:

```bash
git revert -m 1 <merge-commit-sha> && git push
```

Nothing in wave 1 writes user data, so a rollback needs no data repair.

---

## STEP 2 — Ship wave 2 (only after wave 1 is healthy)

Wave 2 is currently local-only at `release/launch-wave-2`, based on `main` as
it was before wave 1. It has been trial-merged against wave 1: **zero
conflicts, all five gates 0.**

```bash
git checkout release/launch-wave-2
git merge origin/main          # picks up wave 1
npm install
npx tsc --noEmit && npm run lint && npm run build && npm run preflight && npx vitest run
git push -u origin release/launch-wave-2
```

Then open the PR and merge it. **Do not run the migration yet.**

### 2.1 Deploy the Firestore rules — before the migration

Wave 2 is the only branch that changes `firestore.rules` (+10 lines: the
`match /roster/{uid} { allow read, write: if false; }` deny-all). **That rule
is not live yet.**

```bash
npx firebase deploy --only firestore:rules --project huddle-dca59
```

Deploy it *before* the migration. The subcollection is still empty, so this is
safe and idempotent; doing it after would leave freshly-written PII readable by
any client for the length of the gap.

Confirm in Firebase Console → Firestore → Rules that the published timestamp
just changed and the `roster` block is present.

### 2.2 Migration — dry run first

```bash
npx tsx --env-file=.env.local scripts/migrate-roster-fields.ts
```

`DRY_RUN` defaults on. Read the output before going further. Expect per event:
the fields present, the number of roster entries, and the exact
`FieldValue.delete()` it *would* perform. **Nothing is written.**

Stop and investigate if you see: zero events scanned, or an event count wildly
different from ~565.

### 2.3 Migration — live

```bash
DRY_RUN=false npx tsx --env-file=.env.local scripts/migrate-roster-fields.ts
```

Per event it copies → re-reads and verifies → and only then deletes the three
parent fields. A verification failure leaves the parent intact and exits 1.

Expect a final summary: events migrated, events skipped, **verify failures: 0**,
roster docs written. **Any non-zero verify-failure count means stop.**

The script is idempotent — safe to re-run.

### 2.4 Prove the migration worked

Firebase Console → Firestore.

1. **The parent fields are gone.** Open any event that had attendees. Confirm
   `attendeeNotes`, `attendeeAnswers` and `attendeePickup` are **absent** —
   not empty maps, absent.
2. **The data moved.** On that same event open the `roster` subcollection.
   There should be one document per attendee who submitted anything, each with
   `note` / `answers` / `pickup` / `updatedAt`.
3. **The rule holds.** In a browser signed out, open DevTools on
   `huddlemap.live` and run:
   ```js
   firebase.firestore().collection('events').doc('<id>').collection('roster').get()
   ```
   It must reject with `permission-denied`. If it returns documents, the rules
   deploy in 2.1 did not take — stop and redeploy.
4. **The app still works.** Open an event you organize → the roster shows names
   and notes (served by `/api/events/[id]/attendees`, not the client SDK), and
   CSV export still contains the answer columns.

### If wave 2 is bad → rollback (~5 min)

**Code** — same as wave 1: promote the previous Vercel deployment, revert the
merge.

**Rules** — redeploy the previous `firestore.rules` from `main`:
```bash
git checkout origin/main -- firestore.rules
npx firebase deploy --only firestore:rules --project huddle-dca59
```

**Data** — this is the part that needs PITR from step 0.1. The migration copies
and verifies before deleting, so a partial run leaves the parent fields intact
on anything it did not finish. If a completed run has to be undone, restore via
Firestore PITR to a timestamp just before the run. Without PITR enabled this
path does not exist.

---

## Ordering summary

```
0.1 PITR on ─────────────────────────────► (blocks 2.3)
0.2 Vercel env vars set
0.3 CRON_SECRET set ─────────────────────► closes Bearer-undefined bypass
0.4 Delete deployed Cloud Function ──────► before RESEND_API_KEY goes live
 │
 ▼
1.  Merge wave 1 → verify → 20 min soak
 │
 ▼
2.1 Deploy firestore.rules (roster deny-all)
2.2 Migration dry run → read output
2.3 Migration live → verify failures must be 0
2.4 Prove it in the console
```

## Known-good reference points

- Route sizes: `Documentation/testing/2026-08-build-baseline.txt`. Wave 1 moved
  **no route by more than 5 kB**; shared chunk still 100 kB.
- Design token contract: `Documentation/design/TOKENS.md`.
- Environment: `npm run preflight` must exit 0 before any deploy.

## Deliberately not in either wave

The Instrument surface rebuilds (map, drawer, create sheet, landing) are blocks
4–7 and are **not** in these PRs. Wave 1 carries only the additive token layer,
which no component references yet — verified zero visual change.
