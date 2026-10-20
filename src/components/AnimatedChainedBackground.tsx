import React, { useEffect, useState, useRef } from 'react';
import { useWallet } from '@/context/WalletContext';
import { chainSoundEngine } from '@/utils/chainSound';

interface ChainBanner {
  id: string;
  name: string;
  img: string;
  color: string;
  angleLabel?: string;
  angleSubtitle?: string;
}

// Sequence in the conveyor loop (8 houses total):
// Left Column (moving downward when scrolling down):
//   0: Warwick (Angle A - top left)
//   1: Montblanc
//   2: Dover
//   3: Eyras (Angle C - bottom left)
// Right Column (moving upward when scrolling down):
//   4: Blackfort (Angle D - bottom right)
//   5: Armagnac
//   6: Bloodstone
//   7: Thornhill (Angle B - top right)
const LOOP_HOUSES: ChainBanner[] = [
  { id: 'warwick', name: 'Warwick', img: '/images/chained/banners/warwick.png', color: 'from-amber-600 to-amber-900', angleLabel: 'Angle A', angleSubtitle: 'Warwick' },
  { id: 'montblanc', name: 'Montblanc', img: '/images/chained/banners/montblanc.png', color: 'from-blue-600 to-indigo-900', angleSubtitle: 'Montblanc' },
  { id: 'dover', name: 'Dover', img: '/images/chained/banners/dover.png', color: 'from-cyan-600 to-blue-950', angleSubtitle: 'Dover' },
  { id: 'eyras', name: 'Eyras', img: '/images/chained/banners/eyras.png', color: 'from-emerald-600 to-teal-950', angleLabel: 'Angle C', angleSubtitle: 'Eyras' },
  { id: 'blackfort', name: 'Blackfort', img: '/images/chained/banners/blackfort.png', color: 'from-stone-700 to-zinc-950', angleLabel: 'Angle D', angleSubtitle: 'Blackfort' },
  { id: 'armagnac', name: 'Armagnac', img: '/images/chained/banners/armagnac.png', color: 'from-amber-500 to-orange-800', angleSubtitle: 'Armagnac' },
  { id: 'bloodstone', name: 'Bloodstone', img: '/images/chained/banners/bloodstone.png', color: 'from-red-600 to-rose-950', angleSubtitle: 'Bloodstone' },
  { id: 'thornhill', name: 'Thornhill', img: '/images/chained/banners/thornhill.png', color: 'from-emerald-700 to-lime-950', angleLabel: 'Angle B', angleSubtitle: 'Thornhill' },
];

