import { useRouter } from 'expo-router';
import { Pressable, Switch, Text, View } from 'react-native';

import { Button, Card, colors, H1, Muted, notify, Row, Screen, styles } from '../../components/ui';
import { findChallenge } from '../../domain/challenges';
import { limitsFor, UNLIMITED } from '../../domain/plans';
import { formatMinutes, WEEKDAY_SHORT } from '../../domain/schedule';
import { useStore } from '../../state/AppStore';

export default function Schedules() {
  const router = useRouter();
  const { data, saveSchedule } = useStore();
  const limits = limitsFor(data.plan);
  const atLimit = data.schedules.length >= limits.maxSchedules;

  const add = () => {
    if (atLimit) {
      return notify('Schedule limit reached', `${limits.label} accounts can have ${limits.maxSchedules} schedules. Upgrade for more.`);
    }
    router.push('/schedule/new');
  };

  return (
    <Screen>
      <H1>Lock schedules</H1>
      <Muted>
        During a lock window the app is locked until you complete the challenge you picked.
        {limits.maxSchedules !== UNLIMITED ? ` ${data.schedules.length}/${limits.maxSchedules} used.` : ''}
      </Muted>

      {data.schedules.map((s) => (
        <Pressable key={s.id} onPress={() => router.push(`/schedule/${s.id}`)}>
          <Card>
            <Row style={{ justifyContent: 'space-between' }}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[styles.text, { fontWeight: '700', fontSize: 17 }]}>
                  {s.name} {s.strict ? '🛡️' : ''}
                </Text>
                <Text style={styles.text}>
                  {formatMinutes(s.start)} → {formatMinutes(s.end)}
                </Text>
                <Muted>{s.days.length === 7 ? 'Every day' : s.days.map((d) => WEEKDAY_SHORT[d]).join(' · ') || 'No days'}</Muted>
                <Muted>
                  🎯 {s.challengeIds.map((id) => findChallenge(data.customChallenges, id)?.title ?? '?').join(', ') || 'No challenge'}
                </Muted>
              </View>
              <Switch
                value={s.enabled}
                onValueChange={(enabled) => saveSchedule({ ...s, enabled })}
                trackColor={{ true: colors.primary, false: colors.border }}
              />
            </Row>
          </Card>
        </Pressable>
      ))}

      <Button title="+ New lock schedule" onPress={add} />
    </Screen>
  );
}
