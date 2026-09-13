import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ signOut: vi.fn(), fetch: vi.fn(), deleteCookie: vi.fn() }));
vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: class { addScope() {} setCustomParameters() {} },
  signOut: mocks.signOut,
}));
vi.mock('@/lib/firebase', () => ({ auth: { name: 'test-auth' } }));
vi.mock('@/lib/db-client', () => ({}));
vi.mock('next/headers', () => ({ cookies: async () => ({ delete: mocks.deleteCookie }) }));
import { logOut } from '@/lib/auth';
import { POST } from '@/app/api/auth/logout/route';

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('fetch', mocks.fetch);
  mocks.fetch.mockResolvedValue({ ok: true });
});
afterEach(() => vi.unstubAllGlobals());

describe('logout clears both authentication layers', () => {
  it('clears the server cookie without calling browser Firebase from the server', async () => {
    const response = await POST();
    expect(response.status).toBe(200);
    expect(mocks.deleteCookie).toHaveBeenCalledWith('session');
    expect(mocks.signOut).not.toHaveBeenCalled();
  });
  it('clears the session before reporting browser sign-out success', async () => {
    await logOut();
    expect(mocks.fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' });
    expect(mocks.signOut).toHaveBeenCalledOnce();
    expect(mocks.fetch.mock.invocationCallOrder[0]).toBeLessThan(mocks.signOut.mock.invocationCallOrder[0]);
  });
  it('does not present a false success when the server session cannot be cleared', async () => {
    mocks.fetch.mockResolvedValue({ ok: false });
    await expect(logOut()).rejects.toThrow("Couldn't clear your session");
    expect(mocks.signOut).not.toHaveBeenCalled();
  });
});
