"use client";

import React, { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

// SEARCH: Define the props for our new component.
interface LocationSearchInputProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  insideModal?: boolean;
}

export default function LocationSearchInput({ onPlaceSelect, insideModal = false }: LocationSearchInputProps) {
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

  // FIX: Prevent Radix Dialog / Input onBlur from hiding the Google Maps Places Autocomplete dropdown prematurely.
  // The .pac-container dropdown loses focus on mousedown/touchstart before the native click event fires.
  useEffect(() => {
    if (!insideModal) return;
    const handleDropdownInteraction = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest(".pac-container")) {
        // Prevent focus loss on the input field when tapping the dropdown
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Use capture phase so we intercept before input blur
    document.addEventListener("mousedown", handleDropdownInteraction, { capture: true });
    document.addEventListener("touchstart", handleDropdownInteraction, { capture: true, passive: false });

    return () => {
      document.removeEventListener("mousedown", handleDropdownInteraction, { capture: true });
      document.removeEventListener("touchstart", handleDropdownInteraction, { capture: true });
    };
  }, []);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        placeholder="Search for an address or place..."
        className="glass border-white/30 text-white placeholder:text-white/60 w-full"
      />
    </div>
  );
}
