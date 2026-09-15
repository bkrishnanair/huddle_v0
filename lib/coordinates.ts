export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** Plain coordinates survive JSON transport; Firestore SDK GeoPoints do not. */
export function normalizeCoordinates(value: unknown): Coordinates | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const point = value as Record<string, unknown>;
  const latitude = point.latitude ?? point._latitude;
  const longitude = point.longitude ?? point._longitude;

  if (typeof latitude !== 'number' || !Number.isFinite(latitude) || Math.abs(latitude) > 90 ||
      typeof longitude !== 'number' || !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
    return null;
  }

  return { latitude, longitude };
}
