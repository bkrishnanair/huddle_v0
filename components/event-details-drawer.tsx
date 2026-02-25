"use client"

import { useState, useEffect } from "react"
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
import { Users, Calendar, Clock, MapPin, Loader2, Share, Trash2, Download, Copy } from "lucide-react"
import { useFirebase } from "@/lib/firebase-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"
import CreateEventModal from "./create-event-modal"

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
  const [attendees, setAttendees] = useState<{ id: string, name: string, loyaltyCount?: number }[]>([])
  const [isFetchingAttendees, setIsFetchingAttendees] = useState(false)
  const [isCloning, setIsCloning] = useState(false)

  const isOrganizer = user && event?.createdBy === user.uid

  useEffect(() => {
    const fetchAttendees = async () => {
      if (!isOpen || !isOrganizer || !event?.id) return;
      setIsFetchingAttendees(true);
      try {
        const idToken = await user.getIdToken();
        const response = await fetch(`/api/events/${event.id}/attendees`, {
          headers: {
            "Authorization": `Bearer ${idToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAttendees(data.attendees || []);
        }
      } catch (error) {
        console.error("Failed to fetch attendees:", error);
      } finally {
        setIsFetchingAttendees(false);
      }
    };

    fetchAttendees();
  }, [isOpen, isOrganizer, event?.id, user]);

  const downloadCSV = () => {
    if (!attendees.length) {
      toast.error("No attendees to export.");
      return;
    }
    const headers = ["Name"];
    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + attendees.map(a => `"${a.name.replace(/"/g, '""')}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${event.title || 'event'}_roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


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
  const isWaitlisted = user && event.waitlist?.includes(user.uid)
  const isFull = event.currentPlayers >= event.maxPlayers
  const canJoin = user && (!hasJoined && !isWaitlisted)

  const handleRSVP = async () => {
    if (!user) {
      router.push(`/login?return_to=/map?eventId=${event.id}`)
      return
    }

    const action = hasJoined || isWaitlisted ? "leave" : "join"
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

        let msg = "Success!";
        if (action === "join") {
          msg = isFull ? "You've joined the waitlist!" : "You've joined the game!";
        } else {
          msg = isWaitlisted ? "You left the waitlist" : "You've unjoined the game";
        }
        toast.success(msg)
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
    if (isLoading) {
      if (hasJoined) return "Leaving..."
      if (isWaitlisted) return "Leaving Waitlist..."
      if (isFull) return "Joining Waitlist..."
      return "Joining..."
    }
    if (!user) return "Sign In to Join"
    if (hasJoined) return "Unjoin"
    if (isWaitlisted) return "Leave Waitlist"
    if (isFull) return "Join Waitlist"
    return "Join Game"
  }

  const getButtonVariant = () => {
    if (hasJoined || isWaitlisted) return "destructive" as const
    if (isFull && !user) return "secondary" as const
    if (isFull && !hasJoined && !isWaitlisted) return "secondary" as const
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
            <span>{event.currentPlayers} / {event.maxPlayers} attendees</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{event.date.includes('/') ? event.date : format(parseISO(event.date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 shrink-0" />
            <span className="truncate">{typeof event.location === 'string' ? event.location : 'Location unavailable'}</span>
          </div>
          {event.description && (
            <div className="flex items-start bg-slate-800/50 p-3 rounded-lg mt-2">
              <span className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{event.description}</span>
            </div>
          )}

          {isWaitlisted && (
            <div className="flex items-center justify-center bg-amber-500/10 text-amber-500 p-3 rounded-lg border border-amber-500/20 mt-2">
              <span className="text-sm font-semibold">🕒 You are on the waitlist</span>
            </div>
          )}

          {isOrganizer && (
            <div className="mt-6 p-4 rounded-xl glass-surface border border-primary/20 bg-primary/5 space-y-3">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                Organizer Panel
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-300">Attendee Roster</span>
                  <Button variant="outline" size="sm" onClick={downloadCSV} disabled={isFetchingAttendees || attendees.length === 0} className="h-8 text-xs border-primary/30 hover:bg-primary/20">
                    <Download className="w-3 h-3 mr-2" />
                    Export CSV
                  </Button>
                </div>

                <div className="bg-slate-900/60 rounded-lg p-2 max-h-32 overflow-y-auto no-scrollbar border border-white/5">
                  {isFetchingAttendees ? (
                    <div className="flex justify-center p-2"><Loader2 className="w-4 h-4 animate-spin text-slate-400" /></div>
                  ) : attendees.length > 0 ? (
                    <ul className="space-y-1">
                      {attendees.map(a => (
                        <li key={a.id} className="text-sm text-slate-300 px-2 py-1 rounded bg-white/5 truncate flex justify-between items-center">
                          <span>{a.name}</span>
                          {(a.loyaltyCount || 0) >= 2 && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold ml-2">
                              🔥 Repeat Attendee (x{a.loyaltyCount})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-2">No one has joined yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <DrawerFooter className="flex flex-col gap-2">
          {isOrganizer ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsCloning(true)}
                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              onClick={handleRSVP}
              disabled={isLoading}
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
      {isCloning && (
        <CreateEventModal
          isOpen={isCloning}
          onClose={() => setIsCloning(false)}
          onEventCreated={(newEvent) => {
            setIsCloning(false);
            onEventUpdated(newEvent);
            onClose(); // Close the drawer as well so they see the new pin
          }}
          userLocation={null}
          initialData={event}
        />
      )}
    </Drawer>
  )
}
