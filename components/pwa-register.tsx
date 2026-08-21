"use client"

import { useEffect } from 'react'
import { syncPushPermissionState } from '@/lib/push-client'
import { useFirebase } from '@/lib/firebase-context'

export function PWARegister() {
  const { user } = useFirebase()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  useEffect(() => {
    // Only audit and sync push permission when a user is signed in to avoid 401s for guests
    if (user?.uid) {
      syncPushPermissionState();
    }
  }, [user]);

  return null;
}
