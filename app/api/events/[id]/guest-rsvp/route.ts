import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';

const rsvpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long.").max(50, "Name cannot exceed 50 characters."),
  status: z.enum(['in', 'out']),
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const body = await request.json();

    const validation = rsvpSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(JSON.stringify({ error: validation.error.format() }), { status: 400 });
    }

    const { name, status } = validation.data;
    
    const eventRef = adminDb.collection('events').doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return new NextResponse(JSON.stringify({ error: 'Event not found' }), { status: 404 });
    }

    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const newRsvp = {
      guestId,
      name: `${name} (Guest)`,
      status,
    };

    await eventRef.update({
      rsvps: FieldValue.arrayUnion(newRsvp)
    });

    return NextResponse.json({ success: true, rsvp: newRsvp });

  } catch (error) {
    console.error('Error in guest RSVP:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
