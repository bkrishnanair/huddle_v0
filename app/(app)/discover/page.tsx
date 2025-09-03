"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/lib/firebase-context"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EventCard, EventCardSkeleton } from "@/components/events/event-card"
import EventDetailsModal from "@/components/event-details-modal"
import CreateEventModal from "@/components/create-event-modal"
import { Chip } from "@/components/ui/chip"
import { Search, SlidersHorizontal, PlusCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GameEvent } from "@/lib/types"

const SPORTS_FILTERS = ["All", "Basketball", "Soccer", "Tennis", "Volleyball", "Football"];

const ActionableEmptyState = ({ onOpenCreateModal }: { onOpenCreateModal: () => void }) => (
    <div className="text-center glass-surface border-white/15 rounded-2xl p-8 mt-8">
        <PlusCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-50 mb-2">No Games Nearby</h3>
        <p className="text-slate-300 mb-6">Your area is waiting for a leader. Be the one to get the ball rolling.</p>
        <Button size="lg" onClick={onOpenCreateModal} className="h-12 px-8 text-lg">
            Host the First Game
        </Button>
    </div>
);

export default function DiscoverPage() {
    const { user } = useAuth();
    const [allNearbyEvents, setAllNearbyEvents] = useState<GameEvent[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSport, setActiveSport] = useState("All");
    const [sortBy, setSortBy] = useState("soonest");

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        });

        const fetchInitialData = async () => {
            if (!user || !userLocation) return;
            setLoading(true);
            try {
                const radius = 50000;
                const [profileRes, eventsRes] = await Promise.all([
                    fetch(`/api/users/${user.uid}/profile`),
                    fetch(`/api/events?lat=${userLocation.lat}&lon=${userLocation.lng}&radius=${radius}`)
                ]);
                
                if (profileRes.ok) setUserProfile((await profileRes.json()).profile);
                if (eventsRes.ok) setAllNearbyEvents((await eventsRes.json()).events || []);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setLoading(false);
                setInitialLoadComplete(true);
            }
        };
        
        fetchInitialData();
    }, [user, userLocation]);

    const { recommendedEvents, otherEvents } = useMemo(() => {
        const filtered = allNearbyEvents.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSport = activeSport === 'All' || event.sport === activeSport;
            return matchesSearch && matchesSport;
        });

        const favoriteSports = userProfile?.favoriteSports || [];
        const recommended: GameEvent[] = [];
        const others: GameEvent[] = [];

        if (favoriteSports.length > 0 && activeSport === 'All' && searchQuery === '') {
            filtered.forEach(event => {
                if (favoriteSports.includes(event.sport)) recommended.push(event);
                else others.push(event);
            });
        } else {
            others.push(...filtered);
        }

        others.sort((a, b) => {
            if (sortBy === 'soonest') return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
            if (sortBy === 'closest') return (a.distance || 999) - (b.distance || 999);
            return 0;
        });

        return { recommendedEvents: recommended, otherEvents: others };
    }, [allNearbyEvents, searchQuery, activeSport, sortBy, userProfile]);

    const renderContent = () => {
        if (!initialLoadComplete) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <EventCardSkeleton />
                    <EventCardSkeleton />
                    <EventCardSkeleton />
                </div>
            )
        }
        
        const hasRecommended = recommendedEvents.length > 0;
        const hasOther = otherEvents.length > 0;

        if (!hasRecommended && !hasOther) {
            return <ActionableEmptyState onOpenCreateModal={() => setShowCreateModal(true)} />
        }

        return (
            <>
                {hasRecommended && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-50 mb-4 flex items-center gap-2"><Star className="w-6 h-6 text-yellow-400" /> Recommended For You</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedEvents.map(event => <EventCard key={event.id} event={event} onSelectEvent={setSelectedEvent} />)}
                        </div>
                    </section>
                )}
                 <section>
                        {hasRecommended && <h2 className="text-2xl font-bold text-slate-50 mb-4">All Other Games</h2>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherEvents.map(event => <EventCard key={event.id} event={event} onSelectEvent={setSelectedEvent} />)}
                        </div>
                 </section>
            </>
        )
    }

    return (
        <div className="min-h-screen liquid-gradient p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-50 mb-2">Discover</h1>
                <p className="text-slate-300">Find games happening around you.</p>
            </header>

            <div className="space-y-4 mb-8">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input placeholder="Search by name or sport..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 glass-surface border-white/15 h-12" />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                     <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {SPORTS_FILTERS.map(sport => <Chip key={sport} isActive={activeSport === sport} onClick={() => setActiveSport(sport)}>{sport}</Chip>)}
                     </div>
                     <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full md:w-[180px] glass-surface border-white/15 h-11">
                             <SlidersHorizontal className="w-4 h-4 mr-2" />
                             <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="soonest">Sort: Soonest</SelectItem>
                             <SelectItem value="closest">Sort: Closest</SelectItem>
                        </SelectContent>
                     </Select>
                </div>
            </div>

            {renderContent()}

             {selectedEvent && <EventDetailsModal event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} onEventUpdated={() => {}} />}
             {showCreateModal && <CreateEventModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onEventCreated={() => {}} userLocation={userLocation} />}
        </div>
    );
}
