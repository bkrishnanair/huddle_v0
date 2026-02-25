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
import { Users, Calendar, Clock, MapPin, Loader2, Share, Trash2, Download, Copy, MessageCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventChat from "./event-chat"
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
      <DrawerContent className="glass-surface border-white/15 text-foreground max-w-2xl mx-auto rounded-t-[2rem]">
        <DrawerHeader className="pb-2">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <DrawerTitle className="text-2xl font-black text-white tracking-tight leading-tight">
                {event.title}
              </DrawerTitle>
              <DrawerDescription className="flex items-center gap-2 mt-1">
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">{event.sport}</span>
                <span className="text-slate-500 text-xs font-medium">by {event.organizerName}</span>
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <Tabs defaultValue="details" className="w-full flex-1 flex flex-col min-h-0">
          <div className="px-5 mb-3">
            <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-white/5 rounded-xl p-1 h-10">
              <TabsTrigger value="details" className="text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs font-bold transition-all rounded-lg">Details</TabsTrigger>
              <TabsTrigger
                value="chat"
                disabled={!user || (!hasJoined && !isOrganizer)}
                className="text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs font-bold transition-all rounded-lg flex items-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Discussion
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details" className="flex-1 overflow-y-auto no-scrollbar pb-4 mt-0">
            <div className="px-5 space-y-4">
              {/* Info Grid - Modern Compact */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Users, label: "Capacity", value: `${event.currentPlayers} / ${event.maxPlayers}` },
                  { icon: Calendar, label: "Date", value: event.date.includes('/') ? event.date : format(parseISO(event.date), 'MMM d, yyyy') },
                  { icon: Clock, label: "Time", value: event.time },
                  { icon: MapPin, label: "Location", value: typeof event.location === 'string' ? event.location : 'Unavailable' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest leading-none mb-1">{item.label}</p>
                      <p className="text-xs font-bold text-slate-200 truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {event.description && (
                <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary/40 transition-colors" />
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-2 px-1">About this event</p>
                  <span className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed block px-1">{event.description}</span>
                </div>
              )}

              {isWaitlisted && (
                <div className="flex items-center justify-center bg-amber-500/10 text-amber-500 py-3 rounded-xl border border-amber-500/20">
                  <span className="text-[10px] font-black uppercase tracking-widest">🕒 On Waitlist</span>
                </div>
              )}

              {isOrganizer && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-primary/80 flex items-center gap-2">
                      Organizer Roster
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={downloadCSV}
                      disabled={isFetchingAttendees || attendees.length === 0}
                      className="h-6 text-[9px] font-black uppercase tracking-wider text-slate-500 hover:text-primary transition-all p-0"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Export CSV
                    </Button>
                  </div>

                  <div className="bg-slate-900/30 rounded-xl border border-white/5 overflow-hidden">
                    <div className="max-h-40 overflow-y-auto no-scrollbar divide-y divide-white/5">
                      {isFetchingAttendees ? (
                        <div className="flex justify-center p-6"><Loader2 className="w-5 h-5 animate-spin text-primary/50" /></div>
                      ) : attendees.length > 0 ? (
                        attendees.map(a => (
                          <div key={a.id} className="flex justify-between items-center px-4 py-2.5 hover:bg-white/5 transition-colors">
                            <span className="text-xs font-bold text-slate-300">{a.name}</span>
                            {(a.loyaltyCount || 0) >= 2 && (
                              <span className="text-[8px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-md border border-amber-500/20 font-black uppercase tracking-tighter shadow-sm">
                                🔥 Tier {a.loyaltyCount}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs font-bold text-slate-600 text-center py-6 italic">Waiting for attendees...</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 flex flex-col min-h-[300px] h-full mt-0 pb-2">
            <div className="flex-1 overflow-hidden px-5">
              <div className="h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                <EventChat eventId={event.id as string} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DrawerFooter className="flex flex-col gap-2 p-5 pt-1 bg-slate-950/20 border-t border-white/5">
          {/* Main Action Button */}
          {!isOrganizer && (
            <Button
              size="lg"
              onClick={handleRSVP}
              disabled={isLoading}
              variant={getButtonVariant()}
              className="h-12 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg transition-all active:scale-95"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getButtonText()}
            </Button>
          )}

          {/* Organizer Secondary Actions */}
          {isOrganizer && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCloning(true)}
                className="h-10 bg-white/5 hover:bg-white/10 text-white border-white/10 rounded-xl text-xs font-bold"
              >
                <Copy className="mr-2 h-3.5 w-3.5" />
                Duplicate
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="h-10 text-xs font-bold rounded-xl"
              >
                {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          )}

          {/* Nav & Share Utility */}
          <div className="grid grid-cols-6 gap-2">
            <Button
              variant="outline"
              onClick={handleShare}
              className="col-span-1 h-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
            >
              <Share className="w-4 h-4" />
            </Button>
            <DrawerClose asChild className="col-span-5">
              <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-white/10 hover:bg-white/20 text-white font-bold text-xs tracking-tight">
                Close
              </Button>
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
