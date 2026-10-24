import type { Challenge, ChallengeCategory, CompletionRecord, Goal } from './types';

export const CATEGORY_META: Record<ChallengeCategory, { label: string; emoji: string; color: string }> = {
  exercise: { label: 'Exercise', emoji: '🏃', color: '#F97316' },
  chores: { label: 'Chores', emoji: '🧹', color: '#10B981' },
  homework: { label: 'Homework', emoji: '📚', color: '#3B82F6' },
  project: { label: 'Projects', emoji: '🛠️', color: '#8B5CF6' },
  mind: { label: 'Mind', emoji: '🧠', color: '#EC4899' },
  custom: { label: 'Custom', emoji: '⭐', color: '#EAB308' },
};

export const CATEGORIES = Object.keys(CATEGORY_META) as ChallengeCategory[];

/** Challenges that ship with the app. Ids are stable — schedules reference them. */
export const BUILT_IN_CHALLENGES: Challenge[] = [
  {
    id: 'ex-steps-500',
    category: 'exercise',
    kind: 'steps',
    title: 'Walk 500 steps',
    description: 'Get up and move. Your phone counts the steps.',
    params: { target: 500 },
    builtIn: true,
  },
  {
    id: 'ex-pushups-20',
    category: 'exercise',
    kind: 'reps',
    title: '20 push-ups',
    description: 'Tap once per push-up. Too fast and it will not count.',
    params: { target: 20 },
    builtIn: true,
  },
  {
    id: 'ex-squats-30',
    category: 'exercise',
    kind: 'reps',
    title: '30 squats',
    description: 'Tap once per squat.',
    params: { target: 30 },
    builtIn: true,
  },
  {
    id: 'ex-steps-2000',
    category: 'exercise',
    kind: 'steps',
    title: 'Walk 2,000 steps',
    description: 'A proper walk before screen time.',
    params: { target: 2000 },
    premium: true,
    builtIn: true,
  },
  {
    id: 'ch-room',
    category: 'chores',
    kind: 'checklist',
    title: 'Tidy your room',
    description: 'Finish every item and snap a photo of the result.',
    params: { items: ['Make the bed', 'Clothes away', 'Clear the desk', 'Take out trash'], photoProof: true },
    builtIn: true,
  },
  {
    id: 'ch-dishes',
    category: 'chores',
    kind: 'checklist',
    title: 'Kitchen reset',
    description: 'Leave the kitchen better than you found it.',
    params: { items: ['Wash the dishes', 'Wipe the counters', 'Sweep the floor'] },
    builtIn: true,
  },
  {
    id: 'hw-focus-25',
    category: 'homework',
    kind: 'focus',
    title: '25-minute homework sprint',
    description: 'Stay in the app for 25 minutes (assistant & music allowed), then write what you did.',
    params: { minutes: 25, minChars: 40, prompt: 'What did you finish or learn?' },
    builtIn: true,
  },
  {
    id: 'hw-focus-50',
    category: 'homework',
    kind: 'focus',
    title: '50-minute deep study',
    description: 'Two sprints back to back for big assignments.',
    params: { minutes: 50, minChars: 80, prompt: 'Summarise what you studied.' },
    premium: true,
    builtIn: true,
  },
  {
    id: 'pj-update',
    category: 'project',
    kind: 'reflection',
    title: 'Project progress log',
    description: 'Write a real update on your project before you unlock.',
    params: { minChars: 120, prompt: 'What did you build today, and what is next?' },
    builtIn: true,
  },
  {
    id: 'pj-focus-45',
    category: 'project',
    kind: 'focus',
    title: '45-minute build session',
    description: 'Ship something: 45 focused minutes on your project.',
    params: { minutes: 45, minChars: 60, prompt: 'What did you ship?' },
    premium: true,
    builtIn: true,
  },
  {
    id: 'mi-math-5',
    category: 'mind',
    kind: 'math',
    title: 'Solve 5 math problems',
    description: 'Wake your brain up before scrolling.',
    params: { problems: 5 },
    builtIn: true,
  },
  {
    id: 'mi-journal',
    category: 'mind',
    kind: 'reflection',
    title: 'Gratitude journal',
    description: 'Write three things you are grateful for.',
    params: { minChars: 80, prompt: 'Three things I am grateful for today…' },
    builtIn: true,
  },
];

export function allChallenges(custom: Challenge[]): Challenge[] {
  return [...BUILT_IN_CHALLENGES, ...custom];
}

export function findChallenge(custom: Challenge[], id: string): Challenge | undefined {
  return allChallenges(custom).find((c) => c.id === id);
}

export function describeTarget(c: Challenge): string {
  const p = c.params;
  switch (c.kind) {
    case 'steps':
      return `${p.target ?? 0} steps`;
    case 'reps':
      return `${p.target ?? 0} reps`;
    case 'checklist':
      return `${p.items?.length ?? 0} tasks${p.photoProof ? ' + photo' : ''}`;
    case 'focus':
      return `${p.minutes ?? 0} min focus`;
    case 'math':
      return `${p.problems ?? 0} problems`;
    case 'reflection':
      return `${p.minChars ?? 0}+ characters`;
  }
}

// ---------- Rep pacing ----------

/** Minimum milliseconds between two reps for them to count (anti-spam). */
export const MIN_REP_INTERVAL_MS = 1200;

export function acceptRep(lastRepAt: number | null, now: number): boolean {
  return lastRepAt === null || now - lastRepAt >= MIN_REP_INTERVAL_MS;
}

// ---------- Math problems ----------

export interface MathProblem {
  question: string;
  answer: number;
}

/** Deterministic PRNG so problems can be reproduced in tests. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateMathProblems(count: number, rand: () => number = Math.random): MathProblem[] {
  const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
  const out: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    const op = int(0, 2);
    if (op === 0) {
      const a = int(12, 99);
      const b = int(12, 99);
      out.push({ question: `${a} + ${b}`, answer: a + b });
    } else if (op === 1) {
      const a = int(30, 120);
      const b = int(5, a);
      out.push({ question: `${a} − ${b}`, answer: a - b });
    } else {
      const a = int(3, 15);
      const b = int(3, 12);
      out.push({ question: `${a} × ${b}`, answer: a * b });
    }
  }
  return out;
}

// ---------- Goals ----------

/** Monday 00:00 local time of the week containing `now`. */
export function startOfWeek(now: Date): Date {
  const diff = (now.getDay() + 6) % 7; // days since Monday
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
}

export function goalProgress(goal: Goal, history: CompletionRecord[], now: Date): number {
  const since = startOfWeek(now).getTime();
  return history.filter((h) => h.category === goal.category && h.completedAt >= since).length;
}

/** Consecutive days (ending today or yesterday) with at least one completion. */
export function currentStreak(history: CompletionRecord[], now: Date): number {
  const days = new Set(
    history.map((h) => {
      const d = new Date(h.completedAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );
  const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!days.has(key(cursor))) cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
  let streak = 0;
  while (days.has(key(cursor))) {
    streak++;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
  }
  return streak;
}
