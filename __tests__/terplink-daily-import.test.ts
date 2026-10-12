import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ db: vi.fn(), lease: vi.fn(), release: vi.fn() }));
vi.mock('@/lib/firebase-admin', async () => {
  const { GeoPoint, Timestamp } = await import('firebase-admin/firestore');
  return { getFirebaseAdminDb: mocks.db, GeoPoint, Timestamp };
});
vi.mock('@/lib/cron/lease', () => ({ acquireCronLease: mocks.lease }));
import { importTerpLinkEvents, TerpLinkImportError } from '@/lib/terplink-import';
import { GET } from '@/app/api/cron/terplink/route';

let records: Map<string, Record<string, any>>;
const changes = vi.fn<(operation: string) => void>();
let fetchMock: ReturnType<typeof vi.fn>;
let metadata: Record<string, any>;
const source = { id: '123', name: 'Workshop', startsOn: '2026-10-12T18:00:00Z', endsOn: '2026-10-12T19:00:00Z', location: 'Online', categoryNames: ['Learning'] };
const document = (id: string) => ({ id, ref: { id }, exists: records.has(id), data: () => records.get(id) });
beforeEach(() => {
  vi.clearAllMocks(); records = new Map(); metadata = {};
  mocks.lease.mockResolvedValue(mocks.release); mocks.release.mockResolvedValue(undefined);
  fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ value: [source] }) });
  vi.stubGlobal('fetch', fetchMock);
  const events: any = { doc: (id: string) => ({ id }), where: () => ({ get: async () => ({ docs: [...records.keys()].map(document) }) }) };
  mocks.db.mockReturnValue({ collection: (name: string) => name === 'events' ? events : {
    doc: () => ({ set: async (data: any) => { metadata = { ...metadata, ...data }; } }),
  }, runTransaction: async (callback: any) => callback({
    get: async (ref: any) => document(ref.id),
    create: (ref: any, data: any) => { changes('create'); records.set(ref.id, data); },
    update: (ref: any, data: any) => { changes('update'); records.set(ref.id, { ...records.get(ref.id), ...data }); },
  }) });
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe('daily TerpLink importer', () => {
  it('creates once, then skips unchanged source records with no event writes', async () => {
    expect(await importTerpLinkEvents()).toMatchObject({ imported: 1, failed: 0, geocodeRequests: 0 });
    changes.mockClear();
    expect(await importTerpLinkEvents()).toMatchObject({ imported: 0, refreshed: 0, skipped: 1 });
    expect(changes).not.toHaveBeenCalled();
    expect(metadata.lastSuccessAt).toBeTruthy(); expect(mocks.release).toHaveBeenCalledTimes(2);
  });
  it('preserves claimed records and source ownership', async () => {
    records.set('claimed', { source: 'claimed', createdBy: 'organizer', name: 'Custom title', sourceUrl: 'https://terplink.umd.edu/event/123' });
    expect(await importTerpLinkEvents()).toMatchObject({ skipped: 1, imported: 0 });
    expect(changes).not.toHaveBeenCalled(); expect(records.get('claimed')!.name).toBe('Custom title');
  });
  it('updates changed source fields without overwriting privacy, archive state, or RSVPs', async () => {
    await importTerpLinkEvents();
    records.set('terplink_123', { ...records.get('terplink_123'), isPrivate: true, status: 'archived', players: ['student'], currentPlayers: 1 });
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ value: [{ ...source, name: 'Updated title' }] }) });
    expect(await importTerpLinkEvents()).toMatchObject({ refreshed: 1 });
    expect(records.get('terplink_123')).toMatchObject({ name: 'Updated title', isPrivate: true, status: 'archived', players: ['student'], currentPlayers: 1 });
  });
  it('bounds a large upstream response to 100 listings', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ value: Array.from({ length: 150 }, (_, i) => ({ ...source, id: String(i) })) }) });
    expect(await importTerpLinkEvents()).toMatchObject({ imported: 100 }); expect(records.size).toBe(100);
  });
  it('does not fetch upstream when another import holds the lease', async () => {
    mocks.lease.mockResolvedValue(null);
    await expect(importTerpLinkEvents()).rejects.toBeInstanceOf(TerpLinkImportError);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('fails visibly and releases the lease on malformed upstream data', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ unexpected: 'object' }) });
    await expect(importTerpLinkEvents()).rejects.toThrow('Unexpected TerpLink response');
    expect(metadata.error).toBeTruthy(); expect(metadata.lastSuccessAt).toBeUndefined();
    expect(mocks.release).toHaveBeenCalledOnce(); expect(changes).not.toHaveBeenCalled();
  });
  it('requires the cron bearer secret before any importer work', async () => {
    vi.stubEnv('CRON_SECRET', 'test-secret');
    expect((await GET(new NextRequest('https://huddlemap.live/api/cron/terplink'))).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled(); expect(mocks.lease).not.toHaveBeenCalled();
    expect((await GET(new NextRequest('https://huddlemap.live/api/cron/terplink', {
      headers: { Authorization: 'Bearer test-secret' },
    }))).status).toBe(200);
  });
});
