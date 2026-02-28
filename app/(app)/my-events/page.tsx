"use client"
import { useState } from "react"
import { useAuth } from "@/lib/firebase-context"
import { Button } from "@/components/ui/button"
import CreateEventModal from "@/components/create-event-modal"
import { EventList } from "@/components/profile/event-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

export default function MyEventsPage() {
  const { user, loading } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // State to trigger re-fetch

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
          <p className="text-slate-400 font-medium text-lg">Manage your organized and joined games.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} size="lg" className="h-12 px-6 rounded-2xl bg-primary text-primary-foreground shadow-2xl hover:scale-105 transition-all font-bold">
          <Plus className="w-5 h-5 mr-2" />
          Create Event
        </Button>
      </header>

      <Tabs defaultValue="organized" key={refreshKey} className="space-y-8">
        <div className="max-w-max">
          <TabsList className="h-12 p-1 glass-surface border border-white/10 rounded-2xl shadow-2xl flex items-center bg-transparent">
            <TabsTrigger
              value="organized"
              className="px-8 h-10 rounded-xl font-bold text-slate-400 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              Organized
            </TabsTrigger>
            <TabsTrigger
              value="joined"
              className="px-8 h-10 rounded-xl font-bold text-slate-400 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              Joined
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="px-8 h-10 rounded-xl font-bold text-slate-400 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="organized" className="mt-0 outline-none">
          <EventList userId={user.uid} eventType="organized" />
        </TabsContent>
        <TabsContent value="joined" className="mt-0 outline-none">
          <EventList userId={user.uid} eventType="joined" />
        </TabsContent>
        <TabsContent value="history" className="mt-0 outline-none">
          <EventList userId={user.uid} eventType="history" />
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