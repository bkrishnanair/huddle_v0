"use client";

import React, { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

// SEARCH: Define the props for our new component.
interface LocationSearchInputProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  onAiSearch?: (query: string) => void;
  insideModal?: boolean;
  className?: string;
}

export default function LocationSearchInput({ onPlaceSelect, onAiSearch, insideModal = false, className }: LocationSearchInputProps) {
  // SEARCH: Get a reference to the input element.
  const inputRef = useRef<HTMLInputElement>(null);
  // SEARCH: Load the 'places' library from Google Maps.
  const places = useMapsLibrary("places");
  // SEARCH: State to hold the Autocomplete instance.
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    // SEARCH: This effect initializes the Autocomplete service.
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    // SEARCH: Create a new Autocomplete instance and bind it to our input field.
    const ac = new places.Autocomplete(inputRef.current, options);
    setAutocomplete(ac);
  }, [places]);

  useEffect(() => {
    // SEARCH: This effect adds a listener that fires when the user selects a place.
    if (!autocomplete) return;

    const listener = autocomplete.addListener("place_changed", () => {
      // SEARCH: When a place is selected, call the onPlaceSelect callback
      // with the details of the selected place.
      onPlaceSelect(autocomplete.getPlace());
    });

    // SEARCH: Clean up the listener when the component unmounts.
    return () => google.maps.event.removeListener(listener);
  }, [autocomplete, onPlaceSelect]);

  return (
    <Input
      ref={inputRef}
      placeholder="Search for an address, place, or event vibe..."
      className={className !== undefined ? `w-full ${className}` : "glass border-white/30 text-white placeholder:text-white/60 w-full"}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onAiSearch && inputRef.current?.value) {
          // Check if dropdown is not active (basic heuristic: we just grab the value)
          onAiSearch(inputRef.current.value);
          inputRef.current.blur();
        }
      }}
    />
  );
}
