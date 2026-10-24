import { Pressable, Text, View } from 'react-native';

import { useMusic } from '../state/MusicPlayer';
import { colors, Muted, ProgressBar, styles } from './ui';

export function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function MiniPlayer() {
  const m = useMusic();
  if (m.tracks.length === 0) return <Muted>Add music in the Music tab to listen while you work.</Muted>;
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.text} numberOfLines={1}>
        🎵 {m.current?.name ?? 'Nothing playing'}
      </Text>
      {m.current ? <ProgressBar value={m.duration ? m.position / m.duration : 0} /> : null}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 28 }}>
        <Ctrl glyph="⏮" onPress={m.previous} />
        <Ctrl glyph={m.playing ? '⏸' : '▶️'} onPress={m.toggle} big />
        <Ctrl glyph="⏭" onPress={m.next} />
      </View>
    </View>
  );
}

export function Ctrl({ glyph, onPress, big, active }: { glyph: string; onPress: () => void; big?: boolean; active?: boolean }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      <Text style={{ fontSize: big ? 34 : 24, color: active === false ? colors.muted : colors.text }}>{glyph}</Text>
    </Pressable>
  );
}
