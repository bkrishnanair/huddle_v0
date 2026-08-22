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
    <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-sheet border border-line rounded-sheet p-5 shadow-overlay z-50 flex items-start gap-3.5">
      <div className="bg-action-tint p-2 rounded-control text-action shrink-0 mt-0.5 border border-line">
        <Bell className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-display font-bold text-ink text-base mb-1">Get a reminder before this event?</h3>
        <p className="text-xs text-ink-2 mb-3.5 leading-relaxed">
          We'll send you a push notification 24 hours before your event starts so you don't miss out.
        </p>
        
        <div className="flex gap-2">
          <button 
            onClick={handleEnable}
            disabled={isRequesting}
            className="bg-action hover:bg-action-hover text-white text-xs font-medium py-2 px-3.5 rounded-control transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            {isRequesting ? "Enabling..." : "Enable Notifications"}
          </button>
          <button 
            onClick={markAsked}
            className="bg-surface hover:bg-surface-sunk text-ink-2 text-xs font-medium py-2 px-3.5 rounded-control transition-colors border border-line"
          >
            Not Now
          </button>
        </div>
      </div>
      
      <button 
        onClick={markAsked}
        className="text-ink-3 hover:text-ink transition-colors p-1 absolute top-3.5 right-3.5"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
