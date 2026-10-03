import 'server-only';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FeedbackForm } from '@/components/feedback-form';

export const metadata: Metadata = {
  title: 'Help improve Huddle',
  description: 'Share an idea, suggest an improvement, or report a problem with Huddle. No account needed.',
  alternates: { canonical: '/feedback' },
};

export default async function FeedbackPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const promotion = (await searchParams).topic === 'promotion';
  return <main className="min-h-screen bg-canvas px-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-slate-100">
    <div className="mx-auto max-w-xl">
      <Link href="/map" className="inline-flex min-h-11 items-center text-sm text-slate-300 hover:text-white">← Back to the map</Link>
      <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">{promotion ? 'Let’s talk about your local event.' : 'Help make Huddle better.'}</h1>
      <p className="mb-8 mt-3 leading-relaxed text-slate-300">{promotion ? 'Tell us what you’re planning and include an email so we can reply. This is an enquiry, not a paid booking or commitment.' : 'What’s missing? What’s confusing? What would make this more useful on campus? We’d like to hear it.'}</p>
      <FeedbackForm initialMessage={promotion ? 'Promotion pilot enquiry\n\nBusiness or organizer name: \nEvent link and date: \nLocation: \nWhat I would like help with: ' : ''} />
    </div>
  </main>;
}
