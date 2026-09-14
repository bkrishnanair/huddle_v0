import 'server-only';
import Link from 'next/link';

export default function NotFound() {
  return <main className="flex min-h-dvh items-center justify-center bg-canvas px-5 py-12 text-slate-100">
    <div className="max-w-md rounded-3xl border border-white/10 bg-panel p-8">
      <p className="font-mono text-sm text-orange-400">404</p>
      <h1 className="mt-3 font-display text-3xl font-bold">This page isn't here.</h1>
      <p className="mt-4 text-slate-300">The link may be outdated, or this event may no longer be available.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/map" className="inline-flex min-h-11 items-center rounded-xl bg-orange-500 px-4 font-semibold text-canvas hover:bg-orange-400">Explore the map</Link>
        <Link href="/directory" className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-4 font-semibold hover:bg-white/5">Browse events</Link>
      </div>
      <Link href="/feedback" className="mt-4 inline-flex min-h-11 items-center text-sm text-slate-300 underline underline-offset-4">Report a broken link</Link>
    </div>
  </main>;
}
