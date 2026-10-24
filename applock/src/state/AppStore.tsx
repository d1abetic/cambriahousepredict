import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { pruneUnlocked, dateKey } from '../domain/schedule';
import type {
  AppData,
  Challenge,
  ChatMessage,
  CompletionRecord,
  Goal,
  LockSchedule,
  PlanId,
  Profile,
  Track,
} from '../domain/types';

const STORAGE_KEY = 'challengelock/data/v1';
const MAX_CHAT = 100;
const MAX_HISTORY = 2000;

export function newId(): string {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
}

export function defaultData(): AppData {
  return {
    version: 1,
    profile: { name: '', email: '' },
    plan: 'free',
    schedules: [
      {
        id: 'default-evening',
        name: 'Homework hour',
        days: [1, 2, 3, 4, 5],
        start: 18 * 60,
        end: 19 * 60,
        challengeIds: ['hw-focus-25'],
        enabled: false,
        strict: false,
      },
    ],
    manualLock: null,
    customChallenges: [],
    goals: [],
    history: [],
    unlockedSessions: {},
    emergencyUnlocks: [],
    tracks: [],
    chat: [],
    usage: { date: dateKey(new Date()), assistantMessages: 0 },
  };
}

interface Store {
  ready: boolean;
  data: AppData;
  updateProfile(p: Partial<Profile>): void;
  setPlan(plan: PlanId): void;
  saveSchedule(s: LockSchedule): void;
  removeSchedule(id: string): void;
  startManualLock(minutes: number, challengeIds: string[], strict: boolean): void;
  saveCustomChallenge(c: Challenge): void;
  removeCustomChallenge(id: string): void;
  saveGoal(g: Goal): void;
  removeGoal(id: string): void;
  recordCompletion(r: CompletionRecord): void;
  unlockSession(sessionKey: string): void;
  emergencyUnlock(sessionKey: string): void;
  addTracks(t: Track[]): void;
  removeTrack(id: string): void;
  appendChat(m: ChatMessage): void;
  clearChat(): void;
  countAssistantMessage(): void;
  resetAll(): void;
}

const StoreContext = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppData>;
          setData({ ...defaultData(), ...parsed });
        }
      })
      .catch((e) => console.warn('Failed to load saved data', e))
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch((e) =>
      console.warn('Failed to save data', e),
    );
  }, [data]);

  const update = useCallback((fn: (d: AppData) => AppData) => setData((d) => fn(d)), []);

  const store = useMemo<Store>(
    () => ({
      ready,
      data,
      updateProfile: (p) => update((d) => ({ ...d, profile: { ...d.profile, ...p } })),
      setPlan: (plan) => update((d) => ({ ...d, plan })),
      saveSchedule: (s) =>
        update((d) => ({
          ...d,
          schedules: d.schedules.some((x) => x.id === s.id)
            ? d.schedules.map((x) => (x.id === s.id ? s : x))
            : [...d.schedules, s],
        })),
      removeSchedule: (id) => update((d) => ({ ...d, schedules: d.schedules.filter((s) => s.id !== id) })),
      startManualLock: (minutes, challengeIds, strict) =>
        update((d) => {
          const now = Date.now();
          return {
            ...d,
            manualLock: { id: newId(), startedAt: now, endsAt: now + minutes * 60_000, challengeIds, strict },
          };
        }),
      saveCustomChallenge: (c) =>
        update((d) => ({
          ...d,
          customChallenges: d.customChallenges.some((x) => x.id === c.id)
            ? d.customChallenges.map((x) => (x.id === c.id ? c : x))
            : [...d.customChallenges, c],
        })),
      removeCustomChallenge: (id) =>
        update((d) => ({
          ...d,
          customChallenges: d.customChallenges.filter((c) => c.id !== id),
          schedules: d.schedules.map((s) => ({ ...s, challengeIds: s.challengeIds.filter((x) => x !== id) })),
        })),
      saveGoal: (g) =>
        update((d) => ({
          ...d,
          goals: d.goals.some((x) => x.id === g.id) ? d.goals.map((x) => (x.id === g.id ? g : x)) : [...d.goals, g],
        })),
      removeGoal: (id) => update((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) })),
      recordCompletion: (r) => update((d) => ({ ...d, history: [...d.history, r].slice(-MAX_HISTORY) })),
      unlockSession: (sessionKey) =>
        update((d) => {
          const now = Date.now();
          return {
            ...d,
            unlockedSessions: { ...pruneUnlocked(d.unlockedSessions, now), [sessionKey]: now },
            manualLock: d.manualLock && sessionKey === `manual:${d.manualLock.id}` ? null : d.manualLock,
          };
        }),
      emergencyUnlock: (sessionKey) =>
        update((d) => {
          const now = Date.now();
          return {
            ...d,
            emergencyUnlocks: [...d.emergencyUnlocks.filter((t) => now - t < 30 * 86_400_000), now],
            unlockedSessions: { ...pruneUnlocked(d.unlockedSessions, now), [sessionKey]: now },
            manualLock: d.manualLock && sessionKey === `manual:${d.manualLock.id}` ? null : d.manualLock,
          };
        }),
      addTracks: (t) => update((d) => ({ ...d, tracks: [...d.tracks, ...t] })),
      removeTrack: (id) => update((d) => ({ ...d, tracks: d.tracks.filter((t) => t.id !== id) })),
      appendChat: (m) => update((d) => ({ ...d, chat: [...d.chat, m].slice(-MAX_CHAT) })),
      clearChat: () => update((d) => ({ ...d, chat: [] })),
      countAssistantMessage: () =>
        update((d) => {
          const today = dateKey(new Date());
          const used = d.usage.date === today ? d.usage.assistantMessages : 0;
          return { ...d, usage: { date: today, assistantMessages: used + 1 } };
        }),
      resetAll: () => update(() => defaultData()),
    }),
    [data, ready, update],
  );

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const s = useContext(StoreContext);
  if (!s) throw new Error('useStore must be used inside AppStoreProvider');
  return s;
}
