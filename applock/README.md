# ChallengeLock

An app lock that makes you **earn your screen time**. It locks on the schedule you choose. To unlock early, you complete a challenge that moves you toward a goal: exercise, chores, homework, projects and more. A music player and a GPT study assistant stay available during a lock, so homework and research can carry on.

Built with Expo (SDK 58), React Native, Expo Router and TypeScript.

## Features

| Area | What it does |
| --- | --- |
| **Lock schedules** | Named windows by weekday and time, including overnight windows such as 22:00 → 06:00. Each schedule can be turned on or off. Optional **strict mode** removes the emergency unlock. |
| **Lock me now** | Starts a one-off focus lock for 15–90 minutes. |
| **Lock screen** | Blocks every other screen until the challenge is done or the window ends. The Android back button is disabled. The study assistant and music still work. Emergency unlocks are limited per week. |
| **Challenges** | 12 built-in challenges in six categories: Exercise, Chores, Homework, Projects, Mind and Custom. You can also create your own. |
| **Verification** | 🚶 step counter (pedometer) · 💪 rep counter with anti-spam pacing · ✅ checklist with optional photo proof · ⏱️ focus timer that pauses when you leave the app, followed by a written summary · 🧮 math problems (a wrong answer brings a new problem) · ✍️ minimum-length write-up |
| **Goals & streaks** | Weekly goals per category (for example "Exercise 5×/week"), progress bars, a day streak and recent wins. |
| **Music player** | Plays your own audio files: play/pause, next/previous, seek ±15s, shuffle and repeat. One player runs across the whole app, including the lock screen. |
| **GPT assistant** | Two modes: *Homework* (step-by-step coaching rather than handing over answers) and *Research* (outlines, angles, what sources to look for). It goes through a small server proxy, so the OpenAI key never ships in the app. |
| **Reminders** | Local notifications 5 minutes before and at the start of each lock. Tapping one opens the lock screen. |
| **Accounts / tiers** | Free and Premium plans. **Every limit is set in one file**: [`src/domain/plans.ts`](src/domain/plans.ts). |

## Getting started

```bash
cd applock
npm install
npx expo start          # then press a (Android), i (iOS) or w (web)
```

Expo Go does not include every module this app uses. The pedometer, notifications and background audio need a **development build**:

```bash
npx expo run:android    # or: npx expo run:ios  (macOS)
# or in the cloud:
npx eas-cli@latest build --profile development
```

Checks:

```bash
npm run typecheck       # TypeScript
npm test                # domain logic: schedules, challenges, plans (Node >= 22.18)
```

### GPT assistant

```bash
OPENAI_API_KEY=sk-... npm run assistant-proxy    # listens on :8787
cp .env.example .env.local                       # set EXPO_PUBLIC_ASSISTANT_URL
```

`OPENAI_MODEL` selects the model. The default is `gpt-4o-mini`. The proxy also rate-limits each IP address (`RATE_PER_MIN`). The per-day message allowance is enforced in the app. Once real accounts exist, also enforce it on the server.

## Project layout

```
src/
  app/                    Expo Router screens
    (tabs)/               Home · Locks · Challenges · Music · Assistant · Account
    lock.tsx              the lock screen
    study-assistant.tsx   assistant reachable while locked
    schedule/[id].tsx     create / edit schedule
    challenge/new.tsx     custom challenge builder
    practice/[id].tsx     run any challenge outside a lock
  components/             UI kit, challenge runners, assistant chat, mini player
  domain/                 pure logic (no React): types, schedule math, challenges, plans
  services/               notifications, assistant client, native device-lock bridge
  state/                  persisted app store, lock state hook, music player
server/assistant-proxy.mjs  zero-dependency OpenAI proxy
tests/                    node:test unit tests for src/domain
```

All data is stored on the device with AsyncStorage.

## How locking works, and what is still needed for system-wide blocking

The app enforces locks **inside itself**. During an active window, every route except the lock screen and the study assistant redirects to `/lock`. Reminders fire when a window starts.

Blocking **other apps** (Instagram, TikTok and so on) cannot be done from JavaScript. It needs native platform code:

- **Android**: an `AccessibilityService` or `UsageStatsManager` plus an overlay that shows the lock screen over blocked apps. On a dedicated or kiosk device, Lock Task mode can be used instead.
- **iOS**: the Screen Time API (FamilyControls, ManagedSettings and DeviceActivity). It requires Apple's *Family Controls* entitlement, which you must request from Apple.

[`src/services/deviceLock.ts`](src/services/deviceLock.ts) defines the bridge for this (`requestAuthorization`, `engage(until)`, `release`). Build it as a local Expo module named `ChallengeLockDevice`. The app detects the module and calls it automatically whenever a lock starts or ends.

## Accounts & subscriptions

The tier structure is in place. The benefits are placeholders for you to decide. Current defaults:

| Feature | Free | Premium |
| --- | --- | --- |
| Lock schedules | 2 | Unlimited |
| Challenges per lock | 1 | 5 |
| Goals | 2 | Unlimited |
| Custom challenges | 1 | Unlimited |
| Premium challenges | — | ✓ |
| Assistant messages / day | 10 | 200 |
| Music tracks | 15 | Unlimited |
| Emergency unlocks / week | 1 | 3 |
| Strict mode | — | ✓ |
| Stats history | 7 days | 365 days |

To change a benefit, edit `PLANS` in `src/domain/plans.ts`. The Account screen comparison table updates automatically. To add a new kind of benefit, add a field to `PlanLimits` and a row to `PLAN_FEATURES`.

**Not built yet:**
- Sign-in and cloud sync. The profile currently lives on the device only.
- Real billing. The "Upgrade" button switches the plan locally so you can preview Premium. RevenueCat (`react-native-purchases`) is the usual choice with Expo: map its entitlement to `plan: 'premium'`.
- Server-side enforcement of assistant quotas per account.
