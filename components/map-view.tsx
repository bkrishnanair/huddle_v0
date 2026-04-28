"use client"

import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { Plus, MapPin, LocateFixed, AlertCircle, Loader2, Star, Calendar, Clock, Map as MapIcon, List, Search } from "lucide-react"
import { useTheme } from "next-themes"
import EventDetailsDrawer from "./event-details-drawer"
import CreateEventModal from "./create-event-modal"
import OnboardingTooltip from "./onboarding-tooltip"
import { EventCard } from "@/components/events/event-card"
import { Map, AdvancedMarker, Pin, useMap, InfoWindow } from "@vis.gl/react-google-maps"
import { GameEvent } from "@/lib/types"
import LocationSearchInput from "./location-search"
import { isToday, isWeekend, isBefore, addHours, isFuture, addDays, endOfWeek, startOfDay } from "date-fns"
import { toast } from "sonner"
import { formatTime, getCategoryColor, isEventLive } from "@/lib/utils"
import DotPin from "./map-pins/dot-pin"
import MediumPin from "./map-pins/medium-pin"
import LivePin from "./map-pins/live-pin"
import { MapListPanel } from "@/components/map-list-panel"

interface MapViewProps {
  user: any
  eventId?: string
  initialCenter?: { lat: number; lng: number }
  intent?: string
}

const MapRenderer = ({ onMapLoad, children, isDarkMode }: { onMapLoad: (map: google.maps.Map) => void, children: React.ReactNode, isDarkMode: boolean }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.setOptions({

        backgroundColor: isDarkMode ? '#010b13' : '#ffffff',
        // @ts-ignore - for newer Maps API features
        colorScheme: isDarkMode ? 'DARK' : 'LIGHT'
      });
      onMapLoad(map);
    }
  }, [map, onMapLoad, isDarkMode]);


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
  }, [map]);

  return <>{children}</>;
};

const CATEGORIES = ['All', 'Joined', 'Recommended', '🖥️ Virtual', 'Sports', 'Music', 'Community', 'Learning', 'Food & Drink', 'Tech', 'Arts & Culture', 'Outdoors']
const TIMES = ['All', 'Live', 'Today', 'This Week', 'This Weekend', 'This Month']


const getCategoryIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
    Sports: "⚽", Music: "🎵", Community: "🤝", Learning: "📚",
    "Food & Drink": "🍕", Tech: "💻", "Arts & Culture": "🎨",
    Outdoors: "🌲", default: "📍"
  }
  return icons[category] || icons.default
}

