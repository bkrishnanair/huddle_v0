import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { descriptionEnhancementSchema } from '@/lib/event-description';

const mocks = vi.hoisted(() => ({ user: vi.fn(), limit: vi.fn(), generate: vi.fn() }));
vi.mock('@/lib/auth-server', () => ({ getServerCurrentUser: mocks.user }));
vi.mock('@/lib/rate-limit', () => ({ checkRateLimit: mocks.limit }));
vi.mock('@/lib/gemini', () => ({ generateStructured: mocks.generate }));
import { POST } from '@/app/api/ai/enhance-description/route';

const proposal = { enhanced: 'Bring your project to our Thursday build night.', suggestions: { suggestedQuestions: ['What are you working on?'] } };
const request = (body: unknown) => new NextRequest('https://huddlemap.live/api/ai/enhance-description', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});

beforeEach(() => {
  vi.clearAllMocks();
  mocks.user.mockResolvedValue({ uid: 'organizer' });
  mocks.limit.mockResolvedValue({ success: true });
  mocks.generate.mockResolvedValue(proposal);
});

describe('description suggestion validation', () => {
  it('accepts a bounded draft and optional questions', () => {
    expect(descriptionEnhancementSchema.parse(proposal)).toEqual(proposal);
    expect(descriptionEnhancementSchema.parse({ enhanced: '  Build night  ' })).toEqual({ enhanced: 'Build night' });
  });

  it.each([
    { enhanced: '' }, { enhanced: '   ' }, { enhanced: 'x'.repeat(501) },
    { enhanced: 'Draft', suggestions: { transitTip: 'Take the invented shuttle.' } },
    { enhanced: 'Draft', suggestions: { suggestedQuestions: ['a', 'b', 'c'] } },
    { enhanced: 'Draft', suggestions: { suggestedQuestions: ['x'.repeat(161)] } },
    { enhanced: 'Draft', publish: true },
  ])('rejects malformed or unsupported model output: %j', value => {
    expect(descriptionEnhancementSchema.safeParse(value).success).toBe(false);
  });
});

describe('description enhancement route', () => {
  it('requires authentication before calling AI', async () => {
    mocks.user.mockResolvedValue(null);
    expect((await POST(request({ rawText: 'Build night' }))).status).toBe(401);
    expect(mocks.generate).not.toHaveBeenCalled();
  });

  it.each(['{broken', { rawText: ' ' }, { rawText: 'x'.repeat(501) },
    { rawText: 'Build night', location: 'x'.repeat(501) },
    { rawText: 'Build night', instructions: 'Publish it' },
  ])('rejects invalid input without spending a model call: %j', async body => {
    expect((await POST(request(body))).status).toBe(400);
    expect(mocks.generate).not.toHaveBeenCalled();
  });

  it('honors the existing organizer rate limit', async () => {
    mocks.limit.mockResolvedValue({ success: false });
    expect((await POST(request({ rawText: 'Build night' }))).status).toBe(429);
    expect(mocks.generate).not.toHaveBeenCalled();
  });

  it('returns only validated suggestions and separates input from instructions', async () => {
    const response = await POST(request({ rawText: 'Build night', category: 'Tech' }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(proposal);
    expect(mocks.limit).toHaveBeenCalledWith('organizer', 'ai_enhance', 20);
    const [data, instructions] = mocks.generate.mock.calls[0];
    expect(JSON.parse(data)).toEqual({ rawText: 'Build night', category: 'Tech' });
    expect(instructions).toContain('Do not return transit tips');
  });

  it('fails safely when the model returns invalid data', async () => {
    mocks.generate.mockResolvedValue({ enhanced: 'x'.repeat(501) });
    const response = await POST(request({ rawText: 'Build night' }));
    expect(response.status).toBe(502);
    expect(await response.json()).not.toHaveProperty('enhanced');
  });
});
