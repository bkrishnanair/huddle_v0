"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mapsValidator, type MapsApiValidationResult } from "@/lib/maps-debug"

interface MapsApiValidatorProps {
  apiKey?: string
  mapId?: string
  onValidationComplete?: (result: MapsApiValidationResult) => void
}

export default function MapsApiValidator({ apiKey, mapId, onValidationComplete }: MapsApiValidatorProps) {
  const [validation, setValidation] = useState<MapsApiValidationResult | null>(null)
  const [testing, setTesting] = useState(false)
  const [apiTest, setApiTest] = useState<{ success: boolean; error?: string } | null>(null)

  useEffect(() => {
    const result = mapsValidator.validateApiKey(apiKey)
    setValidation(result)
    onValidationComplete?.(result)

    // Log status to console
    mapsValidator.logMapsApiStatus(apiKey, mapId)
  }, [apiKey, mapId, onValidationComplete])

  const testApiKey = async () => {
    if (!apiKey || !validation?.isValid) return

    setTesting(true)
    try {
      const result = await mapsValidator.testApiKeyDirectly(apiKey)
      setApiTest(result)
    } catch (error) {
      setApiTest({ success: false, error: `Test failed: ${error}` })
    } finally {
      setTesting(false)
    }
  }

  if (!validation) return null

  return (
    <div className="glass-card rounded-lg p-4 text-white space-y-4">
      <div className="flex items-center space-x-2">
        {validation.isValid ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-400" />
        )}
        <h3 className="font-semibold">Maps API Validation</h3>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>API Key:</span>
          <span className="font-mono">{validation.apiKey.masked}</span>
        </div>
        <div className="flex justify-between">
          <span>Format:</span>
          <span className={validation.apiKey.format === "valid" ? "text-green-400" : "text-red-400"}>
            {validation.apiKey.format}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Map ID:</span>
          <span className={validation.mapId.present ? "text-green-400" : "text-yellow-400"}>
            {validation.mapId.present ? "✓ Set" : "⚠ Missing"}
          </span>
        </div>
      </div>

      {validation.errors.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Errors:</span>
          </div>
          {validation.errors.map((error, index) => (
            <div key={index} className="text-sm text-red-300 ml-5">
              • {error}
            </div>
          ))}
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Warnings:</span>
          </div>
          {validation.warnings.map((warning, index) => (
            <div key={index} className="text-sm text-yellow-300 ml-5">
              • {warning}
            </div>
          ))}
        </div>
      )}

      {validation.isValid && (
        <div className="space-y-2">
          <Button
            onClick={testApiKey}
            disabled={testing}
            className="w-full glass-card hover:glow text-white border-white/30"
            size="sm"
          >
            {testing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Testing API Key...
              </>
            ) : (
              "Test API Key"
            )}
          </Button>

          {apiTest && (
            <div
              className={`text-sm p-2 rounded ${apiTest.success ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}
            >
              {apiTest.success ? "✅ API key is working!" : `❌ ${apiTest.error}`}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
