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

## Design system — "Instrument"
Light-first, paper-and-ink. Tokens live in globals.css, semantic names in
tailwind.config.ts. Bricolage Grotesque = headlines only. Inter = body.
IBM Plex Mono = ALL numerals: times, distances, counts, show rates.

BANNED: emoji in chrome or copy · gradients · glassmorphism or
backdrop-blur · dark backgrounds on new surfaces · arbitrary Tailwind
values (p-[13px], z-[60], unlisted hex) · any looping animation other than
RadarPing · the words "premium", "cinematic", "AI-powered",
"revolutionary", "seamless" · exclamation marks · title case in buttons.

Never display a zero. Hide a count rather than render "0 events".
Never fake a live state. If nothing is live, show "next up today".

## Workflow
- One branch per task: feat/<slug> or fix/<slug> or design/<slug>.
- Run `npx tsc --noEmit && npm run lint && npm run build` before every
  commit. All three must exit 0.
- Never commit directly to main. Open a PR and let CI gate it.
- If a task requires my access (env var, Firebase console, Vercel setting),
  implement the code path with graceful degradation and a TODO comment,
  add the item to a deferred list, and continue. Do not stop and wait.
- Report completion with grep-verifiable evidence, not summaries.