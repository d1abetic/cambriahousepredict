import * as Notifications from 'expo-notifications';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '../components/ui';
import { configureNotifications, syncScheduleReminders } from '../services/notifications';
import { deviceLock } from '../services/deviceLock';
import { AppStoreProvider, useStore } from '../state/AppStore';
import { MusicProvider } from '../state/MusicPlayer';
import { useLockState } from '../state/useLock';

configureNotifications();

/** Routes reachable while a lock is active. */
const ALLOWED_WHILE_LOCKED = new Set(['lock', 'study-assistant']);

function LockGate() {
  const { ready, data } = useStore();
  const { locked, current } = useLockState();
  const segments = useSegments();
  const router = useRouter();
  const top = segments[0] as string | undefined;

  useEffect(() => {
    if (!ready) return;
    if (locked && !ALLOWED_WHILE_LOCKED.has(top ?? '')) router.replace('/lock');
    if (!locked && top && ALLOWED_WHILE_LOCKED.has(top)) router.replace('/');
  }, [ready, locked, top, router]);

  // Hand off to native enforcement when a build includes it.
  useEffect(() => {
    if (!deviceLock.available) return;
    if (current) deviceLock.engage(current.endsAt).catch(() => {});
    else deviceLock.release().catch(() => {});
  }, [current?.sessionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep OS reminders in sync with the schedules.
  useEffect(() => {
    if (!ready) return;
    syncScheduleReminders(data.schedules).catch((e) => console.warn('Reminder sync failed', e));
  }, [ready, data.schedules]);

  // Tapping a lock reminder opens the lock screen.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sub = Notifications.addNotificationResponseReceivedListener(() => router.replace('/lock'));
    return () => sub.remove();
  }, [router]);

  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <MusicProvider>
          <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: colors.bg },
                headerTintColor: colors.text,
                contentStyle: { backgroundColor: colors.bg },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="lock" options={{ headerShown: false, gestureEnabled: false, animation: 'fade' }} />
              <Stack.Screen name="study-assistant" options={{ title: 'Study assistant' }} />
              <Stack.Screen name="schedule/[id]" options={{ title: 'Lock schedule', presentation: 'modal' }} />
              <Stack.Screen name="challenge/new" options={{ title: 'New challenge', presentation: 'modal' }} />
              <Stack.Screen name="practice/[id]" options={{ title: 'Practice' }} />
            </Stack>
            <LockGate />
          </View>
        </MusicProvider>
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}
