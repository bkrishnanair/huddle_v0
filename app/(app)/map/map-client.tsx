"use client"

import { useFirebase } from "@/lib/firebase-context"
import MapView from "@/components/map-view"

export default function MapClient({ eventId, initialCenter, intent }: { eventId?: string, initialCenter?: { lat: number, lng: number }, intent?: string }) {
    const { user } = useFirebase()

    return <MapView user={user} eventId={eventId} initialCenter={initialCenter} intent={intent} />
}
