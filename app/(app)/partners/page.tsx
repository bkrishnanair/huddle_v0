import 'server-only';
import Link from 'next/link';

export const metadata = { title: 'Host local events with Huddle', description: 'Give nearby students a reason to visit your business, venue, or community event.' };

export default function PartnersPage() {
  return <main className="mx-auto max-w-3xl space-y-6 px-5 py-10 pb-32 text-white">
    <h1 className="font-display text-3xl font-bold">Give nearby students a reason to stop by.</h1>
    <p className="text-lg text-slate-300">A workshop, open mic, tasting, or community night belongs on the map. Help people find a real plan—not another ad to scroll past.</p>
    <ol className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-slate-200"><li>1. Create an organizer page with your venue, story, and website.</li><li>2. Publish a specific event with a real date and location. State any price, eligibility, booking requirements, or offer expiry clearly.</li><li>3. Share the event link and invite people to follow your organizer page.</li></ol>
    <div className="flex flex-wrap gap-4"><Link href="/my-events?tab=studio" className="inline-flex min-h-11 items-center rounded-xl bg-orange-500 px-4 font-semibold text-slate-950">Set up your page</Link><Link href="/feedback?topic=promotion" className="inline-flex min-h-11 items-center text-orange-300 underline">Ask about a promotion pilot</Link></div>
    <p className="text-sm text-slate-400">Promotion pilots are discussed individually. No automatic charges, guaranteed attendance, or guaranteed placement. Any future paid placement must be clearly marked as sponsored.</p>
    <Link href="/organizers" className="inline-flex min-h-11 items-center text-orange-300">Browse organizers</Link>
  </main>;
}
