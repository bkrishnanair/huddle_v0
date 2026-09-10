"use client"
import { getCategoryColor } from "@/lib/utils"

interface MediumPinProps {
  category: string;
  icon?: string;
  size?: number;
}

export default function MediumPin({ category, icon, size = 32 }: MediumPinProps) {
  const color = getCategoryColor(category)
  return (
    <div className="relative flex items-center justify-center cursor-pointer group" style={{ width: size, height: size }}>
      <div 
        className="w-3/4 h-3/4 rounded-full border border-white/20 shadow-md transition-transform group-hover:scale-110" 
        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}40` }} 
      />
    </div>
  )
}