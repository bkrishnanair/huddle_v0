import 'server-only';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FeedbackForm } from '@/components/feedback-form';

export const metadata: Metadata = {
  title: 'Help improve Huddle',
  description: 'Share an idea, suggest an improvement, or report a problem with Huddle. No account needed.',
  alternates: { canonical: '/feedback' },
};

export default function FeedbackPage() {
  return <main className="min-h-screen bg-canvas px-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-slate-100">
    <div className="mx-auto max-w-xl">
      <Link href="/map" className="inline-flex min-h-11 items-center text-sm text-slate-300 hover:text-white">← Back to the map</Link>
      <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">Help make Huddle better.</h1>
      <p className="mb-8 mt-3 leading-relaxed text-slate-300">What’s missing? What’s confusing? What would make this more useful on campus? We’d like to hear it.</p>
      <FeedbackForm />
    </div>
  </main>;
}
