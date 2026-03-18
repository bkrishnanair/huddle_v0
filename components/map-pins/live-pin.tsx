"use client"

import { getCategoryColor } from "@/lib/utils"

const getCategoryIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
    Sports: "⚽", Music: "🎵", Community: "🤝", Learning: "📚",
    "Food & Drink": "🍕", Tech: "💻", "Arts & Culture": "🎨",
    Outdoors: "🌲", default: "📍"
  }
  return icons[category] || icons.default
}

interface LivePinProps {
  category: string;
  icon?: string;
  name?: string;
  size?: number;
}

export default function LivePin({ category, icon, name, size = 44 }: LivePinProps) {
  const color = getCategoryColor(category)
  const emoji = icon || getCategoryIcon(category)

  return (
    <div className="relative flex flex-col items-center cursor-pointer group">
      {/* Glow ring animation */}
      <div
        className="absolute rounded-full animate-ping opacity-30"
        style={{
          width: size + 16,
          height: size + 16,
          top: -8,
          left: -8,
          backgroundColor: color,
        }}
      />

      {/* Main pin */}
      <div
        className="rounded-full flex items-center justify-center text-white font-bold transition-transform duration-200 group-hover:scale-110 border-2 border-white/30 relative z-10"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          boxShadow: `0 0 20px ${color}60, 0 4px 12px rgba(0,0,0,0.3)`,
          fontSize: size * 0.4,
        }}
      >
        {emoji}
      </div>

      {/* Event name label */}
      {name && (
        <div
          className="mt-1 px-2 py-0.5 rounded-md text-[9px] font-black text-white whitespace-nowrap max-w-[120px] truncate relative z-10"
          style={{
            backgroundColor: `${color}cc`,
            boxShadow: `0 2px 6px ${color}40`,
          }}
        >
          {name}
        </div>
      )}
    </div>
  )
}
