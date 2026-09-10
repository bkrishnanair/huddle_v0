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
      className="rounded-full transition-transform duration-200 hover:scale-[1.8] cursor-pointer"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}60, 0 0 4px ${color}40`,
      }}
    />
  )
}
