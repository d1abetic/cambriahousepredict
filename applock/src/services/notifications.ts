import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { formatMinutes } from '../domain/schedule';
import type { LockSchedule } from '../domain/types';

const CHANNEL_ID = 'lock-reminders';
const supported = Platform.OS !== 'web';

export function configureNotifications(): void {
  if (!supported) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Lock reminders',
      importance: Notifications.AndroidImportance.HIGH,
    }).catch(() => {});
  }
}

export async function ensurePermission(): Promise<boolean> {
  if (!supported) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

/**
 * Re-create weekly reminders for every enabled schedule: one at lock start and
 * one 5 minutes before. The reminder deep-links back into the app, which then
 * shows the lock screen.
 */
export async function syncScheduleReminders(schedules: LockSchedule[]): Promise<void> {
  if (!supported) return;
  if (!(await ensurePermission())) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const s of schedules) {
    if (!s.enabled) continue;
    for (const day of s.days) {
      const heads = s.start - 5;
      const headsDay = heads < 0 ? (day + 6) % 7 : day;
      const headsMin = (heads + 1440) % 1440;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🔒 ${s.name} starts in 5 minutes`,
          body: 'Wrap up — your challenge is coming.',
        },
        trigger: weekly(headsDay, headsMin),
      });
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🔒 ${s.name} is on`,
          body: `Locked from ${formatMinutes(s.start)} to ${formatMinutes(s.end)}. Complete your challenge to unlock.`,
          data: { url: '/lock' },
        },
        trigger: weekly(day, s.start),
      });
    }
  }
}

function weekly(day: number, minutes: number): Notifications.WeeklyTriggerInput {
  return {
    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
    // Expo weekdays are 1 = Sunday ... 7 = Saturday.
    weekday: day + 1,
    hour: Math.floor(minutes / 60),
    minute: minutes % 60,
    channelId: CHANNEL_ID,
  };
}
