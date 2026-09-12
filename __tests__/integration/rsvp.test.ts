import { AsyncLocalStorage } from 'node:async_hooks';
import { initializeApp, deleteApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { NextRequest } from 'next/server';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const authContext = new AsyncLocalStorage<{uid: string} | null>();
let db: Firestore;
const notifications = vi.hoisted(() => vi.fn(async () => {}));
vi.mock('@/lib/auth-server', () => ({getServerCurrentUser: async () => authContext.getStore()}));
vi.mock('@/lib/firebase-admin', () => ({getFirebaseAdminDb: () => db}));
vi.mock('@/lib/rate-limit', () => ({checkRateLimit: async () => ({success: true})}));
vi.mock('@/lib/db', () => ({createNotification: notifications}));
import { POST } from '@/app/api/events/[id]/rsvp/route';

let app: ReturnType<typeof initializeApp>;
beforeAll(async () => {
  if (!/^127\.0\.0\.1:\d+$|^localhost:\d+$/.test(process.env.FIRESTORE_EMULATOR_HOST || '')) {
    throw new Error('RSVP tests require a local Firestore emulator; live projects are forbidden.');
  }
  app = initializeApp({projectId: 'huddlev0git-test'}, 'rsvp-launch-test');
  db = getFirestore(app);
});
beforeEach(async () => {
  notifications.mockClear();
  await db.collection('events').doc('launch-rsvp').set({
    name: 'Staging RSVP', createdBy: 'host', date: '2099-01-01', time: '12:00',
    timezone: 'America/New_York', maxPlayers: 1, currentPlayers: 0,
    players: [], waitlist: [], status: 'active', scheduledMessages: [{message: 'private draft'}],
  });
  for (const uid of ['alice', 'bob', 'host']) await db.collection('users').doc(uid).set({name: uid});
});
afterAll(async () => { await db?.terminate(); if (app) await deleteApp(app); });

function rsvp(uid: string | null, body: Record<string, unknown>) {
  return authContext.run(uid ? {uid} : null, () => POST(new NextRequest('http://localhost/api/events/launch-rsvp/rsvp', {
    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body),
  }), {params: Promise.resolve({id: 'launch-rsvp'})}));
}
const event = async () => (await db.collection('events').doc('launch-rsvp').get()).data()!;

describe('RSVP route with real emulator transactions', () => {
  it('admits exactly one of two concurrent users and waitlists the other', async () => {
    const results = await Promise.all([rsvp('alice', {action: 'join', guestContactShared: false}), rsvp('bob', {action: 'join'})]);
    expect(results.map(r => r.status)).toEqual([200,200]);
    const stored = await event();
    expect(stored.players).toHaveLength(1);
    expect(stored.waitlist).toHaveLength(1);
    expect(stored.currentPlayers).toBe(1);
    expect(new Set([...stored.players, ...stored.waitlist]).size).toBe(2);
  });
  it('makes repeated join and leave requests idempotent', async () => {
    for (let i = 0; i < 2; i++) expect((await rsvp('alice', {action: 'join'})).status).toBe(200);
    expect((await event()).currentPlayers).toBe(1);
    for (let i = 0; i < 2; i++) expect((await rsvp('alice', {action: 'leave'})).status).toBe(200);
    expect((await event()).currentPlayers).toBe(0);
  });
  it('promotes one attendee and sends one notification despite duplicate leave requests', async () => {
    await rsvp('alice', {action: 'join'});
    await rsvp('bob', {action: 'join'});
    const results = await Promise.all([rsvp('alice', {action: 'leave'}), rsvp('alice', {action: 'leave'})]);
    expect(results.map(r => r.status)).toEqual([200,200]);
    expect(await event()).toMatchObject({players: ['bob'], waitlist: [], currentPlayers: 1});
    expect(notifications).toHaveBeenCalledOnce();
  });
  it('stores notes and consented contact outside the public parent and projects the response', async () => {
    const response = await rsvp('alice', {action: 'join', note: 'Private note', guestContactShared: true, guestContactEmail: 'test@example.com'});
    const data = await response.json();
    expect(data.event.scheduledMessages).toBeUndefined();
    expect((await event()).attendeeNotes).toBeUndefined();
    expect((await db.doc('events/launch-rsvp/roster/alice').get()).data()?.note).toBe('Private note');
    expect((await db.doc('events/launch-rsvp/guestContacts/alice').get()).data()?.email).toBe('test@example.com');
  });
  it('denies unauthorized removal and unauthenticated requests', async () => {
    await rsvp('alice', {action: 'join'});
    expect((await rsvp('bob', {action: 'remove', targetUserId: 'alice'})).status).toBe(403);
    expect((await rsvp(null, {action: 'join'})).status).toBe(401);
    expect((await event()).players).toEqual(['alice']);
  });
  it('rejects invalid, closed, and private-event joins without changing membership', async () => {
    expect((await rsvp('alice', {action: 'join', note: {bad: true}})).status).toBe(400);
    await db.doc('events/launch-rsvp').update({status: 'past'});
    expect((await rsvp('alice', {action: 'join'})).status).toBe(409);
    await db.doc('events/launch-rsvp').update({status: 'active', isPrivate: true});
    expect((await rsvp('alice', {action: 'join'})).status).toBe(403);
    expect((await event()).currentPlayers).toBe(0);
  });
});
