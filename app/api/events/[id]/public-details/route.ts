import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    if (!eventId) {
      return new NextResponse(JSON.stringify({ error: 'Event ID is required' }), { status: 400 });
    }

    const eventRef = adminDb.collection('events').doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return new NextResponse(JSON.stringify({ error: 'Event not found' }), { status: 404 });
    }

    const eventData = eventDoc.data();

    // Return a subset of data safe for public view
    const publicEventData = {
      id: eventDoc.id,
      title: eventData?.title,
      sport: eventData?.sport,
      location: eventData?.location,
      date: eventData?.date,
      time: eventData?.time,
      maxPlayers: eventData?.maxPlayers,
      rsvps: eventData?.rsvps || [],
      organizerName: eventData?.organizerName || 'The Organizer'
    };

    return NextResponse.json({ event: publicEventData });
  } catch (error) {
    console.error('Error fetching public event details:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
