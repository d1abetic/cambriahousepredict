import { NativeModules, Platform } from 'react-native';

/**
 * Bridge to OS-level enforcement.
 *
 * Out of the box the app enforces locks *inside itself*: when a lock window is
 * active every screen except the lock screen and the study tools is blocked,
 * and reminders fire when a window starts.
 *
 * Blocking *other* apps needs platform code that Expo cannot ship in JS:
 *  - Android: an AccessibilityService / UsageStatsManager + overlay, or
 *    Lock Task mode (`startLockTask`) when the app is device owner.
 *  - iOS: the Screen Time API (FamilyControls + ManagedSettings + DeviceActivity),
 *    which requires Apple's Family Controls entitlement.
 *
 * Implement those as a local Expo module named `ChallengeLockDevice` exposing
 * the methods below; this file picks it up automatically when present.
 */
interface NativeDeviceLock {
  isSupported(): Promise<boolean>;
  requestAuthorization(): Promise<boolean>;
  engage(untilEpochMs: number): Promise<void>;
  release(): Promise<void>;
}

const native: NativeDeviceLock | undefined = NativeModules.ChallengeLockDevice;

export const deviceLock = {
  /** True when a native enforcement module is installed in this build. */
  available: Platform.OS !== 'web' && !!native,

  async requestAuthorization(): Promise<boolean> {
    return native ? native.requestAuthorization() : false;
  },

  async engage(untilEpochMs: number): Promise<void> {
    if (native) await native.engage(untilEpochMs);
  },

  async release(): Promise<void> {
    if (native) await native.release();
  },
};
