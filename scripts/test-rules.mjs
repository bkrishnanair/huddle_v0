import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

let testEnv;

const PROJECT_ID = "huddlev0git-test";
const OUTPUT_FILE = resolve("Documentation/testing/2026-08-rules-verification.txt");

function log(msg) {
  console.log(msg);
  writeFileSync(OUTPUT_FILE, msg + "\n", { flag: 'a' });
}

async function runTests() {
  // Ensure directory exists
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, "=== Firebase Rules Verification ===\n\n");

  try {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8'),
      },
    });

    const aliceAuth = { sub: 'alice', email: 'alice@example.com' }; // Owner
    const bobAuth = { sub: 'bob', email: 'bob@example.com' }; // Participant
    const charlieAuth = { sub: 'charlie', email: 'charlie@example.com' }; // Admin

    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    const aliceDb = testEnv.authenticatedContext('alice', aliceAuth).firestore();
    const bobDb = testEnv.authenticatedContext('bob', bobAuth).firestore();
    const charlieDb = testEnv.authenticatedContext('charlie', charlieAuth).firestore();

    // Setup initial data
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await db.collection('events').doc('event1').set({
        createdBy: 'alice',
        admins: ['charlie'],
        players: ['alice', 'bob'],
        currentPlayers: 2,
        gallery: ['photo1.jpg'],
        details: 'Initial details'
      });
    });

    log("Setup complete. Running assertions...\n");

    // Assertion 1: non-owner CANNOT update players
    try {
      await assertFails(bobDb.collection('events').doc('event1').update({ players: ['alice', 'bob', 'eve'] }));
      log("✅ PASS: non-owner CANNOT update players");
    } catch (e) {
      log("❌ FAIL: non-owner CANNOT update players - " + e.message);
    }

    // Assertion 2: non-owner CANNOT update currentPlayers
    try {
      await assertFails(bobDb.collection('events').doc('event1').update({ currentPlayers: 3 }));
      log("✅ PASS: non-owner CANNOT update currentPlayers");
    } catch (e) {
      log("❌ FAIL: non-owner CANNOT update currentPlayers - " + e.message);
    }

    // Assertion 3: owner CAN update event details
    try {
      await assertSucceeds(aliceDb.collection('events').doc('event1').update({ details: 'Updated details' }));
      log("✅ PASS: owner CAN update event details");
    } catch (e) {
      log("❌ FAIL: owner CAN update event details - " + e.message);
    }

    // Assertion 4: participant CAN append to gallery
    try {
      await assertSucceeds(bobDb.collection('events').doc('event1').update({ gallery: ['photo1.jpg', 'photo2.jpg'] }));
      log("✅ PASS: participant CAN append to gallery");
    } catch (e) {
      log("❌ FAIL: participant CAN append to gallery - " + e.message);
    }

    // Assertion 5: participant CANNOT replace gallery with a shorter array
    try {
      await assertFails(bobDb.collection('events').doc('event1').update({ gallery: ['photo3.jpg'] }));
      log("✅ PASS: participant CANNOT replace gallery with a shorter array");
    } catch (e) {
      log("❌ FAIL: participant CANNOT replace gallery with a shorter array - " + e.message);
    }

    // Assertion 6: unauthenticated read of an event SUCCEEDS
    try {
      await assertSucceeds(unauthedDb.collection('events').doc('event1').get());
      log("✅ PASS: unauthenticated read of an event SUCCEEDS");
    } catch (e) {
      log("❌ FAIL: unauthenticated read of an event SUCCEEDS - " + e.message);
    }

    // Assertion 7: admin CAN update (from Correction 2)
    try {
      await assertSucceeds(charlieDb.collection('events').doc('event1').update({ details: 'Admin updated details' }));
      log("✅ PASS: admin CAN update event details");
    } catch (e) {
      log("❌ FAIL: admin CAN update event details - " + e.message);
    }

    log("\nAll assertions complete.");
  } catch (error) {
    console.error(error);
    log("ERROR: " + error.message);
  } finally {
    if (testEnv) {
      await testEnv.cleanup();
    }
  }
}

runTests();
