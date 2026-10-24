import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { BackHandler, Text, View } from 'react-native';

import { ChallengeRunner } from '../components/challenges/ChallengeRunner';
import { MiniPlayer } from '../components/MiniPlayer';
import { Button, Card, colors, confirm, H1, Muted, Row, Screen, styles } from '../components/ui';
import { CATEGORY_META, describeTarget, findChallenge } from '../domain/challenges';
import { emergencyUnlocksLeft } from '../domain/plans';
import { useStore } from '../state/AppStore';
import { useLockState } from '../state/useLock';

export default function LockScreen() {
  const router = useRouter();
  const { data, recordCompletion, unlockSession, emergencyUnlock } = useStore();
  const { current, now } = useLockState();
  const [active, setActive] = useState<string | null>(null);

  // Android back button must not escape the lock.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  if (!current) {
    return (
      <Screen>
        <H1>Unlocked 🎉</H1>
      </Screen>
    );
  }

  const sessionKey = current.sessionKey;
  const challenges = current.challengeIds
    .map((id) => findChallenge(data.customChallenges, id))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const doneIds = new Set(data.history.filter((h) => h.sessionKey === sessionKey).map((h) => h.challengeId));
  const remaining = challenges.filter((c) => !doneIds.has(c.id));
  const minutesLeft = Math.max(0, Math.ceil((current.endsAt - now.getTime()) / 60_000));
  const emergencyLeft = emergencyUnlocksLeft(data, now.getTime());
  const running = challenges.find((c) => c.id === active);

  // A lock whose challenges were deleted can't be completed — let it go.
  if (challenges.length === 0 || remaining.length === 0) {
    return (
      <Screen>
        <H1>🔓 All done</H1>
        <Button title="Unlock" onPress={() => unlockSession(sessionKey)} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: 6, marginTop: 10 }}>
        <Text style={{ fontSize: 56 }}>🔒</Text>
        <H1>{current.title}</H1>
        <Muted>
          Locked for {minutesLeft >= 60 ? `${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}m` : `${minutesLeft} min`}{' '}
          — or complete {remaining.length === 1 ? 'this challenge' : `these ${remaining.length} challenges`} to unlock now.
        </Muted>
      </View>

      {running ? (
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={[styles.text, { fontWeight: '700', flex: 1 }]}>
              {CATEGORY_META[running.category].emoji} {running.title}
            </Text>
            <Button title="Back" variant="ghost" onPress={() => setActive(null)} />
          </Row>
          <ChallengeRunner
            key={running.id}
            challenge={running}
            onComplete={(proof) => {
              recordCompletion({
                challengeId: running.id,
                category: running.category,
                completedAt: Date.now(),
                sessionKey,
                ...proof,
              });
              setActive(null);
              if (remaining.length === 1) unlockSession(sessionKey);
            }}
          />
        </Card>
      ) : (
        challenges.map((c) => {
          const done = doneIds.has(c.id);
          const meta = CATEGORY_META[c.category];
          return (
            <Card key={c.id} style={{ borderLeftWidth: 4, borderLeftColor: meta.color, opacity: done ? 0.6 : 1 }}>
              <Text style={[styles.text, { fontWeight: '700' }]}>
                {meta.emoji} {c.title} {done ? '✓' : ''}
              </Text>
              <Muted>{c.description}</Muted>
              <Muted>🎯 {describeTarget(c)}</Muted>
              {!done ? <Button title="Start challenge" onPress={() => setActive(c.id)} /> : null}
            </Card>
          );
        })
      )}

      <Card>
        <Text style={[styles.text, { fontWeight: '700' }]}>Study tools stay open</Text>
        <Muted>Need help with homework or research? The assistant and your music work during a lock.</Muted>
        <Button title="🤖 Open study assistant" variant="secondary" onPress={() => router.push('/study-assistant')} />
        <MiniPlayer />
      </Card>

      {!current.strict ? (
        <Button
          title={`Emergency unlock (${emergencyLeft} left this week)`}
          variant="danger"
          disabled={emergencyLeft === 0}
          onPress={() =>
            confirm(
              'Emergency unlock?',
              'This skips the challenge and uses one of your weekly emergency unlocks.',
              'Unlock',
              () => emergencyUnlock(sessionKey),
            )
          }
        />
      ) : (
        <Muted style={{ textAlign: 'center' }}>🛡️ Strict mode — no emergency unlock for this lock.</Muted>
      )}
      <Text style={{ color: colors.muted, fontSize: 12, textAlign: 'center' }}>
        Emergency calls always work from your phone's own lock screen.
      </Text>
    </Screen>
  );
}
