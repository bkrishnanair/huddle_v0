"use client"
import { useState, useRef, useEffect } from "react"
import { GameEvent } from "@/lib/types"
import { EventCard } from "@/components/events/event-card"
import { SearchX, ChevronUp, Search, X } from "lucide-react"
import LocationSearchInput from "./location-search"

interface MapListPanelProps {
    events: GameEvent[];
    onSelectEvent: (event: GameEvent) => void;
    onClose: () => void;
    isVisible: boolean; // desktop visibility
}

export function MapListPanel({ events, onSelectEvent, onClose, isVisible }: MapListPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchStartY) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - touchStartY;
        
        // Swipe down to close/minimize
        if (diff > 50 && isExpanded) {
            setIsExpanded(false);
            setTouchStartY(null);
        }
        // Swipe up to expand
        if (diff < -50 && !isExpanded) {
            setIsExpanded(true);
            setTouchStartY(null);
        }
    };

    const handleTouchEnd = () => {
        setTouchStartY(null);
    };

    // On mobile, the sheet is always visible, so `isVisible` only applies to desktop (md)
    return (
        <div className={`
            z-[50] flex flex-col transition-all duration-300 ease-out shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-[20px_0_40px_rgba(0,0,0,0.5)]
            
            /* Mobile styles: Bottom sheet */
            fixed md:absolute inset-x-2 md:inset-x-0 bottom-[80px] md:bottom-0 rounded-3xl md:rounded-none bg-slate-950/95 backdrop-blur-2xl border border-white/10
            ${!isVisible ? 'translate-y-[120%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
            ${isExpanded ? 'h-[85vh] bottom-0 rounded-b-none border-b-0 inset-x-0' : 'h-[36vh]'}
            
            /* Desktop styles: Side panel */
            md:inset-y-0 md:left-0 md:w-[420px] md:pt-[70px] md:border-r md:border-t-0 md:h-[100dvh] md:border-l-0 md:border-b-0
            ${isVisible ? 'md:translate-x-0' : 'md:-translate-x-full md:pointer-events-none md:opacity-0'}
        `}>
           {/* Desktop Close Button */}
           <button 
               onClick={onClose}
               className="hidden md:flex absolute top-[18px] right-4 w-8 h-8 bg-slate-800 rounded-full items-center justify-center text-slate-400 hover:text-white transition-colors z-50"
           >
               <X className="w-4 h-4" />
           </button>

           {/* Mobile Drag Handle */}
           <div 
             className="md:hidden w-full flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing group"
             onClick={() => setIsExpanded(!isExpanded)}
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}
           >
             <div className="w-12 h-1.5 bg-white/20 group-hover:bg-white/40 transition-colors rounded-full mb-1" />
             <ChevronUp className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
           </div>

           {/* Mobile Search Bar ("Where to?") Transit-Style */}
           <div className="md:hidden px-4 pb-3 shrink-0">
               <div className="relative h-[44px] bg-black/60 backdrop-blur-2xl rounded-xl border border-primary/40 p-[1px] flex items-center focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                   <Search className="w-4 h-4 ml-3 text-slate-300 shrink-0" />
                   <div className="flex-1 h-full flex items-center pr-2">
                       <LocationSearchInput
                           onPlaceSelect={(place) => window.dispatchEvent(new CustomEvent('huddle-map-search', { detail: { place } }))}
                           className="bg-transparent !border-0 !ring-0 !outline-none shadow-none text-[15px] h-full placeholder:text-slate-300 text-slate-100"
                       />
                   </div>
               </div>
           </div>

           <div className="flex justify-between items-center px-4 pb-3 md:px-6 md:py-4 border-b border-white/10 shrink-0 md:bg-slate-900/40">
                <h3 className="text-xl font-bold text-slate-50 tracking-tight flex items-center">
                  Next Up <span className="text-primary ml-2 bg-primary/10 px-2 py-0.5 text-sm rounded-md">{events.length}</span>
                </h3>
           </div>
           
           <div 
             className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar pb-10"
             onTouchStart={(e) => {
                 // If scrolled to top, allow dragging the sheet down
                 const target = e.currentTarget;
                 if (target.scrollTop === 0) {
                     handleTouchStart(e);
                 }
             }}
             onTouchMove={(e) => {
                 const target = e.currentTarget;
                 if (target.scrollTop === 0 && touchStartY !== null) {
                     handleTouchMove(e);
                 }
             }}
             onTouchEnd={handleTouchEnd}
           >
                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center text-slate-400 h-full px-4 -mt-10">
                        <SearchX className="w-12 h-12 text-slate-600 mb-4" />
                        <h4 className="text-lg font-bold text-slate-300">No events found</h4>
                        <p className="text-sm mt-2 text-slate-500">Try adjusting your filters or moving the map to another area.</p>
                    </div>
                ) : (
                    events.map(event => (
                        <div key={event.id} onClick={() => onSelectEvent(event)} className="cursor-pointer hover:scale-[1.01] transition-transform">
                            <EventCard event={event} onSelectEvent={onSelectEvent} showMapButton={false} />
                        </div>
                    ))
                )}
           </div>
        </div>
    )
}
