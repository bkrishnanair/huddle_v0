"use client"

import { getCategoryColor } from "@/lib/utils"

interface DotPinProps {
  category: string;
  size?: number;
}

export default function DotPin({ category, size = 16 }: DotPinProps) {
  const color = getCategoryColor(category)

  return (
    <div className="group flex min-h-11 min-w-11 items-center justify-center cursor-pointer" title={category}>
    <div
      className="box-border rounded-full border-2 border-white transition-transform duration-200 group-hover:scale-125 motion-reduce:transition-none"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: '0 0 0 1px #0B101B, 0 2px 4px rgba(11,16,27,0.3)',
      }}
    />
    </div>
  )
}
