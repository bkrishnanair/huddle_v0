import 'server-only';

import type { MetadataRoute } from 'next';
import { DIRECTORY_CATEGORIES } from '@/lib/seo/categories';
import { getSeoEvents, eventUrl, SEO_ORIGIN } from '@/lib/seo/events';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {url: SEO_ORIGIN, changeFrequency: 'weekly', priority: 1},
    {url: `${SEO_ORIGIN}/directory`, changeFrequency: 'weekly', priority: 0.9},
    ...DIRECTORY_CATEGORIES.map(category => ({
      url: `${SEO_ORIGIN}/directory/${category.slug}`, changeFrequency: 'daily' as const, priority: 0.7,
    })),
  ];
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
