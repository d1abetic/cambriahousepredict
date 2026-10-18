import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { chainSoundEngine } from '@/utils/chainSound';

interface SoundContextType {
  isMuted: boolean;
  toggleSound: () => void;
  setMuted: (muted: boolean) => void;
  playChainSound: (direction: 'up' | 'down', speed?: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    // Sync state with sound engine
    const unsubscribe = chainSoundEngine.subscribe((muted) => {
      setIsMuted(muted);
    });
    return unsubscribe;
  }, []);

  const toggleSound = () => {
    chainSoundEngine.toggleMute();
  };

  const setMuted = (muted: boolean) => {
    chainSoundEngine.setMuted(muted);
  };

  const playChainSound = (direction: 'up' | 'down' = 'down', speed: number = 1) => {
    chainSoundEngine.playRattle(direction, speed);
  };

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleSound,
        setMuted,
        playChainSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
