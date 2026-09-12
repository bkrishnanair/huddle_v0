"use client"

import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { getAndRegisterPushToken } from '@/lib/push-client'
import { useFirebase } from '@/lib/firebase-context'

export function PushPermissionPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const { user } = useFirebase()

  useEffect(() => {
    const handleRsvpAction = () => {
      // Don't show if unauthenticated
      if (!user) return

      // Don't show if we've asked within 30 days
      const askedAt = localStorage.getItem('pushPermissionAskedAt')
      if (askedAt) {
        const daysSinceAsked = (Date.now() - parseInt(askedAt)) / (1000 * 60 * 60 * 24)
        if (daysSinceAsked < 30) return
      }

      // Check native permission status. If already granted or denied, skip
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted' || Notification.permission === 'denied') {
          return
        }
      }

      setShowPrompt(true)
    }

    window.addEventListener('huddle:rsvp', handleRsvpAction)
    return () => window.removeEventListener('huddle:rsvp', handleRsvpAction)
  }, [user])

  const markAsked = () => {
    localStorage.setItem('pushPermissionAskedAt', Date.now().toString())
    setShowPrompt(false)
  }

  const handleEnable = async () => {
    setIsRequesting(true)
    try {
      await getAndRegisterPushToken()
    } catch (error) {
      console.error("Error enabling push:", error)
    } finally {
      setIsRequesting(false)
      markAsked()
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed top-[calc(env(safe-area-inset-top)+5.5rem)] left-3 right-3 md:left-auto md:right-4 md:w-96 bg-panel/95 backdrop-blur-xl border border-white/15 rounded-3xl p-5 pr-14 shadow-2xl z-[60] flex items-start gap-3.5">
      <div className="bg-primary/20 p-2 rounded-xl text-primary shrink-0 mt-0.5 border border-white/10">
        <Bell className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-display font-bold text-slate-50 text-base mb-1">Get a reminder before this event?</h3>
        <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
          We'll send you a push notification 24 hours before your event starts so you don't miss out.
        </p>
        
        <div className="flex gap-2">
          <button 
            onClick={handleEnable}
            disabled={isRequesting}
            className="bg-primary hover:bg-primary/90 text-canvas text-sm font-semibold py-2 px-3.5 rounded-2xl transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            {isRequesting ? "Enabling..." : "Enable reminders"}
          </button>
          <button 
            onClick={markAsked}
            className="bg-slate-800/50 hover:bg-white/10 text-slate-400 text-xs font-medium py-2 px-3.5 rounded-xl transition-colors border border-white/10"
          >
            Not now
          </button>
        </div>
      </div>
      
      <button 
        onClick={markAsked}
        className="flex h-11 w-11 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors absolute top-2 right-2"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
