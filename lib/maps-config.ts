"use server"

export async function getGoogleMapsConfig() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    throw new Error("Google Maps API key not configured. Please add GOOGLE_MAPS_API_KEY to your environment variables.")
  }

  if (apiKey.length < 10) {
    throw new Error("Invalid Google Maps API key format")
  }

  return {
    apiKey,
    mapId: "huddle-map",
    libraries: ["places", "geometry"] as const,
    region: "US",
    language: "en",
  }
}

export function validateApiKey(apiKey: string): boolean {
  return apiKey && apiKey.startsWith("AIza") && apiKey.length === 39
}
