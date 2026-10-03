"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase-context';
import { Button } from '@/components/ui/button';

type Review = { kind: 'claim' | 'organizer'; id: string; title: string; applicant: string; uid: string; evidenceUrl: string; eventId?: string; version: string };
export function AdminOrganizerReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState('Loading reviews…');
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (!user) return;
    const request = new AbortController();
    setConfirmed({});
    void (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/admin/organizer-reviews', { signal: request.signal, headers: { Authorization: 'Bearer ' + token } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!request.signal.aborted) { setReviews(data.reviews); setMessage(data.reviews.length ? '' : 'No pending reviews.'); }
      } catch { if (!request.signal.aborted) setMessage('Could not load reviews. Retry.'); }
    })();
    return () => request.abort();
  }, [user, reload]);
  const decide = async (review: Review, decision: 'approved' | 'rejected') => {
    if (!user || busy || !confirmed[review.kind + review.id]) return;
    setBusy(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/organizer-reviews', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ kind: review.kind, id: review.id, version: review.version, decision, confirmed: true }) });
      if (!res.ok) throw new Error();
      setReload(value => value + 1);
    } catch { setMessage('Review not confirmed. Reload before retrying.'); }
    finally { setBusy(false); }
  };
  return <section className="mb-8 space-y-3 rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-white">
    <h2 className="text-xl font-bold">Organizer verification & event access</h2>
    <p className="text-sm text-slate-300">Check an independent official source and confirm the applicant’s role. A supplied link alone is not proof of ownership.</p>
    {message && <p role="status" className="text-sm text-orange-300">{message}</p>}
    <Button variant="ghost" disabled={busy} onClick={() => setReload(value => value + 1)}>Reload reviews</Button>
    {reviews.map(review => <article key={review.kind + review.id} className="space-y-2 rounded-xl border border-white/10 p-4">
      <h3 className="font-semibold">{review.title} · {review.kind === 'claim' ? 'Event access' : 'Page identity'}</h3>
      <Link className="inline-flex min-h-11 items-center text-orange-300 underline" href={'/profile/' + encodeURIComponent(review.uid)}>{review.applicant} — view applicant</Link>
      {review.evidenceUrl && <a className="ml-3 inline-flex min-h-11 items-center text-orange-300 underline" href={review.evidenceUrl} target="_blank" rel="noopener noreferrer">Review supplied evidence</a>}
      {review.eventId && <Link className="ml-3 inline-flex min-h-11 items-center underline" href={'/map?eventId=' + encodeURIComponent(review.eventId)}>View event</Link>}
      <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={!!confirmed[review.kind + review.id]} onChange={e => setConfirmed({ ...confirmed, [review.kind + review.id]: e.target.checked })} />I independently reviewed this request.</label>
      <div className="flex gap-2"><Button disabled={busy || !confirmed[review.kind + review.id]} onClick={() => decide(review, 'approved')}>Approve</Button><Button variant="outline" disabled={busy || !confirmed[review.kind + review.id]} onClick={() => decide(review, 'rejected')}>Decline</Button></div>
    </article>)}
  </section>;
}
