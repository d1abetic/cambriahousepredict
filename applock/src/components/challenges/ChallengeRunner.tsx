import * as ImagePicker from 'expo-image-picker';
import { Pedometer } from 'expo-sensors';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Image, Pressable, Text, View } from 'react-native';

import { acceptRep, generateMathProblems, MIN_REP_INTERVAL_MS } from '../../domain/challenges';
import type { Challenge } from '../../domain/types';
import { Button, Card, colors, Field, Muted, ProgressBar, styles } from '../ui';

export interface CompletionProof {
  note?: string;
  photoUri?: string;
}

interface RunnerProps {
  challenge: Challenge;
  onComplete: (proof: CompletionProof) => void;
}

/** Renders the right interactive verifier for a challenge. */
export function ChallengeRunner({ challenge, onComplete }: RunnerProps) {
  switch (challenge.kind) {
    case 'steps':
      return <StepsRunner challenge={challenge} onComplete={onComplete} />;
    case 'reps':
      return <RepsRunner challenge={challenge} onComplete={onComplete} />;
    case 'checklist':
      return <ChecklistRunner challenge={challenge} onComplete={onComplete} />;
    case 'focus':
      return <FocusRunner challenge={challenge} onComplete={onComplete} />;
    case 'math':
      return <MathRunner challenge={challenge} onComplete={onComplete} />;
    case 'reflection':
      return <ReflectionRunner challenge={challenge} onComplete={onComplete} />;
  }
}

// ---------- Steps ----------

