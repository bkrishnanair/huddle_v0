import 'server-only';

import Link from 'next/link';
import { getOrganizerDirectory } from '@/lib/organizers-server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Campus clubs & local organizers | Huddle', description: 'Discover student clubs, local businesses and community organizers hosting events on Huddle.' };

export default async function OrganizersPage() {
  const organizers = await getOrganizerDirectory();
  return <main className="mx-auto max-w-5xl space-y-6 px-5 py-8 pb-32 text-white">
    <h1 className="font-display text-3xl font-bold">Meet the organizers</h1>
    <p className="text-slate-300">Find a club, a local business, or a community to show up for. Only pages marked verified have had their identity reviewed by Huddle.</p>
    <div className="flex flex-wrap gap-4"><Link href="/my-events?tab=studio" className="inline-flex min-h-11 items-center text-orange-300 underline">Create your organizer page</Link><Link href="/partners" className="inline-flex min-h-11 items-center text-orange-300 underline">For local businesses</Link></div>
    {organizers.length === 0 && <p className="rounded-2xl border border-white/10 p-6">The first organizers are setting up their pages. You can still discover events on the map.</p>}
    <ul className="grid gap-4 sm:grid-cols-2">{organizers.map(organizer => <li key={organizer.id} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
      <p className="text-xs capitalize text-slate-400">{organizer.kind} · {organizer.area}</p>
      <Link className="inline-flex min-h-11 items-center font-display text-xl font-bold underline-offset-4 hover:underline" href={'/organizers/' + encodeURIComponent(organizer.id)}>{organizer.name}</Link>
      <p className="text-xs text-teal-300">{organizer.verified ? 'Identity verified by Huddle' : 'Community-submitted page'}</p>
      <p className="mt-3 line-clamp-3 text-sm text-slate-300">{organizer.about}</p>
    </li>)}</ul>
  </main>;
}
