"use client"

import { useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { GameEvent } from "@/lib/types"
import { Users, Calendar, Clock, MapPin, Loader2 } from "lucide-react"
import { useFirebase } from "@/lib/firebase-context"
import { toast } from "sonner"

interface EventDetailsDrawerProps {
  event: GameEvent
  isOpen: boolean
  onClose: () => void
  onEventUpdated: (event: GameEvent) => void
}

export default function EventDetailsDrawer({ event, isOpen, onClose, onEventUpdated }: EventDetailsDrawerProps) {
  const { user } = useFirebase()
  const [isLoading, setIsLoading] = useState(false)

  if (!event) return null;

  // Check if current user has joined this event
  const hasJoined = user && event.players?.includes(user.uid)
  const isFull = event.currentPlayers >= event.maxPlayers
  const canJoin = user && !hasJoined && !isFull

  const handleRSVP = async () => {
    if (!user) {
      toast.error("Please sign in to join events")
      return
    }

    const action = hasJoined ? "leave" : "join"
    setIsLoading(true)

    try {
      const response = await fetch(`/api/events/${event.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
        credentials: "include"
      })

      if (response.ok) {
        const data = await response.json()
        onEventUpdated(data.event)
        toast.success(action === "join" ? "You've joined the game!" : "You've left the game")
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to update RSVP")
      }
    } catch (error) {
      console.error("RSVP error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    if (isLoading) return hasJoined ? "Leaving..." : "Joining..."
    if (!user) return "Sign In to Join"
    if (hasJoined) return "Leave Game"
    if (isFull) return "Event Full"
    return "Join Game"
  }

  const getButtonVariant = () => {
    if (hasJoined) return "destructive" as const
    return "default" as const
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="glass-surface border-white/15 text-foreground">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold">{event.title}</DrawerTitle>
          <DrawerDescription>
            {event.sport} • Organized by {event.organizerName}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 space-y-4">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            <span>{event.currentPlayers} / {event.maxPlayers} players</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{typeof event.location === 'string' ? event.location : 'Location unavailable'}</span>
          </div>
        </div>
        <DrawerFooter>
          <Button 
            size="lg" 
            onClick={handleRSVP}
            disabled={isLoading || (!user && true) || (isFull && !hasJoined)}
            variant={getButtonVariant()}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {getButtonText()}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
