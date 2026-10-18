import React from 'react';
import { useWallet } from '@/context/WalletContext';
import { CHARTER_REVEALED_COUNTS } from '@/data/mockHouses';

export const HouseGrid: React.FC = () => {
  const { houses, openHouseModal, userPrediction } = useWallet();

  return (
    <section>
      {/* Header Container / Placement Frame */}
      <div className="relative bg-cambria-900/80 backdrop-blur-md rounded-xl royal-border p-6 sm:p-7 mb-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-amber-500/5 pointer-events-none" />

        <div className="text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-medieval text-white flex items-center justify-center space-x-2.5 uppercase tracking-wider drop-shadow">
            <i className="fa-solid fa-chess-rook text-amber-500 text-xl sm:text-2xl"></i>
            <span>THE EIGHT NOBLE HOUSES</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 uppercase tracking-wider mt-2 font-medium">
            CLICK ANY HOUSE BANNER TO INSPECT STATS, REVIEW GUILD ALLIANCES, AND BURN SILVER TO PREDICT.
          </p>
        </div>
      </div>

      {/* 2x2 / Responsive Grid for 8 Houses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {houses.map((house) => {
          const isUserPicked = userPrediction?.houseId === house.id;

          return (
            <div
              key={house.id}
              onClick={() => openHouseModal(house.id)}
              className={`bg-cambria-900/85 backdrop-blur-md rounded-xl royal-border p-5 flex flex-col justify-between card-glow cursor-pointer relative overflow-hidden group ${
                isUserPicked ? 'border-amber-500 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20' : ''
              }`}
            >
              {/* User Pick Badge if selected */}
              {isUserPicked && (
                <div className="flex justify-end w-full mb-3">
                  <span className="bg-amber-500 text-cambria-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                    <i className="fa-solid fa-crown text-[9px]"></i>
                    <span>Your Pick</span>
                  </span>
                </div>
              )}

              {/* Prominent House Crest Showcase */}
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gradient-to-b from-cambria-950/90 to-cambria-900/90 border border-cambria-800/80 group-hover:border-amber-500/40 transition-colors flex items-center justify-center p-3 mb-4 shadow-inner">
                {/* House Faction Backlight */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${house.color} opacity-15 group-hover:opacity-25 transition-opacity`}
                />
                {house.image ? (
                  <img
                    src={house.image}
                    alt={`House ${house.name} crest`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] group-hover:scale-105 group-hover:drop-shadow-[0_12px_24px_rgba(245,158,11,0.3)] transition-transform duration-300 pixel-art"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <i className={`fa-solid ${house.icon} text-4xl text-amber-400/80`}></i>
                )}
              </div>

              {/* Title (Mockup Lore description removed) */}
              <div className="mb-4">
                <h3 className="text-xl font-bold font-medieval text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>House {house.name}</span>
                  <i className="fa-solid fa-chevron-right text-xs text-cambria-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all"></i>
                </h3>
              </div>

              {/* Stats & Actions */}
              <div className="space-y-2.5 pt-3 border-t border-cambria-800/80 mt-auto">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 flex items-center space-x-1.5">
                    <i className="fa-solid fa-coins text-amber-400/80"></i>
                    <span>Accumulated Silver:</span>
                  </span>
                  <span className="font-mono font-bold text-amber-400">{(house.silver || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 flex items-center space-x-1.5">
                    <i className="fa-solid fa-users text-blue-400/80"></i>
                    <span>Total Revealed:</span>
                  </span>
                  <span className="font-mono text-white font-medium">
                    {(CHARTER_REVEALED_COUNTS[house.id] ?? house.totalRevealed ?? house.players).toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  className="w-full mt-2 py-2.5 bg-cambria-800/90 group-hover:bg-amber-600 group-hover:text-cambria-950 text-amber-300 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                >
                  <i className="fa-solid fa-fire-flame-curved text-[11px]"></i>
                  <span>Inspect &amp; Predict</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HouseGrid;
