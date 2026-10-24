// Run with `npm test` (Node's built-in runner + type stripping, Node >= 22.18).
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  acceptRep,
  currentStreak,
  generateMathProblems,
  goalProgress,
  mulberry32,
  startOfWeek,
} from '../src/domain/challenges.ts';
import { assistantMessagesLeft, canUseChallenge, emergencyUnlocksLeft, PLANS } from '../src/domain/plans.ts';
import { currentWindow, nextLock, nextStart, pendingLocks, pruneUnlocked, scheduleSessionKey } from '../src/domain/schedule.ts';
import type { Challenge, LockSchedule } from '../src/domain/types.ts';

const sched = (over: Partial<LockSchedule> = {}): LockSchedule => ({
  id: 's1',
  name: 'Study',
  days: [1, 2, 3, 4, 5], // Mon–Fri
  start: 18 * 60,
  end: 19 * 60,
  challengeIds: ['mi-math-5'],
  enabled: true,
  strict: false,
  ...over,
});

// 2026-10-26 is a Monday.
const mon = (h: number, m = 0) => new Date(2026, 9, 26, h, m);

describe('schedule windows', () => {
  it('is active inside the window and not outside', () => {
    assert.ok(currentWindow(sched(), mon(18, 30)));
    assert.equal(currentWindow(sched(), mon(17, 59)), null);
    assert.equal(currentWindow(sched(), mon(19, 0)), null, 'end is exclusive');
  });

  it('respects weekdays and enabled flag', () => {
    const sunday = new Date(2026, 9, 25, 18, 30);
    assert.equal(currentWindow(sched(), sunday), null);
    assert.equal(currentWindow(sched({ enabled: false }), mon(18, 30)), null);
  });

  it('handles windows that cross midnight', () => {
    const night = sched({ days: [1], start: 22 * 60, end: 6 * 60 });
    assert.ok(currentWindow(night, mon(23)), 'Monday 23:00');
    assert.ok(currentWindow(night, new Date(2026, 9, 27, 5, 59)), 'Tuesday 05:59 belongs to Monday window');
    assert.equal(currentWindow(night, new Date(2026, 9, 27, 6, 0)), null);
    assert.equal(currentWindow(night, mon(5)), null, 'Sunday night is not scheduled');
  });

  it('computes the next start', () => {
    assert.deepEqual(nextStart(sched(), mon(10)), mon(18));
    // After Friday's window, next is Monday.
    const fri = new Date(2026, 9, 30, 20, 0);
    assert.deepEqual(nextStart(sched(), fri), new Date(2026, 10, 2, 18, 0));
    const n = nextLock([sched({ id: 'a', start: 20 * 60, end: 21 * 60 }), sched({ id: 'b' })], mon(10));
    assert.equal(n?.schedule.id, 'b');
  });

  it('lists pending locks until the session is unlocked', () => {
    const s = sched();
    const now = mon(18, 15);
    const locks = pendingLocks([s], null, {}, now);
    assert.equal(locks.length, 1);
    const key = scheduleSessionKey(s, mon(18));
    assert.equal(locks[0].sessionKey, key);
    assert.equal(pendingLocks([s], null, { [key]: now.getTime() }, now).length, 0);
    // Next day's window is a new session.
    const tue = new Date(2026, 9, 27, 18, 15);
    assert.equal(pendingLocks([s], null, { [key]: now.getTime() }, tue).length, 1);
  });

  it('includes an active manual lock first', () => {
    const now = mon(12);
    const manual = { id: 'm', startedAt: now.getTime() - 1000, endsAt: now.getTime() + 60_000, challengeIds: ['x'], strict: true };
    const locks = pendingLocks([sched({ start: 11 * 60, end: 13 * 60 })], manual, {}, now);
    assert.equal(locks.length, 2);
    assert.equal(locks[0].source, 'manual');
    assert.equal(pendingLocks([], { ...manual, endsAt: now.getTime() - 1 }, {}, now).length, 0);
  });

  it('prunes old unlock markers', () => {
    const now = Date.now();
    const out = pruneUnlocked({ old: now - 10 * 86_400_000, fresh: now - 1000 }, now);
    assert.deepEqual(Object.keys(out), ['fresh']);
  });
});

describe('challenges', () => {
  it('rejects reps tapped too quickly', () => {
    assert.ok(acceptRep(null, 0));
    assert.equal(acceptRep(1000, 1500), false);
    assert.ok(acceptRep(1000, 2300));
  });

  it('generates correct math problems', () => {
    const problems = generateMathProblems(50, mulberry32(42));
    assert.equal(problems.length, 50);
    for (const p of problems) {
      const [a, op, b] = p.question.split(' ');
      const x = Number(a);
      const y = Number(b);
      const expected = op === '+' ? x + y : op === '×' ? x * y : x - y;
      assert.equal(p.answer, expected, p.question);
      assert.ok(p.answer >= 0);
    }
  });

  it('counts weekly goal progress from Monday', () => {
    const wed = new Date(2026, 9, 28, 12);
    assert.deepEqual(startOfWeek(wed), new Date(2026, 9, 26));
    const history = [
      { challengeId: 'a', category: 'exercise' as const, completedAt: new Date(2026, 9, 25, 12).getTime() }, // last Sunday
      { challengeId: 'a', category: 'exercise' as const, completedAt: new Date(2026, 9, 26, 9).getTime() },
      { challengeId: 'b', category: 'chores' as const, completedAt: new Date(2026, 9, 27, 9).getTime() },
    ];
    assert.equal(goalProgress({ id: 'g', title: '', category: 'exercise', targetPerWeek: 3 }, history, wed), 1);
  });

  it('computes streaks ending today or yesterday', () => {
    const at = (d: number) => ({ challengeId: 'a', category: 'mind' as const, completedAt: new Date(2026, 9, d, 10).getTime() });
    const today = new Date(2026, 9, 28, 20);
    assert.equal(currentStreak([at(26), at(27), at(28)], today), 3);
    assert.equal(currentStreak([at(26), at(27)], today), 2, 'today not done yet still keeps streak');
    assert.equal(currentStreak([at(25)], today), 0);
  });
});

describe('plans', () => {
  const premiumChallenge: Challenge = {
    id: 'p',
    category: 'exercise',
    kind: 'steps',
    title: '',
    description: '',
    params: {},
    premium: true,
    builtIn: true,
  };

  it('gates premium challenges', () => {
    assert.equal(canUseChallenge('free', premiumChallenge), false);
    assert.ok(canUseChallenge('premium', premiumChallenge));
    assert.ok(canUseChallenge('free', { ...premiumChallenge, premium: false }));
  });

  it('tracks weekly emergency unlocks', () => {
    const now = Date.now();
    assert.equal(emergencyUnlocksLeft({ plan: 'free', emergencyUnlocks: [] }, now), PLANS.free.emergencyUnlocksPerWeek);
    assert.equal(emergencyUnlocksLeft({ plan: 'free', emergencyUnlocks: [now - 1000] }, now), 0);
    assert.equal(emergencyUnlocksLeft({ plan: 'free', emergencyUnlocks: [now - 8 * 86_400_000] }, now), 1);
  });

  it('resets assistant allowance each day', () => {
    const usage = { date: '2026-10-24', assistantMessages: 10 };
    assert.equal(assistantMessagesLeft({ plan: 'free', usage }, '2026-10-24'), 0);
    assert.equal(assistantMessagesLeft({ plan: 'free', usage }, '2026-10-25'), PLANS.free.assistantMessagesPerDay);
    assert.equal(assistantMessagesLeft({ plan: 'premium', usage }, '2026-10-24'), 190);
  });
});
