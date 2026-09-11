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
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-50 flex items-start gap-4">
      <div className="flex-1">
        <h3 className="font-display font-bold text-slate-50 text-base mb-1">Install Huddle</h3>
        <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
          Get push notifications for your events and instant loading by adding Huddle to your home screen.
        </p>

        {isIos ? (
          <div className="text-xs text-slate-50 bg-slate-800/50 border border-white/10 p-3 rounded-xl flex items-center gap-2">
            <span>Tap</span> <Share className="w-4 h-4 text-primary" /> <span>then</span> <PlusSquare className="w-4 h-4 text-primary" /> <span>"Add to Home Screen"</span>
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm active:scale-[0.99]"
          >
            <Download className="w-3.5 h-3.5" />
            Install app
          </button>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="text-slate-500 hover:text-slate-50 transition-colors p-1"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
