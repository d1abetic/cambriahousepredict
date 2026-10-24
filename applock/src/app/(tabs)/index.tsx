import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button, Card, Chip, colors, confirm, H1, H2, Muted, notify, ProgressBar, Row, Screen, styles } from '../../components/ui';
import { allChallenges, CATEGORY_META, currentStreak, findChallenge, goalProgress } from '../../domain/challenges';
import { canUseChallenge, limitsFor } from '../../domain/plans';
import { formatMinutes, WEEKDAY_SHORT } from '../../domain/schedule';
import { useStore } from '../../state/AppStore';
import { useLockState } from '../../state/useLock';

const DURATIONS = [15, 30, 45, 60, 90];

export default function Home() {
  const router = useRouter();
  const { data, startManualLock } = useStore();
  const { next, now } = useLockState();
  const limits = limitsFor(data.plan);
  const [minutes, setMinutes] = useState(30);
  const [picked, setPicked] = useState<string[]>(['mi-math-5']);

  const streak = currentStreak(data.history, now);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const doneToday = data.history.filter((h) => h.completedAt >= todayStart).length;
  const usable = allChallenges(data.customChallenges).filter((c) => canUseChallenge(data.plan, c));

  const toggle = (id: string) =>
    setPicked((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (p.length >= limits.maxChallengesPerLock) {
        return limits.maxChallengesPerLock === 1 ? [id] : p;
      }
      return [...p, id];
    });

  const lockNow = () => {
    if (picked.length === 0) return notify('Pick a challenge', 'Choose what you must do to unlock.');
    confirm('Lock now?', `Locked for ${minutes} minutes unless you complete your challenge.`, 'Lock', () =>
      startManualLock(minutes, picked, false),
    );
  };

  return (
    <Screen>
      <H1>{data.profile.name ? `Hi, ${data.profile.name} 👋` : 'ChallengeLock'}</H1>
      <Muted>Earn your screen time. Lock on schedule, unlock by doing what matters.</Muted>

      <Row>
        <Stat label="Day streak" value={`🔥 ${streak}`} />
        <Stat label="Done today" value={`✅ ${doneToday}`} />
        <Stat label="Plan" value={limits.label} />
      </Row>

      <Card>
        <H2>Next lock</H2>
        {next ? (
          <>
            <Text style={styles.text}>
              {next.schedule.name} · {WEEKDAY_SHORT[next.at.getDay()]} {formatMinutes(next.schedule.start)}
            </Text>
            <Muted>
              Unlock by: {next.schedule.challengeIds.map((id) => findChallenge(data.customChallenges, id)?.title ?? '?').join(', ') || 'no challenge set'}
            </Muted>
          </>
        ) : (
          <Muted>No schedules enabled.</Muted>
        )}
        <Button title="Manage lock schedules" variant="secondary" onPress={() => router.push('/schedules')} />
      </Card>

      <Card>
        <H2>Lock me now</H2>
        <Muted>Start a focus lock right away.</Muted>
        <Row>
          {DURATIONS.map((d) => (
            <Chip key={d} label={`${d} min`} selected={minutes === d} onPress={() => setMinutes(d)} />
          ))}
        </Row>
        <Muted>
          Unlock challenge{limits.maxChallengesPerLock > 1 ? `s (up to ${limits.maxChallengesPerLock})` : ''}:
        </Muted>
        <Row>
          {usable.map((c) => (
            <Chip
              key={c.id}
              label={`${CATEGORY_META[c.category].emoji} ${c.title}`}
              selected={picked.includes(c.id)}
              color={CATEGORY_META[c.category].color}
              onPress={() => toggle(c.id)}
            />
          ))}
        </Row>
        <Button title="🔒 Lock now" onPress={lockNow} />
      </Card>

      <Card>
        <H2 right={<Button title="Edit" variant="ghost" onPress={() => router.push('/challenges')} />}>
          Weekly goals
        </H2>
        {data.goals.length === 0 ? <Muted>Set goals in the Challenges tab.</Muted> : null}
        {data.goals.map((g) => {
          const done = goalProgress(g, data.history, now);
          const meta = CATEGORY_META[g.category];
          return (
            <View key={g.id} style={{ gap: 6 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text style={styles.text}>
                  {meta.emoji} {g.title}
                </Text>
                <Muted>
                  {done}/{g.targetPerWeek}
                </Muted>
              </Row>
              <ProgressBar value={done / g.targetPerWeek} color={meta.color} />
            </View>
          );
        })}
      </Card>

      <Card>
        <H2>Recent wins</H2>
        {data.history.length === 0 ? <Muted>Complete a challenge to see it here.</Muted> : null}
        {data.history
          .slice(-5)
          .reverse()
          .map((h, i) => {
            const c = findChallenge(data.customChallenges, h.challengeId);
            return (
              <Row key={h.completedAt + ':' + i} style={{ justifyContent: 'space-between' }}>
                <Text style={styles.text}>
                  {CATEGORY_META[h.category].emoji} {c?.title ?? 'Challenge'}
                </Text>
                <Muted>{new Date(h.completedAt).toLocaleDateString()}</Muted>
              </Row>
            );
          })}
      </Card>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={{ flex: 1, minWidth: 96, alignItems: 'center', gap: 4 }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>{value}</Text>
      <Muted>{label}</Muted>
    </Card>
  );
}
