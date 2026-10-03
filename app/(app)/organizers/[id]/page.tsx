import 'server-only';

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';
import { getPublicOrganizer, getOrganizerEvents } from '@/lib/organizers-server';
import { organizerIdSchema } from '@/lib/organizers';
import { formatEventDateForSEO, formatEventTimeForSEO } from '@/lib/datetime';
import { FollowButton } from '@/components/follow-button';

export const dynamic = 'force-dynamic';
const readOrganizer = cache(getPublicOrganizer);
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const page = await readOrganizer(id);
  return page ? { title: page.name + ' | Huddle', description: page.about.slice(0, 160), robots: { index: page.verified }, alternates: { canonical: 'https://huddlemap.live/organizers/' + encodeURIComponent(id) } } : { title: 'Organizer | Huddle', robots: { index: false } };
}

export default async function OrganizerPage({ params }: Props) {
  const { id } = await params;
  if (!organizerIdSchema.safeParse(id).success) notFound();
  const page = await readOrganizer(id);
  // Hosts without a published organizer page keep their existing public profile.
  if (!page) redirect('/profile/' + encodeURIComponent(id));
  const events = await getOrganizerEvents(id);
  return <main className="mx-auto max-w-3xl space-y-6 px-5 py-8 pb-32 text-white">
    <Link href="/organizers" className="inline-flex min-h-11 items-center text-orange-300">All organizers</Link>
    <header className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <p className="text-sm capitalize text-slate-400">{page.kind} · {page.area}</p>
      <h1 className="font-display text-3xl font-bold">{page.name}</h1>
      <p className="text-xs text-teal-300">{page.verified ? 'Identity verified by Huddle' : 'Community-submitted · Identity not yet verified'}</p>
      <p className="whitespace-pre-wrap break-words text-slate-200">{page.about}</p>
      <div className="flex flex-wrap items-center gap-4">
        <FollowButton targetUserId={id} targetUserName={page.name} />
        {page.website && <a className="inline-flex min-h-11 items-center text-orange-300 underline" href={page.website} target="_blank" rel="noopener noreferrer nofollow">Visit website or social page</a>}
      </div>
      <p className="text-xs text-slate-400">Following this organizer uses your existing Huddle follows. Event updates appear on Home; push delivery depends on your notification settings.</p>
    </header>
    <section className="space-y-3"><h2 className="font-display text-xl font-bold">Upcoming events</h2>
      {!events.length && <p className="text-slate-400">No public upcoming events yet. Check back for their next plan.</p>}
      <ul className="space-y-3">{events.map(event => <li key={event.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <Link className="inline-flex min-h-11 items-center text-lg font-semibold text-white underline-offset-4 hover:underline" href={'/map?eventId=' + encodeURIComponent(event.id)}>{event.name}</Link>
        <p className="font-mono text-xs text-slate-300">{formatEventDateForSEO(event)} · {formatEventTimeForSEO(event)}</p>
        <p className="mt-2 line-clamp-2 text-sm text-slate-400">{event.description}</p>
      </li>)}</ul>
    </section>
  </main>;
}
