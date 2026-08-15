import 'server-only'

import { NextRequest, NextResponse } from 'next/server'
import { getFirebaseAdminDb } from '@/lib/firebase-admin'
import { getServerCurrentUser } from '@/lib/auth-server'
import { z } from 'zod'

const tokenSchema = z.object({
  token: z.string().min(1),
})

export async function POST(request: NextRequest) {
  const user = await getServerCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const validation = tokenSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const { getFirebaseAdminDb } = await import('@/lib/firebase-admin')
    const { FieldValue } = await import('firebase-admin/firestore')
    const adminDb = getFirebaseAdminDb()
    if (!adminDb) return NextResponse.json({ error: 'DB Unavailable' }, { status: 500 })

    await adminDb.collection('users').doc(user.uid).update({
      fcmTokens: FieldValue.arrayUnion(validation.data.token),
      pushEnabled: true,
      pushPermissionAskedAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Push token registration error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getServerCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const validation = tokenSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const { getFirebaseAdminDb } = await import('@/lib/firebase-admin')
    const { FieldValue } = await import('firebase-admin/firestore')
    const adminDb = getFirebaseAdminDb()
    if (!adminDb) return NextResponse.json({ error: 'DB Unavailable' }, { status: 500 })

    await adminDb.collection('users').doc(user.uid).update({
      fcmTokens: FieldValue.arrayRemove(validation.data.token)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Push token unregistration error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

const stateSchema = z.object({
  pushPermissionState: z.enum(['default', 'granted', 'denied'])
})

export async function PATCH(request: NextRequest) {
  const user = await getServerCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const validation = stateSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const { getFirebaseAdminDb } = await import('@/lib/firebase-admin')
    const adminDb = getFirebaseAdminDb()
    if (!adminDb) return NextResponse.json({ error: 'DB Unavailable' }, { status: 500 })

    await adminDb.collection('users').doc(user.uid).update({
      pushPermissionState: validation.data.pushPermissionState,
      pushPermissionUpdatedAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Push state update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
