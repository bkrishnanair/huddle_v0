import React from "react";
import { GameEvent } from "@/lib/types";
import { getCategoryColor } from "@/lib/utils";
import { format, isToday, isTomorrow } from "date-fns";
import { Clock, MapPin, Users } from "lucide-react";

interface EventGridCardProps {
  event: GameEvent;
  onSelectEvent: (event: GameEvent) => void;
  matchPercentage?: number; // Optional Tsenta-style match percentage
  showMapButton?: boolean;
  onUnjoin?: () => void;
}

export function EventGridCard({ event, onSelectEvent, matchPercentage, showMapButton, onUnjoin }: EventGridCardProps) {
  const color = getCategoryColor(event.category || event.sport || "");
  const emoji = event.icon || "📍";
  
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
      className="relative flex flex-col justify-between rounded-[20px] p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 group overflow-hidden"
      style={{
        backgroundColor: `${color}0A`, // Very dark tint (neo-brutalism/bento)
        border: `1px solid ${color}30`,
        boxShadow: `inset 0 0 40px ${color}05, 0 8px 30px rgba(0,0,0,0.2)`
      }}
    >
      {/* Glow on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 70%)`
        }}
      />

      {/* Top Row: Tags & Circular Indicator */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex flex-col gap-1.5">
          {/* Location Tag */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-900/60 w-fit px-2.5 py-1 rounded-full border border-white/5 backdrop-blur-sm">
            <MapPin className="w-3 h-3" style={{ color }} />
            <span className="truncate max-w-[120px]">{event.location || event.venue || "Campus"}</span>
          </div>
          {/* Time Tag */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Clock className="w-3 h-3" />
            {dateText}
          </div>
        </div>

        {/* Tsenta-style Circular Indicator */}
        <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="20" cy="20" r="16" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
            <circle 
              cx="20" cy="20" r="16" fill="transparent" 
              stroke={color} strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black leading-none text-white">{pct}%</span>
            <span className="text-[6px] font-bold uppercase tracking-widest text-slate-400 leading-none mt-0.5">{matchPercentage ? 'Match' : 'Full'}</span>
          </div>
        </div>
      </div>

      {/* Middle: Title & Categories */}
      <div className="mb-6 relative z-10">
        <h3 className="text-xl font-display font-bold text-white leading-tight mb-3 line-clamp-2">
          {event.name || event.title}
        </h3>
        
        {/* Category Pills (like Tsenta's skill tags) */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-slate-900/80 text-white border border-white/5 backdrop-blur-sm">
            {emoji} {event.category || event.sport}
          </span>

        </div>
      </div>

      {/* Bottom Row: Organizer/Logo & Actions */}
      <div className="flex justify-between items-end mt-auto relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs border" style={{ backgroundColor: `${color}20`, borderColor: `${color}40`, color }}>
            {emoji}
          </div>
          <span className="text-xs font-semibold text-slate-400 truncate max-w-[80px]">
            {event.organizerName || "Student"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onUnjoin ? (
            <button 
              onClick={(e) => { e.stopPropagation(); onUnjoin(); }}
              className="text-[11px] font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              Unjoin
            </button>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); /* handle pass */ }}
              className="text-[11px] font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Save
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onSelectEvent(event); }}
            className="text-[11px] font-black uppercase tracking-wider text-slate-950 px-4 py-1.5 rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{ backgroundColor: color, boxShadow: `0 4px 15px ${color}40` }}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
