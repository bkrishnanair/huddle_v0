import { describe, expect, it } from 'vitest';
import { reconcileEvents } from '@/lib/event-reconciliation';
import type { GameEvent } from '@/lib/types';

const a = {id: 'a', currentPlayers: 1, status: 'active'} as GameEvent;
const b = {id: 'b', currentPlayers: 2, status: 'active'} as GameEvent;
describe('map event reconciliation', () => {
  it('keeps the array and event references when nothing changed', () => {
    const previous = [a, b];
    expect(reconcileEvents(previous, [{...a}, {...b}])).toBe(previous);
  });
  it('updates capacity and status even when IDs are identical', () => {
    const next = reconcileEvents([a,b], [{...a, currentPlayers: 3, status: 'past'}, {...b}]);
    expect(next[0]).not.toBe(a);
    expect(next[0].currentPlayers).toBe(3);
    expect(next[0].status).toBe('past');
    expect(next[1]).toBe(b);
  });
  it('preserves server ordering, additions, removals, and empty results', () => {
    expect(reconcileEvents([a,b], [b,a])).toEqual([b,a]);
    expect(reconcileEvents([a], [a,b])).toEqual([a,b]);
    expect(reconcileEvents([a,b], [b])).toEqual([b]);
    expect(reconcileEvents([a], [])).toEqual([]);
  });
});
