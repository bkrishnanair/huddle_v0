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

interface MediumPinProps {
  category: string;
  icon?: string;
  size?: number;
}

export default function MediumPin({ category, icon, size = 32 }: MediumPinProps) {
  const color = getCategoryColor(category)
  const emoji = icon || getCategoryIcon(category)

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold transition-transform duration-200 hover:scale-125 cursor-pointer border-2 border-white/20"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        boxShadow: `0 2px 8px ${color}40`,
        fontSize: size * 0.45,
      }}
    >
      {emoji}
    </div>
  )
}
