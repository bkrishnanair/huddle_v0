"use client"

import { useRouter } from "next/navigation"
import { useFirebase } from "@/lib/firebase-context"
import EventsPage from "@/components/events-page"

export default function EventsPageRoute() {
  const { user } = useFirebase()
  const router = useRouter()

  if (!user) return null

  const handleSwitchToMap = () => {
    router.push("/map")
  }

  return <EventsPage user={user} onSwitchToMap={handleSwitchToMap} />
}
