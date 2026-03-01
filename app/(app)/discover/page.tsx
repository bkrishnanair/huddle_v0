"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/lib/firebase-context"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EventCard, EventCardSkeleton } from "@/components/events/event-card"
import EventDetailsDrawer from "@/components/event-details-drawer"
import CreateEventModal from "@/components/create-event-modal"
import { Chip } from "@/components/ui/chip"
import { Search, SlidersHorizontal, PlusCircle, Star, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GameEvent } from "@/lib/types"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { isToday, isWeekend, isBefore, addHours, isFuture } from "date-fns"

const CATEGORY_FILTERS = ["All", "Sports", "Music", "Community", "Learning", "Food & Drink", "Tech", "Arts & Culture", "Outdoors"];

const ActionableEmptyState = ({ onOpenCreateModal }: { onOpenCreateModal: () => void }) => (
    <div className="text-center glass-surface border-white/15 rounded-2xl p-8 mt-8">
        <PlusCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-50 mb-2">No Events Nearby</h3>
        <p className="text-slate-300 mb-6">Your area is waiting for a leader. Be the one to get things started.</p>
        <Button size="lg" onClick={onOpenCreateModal} className="h-12 px-8 text-lg">
            Create the First Event
        </Button>
    </div>
);

export default function DiscoverPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [allNearbyEvents, setAllNearbyEvents] = useState<GameEvent[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeTime, setActiveTime] = useState("All");
    const [activeRange, setActiveRange] = useState("All");
    const [sortBy, setSortBy] = useState("soonest");

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLat = position.coords.latitude;
                const newLng = position.coords.longitude;
                setUserLocation(prev =>
                    prev?.lat === newLat && prev?.lng === newLng ? prev : { lat: newLat, lng: newLng }
                );
            },
            () => {
                const defaultLat = 37.7749;
                const defaultLng = -122.4194;
                setUserLocation(prev =>
                    prev?.lat === defaultLat && prev?.lng === defaultLng ? prev : { lat: defaultLat, lng: defaultLng }
                );
            }
        );
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!userLocation) return;
            setLoading(true);
            try {
                // Fetch events globally if 'All' is possible (huge radius)
                const radius = 5000000;

                const fetchPromises: Promise<Response>[] = [
                    fetch(`/api/events?lat=${userLocation.lat}&lon=${userLocation.lng}&radius=${radius}`)
                ];

                if (user?.uid) {
                    const token = await user.getIdToken();
                    fetchPromises.push(
                        fetch(`/api/users/${user.uid}/profile`, {
                            headers: { "Authorization": `Bearer ${token}` }
                        })
                    );
                }

                const responses = await Promise.all(fetchPromises);
                const eventsRes = responses[0];
                if (eventsRes.ok) setAllNearbyEvents((await eventsRes.json()).events || []);

                if (responses.length > 1 && responses[1].ok) {
                    setUserProfile((await responses[1].json()).profile);
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setLoading(false);
                setInitialLoadComplete(true);
            }
        };

        fetchInitialData();
    }, [user?.uid, userLocation]);

    const handleLogout = async () => {
        try {
            await signOut(auth)
            toast.success("Logged out successfully")
            router.push("/")
        } catch (error) {
            toast.error("Failed to log out")
        }
    }

    const { recommendedEvents, otherEvents } = useMemo(() => {
        const filtered = allNearbyEvents.filter(event => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                event.name.toLowerCase().includes(searchLower) ||
                (event.category && event.category.toLowerCase().includes(searchLower)) ||
                (typeof event.location === 'string' && event.location.toLowerCase().includes(searchLower));
            const matchesCategory = activeCategory === 'All' || event.category === activeCategory;

            let matchesRange = true;
            let eventDistance = event.distance;

            if (userLocation && event.geopoint) {
                const R = 3958.8; // Radius in miles
                const dLat = (event.geopoint.latitude - userLocation.lat) * Math.PI / 180;
                const dLon = (event.geopoint.longitude - userLocation.lng) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(event.geopoint.latitude * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                eventDistance = R * c;
                event.distance = eventDistance; // Store for sorting
            }

            if (activeRange !== 'All' && eventDistance !== undefined) {
                const rangeMiles = parseInt(activeRange);
                if (eventDistance > rangeMiles) {
                    matchesRange = false;
                }
            }

            let isNotPast = true;
            if (!event.date || event.date.includes('/')) {
                isNotPast = true; // Legacy events
            } else {
                try {
                    const eventDateTime = new Date(`${event.date}T${event.time || '00:00'}`);
                    if (!isNaN(eventDateTime.getTime())) {
                        isNotPast = isFuture(addHours(eventDateTime, 1));
                    }
                } catch (e) { }
            }

            let matchesTime = true;
            if (activeTime !== 'All') {
                const now = new Date();
                if (!event.date || event.date.includes('/')) matchesTime = true; // Skip bad legacy data
                else {
                    try {
                        const eventDateTime = new Date(`${event.date}T${event.time || '00:00'}`);
                        if (!isNaN(eventDateTime.getTime())) {
                            if (activeTime === 'Next 2 Hrs') {
                                matchesTime = isBefore(eventDateTime, addHours(now, 2)) && isFuture(eventDateTime);
                            } else if (activeTime === 'Today') {
                                matchesTime = isToday(eventDateTime);
                            } else if (activeTime === 'This Weekend') {
                                matchesTime = isWeekend(eventDateTime) && isFuture(eventDateTime);
                            }
                        }
                    } catch (e) {
                        matchesTime = true;
                    }
                }
            }

            return matchesSearch && matchesCategory && matchesRange && matchesTime && isNotPast;
        });

        const favoriteCategories = userProfile?.favoriteCategories || [];
        const recommended: GameEvent[] = [];
        const others: GameEvent[] = [];

        if (favoriteCategories.length > 0 && activeCategory === 'All' && searchQuery === '') {
            filtered.forEach(event => {
                if (favoriteCategories.includes(event.category)) recommended.push(event);
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
    }, [allNearbyEvents, searchQuery, activeCategory, activeTime, activeRange, sortBy, userProfile, userLocation]);

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
                            {recommendedEvents.map(event => <EventCard key={event.id} event={event} onSelectEvent={setSelectedEvent} showMapButton={true} />)}
                        </div>
                    </section>
                )}
                <section>
                    {hasRecommended && <h2 className="text-2xl font-bold text-slate-50 mb-4">All Other Events</h2>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherEvents.map(event => <EventCard key={event.id} event={event} onSelectEvent={setSelectedEvent} showMapButton={true} />)}
                    </div>
                </section>
            </>
        )
    }

    return (
        <div className="min-h-screen w-full liquid-gradient p-4 pb-28 md:p-8 md:pb-28 overflow-x-hidden">
            <header className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold text-slate-50 tracking-tight">Discover</h1>
                    <p className="text-slate-400 font-medium text-lg">Find events happening around you.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl glass-surface border border-rose-500/20 shadow-xl hover:bg-rose-500/10 text-rose-400" onClick={handleLogout}>
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <div className="flex flex-col gap-6 mb-12">
                {/* Search & Sort Group */}
                <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search by name, category, or location..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-12 glass-surface border-white/10 h-14 rounded-2xl shadow-2xl text-lg focus:ring-primary/20"
                        />
                    </div>
                    <div className="w-full md:w-auto shrink-0">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full md:w-[200px] glass-surface border-white/10 h-14 rounded-2xl shadow-2xl font-bold text-slate-300">
                                <SlidersHorizontal className="w-4 h-4 mr-3 text-primary" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass-surface border-white/10">
                                <SelectItem value="soonest">Sort: Soonest</SelectItem>
                                <SelectItem value="closest">Sort: Closest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Filter Cluster */}
                <div className="flex flex-col gap-3 w-full">
                    {/* Category Group */}
                    <div className="flex items-center gap-2 p-1.5 glass-surface border border-white/10 rounded-full shadow-2xl max-w-max overflow-x-auto no-scrollbar">
                        {CATEGORY_FILTERS.map(category => (
                            <div key={category} className="shrink-0">
                                <Chip
                                    isActive={activeCategory === category}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </Chip>
                            </div>
                        ))}
                    </div>

                    {/* Time Group */}
                    <div className="flex items-center gap-2 p-1.5 glass-surface border border-white/10 rounded-full shadow-2xl max-w-max overflow-x-auto no-scrollbar">
                        {["All", "Next 2 Hrs", "Today", "This Weekend"].map(time => (
                            <div key={time} className="shrink-0">
                                <Chip
                                    isActive={activeTime === time}
                                    onClick={() => setActiveTime(time)}
                                >
                                    {time}
                                </Chip>
                            </div>
                        ))}
                    </div>

                    {/* Range Group */}
                    <div className="flex items-center gap-3 p-1.5 glass-surface border border-white/10 rounded-full shadow-2xl max-w-max overflow-x-auto no-scrollbar px-4">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mr-1 shrink-0">Range:</span>
                        {["All", "5 Miles", "10 Miles", "25 Miles"].map(range => (
                            <div key={range} className="shrink-0">
                                <Chip
                                    isActive={activeRange === range}
                                    onClick={() => setActiveRange(range)}
                                >
                                    {range}
                                </Chip>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {renderContent()}

            {selectedEvent && <EventDetailsDrawer event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} onEventUpdated={() => { }} />}
            {showCreateModal && <CreateEventModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onEventCreated={() => { }} userLocation={userLocation} />}
        </div>
    )
}