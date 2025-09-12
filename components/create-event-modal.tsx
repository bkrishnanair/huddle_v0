"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Rocket, Loader2 } from "lucide-react"
import LocationSearchInput from "./location-search"
import AIGenerateButton from "./ai-generate-button"
import AISuggestionsList from "./ai-suggestions-list"
import { useFirebase } from "@/lib/firebase-context"
import { toast } from "sonner"

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onEventCreated: (event: any) => void
  userLocation: { lat: number; lng: number } | null
}

const SPORTS = [
  "Basketball", "Soccer", "Tennis", "Cricket", "Baseball", "Volleyball",
  "Football", "Hockey", "Badminton", "Table Tennis",
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
  })
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [boostEvent, setBoostEvent] = useState(false)
  const [mapCenter, setMapCenter] = useState(userLocation || { lat: 37.7749, lng: -122.4194 })
  const [markerPosition, setMarkerPosition] = useState(userLocation || { lat: 37.7749, lng: -122.4194 })

  useEffect(() => {
    if (isOpen && userLocation) {
      setMapCenter(userLocation)
      setMarkerPosition(userLocation)
    }
  }, [isOpen, userLocation])

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
    if (!formData.sport || !formData.location || !markerPosition) {
      toast.error("Please fill in all required fields.")
      return
    }
    setIsLoading(true)

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, latitude: markerPosition.lat, longitude: markerPosition.lng, isBoosted: boostEvent }),
        credentials: 'include' // <-- Critical fix: ensures session cookies are sent
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Event created successfully!")
        onEventCreated(data.event)
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
      <DialogContent className="glass-surface border-white/15 text-foreground p-0 gap-0 sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Host a New Game</DialogTitle>
          <DialogDescription>Fill in the details to get your game on the map.</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto no-scrollbar px-6">
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
            <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" placeholder="e.g., Evening Basketball Run" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} required />
              </div>

              <AIGenerateButton onClick={() => {}} isLoading={isAiLoading} />
              <AISuggestionsList suggestions={suggestions} onSelect={() => {}} />

              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="A short and friendly description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} />
              </div>

              <div>
                <Label htmlFor="sport">Sport</Label>
                <Select required value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                  <SelectTrigger><SelectValue placeholder="Select a sport" /></SelectTrigger>
                  <SelectContent>{SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location-search">Location</Label>
                <LocationSearchInput onPlaceSelect={handlePlaceSelect} />
                <div className="h-48 w-full rounded-lg overflow-hidden relative mt-2 border border-border">
                  <Map defaultCenter={mapCenter} center={mapCenter} defaultZoom={15} gestureHandling={"greedy"} disableDefaultUI={true} mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}>
                    <AdvancedMarker position={markerPosition} draggable={true} onDragEnd={(e) => setMarkerPosition({ lat: e.latLng!.lat(), lng: e.latLng!.lng() })} />
                  </Map>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} required />
                  </div>
                  <div>
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" type="time" value={formData.time} onChange={(e) => handleInputChange("time", e.target.value)} required />
                  </div>
              </div>

              <div>
                <Label htmlFor="maxPlayers">Number of Players</Label>
                <Select value={String(formData.maxPlayers)} onValueChange={(v) => handleInputChange("maxPlayers", Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Array.from({ length: 49 }, (_, i) => i + 2).map(n => <SelectItem key={n} value={String(n)}>{n} players</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                        <Label htmlFor="boost" className="font-bold flex items-center gap-2">
                            <Rocket className="w-5 h-5 text-yellow-400" />
                            Boost Event
                        </Label>
                        <p className="text-sm text-slate-400 mt-1">Get your game featured to fill your roster faster.</p>
                    </div>
                    <Switch id="boost" checked={boostEvent} onCheckedChange={setBoostEvent} />
                </div>
              </div>
            </form>
          </APIProvider>
        </div>

        <DialogFooter className="p-6 pt-4 bg-slate-900/50 border-t border-border">
          <Button type="submit" form="event-form" disabled={isLoading} className="w-full" size="lg">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Host Game"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
