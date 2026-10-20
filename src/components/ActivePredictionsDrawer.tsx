import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';

export const ActivePredictionsDrawer: React.FC = () => {
  const { allPredictions, userSilverBalance } = useWallet();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (allPredictions.length === 0) return null;

  const totalBurned = allPredictions.reduce((acc, p) => acc + p.amount, 0);
  const totalPotentialPayout = allPredictions.reduce((acc, p) => acc + p.potentialPayout, 0);

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-md w-full animate-in slide-in-from-bottom-6 duration-300">
      <div className="bg-cambria-900/95 backdrop-blur-xl border border-amber-500/50 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] p-4 text-xs font-mono">
        {/* Header Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-white uppercase tracking-wider">
              Your Locked Wagers ({allPredictions.length})
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-amber-400 font-bold">
              {totalBurned.toLocaleString()} Silver Pledged
            </span>
            <i
              className={`fa-solid fa-chevron-up text-gray-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180 text-amber-400' : ''
              }`}
            ></i>
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-cambria-800/80 space-y-2.5 max-h-64 overflow-y-auto scrollbar-thin">
            {allPredictions.map((pred) => (
              <div
                key={pred.id}
                className="bg-cambria-950/80 p-3 rounded-xl border border-cambria-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                        pred.chamber === 'crown'
                          ? 'bg-amber-500/20 text-amber-300'
                          : pred.chamber === 'regional'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {pred.chamber}
                    </span>
                    <span className="font-bold text-white truncate max-w-[180px]">
                      {pred.targetName}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-0.5">
                    {pred.chamberTitle}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-gray-300 font-bold block">
                    {pred.amount.toLocaleString()} Silver
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    {pred.multiplier}x → {pred.potentialPayout.toLocaleString()} Silver
                  </span>
                </div>
              </div>
            ))}

            <div className="pt-2 border-t border-cambria-800 flex justify-between items-center text-[11px] text-gray-400">
              <span>Total Est. Payout:</span>
              <span className="text-emerald-300 font-bold text-xs">
                {totalPotentialPayout.toLocaleString()} Silver
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivePredictionsDrawer;
