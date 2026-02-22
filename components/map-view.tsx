"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { Plus, MapPin, LocateFixed, AlertCircle, Loader2, Star, Calendar, Clock, Map as MapIcon, List } from "lucide-react"
import EventDetailsDrawer from "./event-details-drawer"
import CreateEventModal from "./create-event-modal"
import { EventCard } from "@/components/events/event-card"
import { APIProvider, Map, AdvancedMarker, Pin, useMap, InfoWindow } from "@vis.gl/react-google-maps"
import { GameEvent } from "@/lib/types"
import LocationSearchInput from "./location-search"
import { isToday, isWeekend, isBefore, addHours, isFuture } from "date-fns"

interface MapViewProps {
  user: any
  eventId?: string
}

const MapRenderer = ({ onMapLoad, children }: { onMapLoad: (map: google.maps.Map) => void, children: React.ReactNode }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      onMapLoad(map);
    }
  }, [map, onMapLoad]);
  return <>{children}</>;
}

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    Sports: "#f97316", Music: "#22c55e", Community: "#eab308", Learning: "#dc2626",
    "Food & Drink": "#8b5cf6", Tech: "#06b6d4", "Arts & Culture": "#ec4899",
    Outdoors: "#10b981", default: "#ef4444",
  }
  return colors[category] || colors.default
}

const getCategoryIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
    Sports: "⚽", Music: "🎵", Community: "🤝", Learning: "📚",
    "Food & Drink": "🍕", Tech: "💻", "Arts & Culture": "🎨",
    Outdoors: "🌲", default: "📍"
  }
  return icons[category] || icons.default
}

