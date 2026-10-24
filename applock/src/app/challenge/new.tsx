import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Switch, Text } from 'react-native';

import { Button, Card, Chip, colors, Field, H2, Muted, Row, Screen, styles } from '../../components/ui';
import { CATEGORIES, CATEGORY_META } from '../../domain/challenges';
import type { ChallengeCategory, ChallengeKind, ChallengeParams } from '../../domain/types';
import { newId, useStore } from '../../state/AppStore';

const KINDS: { kind: ChallengeKind; label: string; hint: string }[] = [
  { kind: 'checklist', label: '✅ Checklist', hint: 'Tick off tasks — great for chores and homework lists.' },
  { kind: 'reps', label: '💪 Reps', hint: 'Count exercise reps one tap at a time.' },
  { kind: 'steps', label: '🚶 Steps', hint: 'Walk a number of steps.' },
  { kind: 'focus', label: '⏱️ Focus timer', hint: 'Stay focused for N minutes, then summarise.' },
  { kind: 'reflection', label: '✍️ Write-up', hint: 'Write a progress update or journal entry.' },
  { kind: 'math', label: '🧮 Math', hint: 'Solve arithmetic problems.' },
];

export default function NewChallenge() {
  const router = useRouter();
  const { saveCustomChallenge } = useStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ChallengeCategory>('custom');
  const [kind, setKind] = useState<ChallengeKind>('checklist');
  const [amount, setAmount] = useState('20');
  const [items, setItems] = useState('');
  const [photoProof, setPhotoProof] = useState(false);
  const [prompt, setPrompt] = useState('');

  const n = Math.max(1, parseInt(amount, 10) || 0);
  const itemList = items
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const params = (): ChallengeParams => {
    switch (kind) {
      case 'checklist':
        return { items: itemList, photoProof };
      case 'reps':
      case 'steps':
        return { target: n };
      case 'focus':
        return { minutes: n, minChars: 30, prompt: prompt.trim() || 'What did you get done?' };
      case 'reflection':
        return { minChars: n, prompt: prompt.trim() || 'Write your update' };
      case 'math':
        return { problems: Math.min(n, 30) };
    }
  };

  const amountLabel: Partial<Record<ChallengeKind, string>> = {
    reps: 'Reps',
    steps: 'Steps',
    focus: 'Minutes',
    reflection: 'Minimum characters',
    math: 'Problems',
  };

  const valid = title.trim().length > 0 && (kind !== 'checklist' || itemList.length > 0);

  return (
    <Screen edges={['bottom']}>
      <Field label="Title" placeholder="e.g. Practice piano scales" value={title} onChangeText={setTitle} />

      <Card>
        <H2>Category</H2>
        <Row>
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={`${CATEGORY_META[c].emoji} ${CATEGORY_META[c].label}`}
              selected={category === c}
              color={CATEGORY_META[c].color}
              onPress={() => setCategory(c)}
            />
          ))}
        </Row>
      </Card>

      <Card>
        <H2>How is it verified?</H2>
        <Row>
          {KINDS.map((k) => (
            <Chip key={k.kind} label={k.label} selected={kind === k.kind} onPress={() => setKind(k.kind)} />
          ))}
        </Row>
        <Muted>{KINDS.find((k) => k.kind === kind)?.hint}</Muted>

        {kind === 'checklist' ? (
          <>
            <Field
              label="Tasks (one per line)"
              value={items}
              onChangeText={setItems}
              multiline
              style={{ minHeight: 110, textAlignVertical: 'top' }}
              placeholder={'Read chapter 4\nAnswer questions 1–10\nPack school bag'}
            />
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={styles.text}>Require photo proof</Text>
              <Switch value={photoProof} onValueChange={setPhotoProof} trackColor={{ true: colors.primary, false: colors.border }} />
            </Row>
          </>
        ) : (
          <Field label={amountLabel[kind]} value={amount} onChangeText={setAmount} keyboardType="number-pad" />
        )}
        {kind === 'focus' || kind === 'reflection' ? (
          <Field label="Writing prompt" value={prompt} onChangeText={setPrompt} placeholder="What did you work on?" />
        ) : null}
      </Card>

      <Button
        title="Create challenge"
        disabled={!valid}
        onPress={() => {
          saveCustomChallenge({
            id: `custom-${newId()}`,
            category,
            kind,
            title: title.trim(),
            description: KINDS.find((k) => k.kind === kind)?.hint ?? '',
            params: params(),
            builtIn: false,
          });
          router.back();
        }}
      />
    </Screen>
  );
}
