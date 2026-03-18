"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Copy, CheckCheck } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Rocket, Loader2, Plus, Trash2, Save, Bookmark, AlertCircle, Video, Monitor, MapPin, Navigation, Sparkles } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import LocationSearchInput from "./location-search"
import { Chip } from "@/components/ui/chip"
import { toast } from "sonner"
import { useAuth } from "@/lib/firebase-context"

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onEventCreated: (event: any) => void
  userLocation: { lat: number; lng: number } | null
  initialData?: any
  isEditMode?: boolean
}

const CATEGORIES = [
  "Sports", "Music", "Community", "Learning", "Food & Drink", "Tech", "Arts & Culture", "Outdoors"
]

export default function CreateEventModal({ isOpen, onClose, onEventCreated, userLocation, initialData, isEditMode = false }: CreateEventModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [postCreateState, setPostCreateState] = useState<{ show: boolean; eventId: string; deepLink: string }>({
    show: false, eventId: '', deepLink: ''
  })
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    name: "", category: "", tags: [], location: "",
    date: "", endDate: "", time: "", endTime: "", maxPlayers: 10, description: "", icon: ""
  })
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<{ transitTip?: string; suggestedQuestions?: string[] } | null>(null)
  const [boostEvent, setBoostEvent] = useState(false)

  // Virtual / Hybrid Event State
  const [eventType, setEventType] = useState<"in-person" | "virtual" | "hybrid">("in-person")
  const [virtualLink, setVirtualLink] = useState("")
  const isVirtual = eventType === "virtual"
  const isHybrid = eventType === "hybrid"
  const needsLocation = eventType !== "virtual" // in-person and hybrid need a map
  const [isPrivate, setIsPrivate] = useState(false)

  // Advanced Logistics State
  const [askRide, setAskRide] = useState(false)
  const [askDiet, setAskDiet] = useState(false)
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [pickupPoints, setPickupPoints] = useState<{ id: string; location: string; time: string }[]>([])
  const [stayUntil, setStayUntil] = useState("")
  const [transitTips, setTransitTips] = useState("")
  const [scheduledBroadcasts, setScheduledBroadcasts] = useState<{ message: string; relativeHours: number }[]>([])

  const [conflictWarning, setConflictWarning] = useState<string | null>(null)
  const [organizerEvents, setOrganizerEvents] = useState<any[]>([])

  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceType, setRecurrenceType] = useState<"weekly" | "biweekly" | "monthly">("weekly")
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("")

  // Presets State
  const { user } = useAuth()
  const [savedQuestions, setSavedQuestions] = useState<string[]>([])
  const [savedTransitTips, setSavedTransitTips] = useState<string[]>([])
  const [newQuestion, setNewQuestion] = useState("")

  const [mapCenter, setMapCenter] = useState(userLocation || { lat: 37.7749, lng: -122.4194 })
  const [markerPosition, setMarkerPosition] = useState(userLocation || { lat: 37.7749, lng: -122.4194 })
  const [orgLocationName, setOrgLocationName] = useState("")
  const [orgMarkerPosition, setOrgMarkerPosition] = useState<{ lat: number, lng: number } | null>(null)
  const [isFullscreenMap, setIsFullscreenMap] = useState(false)

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  // Use the styled map ID for dark mode consistency
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_STYLE_MAP_ID;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        let defaultDate = "";
        let defaultTime = "";
        let defaultEndTime = "";

        if (isEditMode) {
          defaultDate = initialData.date || "";
          defaultTime = initialData.time || "";
          defaultEndTime = initialData.endTime || "";
        } else {
          // CLONE MODE: auto-shift by +7 days
          if (initialData.date && typeof initialData.date === 'string') {
            try {
              const [y, m, d] = initialData.date.split('-');
              const dDate = new Date(Number(y), Number(m) - 1, Number(d));
              if (!isNaN(dDate.getTime())) {
                dDate.setDate(dDate.getDate() + 7);
                defaultDate = dDate.toISOString().split('T')[0];
              }
            } catch (e) { }
          }
          defaultTime = initialData.time || "";
          defaultEndTime = initialData.endTime || "";
        }

        setFormData({
          name: String(initialData.name || initialData.title || ""),
          category: String(initialData.category || initialData.sport || ""),
          tags: Array.isArray(initialData.tags) ? initialData.tags : [],
          location: typeof initialData.location === 'string' ? initialData.location : (initialData.location?.name || ""),
          description: String(initialData.description || ""),
          maxPlayers: Number(initialData.maxPlayers || 10),
          date: defaultDate,
          endDate: String(initialData.endDate || ""),
          time: defaultTime,
          endTime: defaultEndTime,
          icon: String(initialData.icon || ""),
        })
        setIsPrivate(!!initialData.isPrivate)
        setEventType(initialData.eventType || "in-person")
        setVirtualLink(initialData.virtualLink || "")
        setAskRide(initialData.questions?.includes("Need a ride?") || false)
        setAskDiet(initialData.questions?.includes("Dietary restrictions?") || false)
        const presetQs = initialData.questions?.filter((q: string) => q !== "Need a ride?" && q !== "Dietary restrictions?") || []
        setSelectedQuestions(presetQs)
        setPickupPoints(initialData.pickupPoints || [])
        setStayUntil(initialData.stayUntil || "")
        setTransitTips(initialData.transitTips || "")

        if (initialData.geopoint) {
          const loc = {
            lat: Number(initialData.geopoint.latitude) || 37.7749,
            lng: Number(initialData.geopoint.longitude) || -122.4194
          }
          setMapCenter(loc)
          setMarkerPosition(loc)
        } else if (userLocation) {
          setMapCenter(userLocation)
          setMarkerPosition(userLocation)
        }

        if (initialData.orgGeopoint) {
          setOrgMarkerPosition({
            lat: Number(initialData.orgGeopoint.latitude),
            lng: Number(initialData.orgGeopoint.longitude)
          })
          setOrgLocationName(initialData.orgLocation || "")
        } else {
          setOrgMarkerPosition(null)
          setOrgLocationName("")
        }
      } else {
        // Reset form for fresh creation
        setFormData({
          name: "", category: "", tags: [], location: "",
          date: "", endDate: "", time: "", endTime: "", maxPlayers: 10, description: "", icon: ""
        })
        setIsPrivate(false)
        setBoostEvent(false)
        setIsRecurring(false)
        setRecurrenceType("weekly")
        setRecurrenceEndDate("")
        setEventType("in-person")
        setVirtualLink("")
        setAskRide(false)
        setAskDiet(false)
        setSelectedQuestions([])
        setPickupPoints([])
        setStayUntil("")
        setTransitTips("")
        setScheduledBroadcasts([])
        setOrgLocationName("")
        setOrgMarkerPosition(null)

        if (userLocation) {
          setMapCenter(userLocation)
          setMarkerPosition(userLocation)
        }
      }
    }
  }, [isOpen, initialData, userLocation])

  useEffect(() => {
    if (isOpen && user?.uid) {
      user.getIdToken().then(idToken => {
        // Fetch profile
        fetch(`/api/users/${user.uid}/profile`, {
          headers: { "Authorization": `Bearer ${idToken}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.profile) {
              setSavedQuestions(data.profile.savedQuestions || []);
              setSavedTransitTips(data.profile.savedTransitTips || []);
            }
          })
          .catch(err => console.error("Error fetching presets", err))

        // Fetch organizer events for conflict checking
        fetch(`/api/users/${user.uid}/events?type=organized`, {
          headers: { "Authorization": `Bearer ${idToken}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.events) {
              setOrganizerEvents(data.events);
            }
          })
          .catch(err => console.error("Error fetching events", err))
      }).catch(err => console.error(err));
    }
  }, [isOpen, user])

  // Conflict Checking Effect
  useEffect(() => {
    setConflictWarning(null);
    if (!formData.date || !formData.time || organizerEvents.length === 0) return;

    const currentDateTime = new Date(`${formData.date}T${formData.time}`).getTime();
    if (isNaN(currentDateTime)) return;

    for (const ev of organizerEvents) {
      if (isEditMode && initialData?.id === ev.id) continue;

      const evTime = new Date(`${ev.date}T${ev.time || '00:00'}`).getTime();
      if (isNaN(evTime)) continue;

      // Conflict if within 1.5 hours
      const diffHours = Math.abs(currentDateTime - evTime) / (1000 * 60 * 60);
      if (diffHours < 1.5) {
        setConflictWarning(`🗓️ Warning: Overlaps with your event "${ev.name}" at ${ev.time}`);
        break;
      }
    }
  }, [formData.date, formData.time, organizerEvents, isEditMode, initialData]);

  const handleSavePreset = async (type: 'questions' | 'transitTips', value: string) => {
    if (!value.trim() || !user) return;
    try {
      const idToken = await user.getIdToken();

      let payload = {};
      if (type === 'questions') {
        if (savedQuestions.includes(value)) return;
        const newSaved = [...savedQuestions, value];
        setSavedQuestions(newSaved);
        setSelectedQuestions(prev => [...prev, value]);
        setNewQuestion("");
        payload = { savedQuestions: newSaved };
      } else {
        if (savedTransitTips.includes(value)) return;
        const newSaved = [...savedTransitTips, value];
        setSavedTransitTips(newSaved);
        payload = { savedTransitTips: newSaved };
      }

      const res = await fetch(`/api/users/${user.uid}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Saved to your profile presets!");
      }
    } catch (e) {
      console.error("Failed to save preset", e)
    }
  }

  const handleDeletePreset = async (type: 'questions' | 'transitTips', value: string) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      let payload = {};
      if (type === 'questions') {
        const newSaved = savedQuestions.filter(q => q !== value);
        setSavedQuestions(newSaved);
        setSelectedQuestions(prev => prev.filter(q => q !== value));
        payload = { savedQuestions: newSaved };
      } else {
        const newSaved = savedTransitTips.filter(t => t !== value);
        setSavedTransitTips(newSaved);
        payload = { savedTransitTips: newSaved };
      }
      await fetch(`/api/users/${user.uid}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
        body: JSON.stringify(payload)
      });
      toast.success("Preset removed.");
    } catch (e) {
      console.error("Failed to delete preset", e);
    }
  }

  const handleEnhanceDescription = async () => {
    if (!formData.description) return
    if (!user) {
      toast.error('Must be signed in to use AI enhancement')
      return;
    }

    setIsAiLoading(true)
    try {
      const idToken = await user.getIdToken()
      const res = await fetch('/api/ai/enhance-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({
          rawText: formData.description,
          category: formData.category,
          location: formData.location,
          date: formData.date,
          time: formData.time
        })
      })

      if (!res.ok) {
        throw new Error('Enhancement failed')
      }

      const data = await res.json()
      setFormData(prev => ({ ...prev, description: data.enhanced }))
      if (data.suggestions) {
        setSuggestions(data.suggestions)
      }
      toast.success('Description enhanced! ✨')
    } catch (error) {
      console.error(error)
      toast.error('Failed to enhance description')
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location) {
      const newPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }
      handleInputChange("location", place.formatted_address || place.name || "")
      setMapCenter(newPosition)
      setMarkerPosition(newPosition)
    }
  }

  const handleOrgPlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location) {
      const newPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }
      setOrgLocationName(place.formatted_address || place.name || "")
      setOrgMarkerPosition(newPosition)
    }
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.")
      return
    }
    toast.info("Getting your location...")
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setMapCenter(coords)
        setMarkerPosition(coords)

        // Reverse geocode to get address
        try {
          const geocoder = new google.maps.Geocoder()
          const result = await geocoder.geocode({ location: coords })
          if (result.results && result.results.length > 0) {
            handleInputChange("location", result.results[0].formatted_address)
            toast.success("Location set to your current position!")
          } else {
            handleInputChange("location", `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`)
          }
        } catch {
          handleInputChange("location", `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`)
        }
      },
      () => {
        toast.error("Unable to get your location. Please allow location access.")
      },
      { enableHighAccuracy: true }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate based on event type
    if (!formData.category) {
      toast.error("Please select a category.")
      return
    }
    if (needsLocation && (!formData.location || !markerPosition)) {
      toast.error("Please set a location for this event.")
      return
    }
    if ((isVirtual || isHybrid) && !virtualLink.trim()) {
      toast.error("Please provide a meeting link for this event.")
      return
    }
    // Basic URL validation for virtual link
    if ((isVirtual || isHybrid) && virtualLink.trim()) {
      try {
        new URL(virtualLink.trim())
      } catch {
        toast.error("Please enter a valid URL for the meeting link.")
        return
      }
    }
    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    if (eventDateTime < new Date()) {
      toast.error("You cannot create an event in the past.");
      return;
    }

    // Fix #8: If end time is before start time and no end date is set, auto-set end date to next day
    if (formData.endTime && formData.time && formData.endTime < formData.time && !formData.endDate) {
      const nextDay = new Date(`${formData.date}T00:00:00`);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = nextDay.toISOString().split('T')[0];
      handleInputChange("endDate", nextDayStr);
      formData.endDate = nextDayStr; // Also update the local reference for this submission
      toast.info("End time is before start time — event will end the next day.", { duration: 4000 });
    }

    // Validate end date isn't before start date
    if (formData.endDate && formData.endDate < formData.date) {
      toast.error("End date cannot be before start date.");
      return;
    }

    setIsLoading(true)

    try {
      const { getAuth } = await import("firebase/auth")
      const currentUser = getAuth().currentUser
      const idToken = currentUser ? await currentUser.getIdToken() : ""

      const configuredQuestions = [];
      if (askRide) configuredQuestions.push("Need a ride?");
      if (askDiet) configuredQuestions.push("Dietary restrictions?");
      configuredQuestions.push(...selectedQuestions);

      const scheduledMessagesPayload = scheduledBroadcasts
        .filter(b => b.message.trim() !== '')
        .map(b => {
          const scheduledTime = new Date(eventDateTime.getTime() - (b.relativeHours * 60 * 60 * 1000));
          return {
            id: Math.random().toString(36).substring(2, 9),
            message: b.message.trim(),
            scheduledFor: scheduledTime.toISOString(),
            sent: false,
            isAnnouncement: true
          };
        });

      const payload: Record<string, any> = {
        ...formData,
        eventType,
        virtualLink: (isVirtual || isHybrid) ? virtualLink.trim() : null,
        isBoosted: boostEvent,
        isPrivate: isPrivate,
        questions: configuredQuestions,
        pickupPoints,
        stayUntil,
        transitTips,
        ...(scheduledMessagesPayload.length > 0 && { scheduledMessages: scheduledMessagesPayload }),
        ...(isRecurring && recurrenceEndDate && !isEditMode && {
          recurrence: {
            type: recurrenceType,
            endDate: recurrenceEndDate
          }
        })
      }

      // Only include geopoint for events with a physical location
      if (needsLocation && markerPosition) {
        payload.geopoint = { latitude: markerPosition.lat, longitude: markerPosition.lng }
      }

      if (orgMarkerPosition) {
        payload.orgGeopoint = { latitude: orgMarkerPosition.lat, longitude: orgMarkerPosition.lng }
        payload.orgLocation = orgLocationName
      }

      // Only include geopoint for events with a physical location
      if (needsLocation && markerPosition) {
        payload.geopoint = { latitude: markerPosition.lat, longitude: markerPosition.lng }
      }

      const endpoint = isEditMode && initialData?.id ? `/api/events/${initialData.id}` : "/api/events"
      const method = isEditMode ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (!isEditMode && data.event?.id) {
          // Show the share card instead of immediately closing
          onEventCreated(data.event);
          setPostCreateState({
            show: true,
            eventId: data.event.id,
            deepLink: `https://huddlemap.live/map?eventId=${data.event.id}`,
          });
        } else {
          toast.success(isEditMode ? "Event updated successfully!" : "Event created successfully!")
          onEventCreated(isEditMode ? data.event : data.event || payload)
          onClose()
        }
      } else {
        const errorData = await response.json()
        toast.error(`Error: ${errorData.error}`)
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="glass-surface border-white/15 text-foreground p-0 gap-0 sm:max-w-md max-h-[calc(100vh-var(--safe-bottom))] sm:max-h-[90vh] flex flex-col"
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          // Prevent Radix from closing the modal or blocking the click 
          // if the user is tapping the Google Places dropdown
          if (target?.closest('.pac-container')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Create a New Event</DialogTitle>
          <DialogDescription>Fill in the details to get your event on the map.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto no-scrollbar px-6">
          <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Event Type Segmented Toggle */}
            <div>
              <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">Event Type</Label>
              <div className="flex items-center gap-1.5 p-1 glass-surface border border-white/10 rounded-full w-fit">
                {(["in-person", "virtual", "hybrid"] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEventType(type)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${eventType === type
                      ? type === "virtual" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : type === "hybrid" ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                          : "bg-primary text-primary-foreground shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    {type === "in-person" && <MapPin className="w-3 h-3" />}
                    {type === "virtual" && <Monitor className="w-3 h-3" />}
                    {type === "hybrid" && <><MapPin className="w-3 h-3" /><span>+</span><Monitor className="w-3 h-3" /></>}
                    {type === "in-person" ? "In-Person" : type === "virtual" ? "Virtual" : "Hybrid"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="name">Event Title</Label>
              <Input id="name" placeholder="e.g., Community Workshop" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="description">Description (Max 500 chars)</Label>
                <button
                  type="button"
                  onClick={handleEnhanceDescription}
                  disabled={isAiLoading || !formData.description}
                  className="text-[10px] font-black uppercase tracking-wider text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1 disabled:opacity-50"
                  title="Enhance with AI"
                >
                  {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  AI Enhance
                </button>
              </div>
              <Textarea
                id="description"
                placeholder="A short and friendly description..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="resize-none h-20 bg-slate-900/50 border-white/10"
                maxLength={500}
              />
              {suggestions && (
                <div className="mt-2 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    <span className="text-xs font-bold text-teal-400">AI Suggestions</span>
                  </div>
                  {suggestions.transitTip && (
                    <div className="text-xs text-slate-300 flex flex-col gap-1">
                      <span className="font-semibold text-slate-200">Transit Tip:</span>
                      <div className="flex items-start gap-2">
                        <span className="flex-1">{suggestions.transitTip}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 text-[10px] px-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300"
                          onClick={(e) => {
                            e.preventDefault();
                            setFormData(prev => ({ ...prev, transitTips: suggestions.transitTip || "" }));
                            toast.success("Added transit tip!");
                          }}
                        >
                          Use
                        </Button>
                      </div>
                    </div>
                  )}
                  {suggestions.suggestedQuestions && suggestions.suggestedQuestions.length > 0 && (
                    <div className="text-xs text-slate-300 flex flex-col gap-1">
                      <span className="font-semibold text-slate-200">RSVP Questions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {suggestions.suggestedQuestions.map((q, i) => (
                          <Chip 
                            key={i} 
                            onClick={(e) => {
                              e.preventDefault();
                              if (!selectedQuestions.includes(q)) {
                                setSelectedQuestions([...selectedQuestions, q]);
                                toast.success("Added question!");
                              }
                            }}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 cursor-pointer" 
                          >
                            {q}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select required value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="icon">Emoji Icon (Optional)</Label>
                <Input
                  id="icon"
                  placeholder="e.g. 🏏"
                  value={formData.icon || ""}
                  maxLength={2}
                  onChange={(e) => handleInputChange("icon", e.target.value)}
                />
              </div>
            </div>

            {/* Meeting Link for Virtual/Hybrid */}
            {(isVirtual || isHybrid) && (
              <div className="space-y-2">
                <Label htmlFor="virtualLink" className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  Meeting Link <span className="text-primary text-xs">*</span>
                </Label>
                <Input
                  id="virtualLink"
                  type="url"
                  placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                  value={virtualLink}
                  onChange={(e) => setVirtualLink(e.target.value)}
                  className="bg-slate-900/50 border-white/10"
                  required
                />
                <p className="text-[10px] text-slate-500">Paste a Zoom, Google Meet, Teams, or Discord link.</p>
              </div>
            )}

            {/* Virtual-only: optional timezone/general location */}
            {isVirtual && (
              <div>
                <Label htmlFor="location" className="text-slate-400">General Location / Timezone <span className="text-[10px] font-normal">(Opt)</span></Label>
                <Input
                  id="location"
                  placeholder="e.g., EST or College Park, MD"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="bg-slate-900/50 border-white/10"
                />
              </div>
            )}

            {/* Location Picker — only for in-person and hybrid */}
            {needsLocation && (
              <div className={isFullscreenMap ? "fixed inset-0 z-[100] bg-slate-950 p-4 pt-10 flex flex-col" : ""}>
                <Label htmlFor="location-search" className={isFullscreenMap ? "text-white mb-2" : ""}>Location</Label>
                {mapsApiKey ? (
                  <APIProvider apiKey={mapsApiKey}>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <LocationSearchInput onPlaceSelect={handlePlaceSelect} insideModal={true} />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 shrink-0 border-white/20 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                        onClick={handleUseCurrentLocation}
                        title="Use current location"
                      >
                        <Navigation className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className={`${isFullscreenMap ? "flex-1 mt-4" : "h-48 mt-2"} w-full rounded-lg overflow-hidden relative border border-border`}>
                      <Map
                        center={mapCenter}
                        defaultZoom={15}
                        gestureHandling={"auto"}
                        disableDefaultUI={false}
                        mapTypeControl={false}
                        streetViewControl={false}
                        mapId={mapId}
                      >
                        <AdvancedMarker position={markerPosition} draggable={true} onDragEnd={(e) => setMarkerPosition({ lat: e.latLng!.lat(), lng: e.latLng!.lng() })} />
                      </Map>

                      {/* Fullscreen Map Toggle Button */}
                      <div className="absolute top-2 right-2 flex flex-col gap-2 z-10 pointer-events-auto">
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          onClick={(e) => { e.preventDefault(); setIsFullscreenMap(!isFullscreenMap); }}
                          className="bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md border border-white/20 shadow-xl h-10 w-10 text-xs"
                        >
                          {isFullscreenMap ? "Minimize" : "Expand"}
                        </Button>
                      </div>
                    </div>
                    {isFullscreenMap && (
                      <Button type="button" onClick={() => setIsFullscreenMap(false)} className="mt-4 w-full h-12 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg border border-orange-500/50">
                        Confirm Location Pin
                      </Button>
                    )}

                  </APIProvider>
                ) : (
                  <div className="h-48 w-full rounded-lg mt-2 border border-border flex items-center justify-center text-center bg-slate-800/50">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading Map...
                  </div>
                )}
              </div>
            )}

            <div className={`space-y-3 ${isFullscreenMap ? 'hidden' : ''}`}>
              {/* Row 1: Start Date + End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Start Date <span className="text-primary text-xs">*</span></Label>
                  <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} style={{ colorScheme: "white" }} className="w-full pr-3 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-150 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-90" required />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-slate-400">End Date <span className="text-[10px] font-normal">(Opt)</span></Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => handleInputChange("endDate", e.target.value)} style={{ colorScheme: "white" }} className="w-full pr-3 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-150 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-90" />
                </div>
              </div>
              {/* Row 2: Start Time + End Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">Start Time <span className="text-primary text-xs">*</span></Label>
                  <Input id="time" type="time" value={formData.time} onChange={(e) => handleInputChange("time", e.target.value)} style={{ colorScheme: "white" }} className="w-full pr-3 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-150 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-90" required />
                </div>
                <div>
                  <Label htmlFor="endTime" className="text-slate-400">End Time <span className="text-[10px] font-normal">(Opt)</span></Label>
                  <Input id="endTime" type="time" value={formData.endTime} onChange={(e) => handleInputChange("endTime", e.target.value)} style={{ colorScheme: "white" }} className="w-full pr-3 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-150 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-90" />
                </div>
              </div>

              {/* Repeat Toggle (Only on creation) */}
              {!isEditMode && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-sm font-medium text-slate-200">Repeat Event</span>
                    <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
                  </div>
                  {isRecurring && (
                    <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-black/20 border border-primary/20">
                      <div>
                        <Label htmlFor="recurrenceType">Frequency</Label>
                        <Select value={recurrenceType} onValueChange={(v: any) => setRecurrenceType(v)}>
                          <SelectTrigger className="mt-1 bg-slate-800 border-none"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="recurrenceEndDate">Until Date</Label>
                        <Input
                          id="recurrenceEndDate"
                          type="date"
                          value={recurrenceEndDate}
                          onChange={(e) => setRecurrenceEndDate(e.target.value)}
                          min={formData.date}
                          style={{ colorScheme: "white" }}
                          className="mt-1 w-full bg-slate-800 border-none pr-3 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-150 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-90"
                          required={isRecurring}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {
              conflictWarning && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {conflictWarning}
                </div>
              )
            }

            <div>
              <Label htmlFor="maxPlayers">Number of Attendees</Label>
              <Input
                id="maxPlayers"
                type="number"
                min={2}
                max={1000}
                value={formData.maxPlayers}
                onChange={(e) => handleInputChange("maxPlayers", parseInt(e.target.value) || 2)}
                required
              />
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <h3 className="font-black text-sm uppercase tracking-widest text-primary/80 mb-2">Advanced Logistics (Optional)</h3>

              <div className="space-y-2 pb-2">
                <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Requested Attendee Info</Label>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-sm font-medium text-slate-200">"Do you need a ride?"</span>
                  <Switch checked={askRide} onCheckedChange={setAskRide} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-sm font-medium text-slate-200">"Any dietary restrictions?"</span>
                  <Switch checked={askDiet} onCheckedChange={setAskDiet} />
                </div>
                {savedQuestions.map(q => (
                  <div key={q} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-primary/20">
                    <span className="text-sm font-medium text-slate-200 flex items-center gap-2"><Bookmark className="w-3 h-3 text-primary" /> {q}</span>
                    <div className="flex items-center gap-2">
                      <Switch checked={selectedQuestions.includes(q)} onCheckedChange={(checked) => {
                        if (checked) setSelectedQuestions(prev => [...prev, q]);
                        else setSelectedQuestions(prev => prev.filter(x => x !== q));
                      }} />
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-400" onClick={() => handleDeletePreset('questions', q)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder="Ask a custom question..."
                    value={newQuestion}
                    onChange={e => setNewQuestion(e.target.value)}
                    className="h-9 bg-slate-900/50 border-white/10"
                  />
                  <Button type="button" variant="secondary" size="sm" className="h-9 whitespace-nowrap" onClick={() => handleSavePreset('questions', newQuestion)} disabled={!newQuestion.trim()}>
                    <Save className="w-3.5 h-3.5 mr-1" /> Save
                  </Button>
                </div>
              </div>

              <div className="space-y-3 pb-2 pt-2 border-t border-white/5">
                <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pickup Points</Label>
                {pickupPoints.map((pt, i) => (
                  <div key={pt.id} className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-white/5">
                    <Input
                      placeholder="Location (e.g. GH Lobby)"
                      value={pt.location}
                      onChange={(e) => setPickupPoints(prev => prev.map(p => p.id === pt.id ? { ...p, location: e.target.value } : p))}
                      className="h-8 bg-transparent border-none text-xs"
                    />
                    <Input
                      type="time"
                      value={pt.time}
                      onChange={(e) => setPickupPoints(prev => prev.map(p => p.id === pt.id ? { ...p, time: e.target.value } : p))}
                      className="h-8 w-24 bg-transparent border-none text-xs"
                      style={{ colorScheme: "dark" }}
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400 shrink-0" onClick={() => setPickupPoints(prev => prev.filter(p => p.id !== pt.id))}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs border-dashed border-white/20 text-slate-400 hover:text-white"
                  onClick={() => setPickupPoints(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), location: "", time: "" }])}
                >
                  <Plus className="w-3 h-3 mr-2" /> Add Pickup Point
                </Button>
              </div>

              <div className="space-y-3 pb-2 pt-2 border-t border-white/5">
                <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Organization HQ (Optional)</Label>
                <div className="p-3 bg-black/20 rounded-lg border border-primary/20">
                  <p className="text-[10px] text-slate-500 mb-2 mt-1">If your club is travelling, add your campus HQ here so local members can discover this trip.</p>
                  {mapsApiKey && (
                    <APIProvider apiKey={mapsApiKey}>
                      <LocationSearchInput onPlaceSelect={handleOrgPlaceSelect} insideModal={true} />
                    </APIProvider>
                  )}
                  {orgLocationName && <p className="text-xs text-emerald-400 mt-2 font-medium">✅ HQ Set: {orgLocationName}</p>}
                </div>
              </div>

              <div className="space-y-3 pb-2 pt-2 border-t border-white/5">
                <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Schedule & Transit</Label>
                <div className="space-y-1">
                  <Label htmlFor="stayUntil" className="text-xs text-slate-500">Stay Until (Optional Note)</Label>
                  <Input id="stayUntil" placeholder="e.g. Please stay until 9pm" value={stayUntil} onChange={(e) => setStayUntil(e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1 mt-2">
                  <Label htmlFor="transitTips" className="text-xs text-slate-500">Transit Tips</Label>
                  {savedTransitTips.length > 0 && (
                    <div className="flex flex-col gap-1.5 mb-2">
                      {savedTransitTips.map(tip => (
                        <div key={tip} className="flex items-center text-[10px] rounded bg-primary/20 border border-primary/30 overflow-hidden w-full max-w-full group">
                          <button type="button" onClick={() => setTransitTips(tip)} className="px-2 py-1.5 text-primary-foreground hover:bg-primary/30 transition-colors truncate text-left flex-1" title={tip}>
                            {tip}
                          </button>
                          <button type="button" onClick={() => handleDeletePreset('transitTips', tip)} className="px-2 py-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors border-l border-primary/30 opacity-70 group-hover:opacity-100 shrink-0">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input id="transitTips" placeholder="e.g. 116 Purple to stop 16/17" value={transitTips} onChange={(e) => setTransitTips(e.target.value)} className="h-9" />
                    <Button type="button" variant="outline" size="sm" className="h-9 border-white/10" onClick={() => handleSavePreset('transitTips', transitTips)} disabled={!transitTips.trim() || savedTransitTips.includes(transitTips.trim())} title="Save to Presets">
                      <Save className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pb-2 pt-2 border-t border-white/5">
                <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Scheduled Broadcasts</Label>
                {scheduledBroadcasts.map((b, i) => (
                  <div key={i} className="flex gap-2 bg-slate-900/50 p-2 rounded-lg border border-white/5">
                    <Select value={String(b.relativeHours)} onValueChange={(v) => setScheduledBroadcasts(prev => {
                      const newArr = [...prev];
                      newArr[i].relativeHours = Number(v);
                      return newArr;
                    })}>
                      <SelectTrigger className="w-[110px] text-xs bg-slate-800/50 border-none shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="48">48h Before</SelectItem>
                        <SelectItem value="24">24h Before</SelectItem>
                        <SelectItem value="2">2h Before</SelectItem>
                        <SelectItem value="0">At Start</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Message (e.g. Bring water!)"
                      value={b.message}
                      onChange={(e) => setScheduledBroadcasts(prev => {
                        const newArr = [...prev];
                        newArr[i].message = e.target.value;
                        return newArr;
                      })}
                      className="flex-1 bg-transparent border-none text-xs h-8 px-1"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400 shrink-0" onClick={() => setScheduledBroadcasts(prev => prev.filter((_, idx) => idx !== i))}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs border-dashed border-white/20 text-slate-400 hover:text-white"
                  onClick={() => setScheduledBroadcasts(prev => [...prev, { message: "", relativeHours: 24 }])}
                >
                  <Plus className="w-3 h-3 mr-2" /> Add Scheduled Broadcast
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-border mt-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                <div>
                  <Label htmlFor="private" className="font-bold flex items-center gap-2">
                    Make Private (Link Only)
                  </Label>
                  <p className="text-sm text-slate-400 mt-1">Hide this event from the global map feed.</p>
                </div>
                <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                <div>
                  <Label htmlFor="boost" className="font-bold flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-yellow-400" />
                    Boost Event
                  </Label>
                  <p className="text-sm text-slate-400 mt-1">Get your event featured to attract more attendees.</p>
                </div>
                <Switch id="boost" checked={boostEvent} onCheckedChange={setBoostEvent} />
              </div>
            </div>
          </form >
        </div >

        <DialogFooter className="shrink-0 p-6 pt-4 bg-slate-900/90 backdrop-blur-md border-t border-border">
          <Button type="submit" form="event-form" disabled={isLoading} className="w-full" size="lg">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isEditMode ? "Save Changes" : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Post-creation share card overlay */}
      {postCreateState.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4 text-center shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-200">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-black text-white mb-1">Event is Live!</h3>
            <p className="text-slate-400 text-sm mb-5">Share this link to start getting RSVPs</p>

            <div className="bg-slate-800/60 rounded-xl p-3 flex items-center gap-2 mb-4 border border-white/5">
              <span className="text-sm text-teal-400 truncate flex-1 text-left">{postCreateState.deepLink}</span>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(postCreateState.deepLink);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch {
                    toast.error("Failed to copy link");
                  }
                }}
                className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shrink-0 transition-colors flex items-center gap-1.5"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {typeof window !== 'undefined' && navigator.share && (
              <button
                onClick={() => navigator.share({ title: 'Join my event on Huddle!', url: postCreateState.deepLink }).catch(() => {})}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-bold mb-3 transition-colors border border-white/5"
              >
                📤 Share via...
              </button>
            )}

            <button
              onClick={() => { setPostCreateState({ show: false, eventId: '', deepLink: '' }); onClose(); }}
              className="text-slate-500 text-sm hover:text-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </Dialog>
  )
}
