"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/firebase-context';
import { organizerIdSchema } from '@/lib/organizers';

export function OrganizerUpdateEditor() {
  const { user } = useAuth();
  const [eventLink, setEventLink] = useState('');
  const [message, setMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  return <form className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-white" onSubmit={async e => {
    e.preventDefault();
    if (!user || busy || !confirmed) return;
    let id = eventLink.trim();
    try { const url = new URL(id); id = url.searchParams.get('eventId') || url.pathname.split('/').filter(Boolean).pop() || ''; } catch { /* Raw event IDs are accepted too. */ }
    if (!organizerIdSchema.safeParse(id).success) { setStatus('Paste your event link or ID.'); return; }
    setBusy(true); setStatus('');
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/organizers/updates', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ eventId: id, message, public: true }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus('Public update posted. It replaces the previous update for this event.'); setMessage(''); setConfirmed(false);
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not publish.'); }
    finally { setBusy(false); }
  }}>
    <h3 className="font-display text-xl font-bold">Post an event update</h3>
    <p className="text-sm text-slate-300">Share a reason to come along. Only your public upcoming events can appear on Home. This is separate from private attendee chat.</p>
    <label className="block text-sm">Event link<Input value={eventLink} onChange={e => setEventLink(e.target.value)} required disabled={busy} /></label>
    <label className="block text-sm">Public update<Textarea minLength={5} maxLength={280} value={message} onChange={e => { setMessage(e.target.value); setConfirmed(false); }} required disabled={busy} /></label>
    <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} disabled={busy} />This message is public and contains no attendee or private contact information.</label>
    <Button type="submit" disabled={busy || !confirmed}>{busy ? 'Posting…' : 'Post public update'}</Button>
    <Button type="button" variant="ghost" disabled={busy || !eventLink.trim()} onClick={async () => {
      if (!user || busy) return;
      let id = eventLink.trim();
      try { const url = new URL(id); id = url.searchParams.get('eventId') || url.pathname.split('/').filter(Boolean).pop() || ''; } catch { /* A raw event ID is also accepted. */ }
      if (!organizerIdSchema.safeParse(id).success) { setStatus('Paste the event link for the update to remove.'); return; }
      setBusy(true);
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/organizers/updates', { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ eventId: id }) });
        if (!res.ok) throw new Error();
        setStatus('Public update removed. The event is unchanged.');
      } catch { setStatus('Could not remove the update.'); }
      finally { setBusy(false); }
    }}>Remove this event’s public update</Button>
    {status && <p role="status" className="text-sm text-orange-300">{status}</p>}
  </form>;
}

type PublicUpdate = { id: string; eventId: string; ownerId: string; organizerName: string; eventName: string; message: string };
export function OrganizerUpdatesFeed() {
  const [updates, setUpdates] = useState<PublicUpdate[]>([]);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const request = new AbortController();
    setFailed(false);
    void fetch('/api/organizers/updates', { signal: request.signal }).then(async response => {
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!request.signal.aborted) setUpdates(data.updates || []);
    }).catch(() => { if (!request.signal.aborted) setFailed(true); });
    return () => request.abort();
  }, [attempt]);
  if (failed) return <div className="text-sm text-slate-400">Organizer updates couldn’t load. <Button variant="ghost" onClick={() => setAttempt(value => value + 1)}>Retry updates</Button></div>;
  if (!updates.length) return null;
  return <section className="space-y-4"><h2 className="font-display text-xl font-bold text-white">From campus organizers</h2>
    <ul className="grid gap-3 sm:grid-cols-2">{updates.map(update => <li key={update.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <Link className="inline-flex min-h-11 items-center text-sm text-orange-300" href={'/organizers/' + encodeURIComponent(update.ownerId)}>{update.organizerName}</Link>
      <p className="whitespace-pre-wrap break-words text-sm text-slate-200">{update.message}</p>
      <Link className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-white underline" href={'/map?eventId=' + encodeURIComponent(update.eventId)}>View {update.eventName}</Link>
    </li>)}</ul>
  </section>;
}
