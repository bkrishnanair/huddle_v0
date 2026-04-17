"use client"
import { GameEvent } from "@/lib/types"
import { EventCard } from "@/components/events/event-card"
import { X, SearchX } from "lucide-react"

interface MapListPanelProps {
    events: GameEvent[];
    onSelectEvent: (event: GameEvent) => void;
    onClose: () => void;
    isVisible: boolean;
}

export function MapListPanel({ events, onSelectEvent, onClose, isVisible }: MapListPanelProps) {
    if (!isVisible) return null;

    return (
        <div className="absolute inset-x-0 bottom-20 md:bottom-0 md:inset-y-0 md:left-0 md:w-[420px] md:pt-[70px] bg-slate-950/95 backdrop-blur-2xl border-t md:border-t-0 md:border-r border-white/10 z-[50] flex flex-col shadow-[20px_0_40px_rgba(0,0,0,0.5)] transition-all h-[55vh] md:h-[100dvh] max-w-full animate-in slide-in-from-bottom-full md:slide-in-from-left-full duration-300">
           <div className="flex justify-between items-center p-4 md:px-6 border-b border-white/10 shrink-0 bg-slate-900/40">
                <h3 className="text-xl font-bold text-slate-50 tracking-tight">Nearby <span className="text-primary ml-1 bg-primary/10 px-2 py-0.5 rounded-md">{events.length}</span></h3>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5" />
                </button>
           </div>
           <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 no-scrollbar pb-10">
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
