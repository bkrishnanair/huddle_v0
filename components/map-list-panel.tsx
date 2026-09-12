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
        <div inert={!isVisible} aria-hidden={!isVisible} className={`
            z-30 flex flex-col transition-all duration-300 ease-out shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-[20px_0_40px_rgba(0,0,0,0.5)]
            
            
            fixed md:absolute inset-x-3 bottom-[calc(var(--safe-bottom)+0.5rem)] rounded-3xl bg-canvas/95 backdrop-blur-2xl border border-white/10
            ${!isVisible ? 'translate-y-[120%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
            ${isExpanded ? 'h-[85vh] bottom-0 rounded-b-none border-b-0 inset-x-0' : 'h-[36vh]'}
            
            
            md:top-[232px] md:bottom-[calc(var(--safe-bottom)+1rem)] md:left-4 md:right-auto md:w-[380px] md:h-auto
            ${isVisible ? 'md:translate-x-0' : 'md:-translate-x-full md:pointer-events-none md:opacity-0'}
        `}>
           {/* Desktop Close Button */}
           <button 
               onClick={onClose} aria-label="Close event list"
               className="hidden md:flex absolute top-2 right-3 w-11 h-11 bg-slate-800 rounded-full items-center justify-center text-slate-400 hover:text-white transition-colors z-50"
           >
               <X className="w-4 h-4" />
           </button>

           {/* Mobile Drag Handle */}
           <button type="button" aria-label={isExpanded ? "Collapse event list" : "Expand event list"} aria-expanded={isExpanded}
             className="md:hidden min-h-11 w-full flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing group"
             onClick={() => setIsExpanded(!isExpanded)}
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}
           >
             <div className="w-12 h-1.5 bg-white/20 group-hover:bg-white/40 transition-colors rounded-full mb-1" />
             <ChevronUp className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
           </button>



           <div className="flex justify-between items-center px-4 pb-3 md:px-6 md:py-4 border-b border-white/10 shrink-0 md:bg-slate-900/40">
                <h3 className="text-xl font-bold text-slate-50 tracking-tight flex items-center">
                  Next up {events.length > 0 && <span className="text-orange-300 ml-2 bg-orange-400/10 px-2 py-1 font-mono text-xs rounded-lg">{events.length}</span>}
                </h3>
           </div>
           
           <div 
             className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 no-scrollbar pb-10"
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
