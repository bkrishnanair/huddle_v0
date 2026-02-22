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
import { Users, Calendar, Clock, MapPin, Loader2, Share, Trash2 } from "lucide-react"
import { useFirebase } from "@/lib/firebase-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface EventDetailsDrawerProps {
  event: GameEvent
  isOpen: boolean
  onClose: () => void
  onEventUpdated: (event: GameEvent) => void
}

export default function EventDetailsDrawer({ event, isOpen, onClose, onEventUpdated }: EventDetailsDrawerProps) {
  const { user } = useFirebase()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/map?eventId=${event.id}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Huddle: ${event.title}`,
          text: `Check out this ${event.sport} event on Huddle!`,
          url: shareUrl,
        })
      } catch (err) {
        // user cancelled share, fail silently
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast.success("Link copied to clipboard!")
      } catch (err) {
        toast.error("Failed to copy link")
      }
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    setIsLoading(true);

    try {
      const idToken = await user?.getIdToken();
      const response = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${idToken}`
        }
      });

      if (response.ok) {
        toast.success("Event deleted successfully");
        onClose();
        // Since the event is gone, trigger a map refresh by passing null or handling the update
        onEventUpdated({ ...event, deleted: true } as any);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete event");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  if (!event) return null;

  // Check if current user has joined this event
  const hasJoined = user && event.players?.includes(user.uid)
  const isFull = event.currentPlayers >= event.maxPlayers
  const canJoin = user && !hasJoined && !isFull

  const handleRSVP = async () => {
    if (!user) {
      router.push(`/login?return_to=/map?eventId=${event.id}`)
      return
    }

    const action = hasJoined ? "leave" : "join"
    setIsLoading(true)

    try {
      const idToken = await user.getIdToken()
      const response = await fetch(`/api/events/${event.id}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ action }),
        credentials: "include"
      })

      if (response.ok) {
        const data = await response.json()
        onEventUpdated(data.event)
        toast.success(action === "join" ? "You've joined the game!" : "You've unjoined the game")
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
    if (hasJoined) return "Unjoin"
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
        <DrawerFooter className="flex flex-col gap-2">
          {user && event.createdBy === user.uid ? (
            <Button
              size="lg"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Event
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleRSVP}
              disabled={isLoading || (isFull && !hasJoined && !!user)}
              variant={getButtonVariant()}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getButtonText()}
            </Button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={handleShare}>
              <Share className="w-4 h-4 mr-2" />
              Share Event
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
