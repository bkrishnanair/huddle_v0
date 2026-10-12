import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ db: vi.fn() }));
vi.mock('@/lib/firebase-admin', () => ({ getFirebaseAdminDb: mocks.db }));
import { acquireCronLease } from '@/lib/cron/lease';
let state: Record<string, any> | undefined;
beforeEach(() => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-11T14:00:00Z')); state = undefined;
  mocks.db.mockReturnValue({ collection: () => ({ doc: () => ({ id: 'lease' }) }),
    runTransaction: async (callback: any) => callback({
      get: async () => ({ data: () => state }),
      set: (_: any, data: any) => { state = data; }, delete: () => { state = undefined; },
    }),
  });
});
afterEach(() => vi.useRealTimers());
describe('cron leases', () => {
  it('skips an overlapping worker until the first releases', async () => {
    const release = await acquireCronLease('dispatch');
    expect(release).not.toBeNull(); expect(await acquireCronLease('dispatch')).toBeNull();
    await release!(); expect(await acquireCronLease('dispatch')).not.toBeNull();
  });
  it('recovers an expired worker without letting it release the next worker lease', async () => {
    const oldRelease = await acquireCronLease('dispatch');
    vi.advanceTimersByTime(6 * 60_000 + 1);
    const nextRelease = await acquireCronLease('dispatch');
    expect(nextRelease).not.toBeNull();
    const nextToken = state!.token;
    await oldRelease!(); expect(state!.token).toBe(nextToken);
    await nextRelease!(); expect(state).toBeUndefined();
  });
  it('fails closed when storage is unavailable', async () => {
    mocks.db.mockReturnValue(null);
    await expect(acquireCronLease('dispatch')).rejects.toThrow('Database unavailable');
  });
});
