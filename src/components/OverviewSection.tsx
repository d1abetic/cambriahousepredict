import React from 'react';

// Live stats are hidden until epochs launch
const STAT_LABELS = ['Total Silver Pool', 'Active Predictions', 'Current Crown Lead', 'Active Chambers'];

export const OverviewSection: React.FC = () => {
  return (
    <section className="mb-10 text-center relative overflow-hidden rounded-2xl bg-cambria-900/70 backdrop-blur-md p-8 sm:p-12 royal-border shadow-2xl transition-all">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_75%)] pointer-events-none" />

      {/* Live Round Badge & Timer */}
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-6 shadow-md backdrop-blur-sm tracking-wide">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block"></span>
        <i className="fa-regular fa-clock text-amber-400"></i>
        <span>EPOCH ROUNDS GO LIVE AT LAUNCH</span>
      </div>

      {/* Header Titles */}
      <h1 className="mb-3">
        <img
          src="/images/cambria_genesis_mmp_logo.png"
          alt="Cambria Genesis Multi-Market Prediction"
          className="mx-auto w-full max-w-[260px] sm:max-w-[360px] lg:max-w-[420px] h-auto drop-shadow-[0_6px_14px_rgba(0,0,0,0.75)] select-none"
          draggable={false}
        />
      </h1>
      <p className="text-sm sm:text-lg font-semibold text-amber-200/90 mb-6 font-medieval tracking-widest drop-shadow uppercase">
        8 NOBLE HOUSES • 7 REGIONAL CITIES • FREEBORN DISRUPTION
      </p>

      {/* Concept A Architecture Overview */}
      <div className="max-w-3xl mx-auto mb-8 bg-cambria-950/70 border border-cambria-800 rounded-xl p-5 sm:p-6 backdrop-blur-md shadow-inner text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-cambria-900/60 border border-amber-500/30">
            <span className="text-amber-400 font-bold block mb-1">CHAMBER I: CROWN SEAT</span>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              Main market: predict which of the 8 Noble Houses claims the Crown Throne in Capital City.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-cambria-900/60 border border-cyan-500/30">
            <span className="text-cyan-400 font-bold block mb-1">CHAMBER II: TURF WARS</span>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              7 concurrent sub-markets for Dreadfort, Thorin&apos;s Peak, Mirewick, and regional city offices.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-cambria-900/60 border border-rose-500/30">
            <span className="text-rose-400 font-bold block mb-1">CHAMBER III: FREEBORN</span>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              High-multiplier upset pool: wager if unaligned Freeborn settlers strip power from nobility.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-cambria-950/75 p-4 rounded-xl border border-cambria-700/70 text-left backdrop-blur-md shadow-lg">
        {STAT_LABELS.map((label) => (
          <div key={label}>
            <span className="text-xs text-gray-400 block mb-1">{label}</span>
            <span className="text-[11px] sm:text-xs font-bold text-amber-400/90 font-mono uppercase tracking-wide leading-snug block">
              Available on live epochs
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OverviewSection;
