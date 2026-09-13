import 'server-only';

import type { Metadata } from 'next';
import Link from 'next/link';
import { DIRECTORY_CATEGORIES } from '@/lib/seo/categories';
import { getCategoryColor } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Campus event directory — UMD & College Park',
  description: 'Browse campus events by category on Huddle. Find sports, music, study sessions, and community activities at UMD and around College Park.',
  alternates: {canonical: 'https://huddlemap.live/directory'},
};

export default function DirectoryPage() {
  return <main className="mx-auto min-h-screen max-w-4xl px-5 py-12 text-slate-100 sm:px-8">
    <Link href="/" className="inline-flex min-h-11 items-center text-teal-300">Huddle home</Link>
    <h1 className="mt-6 font-display text-4xl font-bold">Campus event directory</h1>
    <p className="mt-4 max-w-2xl leading-relaxed text-slate-300">Looking for UMD campus events or plans around College Park? Browse public events by category, then open an event on the map to see where it is and how to join.</p>
    <nav aria-label="Event categories" className="mt-8">
      <ul className="grid gap-4 sm:grid-cols-2">{DIRECTORY_CATEGORIES.map(category => <li key={category.slug} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md" style={{borderTopColor: getCategoryColor(category.name)}}>
        <h2 className="font-display text-xl font-bold"><Link href={`/directory/${category.slug}`} className="inline-flex min-h-11 items-center hover:text-teal-300">{category.name} events</Link></h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{category.description}</p>
      </li>)}</ul>
    </nav>
    <p className="mt-8 text-slate-300">Prefer to explore by location? <Link href="/map" className="inline-flex min-h-11 items-center text-teal-300 underline">Open the campus map</Link>.</p>
  </main>;
}
