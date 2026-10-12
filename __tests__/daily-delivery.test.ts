import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ db: vi.fn(), candidates: vi.fn() }));
vi.mock('@/lib/firebase-admin', () => ({ getFirebaseAdminDb: mocks.db }));
vi.mock('@/lib/cron/event-candidates', () => ({ getCronEventDocs: mocks.candidates }));
import { runScheduledMessages } from '@/lib/cron/scheduled-messages';
import { runPostEventPrompt } from '@/lib/cron/post-event-prompt';

let record: Record<string, any>;
let writes: { path: string; data: any }[];
let transaction: { get: ReturnType<typeof vi.fn>; set: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
const reference = (path: string): any => ({ path, collection: (name: string) => ({ doc: (id: string) => reference(`${path}/${name}/${id}`) }) });
const ref = reference('events/event');
const message = { id: 'm1', message: 'See you there', scheduledFor: '2026-10-11T09:00:00Z', sent: false, isAnnouncement: true };

beforeEach(() => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-11T14:59:00Z'));
  writes = [];
  record = { date: '2026-09-15', time: '10:00', endDate: '2026-10-11', endTime: '18:00', timezone: 'America/New_York',
    createdBy: 'organizer', name: 'Campus event', organizerName: 'Host', scheduledMessages: [message] };
  transaction = { get: vi.fn(async () => ({ data: () => ({ ...record }) })), set: vi.fn(), update: vi.fn() };
  mocks.db.mockReturnValue({ collection: (name: string) => ({ doc: (id: string) => reference(`${name}/${id}`) }),
    runTransaction: async (callback: any) => {
      transaction.set.mockClear(); transaction.update.mockClear();
      const result = await callback(transaction);
      for (const [target, data] of transaction.set.mock.calls) writes.push({ path: target.path, data });
      for (const [, data] of transaction.update.mock.calls) record = { ...record, ...data };
      return result;
    },
  });
  mocks.candidates.mockResolvedValue({ docs: [{ id: 'event', ref, data: () => record }], truncated: false });
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe('daily scheduled-message delivery', () => {
  it('delivers a due message for an ongoing multi-day event exactly once on rerun', async () => {
    expect(await runScheduledMessages()).toMatchObject({ ok: true, processed: 1 });
    expect(record.pinnedMessage).toBe('See you there');
    expect(record.scheduledMessages[0].sent).toBe(true);
    expect(writes[0].path).toMatch(/^events\/event\/chat\/scheduled_/);
    expect(await runScheduledMessages()).toMatchObject({ ok: true, processed: 0 });
    expect(writes).toHaveLength(1);
  });
  it('cancels stale messages instead of announcing an event that has ended', async () => {
    record.endDate = '2026-10-10';
    expect(await runScheduledMessages()).toMatchObject({ ok: true, processed: 0 });
    expect(record.scheduledMessages[0]).toMatchObject({ sent: false, cancelled: true });
    expect(writes).toHaveLength(0);
  });
  it('does not deliver future, invalid, cancelled, or archived messages', async () => {
    record.scheduledMessages = [{ ...message, scheduledFor: '2026-10-12T09:00:00Z' },
      { ...message, id: 'invalid', scheduledFor: 'invalid' }, { ...message, id: 'cancelled', cancelled: true }];
    expect(await runScheduledMessages()).toMatchObject({ processed: 0 });
    record.status = 'archived'; record.scheduledMessages = [message];
    expect(await runScheduledMessages()).toMatchObject({ processed: 0 });
    expect(writes).toHaveLength(0);
  });
  it('reports transaction failure without counting an uncommitted send', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.db.mockReturnValue({ runTransaction: vi.fn().mockRejectedValue(new Error('offline')) });
    expect(await runScheduledMessages()).toMatchObject({ ok: false, processed: 0, errors: ['offline'] });
    expect(writes).toHaveLength(0);
  });
});

describe('daily post-event feedback', () => {
  it('prompts about yesterday and suppresses subsequent duplicate invocations', async () => {
    record.endDate = '2026-10-10';
    expect(await runPostEventPrompt()).toMatchObject({ ok: true, processed: 1 });
    expect(writes[0].path).toBe('users/organizer/notifications/post_event_event');
    expect(writes[0].data.message).toContain('has ended');
    expect(record.postEventPromptSent).toBe(true);
    expect(await runPostEventPrompt()).toMatchObject({ ok: true, processed: 0 });
    expect(writes).toHaveLength(1);
  });
  it('skips imports, archived records, and events still ongoing', async () => {
    expect(await runPostEventPrompt()).toMatchObject({ processed: 0 });
    record.endDate = '2026-10-10'; record.isScraped = true;
    expect(await runPostEventPrompt()).toMatchObject({ processed: 0 });
    record.isScraped = false; record.status = 'archived';
    expect(await runPostEventPrompt()).toMatchObject({ processed: 0 });
    expect(writes).toHaveLength(0);
  });
  it('rechecks event extensions inside the transaction', async () => {
    record.endDate = '2026-10-10';
    transaction.get.mockResolvedValue({ data: () => ({ ...record, endDate: '2026-12-31' }) });
    expect(await runPostEventPrompt()).toMatchObject({ processed: 0 });
    expect(writes).toHaveLength(0);
  });
  it('reports truncated queries instead of silently claiming a complete run', async () => {
    mocks.candidates.mockResolvedValue({ docs: [], truncated: true });
    expect(await runPostEventPrompt()).toMatchObject({ ok: false, processed: 0 });
  });
});
