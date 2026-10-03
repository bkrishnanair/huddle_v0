import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID, createHash } from 'node:crypto';
import { initializeApp, deleteApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { NextRequest } from 'next/server';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const auth = new AsyncLocalStorage<{ uid: string } | null>();
let db: Firestore;
let app: ReturnType<typeof initializeApp>;
let owner: string;
let friend: string;
let eventId: string;
vi.mock('@/lib/auth-server', () => ({ getServerCurrentUser: async () => auth.getStore() }));
vi.mock('@/lib/firebase-admin', () => ({ getFirebaseAdminDb: () => db }));
vi.mock('@/lib/rate-limit', () => ({ checkRateLimit: async () => ({ success: true }) }));
import { POST as publish } from '@/app/api/events/bulk/route';
import { POST as claim } from '@/app/api/events/claim/route';
import { POST as invite } from '@/app/api/events/[id]/invite/route';
import { PUT as saveOrganizer } from '@/app/api/organizers/me/route';
import { POST as postUpdate, DELETE as removeUpdate } from '@/app/api/organizers/updates/route';

const request = (path: string, body: unknown, method = 'POST') => new NextRequest('http://localhost' + path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const as = <T>(uid: string | null, action: () => T): T => auth.run(uid ? { uid } : null, action);

beforeAll(() => {
  if (!/^127\.0\.0\.1:\d+$|^localhost:\d+$/.test(process.env.FIRESTORE_EMULATOR_HOST || '')) throw new Error('Local Firestore emulator required; live projects forbidden.');
  app = initializeApp({ projectId: 'huddlev0git-test' }, 'organizer-flow-tests');
  db = getFirestore(app);
});
beforeEach(async () => {
  const suffix = randomUUID();
  owner = 'owner-' + suffix; friend = 'friend-' + suffix; eventId = 'event-' + suffix;
  await Promise.all([
    db.collection('users').doc(owner).set({ displayName: 'Organizer', blockedUsers: [] }),
    db.collection('users').doc(friend).set({ displayName: 'Friend', blockedUsers: [] }),
    db.collection('events').doc(eventId).set({ name: 'Build night', createdBy: owner, date: '2099-01-01', time: '18:00', timezone: 'America/New_York', players: [owner], currentPlayers: 1, maxPlayers: 20, isPrivate: false, status: 'active' }),
  ]);
});
afterAll(async () => { await db?.terminate(); if (app) await deleteApp(app); });

describe('organizer flows with real emulator transactions', () => {
  it('deduplicates concurrent publishing and an identical payload with a new retry key', async () => {
    const body = { submissionId: randomUUID(), timezone: 'America/New_York', events: [{ title: 'Build night', category: 'Tech', date: '2099-01-01', time: '18:00', endDate: '', endTime: '20:00', location: 'Engineering hall', geopoint: { latitude: 38.99, longitude: -76.94 }, description: 'Bring a project.', capacity: 20 }] };
    const responses = await Promise.all([1, 2].map(() => as(owner, () => publish(request('/api/events/bulk', body)))));
    expect(responses.map(response => response.status)).toEqual([200, 200]);
    const results = await Promise.all(responses.map(response => response.json()));
    expect(results[0].eventIds).toEqual(results[1].eventIds);
    const retry = await as(owner, () => publish(request('/api/events/bulk', { ...body, submissionId: randomUUID() })));
    expect((await retry.json()).eventIds).toEqual(results[0].eventIds);
    const event = (await db.collection('events').doc(results[0].eventIds[0]).get()).data();
    expect(event?.geohash).toBeTruthy();
    expect(event?.currentPlayers).toBe(0);
    const conflict = await as(owner, () => publish(request('/api/events/bulk', { ...body, events: [{ ...body.events[0], title: 'Different event' }] })));
    expect(conflict.status).toBe(409);
  });

  it('keeps pending claims from changing ownership and allows only one reviewed claimant', async () => {
    await db.collection('events').doc(eventId).update({ createdBy: 'import-bot', source: 'terplink', isScraped: true });
    for (const uid of [owner, friend]) {
      const result = await as(uid, () => claim(request('/api/events/claim', { scrapedEventId: eventId, evidenceUrl: 'https://example.org/club' })));
      expect(result.status).toBe(202);
    }
    expect((await db.collection('events').doc(eventId).get()).data()?.createdBy).toBe('import-bot');
    for (const uid of [owner, friend]) {
      const key = createHash('sha256').update(eventId + ':' + uid).digest('hex');
      await db.collection('eventClaims').doc(key).update({ status: 'approved' });
    }
    const results = await Promise.all([owner, friend].map(uid => as(uid, () => claim(request('/api/events/claim', { scrapedEventId: eventId })))));
    expect(results.map(response => response.status).sort()).toEqual([200, 409]);
    const event = (await db.collection('events').doc(eventId).get()).data()!;
    expect(event.players).toEqual([owner]);
    expect(event.currentPlayers).toBe(1);
    expect((await as(event.createdBy, () => claim(request('/api/events/claim', { scrapedEventId: eventId })))).status).toBe(200);
  });

  it('requires mutual follows, respects blocks, and sends only one invitation', async () => {
    const send = () => as(owner, () => invite(request('/api/events/' + eventId + '/invite', { targetUserId: friend }), { params: Promise.resolve({ id: eventId }) }));
    expect((await send()).status).toBe(403);
    await db.collection('users').doc(owner).collection('following').doc(friend).set({});
    await db.collection('users').doc(friend).collection('following').doc(owner).set({});
    const results = await Promise.all([send(), send()]);
    expect(results.map(response => response.status)).toEqual([200, 200]);
    expect((await db.collection('users').doc(friend).collection('notifications').get()).size).toBe(1);
    await db.collection('users').doc(friend).update({ blockedUsers: [owner] });
    expect((await send()).status).toBe(403);
    await db.collection('users').doc(friend).update({ blockedUsers: [] });
    await db.collection('events').doc(eventId).update({ isPrivate: true });
    expect((await send()).status).toBe(403);
  });

  it('does not trust verification input, and gates public updates by event ownership', async () => {
    const page = { name: 'Build club', kind: 'club', about: 'A friendly space for campus builders.', area: 'College Park', website: 'https://example.org', published: true };
    expect((await as(owner, () => saveOrganizer(request('/api/organizers/me', { ...page, reviewStatus: 'approved' }, 'PUT')))).status).toBe(400);
    expect((await as(owner, () => saveOrganizer(request('/api/organizers/me', page, 'PUT')))).status).toBe(200);
    expect((await db.collection('organizers').doc(owner).get()).data()?.reviewStatus).toBe('pending');
    const message = { eventId, message: 'Bring a project and meet the club.', public: true };
    expect((await as(friend, () => postUpdate(request('/api/organizers/updates', message)))).status).toBe(403);
    expect((await as(owner, () => postUpdate(request('/api/organizers/updates', message)))).status).toBe(200);
    expect((await as(friend, () => removeUpdate(request('/api/organizers/updates', { eventId }, 'DELETE')))).status).toBe(403);
    expect((await as(owner, () => removeUpdate(request('/api/organizers/updates', { eventId }, 'DELETE')))).status).toBe(200);
    expect((await db.collection('events').doc(eventId).get()).exists).toBe(true);
  });
});
