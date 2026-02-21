"use client"

import { useFirebase } from "@/lib/firebase-context"
import MapView from "@/components/map-view"

export default function MapClient({ eventId }: { eventId?: string }) {
    const { user } = useFirebase()

    return <MapView user={user} eventId={eventId} />
}
