import 'server-only';

import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { feedbackSchema } from '@/lib/feedback';
import { sendFeedbackEmail } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const respond = (body: object, status = 200, headers = {}) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

export async function POST(request: NextRequest) {
  // Browser requests must originate here; this is not a public email relay.
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) return respond({ error: 'Please send feedback from Huddle.' }, 403);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return respond({ error: 'Expected JSON.' }, 415);
  }

  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return respond({ error: 'Feedback is required.' }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) {
        await reader.cancel();
        return respond({ error: 'Feedback is too long.' }, 413);
      }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return respond({ error: 'Could not read your feedback.' }, 400);
  }
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) return respond({ error: 'Please check the feedback and email fields.' }, 400);
  if (parsed.data.website) return respond({ success: true }); // Honeypot: do not send bot submissions.

  try {
    const networkKey = createHash('sha256').update(getClientIp(request) || 'unknown-network').digest('hex');
    // A global cap also limits distributed abuse; campus networks share the IP budget.
    const global = await checkRateLimit('feedback-global', 'feedback', 200);
    const network = global.success && await checkRateLimit(`feedback-${networkKey}`, 'feedback', 30);
    if (!global.success || !network || !network.success) {
      return respond({ error: 'Too many submissions right now. Please try again later.' }, 429,
        { 'Retry-After': String(!global.success ? global.retryAfterSeconds : network && network.retryAfterSeconds || 3600) });
    }
    const key = createHash('sha256').update(JSON.stringify(parsed.data)).digest('hex');
    const sent = await sendFeedbackEmail(parsed.data, `feedback/${key}`);
    if (!sent) return respond({ error: 'We couldn’t send your feedback. Your draft is still here; please try again or email support@huddlemap.live.' }, 503);
    return respond({ success: true });
  } catch {
    // Never log student messages, reply addresses, or raw network identifiers.
    console.error('Feedback submission unavailable');
    return respond({ error: 'Feedback is temporarily unavailable. Please try again or email support@huddlemap.live.' }, 503);
  }
}
