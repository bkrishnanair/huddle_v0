# Low-cost hosting handoff

Prepared October 11, 2026. Code readiness is not permission to use a hosting plan.
No subscription, production environment, DNS, security rules, or production
event records were changed while preparing this work.

## Before cancelling Pro

Vercel Hobby is restricted to non-commercial personal use. Huddle's LLC/business
purpose and organizer offerings mean eligibility must not be assumed merely
because revenue or daily usage is low. Confirm eligibility with Vercel Support
before downgrading. Removing a payment button does not settle this question.

- [Vercel fair-use policy](https://vercel.com/docs/limits/fair-use-guidelines)
- [Hobby plan and quotas](https://vercel.com/docs/plans/hobby)
- [Cron frequency and timing limits](https://vercel.com/docs/cron-jobs/usage-and-pricing)
- [Function duration with Fluid Compute](https://vercel.com/docs/functions/limitations)

If Huddle is ineligible, these changes still reduce background work on Pro.
An alternative host requires a separate migration decision and validation of
Firebase Auth's same-origin /__/auth proxy, sessions, scheduled jobs, and domain.
Do not cancel first and leave the production app without eligible hosting.

## What changes

| Work | Schedule / limit |
| --- | --- |
| TerpLink refresh | Daily, 10:00–10:59 UTC on Hobby; at most 100 source listings and 20 geocoding requests per run |
| Maintenance dispatcher | Daily, 14:00–14:59 UTC on Hobby |
| Cleanup | Existing resumable 200-document pass; uses actual end time, never just start date |
| Post-event feedback | 28-hour lookback, including older-starting multi-day events |
| Reminders | Events starting within 28 hours; daily, not a guaranteed T-24h service |
| Scheduled chat | Next daily check after the selected time; expired messages cancelled |
| Recommendations | Once within dispatch, at most 10 eligible events, 20 sends and a 45-second soft work budget |

There are two scheduled HTTP invocations per day instead of 88 (24 dispatches
plus 64 separate recommendation invocations). This is not a measured percentage
reduction in the total bill: user traffic and other providers are separate.

Browsing, Google sign-in, immediate chat, event creation, RSVPs, sharing and
organizer pages retain their existing paths. No new package or service is added.

`vercel.json` is the cadence source of truth. Old CRON_PLAN=pro / CRON_MODE=hourly
values cannot skip daily cleanup. They may be removed from production when
convenient. `fluid: true` explicitly supports the existing 300-second dispatcher
ceiling on Hobby; an invocation ends as soon as its work finishes.

## Safety and limits

- Dispatcher and importer use expiring Firestore leases. Admin imports share
  the import lease. Scheduled message writes and sent flags are atomic.
- The importer preserves claimed/manual events, privacy, moderation status,
  ownership and attendance fields. Unchanged source fields cause no event write.
  It stops starting work after 45 seconds and reports partial failures/deferred
  items. It refreshes only the next 100 upcoming source listings, not all TerpLink
  history, ongoing source events, or cancellations removed from the source feed.
- A daily scheduler may miss reminders for events created or joined after its
  run. Scheduled chat may be delayed more than 24 hours, and is cancelled if the
  event ends first. The composer explains this; immediate chat remains available.
  Use calendar reminders for time-sensitive personal plans.
- Daily prompt/reminder queries are bounded and report truncation as a failed
  run. Larger workloads need pagination before increasing these limits. Cleanup
  is eventual across cursor passes, not guaranteed exactly 48 hours after ending.
- Vercel does not automatically retry failed cron jobs. The next daily import
  reconciles upcoming source listings; extended outages can still leave gaps.
- No private or personalized responses were made publicly cacheable to cut costs.

## Deployment checklist (manual / deferred)

1. Confirm Hobby eligibility, current usage headroom, connected Git ownership,
   and any Pro-only collaboration or deployment settings in Vercel. Stop if
   eligibility is not confirmed; do not reinterpret the plan terms in code.
2. Review this branch, run CI, merge, and deploy while Pro is still active.
3. Confirm Fluid Compute is enabled in the deployment and **only** the two daily
   cron entries above are registered. Keep CRON_SECRET and all existing Firebase,
   Maps, Resend and authentication configuration. No new secret is required.
4. Check the existing `events(endDate ASC, date ASC)` index is READY. It was added
   for ongoing event discovery; this work requires no new index or rule change.
5. Smoke-test anonymous map browsing, sign-in/redirect return, event creation,
   RSVP and immediate chat. Verify the scheduling notice on mobile. Do not use
   real students as notification test recipients without consent.
6. Observe one daily cycle in production. Check `cronRuns` for all five handler
   results and `cronState/terplinkSync` for lastAttemptAt / lastSuccessAt and
   failed/deferred counts. Watch failures, not just HTTP invocation presence.
7. Only then schedule the billing downgrade, after confirming its effective
   date and remaining charges with Vercel. Do **not** pause or delete the project;
   pausing service is different from changing the subscription.
8. Review usage again after a week. Free limits are not an uptime guarantee;
   Vercel can restrict service when a quota is exhausted.

Firebase/Firestore, Google Maps, Resend, Gemini, Sentry and the domain have their
own billing and quotas. Downgrading Vercel does not cancel those. Keep provider
budget alerts; do not assume an alert imposes a hard spending cap. This work
does not certify a zero-dollar total bill or change those subscriptions.

## Verification

Local verification on October 11: TypeScript, lint, production build, both
preflight modes and diff whitespace checks passed; 313 tests across 36 unit-test
files passed, including map zoom regression coverage. The build retains the
existing Edge/static-generation warning. A local-browser smoke test confirmed
future-event dots expand into category pins when zooming from level 15 to 17.
No emulator integration suite, production cron invocation, physical-device
smoke test or Vercel billing change was performed in this task.

Run:

```sh
npx tsc --noEmit
npm run lint
npx vitest run
npm run build
npm run preflight
npm run preflight -- --check-template
git diff --check
```

Unit tests mock external services; a successful build is not a live notification,
OAuth, TerpLink or billing test. Local preflight inspects local environment values,
not the Vercel environment. Actual daily execution must be confirmed after deploy.

For rollback, keep the daily cron/Fluid configuration when returning other code
to a prior version. Older releases contain Pro-frequency schedules. Vercel instant
rollbacks do not automatically reset active cron schedules; inspect them explicitly.