export const AnimatedChainedBackground: React.FC = () => {
  const { openHouseModal } = useWallet();

  // Scroll offset tracked with smooth lerp
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const targetOffsetRef = useRef<number>(0);
  const currentOffsetRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Viewport dimensions & desktop breakpoint
  const [viewportHeight, setViewportHeight] = useState<number>(850);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  // Handle window resize
  useEffect(() => {
    const updateSize = () => {
      setViewportHeight(window.innerHeight || 850);
      setIsDesktop(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Sync scroll and wheel with window scroll and trigger looping chain sound
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      targetOffsetRef.current = scrollY;
      chainSoundEngine.onUserScroll();
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 2) {
        chainSoundEngine.onUserScroll();
      }
    };

    const handleTouchMove = () => {
      chainSoundEngine.onUserScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Smooth animation loop using requestAnimationFrame
  useEffect(() => {
    const loop = () => {
      // Smooth lerp towards target scroll position
      const diff = targetOffsetRef.current - currentOffsetRef.current;
      currentOffsetRef.current += diff * 0.12;

      // Update react state for rendering
      setScrollProgress(currentOffsetRef.current);

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Slot calculations: 4 banners fit vertically in viewport
  // Start below the sticky header
  const topPadding = 84;
  const availableHeight = Math.max(500, viewportHeight - topPadding - 36);
  const slotSpacing = availableHeight / 3.4;

  // Pixels scrolled per banner transition step
  const PIXELS_PER_STEP = 260;
  const stepOffset = scrollProgress / PIXELS_PER_STEP;

  // Velocity ratio: exact screen pixels the chain texture moves per scrollProgress pixel
  const velocity = slotSpacing / PIXELS_PER_STEP;
  const leftChainOffsetY = scrollProgress * velocity;
  const rightChainOffsetY = -scrollProgress * velocity;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Underlying Animated Artwork with Canyon Sunset Shader */}
      <div
        className="absolute inset-0 bg-top bg-no-repeat bg-cover transition-opacity duration-700 ease-in-out opacity-100"
        style={{
          backgroundImage: "url('/images/ui/no-characters-animated-(with-shader).gif')",
          backgroundAttachment: 'fixed',
        }}
      />

      {/* 2. Soft subtle atmosphere - clear view of animated canyon background */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* 3. Continuous Full-Height Moving Steel Chains (Rolling with Scroll) */}
      {/* Left Top-to-Bottom Chain: moves downward with scroll */}
      <div
        className="absolute top-0 bottom-0 w-20 sm:w-24 md:w-28 pointer-events-none z-10"
        style={{
          left: isDesktop ? '242px' : 'clamp(8px, 2.5vw, 42px)',
          backgroundImage: "url('/images/chained/steel_chain.svg')",
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPositionY: `${leftChainOffsetY}px`,
          filter: 'drop-shadow(2px 3px 2px rgba(0,0,0,0.65))',
        }}
      />

      {/* Right Top-to-Bottom Chain: moves upward with scroll */}
      <div
        className="absolute top-0 bottom-0 w-20 sm:w-24 md:w-28 pointer-events-none z-10"
        style={{
          right: 'clamp(8px, 2.5vw, 42px)',
          backgroundImage: "url('/images/chained/steel_chain.svg')",
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPositionY: `${rightChainOffsetY}px`,
          filter: 'drop-shadow(2px 3px 2px rgba(0,0,0,0.65))',
        }}
      />

      {/* 4. Moving Chained House Banners */}
      {LOOP_HOUSES.map((house, index) => {
        // Continuous loop coordinate s in [0, 8)
        let s = (index + stepOffset) % 8;
        if (s < 0) s += 8;

        let isLeft = true;
        let p = 0; // vertical slot index [0..3]
        let opacity = 1;
        let scale = 1;

        if (s <= 3.0) {
          // --- REGION 1: LEFT COLUMN (Angle A: Warwick -> Angle C: Eyras) ---
          // Direction: Downward when scrolling down
          isLeft = true;
          p = s; // 0 (top: Warwick) down to 3 (bottom: Eyras)
          opacity = 1;
          scale = 1;
        } else if (s < 4.0) {
          // --- REGION 2: BOTTOM SCREEN WRAP (Angle C: Eyras -> Angle D: Blackfort) ---
          if (s < 3.5) {
            // First half: Angle C (Eyras) reaches bottom edge and slowly disappears
            isLeft = true;
            const t = (s - 3.0) / 0.5;
            p = 3.0 + t * 0.7;
            opacity = Math.max(0, 1 - t);
            scale = 1 - t * 0.12;
          } else {
            // Second half: Reappears at bottom edge of Angle D (Blackfort) moving upward
            isLeft = false;
            const t = (s - 3.5) / 0.5;
            p = 3.0 + (1 - t) * 0.7;
            opacity = Math.min(1, t);
            scale = 0.88 + t * 0.12;
          }
        } else if (s <= 7.0) {
          // --- REGION 3: RIGHT COLUMN (Angle D: Blackfort -> Angle B: Thornhill) ---
          // Direction: Upward when scrolling down
          isLeft = false;
          p = 7.0 - s; // from 3 (bottom: Blackfort) up to 0 (top: Thornhill)
          opacity = 1;
          scale = 1;
        } else {
          // --- REGION 4: TOP SCREEN WRAP (Angle B: Thornhill -> Angle A: Warwick) ---
          if (s < 7.5) {
            // First half: Angle B (Thornhill) reaches top edge and slowly disappears
            isLeft = false;
            const t = (s - 7.0) / 0.5;
            p = 0.0 - t * 0.7;
            opacity = Math.max(0, 1 - t);
            scale = 1 - t * 0.12;
          } else {
            // Second half: Reappears at top edge of Angle A (Warwick) moving downward
            isLeft = true;
            const t = (s - 7.5) / 0.5;
            p = 0.0 - (1 - t) * 0.7;
            opacity = Math.min(1, t);
            scale = 0.88 + t * 0.12;
          }
        }

        // Exact pixel top position on screen
        const topPx = topPadding + p * slotSpacing;

        return (
          <div
            key={house.id}
            onClick={() => openHouseModal(house.id)}
            style={{
              top: `${topPx}px`,
              left: isLeft ? (isDesktop ? '242px' : 'clamp(8px, 2.5vw, 42px)') : 'auto',
              right: !isLeft ? 'clamp(8px, 2.5vw, 42px)' : 'auto',
              opacity: Math.max(0, Math.min(1, opacity)),
              transform: `scale(${scale})`,
              transition: 'opacity 0.06s linear, transform 0.06s ease-out',
            }}
            className="absolute z-10 w-20 sm:w-24 md:w-28 flex flex-col items-center pointer-events-auto cursor-pointer group"
          >
            {/* Hanging Banner Container */}
            <div className="relative w-full aspect-[120/143] filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] group-hover:scale-108 group-hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all duration-300">
              <img
                src={house.img}
                alt={`House ${house.name} Chained Banner`}
                className="w-full h-full object-contain pixel-art select-none"
                draggable={false}
              />

              {/* Faction Hover Glow Badge */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${house.color} opacity-0 group-hover:opacity-25 rounded-lg transition-opacity pointer-events-none`}
              />
            </div>

            {/* Angle Indicator Tag (Angle A to D basis) */}
            <div className="mt-1 px-1.5 py-0.5 rounded bg-cambria-950/90 border border-amber-500/40 text-[9px] font-mono text-amber-300 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
              {house.angleLabel ? `${house.angleLabel} • ${house.name}` : house.name}
            </div>
          </div>
        );
      })}

      {/* 5. Ambient Visual Screen Wrap Glow Arcs */}
      {/* Bottom Screen Wrap Arc (Angle C Eyras -> Angle D Blackfort) */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-amber-500/25 via-amber-500/5 to-transparent pointer-events-none flex justify-center items-center">
        <div className="text-[10px] uppercase font-mono tracking-widest text-amber-400/40 opacity-70">
          • SCREEN WRAP (ANGLE C → ANGLE D) •
        </div>
      </div>

      {/* Top Screen Wrap Arc (Angle B Thornhill -> Angle A Warwick) */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-amber-500/25 via-amber-500/5 to-transparent pointer-events-none flex justify-center items-center">
        <div className="text-[10px] uppercase font-mono tracking-widest text-amber-400/40 opacity-70">
          • SCREEN WRAP (ANGLE B → ANGLE A) •
        </div>
      </div>
    </div>
  );
};

export default AnimatedChainedBackground;
