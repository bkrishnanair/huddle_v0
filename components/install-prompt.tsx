"use client"

import { useEffect, useState, useRef } from 'react'
import { X, Share, PlusSquare } from 'lucide-react'

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIosInstructions, setIsIosInstructions] = useState(false)
  const deferredPromptRef = useRef<any>(null)

  useEffect(() => {
    // Check cooldown (14 days)
    const dismissedAt = localStorage.getItem('installPromptDismissedAt')
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 14) return
    }

    // Check standalone mode (already installed)
    const isStandalone =
      (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) ||
      (typeof window !== 'undefined' && (window.navigator as any).standalone)
    if (isStandalone) return

    const isIos = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

    const checkAndShowPrompt = () => {
      if (isStandalone) return
      if (deferredPromptRef.current) {
        setShowPrompt(true)
      } else if (isIos) {
        setIsIosInstructions(true)
        setShowPrompt(true)
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPromptRef.current = e
    }

    const handleRsvpAction = () => {
      checkAndShowPrompt()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('huddle:rsvp', handleRsvpAction)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('huddle:rsvp', handleRsvpAction)
    }
  }, [])

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('installPromptDismissedAt', Date.now().toString())
  }

  const handleInstall = async () => {
    const promptEvent = deferredPromptRef.current
    if (promptEvent) {
      promptEvent.prompt()
      try {
        const { outcome } = await promptEvent.userChoice
        if (outcome === 'accepted') {
          setShowPrompt(false)
        }
      } catch (err) {
        console.debug('Install prompt error:', err)
      }
      deferredPromptRef.current = null
    }
    handleDismiss()
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-sheet border border-line rounded-sheet p-5 shadow-overlay z-50 flex items-start gap-4">
      <div className="flex-1">
        <h3 className="font-display font-bold text-ink text-base mb-1">Install Huddle</h3>
        <p className="text-xs text-ink-2 mb-3.5 leading-relaxed">
          Get push notifications for your events and instant loading by adding Huddle to your home screen.
        </p>
        
        {isIosInstructions ? (
          <div className="text-xs text-ink bg-surface border border-line p-3 rounded-control flex items-center gap-2">
            <span>Tap</span> <Share className="w-4 h-4 text-action" /> <span>then</span> <PlusSquare className="w-4 h-4 text-action" /> <span>"Add to Home Screen"</span>
          </div>
        ) : (
          <button 
            onClick={handleInstall}
            className="bg-action hover:bg-action-hover text-white text-xs font-medium py-2.5 px-4 rounded-control transition-all shadow-sm active:scale-[0.99]"
          >
            Add to Home Screen
          </button>
        )}
      </div>
      
      <button 
        onClick={handleDismiss}
        className="text-ink-3 hover:text-ink transition-colors p-1"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
