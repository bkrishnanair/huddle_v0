export type MapPinTier = 'live' | 'imminent' | 'future';

/** Keep the overview quiet, but make every visible event identifiable up close. */
export function shouldRenderFullEventPin(zoom: number, tier: MapPinTier): boolean {
  if (zoom >= 16 || tier === 'live') return true;
  return zoom > 14 && tier === 'imminent';
}
