"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { X } from "lucide-react"
import LocationSearchInput from "./location-search"
import AIGenerateButton from "./ai-generate-button"
import AISuggestionsList from "./ai-suggestions-list"
import { getFunctions, httpsCallable } from "firebase/functions"
import { useFirebase } from "@/lib/firebase-context"
import { toast } from "sonner"
import type { google } from "googlemaps"

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onEventCreated: (event: any) => void
  userLocation: { lat: number; lng: number } | null
}

const SPORTS = [
  "Basketball",
  "Soccer",
  "Tennis",
  "Cricket",
  "Baseball",
  "Volleyball",
  "Football",
  "Hockey",
  "Badminton",
  "Table Tennis",
]

const RECURRING_FREQUENCIES = [
  { value: "weekly", label: "Repeats Weekly" },
  { value: "biweekly", label: "Repeats Every 2 Weeks" },
  { value: "monthly", label: "Repeats Monthly" },
]

export default function CreateEventModal({ isOpen, onClose, onEventCreated, userLocation }: CreateEventModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    location: "",
    date: "",
    time: "",
    maxPlayers: 10,
    description: "",
    isRecurring: false,
    recurringFrequency: "weekly",
    recurringCount: 4,
  })
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const { app } = useFirebase()

  const [mapCenter, setMapCenter] = useState(userLocation || { lat: 37.7749, lng: -122.4194 })
  const [markerPosition, setMarkerPosition] = useState(userLocation || { lat: 37.7749, lng: -122.4194 })

  useEffect(() => {
    if (isOpen && userLocation) {
      setMapCenter(userLocation)
      setMarkerPosition(userLocation)
    }
  }, [isOpen, userLocation])

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
    if (!formData.sport) {
      toast.error("Please select a sport.")
      return
    }
    if (!formData.location) {
      toast.error("Please select a location from the search bar.")
      return
    }
    setIsLoading(true)

    const submissionData = {
      ...formData,
      latitude: markerPosition.lat,
      longitude: markerPosition.lng,
    }

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(formData.isRecurring ? "Recurring events created successfully!" : "Event created successfully!")
        if (formData.isRecurring && data.events) {
          onEventCreated(data.events[0])
        } else {
          onEventCreated(data.event)
        }
        onClose()
      } else {
        const errorData = await response.json()
        toast.error(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Client-side error creating event:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerateCopy = async () => {
    if (!formData.sport || !formData.location || !formData.time) {
      toast.error("Please select a sport, location, and time first.")
      return
    }

    if (!app) {
      toast.error("Firebase is not initialized. Please try again later.")
      return
    }
    setIsAiLoading(true)
    const functions = getFunctions(app)
    const generateEventCopy = httpsCallable(functions, "generateEventCopy")
    try {
      const timeOfDay =
        Number.parseInt(formData.time.split(":")[0]) < 12
          ? "morning"
          : Number.parseInt(formData.time.split(":")[0]) < 18
            ? "afternoon"
            : "evening"
      const result = await generateEventCopy({
        sport: formData.sport,
        locationName: formData.location,
        timeOfDay: timeOfDay,
      })
      const data = result.data as { suggestions: any[] }
      setSuggestions(data.suggestions)
      toast.success("AI suggestions generated!")
    } catch (error) {
      console.error("Error calling generateEventCopy:", error)
      toast.error("Failed to generate AI suggestions. Please try again.")
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleSelectSuggestion = (suggestion: { title: string; description: string }) => {
    setFormData((prev) => ({
      ...prev,
      title: suggestion.title,
      description: suggestion.description,
    }))
    setSuggestions([])
  }

  if (!isOpen) return null

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-12">
      <div className="w-full max-w-md glass-card border-none rounded-2xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
          <div className="flex-shrink-0 p-6 pb-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Create New Game</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white/90">
                    Event Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Evening Basketball Run"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                    className="glass border-white/30 text-white placeholder:text-white/60"
                  />
                </div>

                <AIGenerateButton onClick={handleGenerateCopy} isLoading={isAiLoading} />
                <AISuggestionsList suggestions={suggestions} onSelect={handleSelectSuggestion} />

                <div>
                  <Label htmlFor="description" className="text-white/90">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="A short and friendly description of the game"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="glass border-white/30 text-white placeholder:text-white/60"
                  />
                </div>

                <div>
                  <Label htmlFor="sport" className="text-white/90">
                    Sport
                  </Label>
                  <Select required value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                    <SelectTrigger className="glass border-white/30 text-white">
                      <SelectValue placeholder="Select a sport" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      {SPORTS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location-search" className="text-white/90">
                    Location
                  </Label>
                  <LocationSearchInput onPlaceSelect={handlePlaceSelect} />
                  <div className="h-48 w-full rounded-lg overflow-hidden relative mt-2 border border-white/30">
                    <Map
                      defaultCenter={mapCenter}
                      center={mapCenter}
                      defaultZoom={15}
                      gestureHandling={"greedy"}
                      disableDefaultUI={true}
                      mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
                    >
                      <AdvancedMarker
                        position={markerPosition}
                        draggable={true}
                        onDragEnd={(e) => setMarkerPosition({ lat: e.latLng!.lat(), lng: e.latLng!.lng() })}
                      />
                    </Map>
                  </div>
                  <p className="text-xs text-white/60 mt-2">Drag the pin to set the exact game location.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-white/90">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                      className="glass border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-white/90">
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                      required
                      className="glass border-white/30 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxPlayers" className="text-white/90">
                    Number of Players
                  </Label>
                  <Select
                    value={String(formData.maxPlayers)}
                    onValueChange={(v) => handleInputChange("maxPlayers", Number(v))}
                  >
                    <SelectTrigger className="glass border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      {Array.from({ length: 49 }, (_, i) => i + 2).map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} players
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-2 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recurring" className="text-white/90">
                      Make this a recurring event
                    </Label>
                    <Switch
                      id="recurring"
                      checked={formData.isRecurring}
                      onCheckedChange={(checked) => handleInputChange("isRecurring", checked)}
                    />
                  </div>

                  {formData.isRecurring && (
                    <div className="space-y-4 pl-4 border-l-2 border-white/20">
                      <div>
                        <Label htmlFor="frequency" className="text-white/90">
                          Frequency
                        </Label>
                        <Select
                          value={formData.recurringFrequency}
                          onValueChange={(value) => handleInputChange("recurringFrequency", value)}
                        >
                          <SelectTrigger className="glass border-white/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card">
                            {RECURRING_FREQUENCIES.map((freq) => (
                              <SelectItem key={freq.value} value={freq.value}>
                                {freq.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="count" className="text-white/90">
                          Number of occurrences
                        </Label>
                        <Select
                          value={String(formData.recurringCount)}
                          onValueChange={(v) => handleInputChange("recurringCount", Number(v))}
                        >
                          <SelectTrigger className="glass border-white/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card">
                            {Array.from({ length: 12 }, (_, i) => i + 2).map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n}{" "}
                                {formData.recurringFrequency === "weekly"
                                  ? "weeks"
                                  : formData.recurringFrequency === "biweekly"
                                    ? "occurrences"
                                    : "months"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <p className="text-xs text-white/60">
                        This will create {formData.recurringCount} separate events, each{" "}
                        {formData.recurringFrequency === "weekly"
                          ? "one week"
                          : formData.recurringFrequency === "biweekly"
                            ? "two weeks"
                            : "one month"}{" "}
                        apart.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 pb-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full glass-card hover:glow text-white border-white/30"
                  >
                    {isLoading
                      ? "Creating..."
                      : formData.isRecurring
                        ? `Create ${formData.recurringCount} Games`
                        : "Create Game"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </APIProvider>
      </div>
    </div>
  )
}
