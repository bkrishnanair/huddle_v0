#!/usr/bin/env node
/**
 * preflight.mjs — environment readiness check.
 *
 * Several Huddle subsystems degrade *silently* when their env var is missing:
 * email logs a warning nobody reads, push simply never mints a token. Both
 * shipped in that state for weeks. This script makes that visible in one
 * command instead of one incident.
 *
 * Reads .env.local when present, otherwise process.env (Vercel / CI).
 * Pure inspection — no network, no auth, no writes. Safe to run anywhere.
 *
 *   npm run preflight
 *
 * Exits 1 if any LAUNCH-CRITICAL variable is missing.
 */
import { readFileSync, existsSync } from 'fs';

const RED = '\x1b[31m', GRN = '\x1b[32m', YEL = '\x1b[33m', DIM = '\x1b[2m', BLD = '\x1b[1m', RST = '\x1b[0m';

const env = { ...process.env };
if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

// critical: launch breaks without it. degraded: a feature silently no-ops.
const CHECKS = [
  { group: 'Firebase — client',  level: 'critical', vars: ['NEXT_PUBLIC_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'NEXT_PUBLIC_FIREBASE_APP_ID'], breaks: 'App cannot boot — auth and Firestore fail.' },
  { group: 'Firebase — admin',   level: 'critical', vars: ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'], breaks: 'Every API route 500s. No RSVPs, no crons.' },
  { group: 'Google Maps',        level: 'critical', vars: ['NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'], breaks: 'Map does not render — the core surface.' },
  { group: 'Google Maps — style',level: 'degraded', vars: ['NEXT_PUBLIC_GOOGLE_MAPS_STYLE_MAP_ID'], breaks: 'Map falls back to default styling with POI clutter.' },
  { group: 'Google Maps — server',level:'degraded', vars: ['GOOGLE_MAPS_SERVER_KEY'], breaks: 'Scraper geocoding falls back to the referrer-restricted client key and may fail.' },
  { group: 'Cron auth',          level: 'critical', vars: ['CRON_SECRET'], breaks: 'All 6 crons return 401: reminders, cleanup, serendipity, scheduled messages, post-event prompt.' },
  { group: 'Email (Resend)',     level: 'critical', vars: ['RESEND_API_KEY'], breaks: 'T-24h reminder emails SILENTLY do not send. lib/email.ts logs a warning and returns { success:false }. In-app notifications still write, so this looks healthy from the UI.' },
  { group: 'Email — sender',     level: 'degraded', vars: ['RESEND_FROM_EMAIL'], breaks: 'Falls back to onboarding@resend.dev — deliverability suffers and it is not your domain.' },
  { group: 'Web push (FCM)',     level: 'critical', vars: ['NEXT_PUBLIC_VAPID_KEY'], breaks: 'getToken() cannot mint a token, so ZERO push notifications are delivered. The service worker, multicast batching, dead-token pruning and all three cron integrations are inert.' },
  { group: 'Gemini',             level: 'degraded', vars: ['GEMINI_API_KEY'], breaks: 'AI description enhance, schedule import and vibe search fail.' },
  { group: 'Admin dashboard',    level: 'degraded', vars: ['ADMIN_UID'], breaks: '/admin metrics route refuses every caller.' },
];

let criticalMissing = 0, degradedMissing = 0;
console.log(`\n${BLD}Huddle preflight${RST} ${DIM}(source: ${existsSync('.env.local') ? '.env.local + process.env' : 'process.env'})${RST}\n`);

for (const c of CHECKS) {
  const missing = c.vars.filter(v => !env[v] || env[v].trim() === '');
  if (missing.length === 0) {
    console.log(`  ${GRN}✓${RST} ${c.group}`);
    continue;
  }
  const isCrit = c.level === 'critical';
  isCrit ? criticalMissing++ : degradedMissing++;
  console.log(`  ${isCrit ? RED + '✗' : YEL + '!'}${RST} ${BLD}${c.group}${RST} ${DIM}(${c.level})${RST}`);
  for (const v of missing) console.log(`      missing: ${isCrit ? RED : YEL}${v}${RST}`);
  console.log(`      ${DIM}${c.breaks}${RST}`);
}

console.log('');
if (criticalMissing === 0 && degradedMissing === 0) {
  console.log(`${GRN}All checks passed.${RST}\n`);
  process.exit(0);
}
if (criticalMissing > 0) console.log(`${RED}${criticalMissing} critical group(s) missing.${RST} These fail silently in production — fix before launch.`);
if (degradedMissing > 0) console.log(`${YEL}${degradedMissing} degraded group(s) missing.${RST} Features quietly no-op.`);
console.log(`\n${DIM}Set values in .env.local for local dev, and in the Vercel dashboard for production.${RST}`);
console.log(`${DIM}Both must be set — Vercel does not read .env.local.${RST}\n`);
process.exit(criticalMissing > 0 ? 1 : 0);
