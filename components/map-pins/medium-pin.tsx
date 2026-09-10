"use client"

interface MediumPinProps {
  size?: number;
}

export default function MediumPin({ size = 24 }: MediumPinProps) {
  // Static ink pin for upcoming events
  return (
    <div className="relative flex items-center justify-center cursor-pointer group" style={{ width: size, height: size }}>
      <div className="w-1/2 h-1/2 bg-ink-2 rounded-full border border-paper shadow-sm" />
    </div>
  )
}
