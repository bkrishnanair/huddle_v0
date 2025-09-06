"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { MapPin } from "lucide-react";
import debounce from 'lodash.debounce';

interface LocationSearchInputProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export default function LocationSearchInput({ onPlaceSelect }: LocationSearchInputProps) {
  const places = useMapsLibrary("places");
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken>();
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (places) {
      setSessionToken(new places.AutocompleteSessionToken());
    }
  }, [places]);

  const fetchPredictions = useMemo(() => 
    debounce((request: google.maps.places.AutocompletionRequest, callback: (results: google.maps.places.AutocompletePrediction[] | null) => void) => {
      new places.AutocompleteService().getPlacePredictions(request, callback);
    }, 300), 
  [places]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value && places && sessionToken) {
      const request = {
        input: value,
        sessionToken: sessionToken,
      };
      fetchPredictions(request, (results) => {
        setPredictions(results || []);
      });
    } else {
      setPredictions([]);
    }
  };

  const handlePredictionSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    if (!places) return;

    const placesService = new places.PlacesService(document.createElement('div'));
    const request = {
      placeId: prediction.place_id,
      fields: ["geometry", "name", "formatted_address"],
      sessionToken: sessionToken,
    };

    placesService.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        onPlaceSelect(place);
        setInputValue(place.formatted_address || place.name || '');
        setPredictions([]);
        setSessionToken(new places.AutocompleteSessionToken());
      }
    });
  };

  return (
    <Command shouldFilter={false} className="glass-surface rounded-lg">
      <CommandInput
        placeholder="Search for an address or place..."
        value={inputValue}
        onValueChange={handleInputChange}
        className="text-white placeholder:text-white/60"
      />
      {predictions.length > 0 && (
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {predictions.map((prediction) => (
              <CommandItem
                key={prediction.place_id}
                onSelect={() => handlePredictionSelect(prediction)}
                className="cursor-pointer"
              >
                <MapPin className="mr-2 h-4 w-4" />
                {prediction.description}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
}
