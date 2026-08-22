/**
 * migrate-roster-fields.ts
 *
 * One-time migration: moves the three free-text attendee fields off the
 * world-readable event document and into events/{eventId}/roster/{uid}.
 *
 *   attendeeNotes[uid]    -> roster/{uid}.note
 *   attendeeAnswers[uid]  -> roster/{uid}.answers
 *   attendeePickup[uid]   -> roster/{uid}.pickup
 *
 * The event document is `allow read: if true` and Firestore rules cannot
 * project fields, so anything left on the parent is public. The roster
 * subcollection is deny-all for clients.
 *
 * Per event the script: copies -> re-reads and verifies -> only then deletes the
 * three parent fields with FieldValue.delete(). A copy that fails verification
 * leaves the parent untouched, so no data is lost.
 *
 * Idempotent. Events with none of the three fields are skipped, and roster
 * writes use { merge: true }, so re-running is safe.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/migrate-roster-fields.ts              # dry run
 *   DRY_RUN=false npx tsx --env-file=.env.local scripts/migrate-roster-fields.ts # live
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const DRY_RUN = process.env.DRY_RUN !== 'false'; // Default to dry-run for safety

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const db = getFirestore();

interface RosterEntry {
  note?: string;
  answers?: Record<string, string>;
  pickup?: string;
}

/** Inverts the three uid-keyed maps into one entry per uid. */
function buildRoster(data: FirebaseFirestore.DocumentData): Record<string, RosterEntry> {
  const roster: Record<string, RosterEntry> = {};

  const notes: Record<string, string> = data.attendeeNotes || {};
  const answers: Record<string, Record<string, string>> = data.attendeeAnswers || {};
  const pickup: Record<string, string> = data.attendeePickup || {};

  for (const [uid, v] of Object.entries(notes)) {
    if (v !== undefined && v !== null && v !== '') roster[uid] = { ...(roster[uid] || {}), note: v };
  }
  for (const [uid, v] of Object.entries(answers)) {
    if (v && Object.keys(v).length > 0) roster[uid] = { ...(roster[uid] || {}), answers: v };
  }
  for (const [uid, v] of Object.entries(pickup)) {
    if (v !== undefined && v !== null && v !== '') roster[uid] = { ...(roster[uid] || {}), pickup: v };
  }

  return roster;
}

/** Deep-equality good enough for the shapes stored here (strings and flat maps). */
function entryMatches(expected: RosterEntry, actual: FirebaseFirestore.DocumentData | undefined): boolean {
  if (!actual) return false;
  if ((expected.note ?? null) !== (actual.note ?? null)) return false;
  if ((expected.pickup ?? null) !== (actual.pickup ?? null)) return false;

  const eA = expected.answers || {};
  const aA = actual.answers || {};
  const eKeys = Object.keys(eA).sort();
  const aKeys = Object.keys(aA).sort();
  if (eKeys.length !== aKeys.length) return false;
  return eKeys.every((k, i) => k === aKeys[i] && eA[k] === aA[k]);
}

async function main() {
  console.log(`\n${'='.repeat(64)}`);
  console.log(`Migrate roster fields — ${DRY_RUN ? '🔍 DRY RUN (set DRY_RUN=false to write)' : '🔧 LIVE RUN'}`);
  console.log(`${'='.repeat(64)}\n`);

  const snap = await db.collection('events').get();
  console.log(`Scanned ${snap.size} event documents.\n`);

  let migrated = 0;
  let skipped = 0;
  let verifyFailed = 0;
  let rosterDocsWritten = 0;

  for (const doc of snap.docs) {
    const data = doc.data();

    const hasAny =
      data.attendeeNotes !== undefined ||
      data.attendeeAnswers !== undefined ||
      data.attendeePickup !== undefined;

    if (!hasAny) {
      skipped++;
      continue;
    }

    const roster = buildRoster(data);
    const uids = Object.keys(roster);

    console.log(`Event ${doc.id} — "${data.name || data.title || 'untitled'}"`);
    console.log(`  fields present: ${[
      data.attendeeNotes !== undefined ? 'attendeeNotes' : null,
      data.attendeeAnswers !== undefined ? 'attendeeAnswers' : null,
      data.attendeePickup !== undefined ? 'attendeePickup' : null,
    ].filter(Boolean).join(', ')}`);
    console.log(`  roster entries to write: ${uids.length}`);

    for (const uid of uids) {
      const e = roster[uid];
      const parts = [
        e.note !== undefined ? `note(${e.note.length} chars)` : null,
        e.answers !== undefined ? `answers(${Object.keys(e.answers).length})` : null,
        e.pickup !== undefined ? `pickup=${e.pickup}` : null,
      ].filter(Boolean).join(' ');
      console.log(`    -> ${doc.id}/roster/${uid}: ${parts}`);
    }

    if (uids.length === 0) {
      // Fields exist but are empty maps. Nothing to copy; still strip the parent.
      console.log(`    (no attendee data — parent fields are empty maps)`);
    }

    if (DRY_RUN) {
      console.log(`  [DRY RUN] would write ${uids.length} roster doc(s), verify, then FieldValue.delete() attendeeNotes/attendeeAnswers/attendeePickup on ${doc.id}\n`);
      migrated++;
      rosterDocsWritten += uids.length;
      continue;
    }

    // --- copy ---
    if (uids.length > 0) {
      const batch = db.batch();
      for (const uid of uids) {
        batch.set(doc.ref.collection('roster').doc(uid), roster[uid], { merge: true });
      }
      await batch.commit();
      console.log(`  ✓ wrote ${uids.length} roster doc(s)`);
    }

    // --- verify before destroying anything ---
    let ok = true;
    for (const uid of uids) {
      const check = await doc.ref.collection('roster').doc(uid).get();
      if (!entryMatches(roster[uid], check.data())) {
        console.error(`  ✗ VERIFY FAILED for ${doc.id}/roster/${uid} — parent left intact`);
        ok = false;
      }
    }

    if (!ok) {
      verifyFailed++;
      console.log('');
      continue;
    }
    console.log(`  ✓ verified ${uids.length} roster doc(s)`);

    // --- only now strip the parent ---
    await doc.ref.update({
      attendeeNotes: FieldValue.delete(),
      attendeeAnswers: FieldValue.delete(),
      attendeePickup: FieldValue.delete(),
    });
    console.log(`  ✓ deleted attendeeNotes/attendeeAnswers/attendeePickup from ${doc.id}\n`);

    migrated++;
    rosterDocsWritten += uids.length;
  }

  console.log(`${'='.repeat(64)}`);
  console.log(`Results:`);
  console.log(`  Events migrated:     ${migrated}`);
  console.log(`  Events skipped:      ${skipped} (none of the three fields present)`);
  console.log(`  Verify failures:     ${verifyFailed} (parent left intact)`);
  console.log(`  Roster docs written: ${rosterDocsWritten}`);
  console.log(`  Mode:                ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE (writes committed)'}`);
  console.log(`${'='.repeat(64)}\n`);

  process.exit(verifyFailed > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
