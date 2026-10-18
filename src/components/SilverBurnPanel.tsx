import React, { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';

interface SilverBurnPanelProps {
  houseId: string;
  houseName: string;
}

export const SilverBurnPanel: React.FC<SilverBurnPanelProps> = ({ houseId, houseName }) => {
  const { userSilverBalance, userPrediction, submitPrediction, showToast } = useWallet();
  const [burnAmount, setBurnAmount] = useState<number | ''>('');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  // Reset inputs whenever the selected house modal opens/changes
  useEffect(() => {
    setBurnAmount('');
    setAgreedToTerms(false);
  }, [houseId]);

  const isAlreadyPredicted = Boolean(userPrediction);
  const isThisHousePredicted = userPrediction?.houseId === houseId;

  const handleBurn = () => {
    if (!agreedToTerms) {
      showToast('You must agree to the Terms of Service before confirming your burn.', 'error');
      return;
    }

    if (burnAmount === '' || isNaN(Number(burnAmount)) || Number(burnAmount) <= 0) {
      showToast('Please enter an amount of Silver to burn.', 'error');
      return;
    }

    submitPrediction(houseId, Number(burnAmount));
  };

  const handleQuickSelect = (amt: number) => {
    const clamped = Math.min(Math.max(amt, 20000), Math.min(1000000, userSilverBalance));
    setBurnAmount(clamped);
  };

  const isBurnDisabled = !agreedToTerms || burnAmount === '' || Number(burnAmount) < 20000;

  return (
    <div className="bg-cambria-950 p-5 rounded-xl border border-amber-500/30 space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-white flex items-center space-x-2">
          <i className="fa-solid fa-fire text-amber-500"></i>
          <span>Burn Silver to Predict Royal Crown</span>
        </label>
        <span className="text-xs text-gray-400">Min: 20,000 | Max: 1,000,000</span>
      </div>

      {isAlreadyPredicted ? (
        <div className="bg-cambria-900/90 border border-amber-500/40 p-4 rounded-lg text-center space-y-1">
          <div className="text-amber-400 font-bold text-sm flex items-center justify-center space-x-2">
            <i className="fa-solid fa-lock"></i>
            <span>
              {isThisHousePredicted
                ? `You have pledged ${userPrediction?.amount.toLocaleString()} Silver to House ${houseName}`
                : `Prediction Locked: You have already backed another House this round.`}
            </span>
          </div>
          <p className="text-xs text-gray-400">Predictions cannot be modified once confirmed until Epoch #04 resolves.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-grow">
              <input
                type="number"
                min="20000"
                max="1000000"
                step="1000"
                value={burnAmount}
                placeholder="INPUT AMOUNT TO BURN"
                onChange={(e) => {
                  const val = e.target.value;
                  setBurnAmount(val === '' ? '' : Number(val));
                }}
                className="w-full bg-cambria-900 border border-cambria-700 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-amber-500 text-base placeholder:text-gray-500 placeholder:text-xs sm:placeholder:text-sm placeholder:font-sans placeholder:tracking-wider placeholder:opacity-60"
              />
              <span className="absolute right-4 top-3.5 text-xs text-gray-400 font-semibold pointer-events-none">
                SILVER
              </span>
            </div>
            <button
              onClick={handleBurn}
              disabled={isBurnDisabled}
              className={`font-bold px-6 py-3 rounded-lg shadow-lg text-sm uppercase tracking-wider whitespace-nowrap flex items-center justify-center space-x-2 transition ${
                isBurnDisabled
                  ? 'bg-cambria-800 text-gray-500 cursor-not-allowed border border-cambria-700 opacity-60'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-cambria-950 cursor-pointer transform active:scale-95 shadow-amber-500/20'
              }`}
            >
              <i className="fa-solid fa-fire"></i>
              <span>Confirm Burn</span>
            </button>
          </div>

          {/* Quick presets (none selected by default) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider">Presets:</span>
            {[20000, 50000, 100000, 250000, 500000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleQuickSelect(preset)}
                className={`text-xs px-2.5 py-1 rounded border font-mono transition cursor-pointer ${
                  burnAmount === preset
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-cambria-900 border-cambria-700 text-gray-300 hover:border-amber-500/40 hover:text-white'
                }`}
              >
                {(preset / 1000).toLocaleString()}k
              </button>
            ))}
          </div>

          {/* Required Terms of Service Checkbox */}
          <div className="pt-2 border-t border-cambria-800/80">
            <label className="flex items-start sm:items-center space-x-2.5 text-xs text-gray-300 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 sm:mt-0 w-4 h-4 rounded border-cambria-700 bg-cambria-900 text-amber-500 focus:ring-amber-500/40 cursor-pointer accent-amber-500 flex-shrink-0"
              />
              <span className="group-hover:text-gray-200 transition-colors">
                I agree to the <span className="text-amber-400 underline hover:text-amber-300 font-medium">Terms of Service</span> and acknowledge predictions are final upon confirmation.
              </span>
            </label>
          </div>

          <p className="text-xs text-amber-300/80 italic flex items-center space-x-1">
            <i className="fa-solid fa-triangle-exclamation mr-1 text-amber-400 flex-shrink-0"></i>
            <span>Warning: Predictions are permanently locked once confirmed. 1 House only per round.</span>
          </p>
        </>
      )}
    </div>
  );
};

export default SilverBurnPanel;
