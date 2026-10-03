import 'server-only';

import type { MetadataRoute } from 'next';
import { DIRECTORY_CATEGORIES } from '@/lib/seo/categories';
import { getSeoEvents, eventUrl, SEO_ORIGIN } from '@/lib/seo/events';
import { getOrganizerDirectory } from '@/lib/organizers-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {url: SEO_ORIGIN, changeFrequency: 'weekly', priority: 1},
    {url: `${SEO_ORIGIN}/directory`, changeFrequency: 'weekly', priority: 0.9},
    {url: `${SEO_ORIGIN}/organizers`, changeFrequency: 'weekly', priority: 0.7},
    {url: `${SEO_ORIGIN}/partners`, changeFrequency: 'monthly', priority: 0.5},
    ...DIRECTORY_CATEGORIES.map(category => ({
      url: `${SEO_ORIGIN}/directory/${category.slug}`, changeFrequency: 'daily' as const, priority: 0.7,
    })),
  ];
  try {
    const organizers = await getOrganizerDirectory();
    routes.push(...organizers.filter(organizer => organizer.verified).map(organizer => ({ url: `${SEO_ORIGIN}/organizers/${encodeURIComponent(organizer.id)}`, changeFrequency: 'weekly' as const, priority: 0.6 })));
  } catch { /* Keep existing discovery URLs if organizer pages cannot load. */ }
  try {
    const {events} = await getSeoEvents();
    return [...routes, ...events.map(event => ({
      url: eventUrl(event.id), changeFrequency: 'daily' as const, priority: 0.8,
    }))];
  } catch (error) {
    console.error('Event sitemap unavailable; retaining static discovery URLs', error);
    return routes;
  }
}
