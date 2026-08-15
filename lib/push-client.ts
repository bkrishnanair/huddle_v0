"use client"

import { getMessaging, getToken, isSupported } from 'firebase/messaging'
import { app } from './firebase'

export async function requestPushPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  if (!('Notification' in window)) return false

  try {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  } catch (error) {
    console.error("Error requesting push permission", error)
    return false
  }
}

export async function getAndRegisterPushToken() {
  if (typeof window === 'undefined') return null
  
  const isSupportedBrowser = await isSupported()
  if (!isSupportedBrowser) {
    console.log("Firebase Messaging not supported in this browser.")
    return null
  }

  if (Notification.permission !== 'granted') {
    return null
  }

  try {
    const messaging = getMessaging(app)
    
    // Pass config via URL params to the service worker
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''
    const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || ''
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''

    if (!apiKey || !projectId || !messagingSenderId || !appId) {
      console.warn("⚠️ Firebase configuration missing for push notifications service worker.");
      return null;
    }
    
    const swUrl = `/firebase-messaging-sw.js?apiKey=${encodeURIComponent(apiKey)}&projectId=${encodeURIComponent(projectId)}&messagingSenderId=${encodeURIComponent(messagingSenderId)}&appId=${encodeURIComponent(appId)}`
    const registration = await navigator.serviceWorker.register(swUrl)

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      serviceWorkerRegistration: registration,
    })

    if (token) {
      // Register token with our backend
      await fetch('/api/users/push-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      return token
    } else {
      console.log('No registration token available. Request permission to generate one.')
      return null
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err)
    return null
  }
}

/**
 * On app load, audit and sync the browser's native Notification.permission
 * state to Firestore ('default' | 'granted' | 'denied').
 */
export async function syncPushPermissionState() {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  const permission = Notification.permission; // 'default' | 'granted' | 'denied'

  const lastReported = localStorage.getItem('lastReportedPushPermission');
  if (lastReported === permission) return;

  try {
    const res = await fetch('/api/users/push-token', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pushPermissionState: permission })
    });
    if (res.ok) {
      localStorage.setItem('lastReportedPushPermission', permission);
    }
  } catch (err) {
    console.error('Failed to sync push permission state:', err);
  }
}
