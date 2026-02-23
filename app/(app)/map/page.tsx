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
  const eventId = resolvedParams.eventId as string;

  if (eventId) {
    try {
      const event = await getEvent(eventId) as GameEvent;
      if (event) {
        return {
          title: `${event.name} | Huddle`,
          description: `Join this ${event.category} event on Huddle! Scheduled for ${event.date} at ${event.time}.`,
          openGraph: {
            title: `${event.name} on Huddle`,
            description: `Join this ${event.category} event on Huddle! Scheduled for ${event.date} at ${event.time}.`,
            type: 'website',
          },
        }
      }
    } catch (e) {
      console.error("Error generating OG metadata for event", e);
    }
  }

  return {
    title: 'Map | Huddle',
    description: 'Find local pickup games, activities, and events happening around you on Huddle.',
  }
}

export default async function MapPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const eventId = resolvedParams.eventId as string;
  const intent = resolvedParams.intent as string;
  let initialCenter = undefined;

  if (eventId) {
    try {
      const event = await getEvent(eventId) as GameEvent;
      if (event && event.geopoint) {
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
