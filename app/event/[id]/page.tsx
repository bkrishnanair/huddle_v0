import { Metadata } from 'next';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { GameEvent } from '@/lib/types';
import { notFound, redirect } from 'next/navigation';
import { getCategoryColor } from '@/lib/utils';
import { MapPin, Users, Calendar, Clock } from 'lucide-react';

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params;
  const adminDb = getFirebaseAdminDb();
  if (!adminDb) return { title: 'Event Not Found' };

  const snap = await adminDb.collection('events').doc(id).get();
  if (!snap.exists) return { title: 'Event Not Found' };

  const event = snap.data() as GameEvent;
  
  return {
    title: `${event.name || event.title} | Huddle`,
    description: event.description || `Join ${event.organizerName} for ${event.category} on Huddle.`,
    openGraph: {
      title: `${event.name || event.title} | Huddle`,
      description: event.description || `Join this event and connect with others.`,
      url: `https://huddlemap.live/event/${id}`,
      siteName: 'Huddle',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.name || event.title} | Huddle`,
      description: event.description || `Join this event and connect with others.`,
    }
  };
}

export default async function PublicEventPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const adminDb = getFirebaseAdminDb();
  if (!adminDb) return notFound();

  const snap = await adminDb.collection('events').doc(id).get();
  if (!snap.exists) return notFound();

  const event = snap.data() as GameEvent;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name || event.title,
    startDate: `${event.date}T${event.time}:00`,
    endDate: event.endDate ? `${event.endDate}T${event.endTime || '23:59'}:00` : undefined,
    eventAttendanceMode: event.eventType === 'virtual' ? 'https://schema.org/OnlineEventAttendanceMode' : 
                         event.eventType === 'hybrid' ? 'https://schema.org/MixedEventAttendanceMode' : 
                         'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: event.eventType !== 'virtual' ? {
      '@type': 'Place',
      name: event.venue || event.location || 'College Park',
      geo: event.geopoint ? {
        '@type': 'GeoCoordinates',
        latitude: event.geopoint.latitude,
        longitude: event.geopoint.longitude
      } : undefined
    } : undefined,
    organizer: {
      '@type': 'Person',
      name: event.organizerName
    },
    description: event.description || `A ${event.category} event organized by ${event.organizerName}.`,
  };

  const bgGradient = `linear-gradient(135deg, ${getCategoryColor(event.category)}b3 0%, ${getCategoryColor(event.category)}1a 100%)`;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-2xl px-4 py-8 w-full">
        <div 
            className="rounded-2xl p-6 glass-surface text-white border border-white/10"
            style={{ background: bgGradient }}
        >
            <h1 className="text-3xl font-black tracking-tight mb-2">{event.name || event.title}</h1>
            <p className="font-bold text-lg opacity-90 mb-6 drop-shadow-md">{event.category} • Hosted by {event.organizerName} {event.isOrganizerVerified && <span className="text-blue-400">✓</span>}</p>

            <div className="space-y-4 font-medium">
                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 opacity-80" />
                    <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 opacity-80" />
                    <span>{event.time} {event.endTime ? `- ${event.endTime}` : ''}</span>
                </div>
                <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 opacity-80" />
                    <span>{event.eventType === 'virtual' ? 'Virtual' : (event.venue || event.location || "Location TBD")}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 opacity-80" />
                    <span>{event.currentPlayers} / {event.maxPlayers} Attending</span>
                </div>
            </div>

            {event.description && (
                <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                </div>
            )}
        </div>

        <div className="mt-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-100">Want to join this event?</h2>
            <a 
                href={`/map?eventId=${id}`}
                className="inline-block bg-primary text-primary-foreground font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all w-full sm:w-auto"
            >
                Open in Huddle App
            </a>
        </div>
      </div>
    </div>
  );
}
