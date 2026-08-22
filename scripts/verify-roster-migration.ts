/**
 * verify-roster-migration.ts
 *
 * READ-ONLY post-migration verification. Performs no writes of any kind — no
 * set, update, delete or batch. Safe to run at any time, including before the
 * migration (it will simply report that nothing has moved yet).
 *
 * Checks, across every event document:
 *   1. No parent document still carries attendeeNotes / attendeeAnswers /
 *      attendeePickup.
 *   2. Every uid that had data now has a roster/{uid} document, and every
 *      roster document corresponds to a real attendee.
 *   3. Roster document counts line up with what the parent used to hold, for
 *      any event that has not yet been migrated.
 *
 * It cannot check the security rule — the Admin SDK bypasses rules by design.
 * That one has to be done from a signed-out browser; see the runbook.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/verify-roster-migration.ts
 *
 * Exit 0 = migration verified clean. Exit 1 = something needs looking at.
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const db = getFirestore();
const LEGACY_FIELDS = ['attendeeNotes', 'attendeeAnswers', 'attendeePickup'] as const;

async function main() {
  console.log(`\n${'='.repeat(64)}`);
  console.log('Roster migration verification — READ ONLY (no writes performed)');
  console.log(`${'='.repeat(64)}\n`);

  const snap = await db.collection('events').get();
  console.log(`Scanned ${snap.size} event documents.\n`);

  const stillOnParent: { id: string; fields: string[]; uids: number }[] = [];
  let eventsWithRoster = 0;
  let rosterDocsTotal = 0;
  const rosterWithoutAttendee: string[] = [];
  const mismatched: string[] = [];

  for (const doc of snap.docs) {
    const data = doc.data();

    const present = LEGACY_FIELDS.filter((f) => data[f] !== undefined);
    const legacyUids = new Set<string>();
    for (const f of present) {
      for (const uid of Object.keys(data[f] || {})) legacyUids.add(uid);
    }
    if (present.length > 0) {
      stillOnParent.push({ id: doc.id, fields: [...present], uids: legacyUids.size });
    }

    const rosterSnap = await doc.ref.collection('roster').get();
    if (rosterSnap.empty) continue;

    eventsWithRoster++;
    rosterDocsTotal += rosterSnap.size;

    // every roster doc should belong to someone actually on the event
    const members = new Set<string>([
      ...(data.players || []),
      ...(data.waitlist || []),
    ]);
    for (const r of rosterSnap.docs) {
      if (members.size > 0 && !members.has(r.id)) rosterWithoutAttendee.push(`${doc.id}/${r.id}`);
    }

    // if the parent still holds data, the roster should already cover those uids
    if (legacyUids.size > 0) {
      const rosterIds = new Set(rosterSnap.docs.map((d) => d.id));
      const missing = [...legacyUids].filter((u) => !rosterIds.has(u));
      if (missing.length > 0) {
        mismatched.push(`${doc.id}: ${missing.length} uid(s) on parent with no roster doc`);
      }
    }
  }

  console.log('1. Legacy fields on parent documents');
  if (stillOnParent.length === 0) {
    console.log('   ✓ none — attendeeNotes/attendeeAnswers/attendeePickup are gone everywhere\n');
  } else {
    console.log(`   ✗ ${stillOnParent.length} event(s) still carry legacy fields:`);
    for (const e of stillOnParent.slice(0, 15)) {
      console.log(`       ${e.id}  [${e.fields.join(', ')}]  ${e.uids} uid(s)`);
    }
    if (stillOnParent.length > 15) console.log(`       ... and ${stillOnParent.length - 15} more`);
    console.log('');
  }

  console.log('2. Roster subcollection');
  console.log(`   ${eventsWithRoster} event(s) have a roster, ${rosterDocsTotal} roster document(s) total`);
  if (rosterWithoutAttendee.length === 0) {
    console.log('   ✓ every roster document belongs to a current attendee\n');
  } else {
    console.log(`   ! ${rosterWithoutAttendee.length} roster doc(s) with no matching attendee:`);
    for (const r of rosterWithoutAttendee.slice(0, 10)) console.log(`       ${r}`);
    console.log('     (expected if attendees left after the migration — not necessarily a fault)\n');
  }

  console.log('3. Parent/roster coverage');
  if (mismatched.length === 0) {
    console.log('   ✓ no event has parent data missing from the roster\n');
  } else {
    console.log(`   ✗ ${mismatched.length} event(s) incompletely migrated:`);
    for (const m of mismatched.slice(0, 15)) console.log(`       ${m}`);
    console.log('');
  }

  const clean = stillOnParent.length === 0 && mismatched.length === 0;
  console.log(`${'='.repeat(64)}`);
  console.log(clean
    ? 'RESULT: clean — migration verified. Rule check still to do in a browser.'
    : 'RESULT: incomplete — see above. Re-running the migration is safe.');
  console.log(`${'='.repeat(64)}\n`);
  process.exit(clean ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
