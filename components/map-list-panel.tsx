"use client"
import { useState } from "react"
import { GameEvent } from "@/lib/types"
import { EventCard } from "@/components/events/event-card"
import { SearchX, ChevronUp } from "lucide-react"

interface MapListPanelProps {
    events: GameEvent[];
    onSelectEvent: (event: GameEvent) => void;
    onClose: () => void;
    isVisible: boolean; // desktop visibility
}

export function MapListPanel({ events, onSelectEvent, isVisible }: MapListPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // On mobile, the sheet is always visible, so `isVisible` only applies to desktop (md)
    return (
        <div className={`
            absolute z-[50] flex flex-col transition-all duration-300 ease-out shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-[20px_0_40px_rgba(0,0,0,0.5)]
            
            /* Mobile styles: Bottom sheet */
            inset-x-0 bottom-[calc(var(--safe-bottom,0px)+55px)] w-full rounded-t-3xl bg-slate-950/95 backdrop-blur-2xl border-t border-white/10
            ${isExpanded ? 'h-[85vh]' : 'h-[32vh]'}
            
            /* Desktop styles: Side panel */
            md:inset-y-0 md:left-0 md:w-[420px] md:pt-[70px] md:rounded-none md:border-r md:border-t-0 md:h-[100dvh]
            ${isVisible ? 'md:translate-x-0' : 'md:-translate-x-full md:pointer-events-none md:opacity-0'}
        `}>
           {/* Mobile Drag Handle */}
           <div 
             className="md:hidden w-full flex flex-col items-center pt-3 pb-2 cursor-pointer group"
             onClick={() => setIsExpanded(!isExpanded)}
           >
             <div className="w-12 h-1.5 bg-white/20 group-hover:bg-white/40 transition-colors rounded-full mb-1" />
             <ChevronUp className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
           </div>

           <div className="flex justify-between items-center px-4 pb-4 md:px-6 md:py-4 border-b border-white/10 shrink-0 bg-slate-900/40">
                <h3 className="text-xl font-bold text-slate-50 tracking-tight">
                  Next Up <span className="text-primary ml-1 bg-primary/10 px-2 py-0.5 rounded-md">{events.length}</span>
                </h3>
           </div>
           
           <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar pb-10">
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
