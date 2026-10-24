import type { ActiveLock, LockSchedule, ManualLock } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function dateKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function formatMinutes(mins: number): string {
  const h24 = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const suffix = h24 < 12 ? 'AM' : 'PM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** Window length in minutes; windows whose end <= start wrap past midnight. */
export function windowLength(s: Pick<LockSchedule, 'start' | 'end'>): number {
  const len = s.end - s.start;
  return len > 0 ? len : len + 24 * 60;
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

function at(day: Date, minutes: number): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, minutes);
}

/**
 * If `now` falls inside one of the schedule's windows, return that window.
 * Checks the window that started today and the one that started yesterday
 * (for overnight windows like 22:00 → 06:00).
 */
export function currentWindow(
  s: LockSchedule,
  now: Date,
): { start: Date; end: Date } | null {
  if (!s.enabled || s.days.length === 0) return null;
  for (const offset of [0, -1]) {
    const base = addDays(now, offset);
    if (!s.days.includes(base.getDay())) continue;
    const start = at(base, s.start);
    const end = at(base, s.start + windowLength(s));
    if (now >= start && now < end) return { start, end };
  }
  return null;
}

export function scheduleSessionKey(s: LockSchedule, windowStart: Date): string {
  return `sched:${s.id}:${dateKey(windowStart)}`;
}

/** Next time this schedule starts locking (strictly after `now`), or null. */
export function nextStart(s: LockSchedule, now: Date): Date | null {
  if (!s.enabled || s.days.length === 0) return null;
  for (let offset = 0; offset <= 7; offset++) {
    const day = addDays(now, offset);
    if (!s.days.includes(day.getDay())) continue;
    const start = at(day, s.start);
    if (start > now) return start;
  }
  return null;
}

export function nextLock(
  schedules: LockSchedule[],
  now: Date,
): { schedule: LockSchedule; at: Date } | null {
  let best: { schedule: LockSchedule; at: Date } | null = null;
  for (const s of schedules) {
    const n = nextStart(s, now);
    if (n && (!best || n < best.at)) best = { schedule: s, at: n };
  }
  return best;
}

/**
 * Every lock in force right now that the user has not yet unlocked.
 * Manual locks come first, then schedules in their configured order.
 */
export function pendingLocks(
  schedules: LockSchedule[],
  manual: ManualLock | null,
  unlocked: Record<string, number>,
  now: Date,
): ActiveLock[] {
  const locks: ActiveLock[] = [];
  if (manual && now.getTime() >= manual.startedAt && now.getTime() < manual.endsAt) {
    const key = `manual:${manual.id}`;
    if (!unlocked[key]) {
      locks.push({
        sessionKey: key,
        title: 'Focus lock',
        startsAt: manual.startedAt,
        endsAt: manual.endsAt,
        challengeIds: manual.challengeIds,
        strict: manual.strict,
        source: 'manual',
      });
    }
  }
  for (const s of schedules) {
    const w = currentWindow(s, now);
    if (!w) continue;
    const key = scheduleSessionKey(s, w.start);
    if (unlocked[key]) continue;
    locks.push({
      sessionKey: key,
      title: s.name,
      startsAt: w.start.getTime(),
      endsAt: w.end.getTime(),
      challengeIds: s.challengeIds,
      strict: s.strict,
      source: 'schedule',
    });
  }
  return locks;
}

/** Drop unlock markers older than a few days so storage doesn't grow forever. */
export function pruneUnlocked(
  unlocked: Record<string, number>,
  now: number,
  keepMs = 3 * DAY_MS,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, t] of Object.entries(unlocked)) if (now - t < keepMs) out[k] = t;
  return out;
}