export default function MapView({ user, eventId, initialCenter, intent }: MapViewProps) {
  const router = useRouter()
  const isProcessingDeepLink = useRef(!!eventId)
  const deepLinkProcessed = useRef(false)
  const profileFetchAttempted = useRef(false)
  const [events, setEvents] = useState<GameEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<GameEvent | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(initialCenter || { lat: 38.9897, lng: -76.9378 }) // College Park, MD
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTime, setActiveTime] = useState("All");
  const [currentZoom, setCurrentZoom] = useState(initialCenter ? 23 : 23);
  const [showListPanel, setShowListPanel] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [hasCenteredDefault, setHasCenteredDefault] = useState(!!initialCenter);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || theme === 'system';
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiKeywords, setAiKeywords] = useState<string[]>([]);
  const [eventSearchQuery, setEventSearchQuery] = useState("");

  // Session-level deduplication for view tracking (also fires in event-details-drawer as backup)
  const viewedEventIds = useRef<Set<string>>(new Set());

  const trackEventView = useCallback((eventId: string) => {
    if (!viewedEventIds.current.has(eventId)) {
      viewedEventIds.current.add(eventId);
      fetch(`/api/events/${eventId}/view`, { method: 'POST' }).catch(() => { });
    }
  }, []);

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_STYLE_MAP_ID;

  // External Header Search Listener
  useEffect(() => {
    const handleHeaderSearch = (e: any) => {
      const place = e.detail.place;
      if (place?.geometry?.location) {
        handleGlobalSearchSelect(place);
      }
    };
    const handleHeaderAiSearch = (e: any) => {
      handleAiSearch(e.detail.query);
    };
    const handleTextSearch = (e: any) => {
      setEventSearchQuery(e.detail.query);
    };

    window.addEventListener('huddle-map-search', handleHeaderSearch);
    window.addEventListener('huddle-map-ai-search', handleHeaderAiSearch);
    window.addEventListener('huddle-text-search', handleTextSearch);
    return () => {
      window.removeEventListener('huddle-map-search', handleHeaderSearch);
      window.removeEventListener('huddle-map-ai-search', handleHeaderAiSearch);
      window.removeEventListener('huddle-text-search', handleTextSearch);
    };
  }, [map]);

  useEffect(() => {
    // Show prompt if we aren't deep linking
    if (!eventId) {
      let isDismissed = false;
      try {
        isDismissed = sessionStorage.getItem('huddlePromptDismissed') === 'true';
      } catch (e) {
        console.warn("Storage restricted", e);
      }
      if (!isDismissed) {
        setShowLocationPrompt(true);
      }
    }

    // Unauthenticated Host Flow
    if (intent === 'create' && !user) {
      toast.error("Please sign in or create an account to host an event.");
      // We delay the redirect slightly to allow the toast to be seen
      setTimeout(() => {
        router.push('/login?return_to=/map?intent=create');
      }, 1500)
    } else if (intent === 'create' && user) {
      setShowCreateModal(true)
    }
  }, [intent, user, eventId, router])

  const fetchEventsInView = useCallback(async () => {
    if (!map) return;
    const bounds = map.getBounds();
    if (!bounds) return;

    if (user?.uid && !userProfile && !profileFetchAttempted.current) {
      profileFetchAttempted.current = true;
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/users/${user.uid}/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.profile) setUserProfile(data.profile);
        }
      } catch (err) {
        console.error("Error fetching user profile for map", err);
      }
    }

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
    if (eventId && map && !selectedEvent && !deepLinkProcessed.current) {
      const fetchAndFocusEvent = async () => {
        isProcessingDeepLink.current = true; // Lock the map
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
            if (event.geopoint && typeof event.geopoint.latitude === 'number' && isFinite(event.geopoint.latitude) && typeof event.geopoint.longitude === 'number' && isFinite(event.geopoint.longitude)) {
              // Override map centering for deep links to ensure it pans correctly
              map.panTo({ lat: event.geopoint.latitude, lng: event.geopoint.longitude });
              map.setZoom(18);
              // Store the deep link center so handleRecenter knows not to override it initially
              sessionStorage.setItem('huddleMapCenter', JSON.stringify({ lat: event.geopoint.latitude, lng: event.geopoint.longitude }));
              // Only open drawer if not coming from a 'locate' intent (e.g. map button on event cards)
              if (intent !== 'locate') {
                setSelectedEvent(event);
              }
              deepLinkProcessed.current = true;

              // Prevent default center from re-running (but don't set user physical location)
              setHasCenteredDefault(true);

              // Fetch events in the new viewport after a brief delay for map to settle
              setTimeout(() => fetchEventsInView(), 800);
            } else {
              // Virtual event or no geopoint — still open the drawer
              setSelectedEvent(event);
              deepLinkProcessed.current = true;
            }
          }
        } catch (error) {
          console.error("Failed to fetch deep linked event:", error);
        } finally {
          // Unlock the map so manual user actions (like the Locate Me button) work again
          isProcessingDeepLink.current = false;
        }
      };
      fetchAndFocusEvent();
    }
  }, [user, eventId, map, selectedEvent, intent]);

  // Fix: Always fetch pins once the map is initialized, even before user interacts
  useEffect(() => {
    if (map) {
      // Small delay to let the map finish rendering
      const timer = setTimeout(() => fetchEventsInView(), 300);
      return () => clearTimeout(timer);
    }
  }, [map, fetchEventsInView]);

  // Show onboarding for first-time visitors after map loads
  useEffect(() => {
    if (map && !localStorage.getItem('huddle_onboarding_complete')) {
      const timer = setTimeout(() => setShowOnboarding(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [map]);

  // Debounce the map idle event to prevent spamming the API when dragging/zooming rapidly
  const debouncedFetchEventsInView = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (map) {
          const z = map.getZoom() || 18;
          setCurrentZoom(z);

          if (z > 18) {
            if (map.getTilt() !== 45) map.setTilt(45);
          } else {
            if (map.getTilt() !== 0) map.setTilt(0);
          }

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
        map.setZoom(19);
      }
    },
    [map]
  );

  const handleAiSearch = async (query: string) => {
    setIsAiSearching(true);
    setAiKeywords([]);
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      const filters = data.filters;

      if (filters.categories && filters.categories.length > 0) {
        setActiveCategory(filters.categories[0]);
      } else {
        setActiveCategory('All');
      }

      if (filters.timeFilter) {
        const timeMap: Record<string, string> = {
          'live': 'Live', 'today': 'Today', 'this_week': 'This Week', 'this_weekend': 'This Weekend', 'this_month': 'This Month'
        };
        setActiveTime(timeMap[filters.timeFilter] || 'All');
      } else {
        setActiveTime('All');
      }

      if (filters.keywords && filters.keywords.length > 0) {
        setAiKeywords(filters.keywords);
      }

      toast.success(`AI Search: Filtered for "${query}" ✨`);
    } catch (e) {
      toast.error('AI Search failed. Try a regular search.');
    } finally {
      setIsAiSearching(false);
    }
  };

  const dismissPrompt = useCallback(() => {
    setShowLocationPrompt(false);
    try {
      sessionStorage.setItem('huddlePromptDismissed', 'true');
    } catch (e) {
      console.warn("sessionStorage not available", e);
    }
  }, []);

  const handleRecenter = useCallback(() => {
    dismissPrompt();
    toast.info("Locating you...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          if (map) {
            map.panTo(loc);
            map.setZoom(16);
          }

          // Silently update backend anchor for Serendipity Engine
          if (user) {
            let shouldSync = true;
            try {
              const lastSyncStr = localStorage.getItem(`lastLocationSync_${user.uid}`);
              if (lastSyncStr) {
                const lastSync = JSON.parse(lastSyncStr);
                // Calculate distance if Google Maps geometry is loaded
                if (window.google?.maps?.geometry?.spherical) {
                  const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
                    new window.google.maps.LatLng(loc.lat, loc.lng),
                    new window.google.maps.LatLng(lastSync.lat, lastSync.lng)
                  );
                  // Only sync if user moved more than 500 meters
                  if (distance < 500) {
                    shouldSync = false;
                    console.log("Skipping location sync, distance moved < 500m.");
                  }
                }
              }
            } catch (e) {
              console.warn("Could not read local sync state for location", e);
            }

            if (shouldSync) {
              user.getIdToken().then((token: string) => {
                fetch(`/api/users/${user.uid}/location`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(loc)
                }).then(res => {
                  if (res.ok) {
                    localStorage.setItem(`lastLocationSync_${user.uid}`, JSON.stringify(loc));
                  }
                }).catch((e: any) => console.error("Failed to sync location anchor", e));
              }).catch((e: any) => console.error("Failed to get token for location sync", e));
            }
          }
        },
        (error) => {
          const errMsg = error.message || String(error);
          console.error("Error getting location:", errMsg);
          if (errMsg.toLowerCase().includes("secure origin")) {
            toast.error("Location requires HTTPS or localhost. If testing on mobile, use local ngrok or search manually.");
          } else {
            toast.error("Unable to get location. Please enable location permissions.");
          }
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  }, [map, dismissPrompt]);

  // Shared Helper — wraps the canonical isEventLive() from lib/utils.
  // Kept as a local function since it's referenced widely in pin rendering. 
  const isEventOngoing = (event: GameEvent) => isEventLive(event);

  const filteredEvents = useMemo(() => {
    let result = events;

    // Text-based event name/location filter from the top bar search input
    if (eventSearchQuery.trim()) {
      const q = eventSearchQuery.toLowerCase();
      result = result.filter(event =>
        event.name?.toLowerCase().includes(q) ||
        (typeof event.location === 'string' && event.location.toLowerCase().includes(q)) ||
        event.category?.toLowerCase().includes(q)
      );
    }

    if (activeCategory === 'Joined') {
      result = result.filter(event => event.players?.includes(user?.uid))
    } else if (activeCategory === 'Recommended') {
      const interests = userProfile?.favoriteSports || [];
      // Merge profile interests with top 3 joined categories for broader recommendations
      const topJoined = (userProfile?.topCategories || []).map((c: any) => typeof c === 'string' ? c : c.category);
      const combined = [...new Set([...interests, ...topJoined])];
      if (combined.length === 0) {
        toast.error("Add interests to your profile to see recommended events!");
        // We will default to showing all if they have no interests, but ping the warning.
      } else {
        result = result.filter(event => combined.includes(event.category));
      }
    } else if (activeCategory === '🖥️ Virtual') {
      result = result.filter(event => event.eventType === 'virtual' || event.eventType === 'hybrid')
    } else if (activeCategory !== 'All') {
      result = result.filter(event => event.category === activeCategory);
    }

    if (aiKeywords.length > 0) {
      result = result.filter(event => {
        const searchText = `${event.name} ${event.description || ''} ${event.category}`.toLowerCase();
        return aiKeywords.some(kw => searchText.includes(kw.toLowerCase()));
      });
    }

    const now = new Date();

    // Time filter logic
    if (activeTime !== 'All') {
      result = result.filter(event => {
        if (!event.date || event.date.includes('/')) return true;
        try {
          const eventDateTime = new Date(`${event.date}T${event.time || '00:00'}`);
          if (isNaN(eventDateTime.getTime())) return true;

          if (activeTime === 'Live') {
            // Use the canonical isEventLive to match Home's happeningNow count,
            // plus include events starting within the next hour.
            const isStartingSoon = isBefore(eventDateTime, addHours(now, 1)) && isFuture(eventDateTime);
            return isEventLive(event) || isStartingSoon;
          }
          if (activeTime === 'Today') return isToday(eventDateTime);
          if (activeTime === 'This Week') {
            const weekEnd = endOfWeek(now, { weekStartsOn: 0 }); // Sunday
            return eventDateTime >= startOfDay(now) && eventDateTime <= weekEnd;
          }
          if (activeTime === 'This Weekend') return isWeekend(eventDateTime) && isFuture(eventDateTime);
          if (activeTime === 'This Month') return isBefore(eventDateTime, addDays(now, 30)) && isFuture(eventDateTime);
        } catch (e) { }
        return true;
      });
    } else {
      // Limit "All" on Map to 30 days
      result = result.filter(event => {
        if (!event.date || event.date.includes('/')) return true;
        try {
          const eventDateTime = new Date(`${event.date}T${event.time || '00:00'}`);
          if (isNaN(eventDateTime.getTime())) return true;
          return isBefore(eventDateTime, addDays(now, 30));
        } catch (e) { }
        return true;
      });
    }

    const sorted = result.filter(event => {
      if (event.status === 'past') return false;
      if (!event.date || event.date.includes('/')) return true;
      try {
        const startDateTime = new Date(`${event.date}T${event.time || '00:00'}`);
        if (!isNaN(startDateTime.getTime())) {
          let endDateTime;
          if (event.endTime) {
            endDateTime = new Date(`${event.date}T${event.endTime}`);
          } else {
            endDateTime = new Date(startDateTime.getTime() + 3 * 60 * 60 * 1000);
          }
          return new Date() <= endDateTime;
        }
      } catch (e) { }
      return true;
    });

    return sorted.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
      return dateA - dateB;
    });
  }, [events, activeCategory, activeTime, eventSearchQuery, aiKeywords]);



  const getDisplayDate = (dateStr: string) => {
    if (!dateStr || dateStr.includes('/')) return dateStr;
    try {
      const d = new Date(`${dateStr}T12:00:00`);
      if (isNaN(d.getTime())) return dateStr;
      if (isToday(d)) return "Today";
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  }

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
    <div className="h-[100dvh] flex flex-col liquid-gradient" id="map-view">
      <div className="flex-1 relative overflow-hidden">
        <div className="w-full h-full opacity-100 relative z-0">
          <Map
            onIdle={debouncedFetchEventsInView}
            defaultCenter={mapCenter}
            defaultZoom={initialCenter ? 17 : 13}
            className="w-full h-full"
            disableDefaultUI={true}
            mapId={mapId}

            // @ts-ignore
            colorScheme={isDarkMode ? "DARK" : "LIGHT"}
            gestureHandling={'greedy'}
          >
            <MapRenderer onMapLoad={setMap} isDarkMode={isDarkMode}>
              {map && (
                <>
                  {userLocation && (
                    <AdvancedMarker position={userLocation}>
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping" />
                        <div className="relative w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg" />
                      </div>
                    </AdvancedMarker>
                  )}
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
                  {(() => {
                    // --- Task 5: Venue-based clustering ---
                    // Group nearby events (within ~50m) into clusters
                    const mappableEvents = filteredEvents
                      .filter((event: GameEvent) => event.eventType !== 'virtual' && event.geopoint);

                    // At zoom >= 16, show pins unclustered EXCEPT for exact overlapping duplicates. Below that, cluster normally.
                    const CLUSTER_RADIUS = currentZoom >= 16 ? 0.0000001 : 0.0005; // ~50m for normal, identical for high zoom
                    type Cluster = { events: GameEvent[]; lat: number; lng: number };
                    const clusters: Cluster[] = [];

                    for (const event of mappableEvents) {
                      const lat = event.geopoint.latitude;
                      const lng = event.geopoint.longitude;
                      let added = false;
                      if (CLUSTER_RADIUS > 0) {
                        for (const cluster of clusters) {
                          if (Math.abs(cluster.lat - lat) < CLUSTER_RADIUS && Math.abs(cluster.lng - lng) < CLUSTER_RADIUS) {
                            cluster.events.push(event);
                            // Recalculate centroid
                            cluster.lat = cluster.events.reduce((s, e) => s + e.geopoint.latitude, 0) / cluster.events.length;
                            cluster.lng = cluster.events.reduce((s, e) => s + e.geopoint.longitude, 0) / cluster.events.length;
                            added = true;
                            break;
                          }
                        }
                      }
                      if (!added) {
                        clusters.push({ events: [event], lat, lng });
                      }
                    }

                    // --- Task 6: Limit to next 10 soonest (individual pins from single-event clusters) ---
                    // Sort clusters: live first, then soonest start time
                    const sortedClusters = [...clusters].sort((a, b) => {
                      const aLive = a.events.some(e => isEventOngoing(e));
                      const bLive = b.events.some(e => isEventOngoing(e));
                      if (aLive && !bLive) return -1;
                      if (!aLive && bLive) return 1;
                      const aTime = Math.min(...a.events.map(e => new Date(`${e.date}T${e.time || '23:59'}`).getTime()));
                      const bTime = Math.min(...b.events.map(e => new Date(`${e.date}T${e.time || '23:59'}`).getTime()));
                      return aTime - bTime;
                    });

                    // Limit total visible clusters/pins for performance
                    const MAX_PINS = currentZoom >= 16 ? 30 : 10;
                    const visibleClusters = sortedClusters.slice(0, MAX_PINS);

                    return visibleClusters.map((cluster, clusterIdx) => {
                      // --- Cluster Pin (multiple events at same venue) ---
                      if (cluster.events.length > 1) {
                        const liveCount = cluster.events.filter(e => isEventOngoing(e)).length;
                        const topEvent = cluster.events[0];
                        return (
                          <AdvancedMarker
                            key={`cluster-${clusterIdx}`}
                            position={{ lat: cluster.lat, lng: cluster.lng }}
                            onClick={() => {
                              // Zoom in to expand cluster, or show first event if already zoomed
                              if (currentZoom < 16 && map) {
                                map.panTo({ lat: cluster.lat, lng: cluster.lng });
                                map.setZoom(17);
                              } else {
                                setSelectedEvent(topEvent);
                                trackEventView(topEvent.id);
                              }
                            }}
                            style={{ zIndex: liveCount > 0 ? 40 : 25 }}
                          >
                            <div className="flex flex-col items-center cursor-pointer group">
                              <div className={`
                                  relative flex items-center justify-center
                                  ${currentZoom <= 13 ? 'w-10 h-10' : 'w-12 h-12'}
                                  rounded-full border-2 shadow-xl
                                  ${liveCount > 0 ? 'border-emerald-400 bg-emerald-500/90' : 'border-white/60 bg-slate-800/90'}
                                  backdrop-blur-sm transition-transform group-hover:scale-110
                                `}>
                                {liveCount > 0 && (
                                  <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                                )}
                                <span className="relative text-white font-black text-sm">
                                  {cluster.events.length}
                                </span>
                              </div>
                              {currentZoom >= 14 && (
                                <div className="mt-1 px-2 py-0.5 bg-slate-950/80 backdrop-blur-sm border border-white/10 rounded-full">
                                  <span className="text-[9px] text-white font-bold whitespace-nowrap">
                                    {cluster.events.length} events{liveCount > 0 ? ` · ${liveCount} live` : ''}
                                  </span>
                                </div>
                              )}
                            </div>
                          </AdvancedMarker>
                        );
                      }

                      // --- Single Event Pin ---
                      const event = cluster.events[0];
                      const index = clusterIdx;
                      const isHovered = hoveredEvent?.id === event.id;
                      // Ranking system: Only show teardrops for the first 15 events 
                      const rankLimit = 15;
                      const isPrimaryPin = index < rankLimit || !event.isScraped;
                      const showDetails = isHovered || (currentZoom >= 16 && isPrimaryPin);
                      // Zoom-based pin sizing — smaller pins at low zoom reduce overlap
                      const pinSize = currentZoom <= 13 ? 'w-7 h-7' : currentZoom <= 15 ? 'w-8 h-8' : 'w-10 h-10';
                      const emojiSize = currentZoom <= 13 ? 'text-sm' : currentZoom <= 15 ? 'text-base' : 'text-xl';
                      const shadowSize = currentZoom <= 13 ? 'w-3 h-0.5' : 'w-4 h-1';
                      const categoryColor = getCategoryColor(event.category);

                      let isFutureEvent = false;
                      let pinTier: 'live' | 'imminent' | 'future' = 'future';
                      if (!event.date || event.date.includes('/')) {
                        isFutureEvent = false;
                      } else {
                        try {
                          const eventDateTime = new Date(`${event.date}T${event.time || '00:00'}`);
                          const now = new Date();
                          if (isEventOngoing(event)) {
                            pinTier = 'live';
                          } else if (isBefore(eventDateTime, addHours(now, 6)) && isFuture(eventDateTime)) {
                            pinTier = 'imminent';
                          } else {
                            pinTier = 'future';
                            isFutureEvent = !isToday(eventDateTime) && eventDateTime > now;
                          }
                        } catch (e) {
                          isFutureEvent = false;
                        }
                      }

                      // "Map Dots" requirement: show simplified pins for distant or secondary events even when zoomed in
                      if (!isHovered && (!showDetails || currentZoom <= 13)) {
                        return (
                          <AdvancedMarker
                            key={event.id}
                            position={{ lat: event.geopoint.latitude, lng: event.geopoint.longitude }}
                            onClick={() => {
                              setSelectedEvent(event);
                              trackEventView(event.id);
                            }}
                            onMouseEnter={() => setHoveredEvent(event)}
                            onMouseLeave={() => setHoveredEvent(null)}
                            style={{ zIndex: pinTier === 'live' ? 30 : pinTier === 'imminent' ? 20 : 0 }}
                          >
                            {pinTier === 'live' ? (
                              <LivePin category={event.category} icon={event.icon} size={30} />
                            ) : pinTier === 'imminent' ? (
                              <MediumPin category={event.category} icon={event.icon} size={20} />
                            ) : (
                              <DotPin category={event.category} size={8} />
                            )}
                          </AdvancedMarker>
                        );
                      }

                      return (
                        <AdvancedMarker
                          key={event.id}
                          position={{ lat: event.geopoint.latitude, lng: event.geopoint.longitude }}
                          onClick={() => {
                            setSelectedEvent(event);
                            trackEventView(event.id);
                          }}
                          onMouseEnter={() => setHoveredEvent(event)}
                          onMouseLeave={() => setHoveredEvent(null)}
                          style={{ zIndex: isHovered ? 50 : (showDetails ? 10 : 0) }}
                        >
                          <div className={`flex flex-col items-center transition-all duration-500 transform origin-bottom ${isHovered ? 'scale-110 -translate-y-1' : 'scale-100'}`}>
                            {/* Floating Info Bubble */}
                            <div className={`
                              mb-2 px-3 py-1.5 rounded-2xl glass-surface border border-white/20 shadow-2xl
                              transition-all duration-300 ease-out flex flex-col items-center
                              ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
                            `}>
                              <span className="text-[11px] font-black text-white whitespace-nowrap leading-none mb-1">{event.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-slate-300 font-bold leading-none">
                                  {getDisplayDate(event.date)}{event.endDate && event.endDate !== event.date ? ` - ${getDisplayDate(event.endDate)}` : ''} • {formatTime(event.time)}{event.endTime ? ` - ${formatTime(event.endTime)}` : ''}
                                </span>
                                {isEventOngoing(event) && (
                                  <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-black flex items-center gap-1 animate-pulse border border-emerald-500/30">
                                    <span className="w-1 h-1 rounded-full bg-emerald-400" /> LIVE
                                  </span>
                                )}
                                {event.eventType === 'hybrid' && (
                                  <span className="text-[8px] bg-violet-500/20 text-violet-400 px-1 rounded font-black border border-violet-500/30">
                                    📡
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Teardrop Pin */}
                            <div className="relative group">
                              {/* Pulse effect for hovered OR ongoing pins */}
                              {(isHovered || isEventOngoing(event)) && (
                                <div
                                  className={`absolute ${isEventOngoing(event) && !isHovered ? '-inset-1 live-glow-ring opacity-60' : 'inset-0 animate-ping opacity-40'} rounded-full`}
                                  style={{ backgroundColor: isEventOngoing(event) && !isHovered ? '#10b981' : categoryColor }}
                                />
                              )}

                              {(() => {
                                // Determine animation class
                                let animClass = "";
                                if (!isHovered) {
                                  if (isEventOngoing(event)) {
                                    animClass = "live-glow-ring border-emerald-400";
                                  } else {
                                    let isWithin6h = false;
                                    if (event.date && event.time) {
                                      try {
                                        const d = new Date(`${event.date}T${event.time}`);
                                        isWithin6h = isBefore(d, addHours(new Date(), 6)) && isFuture(d);
                                      } catch (e) { }
                                    }
                                    if (isWithin6h) {
                                      const isSoonest = filteredEvents.find(e => {
                                        if (!e.date || !e.time) return false;
                                        try {
                                          const ed = new Date(`${e.date}T${e.time}`);
                                          return isBefore(ed, addHours(new Date(), 6)) && isFuture(ed);
                                        } catch (e) { }
                                        return false;
                                      })?.id === event.id; // true since filteredEvents is sorted
                                      if (isSoonest) {
                                        animClass = "soonest-bounce animate-yellow-pulse border-yellow-400";
                                      } else {
                                        animClass = "animate-yellow-pulse border-yellow-400";
                                      }
                                    } else {
                                      animClass = "border-white";
                                    }
                                  }
                                } else {
                                  animClass = isEventOngoing(event) ? "border-emerald-400" : "border-white";
                                }
                                return (
                                  <div
                                    className={`
                                      relative ${pinSize} flex items-center justify-center
                                      rounded-full rounded-br-none rotate-45
                                      border-2 ${animClass} transition-all duration-300
                                      ${isFutureEvent ? 'opacity-70 saturate-50' : 'opacity-100'}
                                    `}
                                    style={{
                                      background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)`,
                                      boxShadow: isHovered ? `0 0 25px ${categoryColor}aa` : (isEventOngoing(event) ? `0 4px 10px rgba(0,0,0,0.4)` : `0 4px 10px rgba(0,0,0,0.4)`)
                                    }}
                                  >
                                    <div className={`-rotate-45 ${emojiSize} filter drop-shadow-sm brightness-110`}>
                                      {event.icon || getCategoryIcon(event.category)}
                                    </div>
                                  </div>
                                );
                              })()}
                              {/* Hybrid badge on the marker */}
                              {
                                event.eventType === 'hybrid' && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full border border-white flex items-center justify-center text-[8px] shadow-lg">
                                    📡
                                  </div>
                                )
                              }
                            </div >

                            {/* Mini shadow at base */}
                            < div className={`
                              ${shadowSize} bg-black/40 rounded-full blur-[2px] mt-1 transition-all duration-300
                              ${isHovered ? 'scale-150 opacity-60' : 'scale-100 opacity-30'}
                            `} />
                          </div >
                        </AdvancedMarker >
                      );
                    });
                  })()}
                </>
              )}
            </MapRenderer >
          </Map >
        </div >

        <div className="absolute top-[92px] inset-x-2 z-20 flex flex-col gap-2 pointer-events-none">
          {/* Filter Chips & View Toggle Container */}
          <div className="pointer-events-auto flex gap-2 h-12">
            {/* Filters Pill */}
            <div className="flex-1 min-w-0 glass-surface rounded-full px-3 flex items-center shadow-2xl border border-white/15 overflow-hidden backdrop-blur-xl">
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full">
                {CATEGORIES.map(category => (
                  <Chip
                    key={category}
                    size="sm"
                    isActive={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                    className="shrink-0 text-[11px] px-3 py-1 rounded-full whitespace-nowrap"
                  >
                    {category}
                  </Chip>
                ))}
                <div className="w-px h-4 bg-white/10 shrink-0 mx-0.5" />
                {TIMES.map(time => (
                  <Chip
                    key={time}
                    size="sm"
                    isActive={activeTime === time}
                    onClick={() => setActiveTime(time)}
                    className="shrink-0 text-[11px] px-3 py-1 rounded-full whitespace-nowrap"
                  >
                    {time}
                  </Chip>
                ))}
                {/* Active filter indicator */}
                {(activeCategory !== 'All' || activeTime !== 'All' || eventSearchQuery) && (
                  <button
                    onClick={() => { setActiveCategory('All'); setActiveTime('All'); setEventSearchQuery(''); setAiKeywords([]); }}
                    className="shrink-0 text-[10px] text-rose-400 font-black px-2.5 py-1 bg-rose-400/10 rounded-full border border-rose-400/20 hover:bg-rose-400/20 transition-colors uppercase tracking-tight"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* View Toggle Pill */}
            <div className="glass-surface rounded-full p-1 flex items-center shadow-2xl border border-white/15 shrink-0 backdrop-blur-xl">
              <button
                className={`rounded-full h-10 px-3 flex items-center gap-2 transition-all duration-300 ${!showListPanel ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                onClick={() => setShowListPanel(false)}
              >
                <MapIcon className="w-4 h-4" />
                <span className={`text-[10px] font-bold ${showListPanel ? 'hidden' : 'block'}`}>Map</span>
              </button>
              <button
                className={`rounded-full h-10 px-3 flex items-center gap-2 transition-all duration-300 ${showListPanel ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                onClick={() => setShowListPanel(true)}
              >
                <List className="w-4 h-4" />
                <span className={`text-[10px] font-bold ${!showListPanel ? 'hidden' : 'block'}`}>List</span>
              </button>
            </div>
          </div>

          {/* AI Searching indicator */}
          {isAiSearching && (
            <div className="pointer-events-auto px-4 py-2 mt-1 mx-2 bg-indigo-500/20 backdrop-blur-md rounded-xl border border-indigo-500/30 w-max flex items-center gap-2 text-xs text-indigo-300 font-bold shadow-lg">
              <Loader2 className="w-3 h-3 animate-spin" />
              Searching with AI...
            </div>
          )}
        </div>

        {/* Location Permission Toast/Prompt */}
        {showLocationPrompt && !userLocation && (
          <div className="pointer-events-auto mx-auto mt-4 w-[90%] max-w-sm">
            <div className="bg-slate-950/80 backdrop-blur-xl border border-primary/30 p-4 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.15)] animate-in fade-in slide-in-from-top-4 duration-500">
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
        <MapListPanel
          events={filteredEvents.filter(e => e.eventType !== 'virtual').slice(0, 15)}
          onSelectEvent={(event) => {
            setSelectedEvent(event);
            if (event.geopoint) {
              map?.panTo({ lat: event.geopoint.latitude, lng: event.geopoint.longitude });
              setCurrentZoom(23);
            }
          }}
          isVisible={showListPanel}
          onClose={() => setShowListPanel(false)}
        />

        {
          !showListPanel && (
            <div className="absolute top-[185px] md:bottom-12 md:top-auto right-4 z-40 flex flex-col gap-4 pointer-events-none">
              <Button
                onClick={handleRecenter}
                onTouchEnd={(e) => { e.preventDefault(); handleRecenter(); }}
                variant="default"
                size="icon"
                className="h-12 w-12 md:h-14 md:w-14 rounded-full glass-surface text-slate-700 dark:text-white border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-white/10 hover:scale-110 transition-all pointer-events-auto cursor-pointer"
              >
                <LocateFixed className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
              <Button
                id="create-event-button"
                onClick={() => {
                  if (!user) {
                    toast.error("Please sign in to host an event.");
                    setTimeout(() => {
                      router.push('/login?return_to=/map?intent=create');
                    }, 1500)
                  } else {
                    setShowCreateModal(true);
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  if (!user) {
                    toast.error("Please sign in to host an event.");
                    setTimeout(() => {
                      router.push('/login?return_to=/map?intent=create');
                    }, 1500)
                  } else {
                    setShowCreateModal(true);
                  }
                }}
                size="icon"
                className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-primary text-primary-foreground shadow-[0_8px_30px_rgba(245,158,11,0.3)] hover:bg-orange-600 hover:scale-110 transition-all pointer-events-auto cursor-pointer"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>
          )
        }


      </div >

      {selectedEvent && <EventDetailsDrawer event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} onEventUpdated={() => { }} />
      }
      {showCreateModal && <CreateEventModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onEventCreated={() => { }} userLocation={userLocation || mapCenter} />}

      {/* First-visit onboarding */}
      {showOnboarding && (
        <OnboardingTooltip onComplete={() => {
          setShowOnboarding(false);
          localStorage.setItem('huddle_onboarding_complete', 'true');
        }} />
      )}
    </div>
  )
}
