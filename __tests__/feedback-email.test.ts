import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('resend', () => ({ Resend: class { emails = { send: mocks.send }; } }));
const feedback = { type: 'idea' as const, message: '<script>Untrusted student text</script>', email: 'student@example.test', website: '', submissionId: 'a4b6f934-6de4-41c1-a0f7-47063f84c5c3' };
beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv('RESEND_API_KEY', 'test-key');
  vi.stubEnv('RESEND_FROM_EMAIL', 'Huddle <hello@example.test>');
  vi.stubEnv('FEEDBACK_TO_EMAIL', 'team@example.test');
  mocks.send.mockResolvedValue({ data: { id: 'mail-id' }, error: null });
});
afterEach(() => vi.unstubAllEnvs());
describe('feedback email delivery', () => {
  it('uses the team inbox, optional replyTo, plain text, and idempotency', async () => {
    const { sendFeedbackEmail } = await import('@/lib/email');
    expect(await sendFeedbackEmail(feedback, 'feedback/test')).toBe(true);
    const [mail, options] = mocks.send.mock.calls[0];
    expect(mail.to).toBe('team@example.test');
    expect(mail.replyTo).toBe('student@example.test');
    expect(mail.from).toBe('Huddle <hello@example.test>');
    expect(mail.text).toContain(feedback.message);
    expect(mail.html).toBeUndefined();
    expect(options.idempotencyKey).toBe('feedback/test');
  });
  it('falls back to support and omits replyTo for anonymous feedback', async () => {
    vi.stubEnv('FEEDBACK_TO_EMAIL', '');
    const { sendFeedbackEmail } = await import('@/lib/email');
    await sendFeedbackEmail({ ...feedback, email: '' }, 'feedback/test');
    expect(mocks.send.mock.calls[0][0].to).toBe('support@huddlemap.live');
    expect(mocks.send.mock.calls[0][0]).not.toHaveProperty('replyTo');
  });
  it('handles provider errors without a false success', async () => {
    const { sendFeedbackEmail } = await import('@/lib/email');
    mocks.send.mockResolvedValue({ data: null, error: { message: 'Rejected' } });
    expect(await sendFeedbackEmail(feedback, 'feedback/test')).toBe(false);
    mocks.send.mockRejectedValue(new Error('Network failure'));
    expect(await sendFeedbackEmail(feedback, 'feedback/test')).toBe(false);
  });
  it('fails safely when sending is not configured', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const { sendFeedbackEmail } = await import('@/lib/email');
    expect(await sendFeedbackEmail(feedback, 'feedback/test')).toBe(false);
    expect(mocks.send).not.toHaveBeenCalled();
  });
});
