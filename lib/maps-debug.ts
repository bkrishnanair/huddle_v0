// Maps API debugging utilities for troubleshooting ApiProjectMapError

export interface MapsApiValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  apiKey: {
    present: boolean
    format: string
    masked: string
  }
  mapId: {
    present: boolean
    value: string
  }
}

export class MapsApiValidator {
  private static instance: MapsApiValidator
  private validationCache: Map<string, MapsApiValidationResult> = new Map()

  static getInstance(): MapsApiValidator {
    if (!MapsApiValidator.instance) {
      MapsApiValidator.instance = new MapsApiValidator()
    }
    return MapsApiValidator.instance
  }

  validateApiKey(apiKey: string | undefined): MapsApiValidationResult {
    const cacheKey = `apikey_${apiKey || "undefined"}`

    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!
    }

    const result: MapsApiValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      apiKey: {
        present: !!apiKey,
        format: "unknown",
        masked: this.maskApiKey(apiKey),
      },
      mapId: {
        present: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
        value: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "not-set",
      },
    }

    // API Key validation
    if (!apiKey) {
      result.isValid = false
      result.errors.push("API key is missing")
      result.apiKey.format = "missing"
    } else if (apiKey === "undefined" || apiKey === "null") {
      result.isValid = false
      result.errors.push("API key is not properly set")
      result.apiKey.format = "invalid"
    } else if (apiKey.startsWith("your-") || apiKey.includes("placeholder")) {
      result.isValid = false
      result.errors.push("API key is still a placeholder")
      result.apiKey.format = "placeholder"
    } else if (!apiKey.startsWith("AIza")) {
      result.isValid = false
      result.errors.push("API key format is invalid (should start with AIza)")
      result.apiKey.format = "invalid-format"
    } else if (apiKey.length !== 39) {
      result.isValid = false
      result.errors.push(`API key length is invalid (${apiKey.length}, should be 39)`)
      result.apiKey.format = "invalid-length"
    } else {
      result.apiKey.format = "valid"
    }

    // Map ID validation
    if (!result.mapId.present) {
      result.warnings.push("Map ID not provided - Advanced Markers may not work")
    } else if (result.mapId.value.startsWith("your-") || result.mapId.value.includes("placeholder")) {
      result.warnings.push("Map ID appears to be a placeholder")
    }

    this.validationCache.set(cacheKey, result)
    return result
  }

  private maskApiKey(apiKey: string | undefined): string {
    if (!apiKey) return "not-provided"
    if (apiKey.length < 8) return "too-short"
    return `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
  }

  async testApiKeyDirectly(apiKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Test with a simple Geocoding API call
      const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${apiKey}`

      const response = await fetch(testUrl)
      const data = await response.json()

      if (data.status === "OK") {
        return { success: true }
      } else if (data.status === "REQUEST_DENIED") {
        return { success: false, error: `API key denied: ${data.error_message || "Unknown reason"}` }
      } else if (data.status === "OVER_QUERY_LIMIT") {
        return { success: false, error: "API quota exceeded" }
      } else {
        return { success: false, error: `API error: ${data.status}` }
      }
    } catch (error) {
      return { success: false, error: `Network error: ${error}` }
    }
  }

  generateCacheBustingUrl(baseUrl: string): string {
    const timestamp = Date.now()
    const separator = baseUrl.includes("?") ? "&" : "?"
    return `${baseUrl}${separator}_cb=${timestamp}`
  }

  logMapsApiStatus(apiKey: string | undefined, mapId: string | undefined) {
    console.group("🗺️ Google Maps API Status")

    const validation = this.validateApiKey(apiKey)

    console.log("API Key:", validation.apiKey.masked)
    console.log("API Key Format:", validation.apiKey.format)
    console.log("Map ID:", mapId || "not-provided")
    console.log("Validation Status:", validation.isValid ? "✅ Valid" : "❌ Invalid")

    if (validation.errors.length > 0) {
      console.error("Errors:", validation.errors)
    }

    if (validation.warnings.length > 0) {
      console.warn("Warnings:", validation.warnings)
    }

    console.groupEnd()
  }
}

export const mapsValidator = MapsApiValidator.getInstance()
