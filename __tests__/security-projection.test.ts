import { describe, it, expect } from 'vitest';
import {
  pickPublicUserFields,
  pickPublicFields,
  PUBLIC_USER_FIELDS,
} from '@/lib/types';

/**
 * Guards the projection primitive that B1 depends on.
 *
 * GET /api/events/[id]/details was unauthenticated and returned, for every
 * attendee, the entire user document — `...userSnap.data()` in lib/db.ts. That
 * document carries the student's email address and last-known GPS coordinates.
 *
 * These tests fail if anyone widens the allowlist to include a sensitive field,
 * or replaces the projection with a spread again.
 */

/** A user document with every sensitive field that is actually written today. */
const FULL_USER_DOC = {
  uid: 'student-1',
  displayName: 'Alex Rivera',
  name: 'Alex Rivera',
  photoURL: 'https://example.test/a.jpg',
  isOrganizerVerified: true,

  // Everything below must never reach another student.
  email: 'alex@umd.edu',                                  // app/api/auth/me/route.ts:50
  lastKnownLocation: { latitude: 38.9897, longitude: -76.9378 }, // lib/db.ts:704
  geohash: 'dqcm1abcd',                                   // lib/db.ts:705
  locationUpdatedAt: '2026-08-24T12:00:00.000Z',
  fcmTokens: ['tok_abc', 'tok_def'],                      // push-token/route.ts:30
  blockedUsers: ['student-9'],                            // lib/db.ts:577
  bio: 'private-ish',
  favoriteSports: ['Basketball'],
  notifyReminders: true,
  pushPermissionState: 'granted',
} as const;

const SENSITIVE_KEYS = [
  'email',
  'lastKnownLocation',
  'geohash',
  'locationUpdatedAt',
  'fcmTokens',
  'blockedUsers',
] as const;

describe('pickPublicUserFields', () => {
  it('drops every sensitive field from a full user document', () => {
    const out = pickPublicUserFields(FULL_USER_DOC);
    for (const key of SENSITIVE_KEYS) {
      expect(out, `${key} must not survive projection`).not.toHaveProperty(key);
    }
  });

  it('keeps the fields another student legitimately needs', () => {
    const out = pickPublicUserFields(FULL_USER_DOC);
    expect(out).toMatchObject({
      uid: 'student-1',
      displayName: 'Alex Rivera',
      photoURL: 'https://example.test/a.jpg',
      isOrganizerVerified: true,
    });
  });

  it('is an allowlist, so an unknown field is dropped by default', () => {
    const out = pickPublicUserFields({
      ...FULL_USER_DOC,
      someFutureSensitiveField: 'phone number',
    });
    expect(out).not.toHaveProperty('someFutureSensitiveField');
  });

  it('emits no key at all for absent fields, rather than undefined', () => {
    const out = pickPublicUserFields({ uid: 'student-2' });
    expect(Object.keys(out)).toEqual(['uid']);
  });

  it('never lists a sensitive field in the allowlist itself', () => {
    for (const key of SENSITIVE_KEYS) {
      expect(PUBLIC_USER_FIELDS as readonly string[]).not.toContain(key);
    }
  });
});

describe('pickPublicFields (event) still withholds attendee free text', () => {
  it('drops the deprecated per-attendee maps and the private flag', () => {
    const out = pickPublicFields({
      id: 'evt-1',
      name: 'Pickup basketball',
      players: ['student-1'],
      // Must not be published: events/{id} is `allow read: if true`.
      attendeeNotes: { 'student-1': 'I have a knee injury' },
      attendeeAnswers: { 'student-1': 'vegetarian' },
      attendeePickup: { 'student-1': 'North gate' },
      checkIns: { 'student-1': false },
      waitlist: ['student-7'],
      scheduledMessages: [{ body: 'unsent draft' }],
      isPrivate: true,
    });

    for (const key of [
      'attendeeNotes',
      'attendeeAnswers',
      'attendeePickup',
      'checkIns',
      'waitlist',
      'scheduledMessages',
      'isPrivate',
    ]) {
      expect(out, `${key} must not be published`).not.toHaveProperty(key);
    }
    expect(out).toMatchObject({ id: 'evt-1', name: 'Pickup basketball' });
  });
});
