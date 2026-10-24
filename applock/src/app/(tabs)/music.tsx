import * as DocumentPicker from 'expo-document-picker';
import { Pressable, Text, View } from 'react-native';

import { Ctrl, formatTime } from '../../components/MiniPlayer';
import { Button, Card, colors, H1, H2, Muted, notify, ProgressBar, Row, Screen, styles } from '../../components/ui';
import { limitsFor, UNLIMITED } from '../../domain/plans';
import { newId, useStore } from '../../state/AppStore';
import { useMusic } from '../../state/MusicPlayer';

export default function Music() {
  const { data, addTracks, removeTrack } = useStore();
  const m = useMusic();
  const limits = limitsFor(data.plan);
  const room = limits.maxTracks - data.tracks.length;

  const pick = async () => {
    if (room <= 0) {
      return notify('Library full', `${limits.label} accounts can keep ${limits.maxTracks} tracks. Upgrade for unlimited.`);
    }
    const res = await DocumentPicker.getDocumentAsync({ type: 'audio/*', multiple: true, copyToCacheDirectory: true });
    if (res.canceled) return;
    const picked = res.assets.slice(0, room).map((a) => ({
      id: newId(),
      name: a.name.replace(/\.[^.]+$/, ''),
      uri: a.uri,
    }));
    addTracks(picked);
    if (res.assets.length > room) notify('Some tracks skipped', `Only ${room} more fit on your plan.`);
  };

  return (
    <Screen>
      <H1>Focus music</H1>
      <Muted>Your own tracks, playing across the whole app — including during locks.</Muted>

      <Card style={{ alignItems: 'stretch' }}>
        <Text style={{ fontSize: 64, textAlign: 'center' }}>{m.playing ? '🎶' : '🎧'}</Text>
        <Text style={[styles.text, { textAlign: 'center', fontWeight: '700', fontSize: 17 }]} numberOfLines={2}>
          {m.current?.name ?? 'Pick a track'}
        </Text>
        <ProgressBar value={m.duration ? m.position / m.duration : 0} />
        <Row style={{ justifyContent: 'space-between' }}>
          <Muted>{formatTime(m.position)}</Muted>
          <Muted>{formatTime(m.duration)}</Muted>
        </Row>
        <Row style={{ justifyContent: 'center', gap: 22 }}>
          <Ctrl glyph="🔀" onPress={() => m.setShuffle(!m.shuffle)} active={m.shuffle} />
          <Ctrl glyph="⏪" onPress={() => m.seek(Math.max(0, m.position - 15))} />
          <Ctrl glyph="⏮" onPress={m.previous} />
          <Ctrl glyph={m.playing ? '⏸' : '▶️'} onPress={m.toggle} big />
          <Ctrl glyph="⏭" onPress={m.next} />
          <Ctrl glyph="⏩" onPress={() => m.seek(Math.min(m.duration || 0, m.position + 15))} />
          <Ctrl glyph="🔁" onPress={() => m.setRepeat(!m.repeat)} active={m.repeat} />
        </Row>
      </Card>

      <H2 right={<Muted>{limits.maxTracks === UNLIMITED ? `${data.tracks.length} tracks` : `${data.tracks.length}/${limits.maxTracks}`}</Muted>}>
        Library
      </H2>
      <Button title="+ Add audio files" variant="secondary" onPress={pick} />
      {data.tracks.length === 0 ? <Muted>Add MP3, M4A or other audio files from your device.</Muted> : null}
      {data.tracks.map((t) => {
        const isCurrent = m.current?.id === t.id;
        return (
          <Pressable key={t.id} onPress={() => m.playTrack(t.id)}>
            <Card style={[{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 }, isCurrent && { borderColor: colors.primary }]}>
              <Text style={{ fontSize: 18 }}>{isCurrent && m.playing ? '🔊' : '🎵'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.text, isCurrent && { color: colors.primary }]} numberOfLines={1}>
                  {t.name}
                </Text>
              </View>
              <Pressable onPress={() => removeTrack(t.id)} hitSlop={10}>
                <Text style={{ color: colors.muted, fontSize: 18 }}>✕</Text>
              </Pressable>
            </Card>
          </Pressable>
        );
      })}
    </Screen>
  );
}
