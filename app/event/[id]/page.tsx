import 'server-only';

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeoEvent, eventUrl, eventJsonLd, serializeJsonLd } from '@/lib/seo/events';
import { DIRECTORY_CATEGORIES } from '@/lib/seo/categories';
import { formatEventDateForSEO, formatEventTimeForSEO, formatEventEndForSEO, getEventStartUTC, getEventEndUTC } from '@/lib/datetime';
import { getAccentTokens, getCategoryColor } from '@/lib/utils';
import type { GameEvent } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
type Props = {params: Promise<{id: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const event = await getSeoEvent((await params).id);
  if (!event) notFound();
  const title = event.name;
  const description = event.description?.slice(0, 160) || `View ${event.name}, event times, location, and organizer details on Huddle.`;
  return {title, description, alternates: {canonical: eventUrl(event.id)},
    openGraph: {title, description, url: eventUrl(event.id), siteName: 'Huddle', type: 'website'},
    twitter: {card: 'summary_large_image', title, description}};
}

export default async function PublicEventPage({params}: Props) {
  const event = await getSeoEvent((await params).id);
  if (!event) notFound();
  const schema = eventJsonLd(event);
  const category = DIRECTORY_CATEGORIES.find(item => item.name === event.category);
  const accent = getAccentTokens(getCategoryColor(event.category));
  return <main className="mx-auto min-h-screen w-full max-w-3xl px-5 py-12 text-slate-100 sm:px-8">
    {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: serializeJsonLd(schema)}} />}
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap gap-4 text-teal-300">
      <Link href="/directory" className="inline-flex min-h-11 items-center">Event directory</Link>
      {category && <Link href={`/directory/${category.slug}`} className="inline-flex min-h-11 items-center">{category.name} events</Link>}
    </nav>
    <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md sm:p-8" style={{borderTopColor: accent.accent}}>
      <p className="mb-3 text-sm font-semibold" style={{color: accent.text}}>{event.category}</p>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{event.name}</h1>
      {event.organizerName && <p className="mt-4 text-slate-300">Hosted by {event.organizerName}</p>}
      <dl className="mt-8 space-y-5">
        <div><dt className="text-sm text-slate-400">Date and time</dt><dd className="mt-1 font-mono text-sm">
          <time dateTime={getEventStartUTC(event as GameEvent).toISOString()}>{formatEventDateForSEO(event as GameEvent)} · {formatEventTimeForSEO(event as GameEvent)}</time>
        </dd></div>
        {event.endTime && <div><dt className="text-sm text-slate-400">Ends</dt><dd className="mt-1 font-mono text-sm"><time dateTime={getEventEndUTC(event as GameEvent).toISOString()}>{formatEventEndForSEO(event as GameEvent)}</time></dd></div>}
        <div><dt className="text-sm text-slate-400">Location</dt><dd className="mt-1">{event.eventType === 'virtual' ? 'Online event' : event.location || 'Location to be announced'}</dd></div>
        {event.address && event.address !== event.location && <div><dt className="text-sm text-slate-400">Address</dt><dd className="mt-1">{event.address}</dd></div>}
        {event.currentPlayers !== undefined && event.maxPlayers !== undefined && <div><dt className="text-sm text-slate-400">Attending</dt><dd className="mt-1 font-mono">{event.currentPlayers} / {event.maxPlayers}</dd></div>}
      </dl>
      {event.description && <section className="mt-8 border-t border-white/10 pt-6"><h2 className="font-display text-xl font-bold">About this event</h2><p className="mt-3 whitespace-pre-wrap leading-relaxed text-slate-300">{event.description}</p></section>}
      <Link href={`/map?eventId=${encodeURIComponent(event.id)}`} className="mt-8 inline-flex min-h-11 items-center justify-center rounded-2xl bg-primary px-6 py-3 font-semibold text-canvas">View on the map</Link>
    </article>
  </main>;
}
