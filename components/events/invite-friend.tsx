"use client";
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/firebase-context';
import { Button } from '@/components/ui/button';

export function InviteFriend({ eventId }: { eventId: string }) {
  const { user } = useAuth();
  const [friends, setFriends] = useState<{ uid: string; name: string }[] | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState('');
  const [message, setMessage] = useState('');
  const request = useRef<AbortController | null>(null);
  useEffect(() => { setOpen(false); setFriends(null); setTarget(''); setMessage(''); setBusy(false); return () => request.current?.abort(); }, [user?.uid, eventId]);
  if (!user || user.isAnonymous) return null;
  const load = async () => {
    if (busy) return;
    const controller = new AbortController(); request.current = controller;
    setOpen(true); setBusy(true); setMessage('');
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/events/' + encodeURIComponent(eventId) + '/invite', { signal: controller.signal, headers: { Authorization: 'Bearer ' + token } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!controller.signal.aborted) setFriends(data.friends);
    } catch { if (!controller.signal.aborted) setMessage('Could not load friends. Try again.'); }
    finally { if (!controller.signal.aborted) setBusy(false); }
  };
  return <div className="mt-3 space-y-2">
    {!open ? <Button type="button" variant="outline" onClick={load}>Invite a Huddle friend</Button> : <>
      <p className="text-xs text-slate-300">Send an in-app invitation to someone who follows you back. No automatic RSVP or push notification.</p>
      {friends?.length ? <label className="block text-sm text-slate-200">Choose a friend<select disabled={busy} value={target} onChange={e => { setTarget(e.target.value); setMessage(''); }} className="mt-1 min-h-11 w-full rounded-xl bg-slate-800 px-3"><option value="">Select someone</option>{friends.map(friend => <option key={friend.uid} value={friend.uid}>{friend.name}</option>)}</select></label> : friends && <p className="text-sm text-slate-300">No mutual follows yet. Use “Bring a friend” to share the event link instead.</p>}
      <div className="flex flex-wrap gap-2">
        {!!friends?.length && <Button type="button" disabled={!target || busy} onClick={async () => {
          if (busy) return;
          const controller = new AbortController(); request.current = controller;
          setBusy(true); setMessage('');
          try {
            const token = await user.getIdToken();
            const res = await fetch('/api/events/' + encodeURIComponent(eventId) + '/invite', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ targetUserId: target }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            if (!controller.signal.aborted) setMessage('Invitation is in their Huddle notifications. Sending again will not create a duplicate.');
          } catch (error) { if (!controller.signal.aborted) setMessage(error instanceof Error ? error.message : 'Could not send. Retry safely.'); }
          finally { if (!controller.signal.aborted) setBusy(false); }
        }}>Send invitation</Button>}
        {!friends && <Button type="button" variant="ghost" disabled={busy} onClick={load}>{busy ? 'Loading…' : 'Retry'}</Button>}
        <Button type="button" variant="ghost" disabled={busy} onClick={() => setOpen(false)}>Close</Button>
      </div>
      {message && <p role="status" className="text-sm text-orange-300">{message}</p>}
    </>}
  </div>;
}
