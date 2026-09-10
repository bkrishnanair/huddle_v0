import { describe, it, expect, afterEach } from 'vitest';
import { getEventAccess } from '@/lib/event-access';
import { isAdminUid } from '@/lib/admin-auth';

/**
 * Guards the two authorisation gates.
 *
 * getEventAccess backs B1 (roster on /details) and B4 (event chat), both of
 * which previously had no membership check at all — the Admin SDK bypasses the
 * Firestore rules that would otherwise have caught it, so these routes are the
 * only enforcement point.
 *
 * isAdminUid backs B5: /api/admin/serendipity-logs read
 * `if (adminUid && user.uid !== adminUid)`, so an unset ADMIN_UID skipped the
 * guard entirely and served per-student targeting data to any signed-in caller.
 */

const EVENT = {
  createdBy: 'organizer-1',
  admins: ['admin-1'],
  players: ['member-1', 'member-2'],
};

describe('getEventAccess', () => {
  it('gives the organizer both roster and attendee detail', () => {
    const a = getEventAccess(EVENT, 'organizer-1');
    expect(a).toMatchObject({
      isOrganizer: true,
      canSeeRoster: true,
      canSeeAttendeeDetail: true,
    });
  });

  it('gives an event admin both roster and attendee detail', () => {
    const a = getEventAccess(EVENT, 'admin-1');
    expect(a).toMatchObject({
      isEventAdmin: true,
      canSeeRoster: true,
      canSeeAttendeeDetail: true,
    });
  });

  it('gives a member the roster but NOT attendee detail', () => {
    // One attendee must not see another's private note or no-show record.
    const a = getEventAccess(EVENT, 'member-1');
    expect(a).toMatchObject({
      isMember: true,
      canSeeRoster: true,
      canSeeAttendeeDetail: false,
    });
  });

  it('gives a stranger nothing', () => {
    const a = getEventAccess(EVENT, 'random-person');
    expect(a).toMatchObject({
      isOrganizer: false,
      isEventAdmin: false,
      isMember: false,
      canSeeRoster: false,
      canSeeAttendeeDetail: false,
    });
  });

  it('denies when the event document is missing', () => {
    const a = getEventAccess(undefined, 'organizer-1');
    expect(a.canSeeRoster).toBe(false);
    expect(a.canSeeAttendeeDetail).toBe(false);
  });

  it('denies when players and admins are absent rather than arrays', () => {
    // Scraped and legacy documents do not always carry these fields.
    const a = getEventAccess({ createdBy: 'someone-else' }, 'member-1');
    expect(a.canSeeRoster).toBe(false);
  });

  it('does not treat a non-array players field as membership', () => {
    const a = getEventAccess(
      { createdBy: 'x', players: 'member-1' as unknown as string[] },
      'member-1',
    );
    expect(a.isMember).toBe(false);
    expect(a.canSeeRoster).toBe(false);
  });
});

describe('isAdminUid', () => {
  const original = process.env.ADMIN_UID;
  afterEach(() => {
    if (original === undefined) delete process.env.ADMIN_UID;
    else process.env.ADMIN_UID = original;
  });

  it('fails CLOSED when ADMIN_UID is unset — the B5 regression', () => {
    delete process.env.ADMIN_UID;
    expect(isAdminUid('anyone')).toBe(false);
  });

  it('fails closed when ADMIN_UID is an empty string', () => {
    process.env.ADMIN_UID = '';
    expect(isAdminUid('anyone')).toBe(false);
  });

  it('accepts only the configured uid', () => {
    process.env.ADMIN_UID = 'the-admin';
    expect(isAdminUid('the-admin')).toBe(true);
    expect(isAdminUid('not-the-admin')).toBe(false);
  });

  it('rejects a missing caller uid even when configured', () => {
    process.env.ADMIN_UID = 'the-admin';
    expect(isAdminUid(undefined)).toBe(false);
    expect(isAdminUid(null)).toBe(false);
    expect(isAdminUid('')).toBe(false);
  });
});
