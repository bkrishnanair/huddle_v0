"use client"

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FEEDBACK_TYPES, feedbackSchema } from '@/lib/feedback';

export function FeedbackForm() {
  const [type, setType] = useState<keyof typeof FEEDBACK_TYPES>('improvement');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const submissionId = useRef('');
  const website = useRef<HTMLInputElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setError('');
    try {
      submissionId.current ||= crypto.randomUUID();
      const payload = feedbackSchema.safeParse({ type, message, email, website: website.current?.value || '', submissionId: submissionId.current });
      if (!payload.success) { setError('Please write at least 10 characters and check your email address.'); return; }
      inFlight.current = true;
      setBusy(true);
      const response = await fetch('/api/feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.data), signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.error || 'Could not send your feedback. Please try again.');
      setSent(true);
    } catch (error) {
      setError(error instanceof Error && error.name !== 'TimeoutError' && error.name !== 'AbortError'
        ? error.message : 'Sending took too long. Your draft is still here; please try again.');
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  if (sent) return <section role="status" className="rounded-3xl border border-teal-400/20 bg-teal-400/5 p-6">
    <h2 className="font-display text-2xl text-white">Thanks for helping shape Huddle.</h2>
    <p className="mt-3 text-slate-300">Your feedback has been sent to the team.{email.trim() ? ' We can reply using the email you shared.' : ''}</p>
    <Link href="/map" className="mt-6 inline-flex min-h-11 items-center font-semibold text-orange-400 underline underline-offset-4">Back to the map</Link>
  </section>;

  const field = 'w-full min-h-11 rounded-xl border border-white/15 bg-canvas px-3 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-orange-400';
  return <form onSubmit={submit} className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-md sm:p-8" aria-busy={busy}>
    <fieldset disabled={busy} className="space-y-6 disabled:opacity-70">
      <legend className="sr-only">Your feedback</legend>
      <div className="space-y-2">
        <label htmlFor="feedback-type" className="block text-sm font-semibold">What would you like to share?</label>
        <select id="feedback-type" value={type} onChange={event => setType(event.target.value as typeof type)} className={field}>
          {Object.entries(FEEDBACK_TYPES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="feedback-message" className="block text-sm font-semibold">Tell us more</label>
        <p id="feedback-hint" className="text-sm text-slate-400">What should we improve? If something broke, tell us what you tried and what happened. Please don’t include passwords or sensitive information.</p>
        <textarea id="feedback-message" required minLength={10} maxLength={3000} rows={6} value={message} onChange={event => setMessage(event.target.value)} aria-describedby="feedback-hint feedback-count" className={`${field} resize-y`} />
        <p id="feedback-count" className="text-right font-mono text-xs text-slate-400">{message.length} / 3000</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="feedback-email" className="block text-sm font-semibold">Email <span className="font-normal text-slate-400">(optional)</span></label>
        <input id="feedback-email" type="email" autoComplete="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} aria-describedby="feedback-email-hint" className={field} />
        <p id="feedback-email-hint" className="text-sm text-slate-400">Only if you’d like us to follow up. No account needed.</p>
      </div>
      <div hidden aria-hidden="true"><label>Website<input ref={website} name="website" tabIndex={-1} autoComplete="off" /></label></div>
    </fieldset>
    <p className="text-xs leading-relaxed text-slate-400">Your message and optional email are sent to the Huddle team, not posted publicly. <Link href="/privacy" className="underline underline-offset-4">Privacy policy</Link></p>
    {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
    <Button type="submit" disabled={busy} className="min-h-12 w-full">{busy ? 'Sending…' : 'Send feedback'}</Button>
    <p className="text-center text-sm text-slate-400">Prefer email? <a href="mailto:support@huddlemap.live" className="text-orange-400 underline underline-offset-4">Contact support</a></p>
  </form>;
}
