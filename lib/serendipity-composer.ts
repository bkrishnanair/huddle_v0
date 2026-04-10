import 'server-only';

import { generateText } from '@/lib/gemini';
import type { CandidateScore } from '@/lib/serendipity-scorer';

/**
 * Serendipity Agent 3: ACT — Notification Composer & Dispatcher
 * 
 * Takes high-scoring candidates and generates personalized notification
 * messages using Gemini, incorporating the specific factors that matched.
 */

interface ComposedNotification {
  userId: string;
  message: string;
  eventId: string;
  score: number;
  factors: CandidateScore['factors'];
}

export async function composeNotification(
  candidate: CandidateScore,
  event: { id: string; name: string; category: string; date: string; time: string; spotsLeft: number },
): Promise<ComposedNotification> {
  const factorSummary = candidate.reasons.filter(r => !r.includes('No ')).join(', ');

  const prompt = `You are a friendly campus event notification writer. Write a SHORT, engaging push notification (max 120 chars) for a student about a campus event they might like.

Event: "${event.name}" (${event.category})
When: ${event.date} at ${event.time}
Spots remaining: ${event.spotsLeft}
Why this student matched: ${factorSummary}

Rules:
- Start with a relevant emoji
- Be casual and enthusiastic
- Mention the key reason they'd be interested (friend going, or their interest, or proximity)
- Create urgency with spots remaining
- Do NOT use generic phrases like "Don't miss out"
- Output ONLY the notification text, nothing else`;

  try {
    const message = await generateText(prompt, undefined, { maxOutputTokens: 100, temperature: 0.8 });
    return {
      userId: candidate.userId,
      message: message.trim(),
      eventId: event.id,
      score: candidate.score,
      factors: candidate.factors,
    };
  } catch (error) {
    // Fallback to template-based message if Gemini fails
    const emoji = getCategoryEmoji(event.category);
    const topReason = candidate.reasons.find(r => !r.includes('No ') && !r.includes('unknown')) || 'something fun nearby';
    const fallbackMessage = `${emoji} ${event.name} has ${event.spotsLeft} spots left! ${topReason}`;
    return {
      userId: candidate.userId,
      message: fallbackMessage.slice(0, 140),
      eventId: event.id,
      score: candidate.score,
      factors: candidate.factors,
    };
  }
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    Sports: '🏀', Music: '🎵', Community: '🤝', Learning: '📚',
    'Food & Drink': '🍕', Tech: '💻', 'Arts & Culture': '🎨', Outdoors: '🌲',
  };
  return map[category] || '🔥';
}

export type { ComposedNotification };
