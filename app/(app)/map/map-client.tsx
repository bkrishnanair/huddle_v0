"use client"

import { useFirebase } from "@/lib/firebase-context"
import MapView from "@/components/map-view"

export default function MapClient({ eventId, initialCenter }: { eventId?: string, initialCenter?: { lat: number, lng: number } }) {
    const { user } = useFirebase()

    return <MapView user={user} eventId={eventId} initialCenter={initialCenter} />
}
