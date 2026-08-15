"use client"

import { useEffect } from 'react'
import { syncPushPermissionState } from '@/lib/push-client'

export function PWARegister() {
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

    // Audit native Notification.permission on load and sync to user record
    syncPushPermissionState();
  }, []);

  return null;
}
