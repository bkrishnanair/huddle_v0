import React from "react";
import { GameEvent } from "@/lib/types";
import { format, isToday, isTomorrow } from "date-fns";

interface EventGridCardProps {
  event: GameEvent;
  onSelectEvent: (event: GameEvent) => void;
  matchPercentage?: number;
  showMapButton?: boolean;
  onUnjoin?: () => void;
}

const getPastelTheme = (category: string) => {
  const themes: Record<string, { bg: string, text: string, muted: string, ring: string }> = {
    Sports: { bg: "#ffe4e6", text: "#881337", muted: "#be123c", ring: "#f43f5e" }, // Rose
    Music: { bg: "#f3e8ff", text: "#3b0764", muted: "#7e22ce", ring: "#a855f7" }, // Purple
    Community: { bg: "#fce7f3", text: "#831843", muted: "#be185d", ring: "#ec4899" }, // Pink
    Learning: { bg: "#e0f2fe", text: "#082f49", muted: "#0369a1", ring: "#0ea5e9" }, // Sky Blue
    "Food & Drink": { bg: "#fef08a", text: "#422006", muted: "#a16207", ring: "#eab308" }, // Yellow
    Tech: { bg: "#ccfbf1", text: "#042f2e", muted: "#0f766e", ring: "#14b8a6" }, // Teal
    "Arts & Culture": { bg: "#ffedd5", text: "#431407", muted: "#c2410c", ring: "#f97316" }, // Orange
    Outdoors: { bg: "#dcfce7", text: "#052e16", muted: "#15803d", ring: "#22c55e" }, // Green
    "🖥️ Virtual": { bg: "#e0e7ff", text: "#1e1b4b", muted: "#4338ca", ring: "#6366f1" }, // Indigo
    default: { bg: "#f1f5f9", text: "#0f172a", muted: "#475569", ring: "#64748b" }, // Slate
  };
  return themes[category] || themes.default;
};

const EMOJIS: Record<string, string> = {
  Sports: "⚽", Music: "🎵", Community: "🤝", Learning: "📚",
  "Food & Drink": "🍕", Tech: "💻", "Arts & Culture": "🎨", Outdoors: "🌲",
  "🖥️ Virtual": "🌐"
};

export function EventGridCard({ event, onSelectEvent, matchPercentage, showMapButton, onUnjoin }: EventGridCardProps) {
  const cat = event.category || event.sport || "";
  const theme = getPastelTheme(cat);
  const emoji = event.icon || EMOJIS[cat] || "📍";
  
  // Format Date
  let dateText = "TBD";
  if (event.date) {
    try {
      const d = new Date(`${event.date}T${event.time || "00:00"}`);
      if (isToday(d)) dateText = `Today, ${format(d, "h:mm a")}`;
      else if (isTomorrow(d)) dateText = `Tomorrow, ${format(d, "h:mm a")}`;
      else dateText = format(d, "MMM d, h:mm a");
    } catch(e) {
      dateText = event.date;
    }
  }

  // Calculate capacity percentage if no match percentage provided
  const pct = matchPercentage 
    ? matchPercentage 
    : (event.maxPlayers ? Math.min(100, Math.round((event.currentPlayers / event.maxPlayers) * 100)) : 100);
    
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div 
      onClick={() => onSelectEvent(event)}
      className="relative flex flex-col justify-between rounded-[20px] p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-sm hover:shadow-xl"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Top Row: Tags & Circular Indicator */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium truncate max-w-[160px]" style={{ color: theme.text }}>
            {event.location || event.venue || "Campus"}
          </div>
          <div className="text-xs font-medium" style={{ color: theme.muted }}>
            {dateText}
          </div>
        </div>

        {/* Tsenta-style Circular Indicator */}
        <div className="relative flex items-center justify-center w-11 h-11 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="22" cy="22" r="18" fill="transparent" stroke={theme.text} strokeOpacity="0.1" strokeWidth="2.5" />
            <circle 
              cx="22" cy="22" r="18" fill="transparent" 
              stroke={theme.ring} strokeWidth="2.5"
              strokeDasharray={circumference * (18/16)} // Adjust for new radius
              strokeDashoffset={(circumference * (18/16)) - (pct / 100) * (circumference * (18/16))}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold leading-none" style={{ color: theme.text }}>{pct}%</span>
            <span className="text-[7px] font-bold uppercase tracking-widest leading-none mt-0.5" style={{ color: theme.muted }}>
              {matchPercentage ? 'Match' : 'Full'}
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Title & Categories */}
      <div className="mb-8">
        <h3 className="text-xl font-display font-bold leading-tight mb-3 line-clamp-2" style={{ color: theme.text }}>
          {event.name || event.title}
        </h3>
        
        {/* Category Pills (like Tsenta's skill tags) */}
        <div className="flex flex-wrap gap-1.5">
          <span 
            className="text-[11px] font-semibold px-2.5 py-1 rounded-md"
            style={{ backgroundColor: 'rgba(255,255,255,0.4)', color: theme.text }}
          >
            {emoji} {cat}
          </span>
          {event.eventType === 'virtual' && (
            <span 
              className="text-[11px] font-semibold px-2.5 py-1 rounded-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.4)', color: theme.text }}
            >
              Virtual
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row: Organizer/Logo & Actions */}
      <div className="flex justify-between items-end mt-auto">
        <div className="flex items-center gap-2">
          <div 
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm" 
            style={{ backgroundColor: 'rgba(255,255,255,0.5)', color: theme.text }}
          >
            {emoji}
          </div>
          <span className="text-xs font-semibold truncate max-w-[80px]" style={{ color: theme.muted }}>
            {event.organizerName || "Student"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onUnjoin ? (
            <button 
              onClick={(e) => { e.stopPropagation(); onUnjoin(); }}
              className="text-xs font-bold transition-colors hover:opacity-70"
              style={{ color: theme.muted }}
            >
              Unjoin
            </button>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); /* handle save */ }}
              className="text-xs font-bold transition-colors hover:opacity-70"
              style={{ color: theme.muted }}
            >
              Save
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onSelectEvent(event); }}
            className="text-xs font-bold px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{ backgroundColor: theme.text, color: '#ffffff' }}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
