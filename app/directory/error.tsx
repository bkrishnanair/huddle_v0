'use client';

export default function DiscoveryError({reset}: {reset: () => void}) {
  return <main className="mx-auto min-h-screen max-w-2xl px-5 py-16 text-slate-100">
    <h1 className="font-display text-3xl font-bold">Events are temporarily unavailable</h1>
    <p className="mt-4 text-slate-300">We couldn&apos;t load the latest public events. Try again in a moment.</p>
    <button onClick={reset} className="mt-6 min-h-11 rounded-2xl bg-primary px-6 py-3 font-semibold text-canvas">Try again</button>
    <a href="/directory" className="ml-4 inline-flex min-h-11 items-center text-teal-300">Browse categories</a>
  </main>;
}
