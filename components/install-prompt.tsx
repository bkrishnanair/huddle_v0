"use client"

import { useEffect, useState } from 'react'
import { X, Share, PlusSquare, Download } from 'lucide-react'
import { usePwaInstall } from '@/hooks/use-pwa-install'

export function InstallPrompt() {
  const { isMounted, isInstalled, isIos, promptInstall } = usePwaInstall()
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    if (!isMounted || isInstalled) return

    // Check cooldown (14 days)
    const dismissedAt = localStorage.getItem('installPromptDismissedAt')
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 14) return
    }

    const handleRsvpAction = () => {
      setShowPrompt(true)
    }

    window.addEventListener('huddle:rsvp', handleRsvpAction)
    return () => {
      window.removeEventListener('huddle:rsvp', handleRsvpAction)
    }
  }, [isMounted, isInstalled])

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('installPromptDismissedAt', Date.now().toString())
  }

  const handleInstall = async () => {
    const outcome = await promptInstall()
    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    handleDismiss()
  }

  if (!showPrompt || isInstalled) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-sheet border border-line rounded-sheet p-5 shadow-overlay z-50 flex items-start gap-4">
      <div className="flex-1">
        <h3 className="font-display font-bold text-ink text-base mb-1">Install Huddle</h3>
        <p className="text-xs text-ink-2 mb-3.5 leading-relaxed">
          Get push notifications for your events and instant loading by adding Huddle to your home screen.
        </p>

        {isIos ? (
          <div className="text-xs text-ink bg-surface border border-line p-3 rounded-control flex items-center gap-2">
            <span>Tap</span> <Share className="w-4 h-4 text-action" /> <span>then</span> <PlusSquare className="w-4 h-4 text-action" /> <span>"Add to Home Screen"</span>
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="inline-flex items-center gap-1.5 bg-action hover:bg-action-hover text-white text-xs font-semibold py-2.5 px-4 rounded-control transition-all shadow-sm active:scale-[0.99]"
          >
            <Download className="w-3.5 h-3.5" />
            Install app
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
