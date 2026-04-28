/**
 * add-timezone-to-events.ts
 *
 * One-time migration: adds timezone field to all existing events.
 * Defaults to 'America/New_York' since Huddle's initial user base is UMD.
 *
 * Usage:
 *   DRY_RUN=true npx tsx --env-file=.env.local scripts/add-timezone-to-events.ts
 *   npx tsx --env-file=.env.local scripts/add-timezone-to-events.ts
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const DRY_RUN = process.env.DRY_RUN === 'true';
const DEFAULT_TZ = 'America/New_York';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const db = getFirestore();

async function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Add Timezone to Events — ${DRY_RUN ? '🔍 DRY RUN' : '🔧 LIVE RUN'}`);
  console.log(`Default timezone: ${DEFAULT_TZ}`);
  console.log(`${'='.repeat(60)}\n`);

  const eventsSnap = await db.collection('events').get();
  console.log(`Total events: ${eventsSnap.size}\n`);

  let updatedCount = 0;
  let skippedCount = 0;

  // Process in batches of 500 (Firestore batch limit)
  const BATCH_SIZE = 500;
  let batch = db.batch();
  let batchCount = 0;

  for (const doc of eventsSnap.docs) {
    const data = doc.data();

    if (data.timezone) {
      skippedCount++;
      continue;
    }

    if (!DRY_RUN) {
      batch.update(doc.ref, { timezone: DEFAULT_TZ });
      batchCount++;

      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        console.log(`  Committed batch of ${batchCount} updates`);
        batch = db.batch();
        batchCount = 0;
      }
    }

    updatedCount++;
  }

  // Commit remaining
  if (!DRY_RUN && batchCount > 0) {
    await batch.commit();
    console.log(`  Committed final batch of ${batchCount} updates`);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Results:`);
  console.log(`  Updated: ${updatedCount} events → timezone: '${DEFAULT_TZ}'`);
  console.log(`  Skipped: ${skippedCount} (already had timezone)`);
  console.log(`  Mode:    ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE (writes committed)'}`);
  console.log(`${'='.repeat(60)}\n`);

  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
