"use client"

import { useState, useEffect } from "react"
import { X, MapPin, Filter, Plus } from "lucide-react"

interface OnboardingTooltipProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Explore the Map",
    description: "Tap any pin to see event details, RSVP, and chat with attendees.",
    icon: MapPin,
    position: "top-32 left-1/2 -translate-x-1/2" as const,
    arrowDirection: "up" as const,
  },
  {
    title: "Filter Events",
    description: "Use the chips at the top to filter by category or time — try 'Live' to see what's happening now!",
    icon: Filter,
    position: "top-44 left-4" as const,
    arrowDirection: "up" as const,
  },
  {
    title: "Create an Event",
    description: "Tap the + button to drop a pin and create your own event in seconds.",
    icon: Plus,
    position: "bottom-28 right-8" as const,
    arrowDirection: "down" as const,
  },
]

export default function OnboardingTooltip({ onComplete }: OnboardingTooltipProps) {
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const current = STEPS[step]
  const Icon = current.icon

  return (
    <div className="fixed inset-0 z-[75] pointer-events-none" aria-label="Onboarding walkthrough">
      {/* Semi-transparent backdrop */}
      <div
        className="absolute inset-0 bg-black/40 pointer-events-auto"
        onClick={handleNext}
      />

      {/* Tooltip card */}
      <div className={`absolute ${current.position} pointer-events-auto max-w-xs w-[280px]`}>
        {/* Arrow indicator */}
        {current.arrowDirection === "up" && (
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-teal-500/80 ml-8 mb-0" />
        )}

        <div className="bg-slate-900/95 backdrop-blur-xl border border-teal-500/30 rounded-2xl p-5 shadow-2xl shadow-teal-500/10">
          {/* Close / Skip */}
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
            aria-label="Skip onboarding"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <Icon className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="text-white font-black text-sm">{current.title}</h3>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-xs leading-relaxed mb-4">{current.description}</p>

          {/* Footer: dots + button */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === step ? "bg-teal-400" : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors"
            >
              {step < STEPS.length - 1 ? "Next" : "Got it!"}
            </button>
          </div>
        </div>

        {/* Arrow for bottom-positioned tooltips */}
        {current.arrowDirection === "down" && (
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-teal-500/80 ml-auto mr-8 mt-0" />
        )}
      </div>
    </div>
  )
}
