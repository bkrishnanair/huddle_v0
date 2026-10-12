import { describe, expect, it } from 'vitest';
import { shouldRenderFullEventPin, type MapPinTier } from '../lib/map-marker-presentation';

describe('map marker zoom presentation', () => {
  it.each<MapPinTier>(['live', 'imminent', 'future'])(
    'expands %s events at neighborhood zoom, regardless of rank or filters',
    (tier) => {
      for (const zoom of [16, 16.5, 17, 19, 22]) {
        expect(shouldRenderFullEventPin(zoom, tier)).toBe(true);
      }
    },
  );

  it('keeps non-featured future events as dots in the overview', () => {
    for (const zoom of [0, 12, 14, 15, 15.99]) {
      expect(shouldRenderFullEventPin(zoom, 'future')).toBe(false);
    }
  });

  it('simplifies featured events at low zoom without hiding live pins', () => {
    expect(shouldRenderFullEventPin(14, 'imminent')).toBe(false);
    expect(shouldRenderFullEventPin(14.5, 'imminent')).toBe(true);
    expect(shouldRenderFullEventPin(15, 'imminent')).toBe(true);
    expect(shouldRenderFullEventPin(12, 'live')).toBe(true);
  });

  it('reverses the dot-to-pin transition when zooming back out', () => {
    expect([15, 16, 18, 15].map(zoom => shouldRenderFullEventPin(zoom, 'future')))
      .toEqual([false, true, true, false]);
  });
});
