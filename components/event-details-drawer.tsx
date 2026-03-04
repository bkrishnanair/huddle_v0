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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { GameEvent } from "@/lib/types"
import { Users, Calendar, Clock, MapPin, Loader2, Share, Trash2, Download, Copy, MessageCircle, AlertTriangle, Info, CalendarPlus, CheckCircle2, Video, Monitor, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import EventChat from "./event-chat"
import { useAuth } from "@/lib/firebase-context"
import { signInAsGuest } from "@/lib/auth"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"
import CreateEventModal from "./create-event-modal"
import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar"
import { ReportModal } from "./modals/report-modal"
import { ShieldAlert, Ban, ImageIcon } from "lucide-react"
import EventGallery from "./events/event-gallery"

const getCategoryIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
    Sports: "⚽", Music: "🎵", Community: "🤝", Learning: "📚",
    "Food & Drink": "🍕", Tech: "💻", "Arts & Culture": "🎨",
    Outdoors: "🌲", default: "📍"
  }
  return icons[category] || icons.default
}

interface EventDetailsDrawerProps {
  event: GameEvent
  isOpen: boolean
  onClose: () => void
  onEventUpdated: (event: GameEvent) => void
}

export default function EventDetailsDrawer({ event: initialEvent, isOpen, onClose, onEventUpdated }: EventDetailsDrawerProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [event, setEvent] = useState<GameEvent | null>(initialEvent)
  const [isLoading, setIsLoading] = useState(false)
  const [attendees, setAttendees] = useState<{ id: string, name: string, loyaltyCount?: number, note?: string, reliabilityScore?: number | null }[]>([])
  const [isFetchingAttendees, setIsFetchingAttendees] = useState(false)
  const [isCloning, setIsCloning] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showRsvpPrompt, setShowRsvpPrompt] = useState(false)
  const [guestName, setGuestName] = useState("")
  const [rsvpNote, setRsvpNote] = useState("")
  const [rsvpAnswers, setRsvpAnswers] = useState<Record<string, string>>({})
  const [rsvpPickupId, setRsvpPickupId] = useState("")

  // Reporting State
  const [reportTarget, setReportTarget] = useState<string | null>(null)
  const [reportType, setReportType] = useState<"user" | "event" | "photo">("event")
  const [reportName, setReportName] = useState("")

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
  }, [isOpen, isOrganizer, event?.id, user, event?.players]); // Re-fetch if players array modifies

  // Real-time Event Snapshot syncing!
  useEffect(() => {
    if (!initialEvent?.id || !isOpen || !db) return;

    const eventRef = doc(db, "events", initialEvent.id);
    const unsubscribe = onSnapshot(eventRef, (docSnap) => {
      if (docSnap.exists()) {
        const freshData = { id: docSnap.id, ...docSnap.data() } as GameEvent;
        setEvent(freshData);
        onEventUpdated(freshData); // Keep parent map view perfectly synced too
      }
    });

    return () => unsubscribe();
  }, [initialEvent?.id, isOpen]);

  const downloadCSV = () => {
    if (!attendees.length) {
      toast.error("No attendees to export.");
      return;
    }

    const questions = event?.questions || [];
    const hasPickup = !!(event?.pickupPoints?.length);

    const headers = ["Name", "Note", "Checked In"];
    if (hasPickup) headers.push("Pickup Point");
    questions.forEach(q => headers.push(q));

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + attendees.map(a => {
        const row = [
          `"${a.name.replace(/"/g, '""')}"`,
          `"${(a.note || "").replace(/"/g, '""')}"`,
          `"${event?.checkIns?.[a.id] ? "Yes" : "No"}"`
        ];

        if (hasPickup) {
          const pickupId = event?.attendeePickup?.[a.id];
          const pickupObj = event?.pickupPoints?.find(p => p.id === pickupId);
          row.push(`"${pickupObj ? `${pickupObj.location} @ ${pickupObj.time}` : 'None'}"`);
        }

        questions.forEach(q => {
          const ans = event?.attendeeAnswers?.[a.id]?.[q] || "";
          row.push(`"${ans}"`);
        });

        return row.join(",");
      }).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${event?.title || 'event'}_roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  const handleShare = async () => {
    if (!event) return;
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
      if (!event) return;
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

  const handleEndEvent = async () => {
    if (!confirm("Are you sure you want to end this event? It will be moved to past events for everyone.")) return;
    setIsLoading(true);

    try {
      const idToken = await user?.getIdToken();
      if (!event) return;

      const response = await fetch(`/api/events/${event.id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ status: "past" }),
        credentials: "include"
      });

      if (response.ok) {
        toast.success("Event ended successfully");
        const { event: updatedEvent } = await response.json();
        onEventUpdated(updatedEvent);
        setEvent(updatedEvent);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to end event");
      }
    } catch (error) {
      console.error("End event error:", error);
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

  const handleRemoveAttendee = async (targetUserId: string) => {
    if (!event) return;
    if (!confirm("Remove this attendee? This will automatically promote the next person on the waitlist.")) return;
    setIsLoading(true);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch(`/api/events/${event.id}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ action: "remove", targetUserId }),
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        onEventUpdated(data.event);
        setAttendees(prev => prev.filter(a => a.id !== targetUserId));
        toast.success("Attendee removed.");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to remove attendee.");
      }
    } catch (err) {
      toast.error("Unexpected error removing attendee.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (targetUserId: string, currentStatus: boolean) => {
    if (!event) return;
    setIsLoading(true);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch(`/api/events/${event.id}/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ action: "organizer_check_in", targetUserId, status: !currentStatus }),
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        onEventUpdated(data.event);
        toast.success(`Attendee ${!currentStatus ? 'checked in' : 'unchecked'}.`);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update check-in status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error saving check-in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockAttendee = async (targetUserId: string, targetName: string) => {
    if (!event) return;
    if (!confirm(`Are you sure you want to block ${targetName}? They will not be able to join any of your future events.`)) return;
    setIsLoading(true);

    try {
      const idToken = await user?.getIdToken();
      const response = await fetch(`/api/users/block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ targetUserId, block: true }),
        credentials: "include"
      });

      if (response.ok) {
        toast.success(`Blocked ${targetName}.`);
        // Provide immediate visual feedback by removing them from this event too
        await handleRemoveAttendee(targetUserId);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to block user.");
      }
    } catch (err) {
      toast.error("Unexpected error blocking user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCheckInOpen = async () => {
    if (!event) return;
    setIsLoading(true);
    try {
      const idToken = await user?.getIdToken();
      const newStatus = !event.checkInOpen;
      const response = await fetch(`/api/events/${event.id}/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ action: newStatus ? "open" : "close" }),
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        onEventUpdated(data.event);
        toast.success(`Check-in is now ${newStatus ? 'open' : 'closed'}.`);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update check-in status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error updating check-in state.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelfCheckIn = async () => {
    if (!event) return;
    setIsLoading(true);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch(`/api/events/${event.id}/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ action: "self_check_in" }),
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        onEventUpdated(data.event);
        toast.success("Successfully checked in! 🎉");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to check in.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error during check-in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRSVPClick = () => {
    if (loading) return;
    if (!user || (!hasJoined && !isWaitlisted)) {
      // Open the prompt for both guests and logged-in users who are joining
      setShowRsvpPrompt(true)
    } else {
      // Direct leave action
      executeRSVP("leave", "")
    }
  }

  const executeRSVP = async (action: "join" | "leave", note: string, guestNameOverride?: string) => {
    setIsLoading(true)
    setShowRsvpPrompt(false)

    try {
      let activeUser = user;

      // Handle Guest Sign In natively within the RSVP flow!
      if (!activeUser && action === "join") {
        if (!guestNameOverride) {
          toast.error("Please provide a name so the organizer knows who you are.");
          setIsLoading(false);
          return;
        }
        activeUser = await signInAsGuest(guestNameOverride);
        if (!activeUser) throw new Error("Guest initialization failed");
      }

      if (!activeUser) throw new Error("No active user session");

      const idToken = await activeUser.getIdToken()
      if (!event) return;
      const response = await fetch(`/api/events/${event.id}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ action, note, answers: rsvpAnswers, pickupPointId: rsvpPickupId }),
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
    if (!user) return "Join Game"
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
      <DrawerContent className="glass-surface border-white/15 text-foreground max-w-2xl mx-auto rounded-t-[2rem] max-h-[80vh] flex flex-col focus:outline-none">
        <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-white/20 shrink-0" />
        <DrawerHeader className="pb-2 pt-2 shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <DrawerTitle className="text-2xl font-black text-white tracking-tight leading-tight flex items-center gap-2">
                <span>{event.icon || getCategoryIcon(event.sport || event.category)}</span>
                {event.title}
                {event.maxPlayers - event.currentPlayers > 0 && event.maxPlayers - event.currentPlayers <= 3 && (
                  <span className="bg-red-500 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    <AlertTriangle className="w-3 h-3" />
                    Limited Seating!
                  </span>
                )}
              </DrawerTitle>
              <DrawerDescription className="flex items-center gap-2 mt-1">
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">{event.sport}</span>
                {(event.eventType === 'virtual' || event.eventType === 'hybrid') && (
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${event.eventType === 'virtual'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/20'
                    : 'bg-violet-500/20 text-violet-400 border-violet-500/20'
                    }`}>
                    {event.eventType === 'virtual' ? '🖥️ Virtual' : '📡 Hybrid'}
                  </span>
                )}
                <span className="text-slate-500 text-xs font-medium">by {event.organizerName}</span>
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <Tabs defaultValue="details" className="flex-1 w-full h-full flex flex-col min-h-0 overflow-hidden">
          <div className="px-5 mb-3">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-white/5 rounded-xl p-1 h-10">
              <TabsTrigger value="details" className="text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs font-bold transition-all rounded-lg">Details</TabsTrigger>
              <TabsTrigger
                value="chat"
                disabled={!user || (!hasJoined && !isOrganizer)}
                className="text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs font-bold transition-all rounded-lg flex items-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs font-bold transition-all rounded-lg flex items-center gap-2"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Gallery
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details" className="flex-1 h-full overflow-y-auto outline-none pb-4 mt-0 data-[state=inactive]:hidden">
            <div className="px-5 space-y-4">
              {/* Info Grid - Modern Compact */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Users, label: "Capacity", value: `${event.currentPlayers} / ${event.maxPlayers}` },
                  { icon: Calendar, label: "Date", value: event.date.includes('/') ? event.date : format(parseISO(event.date), 'MMM d, yyyy') },
                  { icon: Clock, label: "Time", value: event.endTime ? `${event.time} - ${event.endTime}` : event.time },
                  ...(event.eventType === 'virtual'
                    ? [{ icon: Monitor, label: "Location", value: event.location || '🖥️ Virtual Event' }]
                    : [{ icon: MapPin, label: "Location", value: typeof event.location === 'string' ? event.location : 'Unavailable' }]
                  )
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest leading-none mb-1">{item.label}</p>
                      {item.label === "Location" && event.eventType !== 'virtual' ? (
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.value)}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 truncate block hover:underline">
                          {item.value} ↗
                        </a>
                      ) : (
                        <p className="text-xs font-bold text-slate-200 truncate">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Join Meeting Button — Virtual/Hybrid events, RSVP'd users only */}
              {(event.eventType === 'virtual' || event.eventType === 'hybrid') && event.virtualLink && (hasJoined || isOrganizer) && (
                <a
                  href={event.virtualLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${event.virtualLink.includes('zoom') ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                    : event.virtualLink.includes('meet.google') ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/30'
                    }`}
                >
                  <Video className="w-4 h-4" />
                  Join Meeting
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {(event.eventType === 'virtual' || event.eventType === 'hybrid') && event.virtualLink && !hasJoined && !isOrganizer && (
                <div className="flex items-center justify-center bg-slate-800/50 text-slate-400 py-3 rounded-xl border border-white/5">
                  <Video className="w-4 h-4 mr-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">RSVP to access meeting link</span>
                </div>
              )}

              {/* Hybrid: show both meeting and map link info */}
              {event.eventType === 'hybrid' && event.virtualLink && (
                <div className="bg-violet-900/20 p-3 rounded-xl border border-violet-500/20 flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-violet-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] text-violet-400 uppercase font-black tracking-widest leading-none mb-1">Virtual Link Available</p>
                    <p className="text-xs font-medium text-violet-200 truncate">This event has both in-person and virtual options</p>
                  </div>
                </div>
              )}

              {/* Add to Calendar Sync */}
              {(hasJoined || isOrganizer) && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-[10px] font-bold text-slate-300"
                    onClick={() => window.open(generateGoogleCalendarUrl(event), '_blank')}
                  >
                    <CalendarPlus className="w-3.5 h-3.5 mr-2 text-blue-400" />
                    Google Calendar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-[10px] font-bold text-slate-300"
                    onClick={() => downloadIcsFile(event)}
                  >
                    Apple / Outlook (.ics)
                  </Button>
                </div>
              )}

              {/* Capacity Meter */}
              <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Spots Filled</span>
                  <span className={isFull ? "text-amber-500" : "text-primary"}>
                    {isFull ? "Event Full (Waitlist Open)" : `${event.maxPlayers - event.currentPlayers} Spots Left`}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-amber-500' : 'bg-primary'}`}
                    style={{ width: `${Math.min((event.currentPlayers / event.maxPlayers) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Event Logistics block */}
              {(event.stayUntil || event.transitTips) && (
                <div className="bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/20 space-y-3">
                  {event.stayUntil && (
                    <div>
                      <p className="text-[9px] text-indigo-400 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Stay Until</p>
                      <p className="text-sm font-medium text-indigo-100">{event.stayUntil}</p>
                    </div>
                  )}
                  {event.transitTips && (
                    <div>
                      <p className="text-[9px] text-indigo-400 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><Info className="w-3 h-3" /> Transit Tips</p>
                      <p className="text-sm font-medium text-indigo-100">{event.transitTips}</p>
                    </div>
                  )}
                </div>
              )}

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
                <div className="space-y-3 pt-4 border-t border-white/5 mt-4">
                  {/* Logistics Summary */}
                  {(!!event.questions?.length || !!event.pickupPoints?.length) && attendees.length > 0 && (
                    <div className="bg-white/5 rounded-xl border border-white/5 p-3 mb-4 space-y-3">
                      <h3 className="font-black text-[10px] uppercase tracking-widest text-emerald-400">Logistics Summary</h3>

                      {event.questions?.map(q => {
                        const yesCount = attendees.filter(a => event?.attendeeAnswers?.[a.id]?.[q] === "Yes").length;
                        return (
                          <div key={q} className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">{q} (Yes)</span>
                            <span className="font-bold text-slate-200">{yesCount}</span>
                          </div>
                        )
                      })}

                      {event.pickupPoints && event.pickupPoints.length > 0 && (
                        <div className="pt-2 border-t border-white/5 space-y-2">
                          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pickup Headcounts</p>
                          {event.pickupPoints.map(pt => {
                            const count = attendees.filter(a => event?.attendeePickup?.[a.id] === pt.id).length;
                            return (
                              <div key={pt.id} className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">{pt.location} @ {pt.time}</span>
                                <span className="font-bold text-slate-200">{count}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between px-1">
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-primary/80 flex items-center gap-2">
                      Organizer Roster
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={event.checkInOpen ? "destructive" : "default"}
                        size="sm"
                        onClick={handleToggleCheckInOpen}
                        disabled={isLoading}
                        className="h-6 text-[9px] font-black uppercase tracking-wider px-2"
                      >
                        {event.checkInOpen ? "Close Check-In" : "Open Check-In"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={downloadCSV}
                        disabled={isFetchingAttendees || attendees.length === 0}
                        className="h-6 text-[9px] font-black uppercase tracking-wider text-slate-500 hover:text-primary transition-all p-0"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <div className="bg-slate-900/30 rounded-xl border border-white/5 overflow-hidden">
                    <div className="max-h-40 overflow-y-auto no-scrollbar divide-y divide-white/5">
                      {isFetchingAttendees ? (
                        <div className="flex justify-center p-6"><Loader2 className="w-5 h-5 animate-spin text-primary/50" /></div>
                      ) : attendees.length > 0 ? (
                        attendees.map(a => (
                          <div key={a.id} className="flex flex-col px-4 py-2.5 hover:bg-white/5 transition-colors group">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-300">{a.name}</span>
                                {(a.loyaltyCount || 0) >= 2 && (
                                  <span className="text-[8px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-md border border-amber-500/20 font-black uppercase tracking-tighter shadow-sm">
                                    🔥 Tier {a.loyaltyCount}
                                  </span>
                                )}
                                {event?.checkIns?.[a.id] && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                                )}
                              </div>
                              {a.reliabilityScore !== undefined && a.reliabilityScore !== null && (
                                <div className="mt-1 flex items-center">
                                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${a.reliabilityScore < 50 ? 'bg-red-500/20 text-red-500 border-red-500/20' : a.reliabilityScore === 100 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-white/5'}`}>
                                    {a.reliabilityScore}% Show
                                  </span>
                                </div>
                              )}
                              <div className="flex bg-slate-900/50 rounded-lg p-0.5 border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCheckIn(a.id, !!event?.checkIns?.[a.id])}
                                  disabled={isLoading}
                                  className={`h-6 w-6 transition-colors ${event?.checkIns?.[a.id] ? 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 hover:text-emerald-300' : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10'}`}
                                  title={event?.checkIns?.[a.id] ? "Checked In" : "Check In Attendee"}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveAttendee(a.id)}
                                  disabled={isLoading}
                                  className="h-6 w-6 text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                                  title="Remove Attendee"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setReportTarget(a.id);
                                    setReportType("user");
                                    setReportName(a.name);
                                  }}
                                  disabled={isLoading}
                                  className="h-6 w-6 text-slate-500 hover:text-amber-400 hover:bg-amber-400/10"
                                  title="Report Attendee"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleBlockAttendee(a.id, a.name)}
                                  disabled={isLoading}
                                  className="h-6 w-6 text-slate-500 hover:text-red-500 hover:bg-red-500/10"
                                  title="Block User from Future Events"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                            {a.note && (
                              <p className="text-[10px] text-slate-500 italic mt-1 pl-1 border-l-2 border-primary/20">
                                "{a.note}"
                              </p>
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

          <TabsContent value="chat" className="flex-1 min-h-0 flex flex-col overflow-hidden outline-none mt-0 pb-2 data-[state=inactive]:hidden">
            <div className="flex-1 overflow-hidden px-5">
              <div className="h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                <EventChat
                  eventId={event.id as string}
                  organizerId={event.createdBy}
                  pinnedMessage={event.pinnedMessage}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="flex-1 min-h-[40vh] flex flex-col overflow-y-auto no-scrollbar outline-none mt-0 pb-4 data-[state=inactive]:hidden">
            <div className="px-5">
              <EventGallery
                eventId={event.id as string}
                isOrganizer={isOrganizer || false}
                hasJoined={hasJoined || false}
                eventDate={event.date}
              />
            </div>
          </TabsContent>
        </Tabs>
        <DrawerFooter className="flex flex-col gap-2 p-5 pt-3 pb-6 bg-slate-950/20 border-t border-white/5 shrink-0">
          {/* Main Action Button */}
          {!isOrganizer && (
            <div className="flex flex-col gap-2">
              {event.checkInOpen && hasJoined && !event.checkIns?.[user?.uid || ''] && (
                <Button
                  size="lg"
                  onClick={handleSelfCheckIn}
                  disabled={isLoading}
                  className="h-12 rounded-xl text-sm font-black uppercase tracking-widest shadow-[0_0_15px_rgba(52,211,153,0.3)] bg-emerald-500 hover:bg-emerald-400 text-slate-900 transition-all active:scale-95 animate-pulse-subtle"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "I'm Here (Check-In)"}
                </Button>
              )}
              {event.checkIns?.[user?.uid || ''] && hasJoined && (
                <div className="h-12 rounded-xl text-sm font-black flex items-center justify-center gap-2 uppercase tracking-widest border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Checked In
                </div>
              )}
              <Button
                size="lg"
                onClick={handleRSVPClick}
                disabled={isLoading || loading}
                variant={getButtonVariant()}
                className="h-12 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg transition-all active:scale-95"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {getButtonText()}
              </Button>
            </div>
          )}

          {/* Organizer Secondary Actions */}
          {isOrganizer && (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="h-10 bg-white/5 hover:bg-white/10 text-white border-white/10 rounded-xl text-xs font-bold"
                >
                  Edit Event
                </Button>
                <Button
                  onClick={handleEndEvent}
                  disabled={isLoading || event.status === 'past'}
                  className="h-10 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl text-xs font-bold"
                >
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (event.status === 'past' ? "Event Ended" : "End Event")}
                </Button>
              </div>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="h-10 text-xs font-bold rounded-xl w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          )}

          {/* Nav & Share Utility */}
          <div className="grid grid-cols-6 gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setIsCloning(true)}
              className="col-span-2 h-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold"
            >
              <Copy className="mr-2 h-3.5 w-3.5" />
              Clone
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="col-span-2 h-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold"
              title="Share Event"
            >
              <Share className="w-3.5 h-3.5 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setReportTarget(event.id);
                setReportType("event");
                setReportName(event.title || "");
              }}
              className="col-span-1 h-10 rounded-xl border-white/10 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-slate-500"
              title="Report Event"
            >
              <ShieldAlert className="w-4 h-4" />
            </Button>
            <DrawerClose asChild className="col-span-1">
              <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-white/10 hover:bg-white/20 text-white font-bold text-xs tracking-tight">
                Close
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
      {(isCloning || isEditing) && event && (
        <CreateEventModal
          isOpen={isCloning || isEditing}
          onClose={() => {
            setIsCloning(false);
            setIsEditing(false);
          }}
          onEventCreated={(newEvent) => {
            setIsCloning(false);
            setIsEditing(false);
            onEventUpdated(newEvent);
            onClose(); // Close the drawer as well so they see the new pin
          }}
          userLocation={null}
          initialData={event}
          isEditMode={isEditing}
        />
      )}

      {/* RSVP PROMPT MODAL (For Name & Notes) */}
      <Dialog open={showRsvpPrompt} onOpenChange={setShowRsvpPrompt}>
        <DialogContent className="glass-surface border-white/10 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-widest text-white">Join Event</DialogTitle>
            <DialogDescription className="text-slate-400">
              {isWaitlisted || isFull
                ? "This event is currently full. Join the waitlist and we will automatically add you if a spot opens up."
                : "You are about to secure your spot for this event."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto no-scrollbar px-1">
            {/* ONLY show Name input if they are not logged in */}
            {!user && (
              <div className="grid gap-2">
                <Label htmlFor="guestName" className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  Your Name <span className="text-primary">*</span>
                </Label>
                <Input
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g., John Doe"
                  className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500"
                />
                <p className="text-[10px] text-slate-500">We need a name so the organizer knows who is coming.</p>
              </div>
            )}

            {/* Questions from Organizer */}
            {event.questions?.map((q) => (
              <div key={q} className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  {q} <span className="text-primary">*</span>
                </Label>
                <Select
                  value={rsvpAnswers[q] || ""}
                  onValueChange={(val) => setRsvpAnswers(prev => ({ ...prev, [q]: val }))}
                >
                  <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}

            {/* Pickup Points from Organizer */}
            {event.pickupPoints && event.pickupPoints.length > 0 && (
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  Select Pickup Point <span className="text-primary">*</span>
                </Label>
                <Select
                  value={rsvpPickupId}
                  onValueChange={setRsvpPickupId}
                >
                  <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
                    <SelectValue placeholder="Where do you need a ride from?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">I don't need a ride</SelectItem>
                    {event.pickupPoints.map(pt => (
                      <SelectItem key={pt.id} value={pt.id}>{pt.location} @ {pt.time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Show notes for everyone */}
            <div className="grid gap-2">
              <Label htmlFor="rsvpNote" className="text-xs font-bold uppercase tracking-widest text-slate-300">
                Message to Organizer <span className="text-slate-500 font-normal capitalize tracking-normal">(Optional)</span>
              </Label>
              <Textarea
                id="rsvpNote"
                value={rsvpNote}
                onChange={(e) => setRsvpNote(e.target.value)}
                placeholder="e.g., I will be 10 mins late! or I'm bringing an extra ball."
                className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRsvpPrompt(false)} className="border-white/10 bg-white/5 text-white">
              Cancel
            </Button>
            <Button
              onClick={() => executeRSVP("join", rsvpNote, guestName)}
              disabled={
                isLoading ||
                (!user && !guestName.trim()) ||
                (!!event.questions?.length && Object.keys(rsvpAnswers).length !== event.questions.length) ||
                (!!event.pickupPoints?.length && !rsvpPickupId)
              }
              className="bg-primary text-primary-foreground font-bold"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isFull ? "Join Waitlist" : "Confirm RSVP"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REPORT MODAL */}
      <ReportModal
        isOpen={!!reportTarget}
        onClose={() => setReportTarget(null)}
        targetId={reportTarget || ""}
        itemType={reportType}
        targetName={reportName}
      />
    </Drawer>
  )
}
