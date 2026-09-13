import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({db: vi.fn(), get: vi.fn(), doc: vi.fn()}));
vi.mock('@/lib/firebase-admin', () => ({getFirebaseAdminDb: mocks.db}));
vi.mock('next/navigation', () => ({notFound: () => {throw new Error('NOT_FOUND');}}));
import { projectSeoEvent, eventJsonLd, serializeJsonLd, getSeoEvent, getSeoEvents } from '@/lib/seo/events';
import { DIRECTORY_CATEGORIES, findDirectoryCategory } from '@/lib/seo/categories';
import sitemap from '@/app/sitemap';
import EventPage, {generateMetadata} from '@/app/event/[id]/page';
import CategoryPage from '@/app/directory/[category]/page';

const now = new Date('2026-09-13T12:00:00Z');
const event = {name: 'Campus open mic', date: '2026-09-20', time: '19:00', endTime: '21:00',
  timezone: 'America/New_York', category: 'Music', organizerName: 'Campus music club',
  location: 'Student union', venue: {name: 'Student union', address: '123 Campus Drive'},
  geopoint: {latitude: 38.99, longitude: -76.94}, status: 'active'};
const project = (data = {}) => projectSeoEvent('public-event', {...event, ...data}, now);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(now);
  vi.clearAllMocks();
  const query: any = {where: vi.fn(() => query), orderBy: vi.fn(() => query), limit: vi.fn(() => query), get: mocks.get, doc: mocks.doc};
  mocks.db.mockReturnValue({collection: () => query});
  mocks.get.mockResolvedValue({size: 0, docs: []});
  mocks.doc.mockReturnValue({get: async () => ({id: 'public-event', exists: true, data: () => event})});
});
afterEach(() => vi.useRealTimers());

describe('SEO privacy and validation', () => {
  it.each([true, 'true', null, 1])('excludes private or malformed privacy flag %j', isPrivate => expect(project({isPrivate})).toBeNull());
  it.each(['past', 'archived', 'cancelled', 'draft'])('excludes non-active status %s', status => expect(project({status})).toBeNull());
  it('supports explicitly public and legacy public records', () => {
    expect(project({isPrivate: false})).not.toBeNull();
    expect(project({status: undefined})).not.toBeNull();
  });
  it('excludes ended events and invalid times/timezones', () => {
    expect(project({date: '2020-01-01'})).toBeNull();
    expect(project({time: '30:99'})).toBeNull();
    expect(project({timezone: 'Not/AZone'})).toBeNull();
  });
  it('projects only SEO data, excluding user IDs, private notes, and join URLs', () => {
    const result = project({players: ['private-user'], attendeeNotes: {name: 'private note'}, virtualLink: 'https://meet.test/secret', scheduledMessages: ['private draft']});
    expect(JSON.stringify(result)).not.toMatch(/private|secret|players|virtualLink/);
  });
  it('404s private event pages and metadata without leaking a title', async () => {
    mocks.doc.mockReturnValue({get: async () => ({id: 'private', exists: true, data: () => ({...event, isPrivate: true})})});
    expect(await getSeoEvent('private')).toBeNull();
    const props = {params: Promise.resolve({id: 'private'})};
    await expect(generateMetadata(props)).rejects.toThrow('NOT_FOUND');
    await expect(EventPage(props)).rejects.toThrow('NOT_FOUND');
  });
  it('does not preserve a public record after it becomes private', async () => {
    expect(await getSeoEvent('public-event')).not.toBeNull();
    mocks.doc.mockReturnValue({get: async () => ({id: 'public-event', exists: true, data: () => ({...event, isPrivate: true})})});
    expect(await getSeoEvent('public-event')).toBeNull();
  });
});

describe('structured data', () => {
  it('uses timezone-aware UTC dates, real coordinates, address and organizer', () => {
    const schema = eventJsonLd(project()!);
    expect(schema).toMatchObject({startDate: '2026-09-20T23:00:00.000Z', endDate: '2026-09-21T01:00:00.000Z',
      organizer: {name: 'Campus music club'}, location: {name: 'Student union', address: {name: '123 Campus Drive'}, geo: {latitude: 38.99, longitude: -76.94}}});
  });
  it('handles winter timezone offsets and overnight ends', () => {
    const schema = eventJsonLd(project({date: '2027-01-10', time: '23:00', endTime: '01:00'})!);
    expect(schema?.startDate).toBe('2027-01-11T04:00:00.000Z');
    expect(schema?.endDate).toBe('2027-01-11T06:00:00.000Z');
  });
  it('does not invent an end time or a street address from a venue label', () => {
    const schema = eventJsonLd(project({endTime: undefined, venue: 'Room 1211'})!);
    expect(schema?.endDate).toBeUndefined();
    expect(schema?.location).not.toHaveProperty('address');
  });
  it('does not publish invalid coordinates or private virtual join URLs', () => {
    expect(eventJsonLd(project({geopoint: {latitude: 999, longitude: 0}})!)?.location).not.toHaveProperty('geo');
    expect(eventJsonLd(project({eventType: 'virtual'})!)?.location).toMatchObject({'@type': 'VirtualLocation', url: 'https://huddlemap.live/event/public-event'});
  });
  it('escapes script terminators in JSON-LD', () => {
    const input = {name: '</script><script>alert(1)</script>\u2028'};
    const json = serializeJsonLd(input);
    expect(json).not.toContain('<');
    expect(JSON.parse(json)).toEqual(input);
  });
});

describe('crawler routes', () => {
  it('has stable category slugs and rejects arbitrary paths', () => {
    expect(new Set(DIRECTORY_CATEGORIES.map(c => c.slug)).size).toBe(8);
    expect(findDirectoryCategory('food-and-drink')?.name).toBe('Food & Drink');
    expect(findDirectoryCategory('../private')).toBeUndefined();
  });
  it('filters private/ended documents before listing or generating sitemap entries', async () => {
    const docs = [{...event, date: '2099-01-01'}, {...event, isPrivate: true}, {...event, status: 'past'}];
    mocks.get.mockResolvedValue({size: docs.length, docs: docs.map((data, index) => ({id: String(index), data: () => data}))});
    expect((await getSeoEvents()).events.map(e => e.id)).toEqual(['0']);
    const urls = (await sitemap()).map(entry => entry.url);
    expect(urls).toContain('https://huddlemap.live/event/0');
    expect(urls).not.toContain('https://huddlemap.live/event/1');
    expect(urls).not.toContain('https://huddlemap.live/event/2');
    expect(urls).toContain('https://huddlemap.live/directory/music');
    const html = renderToStaticMarkup(await CategoryPage({params: Promise.resolve({category: 'music'})}));
    expect(html).toContain('href="/event/0"');
    expect(html).toContain('<time');
  });
  it('retains static sitemap links if Firebase is unavailable', async () => {
    mocks.db.mockReturnValue(null);
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await sitemap()).length).toBe(10);
    logger.mockRestore();
  });
});
