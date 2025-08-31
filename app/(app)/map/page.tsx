"use client"

import { useFirebase } from "@/lib/firebase-context"
import MapView from "@/components/map-view"

export default function MapPage() {
  const { user } = useFirebase()

  if (!user) return null

  return <MapView user={user} onLogout={() => {}} />
}
