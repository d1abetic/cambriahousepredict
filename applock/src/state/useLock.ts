import { useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import { nextLock, pendingLocks } from '../domain/schedule';
import { useStore } from './AppStore';

/** Re-render at least every `ms` and whenever the app returns to the foreground. */
export function useNow(ms = 15_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, ms);
    const sub = AppState.addEventListener('change', (s) => s === 'active' && tick());
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, [ms]);
  return now;
}

export function useLockState() {
  const { data } = useStore();
  const tick = useNow();
  return useMemo(() => {
    // Read the clock fresh so changes (e.g. "Lock now") apply immediately,
    // not on the next tick.
    const now = new Date(Math.max(Date.now(), tick.getTime()));
    const pending = pendingLocks(data.schedules, data.manualLock, data.unlockedSessions, now);
    return {
      now,
      locked: pending.length > 0,
      current: pending[0] ?? null,
      pending,
      next: nextLock(data.schedules, now),
    };
  }, [data.schedules, data.manualLock, data.unlockedSessions, tick]);
}
