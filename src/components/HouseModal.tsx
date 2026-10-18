import React, { useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import SilverBurnPanel from './SilverBurnPanel';
import { CHARTER_REVEALED_COUNTS } from '@/data/mockHouses';

export const HouseModal: React.FC = () => {
  const { selectedHouse, closeHouseModal } = useWallet();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeHouseModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeHouseModal]);

  if (!selectedHouse) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeHouseModal();
      }}
    >
      <div className="bg-cambria-900 border-2 border-amber-500/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-cambria-800/90 via-cambria-900 to-cambria-950 border-b border-cambria-700 relative">
          <button
            onClick={closeHouseModal}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-cambria-950/80 border border-cambria-700 hover:border-amber-500 hover:bg-amber-600 hover:text-cambria-950 text-gray-300 flex items-center justify-center transition cursor-pointer shadow-lg z-10"
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Full Ornate House Crest Display */}
            <div className="w-28 h-32 sm:w-32 sm:h-36 rounded-xl bg-cambria-950 border-2 border-amber-500/50 flex items-center justify-center p-2 shadow-2xl relative overflow-hidden flex-shrink-0">
              <div className={`absolute inset-0 bg-gradient-to-t ${selectedHouse.color} opacity-20`} />
              {selectedHouse.image ? (
                <img
                  src={selectedHouse.image}
                  alt={`House ${selectedHouse.name} crest`}
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] pixel-art"
                />
              ) : (
                <i className={`fa-solid ${selectedHouse.icon} text-4xl text-amber-400`}></i>
              )}
            </div>

            <div className="text-center sm:text-left flex-grow">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="text-xs uppercase font-semibold tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                  CAPITAL: UNDEFINED
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-medieval text-white tracking-wide">
                House {selectedHouse.name}
              </h2>
              <p className="text-xs text-gray-400 mt-1 flex items-center justify-center sm:justify-start space-x-1.5 font-mono">
                <i className="fa-solid fa-vault text-amber-400"></i>
                <span>Treasury: 0</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* New Container: Times Renounced & Consistent Streak Indicator */}
          <div className="bg-cambria-950/70 p-4 rounded-xl border border-cambria-800 grid grid-cols-1 sm:grid-cols-2 gap-3.5 shadow-inner">
            <div className="flex items-center space-x-3.5 bg-cambria-900/70 p-3.5 rounded-lg border border-cambria-800/80">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-sm">
                <i className="fa-solid fa-scroll text-sm"></i>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 block font-medium uppercase tracking-wider">
                  Times Renounced
                </span>
                <span className="text-base font-bold text-white font-mono">
                  {selectedHouse.timesRenounced ?? 0}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 bg-cambria-900/70 p-3.5 rounded-lg border border-cambria-800/80">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-sm">
                <i className="fa-solid fa-fire text-sm"></i>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 block font-medium uppercase tracking-wider">
                  Consistent Streak
                </span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {selectedHouse.consistentStreak ?? 0} Epochs
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid inside Modal */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
            <div className="bg-cambria-950 p-3.5 rounded-lg border border-cambria-800 flex flex-col justify-center">
              <span className="text-xs text-gray-400 block mb-1">Total Revealed</span>
              <span className="text-base font-bold text-white font-mono">
                {(CHARTER_REVEALED_COUNTS[selectedHouse.id] ?? selectedHouse.totalRevealed ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="bg-cambria-950 p-3.5 rounded-lg border border-cambria-800 flex flex-col justify-center">
              <span className="text-xs text-gray-400 block mb-1">Total Players</span>
              <span className="text-xs sm:text-sm font-bold text-amber-300 font-mono tracking-tight uppercase">
                NO DATA COLLECTED YET
              </span>
            </div>
            <div className="bg-cambria-950 p-3.5 rounded-lg border border-cambria-800 flex flex-col justify-center">
              <span className="text-xs text-gray-400 block mb-1">Registered Guilds</span>
              <span className="text-base font-bold text-amber-400 font-mono uppercase">NONE</span>
            </div>
            <div className="bg-cambria-950 p-3.5 rounded-lg border border-cambria-800 flex flex-col justify-center">
              <span className="text-xs text-gray-400 block mb-1">Accumulated Silver Burned</span>
              <span className="text-lg font-bold text-amber-400 font-mono">
                {(selectedHouse.silver || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Silver Burn Interface */}
          <SilverBurnPanel houseId={selectedHouse.id} houseName={selectedHouse.name} />
        </div>
      </div>
    </div>
  );
};

export default HouseModal;
