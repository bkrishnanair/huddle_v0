"use client";
import { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
interface LocationSearchInputProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  onAiSearch?: (query: string) => void;
  insideModal?: boolean;
  className?: string;
}
export default function LocationSearchInput({ onPlaceSelect, onAiSearch, className }: LocationSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');
  const [value, setValue] = useState('');
  const onSelectRef = useRef(onPlaceSelect);
  onSelectRef.current = onPlaceSelect;
  useEffect(() => {
    if (!places || !inputRef.current) return;
    const ac = new places.Autocomplete(inputRef.current, { fields: ['geometry', 'name', 'formatted_address'] });
    const listener = ac.addListener('place_changed', () => {
      setValue(inputRef.current?.value || ''); onSelectRef.current(ac.getPlace());
    });
    return () => { listener.remove(); ac.unbindAll(); };
  }, [places]);
  useEffect(() => {
    const reset = () => setValue('');
    window.addEventListener('huddle-search-clear', reset);
    return () => window.removeEventListener('huddle-search-clear', reset);
  }, []);
  const clear = () => { setValue(''); onPlaceSelect(null); window.dispatchEvent(new Event('huddle-search-clear')); inputRef.current?.focus(); };
  return <div className="relative flex h-full w-full min-w-0 items-center">
    <Input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} aria-label="Search for a place or event" placeholder="Search for a place or event"
      className={'w-full !pr-12 ' + (className || 'glass border-white/30 text-white placeholder:text-white/60')}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && value) { e.stopPropagation(); clear(); }
        if (e.key === 'Enter' && onAiSearch && value.trim() && !document.querySelector('.pac-item-selected')) {
          e.preventDefault(); onAiSearch(value.trim()); inputRef.current?.blur();
        }
      }} />
    {value && <button type="button" aria-label="Clear search" onClick={clear} className="absolute right-0 flex h-11 w-11 items-center justify-center rounded-xl text-slate-300 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-primary"><X className="h-4 w-4" /></button>}
  </div>;
}
