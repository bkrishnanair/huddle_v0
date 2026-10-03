"use client"

import { useEffect, useId, useRef, type ReactNode } from "react"
import * as HoverCard from "@radix-ui/react-hover-card"
import { Clock, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GameEvent } from "@/lib/types"
import { formatEventDateForSEO, formatEventTimeForSEO } from "@/lib/datetime"
import { getCategoryColor, isEventLive } from "@/lib/utils"

function PreviewDetails({ event }: { event: GameEvent }) {
  let schedule = "Time to be confirmed"
  try {
    schedule = `${formatEventDateForSEO(event)} · ${formatEventTimeForSEO(event)}`
  } catch { /* Imported events can have incomplete dates. */ }
  const venue = event.location || event.venue
  const location = event.eventType === "virtual" ? "Online" :
    (typeof venue === "string" ? venue : venue?.name || venue?.address)

  return (
    <div className="space-y-2 text-left">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getCategoryColor(event.category) }} aria-hidden="true" />
        <span>{event.category}</span>
        {isEventLive(event) && <span className="font-semibold text-emerald-300">Live now</span>}
      </div>
      <h3 className="line-clamp-2 break-words text-base font-bold text-white">{event.name || event.title}</h3>
      {event.organizerName && <p className="truncate text-xs text-slate-300">Hosted by {event.organizerName}</p>}
      <p className="flex items-start gap-2 text-xs text-slate-200">
        <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="font-mono">{schedule}</span>
      </p>
      {typeof location === "string" && <p className="flex items-start gap-2 text-xs text-slate-200">
        <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="line-clamp-2 break-words">{location}</span>
      </p>}
      {event.description && <p className="line-clamp-2 break-words text-sm leading-relaxed text-slate-300">{event.description}</p>}
      {event.isScraped && event.source !== "claimed" && <p className="text-xs text-slate-400">Imported listing · Check event details for registration.</p>}
    </div>
  )
}

/** Informational hover content; activation still opens the full event on desktop. */
export function MapEventTrigger({ event, children, hoverEnabled, open, onOpenChange, onSelect }: {
  event: GameEvent
  children: ReactNode
  hoverEnabled: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (trigger: HTMLButtonElement) => void
}) {
  const descriptionId = useId()
  const trigger = (
    <button type="button" aria-label={`Preview ${event.name || event.title}`}
      aria-describedby={open ? descriptionId : undefined}
      className="flex min-h-11 min-w-11 items-center justify-center rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      // Radix suppresses touch clicks on its trigger; keep native taps on hybrid devices.
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onSelect(e.currentTarget) }}>
      {children}
    </button>
  )
  if (!hoverEnabled) return trigger
  return (
    <HoverCard.Root open={open} onOpenChange={onOpenChange} openDelay={250} closeDelay={150}>
      <HoverCard.Trigger asChild>
        <span className="inline-flex">{trigger}</span>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content id={descriptionId} side="top" sideOffset={12} collisionPadding={16}
          className="z-40 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border bg-slate-950 p-4 shadow-lg"
          style={{ borderColor: getCategoryColor(event.category) }}>
          <PreviewDetails event={event} />
          <p className="mt-3 text-xs text-slate-400">Click or press Enter on the event for details.</p>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}

export function MapEventPreview({ event, onOpen, onClose }: {
  event: GameEvent
  onOpen: () => void
  onClose: () => void
}) {
  const openButton = useRef<HTMLButtonElement>(null)
  useEffect(() => { openButton.current?.focus({ preventScroll: true }) }, [event.id])
  return (
    <section aria-label="Event preview" onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); onClose() } }}
      className="relative max-h-[45dvh] overflow-y-auto overscroll-contain rounded-2xl border bg-slate-950 p-4 shadow-lg"
      style={{ borderColor: getCategoryColor(event.category) }}>
      <div className="pr-10"><PreviewDetails event={event} /></div>
      <button type="button" aria-label="Close event preview" onClick={onClose}
        className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-xl text-slate-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-white">
        <X className="h-5 w-5" />
      </button>
      <Button ref={openButton} type="button" className="mt-3 min-h-11 w-full rounded-xl" onClick={onOpen}>View details</Button>
    </section>
  )
}
