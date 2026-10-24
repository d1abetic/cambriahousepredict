import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { Track } from '../domain/types';
import { useStore } from './AppStore';

interface Music {
  tracks: Track[];
  current: Track | null;
  playing: boolean;
  position: number;
  duration: number;
  shuffle: boolean;
  repeat: boolean;
  playTrack(id: string): void;
  toggle(): void;
  next(): void;
  previous(): void;
  seek(seconds: number): void;
  setShuffle(v: boolean): void;
  setRepeat(v: boolean): void;
}

const MusicContext = createContext<Music | null>(null);

/**
 * One app-wide player so music keeps going while the user moves between
 * screens — including the lock screen.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const { data } = useStore();
  const tracks = data.tracks;
  const player = useAudioPlayer(null, { updateInterval: 500 });
  const status = useAudioPlayerStatus(player);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true }).catch(() => {});
  }, []);

  const current = tracks.find((t) => t.id === currentId) ?? null;

  const playTrack = useCallback(
    (id: string) => {
      const t = tracks.find((x) => x.id === id);
      if (!t) return;
      setCurrentId(id);
      player.replace({ uri: t.uri, name: t.name });
      player.play();
    },
    [player, tracks],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      if (tracks.length === 0) return;
      const idx = tracks.findIndex((t) => t.id === currentId);
      let nextIdx: number;
      if (shuffle && tracks.length > 1) {
        do nextIdx = Math.floor(Math.random() * tracks.length);
        while (nextIdx === idx);
      } else {
        nextIdx = idx < 0 ? 0 : (idx + dir + tracks.length) % tracks.length;
      }
      playTrack(tracks[nextIdx].id);
    },
    [tracks, currentId, shuffle, playTrack],
  );

  // Auto-advance when a track ends.
  useEffect(() => {
    if (!status.didJustFinish) return;
    if (repeat && current) {
      player.seekTo(0).then(() => player.play());
    } else {
      step(1);
    }
  }, [status.didJustFinish]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stop if the playing track was removed from the library.
  useEffect(() => {
    if (currentId && !current) {
      player.pause();
      setCurrentId(null);
    }
  }, [currentId, current, player]);

  const value = useMemo<Music>(
    () => ({
      tracks,
      current,
      playing: status.playing,
      position: status.currentTime,
      duration: status.duration,
      shuffle,
      repeat,
      playTrack,
      toggle: () => {
        if (!current) {
          if (tracks[0]) playTrack(tracks[0].id);
        } else if (status.playing) {
          player.pause();
        } else {
          player.play();
        }
      },
      next: () => step(1),
      previous: () => {
        if (status.currentTime > 3) player.seekTo(0);
        else step(-1);
      },
      seek: (s) => {
        player.seekTo(s);
      },
      setShuffle,
      setRepeat,
    }),
    [tracks, current, status.playing, status.currentTime, status.duration, shuffle, repeat, playTrack, step, player],
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic(): Music {
  const m = useContext(MusicContext);
  if (!m) throw new Error('useMusic must be used inside MusicProvider');
  return m;
}
