import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/router';

interface BufferContextType {
  isBuffering: boolean;
  bufferMessage: string;
  triggerBuffer: (durationMs?: number, message?: string) => Promise<void>;
  startBuffer: (message?: string) => void;
  stopBuffer: () => void;
}

const BufferContext = createContext<BufferContextType | undefined>(undefined);

export const BufferProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [bufferMessage, setBufferMessage] = useState<string>('Buffering Noble Protocol...');
  const [progress, setProgress] = useState<number>(0);
  const [showTopBar, setShowTopBar] = useState<boolean>(false);

  const startBuffer = useCallback((message: string = 'Buffering Noble Protocol...') => {
    setBufferMessage(message);
    setIsBuffering(true);
    setShowTopBar(true);
    setProgress(25);

    const timer1 = setTimeout(() => setProgress(65), 100);
    const timer2 = setTimeout(() => setProgress(88), 250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const stopBuffer = useCallback(() => {
    setProgress(100);
    const hideTimer = setTimeout(() => {
      setIsBuffering(false);
      setShowTopBar(false);
      setProgress(0);
    }, 200);

    return () => clearTimeout(hideTimer);
  }, []);

  const triggerBuffer = useCallback(
    (durationMs: number = 400, message: string = 'Processing interaction...'): Promise<void> => {
      return new Promise((resolve) => {
        startBuffer(message);
        setTimeout(() => {
          stopBuffer();
          resolve();
        }, durationMs);
      });
    },
    [startBuffer, stopBuffer]
  );

  // Hook into Next.js router events to automatically buffer on every page change
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      const destination = url.includes('/admin') ? 'Accessing Admin Chamber...' : 'Loading Royal Chamber...';
      startBuffer(destination);
    };

    const handleRouteChangeEnd = () => {
      stopBuffer();
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeEnd);
    };
  }, [router, startBuffer, stopBuffer]);

  return (
    <BufferContext.Provider value={{ isBuffering, bufferMessage, triggerBuffer, startBuffer, stopBuffer }}>
      {/* Top Glowing Buffer Bar */}
      {showTopBar && (
        <div className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none h-1 bg-cambria-950/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.9)] transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Centered Interaction Buffer Overlay */}
      {isBuffering && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] transition-all duration-200"
        >
          <div className="bg-cambria-900/95 border border-amber-500/60 rounded-2xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.35)] flex flex-col items-center space-y-4 max-w-xs text-center backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Spinning Emblem */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
              <div
                className="absolute inset-1.5 rounded-full border border-dashed border-amber-400/50 animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '4s' }}
              />
              <img
                src="/images/favicon.png"
                alt="Cambria Buffer Crest"
                className="w-8 h-8 object-contain pixel-art drop-shadow animate-pulse"
              />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                BUFFERING NOBLE PROTOCOL
              </span>
              <p className="text-xs font-semibold text-gray-200 tracking-wide font-medieval">
                {bufferMessage}
              </p>
            </div>

            {/* Subtle micro dots */}
            <div className="flex items-center space-x-1.5 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        </div>
      )}

      {children}
    </BufferContext.Provider>
  );
};

export const useBuffer = (): BufferContextType => {
  const context = useContext(BufferContext);
  if (!context) {
    throw new Error('useBuffer must be used within a BufferProvider');
  }
  return context;
};

export default BufferContext;
