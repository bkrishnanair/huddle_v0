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
  initialCenter?: { lat: number; lng: number }
}

const MapRenderer = ({ onMapLoad, children, styles }: { onMapLoad: (map: google.maps.Map) => void, children: React.ReactNode, styles?: google.maps.MapTypeStyle[] }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      if (styles) {
        map.setOptions({
          styles: styles,
          backgroundColor: '#010b13',
          // @ts-ignore - for newer Maps API features
          colorScheme: 'DARK'
        });
      }
      onMapLoad(map);
    }
  }, [map, onMapLoad, styles]);


  useEffect(() => {
    if (!map) return;

    const mapDiv = map.getDiv();
    let trackpadPanActive = false;
    let panTimeout: ReturnType<typeof setTimeout>;

    const handleWheel = (e: WheelEvent) => {
      // ctrlKey means pinch-to-zoom on trackpad. Let Google handle it (zoom).
      if (e.ctrlKey || e.metaKey) return;

      // If we detect horizontal movement, lock into pan mode for this scroll session.
      // This prevents accidental zooming when a diagonal swipe briefly becomes vertical.
      if (Math.abs(e.deltaX) > 0.5 || trackpadPanActive) {
        trackpadPanActive = true;
        clearTimeout(panTimeout);
        panTimeout = setTimeout(() => { trackpadPanActive = false; }, 150);

        e.preventDefault();
        e.stopPropagation();
        map.panBy(e.deltaX, e.deltaY);
      }
    };

    // Use capture to intercept before Google's internal listeners zoom the map
    mapDiv.addEventListener("wheel", handleWheel, { passive: false, capture: true });

    return () => {
      mapDiv.removeEventListener("wheel", handleWheel, { capture: true } as EventListenerOptions);
      clearTimeout(panTimeout);
    };
  }, [map]);

  return <>{children}</>;
}

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    Sports: "#f59e0b", // Amber
    Music: "#10b981", // Emerald
    Community: "#0ea5e9", // Sky
    Learning: "#6366f1", // Indigo
    "Food & Drink": "#f43f5e", // Rose
    Tech: "#06b6d4", // Cyan
    "Arts & Culture": "#d946ef", // Fuchsia
    Outdoors: "#84cc16", // Lime
    default: "#f59e0b",
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

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#010b13" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#010b13" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#002020" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#0b2233" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#feffff" }, { visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#14334a" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#010103" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.medical",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.school",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.government",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.place_of_worship",
    stylers: [{ visibility: "off" }],
  },
];