export default function MapView({ user, eventId }: MapViewProps) {
  const [events, setEvents] = useState<GameEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<GameEvent | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 37.7749, lng: -122.4194 })
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTime, setActiveTime] = useState("All");
  const [currentZoom, setCurrentZoom] = useState(18);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_STYLE_MAP_ID;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = position.coords.latitude;
        const newLng = position.coords.longitude;
        setUserLocation(prev =>
          prev?.lat === newLat && prev?.lng === newLng ? prev : { lat: newLat, lng: newLng }
        );
        setMapCenter(prev =>
          prev?.lat === newLat && prev?.lng === newLng ? prev : { lat: newLat, lng: newLng }
        );
      },
      () => {
        const defaultLat = 37.7749;
        const defaultLng = -122.4194;
        setUserLocation(prev =>
          prev?.lat === defaultLat && prev?.lng === defaultLng ? prev : { lat: defaultLat, lng: defaultLng }
        );
        setMapCenter(prev =>
          prev?.lat === defaultLat && prev?.lng === defaultLng ? prev : { lat: defaultLat, lng: defaultLng }
        );
      }
    )
  }, [])

  const fetchEventsInView = useCallback(async () => {
    if (!map) return;
    const bounds = map.getBounds();
    if (!bounds) return;

    // Fallback radius if geometry library is not loaded yet
    let radius = 50000;

    if (window.google?.maps?.geometry?.spherical) {
      const center = bounds.getCenter();
      const ne = bounds.getNorthEast();
      radius = window.google.maps.geometry.spherical.computeDistanceBetween(center, ne);
    }

    const center = bounds.getCenter();
    try {
      const fetchOptions: RequestInit = user ? { credentials: 'include' } : {};
      const response = await fetch(`/api/events?lat=${center.lat()}&lon=${center.lng()}&radius=${radius}`, fetchOptions);
      if (response.ok) {
        const data = await response.json();

        // Only update state if the events actually changed to prevent re-render loops
        setEvents(prev => {
          const newEventsIds = new Set(data.events.map((e: GameEvent) => e.id));
          const oldEventsIds = new Set(prev.map(e => e.id as string));
          if (newEventsIds.size !== oldEventsIds.size) return data.events || [];
          let changed = false;
          for (const id of newEventsIds as Set<string>) {
            if (!oldEventsIds.has(id)) { changed = true; break; }
          }
          return changed ? data.events || [] : prev;
        });
      }
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  }, [map]);

  // Deep Link handler: Pans map and opens drawer when eventId is supplied via URL
  useEffect(() => {
    if (eventId && map && !selectedEvent) {
      const fetchAndFocusEvent = async () => {
        try {
          const fetchOptions: RequestInit = user ? {
            headers: { "Authorization": `Bearer ${await user.getIdToken()}` }
          } : {};

          const response = await fetch(`/api/events/${eventId}/details`, fetchOptions);
          if (response.ok) {
            const event: GameEvent = await response.json();
            if (event.geopoint) {
              map.panTo({ lat: event.geopoint.latitude, lng: event.geopoint.longitude });
              map.setZoom(18);
              setSelectedEvent(event);
            }
          }
        } catch (error) {
          console.error("Failed to fetch deep linked event:", error);
        }
      };
      fetchAndFocusEvent();
    }
  }, [user, eventId, map, selectedEvent]);

  // Debounce the map idle event to prevent spamming the API when dragging/zooming rapidly
  const debouncedFetchEventsInView = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (map) setCurrentZoom(map.getZoom() || 18);
        fetchEventsInView();
      }, 500); // Wait 500ms after the map stops moving before fetching
    };
  }, [fetchEventsInView, map]);

  const handleGlobalSearchSelect = useCallback(
    (place: google.maps.places.PlaceResult | null) => {
      if (place?.geometry?.location && map) {
        map.panTo({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        map.setZoom(15);
      }
    },
    [map]
  );

  const handleRecenter = useCallback(() => {
    if (userLocation && map) {
      map.panTo(userLocation);
      map.setZoom(18);
    }
  }, [userLocation, map]);

  const filteredEvents = useMemo(() => {
    let result = events;

    if (activeCategory !== 'All') {
      result = result.filter(event => event.category === activeCategory);
    }

    if (activeTime !== 'All') {
      const now = new Date();
      result = result.filter(event => {
        if (!event.date || event.date.includes('/')) return true; // skip badly formatted legacy data

        try {
          const eventDateTime = new Date(`${event.date}T${event.time || '00:00'}`);
          if (isNaN(eventDateTime.getTime())) return true;

          if (activeTime === 'Next 2 Hrs') {
            return isBefore(eventDateTime, addHours(now, 2)) && isFuture(eventDateTime);
          }
          if (activeTime === 'Today') {
            return isToday(eventDateTime);
          }
          if (activeTime === 'This Weekend') {
            return isWeekend(eventDateTime) && isFuture(eventDateTime);
          }
        } catch (e) {
          // ignore parsing error
        }
        return true;
      });
    }

    return result;
  }, [events, activeCategory, activeTime]);

  if (!mapsApiKey) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center p-4 text-center">
        <div className="glass-surface rounded-lg p-6">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-50 mb-2">Maps Configuration Error</h1>
          <p className="text-slate-300">Google Maps API key is missing. Please check your environment variables.</p>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="min-h-screen liquid-gradient flex items-center justify-center text-center">
        <div className="glass-surface rounded-lg p-6">
          <Loader2 className="w-8 h-8 text-slate-50 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Getting Location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col liquid-gradient" id="map-view">
      <APIProvider apiKey={mapsApiKey} libraries={['geometry', 'places']}>
        <div className="flex-1 relative">
          <div className={`w-full h-full transition-opacity duration-300 ${viewMode === 'map' ? 'opacity-100 relative z-0' : 'opacity-0 absolute -z-10 pointer-events-none'}`}>
            <Map
              onIdle={debouncedFetchEventsInView}
              defaultCenter={mapCenter}
              defaultZoom={18}
              className="w-full h-full"
              disableDefaultUI={true}
              mapId={mapId}
              tilt={40} // <-- FIX: Added the tilt property for a 3D view
            >
              <MapRenderer onMapLoad={setMap}>
                {map && (
                  <>
                    {userLocation && <AdvancedMarker position={userLocation} />}
                    {filteredEvents.map((event: GameEvent) => {
                      const isHovered = hoveredEvent?.id === event.id;
                      const showDetails = isHovered || currentZoom >= 16;

                      return (
                        <AdvancedMarker
                          key={event.id}
                          position={{ lat: event.geopoint.latitude, lng: event.geopoint.longitude }}
                          onClick={() => setSelectedEvent(event)}
                          onMouseEnter={() => setHoveredEvent(event)}
                          onMouseLeave={() => setHoveredEvent(null)}
                          style={{ zIndex: isHovered ? 50 : (showDetails ? 10 : 0) }}
                        >
                          <div className={`transition-all duration-300 transform origin-bottom ${isHovered ? 'scale-110' : ''}`}>
                            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full shadow-lg border border-white/20 text-white backdrop-blur-md transition-colors ${isHovered ? 'bg-slate-900 border-primary drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-900/80'}`}>
                              {/* Inner Emoji Circle */}
                              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 shrink-0">
                                <span className="text-sm leading-none">{getCategoryIcon(event.category)}</span>
                              </div>

                              {/* Expanded Details Wrapper */}
                              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showDetails ? 'max-w-[200px] opacity-100 mr-2' : 'max-w-0 opacity-0 mr-0'}`}>
                                <div className="flex flex-col whitespace-nowrap min-w-[100px]">
                                  <span className="font-bold text-xs max-w-[150px] truncate">{event.name}</span>
                                  <div className="flex items-center justify-between mt-0.5">
                                    <span className="text-[10px] text-slate-300 font-medium">{event.time}</span>
                                    {isHovered && currentZoom < 16 && (
                                      <span className="text-[9px] text-primary font-bold">Open</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Anchor Triange */}
                            <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-white/20 ${isHovered ? 'bg-slate-900' : 'bg-slate-900/80'} backdrop-blur-md z-[-1]`}></div>
                          </div>
                        </AdvancedMarker>
                      );
                    })}
                  </>
                )}
              </MapRenderer>
            </Map>
          </div>

          <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2 pointer-events-none">
            {/* Search Bar */}
            <div className="glass-surface border border-white/10 rounded-xl overflow-hidden shadow-lg p-1 pointer-events-auto">
              <LocationSearchInput onPlaceSelect={handleGlobalSearchSelect} />
            </div>

            {/* Category Chips and Toggle */}
            <div className="flex items-center justify-between w-full space-x-2 pointer-events-auto">
              <div className="flex items-center space-x-2 p-2 glass-surface rounded-full overflow-x-auto no-scrollbar flex-1">
                <Chip isActive={activeCategory === 'All'} onClick={() => setActiveCategory('All')}>All</Chip>
                <Chip isActive={activeCategory === 'Sports'} onClick={() => setActiveCategory('Sports')}>Sports</Chip>
                <Chip isActive={activeCategory === 'Music'} onClick={() => setActiveCategory('Music')}>Music</Chip>
                <Chip isActive={activeCategory === 'Community'} onClick={() => setActiveCategory('Community')}>Community</Chip>
              </div>

              <div className="flex items-center p-1 glass-surface rounded-full shadow-lg shrink-0">
                <Button variant="ghost" size="icon" className={`rounded-full h-9 w-9 ${viewMode === 'map' ? 'bg-primary text-primary-foreground' : 'text-slate-300 hover:text-white'}`} onClick={() => setViewMode('map')}>
                  <MapIcon className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className={`rounded-full h-9 w-9 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-slate-300 hover:text-white'}`} onClick={() => setViewMode('list')}>
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Time Filter Chips */}
            <div className="flex items-center space-x-2 p-2 glass-surface rounded-full overflow-x-auto no-scrollbar pointer-events-auto">
              <Chip isActive={activeTime === 'All'} onClick={() => setActiveTime('All')}>All</Chip>
              <Chip isActive={activeTime === 'Next 2 Hrs'} onClick={() => setActiveTime('Next 2 Hrs')}>Next 2 Hrs</Chip>
              <Chip isActive={activeTime === 'Today'} onClick={() => setActiveTime('Today')}>Today</Chip>
              <Chip isActive={activeTime === 'This Weekend'} onClick={() => setActiveTime('This Weekend')}>This Weekend</Chip>
            </div>
          </div>

          {viewMode === 'list' && (
            <div className="absolute inset-0 z-0 pt-[120px] px-4 pb-24 overflow-y-auto no-scrollbar pointer-events-auto">
              {filteredEvents.length === 0 ? (
                <div className="text-center text-slate-400 mt-10">
                  <p>No events found in this area.</p>
                  <p className="text-sm mt-2 opacity-70">Try zooming out on the map or searching a new location.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} onSelectEvent={setSelectedEvent} showMapButton={true} />
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === 'map' && user && (
            <Button id="create-event-button" onClick={() => setShowCreateModal(true)} size="lg" className="absolute bottom-44 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform">
              <Plus className="w-6 h-6" />
            </Button>
          )}

          {viewMode === 'map' && (
            <Button onClick={handleRecenter} variant="secondary" size="lg" className="absolute bottom-28 right-6 h-14 w-14 rounded-full shadow-lg">
              <LocateFixed className="w-6 h-6" />
            </Button>
          )}
        </div>

        {selectedEvent && <EventDetailsDrawer event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} onEventUpdated={() => { }} />}
        {showCreateModal && <CreateEventModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onEventCreated={() => { }} userLocation={userLocation} />}
      </APIProvider>
    </div>
  )
}
