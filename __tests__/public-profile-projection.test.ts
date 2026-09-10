import { describe, it, expect } from 'vitest';

/**
 * Pure projection logic matching /api/users/[id]/public-profile/route.ts
 */
function projectPublicProfile(rawUserData: Record<string, any>, userId: string) {
  return {
    uid: userId,
    displayName: rawUserData?.displayName || rawUserData?.name || 'Huddle User',
    photoURL: rawUserData?.photoURL || null,
    bio: rawUserData?.bio || null,
    favoriteSports: rawUserData?.favoriteSports || [],
    createdAt: rawUserData?.createdAt || null,
  };
}

function calculateReliabilityScore(pastEvents: any[], userId: string): { score: number | null; totalTracked: number } {
  let attended = 0;
  let noShows = 0;

  pastEvents.forEach((ev: any) => {
    if (ev.checkInOpen || (ev.checkIns && Object.keys(ev.checkIns).length > 0)) {
      if (ev.checkIns && ev.checkIns[userId]) {
        attended++;
      } else {
        noShows++;
      }
    }
  });

  const totalTracked = attended + noShows;
  const score = totalTracked > 0 ? Math.round((attended / totalTracked) * 100) : null;
  return { score, totalTracked };
}

describe('Public Profile Projection & Privacy Isolation', () => {
  it('strictly excludes sensitive PII from public profile projection', () => {
    const rawUserData = {
      displayName: 'Alice Terp',
      name: 'Alice Terp',
      photoURL: 'https://example.com/photo.jpg',
      bio: 'Junior studying CS',
      favoriteSports: ['Basketball', 'Volleyball'],
      createdAt: '2026-01-01T00:00:00Z',
      // SENSITIVE FIELDS THAT MUST NEVER BE PROJECTED:
      email: 'alice@terpmail.umd.edu',
      fcmTokens: ['token_abc', 'token_xyz'],
      savedQuestions: ['What is your major?'],
      savedTransitTips: ['Take shuttle 104'],
      notifyAnnouncements: true,
      notifyPromotions: false,
      notifyReminders: true,
      pushPermissionState: 'granted',
    };

    const publicProfile = projectPublicProfile(rawUserData, 'user_123');

    // Expected allowed fields
    expect(publicProfile).toEqual({
      uid: 'user_123',
      displayName: 'Alice Terp',
      photoURL: 'https://example.com/photo.jpg',
      bio: 'Junior studying CS',
      favoriteSports: ['Basketball', 'Volleyball'],
      createdAt: '2026-01-01T00:00:00Z',
    });

    // Explicitly assert private fields are undefined
    const keys = Object.keys(publicProfile);
    expect(keys).not.toContain('email');
    expect(keys).not.toContain('fcmTokens');
    expect(keys).not.toContain('savedQuestions');
    expect(keys).not.toContain('savedTransitTips');
    expect(keys).not.toContain('notifyAnnouncements');
    expect(keys).not.toContain('pushPermissionState');
  });

  it('falls back gracefully to default values when fields are missing', () => {
    const publicProfile = projectPublicProfile({}, 'user_empty');
    expect(publicProfile).toEqual({
      uid: 'user_empty',
      displayName: 'Huddle User',
      photoURL: null,
      bio: null,
      favoriteSports: [],
      createdAt: null,
    });
  });

  describe('Reliability Score Calculation', () => {
    it('returns null score when no check-in events exist', () => {
      const pastEvents = [
        { id: 'ev1', name: 'Pickup' }, // No checkInOpen or checkIns
        { id: 'ev2', name: 'Study Group' },
      ];

      const { score, totalTracked } = calculateReliabilityScore(pastEvents, 'user_123');
      expect(score).toBeNull();
      expect(totalTracked).toBe(0);
    });

    it('calculates 100% when all check-in tracked events are attended', () => {
      const pastEvents = [
        { id: 'ev1', checkInOpen: true, checkIns: { user_123: { timestamp: 12345 } } },
        { id: 'ev2', checkInOpen: true, checkIns: { user_123: { timestamp: 12346 } } },
      ];

      const { score, totalTracked } = calculateReliabilityScore(pastEvents, 'user_123');
      expect(score).toBe(100);
      expect(totalTracked).toBe(2);
    });

    it('calculates 50% when 1 attended and 1 no-show occurred', () => {
      const pastEvents = [
        { id: 'ev1', checkInOpen: true, checkIns: { user_123: { timestamp: 12345 } } },
        { id: 'ev2', checkInOpen: true, checkIns: { other_user: { timestamp: 12346 } } }, // user_123 missing = no-show
      ];

      const { score, totalTracked } = calculateReliabilityScore(pastEvents, 'user_123');
      expect(score).toBe(50);
      expect(totalTracked).toBe(2);
    });
  });
});
