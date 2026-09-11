"use client"

import { useEffect } from 'react'
import { syncPushPermissionState } from '@/lib/push-client'
import { useFirebase } from '@/lib/firebase-context'

export function PWARegister() {
  const { user } = useFirebase()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerSW = () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      };

      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
        return () => window.removeEventListener('load', registerSW);
      }
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
