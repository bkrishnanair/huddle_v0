"use client"

import { useState } from "react"
import { MapPin, Filter, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const STEPS = [
  { title: "Explore the map", description: "Tap a pin to see the time, location, and details. Open an event to join it.", icon: MapPin },
  { title: "Filter events", description: "Filter by category or time. Choose Live to see events happening now.", icon: Filter },
  { title: "Create an event", description: "Use the + button to host a meetup. Sign in, add the details, and publish when you're ready.", icon: Plus },
]

export default function OnboardingTooltip({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const Icon = current.icon

  return (
    <Dialog open onOpenChange={open => { if (!open) onComplete() }}>
      <DialogContent className="sm:max-w-sm">
        <div className="flex items-center gap-3 pr-8">
          <Icon className="h-5 w-5 shrink-0 text-teal-400" aria-hidden="true" />
          <DialogTitle className="font-display">{current.title}</DialogTitle>
        </div>
        <DialogDescription className="text-sm leading-relaxed text-slate-300">{current.description}</DialogDescription>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-slate-400" aria-live="polite">{step + 1} / {STEPS.length}</span>
          <Button onClick={() => step < STEPS.length - 1 ? setStep(step + 1) : onComplete()}>
            {step < STEPS.length - 1 ? "Next" : "Got it"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
