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
    <div className="min-h-screen liquid-gradient p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">My Events</h1>
            <p className="text-white/80">View and manage your created and joined events.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="glass-card mt-4 md:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </header>

      <Tabs defaultValue="organized" key={refreshKey} className="glass-card p-4 rounded-2xl">
        <TabsList className="grid w-full grid-cols-2 bg-white/10">
          <TabsTrigger value="organized" className="text-white data-[state=active]:bg-white/20">Organized</TabsTrigger>
          <TabsTrigger value="joined" className="text-white data-[state=active]:bg-white/20">Joined</TabsTrigger>
        </TabsList>
        <TabsContent value="organized" className="mt-4">
          <EventList userId={user.uid} eventType="organized" />
        </TabsContent>
        <TabsContent value="joined" className="mt-4">
          <EventList userId={user.uid} eventType="joined" />
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