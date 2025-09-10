"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2 } from "lucide-react";

type AutocompleteSuggestion = google.maps.places.AutocompleteSuggestion;
type Place = google.maps.places.Place;
type PlaceResult = google.maps.places.PlaceResult;

interface LocationSearchInputProps {
  onPlaceSelect: (place: PlaceResult | null) => void;
  placeholder?: string;
}

const toPlaceResult = (p: Place): PlaceResult => {
  const name = p.displayName ?? undefined;
  const formatted_address = p.formattedAddress ?? undefined;
  const geometry = p.location
    ? ({ location: p.location } as google.maps.places.PlaceGeometry)
    : undefined;
  return { name, formatted_address, geometry };
};

function debounce<F extends (...args: any[]) => void>(fn: F, delay = 300) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

export default function LocationSearchInput({
  onPlaceSelect,
  placeholder = "Search for a location…",
}: LocationSearchInputProps) {
  const places = useMapsLibrary("places");
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<google.maps.places.AutocompleteSessionToken>();

  useEffect(() => {
    if (places) setToken(new places.AutocompleteSessionToken());
  }, [places]);

  const fetchSuggestions = useMemo(
    () =>
      debounce(async (value: string) => {
        if (!places || !value.trim()) {
          setSuggestions([]);
          setIsOpen(false);
          setIsLoading(false);
          return;
        }
        try {
          const { suggestions: next } =
            await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
              input: value,
              sessionToken: token,
            });
          setSuggestions(next ?? []);
          setIsOpen(Boolean(next?.length));
        } catch (e) {
          console.error("[Maps] autocomplete failed", e);
          setSuggestions([]);
          setIsOpen(false);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    [places, token]
  );

  const onChange = (value: string) => {
    setInputValue(value);
    if (value.trim()) {
      setIsLoading(true);
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  const handleSelect = useCallback(
    async (s: AutocompleteSuggestion) => {
      if (!places || !s.placeId) return;

      const label = s.placePrediction?.text?.text ?? "Unknown place";
      setInputValue(label);
      setIsOpen(false);
      setIsLoading(true);

      try {
        const place = new places.Place({ id: s.placeId });
        await place.fetchFields({
          fields: ["displayName", "formattedAddress", "location"],
        });
        onPlaceSelect(toPlaceResult(place));
      } catch (e) {
        console.error("[Maps] place details failed", e);
        onPlaceSelect(null);
      } finally {
        setIsLoading(false);
        // Regenerate session token for billing optimization
        setToken(new places.AutocompleteSessionToken());
      }
    },
    [places, onPlaceSelect]
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Command shouldFilter={false} className="w-full">
            <CommandInput
              placeholder={placeholder}
              value={inputValue}
              onValueChange={onChange}
              onFocus={() => {
                if (suggestions.length > 0) setIsOpen(true);
              }}
              className="w-full"
            />
          </Command>
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[var(--radix-popover-trigger-width)] p-0"
        sideOffset={4}
      >
        <Command shouldFilter={false}>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {suggestions.map((s) => {
              const label = s.placePrediction?.text?.text ?? "Unknown place";
              return (
                <CommandItem
                  key={s.placeId}
                  value={label}
                  onSelect={() => handleSelect(s)}
                  // Fix for mobile: onMouseDown prevents input blur race condition
                  onMouseDown={(e) => e.preventDefault()}
                  className="cursor-pointer px-3 py-2"
                >
                  <div className="flex items-center space-x-2">
                    <div className="text-sm">{label}</div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
