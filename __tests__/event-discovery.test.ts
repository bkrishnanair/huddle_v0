import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ db: vi.fn() }));
vi.mock('@/lib/firebase-admin', () => ({ getFirebaseAdminDb: mocks.db }));
import { getDiscoveryEventDocs } from '@/lib/event-discovery';
import { getOrganizerEvents } from '@/lib/organizers-server';
import { getSeoEvents } from '@/lib/seo/events';

const now = new Date('2026-10-03T16:00:00Z');
const base = { name: 'Campus meetup', category: 'Community', date: '2026-10-04', time: '12:00', endTime: '14:00',
  timezone: 'America/New_York', createdBy: 'club-a', status: 'active', location: 'Campus' };
type Data = Record<string, any>;
let rows: Data[];
let requests: { filters: [string, string, unknown][]; max: number }[];

// Immutable query double applies the actual constraints, not canned results.
function makeQuery(filters: [string, string, unknown][] = [], orders: string[] = [], max = Infinity): any {
  return {
    where: (field: string, op: string, value: unknown) => makeQuery([...filters, [field, op, value]], orders, max),
    orderBy: (field: string) => makeQuery(filters, [...orders, field], max),
    limit: (value: number) => makeQuery(filters, orders, value),
    get: async () => {
      requests.push({ filters, max });
      const selected = rows.filter(row => filters.every(([field, op, value]) => {
        if (row[field] === undefined) return false;
        if (op === '==') return row[field] === value;
        if (op === '>=') return row[field] >= value!;
        if (op === '<=') return row[field] <= value!;
        return row[field] < value!;
      })).sort((a, b) => {
        for (const field of orders) { const result = String(a[field]).localeCompare(String(b[field])); if (result) return result; }
        return a.id.localeCompare(b.id);
      }).slice(0, max);
      return { size: selected.length, docs: selected.map(row => ({ id: row.id, data: () => row })) };
    },
  };
}

beforeEach(() => {
  requests = [];
  rows = [
    { ...base, id: 'upcoming' },
    { ...base, id: 'semester', date: '2026-09-15', endDate: '2026-12-31' },
    { ...base, id: 'ended', date: '2026-09-15', endDate: '2026-10-01' },
    { ...base, id: 'archived', date: '2026-09-15', endDate: '2026-12-31', status: 'archived' },
    { ...base, id: 'private', date: '2026-09-15', endDate: '2026-12-31', isPrivate: true },
    { ...base, id: 'another-club', createdBy: 'club-b' },
  ];
  mocks.db.mockReturnValue({ collection: () => makeQuery() });
});

describe('overlap-aware event discovery', () => {
  it('returns recent and older ongoing events, but not ended or archived ones', async () => {
    const result = await getDiscoveryEventDocs({ now });
    expect(result.docs.map(d => d.id).sort()).toEqual(['another-club', 'private', 'semester', 'upcoming']);
    expect(result.truncated).toBe(false);
    expect(requests).toHaveLength(2);
    expect(requests.map(r => r.max)).toEqual([501, 101]);
    expect(requests[1].filters).toContainEqual(['date', '<', '2026-09-26']);
    expect(requests[1].filters).toContainEqual(['endDate', '>=', '2026-09-26']);
  });
  it('applies organizer ownership to both queries', async () => {
    const result = await getDiscoveryEventDocs({ now, createdBy: 'club-a' });
    expect(result.docs.map(d => d.id)).not.toContain('another-club');
    for (const request of requests) expect(request.filters).toContainEqual(['createdBy', '==', 'club-a']);
  });
  it('detects truncation without an unbounded scan', async () => {
    rows = Array.from({ length: 5 }, (_, i) => ({ ...base, id: String(i) }));
    const result = await getDiscoveryEventDocs({ now, limit: 2 });
    expect(result.docs).toHaveLength(2);
    expect(result.truncated).toBe(true);
    expect(requests.every(r => r.max === 3)).toBe(true);
  });
  it('preserves public-only projection for organizer pages and SEO', async () => {
    vi.useFakeTimers(); vi.setSystemTime(now);
    try {
      rows.find(r => r.id === 'semester')!.attendeeNotes = { secret: 'private note' };
      const organizer = await getOrganizerEvents('club-a');
      expect(organizer.map(e => e.id).sort()).toEqual(['semester', 'upcoming']);
      expect(JSON.stringify(organizer)).not.toContain('private note');
      const seo = await getSeoEvents();
      expect(seo.events.map(e => e.id).sort()).toEqual(['another-club', 'semester', 'upcoming']);
      expect(JSON.stringify(seo.events)).not.toContain('private note');
    } finally { vi.useRealTimers(); }
  });
  it('surfaces a database failure instead of pretending there are no events', async () => {
    mocks.db.mockReturnValue(null);
    await expect(getDiscoveryEventDocs({ now })).rejects.toThrow('temporarily unavailable');
  });
});
