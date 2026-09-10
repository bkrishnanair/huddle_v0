"use client"

interface DotPinProps {
  size?: number;
}

export default function DotPin({ size = 12 }: DotPinProps) {
  // Tiny static ink dot
  return (
    <div className="w-2 h-2 bg-ink-3 rounded-full border border-paper shadow-sm opacity-60" />
  )
}
