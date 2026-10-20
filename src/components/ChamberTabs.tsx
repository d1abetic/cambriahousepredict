import React from 'react';
import { useWallet } from '@/context/WalletContext';
import { useBuffer } from '@/context/BufferContext';
import { MarketChamber } from '@/types';

export const ChamberTabs: React.FC = () => {
  const { activeChamber, setActiveChamber, regionalCities, freebornOptions, houses } = useWallet();
  const { triggerBuffer } = useBuffer();

  const crownTotalSilver = houses.reduce((acc, h) => acc + (h.silver || 0), 0);
  const regionalTotalSilver = regionalCities.reduce((acc, c) => acc + c.totalSilverBurned, 0);
  const freebornTotalSilver = freebornOptions.reduce((acc, o) => acc + o.totalSilverBurned, 0);

  const handleChamberChange = async (chamber: MarketChamber) => {
    if (chamber === activeChamber) return;
    const names: Record<MarketChamber, string> = {
      crown: 'Imperial Crown (Main Market)',
      regional: 'Regional City Turf Wars',
      freeborn: 'The Freeborn Disruption Pool',
    };
    await triggerBuffer(250, `Switching to ${names[chamber]}...`);
    setActiveChamber(chamber);
  };

  const chambers: {
    id: MarketChamber;
    title: string;
    badge: string;
    subtitle: string;
    icon: string;
    totalSilver: number;
    accentColor: string;
  }[] = [
    {
      id: 'crown',
      title: 'Chamber I: Imperial Crown',
      badge: 'Main Royalty Market',
      subtitle: 'Which House holds the Crown Seat in Capital City?',
      icon: 'fa-crown',
      totalSilver: crownTotalSilver,
      accentColor: 'border-amber-500 text-amber-400',
    },
    {
      id: 'regional',
      title: 'Chamber II: Regional Turf Wars',
      badge: '7 Concurrent Sub-Markets',
      subtitle: "Battle for Dreadfort, Thorin's Peak, Mirewick & more",
      icon: 'fa-shield-halved',
      totalSilver: regionalTotalSilver,
      accentColor: 'border-cyan-500 text-cyan-400',
    },
    {
      id: 'freeborn',
      title: 'Chamber III: Freeborn Disruption',
      badge: 'High-Multiplier Upset Pool',
      subtitle: 'Will unaligned citizens strip power from the noble houses?',
      icon: 'fa-fire-flame-curved',
      totalSilver: freebornTotalSilver,
      accentColor: 'border-rose-500 text-rose-400',
    },
  ];

  return (
    <div className="mb-8">
      {/* Container Frame */}
      <div className="bg-cambria-950/80 backdrop-blur-md p-2 rounded-2xl royal-border shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {chambers.map((chamber) => {
            const isActive = activeChamber === chamber.id;

            return (
              <button
                key={chamber.id}
                type="button"
                onClick={() => handleChamberChange(chamber.id)}
                className={`p-4 sm:p-5 rounded-xl text-left transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-b from-cambria-800/90 to-cambria-900/95 border-2 ' +
                      chamber.accentColor +
                      ' shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                    : 'bg-cambria-900/50 hover:bg-cambria-900/80 border border-cambria-800 hover:border-cambria-700 text-gray-400 hover:text-gray-200'
                }`}
              >
                {/* Active ambient glow */}
                {isActive && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold border ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-cambria-950 text-gray-400 border-cambria-800'
                    }`}
                  >
                    {chamber.badge}
                  </span>

                  <i
                    className={`fa-solid ${chamber.icon} text-sm transition-transform group-hover:scale-110 ${
                      isActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'text-gray-500'
                    }`}
                  ></i>
                </div>

                <h3
                  className={`text-base sm:text-lg font-bold font-medieval tracking-wide transition-colors ${
                    isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                  }`}
                >
                  {chamber.title}
                </h3>

                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {chamber.subtitle}
                </p>

                <div className="mt-3 pt-3 border-t border-cambria-800/80 text-xs font-mono">
                  <span className="text-gray-500 text-[11px] block">POOL ACCUMULATED:</span>
                  <span className="text-amber-400 font-bold text-[11px] uppercase tracking-wide block mt-0.5">
                    Available on live epochs
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChamberTabs;
