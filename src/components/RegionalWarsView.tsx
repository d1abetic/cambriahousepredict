import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useBuffer } from '@/context/BufferContext';

export const RegionalWarsView: React.FC = () => {
  const {
    regionalCities,
    selectedCityId,
    setSelectedCityId,
    selectedCity,
    submitRegionalPrediction,
    houses,
    allPredictions,
    showToast,
  } = useWallet();
  const { triggerBuffer } = useBuffer();

  const [selectedContenderId, setSelectedContenderId] = useState<string>('');
  const [burnAmount, setBurnAmount] = useState<number | ''>(20000);
  const [isWagering, setIsWagering] = useState<boolean>(false);

  const handleCitySelect = async (id: string) => {
    if (id === selectedCityId) return;
    const target = regionalCities.find((c) => c.id === id);
    await triggerBuffer(200, `Loading regional telemetry for ${target?.name}...`);
    setSelectedCityId(id);
    setSelectedContenderId('');
  };

  const handleConfirmRegionalWager = async () => {
    if (!selectedContenderId) {
      showToast('Please select a contending House to back for this City Office.', 'error');
      return;
    }

    if (burnAmount === '' || isNaN(Number(burnAmount)) || Number(burnAmount) < 20000) {
      showToast('Prediction must be between 20,000 and 1,000,000 Silver.', 'error');
      return;
    }

    setIsWagering(true);
    await triggerBuffer(
      450,
      `Pledging ${Number(burnAmount).toLocaleString()} Silver for House in ${selectedCity.name}...`
    );
    const success = submitRegionalPrediction(selectedCityId, selectedContenderId, Number(burnAmount));
    setIsWagering(false);
    if (success) {
      setSelectedContenderId('');
    }
  };

  // Check if player already made a bet in this specific city
  const cityPredictions = allPredictions.filter(
    (p) => p.chamber === 'regional' && p.targetId.startsWith(selectedCityId)
  );

  return (
    <section className="space-y-8 animate-in fade-in duration-300">
      {/* Chamber Header Banner */}
      <div className="relative bg-cambria-900/85 backdrop-blur-md rounded-2xl royal-border p-6 sm:p-8 shadow-2xl overflow-hidden border border-cyan-500/40">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-amber-500/10 pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-widest mb-3">
            <i className="fa-solid fa-map-location-dot text-cyan-400"></i>
            <span>7 CONCURRENT REGIONAL SUB-MARKETS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-medieval text-white tracking-wide mb-2">
            Regional City Turf Wars
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
            In New Cambria, Houses compete in real time for territorial <strong>City Offices</strong> by cashing in
            Artifacts, fulfilling craft quotas, and paying city taxes. Predict which noble house will capture each
            tactical stronghold at epoch close!
          </p>
        </div>
      </div>

      {/* City Navigation Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        {regionalCities.map((city) => {
          const isSelected = city.id === selectedCityId;
          const isTopPriority = ['dreadfort', 'thorins-peak', 'mirewick'].includes(city.id);

          return (
            <button
              key={city.id}
              onClick={() => handleCitySelect(city.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer flex items-center space-x-2 border ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                  : 'bg-cambria-950/80 hover:bg-cambria-900 text-gray-300 hover:text-white border-cambria-800'
              }`}
            >
              <i className={`fa-solid ${city.icon} ${isSelected ? 'text-white' : 'text-cyan-400'}`}></i>
              <span>{city.name}</span>
              {isTopPriority && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected City Command Deck */}
      <div className="bg-cambria-900/90 backdrop-blur-xl rounded-2xl royal-border border border-cyan-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* City Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cambria-800/80">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded font-bold border ${
                  selectedCity.riskLevel === 'T5 High-Risk'
                    ? 'bg-red-500/20 text-red-300 border-red-500/50'
                    : selectedCity.riskLevel === 'Crown Protected'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                }`}
              >
                <i className="fa-solid fa-triangle-exclamation mr-1 text-[9px]"></i>
                {selectedCity.riskLevel}
              </span>
              <span className="text-xs text-gray-400 font-mono">{selectedCity.region}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-medieval text-white flex items-center space-x-3">
              <i className={`fa-solid ${selectedCity.icon} text-cyan-400 text-2xl`}></i>
              <span>{selectedCity.name}</span>
            </h3>

            <p className="text-xs text-gray-300 max-w-2xl mt-2 leading-relaxed">
              {selectedCity.tacticalLore}
            </p>
          </div>

          <div className="bg-cambria-950/90 p-4 rounded-xl border border-cyan-500/30 flex-shrink-0 text-left md:text-right">
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">
              TOTAL CITY WAGER POOL
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-300 flex items-center md:justify-end space-x-1.5 mt-0.5">
              <i className="fa-solid fa-coins text-amber-400 text-sm"></i>
              <span>0 Silver</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-mono block mt-1">
              Live Leader: N/A
            </span>
          </div>
        </div>

        {/* Territory Dominance Influence Bar */}
        <div className="my-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-300 flex items-center space-x-1.5">
              <i className="fa-solid fa-chart-pie text-cyan-400"></i>
              <span>CURRENT TERRITORIAL INFLUENCE FEED</span>
            </span>
            <span className="text-gray-500 text-[11px]">Updated every 15 min</span>
          </div>

          {/* Segmented Bar */}
          <div className="w-full h-4 rounded-lg bg-cambria-950 overflow-hidden flex shadow-inner border border-cambria-800">
            {selectedCity.influenceBreakdown.map((item, idx) => {
              const house = houses.find((h) => h.id === item.houseId);
              const colors = [
                'bg-red-600',
                'bg-amber-600',
                'bg-cyan-600',
                'bg-emerald-600',
                'bg-purple-600',
              ];
              const barColor = colors[idx % colors.length];

              return (
                <div
                  key={item.houseId}
                  className={`${barColor} h-full transition-all duration-500 relative group`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.houseName}: ${item.percentage}%`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono">
            {selectedCity.influenceBreakdown.map((item, idx) => {
              const house = houses.find((h) => h.id === item.houseId);
              const dotColors = [
                'bg-red-500',
                'bg-amber-500',
                'bg-cyan-500',
                'bg-emerald-500',
                'bg-purple-500',
              ];

              return (
                <div key={item.houseId} className="flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${dotColors[idx % dotColors.length]}`}></span>
                  <span className="text-gray-300 font-bold">{item.houseName}</span>
                  <span className="text-amber-400">({item.percentage}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Existing user bets in this city */}
        {cityPredictions.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono space-y-1">
            <span className="text-cyan-300 font-bold flex items-center space-x-1.5">
              <i className="fa-solid fa-lock text-xs"></i>
              <span>Your Active Wagers for {selectedCity.name}:</span>
            </span>
            {cityPredictions.map((pred) => (
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

        {/* Contending Factions Grid for this City */}
        <div className="space-y-4 pt-4 border-t border-cambria-800/80">
          <div className="flex items-center justify-between">
            <h4 className="text-base sm:text-lg font-bold font-medieval text-white">
              Back a House to Seize {selectedCity.name} Office
            </h4>
            <span className="text-xs text-gray-400 font-mono">
              Balance: <strong className="text-amber-400">0</strong> Silver
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedCity.influenceBreakdown.map((item) => {
              const house = houses.find((h) => h.id === item.houseId);
              const isSelected = selectedContenderId === item.houseId;
              const oddsMultiplier = Number(
                Math.max(1.4, Math.min(6.0, (100 / item.percentage) * 0.9)).toFixed(2)
              );

              return (
                <div
                  key={item.houseId}
                  onClick={() => setSelectedContenderId(item.houseId)}
                  className={`bg-cambria-950/80 rounded-xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-400 ring-2 ring-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] bg-cambria-900'
                      : 'border-cambria-800 hover:border-cyan-500/40 hover:bg-cambria-900/60'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-cambria-900 border border-cambria-700 flex items-center justify-center p-1 flex-shrink-0 overflow-hidden">
                      {house?.image ? (
                        <img
                          src={house.image}
                          alt={item.houseName}
                          className="w-full h-full object-contain pixel-art drop-shadow"
                        />
                      ) : (
                        <i className={`fa-solid ${house?.icon || 'fa-shield'} text-amber-400 text-sm`}></i>
                      )}
                    </div>
                    <div>
                      <h5 className="font-medieval font-bold text-white text-sm">
                        House {item.houseName}
                      </h5>
                      <span className="text-[10px] font-mono text-cyan-300 font-semibold block">
                        {item.percentage}% Influence
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-cambria-800/60 text-xs font-mono">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Odds Multiplier:</span>
                      <span className="text-emerald-400 font-bold">{oddsMultiplier}x</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <span>Silver Backed:</span>
                      <span className="text-amber-400 font-semibold">0</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`mt-3 w-full py-1.5 rounded-lg text-xs font-mono font-bold transition uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500 text-cambria-950 shadow-md'
                        : 'bg-cambria-800/80 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    <i className="fa-solid fa-check text-[10px]"></i>
                    <span>{isSelected ? 'Selected' : 'Select House'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Burn Panel for Selected Contender */}
          {selectedContenderId && (
            <div className="mt-6 p-5 rounded-xl bg-cambria-950 border border-cyan-500/50 animate-in fade-in zoom-in-95 duration-150 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
                    Confirm Regional Prediction
                  </span>
                  <p className="text-sm text-white font-medieval font-bold">
                    Backing House {houses.find((h) => h.id === selectedContenderId)?.name} to capture{' '}
                    {selectedCity.name} City Office
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedContenderId('')}
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
                    className="w-full bg-cambria-900 border border-cambria-700 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-cyan-400 text-base"
                    placeholder="AMOUNT TO BURN"
                  />
                  <span className="absolute right-4 top-3.5 text-xs text-gray-400 font-semibold pointer-events-none">
                    SILVER
                  </span>
                </div>

                <button
                  onClick={handleConfirmRegionalWager}
                  disabled={isWagering || burnAmount === '' || Number(burnAmount) < 20000}
                  className="font-bold px-6 py-3 rounded-lg shadow-lg text-xs uppercase tracking-wider whitespace-nowrap flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white cursor-pointer transition disabled:opacity-50"
                >
                  {isWagering ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                      <span>Locking Wager...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-fire text-amber-400"></i>
                      <span>Lock Regional Prediction</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-gray-400 uppercase font-mono">Presets:</span>
                {[20000, 50000, 100000, 250000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBurnAmount(preset)}
                    className={`text-xs px-2.5 py-1 rounded border font-mono transition cursor-pointer ${
                      burnAmount === preset
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-cambria-900 border-cambria-700 text-gray-300 hover:border-cyan-500/40 hover:text-white'
                    }`}
                  >
                    {(preset / 1000).toLocaleString()}k
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RegionalWarsView;
