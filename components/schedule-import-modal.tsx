"use client";

import { useState } from "react";
import { X, Upload, Sparkles, Loader2, Check, Pencil, Trash2, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ParsedEvent {
  title: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  category: string;
  description: string;
  capacity: number;
}

interface ScheduleImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventsCreated: () => void;
}

const SAMPLE_TEXT = `UMD Running Club - Spring 2026 Schedule

April 14 (Mon) - Easy Run, 5:30pm, McKeldin Mall, Outdoor Run
April 16 (Wed) - Tempo Run, 5:30pm, Paint Branch Trail, Speed Work
April 19 (Sat) - Long Run (8mi), 8:00am, Lake Artemesia, Endurance
April 21 (Mon) - Recovery Jog, 5:30pm, McKeldin Mall, Easy Run
April 23 (Wed) - Hill Repeats, 5:30pm, Stadium Drive, Speed Work
April 26 (Sat) - Trail Run, 8:00am, Greenbelt Park, Outdoor Run`;

export default function ScheduleImportModal({ isOpen, onClose, onEventsCreated }: ScheduleImportModalProps) {
  const [rawText, setRawText] = useState("");
  const [parsedEvents, setParsedEvents] = useState<ParsedEvent[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!rawText.trim()) {
      toast.error("Please paste your schedule text first");
      return;
    }

    setIsParsing(true);
    setParsedEvents([]);
    try {
      const res = await fetch("/api/ai/parse-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });

      if (!res.ok) throw new Error("Parse failed");

      const data = await res.json();
      setParsedEvents(data.events || []);
      toast.success(`Parsed ${data.count} events from your schedule ✨`);
    } catch {
      toast.error("Failed to parse schedule. Try reformatting the text.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleCreateAll = async () => {
    if (parsedEvents.length === 0) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/events/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: parsedEvents }),
      });

      if (!res.ok) throw new Error("Bulk create failed");

      const data = await res.json();
      toast.success(`🎉 Created ${data.created} events! Your schedule is live.`);
      onEventsCreated();
      onClose();
    } catch {
      toast.error("Failed to create events. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const updateEvent = (index: number, field: keyof ParsedEvent, value: string | number) => {
    setParsedEvents(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeEvent = (index: number) => {
    setParsedEvents(prev => prev.filter((_, i) => i !== index));
  };

  const loadSample = () => {
    setRawText(SAMPLE_TEXT);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-white/10 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-950/95 backdrop-blur-sm border-b border-white/5 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <CalendarPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">AI Schedule Import</h2>
              <p className="text-xs text-slate-500">Paste your event schedule and let AI extract the events</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Step 1: Paste Schedule */}
          {parsedEvents.length === 0 && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-300">
                    Paste your schedule or event list
                  </label>
                  <button
                    onClick={loadSample}
                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                  >
                    Load Sample
                  </button>
                </div>
                <Textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your weekly meeting schedule, club events, or any list of upcoming dates and activities..."
                  className="min-h-[200px] bg-slate-900/50 border-white/10 text-white placeholder:text-slate-600 resize-none"
                />
                <p className="text-[10px] text-slate-600">
                  Works with any format: bullet lists, calendar exports, plain text, CSV-style data
                </p>
              </div>

              <Button
                onClick={handleParse}
                disabled={isParsing || !rawText.trim()}
                className="w-full h-12 text-base font-bold gap-2 bg-primary hover:bg-primary/90"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Parsing with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Parse Schedule with AI
                  </>
                )}
              </Button>
            </>
          )}

          {/* Step 2: Preview & Edit */}
          {parsedEvents.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {parsedEvents.length} events extracted
                  </h3>
                  <p className="text-xs text-slate-500">Review and edit before creating</p>
                </div>
                <button
                  onClick={() => setParsedEvents([])}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  ← Re-parse
                </button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {parsedEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/50 border border-white/5 rounded-xl p-3 group"
                  >
                    {editingIndex === idx ? (
                      /* Edit mode */
                      <div className="space-y-2">
                        <Input
                          value={event.title}
                          onChange={(e) => updateEvent(idx, "title", e.target.value)}
                          className="bg-slate-800 border-white/10 text-white text-sm h-8"
                          placeholder="Event title"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            type="date"
                            value={event.date}
                            onChange={(e) => updateEvent(idx, "date", e.target.value)}
                            className="bg-slate-800 border-white/10 text-white text-xs h-8"
                          />
                          <Input
                            type="time"
                            value={event.time}
                            onChange={(e) => updateEvent(idx, "time", e.target.value)}
                            className="bg-slate-800 border-white/10 text-white text-xs h-8"
                          />
                          <Input
                            value={event.location}
                            onChange={(e) => updateEvent(idx, "location", e.target.value)}
                            className="bg-slate-800 border-white/10 text-white text-xs h-8"
                            placeholder="Location"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingIndex(null)}
                            className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600"
                          >
                            <Check className="w-3 h-3 mr-1" /> Done
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* View mode */
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate">{event.title}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded-full font-bold shrink-0">
                              {event.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            <span>{event.date}</span>
                            <span>{event.time}</span>
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => setEditingIndex(idx)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                          <button
                            onClick={() => removeEvent(idx)}
                            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={handleCreateAll}
                disabled={isCreating || parsedEvents.length === 0}
                className="w-full h-12 text-base font-bold gap-2 bg-emerald-500 hover:bg-emerald-600"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating {parsedEvents.length} events...
                  </>
                ) : (
                  <>
                    <CalendarPlus className="w-5 h-5" />
                    Create All {parsedEvents.length} Events
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
