import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useBuffer } from '@/context/BufferContext';

export const FreebornDisruptionView: React.FC = () => {
  const {
    freebornOptions,
    submitFreebornPrediction,
    userSilverBalance,
    allPredictions,
    showToast,
  } = useWallet();
  const { triggerBuffer } = useBuffer();

  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [burnAmount, setBurnAmount] = useState<number | ''>(20000);
  const [isWagering, setIsWagering] = useState<boolean>(false);

  const selectedOption = freebornOptions.find((o) => o.id === selectedOptionId);

  const handleConfirmFreebornWager = async () => {
    if (!selectedOptionId) {
      showToast('Please select a Freeborn Disruption outcome.', 'error');
      return;
    }

    if (burnAmount === '' || isNaN(Number(burnAmount)) || Number(burnAmount) < 20000) {
      showToast('Prediction must be between 20,000 and 1,000,000 Silver.', 'error');
      return;
    }

    setIsWagering(true);
    await triggerBuffer(
      450,
      `Pledging ${Number(burnAmount).toLocaleString()} Silver on "${selectedOption?.title}"...`
    );
    const success = submitFreebornPrediction(selectedOptionId, Number(burnAmount));
    setIsWagering(false);
    if (success) {
      setSelectedOptionId('');
    }
  };

  const freebornPredictions = allPredictions.filter((p) => p.chamber === 'freeborn');

  return (
    <section className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative bg-cambria-900/85 backdrop-blur-md rounded-2xl royal-border p-6 sm:p-8 shadow-2xl overflow-hidden border border-rose-500/40">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-transparent to-amber-500/10 pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono font-semibold uppercase tracking-widest mb-3">
            <i className="fa-solid fa-fire text-rose-400"></i>
            <span>HIGH-MULTIPLIER UPSET POOL</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-medieval text-white tracking-wide mb-2">
            The Freeborn Disruption
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
            In the Crown Ledger, settlers without noble charter allegiance are designated as{' '}
            <strong>Freeborn</strong>. Disillusioned by noble monopolies, the Freeborn mobilize to strip influence from
            ruling houses in regional capitals. Wager on high-odds dissident upsets or back ironclad noble supremacy!
          </p>
        </div>
      </div>

      {/* Existing user bets in Freeborn pool */}
      {freebornPredictions.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs font-mono space-y-1.5 shadow-lg">
          <span className="text-rose-300 font-bold flex items-center space-x-1.5">
            <i className="fa-solid fa-lock text-xs"></i>
            <span>Your Active Freeborn Disruption Wagers:</span>
          </span>
          {freebornPredictions.map((pred) => (
            <div key={pred.id} className="flex justify-between items-center text-gray-300 pl-4">
              <span>{pred.targetName}</span>
              <span className="text-amber-300 font-bold">
                {pred.amount.toLocaleString()} Silver ({pred.multiplier}x Multiplier →{' '}
                {pred.potentialPayout.toLocaleString()} Silver)
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Freeborn Upset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {freebornOptions.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <div
              key={option.id}
              onClick={() => setSelectedOptionId(option.id)}
              className={`bg-cambria-900/90 backdrop-blur-md rounded-2xl p-6 royal-border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                isSelected
                  ? 'border-rose-400 ring-2 ring-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.3)] bg-cambria-900 scale-[1.01]'
                  : 'border-cambria-800 hover:border-rose-500/40 hover:bg-cambria-900/70'
              }`}
            >
              {/* Top Row: Icon + Odds Badge */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cambria-950 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
                  <i className={`fa-solid ${option.icon}`}></i>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-mono font-extrabold uppercase tracking-wider shadow">
                    {option.multiplier}x Payout Odds
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono block mt-1">
                    TARGET: {option.targetFaction}
                  </span>
                </div>
              </div>

              {/* Title & Lore */}
              <div className="mb-4">
                <h3 className="text-lg sm:text-xl font-bold font-medieval text-white group-hover:text-rose-300 transition-colors">
                  {option.title}
                </h3>
                <span className="text-xs font-mono text-amber-400/90 font-semibold block mt-0.5">
                  {option.subtitle}
                </span>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  {option.description}
                </p>
              </div>

              {/* Stats & Select Button */}
              <div className="pt-4 border-t border-cambria-800/80 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">Total Burned</span>
                  <span className="text-[11px] font-bold font-mono text-amber-400 uppercase tracking-wide">
                    Available when live epoch started
                  </span>
                </div>

                <button
                  type="button"
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-lg'
                      : 'bg-cambria-800/80 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <i className="fa-solid fa-fire text-[10px]"></i>
                  <span>{isSelected ? 'Selected' : 'Select Upset'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prediction Burn Form for Selected Upset Option */}
      {selectedOption && (
        <div className="p-6 rounded-2xl bg-cambria-950 border border-rose-500/50 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cambria-800">
            <div>
              <span className="text-xs font-mono uppercase text-rose-400 font-bold block">
                Lock Freeborn Disruption Prediction
              </span>
              <p className="text-base text-white font-medieval font-bold">
                {selectedOption.title} ({selectedOption.multiplier}x Multiplier)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedOptionId('')}
              className="text-gray-400 hover:text-white text-xs font-mono cursor-pointer self-start sm:self-auto"
            >
              <i className="fa-solid fa-xmark mr-1"></i>
              <span>Cancel</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-grow">
              <input
                type="number"
                min="20000"
                max="1000000"
                step="1000"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-cambria-900 border border-cambria-700 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-rose-400 text-base"
                placeholder="AMOUNT TO BURN"
              />
              <span className="absolute right-4 top-3.5 text-xs text-gray-400 font-semibold pointer-events-none">
                SILVER
              </span>
            </div>

            <button
              onClick={handleConfirmFreebornWager}
              disabled={isWagering || burnAmount === '' || Number(burnAmount) < 20000}
              className="font-bold px-6 py-3 rounded-lg shadow-lg text-xs uppercase tracking-wider whitespace-nowrap flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white cursor-pointer transition disabled:opacity-50"
            >
              {isWagering ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                  <span>Locking Wager...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bolt text-amber-300"></i>
                  <span>
                    Lock Upset Bet (Est. Pay:{' '}
                    {burnAmount !== ''
                      ? Math.round(Number(burnAmount) * selectedOption.multiplier).toLocaleString()
                      : 0}
                    )
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-gray-400 uppercase font-mono">Presets:</span>
            {[20000, 50000, 100000, 250000, 500000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setBurnAmount(preset)}
                className={`text-xs px-2.5 py-1 rounded border font-mono transition cursor-pointer ${
                  burnAmount === preset
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                    : 'bg-cambria-900 border-cambria-700 text-gray-300 hover:border-rose-500/40 hover:text-white'
                }`}
              >
                {(preset / 1000).toLocaleString()}k
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default FreebornDisruptionView;
