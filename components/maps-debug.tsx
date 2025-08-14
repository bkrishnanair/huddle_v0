"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface MapsHealth {
  apiKey: boolean
  apiKeyFormat: boolean
  apiKeyValue: string
  timestamp: string
}

export default function MapsDebug() {
  const [health, setHealth] = useState<MapsHealth | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const runHealthCheck = () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const healthStatus: MapsHealth = {
      apiKey: !!apiKey,
      apiKeyFormat: apiKey ? apiKey.startsWith("AIza") && apiKey.length === 39 : false,
      apiKeyValue: apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : "Not set",
      timestamp: new Date().toISOString(),
    }

    setHealth(healthStatus)
    console.log("🗺️ Google Maps Health Check:", healthStatus)
  }

  useEffect(() => {
    runHealthCheck()
  }, [])

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-20 z-50 glass-card text-xs px-2 py-1 text-white border-white/30"
        size="sm"
      >
        🗺️ Maps
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 left-20 z-50 glass-card rounded-lg p-4 max-w-sm text-white text-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Maps Status</h3>
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
            <span>API Key:</span>
            <span className={health.apiKey ? "text-green-400" : "text-red-400"}>{health.apiKey ? "✓" : "✗"}</span>
          </div>
          <div className="flex justify-between">
            <span>Format:</span>
            <span className={health.apiKeyFormat ? "text-green-400" : "text-red-400"}>
              {health.apiKeyFormat ? "✓" : "✗"}
            </span>
          </div>
          <div className="mt-2 text-xs text-white/60">Key: {health.apiKeyValue}</div>
        </div>
      )}

      <Button onClick={runHealthCheck} className="mt-2 w-full text-xs py-1 bg-white/10 hover:bg-white/20" size="sm">
        Refresh
      </Button>
    </div>
  )
}
