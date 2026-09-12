import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({user: vi.fn(), admin: vi.fn(), limit: vi.fn(), run: vi.fn()}));
vi.mock('@/lib/auth-server', () => ({getServerCurrentUser: mocks.user}));
vi.mock('@/lib/admin-auth', () => ({isAdminUid: mocks.admin}));
vi.mock('@/lib/rate-limit', () => ({checkRateLimit: mocks.limit, getClientIp: () => null}));
vi.mock('@/lib/cron/serendipity', () => ({runSerendipity: mocks.run}));
import { POST } from '@/app/api/admin/serendipity/route';
const trigger = () => POST(new NextRequest('http://localhost/api/admin/serendipity', {method: 'POST'}));

describe('admin-only manual agent trigger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.user.mockResolvedValue({uid: 'admin'});
    mocks.admin.mockReturnValue(true);
    mocks.limit.mockResolvedValue({success: true});
    mocks.run.mockResolvedValue({ok: true, processed: 0});
  });
  it('rejects unauthenticated callers', async () => {
    mocks.user.mockResolvedValue(null);
    expect((await trigger()).status).toBe(401);
    expect(mocks.run).not.toHaveBeenCalled();
  });
  it('rejects non-admin callers without invoking the engine', async () => {
    mocks.admin.mockReturnValue(false);
    expect((await trigger()).status).toBe(403);
    expect(mocks.run).not.toHaveBeenCalled();
  });
  it('returns a retry delay when rate limited', async () => {
    mocks.limit.mockResolvedValue({success: false, retryAfterSeconds: 30});
    const response = await trigger();
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('30');
    expect(mocks.run).not.toHaveBeenCalled();
  });
  it('invokes the existing engine only for the verified admin', async () => {
    expect((await trigger()).status).toBe(200);
    expect(mocks.run).toHaveBeenCalledOnce();
  });
});
