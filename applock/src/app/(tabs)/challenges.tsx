import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  Button,
  Card,
  Chip,
  colors,
  confirm,
  Field,
  H1,
  H2,
  Muted,
  notify,
  PremiumBadge,
  ProgressBar,
  Row,
  Screen,
  styles,
} from '../../components/ui';
import {
  allChallenges,
  CATEGORIES,
  CATEGORY_META,
  describeTarget,
  goalProgress,
} from '../../domain/challenges';
import { canUseChallenge, limitsFor } from '../../domain/plans';
import type { ChallengeCategory } from '../../domain/types';
import { newId, useStore } from '../../state/AppStore';
import { useNow } from '../../state/useLock';

export default function Challenges() {
  const router = useRouter();
  const now = useNow(60_000);
  const { data, saveGoal, removeGoal, removeCustomChallenge } = useStore();
  const limits = limitsFor(data.plan);
  const [filter, setFilter] = useState<ChallengeCategory | 'all'>('all');

  const [goalTitle, setGoalTitle] = useState('');
  const [goalCat, setGoalCat] = useState<ChallengeCategory>('exercise');
  const [goalTarget, setGoalTarget] = useState('5');

  const list = allChallenges(data.customChallenges).filter((c) => filter === 'all' || c.category === filter);

  const addGoal = () => {
    if (data.goals.length >= limits.maxGoals) {
      return notify('Goal limit reached', `${limits.label} accounts can track ${limits.maxGoals} goals.`);
    }
    const target = Math.max(1, Math.min(50, parseInt(goalTarget, 10) || 0));
    saveGoal({
      id: newId(),
      title: goalTitle.trim() || `${CATEGORY_META[goalCat].label} ${target}×/week`,
      category: goalCat,
      targetPerWeek: target,
    });
    setGoalTitle('');
  };

  const newChallenge = () => {
    if (data.customChallenges.length >= limits.maxCustomChallenges) {
      return notify(
        'Custom challenge limit reached',
        `${limits.label} accounts can create ${limits.maxCustomChallenges} custom challenge(s).`,
      );
    }
    router.push('/challenge/new');
  };

  return (
    <Screen>
      <H1>Challenges & goals</H1>
      <Muted>Pick challenges that move you toward your goals — exercise, chores, homework, projects and more.</Muted>

      <Card>
        <H2>Weekly goals</H2>
        {data.goals.map((g) => {
          const done = goalProgress(g, data.history, now);
          const meta = CATEGORY_META[g.category];
          return (
            <View key={g.id} style={{ gap: 6 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text style={[styles.text, { flex: 1 }]}>
                  {meta.emoji} {g.title} · {done}/{g.targetPerWeek}
                </Text>
                <Pressable onPress={() => removeGoal(g.id)} hitSlop={8}>
                  <Text style={{ color: colors.danger }}>Remove</Text>
                </Pressable>
              </Row>
              <ProgressBar value={done / g.targetPerWeek} color={meta.color} />
            </View>
          );
        })}
        <Field placeholder="Goal name (optional)" value={goalTitle} onChangeText={setGoalTitle} />
        <Row>
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={`${CATEGORY_META[c].emoji} ${CATEGORY_META[c].label}`}
              selected={goalCat === c}
              color={CATEGORY_META[c].color}
              onPress={() => setGoalCat(c)}
            />
          ))}
        </Row>
        <Row>
          <Field
            label="Completions per week"
            value={goalTarget}
            onChangeText={setGoalTarget}
            keyboardType="number-pad"
            style={{ width: 120 }}
          />
        </Row>
        <Button title="+ Add goal" variant="secondary" onPress={addGoal} />
      </Card>

      <H2 right={<Button title="+ Custom" variant="ghost" onPress={newChallenge} />}>Library</H2>
      <Row>
        <Chip label="All" selected={filter === 'all'} onPress={() => setFilter('all')} />
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={`${CATEGORY_META[c].emoji} ${CATEGORY_META[c].label}`}
            selected={filter === c}
            color={CATEGORY_META[c].color}
            onPress={() => setFilter(c)}
          />
        ))}
      </Row>

      {list.map((c) => {
        const meta = CATEGORY_META[c.category];
        const allowed = canUseChallenge(data.plan, c);
        return (
          <Card key={c.id} style={{ borderLeftWidth: 4, borderLeftColor: meta.color }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={[styles.text, { fontWeight: '700', flex: 1 }]}>
                {meta.emoji} {c.title}
              </Text>
              {c.premium ? <PremiumBadge /> : null}
            </Row>
            <Muted>{c.description}</Muted>
            <Muted>🎯 {describeTarget(c)}</Muted>
            <Row>
              <Button
                title={allowed ? 'Try it now' : 'Premium only'}
                variant="secondary"
                disabled={!allowed}
                onPress={() => router.push(`/practice/${c.id}`)}
              />
              {!c.builtIn ? (
                <Button
                  title="Delete"
                  variant="ghost"
                  onPress={() =>
                    confirm('Delete challenge?', `"${c.title}" will be removed from all schedules.`, 'Delete', () =>
                      removeCustomChallenge(c.id),
                    )
                  }
                />
              ) : null}
            </Row>
          </Card>
        );
      })}
    </Screen>
  );
}
