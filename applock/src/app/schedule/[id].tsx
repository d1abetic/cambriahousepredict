import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Switch, Text } from 'react-native';

import {
  Button,
  Card,
  Chip,
  colors,
  confirm,
  Field,
  H2,
  Muted,
  PremiumBadge,
  Row,
  Screen,
  styles,
  TimeStepper,
} from '../../components/ui';
import { allChallenges, CATEGORY_META } from '../../domain/challenges';
import { canUseChallenge, limitsFor } from '../../domain/plans';
import { WEEKDAY_SHORT, windowLength } from '../../domain/schedule';
import type { LockSchedule } from '../../domain/types';
import { newId, useStore } from '../../state/AppStore';

export default function ScheduleEditor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, saveSchedule, removeSchedule } = useStore();
  const limits = limitsFor(data.plan);
  const existing = data.schedules.find((s) => s.id === id);

  const [draft, setDraft] = useState<LockSchedule>(
    () =>
      existing ?? {
        id: newId(),
        name: 'Study time',
        days: [1, 2, 3, 4, 5],
        start: 16 * 60,
        end: 17 * 60,
        challengeIds: ['hw-focus-25'],
        enabled: true,
        strict: false,
      },
  );
  const set = (patch: Partial<LockSchedule>) => setDraft((d) => ({ ...d, ...patch }));

  const toggleDay = (d: number) =>
    set({ days: draft.days.includes(d) ? draft.days.filter((x) => x !== d) : [...draft.days, d].sort() });

  const toggleChallenge = (cid: string) => {
    const has = draft.challengeIds.includes(cid);
    if (has) return set({ challengeIds: draft.challengeIds.filter((x) => x !== cid) });
    if (draft.challengeIds.length >= limits.maxChallengesPerLock) {
      if (limits.maxChallengesPerLock === 1) return set({ challengeIds: [cid] });
      return;
    }
    set({ challengeIds: [...draft.challengeIds, cid] });
  };

  const valid = draft.name.trim() && draft.days.length > 0 && draft.challengeIds.length > 0;
  const hours = windowLength(draft) / 60;

  return (
    <Screen edges={['bottom']}>
      <Field label="Name" value={draft.name} onChangeText={(name) => set({ name })} />

      <Card>
        <H2>When</H2>
        <Row>
          {WEEKDAY_SHORT.map((label, d) => (
            <Chip key={label} label={label} selected={draft.days.includes(d)} onPress={() => toggleDay(d)} />
          ))}
        </Row>
        <TimeStepper label="Lock at" value={draft.start} onChange={(start) => set({ start })} />
        <TimeStepper label="Unlock at" value={draft.end} onChange={(end) => set({ end })} />
        <Muted>
          {hours.toFixed(hours % 1 ? 2 : 0)} hour window{draft.end <= draft.start ? ' (ends the next day)' : ''}.
        </Muted>
      </Card>

      <Card>
        <H2>Unlock challenge{limits.maxChallengesPerLock > 1 ? 's' : ''}</H2>
        <Muted>
          {limits.maxChallengesPerLock > 1
            ? `Pick up to ${limits.maxChallengesPerLock}. All must be completed to unlock.`
            : 'Pick one. Premium lets you stack several.'}
        </Muted>
        <Row>
          {allChallenges(data.customChallenges).map((c) => {
            const allowed = canUseChallenge(data.plan, c);
            return (
              <Row key={c.id} style={{ gap: 4 }}>
                <Chip
                  label={`${CATEGORY_META[c.category].emoji} ${c.title}`}
                  selected={draft.challengeIds.includes(c.id)}
                  color={CATEGORY_META[c.category].color}
                  onPress={allowed ? () => toggleChallenge(c.id) : undefined}
                />
                {!allowed ? <PremiumBadge /> : null}
              </Row>
            );
          })}
        </Row>
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={styles.text}>Enabled</Text>
          <Switch value={draft.enabled} onValueChange={(enabled) => set({ enabled })} trackColor={{ true: colors.primary, false: colors.border }} />
        </Row>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row style={{ gap: 6 }}>
            <Text style={styles.text}>Strict mode 🛡️</Text>
            {!limits.strictMode ? <PremiumBadge /> : null}
          </Row>
          <Switch
            value={draft.strict}
            disabled={!limits.strictMode}
            onValueChange={(strict) => set({ strict })}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </Row>
        <Muted>Strict mode removes the emergency unlock for this schedule.</Muted>
      </Card>

      <Button
        title="Save"
        disabled={!valid}
        onPress={() => {
          saveSchedule({ ...draft, name: draft.name.trim() });
          router.back();
        }}
      />
      {existing ? (
        <Button
          title="Delete schedule"
          variant="danger"
          onPress={() =>
            confirm('Delete schedule?', `"${existing.name}" will be removed.`, 'Delete', () => {
              removeSchedule(existing.id);
              router.back();
            })
          }
        />
      ) : null}
    </Screen>
  );
}
