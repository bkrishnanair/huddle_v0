import type { GameEvent } from './types';

/** Preserve unchanged rows without ignoring capacity, status, or location edits. */
export function reconcileEvents(previous: GameEvent[], incoming: GameEvent[]): GameEvent[] {
  const byId = new Map(previous.map(event => [event.id, event]));
  const next = incoming.map(event => {
    const old = byId.get(event.id);
    return old && JSON.stringify(old) === JSON.stringify(event) ? old : event;
  });
  return next.length === previous.length && next.every((event, i) => event === previous[i])
    ? previous : next;
}
