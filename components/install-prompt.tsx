"use client"

import { useEffect, useState } from 'react'
import { X, Share, PlusSquare, Download } from 'lucide-react'
import { usePwaInstall } from '@/hooks/use-pwa-install'
import { readBrowserStorage, writeBrowserStorage } from '@/lib/browser-storage'
import { InstallDialog } from '@/components/install-dialog'

export function InstallPrompt() {
  const { isMounted, isInstalled, isIos, promptInstall, isDialogOpen, setIsDialogOpen } = usePwaInstall()
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    if (!isMounted || isInstalled) return

    // Check cooldown (14 days)
    const dismissedAt = readBrowserStorage('installPromptDismissedAt')
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
    writeBrowserStorage('installPromptDismissedAt', Date.now().toString())
  }

  const handleInstall = async () => {
    const outcome = await promptInstall()
    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    handleDismiss()
  }

  if (isDialogOpen) return <InstallDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
  if (!showPrompt || isInstalled) return null

  return (
    <div className="fixed bottom-[calc(var(--safe-bottom)+0.5rem)] left-3 right-3 md:left-auto md:right-4 md:w-96 bg-panel/95 backdrop-blur-xl border border-white/15 rounded-3xl p-5 shadow-2xl z-[60] flex items-start gap-3">
      <div className="flex-1">
        <h3 className="font-display font-bold text-slate-50 text-base mb-1">Install Huddle</h3>
        <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
          Your campus, one tap away. Add Huddle to your home screen for easy access.
        </p>

        {isIos ? (
          <div className="text-xs text-slate-50 bg-slate-800/50 border border-white/10 p-3 rounded-xl flex items-center gap-2">
            <span>Tap</span> <Share className="w-4 h-4 text-primary" /> <span>then</span> <PlusSquare className="w-4 h-4 text-primary" /> <span>"Add to Home Screen"</span>
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-canvas text-sm font-semibold py-2.5 px-4 rounded-2xl transition-all shadow-sm active:scale-[0.99]"
          >
            <Download className="w-3.5 h-3.5" />
            Install app
          </button>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
