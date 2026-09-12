import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({headers: vi.fn(), cookies: vi.fn(), token: vi.fn(), session: vi.fn()}));
vi.mock('next/headers', () => ({headers: mocks.headers, cookies: mocks.cookies}));
vi.mock('@/lib/firebase-admin', () => ({adminAuth: {verifyIdToken: mocks.token, verifySessionCookie: mocks.session}}));
import { getServerCurrentUser } from '@/lib/auth-server';

describe('request identity during account switching', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.headers.mockResolvedValue(new Headers());
    mocks.cookies.mockResolvedValue({get: () => ({value: 'previous-session'})});
    mocks.token.mockResolvedValue({uid: 'current-user'});
    mocks.session.mockResolvedValue({uid: 'previous-user'});
  });
  it('uses the explicit bearer identity ahead of a stale session cookie', async () => {
    mocks.headers.mockResolvedValue(new Headers({Authorization: 'Bearer current-token'}));
    expect(await getServerCurrentUser()).toEqual({uid: 'current-user'});
    expect(mocks.session).not.toHaveBeenCalled();
  });
  it('fails closed on an invalid token instead of using another account', async () => {
    mocks.headers.mockResolvedValue(new Headers({Authorization: 'Bearer expired-token'}));
    mocks.token.mockRejectedValueOnce(new Error('expired'));
    expect(await getServerCurrentUser()).toBeNull();
    expect(mocks.session).not.toHaveBeenCalled();
  });
  it('rejects malformed authorization without falling back to a cookie', async () => {
    mocks.headers.mockResolvedValue(new Headers({Authorization: 'Basic invalid'}));
    expect(await getServerCurrentUser()).toBeNull();
    expect(mocks.session).not.toHaveBeenCalled();
  });
  it('retains verified-cookie authentication for cookie-only requests', async () => {
    expect(await getServerCurrentUser()).toEqual({uid: 'previous-user'});
    expect(mocks.session).toHaveBeenCalledWith('previous-session', true);
  });
});
