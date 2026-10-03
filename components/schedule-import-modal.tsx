"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import LocationSearchInput from "@/components/location-search";
import { useAuth } from "@/lib/firebase-context";
import { DIRECTORY_CATEGORIES } from "@/lib/seo/categories";
import { publishScheduleSchema, publishScheduleEventSchema, scheduleParseResultSchema, SCHEDULE_LIMIT, type ScheduleDraft } from "@/lib/schedule-import";
import { toast } from "sonner";

interface ScheduleImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventsCreated: () => void;
}

export default function ScheduleImportModal({ isOpen, onClose, onEventsCreated }: ScheduleImportModalProps) {
  const { user } = useAuth();
  const [rawText, setRawText] = useState("");
  const [rows, setRows] = useState<{ id: string; event: ScheduleDraft }[]>([]);
  const [timezone, setTimezone] = useState("America/New_York");
  const [busy, setBusy] = useState<"parse" | "publish" | null>(null);
  const [error, setError] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState("");
  const parsing = useRef<AbortController | null>(null);
  const working = useRef(false);
  const account = useRef(user?.uid);
  account.current = user?.uid;

  useEffect(() => () => parsing.current?.abort(), []);
  useEffect(() => {
    if (!isOpen) { parsing.current?.abort(); parsing.current = null; }
  }, [isOpen]);
  useEffect(() => {
    setRows([]); setRawText(""); setSubmitted(null); setSubmissionId(""); setError(""); setReviewed(false);
  }, [user?.uid]);

  const update = (id: string, changes: Partial<ScheduleDraft>) => {
    if (submitted) return;
    setRows(previous => previous.map(row => row.id === id ? { ...row, event: { ...row.event, ...changes } } : row));
    setReviewed(false);
  };

  const parse = async () => {
    if (!user || user.isAnonymous || working.current) return;
    const uid = user.uid;
    working.current = true; setBusy("parse"); setError("");
    const controller = new AbortController();
    parsing.current = controller;
    const timeout = setTimeout(() => controller.abort(), 55000);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/ai/parse-schedule", {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ rawText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not read this schedule.");
      const checked = scheduleParseResultSchema.parse({ events: data.events });
      if (controller.signal.aborted || account.current !== uid) return;
      setRows(checked.events.map(event => ({ id: crypto.randomUUID(), event })));
      setSubmissionId(crypto.randomUUID()); setReviewed(false); setSubmitted(null);
      if (!checked.events.length) setError("No events found. Include explicit dates, times, and venues.");
    } catch (failure) {
      if (account.current === uid && parsing.current === controller) setError(failure instanceof Error && failure.name !== "AbortError" ? failure.message : "Parsing timed out. Your text is still here.");
    } finally {
      clearTimeout(timeout); working.current = false; setBusy(null);
      if (parsing.current === controller) parsing.current = null;
    }
  };

  const publish = async () => {
    if (!user || user.isAnonymous || working.current) return;
    const checked = publishScheduleSchema.safeParse({ submissionId, timezone, events: rows.map(row => row.event) });
    if (!checked.success) { setError(checked.error.issues[0]?.message || "Complete every event."); return; }
    if (!reviewed) { setError("Confirm that you reviewed every event."); return; }
    const payload = submitted || JSON.stringify(checked.data);
    const uid = user.uid;
    setSubmitted(payload); working.current = true; setBusy("publish"); setError("");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/events/bulk", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: payload, signal: AbortSignal.timeout(45000),
      });
      const data = await res.json();
      if (!res.ok) {
        // Definite rejection: allow corrections. Uncertain outcomes must retry the exact request.
        if ([400, 401, 403, 409, 429].includes(res.status)) setSubmitted(null);
        throw new Error(data.error || "Publishing could not be confirmed.");
      }
      if (account.current !== uid) return;
      setRows([]); setSubmitted(null); setRawText(""); setReviewed(false);
      toast.success("Published " + data.created + " events.");
      onEventsCreated(); onClose();
    } catch (failure) {
      if (account.current === uid) setError(failure instanceof Error ? failure.message : "Connection lost. Retry the unchanged draft to confirm publishing.");
    } finally { working.current = false; setBusy(null); }
  };

  return <Dialog open={isOpen} onOpenChange={open => { if (!open && busy !== "publish") onClose(); }}>
    <DialogContent className="flex max-h-[90dvh] flex-col overflow-hidden bg-slate-950 text-white sm:max-w-2xl"
      onInteractOutside={e => { if ((e.target as HTMLElement)?.closest?.('.pac-container')) e.preventDefault(); }}>
      <DialogHeader>
        <DialogTitle>Import an event schedule</DialogTitle>
        <DialogDescription>Describe one event or paste a schedule or spreadsheet rows. Review up to {SCHEDULE_LIMIT} events per import; nothing publishes automatically.</DialogDescription>
      </DialogHeader>
      <div className="min-h-0 space-y-4 overflow-y-auto overscroll-contain p-1">
        {(!user || user.isAnonymous) && <p role="status">Sign in with a full account to publish events.</p>}
        {error && <p role="alert" className="rounded-xl border border-rose-400/30 p-3 text-sm text-rose-300">{error}</p>}
        {!rows.length ? <>
          <label className="block text-sm" htmlFor="schedule-text">Schedule text (include the year)</label>
          <Textarea id="schedule-text" value={rawText} onChange={e => setRawText(e.target.value)} maxLength={20000} rows={8}
            placeholder="Paste dates, titles, times, venues and known capacity. Missing details will be left for you to complete." disabled={!!busy} />
          <Button type="button" onClick={parse} disabled={!!busy || rawText.trim().length < 10 || !user || user.isAnonymous} className="w-full">
            {busy === "parse" && <Loader2 className="h-4 w-4 animate-spin" />}Review extracted events
          </Button>
        </> : <>
          <p className="text-sm text-slate-300">Confirm each venue on the map. Missing times and capacity are never guessed. For longer schedules, import the remaining rows separately.</p>
          <label className="block space-y-1 text-sm">Timezone
            <Input value={timezone} onChange={e => { setTimezone(e.target.value); setReviewed(false); }} disabled={!!busy || !!submitted} placeholder="America/New_York" />
          </label>
          {rows.map(({ id, event }, index) => {
            const validation = publishScheduleEventSchema.safeParse(event);
            return <details key={id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-3" open={!validation.success ? true : undefined}>
              <summary className="min-h-11 cursor-pointer text-sm font-semibold">{index + 1}. {event.title || "Untitled event"} {!validation.success && <span className="text-amber-300"> · Needs review</span>}</summary>
              <fieldset disabled={!!busy || !!submitted} className="space-y-3 pt-2">
                <label className="block text-sm">Title<Input value={event.title} maxLength={120} onChange={e => update(id, { title: e.target.value })} /></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm">Date<Input type="date" value={event.date} onChange={e => update(id, { date: e.target.value })} /></label>
                  <label className="text-sm">Start time<Input type="time" value={event.time} onChange={e => update(id, { time: e.target.value })} /></label>
                  <label className="text-sm">End date (optional)<Input type="date" value={event.endDate} onChange={e => update(id, { endDate: e.target.value })} /></label>
                  <label className="text-sm">End time (optional)<Input type="time" value={event.endTime} onChange={e => update(id, { endTime: e.target.value })} /></label>
                </div>
                <label className="block text-sm">Category
                  <select className="min-h-11 w-full rounded-xl bg-slate-800 px-3" value={event.category} onChange={e => update(id, { category: e.target.value })}>
                    <option value="">Choose a category</option>{DIRECTORY_CATEGORIES.map(category => <option key={category.slug}>{category.name}</option>)}
                  </select>
                </label>
                <label className="block text-sm">Confirmed capacity<Input type="number" min={1} max={10000} value={event.capacity ?? ""} onChange={e => update(id, { capacity: e.target.value ? Number(e.target.value) : null })} /></label>
                <p className="text-sm text-slate-300">Venue from schedule: {event.location || "Not specified"}</p>
                <LocationSearchInput onPlaceSelect={place => {
                  const location = place?.geometry?.location;
                  update(id, location ? { location: place?.formatted_address || place?.name || "", geopoint: { latitude: location.lat(), longitude: location.lng() } } : { geopoint: undefined });
                }} insideModal />
                <p className="text-xs text-slate-400">{event.geopoint ? "Map location confirmed" : "Choose a search result to confirm the map location."}</p>
                <label className="block text-sm">Description<Textarea value={event.description} maxLength={500} onChange={e => update(id, { description: e.target.value })} /></label>
                {!validation.success && <p className="text-xs text-amber-300">{validation.error.issues.map(issue => issue.path.join(".") + ": " + issue.message).join(" · ")}</p>}
                <Button type="button" variant="ghost" onClick={() => { setRows(previous => previous.filter(row => row.id !== id)); setReviewed(false); }}><Trash2 className="h-4 w-4" />Remove event</Button>
              </fieldset>
            </details>;
          })}
          <label className="flex min-h-11 items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 h-5 w-5" checked={reviewed} disabled={!!submitted || !!busy} onChange={e => setReviewed(e.target.checked)} />
            I am authorized to publish these events. I reviewed dates, venues, capacity, and registration requirements. These events will be public.
          </label>
          {submitted && <p role="status" className="text-sm text-amber-300">Publishing was attempted. Retry this unchanged draft to confirm the result without duplicate events.</p>}
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={publish} disabled={!!busy || !reviewed}>{busy === "publish" && <Loader2 className="h-4 w-4 animate-spin" />}{submitted ? "Confirm publishing" : "Publish reviewed events"}</Button>
            {!submitted && <Button type="button" variant="ghost" disabled={!!busy} onClick={() => { setRows([]); setReviewed(false); }}>Back to schedule</Button>}
          </div>
        </>}
      </div>
    </DialogContent>
  </Dialog>;
}
