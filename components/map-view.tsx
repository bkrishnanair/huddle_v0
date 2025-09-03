"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip" // Assuming a Chip component exists
import { Plus, MapPin, LocateFixed, AlertCircle } from "lucide-react"
import EventDetailsModal from "./event-details-modal"
import CreateEventModal from "./create-event-modal"
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps"
import { mapStyles } from "@/lib/map-styles" 

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
  isBoosted?: boolean
}

const getSportColor = (sport: string): string => {
  const colors: { [key: string]: string } = {
    Basketball: "#f97316",
    Soccer: "#22c55e",
    Tennis: "#eab308",
    Baseball: "#dc2626",
    Football: "#8b5cf6",
    Volleyball: "#06b6d4",
    default: "#ef4444",
  }
  return colors[sport] || colors.default
}

export default function MapView({ user }: MapViewProps) {
  const [events, setEvents] = useState<GameEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<GameEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 37.7749, lng: -122.4194 })
  const [mapsError, setMapsError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const [activeFilters, setActiveFilters] = useState({
    sport: 'All',
    time: 'All',
    distance: 'All'
  });

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID

  useEffect(() => {
    const defaultLocation = { lat: 37.7749, lng: -122.4194 }
    if (!navigator.geolocation) {
      setUserLocation(defaultLocation)
      setMapCenter(defaultLocation)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = { lat: position.coords.latitude, lng: position.coords.longitude }
        setUserLocation(location)
        setMapCenter(location)
      },
      () => {
        setUserLocation(defaultLocation)
        setMapCenter(defaultLocation)
      }
    )
  }, [])

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch("/api/events")
        if (response.ok) {
          const data = await response.json()
          setEvents(data.events || [])
          setFilteredEvents(data.events || [])
        }
      } catch (error) {
        console.error("Failed to load events:", error)
      }
    }
    loadEvents()
  }, [])

  const handleRecenter = useCallback(() => {
    if (userLocation && map) {
      map.panTo(userLocation)
      map.setZoom(14)
    }
  }, [userLocation, map]);

  // Add filtering logic here
  // ...

  if (!mapsApiKey) {
    return (
        <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
          <div className="text-center max-w-md space-y-4">
            <div className="glass-surface rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-rose-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-50 mb-4 drop-shadow-lg">Maps Configuration Error</h1>
            <p className="text-slate-300 mb-6 drop-shadow">Google Maps API key is missing.</p>
          </div>
        </div>
    )
  }

  if (!userLocation) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="glass-surface rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-slate-50" />
          </div>
          <p className="text-slate-300 drop-shadow">Getting your location...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col liquid-gradient">
      <div className="flex-1 relative">
        <APIProvider apiKey={mapsApiKey}>
          <Map
            ref={(ref) => setMap(ref)}
            mapId={mapId}
            defaultCenter={mapCenter}
            defaultZoom={14}
            className="w-full h-full"
            options={{
              disableDefaultUI: true,
              styles: mapStyles,
              gestureHandling: "greedy",
            }}
          >
            {userLocation && <AdvancedMarker position={userLocation} />}
            {filteredEvents.map((event) => (
              <AdvancedMarker
                key={event.id}
                position={{ lat: event.latitude, lng: event.longitude }}
                onClick={() => setSelectedEvent(event)}
              >
                <Pin
                  background={getSportColor(event.sport)}
                  borderColor={event.isBoosted ? "#fbbf24" : "#ffffff"}
                  glyphColor="#ffffff"
                />
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>

        <div className="absolute top-4 left-4 right-4 z-10">
            <div className="flex items-center space-x-2 p-2 glass-surface rounded-full">
                <Chip isActive={activeFilters.sport === 'All'} onClick={() => {}}>All</Chip>
                <Chip isActive={activeFilters.sport === 'Basketball'} onClick={() => {}}>Basketball</Chip>
                <Chip isActive={activeFilters.sport === 'Soccer'} onClick={() => {}}>Soccer</Chip>
            </div>
        </div>

        <Button
            onClick={() => setShowCreateModal(true)}
            size="lg"
            className="absolute bottom-24 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg"
        >
            <Plus className="w-6 h-6" />
        </Button>

        <Button
            onClick={handleRecenter}
            variant="secondary"
            size="lg"
            className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        >
            <LocateFixed className="w-6 h-6" />
        </Button>
      </div>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEventUpdated={() => {}}
        />
      )}

      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={() => {}}
          userLocation={userLocation}
        />
      )}
    </div>
  )
}
