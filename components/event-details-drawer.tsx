"use client"

import { useState, useEffect, useRef } from "react"
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
import { Users, Calendar, Clock, MapPin, Loader2, Share, Trash2, Download, Copy, MessageCircle, AlertTriangle, Info, CalendarPlus, CheckCircle2, Video, Monitor, ExternalLink, Crown, Mail, BadgeCheck } from "lucide-react"
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
import { FollowButton } from "@/components/follow-button"
import { getEventStartUTC, formatEventTimeRange } from "@/lib/datetime"
import { trackFunnelEvent } from "@/lib/analytics"
import { isEventLive } from "@/lib/utils"

function EventCountdown({ date, time, timezone }: { date: string; time: string; timezone?: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    function compute() {
      try {
        // Use timezone-aware UTC conversion for accurate countdowns
        const event = { date, time, timezone } as any;
        const startUTC = getEventStartUTC(event);
        const msUntil = startUTC.getTime() - Date.now();
        if (msUntil <= 0) { setLabel(""); return; }
        const totalMins = Math.floor(msUntil / 60000);
        const h = Math.floor(totalMins / 60);
        const m = totalMins % 60;
        setLabel(h > 0 ? `Starts in ${h}h ${m}m` : `Starts in ${m}m`);
      } catch { setLabel(""); }
    }
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, [date, time, timezone]);

  if (!label) return null;
  return (
    <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3 flex items-center justify-center gap-2">
      <span className="text-teal-400 text-sm font-black">⏱ {label}</span>
    </div>
  );
}

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
  const [attendees, setAttendees] = useState<{ id: string, name: string, loyaltyCount?: number, note?: string, answers?: Record<string, string>, pickup?: string, reliabilityScore?: number | null }[]>([])
  const [isFetchingAttendees, setIsFetchingAttendees] = useState(false)
  const [isCloning, setIsCloning] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [showRsvpPrompt, setShowRsvpPrompt] = useState(false)
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [shareContact, setShareContact] = useState(false)
  const [rsvpNote, setRsvpNote] = useState("")
  const [rsvpAnswers, setRsvpAnswers] = useState<Record<string, string>>({})
  const [rsvpPickupId, setRsvpPickupId] = useState("")

  // Reporting State
  const [reportTarget, setReportTarget] = useState<string | null>(null)
  const [reportType, setReportType] = useState<"user" | "event" | "photo">("event")
  const [reportName, setReportName] = useState("")

  const isOrganizer = user && event?.createdBy === user.uid

  // Track view once per session per event (no auth required)
  const viewedEvents = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (isOpen && initialEvent?.id && !viewedEvents.current.has(initialEvent.id)) {
      viewedEvents.current.add(initialEvent.id);
      fetch(`/api/events/${initialEvent.id}/view`, { method: 'POST' }).catch(() => {});
      trackFunnelEvent({
        name: 'event_open',
        properties: {
          eventId: initialEvent.id,
          category: initialEvent.category,
          isVirtual: initialEvent.eventType === 'virtual' || initialEvent.eventType === 'hybrid',
        },
      });
    }
  }, [isOpen, initialEvent?.id, initialEvent?.category, initialEvent?.eventType]);

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
          const pickupId = a.pickup;
          const pickupObj = event?.pickupPoints?.find(p => p.id === pickupId);
          row.push(`"${pickupObj ? `${pickupObj.location} @ ${pickupObj.time}` : 'None'}"`);
        }

        questions.forEach(q => {
          const ans = a.answers?.[q] || "";
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

    // Always attempt clipboard copy first
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied!")
    } catch (err) {
      console.error("Clipboard copy failed", err)
    }

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
        trackFunnelEvent({
          name: 'check_in',
          properties: { eventId: event.id },
        });
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
    if (event?.id) {
      trackFunnelEvent({
        name: 'rsvp_click',
        properties: {
          eventId: event.id,
          category: event.category,
          isFull,
        },
      });
    }
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
        body: JSON.stringify({ action, note, answers: rsvpAnswers, pickupPointId: rsvpPickupId, guestContactEmail: shareContact ? guestEmail : undefined, guestContactShared: shareContact }),
        credentials: "include"
      })

      if (response.ok) {
        const data = await response.json()
        onEventUpdated(data.event)

        trackFunnelEvent({
          name: 'rsvp_success',
          properties: {
            eventId: event.id,
            action,
          },
        });

        if (action === "join") {
          window.dispatchEvent(new CustomEvent("huddle:rsvp"))
        }

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
    if (!user) return "Join Event"
    if (hasJoined) return "Unjoin"
    if (isWaitlisted) return "Leave Waitlist"
    if (isFull) return "Join Waitlist"
    return "Join Event"
  }

  const getButtonVariant = () => {
    if (hasJoined || isWaitlisted) return "destructive" as const
    if (isFull && !user) return "secondary" as const
    if (isFull && !hasJoined && !isWaitlisted) return "secondary" as const
    return "default" as const
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-paper border-line text-ink mx-auto max-w-2xl rounded-t-sheet max-h-[85vh] flex flex-col focus:outline-none shadow-overlay">
        <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-line-strong shrink-0" />
        
        {/* Title/Status */}
        <DrawerHeader className="pb-4 pt-3 shrink-0 text-left">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono tracking-mono text-ink-2 uppercase">{event.category}</span>
                {event.maxPlayers - event.currentPlayers > 0 && event.maxPlayers - event.currentPlayers <= 3 && (
                  <span className="bg-surface-sunk text-ink px-2 py-0.5 rounded-chip border border-line text-[10px] font-mono tracking-mono uppercase">
                    Limited Seating
                  </span>
                )}
                {isEventLive(event) && (
                  <span className="bg-live-tint text-live-ink border border-live/20 px-2 py-0.5 rounded-chip text-[10px] font-mono tracking-mono uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" /> Live Now
                  </span>
                )}
              </div>
              <DrawerTitle className="text-2xl font-bold font-body text-ink tracking-tight leading-tight">
                {event.title}
              </DrawerTitle>
            </div>
          </div>
        </DrawerHeader>

        <Tabs defaultValue="details" className="flex-1 w-full h-full flex flex-col min-h-0 overflow-hidden">
          {/* We only show tabs if user is organizer, else we just render the details */}
          {isOrganizer && (
            <div className="px-5 mb-3">
              <TabsList className="grid w-full grid-cols-2 bg-surface-sunk border border-line rounded-control p-1 h-10">
                <TabsTrigger value="details" className="text-ink-2 data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-raised text-xs font-bold transition-all rounded-chip">Details</TabsTrigger>
                <TabsTrigger value="roster" className="text-ink-2 data-[state=active]:bg-paper data-[state=active]:text-ink data-[state=active]:shadow-raised text-xs font-bold transition-all rounded-chip flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Organizer Tools
                </TabsTrigger>
              </TabsList>
            </div>
          )}

          <TabsContent value="details" className="flex-1 h-full overflow-y-auto outline-none pb-4 mt-0 data-[state=inactive]:hidden">
            <div className="px-5 space-y-6">
              
              {/* Mono Logistics Block */}
              <div className="bg-surface border border-line rounded-control p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-ink-3 shrink-0" strokeWidth={1.5} />
                  <span className="font-mono text-sm text-ink font-medium">{(() => {
                    if (!event.date) return 'TBD';
                    if (typeof event.date !== 'string') return String(event.date);
                    if (event.date.includes('/')) return event.date;
                    try { return format(parseISO(event.date), 'MMM d, yyyy'); } catch(e) { return event.date; }
                  })()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-ink-3 shrink-0" strokeWidth={1.5} />
                  <span className="font-mono text-sm text-ink font-medium">{formatEventTimeRange(event)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-ink-3 shrink-0" strokeWidth={1.5} />
                  <span className="font-mono text-sm text-ink font-medium truncate block">{typeof event.location === 'string' ? event.location : 'Unavailable'}</span>
                </div>
              </div>

              {/* Host Trust Block */}
              <div className="flex items-center justify-between border-b border-line pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-deep border border-line flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4 text-ink-3" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-ink-3 font-mono tracking-mono uppercase mb-0.5">Organized by</span>
                    <span className="font-bold text-sm text-ink flex items-center gap-1">
                      {event.organizerName} {event.isOrganizerVerified && <BadgeCheck className="w-3.5 h-3.5 text-action" strokeWidth={1.5} />}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attendance */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-2xl font-bold text-ink">
                    {event.currentPlayers}<span className="text-ink-3">/{event.maxPlayers}</span>
                  </span>
                  <span className="text-[10px] font-mono tracking-mono text-ink-3 uppercase">Going</span>
                </div>
                <div className="flex -space-x-2">
                  {/* Avatar stack visual */}
                  {[...Array(Math.min(event.currentPlayers, 3))].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-surface-deep border-2 border-paper flex items-center justify-center">
                      <Users className="w-3 h-3 text-ink-3" strokeWidth={1.5} />
                    </div>
                  ))}
                  {event.currentPlayers > 3 && (
                     <div className="w-8 h-8 rounded-full bg-surface border-2 border-paper flex items-center justify-center">
                       <span className="font-mono text-[10px] text-ink-2">+{event.currentPlayers - 3}</span>
                     </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-[10px] font-mono tracking-mono uppercase text-ink-3">About</h3>
                  <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">{event.description}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Organizer Tools Tab */}
          {isOrganizer && (
            <TabsContent value="roster" className="flex-1 min-h-0 flex flex-col overflow-y-auto px-5 outline-none mt-0 pb-4 data-[state=inactive]:hidden">
               <div className="space-y-4">
                  <div className="bg-surface rounded-control border border-line p-3">
                    <h3 className="font-mono text-[10px] uppercase tracking-mono text-ink-2 mb-2">Organizer Actions</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="flex-1 h-9 bg-paper border-line text-ink font-bold text-xs rounded-chip">Edit Event</Button>
                      <Button variant="outline" size="sm" onClick={downloadCSV} className="flex-1 h-9 bg-paper border-line text-ink font-bold text-xs rounded-chip">Export RSVPs</Button>
                    </div>
                  </div>
               </div>
            </TabsContent>
          )}

        </Tabs>

        {/* Sticky Action Bar */}
        {!isOrganizer && (
          <div className="p-5 pt-4 pb-6 bg-paper border-t border-line shrink-0">
            <Button
              size="lg"
              onClick={handleRSVPClick}
              disabled={isLoading || loading}
              className={`w-full h-12 rounded-control text-sm font-bold tracking-tight transition-all active:scale-95 shadow-raised
                ${getButtonVariant() === "destructive" ? "bg-warn text-paper" : "bg-action hover:bg-action-hover text-paper"}
                ${(isFull && !user) || (isFull && !hasJoined && !isWaitlisted) ? "bg-ink-3 text-white" : ""}
              `}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getButtonText()}
            </Button>
          </div>
        )}
        
        {/* RSVP PROMPT MODAL */}
        <Dialog open={showRsvpPrompt} onOpenChange={setShowRsvpPrompt}>
          <DialogContent className="bg-paper border-line sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-ink">Join Event</DialogTitle>
              <DialogDescription className="text-ink-2 font-body text-sm">
                {isWaitlisted || isFull
                  ? "This event is currently full. Join the waitlist and we will automatically add you if a spot opens up."
                  : "You are about to secure your spot for this event."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto no-scrollbar px-1">
              {!user && (
                <div className="grid gap-2">
                  <Label htmlFor="guestName" className="text-xs font-bold text-ink">
                    Your Name <span className="text-warn">*</span>
                  </Label>
                  <Input
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g., John Doe"
                    className="bg-surface border-line text-ink placeholder:text-ink-3"
                  />
                  <p className="text-[10px] text-ink-3">We need a name so the organizer knows who is coming.</p>
                </div>
              )}

              {event.questions?.map((q) => (
                <div key={q} className="grid gap-2">
                  <Label className="text-xs font-bold text-ink">
                    {q} <span className="text-warn">*</span>
                  </Label>
                  <Select
                    value={rsvpAnswers[q] || ""}
                    onValueChange={(val) => setRsvpAnswers(prev => ({ ...prev, [q]: val }))}
                  >
                    <SelectTrigger className="bg-surface border-line text-ink">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {event.pickupPoints && event.pickupPoints.length > 0 && (
                <div className="grid gap-2">
                  <Label className="text-xs font-bold text-ink">
                    Select Pickup Point <span className="text-warn">*</span>
                  </Label>
                  <Select
                    value={rsvpPickupId}
                    onValueChange={setRsvpPickupId}
                  >
                    <SelectTrigger className="bg-surface border-line text-ink">
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

              <div className="grid gap-2">
                <Label htmlFor="rsvpNote" className="text-xs font-bold text-ink">
                  Message to Organizer <span className="text-ink-3 font-normal">(Optional)</span>
                </Label>
                <Textarea
                  id="rsvpNote"
                  value={rsvpNote}
                  onChange={(e) => setRsvpNote(e.target.value)}
                  placeholder="e.g., I'll be 10 mins late!"
                  className="bg-surface border-line text-ink placeholder:text-ink-3 min-h-[80px]"
                />
              </div>

              {!user && (
                <div className="grid gap-2 bg-surface p-3 rounded-xl border border-line">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="shareContact" className="text-xs font-bold text-ink cursor-pointer">
                      Share Contact Info with Organizer
                    </Label>
                    <input 
                      type="checkbox" 
                      id="shareContact"
                      checked={shareContact} 
                      onChange={(e) => setShareContact(e.target.checked)}
                      className="accent-action w-4 h-4 rounded cursor-pointer"
                    />
                  </div>
                  {shareContact && (
                    <Input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="Email or Phone Number"
                      className="bg-paper border-line text-ink placeholder:text-ink-3 mt-2"
                    />
                  )}
                  <p className="text-[10px] text-ink-3 mt-1">If enabled, the organizer can contact you about last-minute changes.</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRsvpPrompt(false)} className="border-line bg-paper text-ink rounded-control">
                Cancel
              </Button>
              <Button
                onClick={() => executeRSVP("join", rsvpNote, guestName)}
                disabled={isLoading || (!user && !guestName.trim())}
                className="bg-action text-paper font-bold rounded-control"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isFull ? "Join Waitlist" : "Confirm RSVP"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DrawerContent>
    </Drawer>
  )
}
