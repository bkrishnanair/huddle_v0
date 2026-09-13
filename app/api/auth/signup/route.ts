import "server-only";

import { type NextRequest, NextResponse } from "next/server"
import { getFirebaseAdminAuth, getFirebaseAdminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { signupInput } from '@/lib/request-schemas'

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const validation = signupInput.safeParse(await request.json().catch(() => null));
    if (!validation.success) return NextResponse.json({ error: 'Invalid signup input' }, { status: 400 });
    const { email, password, name } = validation.data;

    // Check if Firebase is configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return NextResponse.json({ error: 'Authentication is unavailable' }, { status: 503 });
    }

    // Server requests must not share the browser SDK's mutable auth session.
    const adminAuth = getFirebaseAdminAuth();
    const db = getFirebaseAdminDb();
    if (!adminAuth || !db) return NextResponse.json({ error: 'Authentication is unavailable' }, { status: 503 });
    const user = await adminAuth.createUser({ email, password, displayName: name });
    await db.collection('users').doc(user.uid).set({ email, name, displayName: name, createdAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ user: {uid: user.uid, email, name, emailVerified: user.emailVerified} });
  } catch (error: any) {
    console.error("Signup error:", error)

    if (error.message.includes("email-already-in-use") || error.message.includes("User already exists")) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 })
    }

    if (error.message.includes("weak-password")) {
      return NextResponse.json({ error: "Password should be at least 6 characters" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
