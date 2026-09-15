import 'server-only';
import type { CandidateScore } from '@/lib/serendipity-scorer';
interface ComposedNotification {
  userId: string; message: string; eventId: string; score: number; factors: CandidateScore['factors'];
}
/** Deterministic, factual copy avoids a paid model request for each notification. */
export async function composeNotification(candidate: CandidateScore,
  event: { id: string; name: string; category: string; date: string; time: string; spotsLeft: number },
): Promise<ComposedNotification> {
  const reason = candidate.factors.interest >= 25 ? 'Matches your interests.' : 'A campus event to explore.';
  return { userId: candidate.userId, eventId: event.id, score: candidate.score, factors: candidate.factors,
    message: (event.name.slice(0, 85) + ' · ' + reason).slice(0, 140) };
}
export type { ComposedNotification };
