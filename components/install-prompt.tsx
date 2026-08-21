"use client"

import { useEffect, useState } from 'react'
import { X, Share, PlusSquare } from 'lucide-react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIosInstructions, setIsIosInstructions] = useState(false)

  useEffect(() => {
    // Check cooldown
    const dismissedAt = localStorage.getItem('installPromptDismissedAt')
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 14) return
    }

    // Check meaningful action (second session)
    let sessionCount = parseInt(localStorage.getItem('sessionCount') || '0')
    const currentSessionId = sessionStorage.getItem('sessionId')
    if (!currentSessionId) {
      sessionStorage.setItem('sessionId', Date.now().toString())
      sessionCount++
      localStorage.setItem('sessionCount', sessionCount.toString())
    }

    // If it's still their first session and they haven't RSVP'd yet, don't show
    // We can also listen for a custom 'huddle:rsvp' event from the RSVP button
    const handleMeaningfulAction = () => {
      checkAndShowPrompt()
    }
    window.addEventListener('huddle:rsvp', handleMeaningfulAction)

    const checkAndShowPrompt = () => {
      // is standalone?
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
      if (isStandalone) return

      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

      if (deferredPrompt) {
        setShowPrompt(true)
      } else if (isIos) {
        setIsIosInstructions(true)
        setShowPrompt(true)
      }
    }

    // If already met session requirements
    if (sessionCount >= 2) {
      // Delay slightly to not interrupt initial load
      setTimeout(checkAndShowPrompt, 3000)
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (sessionCount >= 2) {
        setShowPrompt(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('huddle:rsvp', handleMeaningfulAction)
    }
  }, [deferredPrompt])

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('installPromptDismissedAt', Date.now().toString())
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowPrompt(false)
      }
      setDeferredPrompt(null)
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl z-50 flex items-start gap-4">
      <div className="flex-1">
        <h3 className="font-semibold text-white mb-1">Install Huddle</h3>
        <p className="text-sm text-slate-400 mb-3">
          Get push notifications for your events and faster loading times by installing the app.
        </p>
        
        {isIosInstructions ? (
          <div className="text-xs text-slate-300 bg-slate-800 p-3 rounded-lg flex items-center gap-2">
            <span>Tap</span> <Share className="w-4 h-4" /> <span>then</span> <PlusSquare className="w-4 h-4" /> <span>"Add to Home Screen"</span>
          </div>
        ) : (
          <button 
            onClick={handleInstall}
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add to Home Screen
          </button>
        )}
      </div>
      
      <button 
        onClick={handleDismiss}
        className="text-slate-500 hover:text-slate-300 transition-colors p-1"
        aria-label="Dismiss"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
