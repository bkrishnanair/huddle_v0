import { GeoPoint as AdminGeoPoint } from 'firebase-admin/firestore';
import { GeoPoint as ClientGeoPoint } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';
import { normalizeCoordinates } from '@/lib/coordinates';
import { pickPublicFields } from '@/lib/types';

const collegePark = { latitude: 38.9897, longitude: -76.9378 };

describe('event coordinate transport', () => {
  it.each([
    ['Admin SDK', new AdminGeoPoint(collegePark.latitude, collegePark.longitude)],
    ['client SDK', new ClientGeoPoint(collegePark.latitude, collegePark.longitude)],
    ['plain object', collegePark],
    ['legacy JSON', { _latitude: collegePark.latitude, _longitude: collegePark.longitude }],
  ])('normalizes %s points without SDK instances or internals', (_name, point) => {
    const normalized = normalizeCoordinates(point);
    expect(normalized).toEqual(collegePark);
    expect(Object.getPrototypeOf(normalized)).toBe(Object.prototype);
    expect(JSON.parse(JSON.stringify(normalized))).toEqual(collegePark);
  });

  it('preserves zero latitude and longitude', () => {
    expect(normalizeCoordinates({ latitude: 0, longitude: 0 })).toEqual({ latitude: 0, longitude: 0 });
    expect(normalizeCoordinates({ _latitude: 0, _longitude: 0 })).toEqual({ latitude: 0, longitude: 0 });
  });

  it.each([
    null, undefined, 'College Park', [], {},
    { latitude: 38.99 }, { longitude: -76.94 },
    { latitude: '38.99', longitude: -76.94 },
    { latitude: NaN, longitude: -76.94 },
    { latitude: Infinity, longitude: 0 },
    { latitude: 0, longitude: -Infinity },
    { latitude: 90.01, longitude: 0 },
    { latitude: -90.01, longitude: 0 },
    { latitude: 0, longitude: 180.01 },
    { latitude: 0, longitude: -180.01 },
  ])('rejects malformed coordinates: %j', value => {
    expect(normalizeCoordinates(value)).toBeNull();
  });

  it('accepts valid geographic boundaries', () => {
    expect(normalizeCoordinates({ latitude: -90, longitude: 180 })).toEqual({ latitude: -90, longitude: 180 });
    expect(normalizeCoordinates({ latitude: 90, longitude: -180 })).toEqual({ latitude: 90, longitude: -180 });
  });

  it('keeps post-RSVP event locations readable after JSON serialization', () => {
    const point = new AdminGeoPoint(collegePark.latitude, collegePark.longitude);
    // Reproduces the old post-write failure: Admin GeoPoint's getter names are
    // not present after JSON transport, so Google Map markers received undefined.
    expect(JSON.parse(JSON.stringify(point)).latitude).toBeUndefined();

    const response = JSON.parse(JSON.stringify({ event: pickPublicFields({
      id: 'rsvp-event', players: ['student'], geopoint: point,
      orgGeopoint: new AdminGeoPoint(0, 0),
      attendeeNotes: { student: 'Private message to organizer' },
    }) }));

    expect(response.event.geopoint).toEqual(collegePark);
    expect(response.event.orgGeopoint).toEqual({ latitude: 0, longitude: 0 });
    expect(response.event.players).toEqual(['student']);
    expect(response.event).not.toHaveProperty('attendeeNotes');
  });

  it('projects invalid points as null and leaves missing keys absent', () => {
    expect(pickPublicFields({ id: 'bad', geopoint: { latitude: 999, longitude: 0 }, orgGeopoint: null }))
      .toEqual({ id: 'bad', geopoint: null, orgGeopoint: null });
    expect(pickPublicFields({ id: 'virtual' })).toEqual({ id: 'virtual' });
  });
});
