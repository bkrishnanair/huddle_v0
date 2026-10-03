"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase-context';
import { organizerSchema, type OrganizerInput } from '@/lib/organizers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const emptyPage: OrganizerInput = { name: '', kind: 'club', about: '', area: 'College Park, Maryland', website: '', published: false };

export function OrganizerPageEditor() {
  const { user } = useAuth();
  const [form, setForm] = useState(emptyPage);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const request = new AbortController();
    setForm(emptyPage); setLoading(true); setMessage(''); setLoadError(false);
    if (!user || user.isAnonymous) { setLoading(false); return; }
    void (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/organizers/me', { signal: request.signal, headers: { Authorization: 'Bearer ' + token } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!request.signal.aborted && data.organizer) {
          const { id, verified, ...fields } = data.organizer;
          setForm(organizerSchema.parse(fields));
        }
      } catch { if (!request.signal.aborted) { setLoadError(true); setMessage('Could not load your page. Retry before editing.'); } }
      finally { if (!request.signal.aborted) setLoading(false); }
    })();
    return () => request.abort();
  }, [user, reload]);

  if (!user || user.isAnonymous) return <p className="text-sm text-slate-300">Sign in with a full account to create your organizer page.</p>;
  if (loading) return <p role="status">Loading organizer page…</p>;
  return <form className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-white" onSubmit={async e => {
    e.preventDefault();
    if (saving || loadError) return;
    const parsed = organizerSchema.safeParse(form);
    if (!parsed.success) { setMessage(parsed.error.issues[0]?.message || 'Check the fields.'); return; }
    setSaving(true); setMessage('');
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/organizers/me', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(parsed.data) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save.');
      setMessage(form.published ? 'Page published. Identity verification is reviewed separately by Huddle.' : 'Saved as unpublished.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save.'); }
    finally { setSaving(false); }
  }}>
    <h3 className="font-display text-xl font-bold">Your organizer page</h3>
    <p className="text-sm text-slate-300">One page for your club, business, or community. Your public events appear here; event management stays with your account. Publishing does not claim affiliation or grant a verified badge.</p>
    {message && <p role="status" className="text-sm text-orange-300">{message}</p>}
    {loadError && <Button type="button" onClick={() => setReload(value => value + 1)}>Retry loading</Button>}
    <fieldset disabled={saving || loadError} className="space-y-3">
      <label className="block text-sm">Organizer name<Input value={form.name} maxLength={80} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
      <label className="block text-sm">Type<select className="min-h-11 w-full rounded-xl bg-slate-800 px-3" value={form.kind} onChange={e => setForm({ ...form, kind: e.target.value as OrganizerInput['kind'] })}><option value="club">Student club</option><option value="business">Local business</option><option value="community">Community organizer</option></select></label>
      <label className="block text-sm">About<Textarea value={form.about} minLength={20} maxLength={1200} onChange={e => setForm({ ...form, about: e.target.value })} required /></label>
      <label className="block text-sm">Area<Input value={form.area} maxLength={120} onChange={e => setForm({ ...form, area: e.target.value })} required /></label>
      <label className="block text-sm">Official website or social page (HTTPS)<Input type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://…" /></label>
      <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />Publish this information publicly. I am authorized to represent this organizer.</label>
      <div className="flex flex-wrap gap-3"><Button type="submit">{saving ? 'Saving…' : 'Save page'}</Button><Link className="inline-flex min-h-11 items-center text-orange-300 underline" href={'/organizers/' + encodeURIComponent(user.uid)}>View public page</Link></div>
    </fieldset>
  </form>;
}
