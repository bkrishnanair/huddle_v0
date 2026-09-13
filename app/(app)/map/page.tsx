import 'server-only'

import type { Metadata } from 'next'
import MapClient from './map-client'
import { getEvent } from '@/lib/db'
import { GameEvent } from '@/lib/types'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const eventId = typeof resolvedParams.eventId === 'string' ? resolvedParams.eventId : undefined;

  if (eventId) {
    try {
      const event = await getEvent(eventId) as GameEvent;
      if (event && (event.isPrivate === undefined || event.isPrivate === false)) {
        return {
          title: event.name,
          description: `Explore this ${event.category} event on Huddle. Scheduled for ${event.date} at ${event.time}.`,
          openGraph: {
            title: `${event.name} on Huddle`,
            description: `Explore this ${event.category} event on Huddle. Scheduled for ${event.date} at ${event.time}.`,
            type: 'website',
          },
        }
      }
    } catch (e) {
      console.error("Error generating OG metadata for event", e);
    }
  }

  return {
    title: 'Map',
    description: 'Find local pickup games, activities, and events happening around you on Huddle.',
  }
}

export default async function MapPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const eventId = typeof resolvedParams.eventId === 'string' ? resolvedParams.eventId : undefined;
  const intent = typeof resolvedParams.intent === 'string' ? resolvedParams.intent : undefined;
  let initialCenter = undefined;

  if (eventId) {
    try {
      const event = await getEvent(eventId) as GameEvent;
      if (event && (event.isPrivate === undefined || event.isPrivate === false) && event.geopoint) {
        initialCenter = {
          lat: event.geopoint.latitude,
          lng: event.geopoint.longitude
        };
      }
    } catch (e) {
      console.error("Error fetching initial event center", e);
    }
  }

  return <MapClient eventId={eventId} initialCenter={initialCenter} intent={intent} />
}
