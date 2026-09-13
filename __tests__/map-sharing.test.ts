import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({ user: vi.fn(), access: vi.fn(), db: vi.fn(), event: vi.fn() }));
vi.mock('@/lib/auth-server', () => ({ getServerCurrentUser: mocks.user }));
vi.mock('@/lib/event-access', () => ({ loadEventAccess: mocks.access }));
vi.mock('@/lib/firebase-admin', () => ({ getFirebaseAdminDb: mocks.db }));
vi.mock('@/lib/db', () => ({ getEvent: mocks.event }));
vi.mock('@/app/(app)/map/map-client', () => ({ default: () => null }));
import { GET } from '@/app/api/events/[id]/details/route';
import MapPage, { generateMetadata } from '@/app/(app)/map/page';

const event = { id: 'shared', name: 'Open mic', category: 'Music', date: '2026-09-20', time: '19:00',
  players: ['member'], attendeeNotes: { member: 'secret' }, geopoint: { latitude: 38.99, longitude: -76.94 } };
const request = () => GET(new NextRequest('https://huddlemap.live/api/events/shared/details'), { params: Promise.resolve({ id: 'shared' }) });
beforeEach(() => {
  vi.clearAllMocks();
  mocks.user.mockResolvedValue(null);
  mocks.access.mockResolvedValue({ exists: true, eventData: event, access: { canSeeRoster: false } });
  mocks.event.mockResolvedValue(event);
});

describe('shared map links', () => {
  it('serves a public event to guests without reading attendee profiles', async () => {
    const response = await request();
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.id).toBe('shared');
    expect(data.name).toBe('Open mic');
    expect(data).not.toHaveProperty('attendeeNotes');
    expect(data).not.toHaveProperty('playerDetails');
    expect(mocks.db).not.toHaveBeenCalled();
    expect(response.headers.get('cache-control')).toContain('no-store');
  });
  it.each([true, 'true', null])('hides private or malformed visibility %j from guests', async isPrivate => {
    mocks.access.mockResolvedValue({ exists: true, eventData: { ...event, isPrivate }, access: { canSeeRoster: true } });
    expect((await request()).status).toBe(404);
    expect(mocks.db).not.toHaveBeenCalled();
  });
  it('returns only public attendee fields to an authorised member', async () => {
    mocks.user.mockResolvedValue({ uid: 'member' });
    mocks.access.mockResolvedValue({ exists: true, eventData: { ...event, isPrivate: true }, access: { canSeeRoster: true } });
    mocks.db.mockReturnValue({ collection: () => ({ doc: () => ({ get: async () => ({ data: () => ({ displayName: 'Student', email: 'private@example.test', fcmTokens: ['secret'] }) }) }) }) });
    const response = await request();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.playerDetails).toHaveLength(1);
    expect(JSON.stringify(data)).not.toMatch(/private@example|fcmTokens|attendeeNotes/);
  });
  it('normalises Firestore coordinates to the browser map contract', async () => {
    mocks.access.mockResolvedValue({ exists: true, eventData: { ...event, geopoint: { _latitude: 0, _longitude: -76.94 } }, access: { canSeeRoster: false } });
    expect((await (await request()).json()).geopoint).toEqual({ latitude: 0, longitude: -76.94 });
  });
  it('does not expose a private title or coordinates in the server-rendered map', async () => {
    mocks.event.mockResolvedValue({ ...event, isPrivate: true });
    const props = { searchParams: Promise.resolve({ eventId: 'shared' }) };
    expect((await generateMetadata(props)).title).toBe('Map');
    expect((await MapPage(props)).props.initialCenter).toBeUndefined();
  });
  it('does not double-apply the site title template', async () => {
    expect((await generateMetadata({ searchParams: Promise.resolve({ eventId: 'shared' }) })).title).toBe('Open mic');
  });
  it('treats repeated eventId parameters as absent', async () => {
    expect((await generateMetadata({ searchParams: Promise.resolve({ eventId: ['a', 'b'] }) })).title).toBe('Map');
    expect(mocks.event).not.toHaveBeenCalled();
  });
});
