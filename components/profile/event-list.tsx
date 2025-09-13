"use client"

import { useEffect, useState } from "react"
import { HuddleEvent } from "@/lib/types"
import { EventCard } from "@/components/events/event-card"
import { Loader2, AlertCircle } from "lucide-react"

interface EventListProps {
  userId: string
  eventType: "organized" | "participated"
}

export function EventList({ userId, eventType }: EventListProps) {
  const [events, setEvents] = useState<HuddleEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/users/${userId}/events?type=${eventType}`, { credentials: 'include' });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch events with status: ${response.status}`)
        }

        const data = await response.json()
        setEvents(data.events)
      } catch (err) {
        console.error(`Error fetching ${eventType} events:`, err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchEvents()
    }
  }, [userId, eventType])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center glass-surface rounded-lg p-4">
        <AlertCircle className="w-10 h-10 text-destructive mb-3" />
        <p className="font-semibold text-lg mb-1">Could not load events</p>
        <p className="text-sm text-slate-400">{error}</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 glass-surface rounded-lg p-4">
        <p className="text-slate-400">
          {eventType === "organized"
            ? "You haven't organized any events yet."
            : "You haven't joined any events yet."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          onSelectEvent={() => {}} // FIX: Provide the required onSelectEvent prop
        />
      ))}
    </div>
  )
}
