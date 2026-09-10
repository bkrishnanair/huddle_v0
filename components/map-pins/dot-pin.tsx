"use client"
import { getCategoryColor } from "@/lib/utils"

interface DotPinProps {
  category: string;
  size?: number;
}

export default function DotPin({ category, size = 12 }: DotPinProps) {
  const color = getCategoryColor(category)
  return (
    <div 
      className="rounded-full border border-white/10 opacity-70" 
      style={{ width: size, height: size, backgroundColor: color }} 
    />
  )
}