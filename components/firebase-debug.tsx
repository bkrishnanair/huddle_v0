"use client"

import { useEffect, useState } from "react"
import { checkFirebaseHealth, debugFirebaseConfig } from "@/lib/firebase"
import { Button } from "@/components/ui/button"

interface FirebaseHealth {
  app: boolean
  auth: boolean
  db: boolean
  error: string | null
  timestamp: string
}

export default function FirebaseDebug() {
  const [health, setHealth] = useState<FirebaseHealth | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const runHealthCheck = async () => {
    const healthStatus = await checkFirebaseHealth()
    setHealth(healthStatus)
    debugFirebaseConfig()
  }

  useEffect(() => {
    // Auto-run health check on mount
    runHealthCheck()
  }, [])

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50 glass-card text-xs px-2 py-1 text-white border-white/30"
        size="sm"
      >
        🔥 Debug
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 glass-card rounded-lg p-4 max-w-sm text-white text-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Firebase Status</h3>
        <Button
          onClick={() => setIsVisible(false)}
          className="text-white/60 hover:text-white p-0 h-auto"
          variant="ghost"
          size="sm"
        >
          ✕
        </Button>
      </div>

      {health && (
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>App:</span>
            <span className={health.app ? "text-green-400" : "text-red-400"}>{health.app ? "✓" : "✗"}</span>
          </div>
          <div className="flex justify-between">
            <span>Auth:</span>
            <span className={health.auth ? "text-green-400" : "text-red-400"}>{health.auth ? "✓" : "✗"}</span>
          </div>
          <div className="flex justify-between">
            <span>Database:</span>
            <span className={health.db ? "text-green-400" : "text-red-400"}>{health.db ? "✓" : "✗"}</span>
          </div>
          {health.error && <div className="mt-2 p-2 bg-red-500/20 rounded text-red-200 text-xs">{health.error}</div>}
        </div>
      )}

      <Button onClick={runHealthCheck} className="mt-2 w-full text-xs py-1 bg-white/10 hover:bg-white/20" size="sm">
        Refresh
      </Button>
    </div>
  )
}
