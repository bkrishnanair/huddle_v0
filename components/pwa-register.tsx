"use client"

import { useEffect, useRef, useState } from 'react'
import { syncPushPermissionState } from '@/lib/push-client'
import { useFirebase } from '@/lib/firebase-context'
import { Button } from '@/components/ui/button'

export function PWARegister() {
  const { user } = useFirebase()
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const reloadApproved = useRef(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') return
    let disposed = false
    let registration: ServiceWorkerRegistration | undefined
    let installing: ServiceWorker | null = null
    const showUpdate = () => {
      if (!disposed && registration?.waiting && navigator.serviceWorker.controller) {
        setWaiting(registration.waiting)
      }
    }
    const onStateChange = () => { if (installing?.state === 'installed') showUpdate() }
    const onUpdateFound = () => {
      installing?.removeEventListener('statechange', onStateChange)
      installing = registration?.installing ?? null
      installing?.addEventListener('statechange', onStateChange)
    }
    const onControllerChange = () => {
      if (reloadApproved.current) window.location.reload()
    }
    const register = async () => {
      try {
        const result = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
        if (disposed) return
        registration = result
        showUpdate()
        onUpdateFound()
        registration.addEventListener('updatefound', onUpdateFound)
        void registration.update().catch(() => {})
      } catch (error) { console.warn('Offline support unavailable:', error) }
    }
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
    if (document.readyState === 'complete') void register()
    else window.addEventListener('load', register, { once: true })
    return () => {
      disposed = true
      window.removeEventListener('load', register)
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
      registration?.removeEventListener('updatefound', onUpdateFound)
      installing?.removeEventListener('statechange', onStateChange)
    }
  }, [])

  useEffect(() => {
    if (user?.uid) void syncPushPermissionState(user.uid)
  }, [user?.uid])

  if (!waiting || dismissed) return null
  return (
    <section role="status" aria-label="App update" className="fixed inset-x-3 bottom-[calc(var(--safe-bottom)+1rem)] z-[65] mx-auto max-w-sm rounded-3xl border border-white/15 bg-panel p-5 text-slate-100 shadow-xl">
      <h2 className="font-display text-lg font-bold">An update is ready</h2>
      <p className="mb-4 mt-1 text-sm text-slate-300">Save any unfinished edits before reloading.</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => {
          reloadApproved.current = true
          waiting.postMessage({ type: 'SKIP_WAITING' })
        }}>Update and reload</Button>
        <Button variant="ghost" onClick={() => setDismissed(true)}>Later</Button>
      </div>
    </section>
  )
}
