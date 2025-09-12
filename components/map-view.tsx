"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { Plus, MapPin, LocateFixed, AlertCircle } from "lucide-react"
import EventDetailsDrawer from "./event-details-drawer"
import CreateEventModal from "./create-event-modal"
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps"
import { HuddleEvent } from "@/lib/types"

interface MapViewProps {
  user: any
}

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    Sports: "#f97316",
    Music: "#22c55e",
    Community: "#eab308",
    Learning: "#dc2626",
    "Food & Drink": "#8b5cf6",
    Tech: "#06b6d4",
    "Arts & Culture": "#ec4899",
    Outdoors: "#10b981",
    default: "#ef4444",
  }
  return colors[category] || colors.default
}

export default function MapView({ user }: MapViewProps) {
  const [events, setEvents] = useState<HuddleEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<HuddleEvent | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 37.7749, lng: -122.4194 })
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const [activeCategory, setActiveCategory] = useState("All");

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
  const darkMapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_STYLE_MAP_ID;
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = { lat: position.coords.latitude, lng: position.coords.longitude }
        setUserLocation(location)
        setMapCenter(location)
      },
      () => {
        setUserLocation({ lat: 37.7749, lng: -122.4194 })
        setMapCenter({ lat: 37.7749, lng: -122.4194 })
      }
    )
  }, [])
  
  useEffect(() => {
    if (map) {
      map.setOptions({
        mapId: darkMapId,
      });
    }
  }, [map, darkMapId]);

  const fetchEventsInView = useCallback(async () => {
    if (!map) return;
    const bounds = map.getBounds();
    if (!bounds) return;
    const center = bounds.getCenter();
    const ne = bounds.getNorthEast();
    const radius = google.maps.geometry.spherical.computeDistanceBetween(center, ne);
    
    try {
      const response = await fetch(`/api/events?lat=${center.lat()}&lon=${center.lng()}&radius=${radius}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  }, [map]);

  useEffect(() => {
    if (map) {
        fetchEventsInView();
    }
  }, [map, fetchEventsInView]);
  
  const handleRecenter = useCallback(() => {
    if (userLocation && map) {
      map.panTo(userLocation)
      map.setZoom(17)
    }
  }, [userLocation, map]);

  const filteredEvents = useMemo(() => {
    if (activeCategory === 'All') return events;
    return events.filter(event => event.category === activeCategory);
  }, [events, activeCategory]);

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
    <div className="h-screen flex flex-col liquid-gradient" id="map-view">
      <div className="flex-1 relative">
        <APIProvider apiKey={mapsApiKey}>
           <Map
            onLoad={(map) => setMap(map)}
            defaultCenter={mapCenter}
            defaultZoom={17}
            className="w-full h-full"
            onIdle={fetchEventsInView}
            options={{
              disableDefaultUI: true,
              gestureHandling: "greedy",
              tilt: 45,
              mapId: mapId,
            }}
          >
            {userLocation && <AdvancedMarker position={userLocation} />}
            {filteredEvents.map((event) => (
              <AdvancedMarker
                key={event.id}
                position={{ lat: event.geopoint.latitude, lng: event.geopoint.longitude }}
                onClick={() => setSelectedEvent(event)}
              >
                <Pin
                  background={getCategoryColor(event.category)}
                  borderColor={event.isBoosted ? "#fbbf24" : "#ffffff"}
                  glyphColor="#ffffff"
                />
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>

        <div className="absolute top-4 left-4 right-4 z-10">
            <div className="flex items-center space-x-2 p-2 glass-surface rounded-full">
                <Chip isActive={activeCategory === 'All'} onClick={() => setActiveCategory('All')}>All</Chip>
                <Chip isActive={activeCategory === 'Sports'} onClick={() => setActiveCategory('Sports')}>Sports</Chip>
                <Chip isActive={activeCategory === 'Music'} onClick={() => setActiveCategory('Music')}>Music</Chip>
                <Chip isActive={activeCategory === 'Community'} onClick={() => setActiveCategory('Community')}>Community</Chip>

            </div>
        </div>

        <Button
            id="create-event-button"
            onClick={() => setShowCreateModal(true)}
            size="lg"
            className="absolute bottom-44 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg"
        >
            <Plus className="w-6 h-6" />
        </Button>

        <Button
            onClick={handleRecenter}
            variant="secondary"
            size="lg"
            className="absolute bottom-28 right-6 h-14 w-14 rounded-full shadow-lg"
        >
            <LocateFixed className="w-6 h-6" />
        </Button>
      </div>

      {selectedEvent && (
        <EventDetailsDrawer
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
