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
      if ('Notification' in window) {
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
      const token = await getAndRegisterPushToken()
      // Whether successful or not, mark that we asked
      markAsked()
    } catch (error) {
      console.error("Error enabling push:", error)
      markAsked()
    } finally {
      setIsRequesting(false)
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl z-50 flex items-start gap-4">
      <div className="bg-teal-900/30 p-2 rounded-full text-teal-400 mt-1">
        <Bell className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white mb-1">Get a reminder before this event?</h3>
        <p className="text-sm text-slate-400 mb-3">
          We'll send you a push notification 24 hours before the event starts.
        </p>
        
        <div className="flex gap-2">
          <button 
            onClick={handleEnable}
            disabled={isRequesting}
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isRequesting ? "Enabling..." : "Enable Notifications"}
          </button>
          <button 
            onClick={markAsked}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
      
      <button 
        onClick={markAsked}
        className="text-slate-500 hover:text-slate-300 transition-colors p-1 absolute top-3 right-3"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
