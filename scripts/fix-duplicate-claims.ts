/**
 * fix-duplicate-claims.ts
 *
 * One-time data repair: finds claimed events that created duplicates
 * (old claim flow created a NEW document + archived the original).
 * Merges attendee data from the archived original into the claimed copy,
 * then deletes the archived duplicate.
 *
 * Usage:
 *   DRY_RUN=true npx tsx --env-file=.env.local scripts/fix-duplicate-claims.ts
 *   npx tsx --env-file=.env.local scripts/fix-duplicate-claims.ts
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

interface ClaimPair {
  claimedDoc: FirebaseFirestore.QueryDocumentSnapshot;
  archivedDoc: FirebaseFirestore.QueryDocumentSnapshot | null;
}

async function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Fix Duplicate Claims — ${DRY_RUN ? '🔍 DRY RUN (set DRY_RUN=false to write)' : '🔧 LIVE RUN'}`);
  console.log(`${'='.repeat(60)}\n`);

  // Find all claimed events
  const claimedSnap = await db.collection('events')
    .where('source', '==', 'claimed')
    .get();

  console.log(`Found ${claimedSnap.size} claimed events.\n`);

  let mergedCount = 0;
  let orphanedCount = 0;
  let cleanCount = 0;

  for (const claimedDoc of claimedSnap.docs) {
    const claimed = claimedDoc.data();
    const claimedFrom = claimed.claimedFrom;

    if (!claimedFrom) {
      console.log(`[${claimedDoc.id}] "${claimed.name}" — no claimedFrom field, skipping`);
      orphanedCount++;
      continue;
    }

    // Check if the original scraped event still exists
    const archivedRef = db.collection('events').doc(claimedFrom);
    const archivedSnap = await archivedRef.get();

    if (!archivedSnap.exists) {
      // Original was already cleaned up, nothing to merge
      cleanCount++;
      continue;
    }

    const archived = archivedSnap.data()!;

    // If the claimedFrom points to itself (new flow), skip
    if (claimedFrom === claimedDoc.id) {
      cleanCount++;
      continue;
    }

    console.log(`\n[DUPLICATE FOUND]`);
    console.log(`  Claimed: ${claimedDoc.id} — "${claimed.name}"`);
    console.log(`    players: ${(claimed.players || []).length}, currentPlayers: ${claimed.currentPlayers || 0}`);
    console.log(`  Archived: ${archivedSnap.id} — "${archived.name}"`);
    console.log(`    players: ${(archived.players || []).length}, currentPlayers: ${archived.currentPlayers || 0}`);
    console.log(`    viewCount: ${archived.viewCount || 0}, guestRsvps: ${Object.keys(archived.guestRsvps || {}).length}`);

    // --- Merge attendee data from archived into claimed ---
    const mergedPlayers = new Set<string>([
      ...(claimed.players || []),
      ...(archived.players || []),
    ]);

    const mergedGuestRsvps = {
      ...(archived.guestRsvps || {}),
      ...(claimed.guestRsvps || {}), // claimed takes precedence
    };

    const mergedAttendeeNotes = {
      ...(archived.attendeeNotes || {}),
      ...(claimed.attendeeNotes || {}),
    };

    const mergedAttendeeAnswers = {
      ...(archived.attendeeAnswers || {}),
      ...(claimed.attendeeAnswers || {}),
    };

    const mergedAttendeePickup = {
      ...(archived.attendeePickup || {}),
      ...(claimed.attendeePickup || {}),
    };

    const mergedCheckIns = {
      ...(archived.checkIns || {}),
      ...(claimed.checkIns || {}),
    };

    const mergedCheckedInPlayers = new Set<string>([
      ...(claimed.checkedInPlayers || []),
      ...(archived.checkedInPlayers || []),
    ]);

    const mergedViewCount = (claimed.viewCount || 0) + (archived.viewCount || 0);

    const mergeUpdate: Record<string, any> = {
      players: Array.from(mergedPlayers),
      currentPlayers: mergedPlayers.size,
      guestRsvps: mergedGuestRsvps,
      checkIns: mergedCheckIns,
      checkedInPlayers: Array.from(mergedCheckedInPlayers),
      viewCount: mergedViewCount,
      // attendeeNotes/attendeeAnswers/attendeePickup are deliberately NOT written
      // back here. They live in events/{id}/roster/{uid} — writing them onto the
      // parent document would reintroduce the PII exposure the subcollection
      // exists to prevent. Merged into the roster subcollection below instead.
      attendeeNotes: FieldValue.delete(),
      attendeeAnswers: FieldValue.delete(),
      attendeePickup: FieldValue.delete(),
    };

    // Fold the merged free-text into the roster subcollection, one doc per uid.
    const mergedRoster: Record<string, { note?: string; answers?: Record<string, string>; pickup?: string }> = {};
    for (const uid of Object.keys(mergedAttendeeNotes)) {
      mergedRoster[uid] = { ...(mergedRoster[uid] || {}), note: mergedAttendeeNotes[uid] };
    }
    for (const uid of Object.keys(mergedAttendeeAnswers)) {
      mergedRoster[uid] = { ...(mergedRoster[uid] || {}), answers: mergedAttendeeAnswers[uid] };
    }
    for (const uid of Object.keys(mergedAttendeePickup)) {
      mergedRoster[uid] = { ...(mergedRoster[uid] || {}), pickup: mergedAttendeePickup[uid] };
    }

    // Preserve pinnedMessage if claimed doesn't have one
    if (!claimed.pinnedMessage && archived.pinnedMessage) {
      mergeUpdate.pinnedMessage = archived.pinnedMessage;
    }
    if (!claimed.lastAnnouncementAt && archived.lastAnnouncementAt) {
      mergeUpdate.lastAnnouncementAt = archived.lastAnnouncementAt;
    }
    if (!claimed.reportedAttendance && archived.reportedAttendance) {
      mergeUpdate.reportedAttendance = archived.reportedAttendance;
    }

    console.log(`  → Merge result: ${mergedPlayers.size} players, ${mergedViewCount} views, ${Object.keys(mergedGuestRsvps).length} guest RSVPs, ${Object.keys(mergedRoster).length} roster entries`);

    if (!DRY_RUN) {
      const batch = db.batch();
      batch.update(claimedDoc.ref, mergeUpdate);
      for (const [uid, entry] of Object.entries(mergedRoster)) {
        batch.set(claimedDoc.ref.collection('roster').doc(uid), entry, { merge: true });
      }
      batch.delete(archivedRef); // Remove the archived duplicate
      await batch.commit();
      console.log(`  ✓ Merged (roster -> subcollection) and deleted archived duplicate`);
    } else {
      console.log(`  [DRY RUN] Would merge data, write ${Object.keys(mergedRoster).length} roster docs under ${claimedDoc.id}/roster, and delete ${archivedSnap.id}`);
    }

    mergedCount++;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Results:`);
  console.log(`  Merged:    ${mergedCount} (duplicates resolved)`);
  console.log(`  Clean:     ${cleanCount} (no duplicate found)`);
  console.log(`  Orphaned:  ${orphanedCount} (no claimedFrom field)`);
  console.log(`  Mode:      ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE (writes committed)'}`);
  console.log(`${'='.repeat(60)}\n`);

  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
