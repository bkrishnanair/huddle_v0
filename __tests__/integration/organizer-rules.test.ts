import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { beforeAll, afterAll, describe, it } from 'vitest';

let environment: RulesTestEnvironment;
beforeAll(async () => {
  const address = process.env.FIRESTORE_EMULATOR_HOST || '';
  if (!/^127\.0\.0\.1:\d+$|^localhost:\d+$/.test(address)) throw new Error('Local emulator required; never run rules tests against live data.');
  const [host, port] = address.split(':');
  environment = await initializeTestEnvironment({ projectId: 'demo-huddle-identity', firestore: { host, port: Number(port), rules: readFileSync('firestore.rules', 'utf8') } });
  await environment.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), 'events', 'identity-event'), { createdBy: 'owner', players: ['attendee'], gallery: [], isOrganizerVerified: false });
  });
});
afterAll(async () => { await environment?.cleanup(); });

describe('organizer identity client permissions', () => {
  it('blocks owner and verification forgery but preserves gallery updates', async () => {
    const db = environment.authenticatedContext('owner').firestore();
    const event = doc(db, 'events', 'identity-event');
    await assertFails(updateDoc(event, { createdBy: 'victim' }));
    await assertFails(updateDoc(event, { isOrganizerVerified: true }));
    await assertFails(updateDoc(event, { admins: ['attacker'] }));
    await assertSucceeds(updateDoc(event, { gallery: arrayUnion('owner-photo') }));
    const attendee = environment.authenticatedContext('attendee').firestore();
    await assertSucceeds(updateDoc(doc(attendee, 'events', 'identity-event'), { gallery: arrayUnion('attendee-photo') }));
  });
  it('blocks forged verified or imported creation', async () => {
    const db = environment.authenticatedContext('owner').firestore();
    await assertFails(setDoc(doc(db, 'events', 'fake-verified'), { createdBy: 'owner', isOrganizerVerified: true }));
    await assertFails(setDoc(doc(db, 'events', 'fake-source'), { createdBy: 'owner', source: 'terplink' }));
    await assertSucceeds(setDoc(doc(db, 'events', 'ordinary-event'), { createdBy: 'owner', source: 'manual', isOrganizerVerified: false }));
  });
  it('denies direct client writes to organizer control and receipt collections', async () => {
    const db = environment.authenticatedContext('owner').firestore();
    for (const collection of ['organizers', 'organizerUpdates', 'eventClaims', 'scheduleImports']) {
      await assertFails(setDoc(doc(db, collection, 'owner'), { ownerId: 'owner', reviewStatus: 'approved' }));
      await assertFails(getDoc(doc(db, collection, 'owner')));
    }
  });
});
