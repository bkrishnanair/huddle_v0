"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, MapPin } from "lucide-react"
import EventDetailsModal from "./event-details-modal"
import CreateEventModal from "./create-event-modal"
import SharedHeader from "./shared-header"
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps"

interface MapViewProps {
  user: any
  onLogout: () => void
}

interface GameEvent {
  id: string
  title: string
  sport: string
  location: string
  latitude: number
  longitude: number
  date: string
  time: string
  maxPlayers: number
  currentPlayers: number
  createdBy: string
  players: string[]
}

const getSportColor = (sport: string): string => {
  const colors: { [key: string]: string } = {
    Basketball: "#f97316", // orange
    Soccer: "#22c55e", // green
    Tennis: "#eab308", // yellow
    Baseball: "#dc2626", // red
    Football: "#8b5cf6", // purple
    Volleyball: "#06b6d4", // cyan
    default: "#ef4444", // red default
  }
  return colors[sport] || colors.default
}

export default function MapView({ user, onLogout }: MapViewProps) {
  const [events, setEvents] = useState<GameEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 37.7749, lng: -122.4194 })
  const [mapsError, setMapsError] = useState<string | null>(null)

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    if (!mapsApiKey || mapsApiKey === "undefined" || mapsApiKey.startsWith("your-")) {
      setMapsError(
        "Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.",
      )
    }
  }, [mapsApiKey])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          setMapCenter(location)
        },
        (error) => {
          console.error("Error getting location:", error)
          const defaultLocation = { lat: 37.7749, lng: -122.4194 }
          setUserLocation(defaultLocation)
          setMapCenter(defaultLocation)
        },
      )
    } else {
      const defaultLocation = { lat: 37.7749, lng: -122.4194 }
      setUserLocation(defaultLocation)
      setMapCenter(defaultLocation)
    }
  }, [])

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch("/api/events")
        if (response.ok) {
          const data = await response.json()
          setEvents(data.events)
        }
      } catch (error) {
        console.error("Failed to load events:", error)
      }
    }

    loadEvents()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      onLogout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleEventCreated = (newEvent: GameEvent) => {
    setEvents((prev) => [...prev, newEvent])
    setShowCreateModal(false)
  }

  const handleEventUpdated = (updatedEvent: GameEvent) => {
    setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    setSelectedEvent(updatedEvent)
  }

  if (mapsError || !mapsApiKey) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="glass-card rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Google Maps Configuration Error</h1>
          <p className="text-white/80 mb-6 drop-shadow">{mapsError || "Google Maps API key not found"}</p>
          <div className="glass-card border-white/30 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-white mb-2">Setup Instructions:</h3>
            <ol className="text-sm text-white/80 space-y-1 list-decimal list-inside">
              <li>Get a Google Maps API key from Google Cloud Console</li>
              <li>Enable Maps JavaScript API in your Google Cloud project</li>
              <li>Enable billing for your Google Cloud project</li>
              <li>Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file</li>
              <li>Restart your development server</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  if (!userLocation) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="glass-card rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 floating">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <p className="text-white/80 drop-shadow">Getting your location...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col liquid-gradient">
      <SharedHeader user={user} onLogout={onLogout} />

      {/* Map Container */}
      <div className="flex-1 relative">
        <APIProvider apiKey={mapsApiKey}>
          <Map
            defaultCenter={mapCenter}
            defaultZoom={14}
            className="w-full h-full"
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: false,
              scaleControl: true,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: true,
            }}
          >
            {/* User Location Marker */}
            {userLocation && (
              <AdvancedMarker position={userLocation}>
                <Pin background="#2563eb" borderColor="#1e40af" glyphColor="#ffffff">
                  <MapPin className="w-4 h-4" />
                </Pin>
              </AdvancedMarker>
            )}

            {/* Event Markers */}
            {events.map((event) => (
              <AdvancedMarker
                key={event.id}
                position={{ lat: event.latitude, lng: event.longitude }}
                onClick={() => setSelectedEvent(event)}
              >
                <Pin background={getSportColor(event.sport)} borderColor="#ffffff" glyphColor="#ffffff" scale={1.2}>
                  <div className="text-xs font-bold">{event.sport.charAt(0)}</div>
                </Pin>
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>

        {/* Map Legend */}
        <div className="absolute top-4 left-4 glass-card rounded-lg p-3 text-sm text-white">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full glow"></div>
            <span>Your location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full glow"></div>
            <span>Games nearby</span>
          </div>
        </div>

        {/* Create Event Button */}
        <Button
          onClick={() => setShowCreateModal(true)}
          className="absolute bottom-6 right-6 glass-card hover:glow rounded-full w-14 h-14 shadow-2xl floating text-white border-white/30 transition-all duration-300 hover:scale-110"
          size="lg"
        >
          <Plus className="w-6 h-6" />
        </Button>

        {/* Events Counter */}
        <div className="absolute bottom-6 left-6 glass-card rounded-lg px-3 py-2 text-sm font-medium text-white">
          {events.length} games nearby
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          user={user}
          onClose={() => setSelectedEvent(null)}
          onEventUpdated={handleEventUpdated}
        />
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          user={user}
          userLocation={userLocation}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={handleEventCreated}
        />
      )}
    </div>
  )
}
