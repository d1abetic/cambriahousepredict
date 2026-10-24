// Core data model. Everything here is plain JSON so it can be persisted as-is.

export type PlanId = 'free' | 'premium';

export type ChallengeCategory =
  | 'exercise'
  | 'chores'
  | 'homework'
  | 'project'
  | 'mind'
  | 'custom';

/**
 * How a challenge is verified.
 * - steps:      walk N steps (device pedometer)
 * - reps:       perform N reps, tapped one by one, with a minimum duration
 * - checklist:  tick every item (optionally attach a photo as proof)
 * - focus:      stay focused in the app for N minutes, then summarise the work
 * - math:       solve N arithmetic problems
 * - reflection: write at least N characters (progress update, journal)
 */
export type ChallengeKind = 'steps' | 'reps' | 'checklist' | 'focus' | 'math' | 'reflection';

export interface ChallengeParams {
  /** steps / reps target */
  target?: number;
  /** focus minutes */
  minutes?: number;
  /** checklist items */
  items?: string[];
  /** require a photo for checklist challenges */
  photoProof?: boolean;
  /** number of math problems */
  problems?: number;
  /** minimum characters for reflection / focus summary */
  minChars?: number;
  /** writing prompt shown for reflection / focus summary */
  prompt?: string;
}

export interface Challenge {
  id: string;
  category: ChallengeCategory;
  kind: ChallengeKind;
  title: string;
  description: string;
  params: ChallengeParams;
  /** Only available on the paid tier. */
  premium?: boolean;
  /** Built-in challenges ship with the app; custom ones are user-made. */
  builtIn: boolean;
}

export interface LockSchedule {
  id: string;
  name: string;
  /** 0 = Sunday ... 6 = Saturday */
  days: number[];
  /** minutes after midnight */
  start: number;
  /** minutes after midnight; if <= start the window ends the next day */
  end: number;
  /** Challenges the user must complete to unlock during this window. */
  challengeIds: string[];
  enabled: boolean;
  /** Strict mode disables emergency unlocks for this schedule. */
  strict: boolean;
}

/** A one-off lock the user starts manually ("Lock me now for 45 min"). */
export interface ManualLock {
  id: string;
  startedAt: number;
  endsAt: number;
  challengeIds: string[];
  strict: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: ChallengeCategory;
  /** how many completed challenges of this category per week */
  targetPerWeek: number;
}

export interface CompletionRecord {
  challengeId: string;
  category: ChallengeCategory;
  completedAt: number;
  /** session the completion counted towards, if any */
  sessionKey?: string;
  note?: string;
  photoUri?: string;
}

export interface Track {
  id: string;
  name: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  at: number;
}

export interface Profile {
  name: string;
  email: string;
}

export interface DailyUsage {
  /** YYYY-MM-DD (local) */
  date: string;
  assistantMessages: number;
}

export interface AppData {
  version: 1;
  profile: Profile;
  plan: PlanId;
  schedules: LockSchedule[];
  manualLock: ManualLock | null;
  customChallenges: Challenge[];
  goals: Goal[];
  history: CompletionRecord[];
  /** session key -> unlock timestamp */
  unlockedSessions: Record<string, number>;
  /** timestamps of emergency unlocks (used for weekly allowance) */
  emergencyUnlocks: number[];
  tracks: Track[];
  chat: ChatMessage[];
  usage: DailyUsage;
}

/** The lock currently in force, derived from schedules / manual lock. */
export interface ActiveLock {
  /** unique per lock window, e.g. "sched:abc:2026-10-24T21:00" */
  sessionKey: string;
  title: string;
  startsAt: number;
  endsAt: number;
  challengeIds: string[];
  strict: boolean;
  source: 'schedule' | 'manual';
}
