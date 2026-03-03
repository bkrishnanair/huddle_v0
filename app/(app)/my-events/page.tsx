"use client"
import { useState } from "react"
import { useAuth } from "@/lib/firebase-context"
import { Button } from "@/components/ui/button"
import CreateEventModal from "@/components/create-event-modal"
import { EventList } from "@/components/profile/event-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function MyEventsPage() {
  const { user, loading } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // State to trigger re-fetch
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDate, setFilterDate] = useState("")

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
    <div className="min-h-screen liquid-gradient p-4 pb-28 md:p-8 md:pb-28">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-50 tracking-tight">My Events</h1>
          <p className="text-slate-400 font-medium text-lg">Manage your joined and hosted events.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} size="lg" className="h-12 px-6 rounded-2xl bg-primary text-primary-foreground shadow-2xl hover:scale-105 transition-all font-bold">
          <Plus className="w-5 h-5 mr-2" />
          Create Event
        </Button>
      </header>

      <Tabs defaultValue="joined" key={refreshKey} className="space-y-8">
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
            {/* Date Picker */}
            <div className="relative w-full md:w-48">
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-slate-900/50 border-white/10 text-slate-200 rounded-xl h-10 [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        <TabsContent value="organized" className="mt-0 outline-none">
          <EventList userId={user.uid} eventType="organized" searchQuery={searchQuery} filterDate={filterDate} />
        </TabsContent>
        <TabsContent value="joined" className="mt-0 outline-none">
          <EventList userId={user.uid} eventType="joined" searchQuery={searchQuery} filterDate={filterDate} />
        </TabsContent>
      </Tabs>

      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={handleEventCreated}
          userLocation={null}
        />
      )}
    </div>
  )
}