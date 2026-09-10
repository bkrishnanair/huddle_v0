"use client"

interface LivePinProps {
  size?: number;
}

export default function LivePin({ size = 44 }: LivePinProps) {
  // Instrument 'RadarPing'
  return (
    <div className="relative flex flex-col items-center justify-center cursor-pointer group" style={{ width: size, height: size }}>
      {/* Outer sweeping radar ping */}
      <div className="absolute inset-0 rounded-full border border-live animate-ping opacity-30" />
      <div className="absolute inset-0 rounded-full border border-live animate-ping opacity-10" style={{ animationDelay: '0.5s' }} />

      {/* Solid core */}
      <div className="w-1/3 h-1/3 bg-live rounded-full shadow-[0_0_12px_var(--ins-live)] relative z-10" />
    </div>
  )
}
