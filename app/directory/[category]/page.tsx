import 'server-only';

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findDirectoryCategory } from '@/lib/seo/categories';
import { getSeoEvents, SEO_ORIGIN } from '@/lib/seo/events';
import { formatEventDateForSEO, formatEventTimeForSEO, getEventStartUTC } from '@/lib/datetime';
import type { GameEvent } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
type Props = {params: Promise<{category: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const category = findDirectoryCategory((await params).category);
  if (!category) notFound();
  const {events} = await getSeoEvents();
  const hasEvents = events.some(event => event.category === category.name);
  return {title: `${category.name} campus events`, description: category.description,
    alternates: {canonical: `${SEO_ORIGIN}/directory/${category.slug}`},
    robots: {index: hasEvents, follow: true}};
}

export default async function CategoryDirectory({params}: Props) {
  const category = findDirectoryCategory((await params).category);
  if (!category) notFound();
  const result = await getSeoEvents();
  const events = result.events.filter(event => event.category === category.name);
  return <main className="mx-auto min-h-screen max-w-4xl px-5 py-12 text-slate-100 sm:px-8">
    <nav aria-label="Breadcrumb"><Link href="/directory" className="inline-flex min-h-11 items-center text-teal-300">All event categories</Link></nav>
    <h1 className="mt-6 font-display text-4xl font-bold">{category.name} campus events</h1>
    <p className="mt-4 leading-relaxed text-slate-300">{category.description} Browse upcoming public events from Huddle&apos;s campus community.</p>
    <p className="mt-4 text-sm text-slate-400"><span className="font-mono">{events.length}</span> upcoming events in the next <span className="font-mono">90</span> days, including events already underway.</p>
    {events.length ? <ul className="mt-8 space-y-4">{events.map(event => <li key={event.id}>
      <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md">
        <h2 className="font-display text-xl font-bold"><Link href={`/event/${encodeURIComponent(event.id)}`} className="inline-flex min-h-11 items-center hover:text-teal-300">{event.name}</Link></h2>
        <time dateTime={getEventStartUTC(event as GameEvent).toISOString()} className="mt-2 block font-mono text-sm text-slate-300">{formatEventDateForSEO(event as GameEvent)} · {formatEventTimeForSEO(event as GameEvent)}</time>
        <p className="mt-2 text-slate-300">{event.eventType === 'virtual' ? 'Online event' : event.location || 'Location to be announced'}</p>
        {event.organizerName && <p className="mt-2 text-sm text-slate-400">Hosted by {event.organizerName}</p>}
        {event.description && <p className="mt-3 leading-relaxed text-slate-300">{event.description.slice(0, 320)}{event.description.length > 320 ? '…' : ''}</p>}
      </article>
    </li>)}</ul> : <p className="my-8 rounded-3xl border border-white/10 p-6 text-slate-300">No upcoming public {category.name.toLowerCase()} events are listed right now. Try another category or check back soon.</p>}
    {result.truncated && <p className="mt-4 text-sm text-slate-400">Showing a limited selection of upcoming events. Explore more on the map.</p>}
    <Link href="/map" className="mt-6 inline-flex min-h-11 items-center text-teal-300 underline">Explore events on the map</Link>
  </main>;
}
