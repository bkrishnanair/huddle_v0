import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { redactAnalyticsUrl } from '@/lib/analytics-privacy';
import NotFound from '@/app/not-found';
import { metadata as discover } from '@/app/(app)/discover/layout';
import { metadata as home } from '@/app/(app)/home/layout';
import { metadata as events } from '@/app/(app)/my-events/layout';
import { metadata as profile } from '@/app/(app)/profile/layout';
import { metadata as member } from '@/app/(app)/profile/[uid]/layout';
import { metadata as admin } from '@/app/(app)/admin/layout';
import { metadata as dashboard } from '@/app/(app)/dashboard/layout';
import { metadata as login } from '@/app/login/layout';
import { metadata as signup } from '@/app/auth/signup/layout';
import { metadata as offline } from '@/app/offline/layout';

describe('route metadata and recovery', () => {
  it('gives app and utility routes distinct titles and descriptions', () => {
    const pages = [discover, home, events, profile, member, admin, dashboard, login, signup, offline];
    expect(new Set(pages.map(page => page.title)).size).toBe(pages.length);
    for (const page of pages) {
      expect(page.description?.length).toBeGreaterThan(20);
      expect(page.title).not.toContain('| Huddle');
    }
  });
  it('keeps utility and account pages out of the index', () => {
    for (const page of [home, events, profile, member, admin, dashboard, login, signup, offline]) {
      expect(page.robots).toEqual({ index: false, follow: false });
    }
    expect(discover.alternates?.canonical).toBe('/discover');
    expect(discover.robots).toBeUndefined();
  });
  it('provides semantic recovery links on the 404 page', () => {
    const html = renderToStaticMarkup(<NotFound />);
    expect(html).toContain('<h1');
    for (const path of ['/map', '/directory', '/feedback']) expect(html).toContain(`href="${path}"`);
    expect(html).not.toContain('liquid-gradient');
  });
});

describe('analytics URL privacy', () => {
  it('strips map queries, login return paths, and hash fragments without changing inputs', () => {
    const event = { type: 'pageview', url: 'https://huddlemap.live/map?lat=38.99&lon=-76.94&eventId=private#secret' };
    expect(redactAnalyticsUrl(event)).toEqual({ type: 'pageview', url: 'https://huddlemap.live/map' });
    expect(event.url).toContain('private');
    expect(redactAnalyticsUrl({ url: 'https://huddlemap.live/login?return_to=/profile/member' })?.url).toBe('https://huddlemap.live/login');
  });
  it.each(['profile', 'event'])('redacts individual %s identifiers from URLs and route labels', section => {
    const result = redactAnalyticsUrl({ type: 'vital', url: `https://huddlemap.live/${section}/sensitive-id`, route: `/${section}/sensitive-id?secret=yes` });
    expect(result?.url).toBe(`https://huddlemap.live/${section}/[id]`);
    expect(result?.route).toBe(`/${section}/[id]`);
  });
  it('preserves public directory categories and metric fields', () => {
    const event = { url: 'https://huddlemap.live/directory/music', type: 'vital', route: '/directory/[category]' };
    expect(redactAnalyticsUrl(event)).toEqual(event);
  });
  it('drops invalid URLs and removes embedded credentials', () => {
    expect(redactAnalyticsUrl({ url: 'broken' })).toBeNull();
    expect(redactAnalyticsUrl({ url: 'javascript:alert(1)' })).toBeNull();
    expect(redactAnalyticsUrl({ url: 'https://name:password@huddlemap.live/map' })?.url).toBe('https://huddlemap.live/map');
  });
});
