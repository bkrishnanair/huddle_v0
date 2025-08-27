"use client";

import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import LocationSearchInput from "./location-search";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: any) => void;
  userLocation: { lat: number; lng: number } | null;
}

const SPORTS = [
  "Basketball", "Soccer", "Tennis", "Cricket", "Baseball", "Volleyball",
  "Football", "Hockey", "Badminton", "Table Tennis"
];

export default function CreateEventModal({ isOpen, onClose, onEventCreated, userLocation }: CreateEventModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    location: "",
    date: "",
    time: "",
    maxPlayers: 10,
  });

  const [mapCenter, setMapCenter] = useState(userLocation || { lat: 37.7749, lng: -122.4194 });
  const [markerPosition, setMarkerPosition] = useState(userLocation || { lat: 37.7749, lng: -122.4194 });

  useEffect(() => {
    if (isOpen && userLocation) {
      setMapCenter(userLocation);
      setMarkerPosition(userLocation);
    }
  }, [isOpen, userLocation]);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location) {
      const newPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      handleInputChange("location", place.formatted_address || place.name || "");
      setMapCenter(newPosition);
      setMarkerPosition(newPosition);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sport || !formData.location) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);

    const submissionData = {
      ...formData,
      latitude: markerPosition.lat,
      longitude: markerPosition.lng,
    };

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const data = await response.json();
        onEventCreated(data.event);
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Failed to create event:", errorData.error);
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Client-side error creating event:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md glass-card border-none rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
          <CardHeader className="pb-4 border-b border-white/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-white">Create New Game</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          
          <form id="create-event-form" onSubmit={handleSubmit} className="flex-grow contents">
            <div className="flex-grow overflow-y-auto min-h-0 no-scrollbar">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white/90">Event Title</Label>
                    <Input id="title" placeholder="e.g., Evening Basketball Run" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} required className="glass border-white/30 text-white placeholder:text-white/60" />
                  </div>
                  <div>
                    <Label htmlFor="sport" className="text-white/90">Sport</Label>
                    <Select required value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                      <SelectTrigger className="glass border-white/30 text-white">
                        <SelectValue placeholder="Select a sport" />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        {SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location-search" className="text-white/90">Location</Label>
                    <LocationSearchInput onPlaceSelect={handlePlaceSelect} />
                    <div className="h-48 w-full rounded-lg overflow-hidden relative mt-2 border-white/30">
                      <Map
                        defaultCenter={mapCenter}
                        center={mapCenter}
                        defaultZoom={15}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
                      >
                        <AdvancedMarker
                          position={markerPosition}
                          draggable={true}
                          onDragEnd={(e) => setMarkerPosition({ lat: e.latLng!.lat(), lng: e.latLng!.lng() })}
                        />
                      </Map>
                    </div>
                    <p className="text-xs text-white/60 mt-2">Drag the pin to set the exact game location.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-white/90">Date</Label>
                      <Input id="date" type="date" min={today} value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} required className="glass border-white/30 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-white/90">Time</Label>
                      <Input id="time" type="time" value={formData.time} onChange={(e) => handleInputChange("time", e.target.value)} required className="glass border-white/30 text-white" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="maxPlayers" className="text-white/90">Number of Players</Label>
                    <Select value={String(formData.maxPlayers)} onValueChange={(v) => handleInputChange("maxPlayers", Number(v))}>
                      <SelectTrigger className="glass border-white/30 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="glass-card">{Array.from({ length: 20 }, (_, i) => i + 2).map(n => <SelectItem key={n} value={String(n)}>{n} players</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </div>

            <CardFooter className="pt-6 border-t border-white/20 flex-shrink-0">
              <Button form="create-event-form" type="submit" disabled={isLoading} className="w-full glass-card hover:glow text-white border-white/30">
                {isLoading ? "Creating..." : "Create Game"}
              </Button>
            </CardFooter>
          </form>
        </APIProvider>
      </Card>
    </div>
  );
}
