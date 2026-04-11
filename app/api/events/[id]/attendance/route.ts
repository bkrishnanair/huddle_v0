import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getServerCurrentUser } from '@/lib/auth-server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const attendanceSchema = z.object({
  reportedAttendance: z.number().int().min(0).max(10000),
});

/**
 * POST /api/events/[id]/attendance
 * 
 * Allows the event organizer to report actual attendance count
 * after the event ends. This feeds the show-rate metric.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getServerCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const validation = attendanceSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const adminDb = getFirebaseAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: 'DB not available' }, { status: 500 });
  }

  try {
    const eventRef = adminDb.collection('events').doc(id);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (eventSnap.data()?.createdBy !== user.uid) {
      return NextResponse.json({ error: 'Only the organizer can report attendance' }, { status: 403 });
    }

    await eventRef.update({
      reportedAttendance: validation.data.reportedAttendance,
    });

    return NextResponse.json({
      message: 'Attendance reported successfully',
      reportedAttendance: validation.data.reportedAttendance,
    });
  } catch (error) {
    console.error('Report attendance error:', error);
    return NextResponse.json({ error: 'Failed to report attendance' }, { status: 500 });
  }
}
