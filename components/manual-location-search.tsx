"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface ManualLocationSearchProps {
  onLocationSubmit: (location: { lat: number; lng: number }) => void;
}

export default function ManualLocationSearch({ onLocationSubmit }: ManualLocationSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    setIsLoading(true);
    setError(null);

    try {
      // This uses a simple, free geocoding service. 
      // In a production app, you would use the Google Geocoding API with a proper key.
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputValue)}&format=json&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        onLocationSubmit({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        setError("Could not find that location. Please try a different city or zip code.");
      }
    } catch (err) {
      setError("Failed to fetch location data. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center glass-card p-8 rounded-2xl max-w-lg mx-auto mt-10">
      <MapPin className="w-12 h-12 text-white/80 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Enable Location to Discover Events</h3>
      <p className="text-white/70 mb-6">
        Huddle works best with your location. Please enable location permissions in your browser settings to find games near you, or enter a location manually.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Enter a city or zip code..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="glass border-white/20 text-white placeholder:text-white/60 flex-grow"
        />
        <Button type="submit" className="glass-card hover:glow text-white" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