function StepsRunner({ challenge, onComplete }: RunnerProps) {
  const target = challenge.params.target ?? 500;
  const [steps, setSteps] = useState(0);
  const [state, setState] = useState<'checking' | 'ready' | 'unavailable' | 'denied'>('checking');

  useEffect(() => {
    let sub: { remove(): void } | undefined;
    let cancelled = false;
    (async () => {
      const available = await Pedometer.isAvailableAsync().catch(() => false);
      if (!available) return !cancelled && setState('unavailable');
      const perm = await Pedometer.requestPermissionsAsync().catch(() => null);
      if (!perm?.granted) return !cancelled && setState('denied');
      if (cancelled) return;
      setState('ready');
      sub = Pedometer.watchStepCount((r) => setSteps(r.steps));
    })();
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  if (state === 'unavailable' || state === 'denied') {
    // No step sensor (web, emulator) or no permission: fall back to tapping reps.
    return (
      <View style={{ gap: 10 }}>
        <Muted>
          {state === 'denied'
            ? 'Motion permission was denied, so steps cannot be counted.'
            : 'This device has no step counter.'}{' '}
          Do {Math.round(target / 25)} jumping jacks instead.
        </Muted>
        <RepsRunner
          challenge={{ ...challenge, params: { target: Math.round(target / 25) } }}
          onComplete={onComplete}
        />
      </View>
    );
  }

  const done = steps >= target;
  return (
    <View style={{ gap: 12 }}>
      <Text style={styles.big}>
        {Math.min(steps, target)} / {target}
      </Text>
      <ProgressBar value={steps / target} color={colors.success} />
      <Muted>{state === 'checking' ? 'Starting the step counter…' : 'Keep walking — the counter updates live.'}</Muted>
      <Button title={done ? 'Complete ✓' : 'Keep going…'} disabled={!done} onPress={() => onComplete({ note: `${steps} steps` })} />
    </View>
  );
}

// ---------- Reps ----------

function RepsRunner({ challenge, onComplete }: RunnerProps) {
  const target = challenge.params.target ?? 10;
  const [count, setCount] = useState(0);
  const [warn, setWarn] = useState(false);
  const last = useRef<number | null>(null);

  const tap = () => {
    const now = Date.now();
    if (!acceptRep(last.current, now)) {
      setWarn(true);
      return;
    }
    last.current = now;
    setWarn(false);
    setCount((c) => Math.min(target, c + 1));
  };

  const done = count >= target;
  return (
    <View style={{ gap: 12, alignItems: 'stretch' }}>
      <Pressable
        onPress={tap}
        disabled={done}
        style={({ pressed }) => ({
          alignSelf: 'center',
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: done ? colors.success : pressed ? colors.cardAlt : colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Text style={[styles.big, { color: colors.primaryText }]}>{count}</Text>
        <Text style={{ color: colors.primaryText, fontWeight: '700' }}>{done ? 'Done!' : 'TAP PER REP'}</Text>
      </Pressable>
      <ProgressBar value={count / target} />
      <Muted>
        {warn
          ? `Too fast — one rep every ${MIN_REP_INTERVAL_MS / 1000}s at most.`
          : `${target - count} to go. Do the rep, then tap.`}
      </Muted>
      <Button title="Complete ✓" disabled={!done} onPress={() => onComplete({ note: `${count} reps` })} />
    </View>
  );
}

// ---------- Checklist ----------

function ChecklistRunner({ challenge, onComplete }: RunnerProps) {
  const items = challenge.params.items ?? [];
  const needsPhoto = !!challenge.params.photoProof;
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const takePhoto = async () => {
    setError(null);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      const result = perm.granted
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.4 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.4 });
      if (!result.canceled && result.assets[0]) setPhoto(result.assets[0].uri);
    } catch {
      setError('Could not open the camera.');
    }
  };

  const allDone = checked.every(Boolean) && (!needsPhoto || !!photo);
  return (
    <View style={{ gap: 10 }}>
      {items.map((item, i) => (
        <Pressable
          key={item + i}
          onPress={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 }}
        >
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: checked[i] ? colors.success : colors.border,
              backgroundColor: checked[i] ? colors.success : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {checked[i] ? <Text style={{ color: colors.primaryText, fontWeight: '900' }}>✓</Text> : null}
          </View>
          <Text style={[styles.text, checked[i] && { textDecorationLine: 'line-through', color: colors.muted }]}>
            {item}
          </Text>
        </Pressable>
      ))}
      {needsPhoto ? (
        <Card style={{ alignItems: 'center' }}>
          {photo ? <Image source={{ uri: photo }} style={{ width: 160, height: 160, borderRadius: 12 }} /> : null}
          <Button title={photo ? 'Retake photo' : '📷 Add photo proof'} variant="secondary" onPress={takePhoto} />
          {error ? <Muted>{error}</Muted> : null}
        </Card>
      ) : null}
      <Button title="Complete ✓" disabled={!allDone} onPress={() => onComplete({ photoUri: photo ?? undefined })} />
    </View>
  );
}

// ---------- Focus ----------

function FocusRunner({ challenge, onComplete }: RunnerProps) {
  const totalMs = (challenge.params.minutes ?? 25) * 60_000;
  const minChars = challenge.params.minChars ?? 0;
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [note, setNote] = useState('');
  const lastTick = useRef(Date.now());

  useEffect(() => {
    if (!running) return;
    lastTick.current = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      // Only count time while the app is in the foreground; cap each tick so a
      // sleeping device can't jump the timer forward.
      if (AppState.currentState === 'active') {
        const delta = Math.min(now - lastTick.current, 5_000);
        setElapsed((e) => Math.min(totalMs, e + delta));
      }
      lastTick.current = now;
    }, 1000);
    return () => clearInterval(id);
  }, [running, totalMs]);

  const remaining = Math.max(0, totalMs - elapsed);
  const mm = Math.floor(remaining / 60_000);
  const ss = Math.floor((remaining % 60_000) / 1000);
  const timerDone = remaining === 0;

  return (
    <View style={{ gap: 12 }}>
      <Text style={styles.big}>
        {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
      </Text>
      <ProgressBar value={elapsed / totalMs} />
      {!timerDone ? (
        <>
          <Muted>
            The timer only runs while this app is open. Use the study assistant and music player freely — leaving the
            app pauses it.
          </Muted>
          <Button
            title={running ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start focus'}
            variant={running ? 'secondary' : 'primary'}
            onPress={() => setRunning((r) => !r)}
          />
        </>
      ) : null}
      {timerDone || minChars === 0 ? null : <Muted>When the timer ends you will write a short summary.</Muted>}
      {timerDone ? (
        <>
          <Field
            label={`${challenge.params.prompt ?? 'Summary'} (${note.trim().length}/${minChars})`}
            value={note}
            onChangeText={setNote}
            multiline
            style={{ minHeight: 100, textAlignVertical: 'top' }}
          />
          <Button
            title="Complete ✓"
            disabled={note.trim().length < minChars}
            onPress={() => onComplete({ note: note.trim() })}
          />
        </>
      ) : null}
    </View>
  );
}

// ---------- Math ----------

function MathRunner({ challenge, onComplete }: RunnerProps) {
  const count = challenge.params.problems ?? 5;
  const initial = useMemo(() => generateMathProblems(count), [count]);
  const [problems, setProblems] = useState(initial);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const done = index >= problems.length;
  const submit = () => {
    const p = problems[index];
    if (Number(answer.trim()) === p.answer) {
      setFeedback(null);
      setIndex((i) => i + 1);
    } else {
      // Wrong answer: swap in a fresh problem so guessing doesn't pay off.
      setFeedback(`Not quite — ${p.question} = ${p.answer}. Here's a new one.`);
      setProblems((ps) => ps.map((x, i) => (i === index ? generateMathProblems(1)[0] : x)));
    }
    setAnswer('');
  };

  if (done) {
    return (
      <View style={{ gap: 12 }}>
        <Text style={styles.big}>🎉</Text>
        <Button title="Complete ✓" onPress={() => onComplete({ note: `${count} problems solved` })} />
      </View>
    );
  }
  return (
    <View style={{ gap: 12 }}>
      <Muted>
        Problem {index + 1} of {problems.length}
      </Muted>
      <Text style={styles.big}>{problems[index].question} = ?</Text>
      <ProgressBar value={index / problems.length} />
      <Field
        value={answer}
        onChangeText={setAnswer}
        keyboardType="number-pad"
        placeholder="Your answer"
        onSubmitEditing={submit}
        returnKeyType="done"
      />
      {feedback ? <Text style={{ color: colors.warning }}>{feedback}</Text> : null}
      <Button title="Check" disabled={answer.trim() === ''} onPress={submit} />
    </View>
  );
}

// ---------- Reflection ----------

function ReflectionRunner({ challenge, onComplete }: RunnerProps) {
  const minChars = challenge.params.minChars ?? 50;
  const [text, setText] = useState('');
  const len = text.trim().length;
  return (
    <View style={{ gap: 12 }}>
      <Field
        label={`${challenge.params.prompt ?? 'Write it down'} (${len}/${minChars})`}
        value={text}
        onChangeText={setText}
        multiline
        style={{ minHeight: 140, textAlignVertical: 'top' }}
      />
      <ProgressBar value={len / minChars} />
      <Button title="Complete ✓" disabled={len < minChars} onPress={() => onComplete({ note: text.trim() })} />
    </View>
  );
}
