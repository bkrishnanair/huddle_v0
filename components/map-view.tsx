"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { Plus, MapPin, LocateFixed, AlertCircle } from "lucide-react"
import EventDetailsDrawer from "./event-details-drawer"
import CreateEventModal from "./create-event-modal"
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps"
import { mapStyles } from "@/lib/map-styles"
import { GameEvent as HuddleEvent } from "@/lib/types"
import EventMarker from "./events/event-marker"

interface EventsMapProps {
  events: HuddleEvent[];
  onEventClick: (event: HuddleEvent) => void;
  userLocation: { lat: number; lng: number } | null;
  onIdle: (map: google.maps.Map) => void;
}

function EventsMap({ events, onEventClick, userLocation, onIdle }: EventsMapProps) {
    const map = useMap();

    useEffect(() => {
        if (map) {
            const idleListener = map.addListener('idle', () => onIdle(map));
            return () => {
                google.maps.event.removeListener(idleListener);
            };
        }
    }, [map, onIdle]);

    const useV2Markers = process.env.NEXT_PUBLIC_FEATURE_MARKERS_V2 === 'true';

    return (
        <>
            {userLocation && <AdvancedMarker position={userLocation} />}
            {events.map((event) => {
              if (useV2Markers) {
                return (
                  <AdvancedMarker
                    key={event.id}
                    position={{ lat: event.latitude, lng: event.longitude }}
                  >
                    <EventMarker
                      event={event}
                      zoom={map?.getZoom() || 17}
                      onClick={() => onEventClick(event)}
                    />
                  </AdvancedMarker>
                )
              } else {
                return (
                  <AdvancedMarker
                    key={event.id}
                    position={{ lat: event.latitude, lng: event.longitude }}
                    onClick={() => onEventClick(event)}
                  />
                )
              }
            })}
        </>
    )
}

export default function MapView({ user }: { user: any }) {
  const [events, setEvents] = useState<HuddleEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<HuddleEvent | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 37.7749, lng: -122.4194 })
  const [isMounted, setIsMounted] = useState(false); // Hydration fix
  
  const [activeSport, setActiveSport] = useState("All");

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID

  useEffect(() => {
    setIsMounted(true); // Hydration fix: ensure this only runs on the client
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

  const fetchEventsInView = useCallback(async (map: google.maps.Map) => {
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
  }, []);
  
  const handleRecenter = useCallback((map: google.maps.Map | null) => {
    if (userLocation && map) {
      map.panTo(userLocation)
      map.setZoom(17)
    }
  }, [userLocation]);

  const filteredEvents = useMemo(() => {
    if (activeSport === 'All') return events;
    return events.filter(event => event.sport === activeSport);
  }, [events, activeSport]);

  // Hydration fix: Render a loading state until the component is mounted on the client
  if (!isMounted) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="glass-surface rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-slate-50" />
          </div>
          <p className="text-slate-300 drop-shadow">Loading Map...</p>
        </div>
      </div>
    );
  }

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
            mapId={mapId}
            defaultCenter={mapCenter}
            defaultZoom={17}
            className="w-full h-full"
            // Corrected: Pass map options as direct props, not in an 'options' object
            disableDefaultUI={true}
            styles={mapStyles}
            gestureHandling="greedy"
            tilt={45}
          >
            <EventsMap 
                events={filteredEvents} 
                onEventClick={setSelectedEvent} 
                userLocation={userLocation}
                onIdle={fetchEventsInView}
            />
          </Map>
        </APIProvider>

        <div className="absolute top-4 left-4 right-4 z-10">
            <div className="flex items-center space-x-2 p-2 glass-surface rounded-full">
                <Chip isActive={activeSport === 'All'} onClick={() => setActiveSport('All')}>All</Chip>
                <Chip isActive={activeSport === 'Basketball'} onClick={() => setActiveSport('Basketball')}>Basketball</Chip>
                <Chip isActive={activeSport === 'Soccer'} onClick={() => setActiveSport('Soccer')}>Soccer</Chip>
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
            onClick={() => handleRecenter(useMap())}
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
