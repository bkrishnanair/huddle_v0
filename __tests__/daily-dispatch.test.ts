import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ auth: vi.fn(), lease: vi.fn(), release: vi.fn(), log: vi.fn(),
  reminders: vi.fn(), messages: vi.fn(), prompts: vi.fn(), cleanup: vi.fn(), agent: vi.fn() }));
vi.mock('@/lib/cron/auth', () => ({ authorizeCronRequest: mocks.auth }));
vi.mock('@/lib/cron/lease', () => ({ acquireCronLease: mocks.lease }));
vi.mock('@/lib/firebase-admin', () => ({ getFirebaseAdminDb: () => ({ collection: () => ({ add: mocks.log }) }) }));
vi.mock('@/lib/cron/event-reminders', () => ({ runEventReminders: mocks.reminders }));
vi.mock('@/lib/cron/scheduled-messages', () => ({ runScheduledMessages: mocks.messages }));
vi.mock('@/lib/cron/post-event-prompt', () => ({ runPostEventPrompt: mocks.prompts }));
vi.mock('@/lib/cron/cleanup', () => ({ runCleanup: mocks.cleanup }));
vi.mock('@/lib/cron/serendipity', () => ({ runSerendipity: mocks.agent }));
import { GET } from '@/app/api/cron/dispatch/route';
const request = () => new NextRequest('https://huddlemap.live/api/cron/dispatch');
beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.mockReturnValue({ ok: true }); mocks.release.mockResolvedValue(undefined);
  mocks.lease.mockResolvedValue(mocks.release); mocks.log.mockResolvedValue(undefined);
  for (const fn of [mocks.reminders, mocks.messages, mocks.prompts, mocks.cleanup, mocks.agent]) {
    fn.mockResolvedValue({ ok: true, processed: 0, errors: [], durationMs: 1 });
  }
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });
describe('once-daily dispatcher', () => {
  it('runs maintenance even with stale Pro/hourly environment settings', async () => {
    vi.stubEnv('CRON_MODE', 'hourly'); vi.stubEnv('CRON_PLAN', 'pro');
    const response = await GET(request());
    expect(response.status).toBe(200);
    expect((await response.json()).cronMode).toBe('daily');
    for (const fn of [mocks.reminders, mocks.messages, mocks.prompts, mocks.cleanup, mocks.agent]) expect(fn).toHaveBeenCalledOnce();
    expect(mocks.cleanup.mock.invocationCallOrder[0]).toBeLessThan(mocks.agent.mock.invocationCallOrder[0]);
    expect(mocks.release).toHaveBeenCalledOnce();
  });
  it('does not touch the database when authorization fails', async () => {
    mocks.auth.mockReturnValue({ ok: false, status: 401, message: 'Unauthorized' });
    expect((await GET(request())).status).toBe(401);
    expect(mocks.lease).not.toHaveBeenCalled();
  });
  it('does not start overlapping dispatchers', async () => {
    mocks.lease.mockResolvedValue(null);
    expect((await (await GET(request())).json()).skipped).toBe(true);
    expect(mocks.cleanup).not.toHaveBeenCalled(); expect(mocks.release).not.toHaveBeenCalled();
  });
  it('returns failure and still releases the lease when a handler fails', async () => {
    mocks.messages.mockRejectedValue(new Error('offline'));
    expect((await GET(request())).status).toBe(500);
    expect(mocks.prompts).toHaveBeenCalledOnce(); expect(mocks.release).toHaveBeenCalledOnce();
  });
  it('releases the lease even if execution logging fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.log.mockRejectedValue(new Error('offline'));
    expect((await GET(request())).status).toBe(500);
    expect(mocks.release).toHaveBeenCalledOnce();
  });
});