export default function MapView({ user, eventId, initialCenter }: MapViewProps) {
  const [events, setEvents] = useState<GameEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<GameEvent | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(initialCenter || { lat: 38.9897, lng: -76.9378 }) // College Park, MD
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTime, setActiveTime] = useState("All");
  const [currentZoom, setCurrentZoom] = useState(initialCenter ? 17 : 13);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [hasCenteredDefault, setHasCenteredDefault] = useState(!!initialCenter);

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_STYLE_MAP_ID;

  useEffect(() => {
    // Check if the prompt was previously dismissed
    if (sessionStorage.getItem('huddlePromptDismissed') !== 'true') {
      setShowLocationPrompt(true);
    }
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

  useEffect(() => {
    if (map && !hasCenteredDefault && !userLocation && !eventId) {
      const savedCenterStr = sessionStorage.getItem('huddleMapCenter');
      const savedZoomStr = sessionStorage.getItem('huddleMapZoom');

      if (savedCenterStr && savedZoomStr) {
        try {
          const savedCenter = JSON.parse(savedCenterStr);
          map.setCenter(savedCenter);
          map.setZoom(Number(savedZoomStr));
        } catch (e) {
          map.setCenter({ lat: 38.9897, lng: -76.9378 });
          map.setZoom(13);
        }
      } else {
        map.setCenter({ lat: 38.9897, lng: -76.9378 });
        map.setZoom(13);
      }
      setHasCenteredDefault(true);
    }
  }, [map, hasCenteredDefault, userLocation, eventId]);

  // Deep Link handler: Pans map and opens drawer when eventId is supplied via URL
  useEffect(() => {
    if (eventId && map && !selectedEvent) {
      const fetchAndFocusEvent = async () => {
        try {
          // Temporarily disable the hasCenteredDefault so it doesn't fight this request
          setHasCenteredDefault(true);

          let fetchOptions: RequestInit = {};

          try {
            // Wrap auth check so unauthenticated users can still deep link
            if (user) {
              const token = await user.getIdToken();
              if (token) {
                fetchOptions = { headers: { "Authorization": `Bearer ${token}` } };
              }
            }
          } catch (e) { }

          const response = await fetch(`/api/events/${eventId}/details`, fetchOptions);
          if (response.ok) {
            const event: GameEvent = await response.json();
            if (event.geopoint) {
              // Only pan/zoom if we don't have an initialCenter (which already set the view)
              if (!initialCenter) {
                map.setCenter({ lat: event.geopoint.latitude, lng: event.geopoint.longitude });
                map.setZoom(17);
              }
              setSelectedEvent(event);
            }
          }
        } catch (error) {
          console.error("Failed to fetch deep linked event:", error);
        }
      };
      fetchAndFocusEvent();
    }
  }, [user, eventId, map, selectedEvent, initialCenter]);

  // Debounce the map idle event to prevent spamming the API when dragging/zooming rapidly
  const debouncedFetchEventsInView = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (map) {
          const z = map.getZoom() || 18;
          setCurrentZoom(z);
          const c = map.getCenter();
          if (c) {
            sessionStorage.setItem('huddleMapCenter', JSON.stringify({ lat: c.lat(), lng: c.lng() }));
            sessionStorage.setItem('huddleMapZoom', z.toString());
          }
        }
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

  const dismissPrompt = useCallback(() => {
    setShowLocationPrompt(false);
    sessionStorage.setItem('huddlePromptDismissed', 'true');
  }, []);

  const handleRecenter = useCallback(() => {
    dismissPrompt();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          if (map) {
            map.panTo(loc);
            map.setZoom(15);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [map]);

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

    const sorted = result.filter(event => {
      if (!event.date || event.date.includes('/')) return true;
      try {
        const eventDateTime = new Date(`${event.date}T${event.time || '00:00'}`);
        if (!isNaN(eventDateTime.getTime())) {
          return isFuture(addHours(eventDateTime, 1));
        }
      } catch (e) { }
      return true;
    });

    return sorted.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      return dateA - dateB;
    });
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

  return (
    <div className="h-screen flex flex-col liquid-gradient" id="map-view">
      <APIProvider apiKey={mapsApiKey} libraries={['geometry', 'places']}>
        <div className="flex-1 relative">
          <div className={`w-full h-full transition-opacity duration-300 ${viewMode === 'map' ? 'opacity-100 relative z-0' : 'opacity-0 absolute -z-10 pointer-events-none'}`}>
            <Map
              onIdle={debouncedFetchEventsInView}
              defaultCenter={mapCenter}
              defaultZoom={13}
              className="w-full h-full"
              disableDefaultUI={true}
              mapId={mapId}
              styles={DARK_MAP_STYLE}
              // @ts-ignore
              colorScheme="DARK"
              gestureHandling={'greedy'}
            >
              <MapRenderer onMapLoad={setMap} styles={DARK_MAP_STYLE}>
                {map && (
                  <>
                    {userLocation && <AdvancedMarker position={userLocation} />}
                    {!userLocation && (
                      <AdvancedMarker position={{ lat: 38.9897, lng: -76.9378 }}>
                        <div className="flex flex-col items-center">
                          <div className="bg-primary/20 backdrop-blur-sm border border-primary/50 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                            College Park
                          </div>
                          <div className="w-3 h-3 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse" />
                        </div>
                      </AdvancedMarker>
                    )}
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
                            <div
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full shadow-lg border transition-all duration-300 ${isHovered
                                ? 'border-white text-white scale-105'
                                : 'border-transparent text-white'
                                }`}
                              style={{
                                backgroundColor: getCategoryColor(event.category),
                                boxShadow: `0 0 20px ${getCategoryColor(event.category)}${isHovered ? 'aa' : '66'}`
                              }}
                            >
                              {/* Colored Glow Ring -> Now a subtle white overlay */}
                              <div
                                className="flex items-center justify-center w-7 h-7 rounded-full shrink-0 bg-white/25"
                              >
                                <span className="text-sm leading-none">{getCategoryIcon(event.category)}</span>
                              </div>

                              {/* Expanded Details Wrapper */}
                              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showDetails ? 'max-w-[200px] opacity-100 mr-2' : 'max-w-0 opacity-0 mr-0'}`}>
                                <div className="flex flex-col whitespace-nowrap min-w-[100px]">
                                  <span className="font-bold text-xs max-w-[150px] truncate">{event.name}</span>
                                  <div className="flex items-center justify-between mt-0.5">
                                    <span className="text-[10px] text-white/80 font-medium">{event.time}</span>
                                    {isHovered && currentZoom < 16 && (
                                      <span className="text-[9px] text-white font-black bg-black/20 px-1.5 rounded-sm">OPEN</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Anchor Triange */}
                            <div
                              className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b z-[-1] transition-colors duration-300`}
                              style={{
                                backgroundColor: getCategoryColor(event.category),
                                borderColor: isHovered ? '#ffffff' : getCategoryColor(event.category) // Match outline on hover
                              }}
                            ></div>
                          </div>
                        </AdvancedMarker>
                      );
                    })}
                  </>
                )}
              </MapRenderer>
            </Map>
          </div>

          <div className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-3 pointer-events-none">
            {/* Header: Search Bar & Toggle */}
            <div className="flex items-center gap-3 w-full pointer-events-auto">
              {/* Search Bar */}
              <div className="flex-1 glass-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-1">
                <LocationSearchInput onPlaceSelect={handleGlobalSearchSelect} />
              </div>

              {/* View Toggle */}
              <div className="flex items-center p-1 glass-surface border border-white/10 rounded-2xl shadow-2xl shrink-0">
                <Button variant="ghost" size="icon" className={`rounded-xl h-10 w-10 ${viewMode === 'map' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-slate-300 hover:text-white'} ${viewMode === 'list' ? 'animate-pulse' : ''}`} onClick={() => setViewMode('map')}>
                  <MapIcon className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className={`rounded-xl h-10 w-10 ${viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-slate-300 hover:text-white'}`} onClick={() => setViewMode('list')}>
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Filter Group: Category and Time */}
            <div className="flex flex-col gap-2 pointer-events-auto">
              {/* Category Chips */}
              <div className="flex items-center space-x-2 p-1.5 glass-surface border border-white/10 rounded-full overflow-x-auto no-scrollbar max-w-max shadow-xl">
                <Chip isActive={activeCategory === 'All'} onClick={() => setActiveCategory('All')}>All</Chip>
                <Chip isActive={activeCategory === 'Sports'} onClick={() => setActiveCategory('Sports')}>Sports</Chip>
                <Chip isActive={activeCategory === 'Music'} onClick={() => setActiveCategory('Music')}>Music</Chip>
                <Chip isActive={activeCategory === 'Community'} onClick={() => setActiveCategory('Community')}>Community</Chip>
              </div>

              {/* Time Filter Chips */}
              <div className="flex items-center space-x-2 p-1.5 glass-surface border border-white/10 rounded-full overflow-x-auto no-scrollbar max-w-max shadow-xl">
                <Chip isActive={activeTime === 'All'} onClick={() => setActiveTime('All')}>All</Chip>
                <Chip isActive={activeTime === 'Next 2 Hrs'} onClick={() => setActiveTime('Next 2 Hrs')}>Next 2 Hrs</Chip>
                <Chip isActive={activeTime === 'Today'} onClick={() => setActiveTime('Today')}>Today</Chip>
                <Chip isActive={activeTime === 'This Weekend'} onClick={() => setActiveTime('This Weekend')}>This Weekend</Chip>
              </div>
            </div>

            {/* Location Permission Toast/Prompt */}
            {showLocationPrompt && !userLocation && (
              <div className="absolute top-48 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-sm pointer-events-auto">
                <div className="glass-surface border border-primary/30 p-4 rounded-3xl shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-sm">Find events near you</h4>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                        Enable location to instantly discover what's happening in your neighborhood.
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={handleRecenter}
                          className="bg-primary hover:bg-orange-600 text-white text-xs font-bold rounded-full px-4"
                        >
                          Share Location
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={dismissPrompt}
                          className="text-slate-400 hover:text-white text-xs px-2"
                        >
                          Not now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {viewMode === 'list' && (
            <div
              className="absolute inset-0 z-10 pt-[190px] px-4 pb-28 overflow-y-auto no-scrollbar pointer-events-auto bg-slate-950/60 backdrop-blur-md cursor-pointer"
              onClick={() => setViewMode('map')}
            >
              <div className="max-w-4xl mx-auto cursor-default" onClick={(e) => e.stopPropagation()}>
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
            </div>
          )}

          {viewMode === 'map' && user && (
            <Button id="create-event-button" onClick={() => setShowCreateModal(true)} size="lg" className="absolute bottom-60 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform z-10">
              <Plus className="w-6 h-6" />
            </Button>
          )}

          {viewMode === 'map' && (
            <Button onClick={handleRecenter} variant="default" size="lg" className="absolute bottom-44 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-orange-600 hover:scale-110 transition-all z-10">
              <LocateFixed className="w-6 h-6" />
            </Button>
          )}
        </div>

        {selectedEvent && <EventDetailsDrawer event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} onEventUpdated={() => { }} />}
        {showCreateModal && <CreateEventModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onEventCreated={() => { }} userLocation={userLocation || mapCenter} />}
      </APIProvider>
    </div>
  )
}
