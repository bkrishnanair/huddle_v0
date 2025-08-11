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
          // Default to San Francisco if location access denied
          const defaultLocation = { lat: 37.7749, lng: -122.4194 }
          setUserLocation(defaultLocation)
          setMapCenter(defaultLocation)
        },
      )
    } else {
      // Default location
      const defaultLocation = { lat: 37.7749, lng: -122.4194 }
      setUserLocation(defaultLocation)
      setMapCenter(defaultLocation)
    }
  }, [])

  // Load events
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

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!googleMapsApiKey) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <MapPin className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-800 mb-4">Google Maps API Key Required</h1>
          <p className="text-red-600 mb-6">
            To use the map functionality, you need to add your Google Maps API key to your environment variables.
          </p>
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-red-800 mb-2">Setup Instructions:</h3>
            <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
              <li>Get a Google Maps API key from Google Cloud Console</li>
              <li>Enable Maps JavaScript API and Places API</li>
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
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <SharedHeader user={user} onLogout={onLogout} />

      {/* Map Container */}
      <div className="flex-1 relative">
        <APIProvider apiKey={googleMapsApiKey}>
          <Map
            defaultCenter={mapCenter}
            defaultZoom={14}
            mapId="huddle-map"
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
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Your location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Games nearby</span>
          </div>
        </div>

        {/* Create Event Button */}
        <Button
          onClick={() => setShowCreateModal(true)}
          className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-700 rounded-full w-14 h-14 shadow-lg"
          size="lg"
        >
          <Plus className="w-6 h-6" />
        </Button>

        {/* Events Counter */}
        <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium">
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
