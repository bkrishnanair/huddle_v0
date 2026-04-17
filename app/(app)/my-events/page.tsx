"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/firebase-context"
import { Button } from "@/components/ui/button"
import CreateEventModal from "@/components/create-event-modal"
import { EventList } from "@/components/profile/event-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, BarChart3, CalendarDays } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { OrganizerStudio } from "@/components/organizer-studio"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { GameEvent } from "@/lib/types"

export default function MyEventsPage() {
  const { user, loading } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // State to trigger re-fetch
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStartDate, setFilterStartDate] = useState("")
  const [filterEndDate, setFilterEndDate] = useState("")
  const [activeTab, setActiveTab] = useState("joined")
  const [showDashboard, setShowDashboard] = useState(false)
  const [eventToClone, setEventToClone] = useState<GameEvent | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search)
        if (searchParams.get("tab") === "studio") {
            setShowDashboard(true)
        }
        const cloneId = searchParams.get("cloneEventId")
        if (cloneId) {
            getDoc(doc(db, "events", cloneId)).then(snap => {
                if (snap.exists()) {
                    setEventToClone({ id: snap.id, ...snap.data() } as GameEvent)
                    setShowCreateModal(true)
                }
            }).catch(err => console.error("Error fetching clone event", err))
        }
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen liquid-gradient">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen liquid-gradient">
        <div className="text-white">Please sign in to see your events.</div>
      </div>
    )
  }

  const handleEventCreated = () => {
    setShowCreateModal(false);
    setRefreshKey(prevKey => prevKey + 1); // Increment key to force re-render and re-fetch
  };

  return (
    <div className="min-h-screen liquid-gradient p-4 pb-[var(--safe-bottom)] md:p-8 md:pb-[var(--safe-bottom)]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-50 tracking-tight">My Events</h1>
          <p className="text-slate-400 font-medium text-lg">Manage your joined and hosted events.</p>
        </div>
        <div className="flex flex-row items-center flex-wrap gap-3 w-full md:w-auto">
          <Button onClick={() => setShowDashboard(!showDashboard)} variant={showDashboard ? "secondary" : "outline"} size="lg" className="h-12 px-5 md:px-6 rounded-2xl border-white/10 shadow-xl transition-all font-bold bg-slate-900/50 hover:bg-slate-800 text-white">
            <BarChart3 className="w-5 h-5 md:mr-2" />
            <span className="hidden md:inline">Dashboard</span>
          </Button>
          <Button onClick={() => setShowCreateModal(true)} size="lg" className="h-12 flex-1 md:flex-none px-6 rounded-2xl bg-primary text-primary-foreground shadow-2xl hover:scale-105 transition-all font-bold">
            <Plus className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Create Event</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </header>

      {showDashboard && (
        <div className="mb-12 outline-none animate-in fade-in slide-in-from-top-4 duration-500">
          <OrganizerStudio onTriggerCreate={() => setShowCreateModal(true)} />
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} key={refreshKey} className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="max-w-max">
            <TabsList className="h-12 p-1 glass-surface border border-white/10 rounded-2xl shadow-2xl flex items-center bg-transparent">
              <TabsTrigger
                value="joined"
                className="px-8 h-10 rounded-xl font-bold text-slate-400 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
              >
                Joined
              </TabsTrigger>
              <TabsTrigger
                value="organized"
                className="px-8 h-10 rounded-xl font-bold text-slate-400 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
              >
                Hosted
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search your events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 bg-slate-900/50 border-white/10 text-slate-200 placeholder:text-slate-500 rounded-xl h-10"
              />
            </div>
            {/* Date Range */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Input
                type="date"
                value={filterStartDate}
                onChange={(e) => {
                  setFilterStartDate(e.target.value);
                  if (filterEndDate && e.target.value > filterEndDate) setFilterEndDate("");
                }}
                className="w-full md:w-40 bg-slate-900/50 border-white/10 text-slate-200 rounded-xl h-10 [color-scheme:dark] text-xs"
                placeholder="Start date"
              />
              <span className="text-slate-500 text-xs shrink-0">to</span>
              <Input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                min={filterStartDate}
                className="w-full md:w-40 bg-slate-900/50 border-white/10 text-slate-200 rounded-xl h-10 [color-scheme:dark] text-xs"
                placeholder="End date"
              />
              {(filterStartDate || filterEndDate) && (
                <button
                  onClick={() => { setFilterStartDate(""); setFilterEndDate(""); }}
                  className="text-xs text-slate-400 hover:text-white shrink-0 px-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <TabsContent value="organized" className="mt-0 outline-none">
          <EventList userId={user.uid} eventType="organized" searchQuery={searchQuery} filterStartDate={filterStartDate} filterEndDate={filterEndDate} />
        </TabsContent>
        <TabsContent value="joined" className="mt-0 outline-none">
          <EventList userId={user.uid} eventType="joined" searchQuery={searchQuery} filterStartDate={filterStartDate} filterEndDate={filterEndDate} />
        </TabsContent>
      </Tabs>

      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEventToClone(null);
          }}
          onEventCreated={handleEventCreated}
          userLocation={null}
          initialData={eventToClone || undefined}
          isEditMode={false}
        />
      )}
    </div>
  )
}