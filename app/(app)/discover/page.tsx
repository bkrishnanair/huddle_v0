"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/lib/firebase-context"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EventCard, EventCardSkeleton } from "@/components/events/event-card"
import EventDetailsDrawer from "@/components/event-details-drawer"
import CreateEventModal from "@/components/create-event-modal"
import { Chip } from "@/components/ui/chip"
import { Search, SlidersHorizontal, PlusCircle, Star, LogOut, Calendar, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GameEvent } from "@/lib/types"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { isToday, isWeekend, isBefore, addHours, isFuture, addDays, endOfWeek, startOfDay } from "date-fns"
import { getCategoryColor, isEventLive } from "@/lib/utils"

const CATEGORY_FILTERS = ["All", "Recommended", "🖥️ Virtual", "Sports", "Music", "Community", "Learning", "Food & Drink", "Tech", "Arts & Culture", "Outdoors"];
const TIME_FILTERS = ["All", "Live", "Today", "This Week", "This Weekend"];

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
    const [activeRange, setActiveRange] = useState("50 Miles");
    const [sortBy, setSortBy] = useState("soonest");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");

    const [isAiSearching, setIsAiSearching] = useState(false);
    const [aiKeywords, setAiKeywords] = useState<string[]>([]);
    const [showMoreFilters, setShowMoreFilters] = useState(false);

    // Organizer search
    const [orgResults, setOrgResults] = useState<any[]>([]);
    const [isOrgSearching, setIsOrgSearching] = useState(false);

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
                    fetch(`/api/events?lat=${userLocation.lat}&lon=${userLocation.lng}&radius=${radius}&groupRecurring=true`)
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

    const handleAiSearch = async (query: string) => {
      setIsAiSearching(true);
      setAiKeywords([]);
      try {
        const res = await fetch('/api/ai/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        const filters = data.filters;

        if (filters.categories && filters.categories.length > 0) {
          setActiveCategory(filters.categories[0]);
        } else {
          setActiveCategory('All');
        }

        if (filters.timeFilter) {
           const timeMap: Record<string, string> = {
              'live': 'Live', 'today': 'Today', 'this_week': 'This Week', 'this_weekend': 'This Weekend', 'this_month': 'This Month'
           };
           setActiveTime(timeMap[filters.timeFilter] || 'All');
        } else {
           setActiveTime('All');
        }

        if (filters.keywords && filters.keywords.length > 0) {
          setAiKeywords(filters.keywords);
        }
        
        toast.success(`AI Search: Filtered for "${query}" ✨`);
      } catch (e) {
        toast.error('AI Search failed. Try a regular search.');
      } finally {
        setIsAiSearching(false);
      }
    };

    // Debounced organizer search
    useEffect(() => {
        if (searchQuery.trim().length < 2) { setOrgResults([]); return; }
        const timer = setTimeout(async () => {
            setIsOrgSearching(true);
            try {
                const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery.trim())}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrgResults(data.users || []);
                } else {
                    setOrgResults([]);
                }
            } catch { setOrgResults([]); }
            finally { setIsOrgSearching(false); }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

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
                (typeof event.category === 'string' && event.category.toLowerCase().includes(searchLower)) ||
                (typeof event.location === 'string' && event.location.toLowerCase().includes(searchLower));

            let matchesAi = true;
            if (aiKeywords.length > 0) {
              const fullText = `${event.name} ${event.description || ''} ${event.category}`.toLowerCase();
              matchesAi = aiKeywords.some(kw => fullText.includes(kw.toLowerCase()));
            }

            let eventDistance = event.distance;
            let matchesRange = true;

            if (activeCategory === 'Recommended') {
                const interests = userProfile?.favoriteSports || [];
                if (interests.length > 0 && !interests.includes(event.category)) return false;
            } else if (activeCategory === '🖥️ Virtual') {
                if (event.eventType !== 'virtual' && event.eventType !== 'hybrid') return false;
            } else if (activeCategory !== 'All') {
                if (event.category !== activeCategory) return false;
            }

            if (userLocation) {
                const R = 3958.8; // Radius in miles
                let venueDistance: number | undefined;
                let orgDistance: number | undefined;

                if (event.geopoint) {
                    const dLat = (event.geopoint.latitude - userLocation.lat) * Math.PI / 180;
                    const dLon = (event.geopoint.longitude - userLocation.lng) * Math.PI / 180;
                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(event.geopoint.latitude * Math.PI / 180) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    venueDistance = R * c;
                }

                if (event.orgGeopoint) {
                    const dLat = (event.orgGeopoint.latitude - userLocation.lat) * Math.PI / 180;
                    const dLon = (event.orgGeopoint.longitude - userLocation.lng) * Math.PI / 180;
                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(event.orgGeopoint.latitude * Math.PI / 180) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    orgDistance = R * c;
                }

                if (venueDistance !== undefined && orgDistance !== undefined) {
                    eventDistance = Math.min(venueDistance, orgDistance);
                    event.distance = venueDistance; // Keep venue distance for display if available
                } else if (venueDistance !== undefined) {
                    eventDistance = venueDistance;
                    event.distance = venueDistance;
                } else if (orgDistance !== undefined) {
                    eventDistance = orgDistance;
                    event.distance = orgDistance;
                }
            }

            // Skip distance filtering for virtual events (no geopoint)
            if (activeRange !== 'All' && eventDistance !== undefined) {
                const rangeMiles = parseInt(activeRange);
                if (eventDistance > rangeMiles) {
                    matchesRange = false;
                }
            } else if (activeRange !== 'All' && !event.geopoint) {
                // Virtual events pass range filter (they have no physical distance)
                matchesRange = true;
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
                            if (activeTime === 'Live') {
                                // Use canonical isEventLive for cross-page consistency
                                const isStartingSoon = isBefore(eventDateTime, addHours(now, 1)) && isFuture(eventDateTime);
                                matchesTime = isEventLive(event) || isStartingSoon;
                            } else if (activeTime === 'Today') {
                                matchesTime = isToday(eventDateTime);
                            } else if (activeTime === 'This Week') {
                                const weekEnd = endOfWeek(now, { weekStartsOn: 0 }); // Sunday
                                matchesTime = eventDateTime >= startOfDay(now) && eventDateTime <= weekEnd;
                            } else if (activeTime === 'This Weekend') {
                                matchesTime = isWeekend(eventDateTime) && isFuture(eventDateTime);
                            }
                        }
                    } catch (e) {
                        matchesTime = true;
                    }
                }
            }

            // Date range filter
            let matchesDateRange = true;
            if (filterStartDate) {
                if (filterEndDate) {
                    matchesDateRange = !!event.date && event.date >= filterStartDate && event.date <= filterEndDate;
                } else {
                    matchesDateRange = event.date === filterStartDate;
                }
            }

            return matchesSearch && matchesAi && matchesRange && matchesTime && isNotPast && matchesDateRange;
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
            if (activeTime === 'Starts Soon') return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
            if (sortBy === 'soonest') return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
            if (sortBy === 'closest') return (a.distance || 999) - (b.distance || 999);
            if (sortBy === 'most_attendees') return (b.currentPlayers || 0) - (a.currentPlayers || 0);
            if (sortBy === 'newest') {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            }
            return 0;
        });

        return { recommendedEvents: recommended, otherEvents: others };
    }, [allNearbyEvents, searchQuery, aiKeywords, activeCategory, activeTime, activeRange, userLocation, userProfile, sortBy, filterStartDate, filterEndDate]);

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
                {/* Organizer search results */}
                {orgResults.length > 0 && searchQuery.trim().length >= 2 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-black text-slate-50 mb-3 uppercase tracking-wider">Organizers</h2>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
                            {orgResults.map((org) => (
                                <Link
                                    key={org.uid}
                                    href={`/profile/${org.uid}`}
                                    className="shrink-0 w-[200px] glass-surface border border-white/10 rounded-xl p-3 hover:bg-white/5 transition-all flex items-center gap-3"
                                >
                                    {org.photoURL ? (
                                        <img src={org.photoURL} alt={org.displayName} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                            {org.displayName?.charAt(0) || '?'}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-white truncate">{org.displayName}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{org.bio || 'Organizer'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
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
        <div className="min-h-screen w-full liquid-gradient p-4 pb-[var(--safe-bottom)] md:p-8 md:pb-[var(--safe-bottom)] overflow-x-hidden">
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
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors z-10" />
                        <Input
                            placeholder="Search by name, category, or event vibe..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    handleAiSearch(searchQuery);
                                }
                            }}
                            className="pl-12 pr-12 glass-surface border-white/10 h-14 rounded-2xl shadow-2xl text-lg focus:ring-primary/20"
                        />
                        {isAiSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400 animate-spin" />}
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
                                <SelectItem value="most_attendees">Sort: Most Attendees</SelectItem>
                                <SelectItem value="newest">Sort: Recently Added</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Filter Cluster */}
                <div className="flex flex-col gap-3 w-full">
                    {/* Category Group - always visible */}
                    <div className="flex items-center gap-2 p-1.5 glass-surface border border-white/10 rounded-full shadow-2xl max-w-max overflow-x-auto no-scrollbar">
                        {CATEGORY_FILTERS.map(category => (
                            <div key={category} className="shrink-0">
                                <Chip
                                    isActive={activeCategory === category}
                                    onClick={() => setActiveCategory(category)}
                                    color={category !== 'All' ? getCategoryColor(category) : undefined}
                                >
                                    {category}
                                </Chip>
                            </div>
                        ))}
                    </div>

                    {/* Compact filter row: Time chips + More Filters toggle */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 p-1 glass-surface border border-white/10 rounded-full shadow-xl overflow-x-auto no-scrollbar">
                            {TIME_FILTERS.map(time => (
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
                        <button
                            onClick={() => setShowMoreFilters(!showMoreFilters)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${showMoreFilters || activeRange !== 'All' || filterStartDate
                                ? 'bg-primary/20 text-primary border-primary/30'
                                : 'glass-surface text-slate-400 border-white/10 hover:text-white'
                                }`}
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            {activeRange !== 'All' || filterStartDate ? 'Filtered' : 'More'}
                        </button>
                    </div>

                    {/* Expandable: Range + Date */}
                    {showMoreFilters && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 glass-surface border border-white/10 rounded-2xl shadow-xl animate-in slide-in-from-top-2 duration-200">
                            {/* Range */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0">Range</span>
                                <div className="flex items-center gap-1">
                                    {["All", "5mi", "10mi", "25mi"].map((range, i) => {
                                        const rangeValue = ["All", "5 Miles", "10 Miles", "25 Miles"][i];
                                        return (
                                            <button
                                                key={range}
                                                onClick={() => setActiveRange(rangeValue)}
                                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${activeRange === rangeValue
                                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {range}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="hidden sm:block w-px h-6 bg-white/10" />

                            {/* Date Range */}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <Input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={(e) => {
                                        setFilterStartDate(e.target.value);
                                        if (filterEndDate && e.target.value > filterEndDate) setFilterEndDate("");
                                    }}
                                    className="w-32 bg-transparent border-none text-slate-200 h-7 text-[11px] p-0 focus:ring-0 [color-scheme:dark]"
                                />
                                <span className="text-slate-500 text-[10px]">→</span>
                                <Input
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) => setFilterEndDate(e.target.value)}
                                    min={filterStartDate}
                                    className="w-32 bg-transparent border-none text-slate-200 h-7 text-[11px] p-0 focus:ring-0 [color-scheme:dark]"
                                />
                                {(filterStartDate || filterEndDate) && (
                                    <button
                                        onClick={() => { setFilterStartDate(""); setFilterEndDate(""); }}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {renderContent()}

            {selectedEvent && <EventDetailsDrawer event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} onEventUpdated={() => { }} />}
            {showCreateModal && <CreateEventModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onEventCreated={() => { }} userLocation={userLocation} />}
        </div>
    )
}