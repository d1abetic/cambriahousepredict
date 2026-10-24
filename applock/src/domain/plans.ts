import type { AppData, Challenge, PlanId } from './types';

/**
 * Account tiers. This is the single place to tune what Free vs. Premium get —
 * every limit in the app reads from here. Use `UNLIMITED` for "no cap".
 *
 * Billing is not wired yet; see README → "Accounts & subscriptions".
 */
export const UNLIMITED = Number.POSITIVE_INFINITY;

export interface PlanLimits {
  label: string;
  priceLabel: string;
  maxSchedules: number;
  maxChallengesPerLock: number;
  maxGoals: number;
  maxCustomChallenges: number;
  /** premium-flagged built-in challenges */
  premiumChallenges: boolean;
  assistantMessagesPerDay: number;
  maxTracks: number;
  emergencyUnlocksPerWeek: number;
  strictMode: boolean;
  /** days of history shown in stats */
  historyDays: number;
}

export const PLANS: Record<PlanId, PlanLimits> = {
  free: {
    label: 'Free',
    priceLabel: '$0',
    maxSchedules: 2,
    maxChallengesPerLock: 1,
    maxGoals: 2,
    maxCustomChallenges: 1,
    premiumChallenges: false,
    assistantMessagesPerDay: 10,
    maxTracks: 15,
    emergencyUnlocksPerWeek: 1,
    strictMode: false,
    historyDays: 7,
  },
  premium: {
    label: 'Premium',
    priceLabel: 'TBD / month',
    maxSchedules: UNLIMITED,
    maxChallengesPerLock: 5,
    maxGoals: UNLIMITED,
    maxCustomChallenges: UNLIMITED,
    premiumChallenges: true,
    assistantMessagesPerDay: 200,
    maxTracks: UNLIMITED,
    emergencyUnlocksPerWeek: 3,
    strictMode: true,
    historyDays: 365,
  },
};

/** Rows for the plan comparison table on the Account screen. */
export const PLAN_FEATURES: { label: string; value: (p: PlanLimits) => string }[] = [
  { label: 'Lock schedules', value: (p) => fmt(p.maxSchedules) },
  { label: 'Challenges per lock', value: (p) => fmt(p.maxChallengesPerLock) },
  { label: 'Goals', value: (p) => fmt(p.maxGoals) },
  { label: 'Custom challenges', value: (p) => fmt(p.maxCustomChallenges) },
  { label: 'Premium challenges', value: (p) => (p.premiumChallenges ? '✓' : '—') },
  { label: 'Assistant messages / day', value: (p) => fmt(p.assistantMessagesPerDay) },
  { label: 'Music tracks', value: (p) => fmt(p.maxTracks) },
  { label: 'Emergency unlocks / week', value: (p) => fmt(p.emergencyUnlocksPerWeek) },
  { label: 'Strict mode', value: (p) => (p.strictMode ? '✓' : '—') },
  { label: 'Stats history', value: (p) => `${p.historyDays} days` },
];

function fmt(n: number): string {
  return n === UNLIMITED ? 'Unlimited' : String(n);
}

export function limitsFor(plan: PlanId): PlanLimits {
  return PLANS[plan];
}

export function canUseChallenge(plan: PlanId, c: Challenge): boolean {
  return !c.premium || limitsFor(plan).premiumChallenges;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function emergencyUnlocksLeft(data: Pick<AppData, 'plan' | 'emergencyUnlocks'>, now: number): number {
  const used = data.emergencyUnlocks.filter((t) => now - t < WEEK_MS).length;
  return Math.max(0, limitsFor(data.plan).emergencyUnlocksPerWeek - used);
}

export function assistantMessagesLeft(
  data: Pick<AppData, 'plan' | 'usage'>,
  todayKey: string,
): number {
  const used = data.usage.date === todayKey ? data.usage.assistantMessages : 0;
  return Math.max(0, limitsFor(data.plan).assistantMessagesPerDay - used);
}
