"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, AlertCircle } from "lucide-react"
import EventDetailsModal from "./event-details-modal"
import CreateEventModal from "./create-event-modal"
import SharedHeader from "./shared-header"
import FirebaseDebug from "./firebase-debug"
import MapsDebug from "./maps-debug"
import { ErrorBoundary } from "./error-boundary"
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps"
import MapsApiValidator from "./maps-api-validator"
import { mapsValidator } from "@/lib/maps-debug"

// ... (interfaces and helper functions remain the same) ...
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
  const [mapLoaded, setMapLoaded] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
  const cacheBustingApiKey = mapsApiKey ? mapsValidator.generateCacheBustingUrl(`key=${mapsApiKey}`) : undefined

  useEffect(() => {
    const validation = mapsValidator.validateApiKey(mapsApiKey)
    setValidationResult(validation)

    if (!validation.isValid) {
      setMapsError(validation.errors.join(", "))
      return
    }

    mapsValidator.logMapsApiStatus(mapsApiKey, mapId)
    setMapsError(null)
  }, [mapsApiKey, mapId])

  // FIX: Rewrote the geolocation logic for clarity and robust error handling.
  useEffect(() => {
    // A fallback default location in case everything else fails.
    const defaultLocation = { lat: 37.7749, lng: -122.4194 };

    const handleSuccess = (position: GeolocationPosition) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUserLocation(location);
      setMapCenter(location);
      console.log("Geolocation successful:", location);
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = "An unknown error occurred.";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location permission denied. Please enable it in your browser settings.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "The request to get user location timed out.";
          break;
      }
      console.error("Error getting location:", errorMessage, error);
      // Set a user-friendly error message to be displayed in the UI if needed
      // setMapsError(`Could not get location: ${errorMessage}`);
      
      // Fallback to a default location so the map can still render.
      setUserLocation(defaultLocation);
      setMapCenter(defaultLocation);
    };

    // Check if the Geolocation API is supported by the browser.
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation(defaultLocation);
      setMapCenter(defaultLocation);
    } else {
      // Request the user's current position.
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    }
  }, []); // This effect runs only once when the component mounts.

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const data = await response.json();
          // Ensure that the response has an events array
          setEvents(data.events || []); 
        } else {
           console.error("Failed to fetch events with status:", response.status);
        }
      } catch (error) {
        console.error("Failed to load events:", error);
      }
    };

    loadEvents();
  }, []);

  // ... (rest of the component remains the same) ...
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

  const handleMapLoad = () => {
    setMapLoaded(true)
    console.group("🗺️ Google Maps Load Success")
    console.log("API Key Status:", validationResult?.apiKey.format || "unknown")
    console.log("Map ID:", mapId || "Using default fallback")
    console.log("Advanced Markers:", mapId ? "Enabled" : "Limited functionality")
    console.log("Timestamp:", new Date().toISOString())
    console.groupEnd()
  }

  const handleMapError = (error: any) => {
    console.group("🚨 Google Maps Error Analysis")
    console.error("Error Object:", error)
    console.log("API Key:", validationResult?.apiKey.masked || "unknown")
    console.log("Map ID:", mapId || "not-provided")
    console.log("Error Type:", error?.constructor?.name || "unknown")
    console.log("Error Message:", error?.message || "no message")
    console.log("Timestamp:", new Date().toISOString())

    // Check for specific error patterns
    if (error?.message?.includes("ApiProjectMapError")) {
      console.error("🎯 ApiProjectMapError detected - possible causes:")
      console.error("  1. Billing not enabled on Google Cloud project")
      console.error("  2. Maps JavaScript API not enabled")
      console.error("  3. API key restrictions blocking the request")
      console.error("  4. Quota exceeded")
      console.error("  5. Map ID not associated with the project")
    }

    console.groupEnd()
    setMapsError(`Maps error: ${error.message || "Unknown error"}`)
  }

  if (mapsError || !mapsApiKey) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
          <div className="text-center max-w-md space-y-4">
            <div className="glass-card rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Maps Configuration Error</h1>
            <p className="text-white/80 mb-6 drop-shadow">{mapsError}</p>

            <MapsApiValidator apiKey={mapsApiKey} mapId={mapId} onValidationComplete={setValidationResult} />

            <div className="glass-card border-white/30 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-white mb-2">Troubleshooting Steps:</h3>
              <ol className="text-sm text-white/80 space-y-1 list-decimal list-inside">
                <li>Check Google Cloud Console billing is enabled</li>
                <li>Verify Maps JavaScript API is enabled</li>
                <li>Confirm API key has no domain restrictions (for testing)</li>
                <li>Ensure Map ID is created in the same project</li>
                <li>Check API quotas and usage limits</li>
                <li>Try clearing browser cache and hard refresh</li>
              </ol>
            </div>
          </div>
        </div>
      </ErrorBoundary>
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
    <ErrorBoundary>
      <div className="h-screen flex flex-col liquid-gradient">
        <SharedHeader user={user} onLogout={onLogout} />

        {/* Map Container */}
        <div className="flex-1 relative">
          <APIProvider
            apiKey={mapsApiKey}
            onLoad={() => {
              console.log("🗺️ Google Maps API loaded successfully")
              console.log("🔄 Cache-busting timestamp:", Date.now())
            }}
            onError={(error: any) => {
              console.error("🚨 APIProvider Error:", error)
              handleMapError(error)
            }}
          >
            <Map
              mapId={mapId}
              defaultCenter={mapCenter}
              defaultZoom={14}
              className="w-full h-full"
              onTilesLoaded={handleMapLoad}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: true,
                fullscreenControl: true,
                tilt: mapId ? 45 : 0,
                gestureHandling: "greedy",
              }}
            >
              {/* User Location Marker with Advanced Marker */}
              {userLocation && (
                <AdvancedMarker position={userLocation} title="Your Location">
                  <Pin background="#2563eb" borderColor="#1e40af" glyphColor="#ffffff" scale={1.2}>
                    <MapPin className="w-4 h-4" />
                  </Pin>
                </AdvancedMarker>
              )}

              {/* Event Markers with Enhanced Advanced Markers */}
              {events.map((event) => (
                <AdvancedMarker
                  key={event.id}
                  position={{ lat: event.latitude, lng: event.longitude }}
                  title={`${event.title} - ${event.sport}`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <Pin background={getSportColor(event.sport)} borderColor="#ffffff" glyphColor="#ffffff" scale={1.3}>
                    <div className="text-xs font-bold">{event.sport.charAt(0)}</div>
                  </Pin>
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>

          {/* Map Status Indicator */}
          {!mapLoaded && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="glass-card rounded-lg p-4 text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p>Loading map...</p>
              </div>
            </div>
          )}

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

        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-4 left-4 space-y-2 max-w-sm">
            <FirebaseDebug />
            <MapsDebug />
            <MapsApiValidator apiKey={mapsApiKey} mapId={mapId} onValidationComplete={setValidationResult} />
          </div>
        )}

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
            isOpen={showCreateModal}
            user={user}
            userLocation={userLocation}
            onClose={() => setShowCreateModal(false)}
            onEventCreated={handleEventCreated}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}
