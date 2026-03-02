"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Rocket, Loader2, Plus, Trash2, Save, Bookmark, AlertCircle } from "lucide-react"
import LocationSearchInput from "./location-search"
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
  const [formData, setFormData] = useState({
    name: "", category: "", tags: [], location: "",
    date: "", time: "", endTime: "", maxPlayers: 10, description: "",
  })
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [boostEvent, setBoostEvent] = useState(false)
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

  // Presets State
  const { user } = useAuth()
  const [savedQuestions, setSavedQuestions] = useState<string[]>([])
  const [savedTransitTips, setSavedTransitTips] = useState<string[]>([])
  const [newQuestion, setNewQuestion] = useState("")

  const [mapCenter, setMapCenter] = useState(userLocation || { lat: 37.7749, lng: -122.4194 })
  const [markerPosition, setMarkerPosition] = useState(userLocation || { lat: 37.7749, lng: -122.4194 })

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
          time: defaultTime,
          endTime: defaultEndTime,
        })
        setIsPrivate(!!initialData.isPrivate)
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
      } else {
        // Reset form for fresh creation
        setFormData({
          name: "", category: "", tags: [], location: "",
          date: "", time: "", endTime: "", maxPlayers: 10, description: "",
        })
        setIsPrivate(false)
        setBoostEvent(false)
        setAskRide(false)
        setAskDiet(false)
        setSelectedQuestions([])
        setPickupPoints([])
        setStayUntil("")
        setTransitTips("")
        setScheduledBroadcasts([])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category || !formData.location || !markerPosition) {
      toast.error("Please fill in all required fields.")
      return
    }
    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    if (eventDateTime < new Date()) {
      toast.error("You cannot create an event in the past.");
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

      const payload = {
        ...formData,
        geopoint: { latitude: markerPosition.lat, longitude: markerPosition.lng },
        isBoosted: boostEvent,
        isPrivate: isPrivate,
        questions: configuredQuestions,
        pickupPoints,
        stayUntil,
        transitTips,
        ...(scheduledMessagesPayload.length > 0 && { scheduledMessages: scheduledMessagesPayload })
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
        toast.success(isEditMode ? "Event updated successfully!" : "Event created successfully!")
        onEventCreated(isEditMode ? data.event : data.event || payload)
        onClose()
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
        className="glass-surface border-white/15 text-foreground p-0 gap-0 sm:max-w-md max-h-[90vh] flex flex-col"
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
            <div>
              <Label htmlFor="name">Event Title</Label>
              <Input id="name" placeholder="e.g., Community Workshop" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="A short and friendly description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select required value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location-search">Location</Label>
              {mapsApiKey ? (
                <APIProvider apiKey={mapsApiKey}>
                  <LocationSearchInput onPlaceSelect={handlePlaceSelect} insideModal={true} />
                  <div className="h-48 w-full rounded-lg overflow-hidden relative mt-2 border border-border">
                    <Map
                      center={mapCenter}
                      defaultZoom={15}
                      gestureHandling={"greedy"}
                      disableDefaultUI={true}
                      mapId={mapId}
                    >
                      <AdvancedMarker position={markerPosition} draggable={true} onDragEnd={(e) => setMarkerPosition({ lat: e.latLng!.lat(), lng: e.latLng!.lng() })} />
                    </Map>
                  </div>
                </APIProvider>
              ) : (
                <div className="h-48 w-full rounded-lg mt-2 border border-border flex items-center justify-center text-center bg-slate-800/50">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading Map...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} style={{ colorScheme: "dark" }} className="w-full" required />
              </div>
              <div>
                <Label htmlFor="time">Start Time</Label>
                <Input id="time" type="time" value={formData.time} onChange={(e) => handleInputChange("time", e.target.value)} style={{ colorScheme: "dark" }} className="w-full" required />
              </div>
              <div>
                <Label htmlFor="endTime" className="text-slate-400 whitespace-nowrap">End Time <span className="text-[10px] font-normal">(Opt)</span></Label>
                <Input id="endTime" type="time" value={formData.endTime} onChange={(e) => handleInputChange("endTime", e.target.value)} style={{ colorScheme: "dark" }} className="w-full" />
              </div>
            </div>

            {conflictWarning && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {conflictWarning}
              </div>
            )}

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
                    <Switch checked={selectedQuestions.includes(q)} onCheckedChange={(checked) => {
                      if (checked) setSelectedQuestions(prev => [...prev, q]);
                      else setSelectedQuestions(prev => prev.filter(x => x !== q));
                    }} />
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
                <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Schedule & Transit</Label>
                <div className="space-y-1">
                  <Label htmlFor="stayUntil" className="text-xs text-slate-500">Stay Until (Optional Note)</Label>
                  <Input id="stayUntil" placeholder="e.g. Please stay until 9pm" value={stayUntil} onChange={(e) => setStayUntil(e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1 mt-2">
                  <Label htmlFor="transitTips" className="text-xs text-slate-500">Transit Tips</Label>
                  {savedTransitTips.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {savedTransitTips.map(tip => (
                        <button key={tip} type="button" onClick={() => setTransitTips(tip)} className="text-[10px] px-2 py-1 rounded-full bg-primary/20 text-primary-foreground hover:bg-primary/30 border border-primary/30 transition-colors">
                          {tip}
                        </button>
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
          </form>
        </div>

        <DialogFooter className="p-6 pt-4 bg-slate-900/50 border-t border-border">
          <Button type="submit" form="event-form" disabled={isLoading} className="w-full" size="lg">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
