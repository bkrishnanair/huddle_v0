import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
const mocks = vi.hoisted(() => ({ send: vi.fn(), limit: vi.fn() }));
vi.mock('@/lib/email', () => ({ sendFeedbackEmail: mocks.send }));
vi.mock('@/lib/rate-limit', () => ({ checkRateLimit: mocks.limit, getClientIp: () => '192.0.2.1' }));
import { POST } from '@/app/api/feedback/route';

const feedback = { type: 'idea', message: 'Please add more campus study groups.', email: '', website: '', submissionId: 'a4b6f934-6de4-41c1-a0f7-47063f84c5c3' };
const request = (body: unknown = feedback, headers = {}) => new NextRequest('https://huddlemap.live/api/feedback', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://huddlemap.live', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body),
});
beforeEach(() => {
  vi.clearAllMocks();
  mocks.send.mockResolvedValue(true);
  mocks.limit.mockResolvedValue({ success: true, retryAfterSeconds: 60 });
});

describe('student feedback API', () => {
  it('accepts feedback without authentication or an email', async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(mocks.send).toHaveBeenCalledOnce();
    expect(mocks.limit).toHaveBeenCalledTimes(2);
    expect(JSON.stringify(mocks.limit.mock.calls)).not.toContain('192.0.2.1');
  });
  it.each([{ message: 'short' }, { message: 'x'.repeat(3001) }, { email: 'bad@email' }, { type: 'spam' }, { to: 'attacker@example.test' }, { submissionId: 'bad' }])('rejects invalid inputs %j', async fields => {
    expect((await POST(request({ ...feedback, ...fields }))).status).toBe(400);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it('rejects malformed JSON, non-JSON, oversized bodies, and cross-site posts', async () => {
    expect((await POST(request('{broken'))).status).toBe(400);
    expect((await POST(request(feedback, { 'Content-Type': 'text/plain' }))).status).toBe(415);
    expect((await POST(request('x'.repeat(16385)))).status).toBe(413);
    expect((await POST(request(feedback, { Origin: 'https://untrusted.example' }))).status).toBe(403);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it('drops honeypot submissions without sending mail', async () => {
    expect((await POST(request({ ...feedback, website: 'spam.example' }))).status).toBe(200);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it('returns Retry-After when the network budget is exhausted', async () => {
    mocks.limit.mockResolvedValueOnce({ success: true }).mockResolvedValueOnce({ success: false, retryAfterSeconds: 90 });
    const response = await POST(request());
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('90');
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it('stops at the global cap', async () => {
    mocks.limit.mockResolvedValue({ success: false, retryAfterSeconds: 90 });
    expect((await POST(request())).status).toBe(429);
    expect(mocks.limit).toHaveBeenCalledOnce();
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it('fails closed when rate limiting is unavailable', async () => {
    mocks.limit.mockRejectedValue(new Error('offline'));
    expect((await POST(request())).status).toBe(503);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it('does not report success when email delivery is rejected', async () => {
    mocks.send.mockResolvedValue(false);
    expect((await POST(request())).status).toBe(503);
  });
  it('uses stable retry keys, but separate keys for edited feedback', async () => {
    await POST(request());
    await POST(request());
    await POST(request({ ...feedback, message: 'Please add an easier way to share events.' }));
    expect(mocks.send.mock.calls[0][1]).toBe(mocks.send.mock.calls[1][1]);
    expect(mocks.send.mock.calls[0][1]).not.toBe(mocks.send.mock.calls[2][1]);
  });
});
