"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import { useAuth } from "@/lib/firebase-context"
import { Button } from "@/components/ui/button"
import CreateEventModal from "@/components/CreateEventModal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

const EventList = dynamic(() => import("@/components/profile/event-list").then((mod) => ({ default: mod.EventList })), { ssr: false })

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
    // This case should ideally be handled by the layout's auth guard
    // but as a fallback:
    return (
      <div className="flex justify-center items-center h-screen liquid-gradient">
        <div className="text-white">Please sign in to view your events.</div>
      </div>
    )
  }

  const handleEventCreated = () => {
    setRefreshKey(prevKey => prevKey + 1) // Increment key to trigger re-fetch
  }

  return (
    <div className="min-h-screen liquid-gradient text-white">
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Events</h1>
            <p className="text-slate-300">The games you're hosting and joining.</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Event
          </Button>
        </header>

        <Tabs defaultValue="hosting" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px] bg-slate-800/60">
            <TabsTrigger value="hosting">Hosting</TabsTrigger>
            <TabsTrigger value="attending">Attending</TabsTrigger>
          </TabsList>
          <TabsContent value="hosting">
            <EventList key={`hosting-${refreshKey}`} userId={user.uid} type="hosting" />
          </TabsContent>
          <TabsContent value="attending">
            <EventList key={`attending-${refreshKey}`} userId={user.uid} type="attending" />
          </TabsContent>
        </Tabs>
      </div>

      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={handleEventCreated}
          userLocation={null} // You might want to pass the user's location here if available
        />
      )}
    </div>
  )
}
