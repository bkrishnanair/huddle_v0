import React from "react";
import { X } from "lucide-react";
import { getCategoryColor } from "@/lib/utils";

interface FilterPillsProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  activeTime: string;
  onSelectTime: (time: string) => void;
}

export function FilterPills({ activeCategory, onSelectCategory, activeTime, onSelectTime }: FilterPillsProps) {
  const timeFilters = ["Any time", "Live", "Today", "This Week", "This Weekend", "This Month"];
  const CATEGORIES = [
    { name: "Sports" }, { name: "Music" }, { name: "Community" },
    { name: "Learning" }, { name: "Food & Drink" }, { name: "Tech" },
    { name: "Arts & Culture" }, { name: "Outdoors" }, { name: "🖥️ Virtual" }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 mask-edges">
        {/* Time Filters */}
        <div className="flex items-center gap-1.5 border-r border-white/10 pr-4 shrink-0">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mr-1">Date</span>
          {timeFilters.map((time) => {
            const isActive = activeTime === time;
            return (
              <button
                key={time}
                onClick={() => onSelectTime(time)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap
                  ${isActive 
                    ? "bg-teal-500 text-teal-950 shadow-[0_0_15px_rgba(20,184,166,0.3)]" 
                    : "bg-slate-900/50 text-slate-300 border border-white/10 hover:bg-slate-800 hover:text-white"}
                `}
              >
                {time}
                {isActive && time !== "Any time" && <X className="w-3 h-3 opacity-50" />}
              </button>
            );
          })}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mr-1">Vibe</span>
          <button
            onClick={() => onSelectCategory("All")}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap
              ${activeCategory === "All" 
                ? "bg-teal-500 text-teal-950 shadow-[0_0_15px_rgba(20,184,166,0.3)]" 
                : "bg-slate-900/50 text-slate-300 border border-white/10 hover:bg-slate-800 hover:text-white"}
            `}
          >
            All
          </button>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.name;
            const color = getCategoryColor(cat.name);
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap border
                  ${isActive 
                    ? "text-slate-950 shadow-lg" 
                    : "bg-slate-900/50 hover:bg-slate-800 border-white/10 text-slate-300 hover:text-white"}
                `}
                style={{
                  backgroundColor: isActive ? color : undefined,
                  borderColor: isActive ? color : undefined,
                  boxShadow: isActive ? `0 0 15px ${color}50` : undefined,
                }}
              >
                {cat.name}
                {isActive && <X className="w-3 h-3 opacity-50" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
