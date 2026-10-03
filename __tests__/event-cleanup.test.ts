import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ db: vi.fn() }));
vi.mock('@/lib/firebase-admin', () => ({ getFirebaseAdminDb: mocks.db }));
import { runCleanup } from '@/lib/cron/cleanup';

const event = { date: '2026-09-15', time: '12:00', endTime: '14:00', timezone: 'America/New_York', status: 'active' };
const makeDoc = (id: string, data = event) => ({ id, ref: { id }, data: () => data });
let docs: ReturnType<typeof makeDoc>[];
let cursor: unknown;
let transaction: { get: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn>; set: ReturnType<typeof vi.fn> };
let query: any;
let runTransaction: ReturnType<typeof vi.fn>;
const stateRef = { id: 'eventCleanup' };

beforeEach(() => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-03T16:00:00Z'));
  docs = []; cursor = null;
  query = { where: vi.fn(() => query), orderBy: vi.fn(() => query), limit: vi.fn(() => query), startAfter: vi.fn(() => query) };
  transaction = {
    get: vi.fn(async target => target === stateRef ? { data: () => ({ cursor }) } : { size: docs.length, docs }),
    update: vi.fn(), set: vi.fn(),
  };
  runTransaction = vi.fn(fn => fn(transaction));
  mocks.db.mockReturnValue({ collection: (name: string) => name === 'cronState' ? { doc: () => stateRef } : query, runTransaction });
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe('bounded cleanup transactions', () => {
  it('archives an ended event but preserves ongoing, archived, and malformed records', async () => {
    docs = [makeDoc('ended'), makeDoc('ongoing', { ...event, endDate: '2026-12-31' } as typeof event),
      makeDoc('archived', { ...event, status: 'archived' }), makeDoc('invalid', { ...event, date: 'invalid' })];
    const result = await runCleanup();
    expect(result).toMatchObject({ ok: true, processed: 1 });
    expect(transaction.update.mock.calls).toEqual([[{ id: 'ended' }, { status: 'archived' }]]);
    expect(query.limit).toHaveBeenCalledWith(200);
    expect(transaction.set).toHaveBeenCalledWith(stateRef, { cursor: null });
  });
  it('saves a full-page cursor even if every event is already archived', async () => {
    docs = Array.from({ length: 200 }, (_, i) => makeDoc(String(i), { ...event, status: 'archived' }));
    expect(await runCleanup()).toMatchObject({ ok: true, processed: 0 });
    expect(transaction.set).toHaveBeenCalledWith(stateRef, { cursor: { date: event.date, id: '199' } });
  });
  it('resumes beyond old pages and wraps after reaching the end', async () => {
    cursor = { date: event.date, id: '199' };
    expect(await runCleanup()).toMatchObject({ ok: true, processed: 0 });
    expect(query.startAfter).toHaveBeenCalledWith(event.date, '199');
    expect(transaction.set).toHaveBeenCalledWith(stateRef, { cursor: null });
  });
  it('reports no archived records when a transaction fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    runTransaction.mockRejectedValue(new Error('transaction conflict'));
    expect(await runCleanup()).toMatchObject({ ok: false, processed: 0, errors: ['transaction conflict'] });
    expect(transaction.set).not.toHaveBeenCalled();
  });
  it('re-evaluates an extension on retry without counting the abandoned write', async () => {
    docs = [makeDoc('extended')];
    runTransaction.mockImplementationOnce(async callback => {
      await callback(transaction);
      docs = [makeDoc('extended', { ...event, endDate: '2026-12-31' } as typeof event)];
      transaction.update.mockClear();
      return callback(transaction);
    });
    expect(await runCleanup()).toMatchObject({ ok: true, processed: 0 });
    expect(transaction.update).not.toHaveBeenCalled();
  });
});
