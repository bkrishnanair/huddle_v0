"use client"

import { useSyncExternalStore } from 'react';

let tick = 0;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();
const snapshot = () => tick;
const serverSnapshot = () => 0;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) timer = setInterval(() => {
    tick++;
    listeners.forEach(notify => notify());
  }, 60_000);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/** One shared timer, not an interval per event card. Fully released on unmount. */
export const useMinuteTick = () => useSyncExternalStore(subscribe, snapshot, serverSnapshot);
