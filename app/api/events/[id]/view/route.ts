import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse('Missing event id', { status: 400 });
    }

    const adminDb = getFirebaseAdminDb();
    if (!adminDb) {
      return new NextResponse('Database service unavailable', { status: 503 });
    }

    const eventRef = adminDb.collection('events').doc(id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return new NextResponse('Not found', { status: 404 });
    }

    await eventRef.update({ viewCount: FieldValue.increment(1) });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error tracking view:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
