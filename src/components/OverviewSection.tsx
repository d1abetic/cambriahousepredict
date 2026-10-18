import React from 'react';

export const OverviewSection: React.FC = () => {
  return (
    <section className="mb-12 text-center relative overflow-hidden rounded-2xl bg-cambria-900/70 backdrop-blur-md p-8 sm:p-12 royal-border shadow-2xl transition-all">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_75%)] pointer-events-none" />

      {/* Live Round Badge & Timer */}
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-6 shadow-md backdrop-blur-sm tracking-wide">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block"></span>
        <i className="fa-regular fa-clock text-amber-400"></i>
        <span>FIRST EPOCH ROUND LIVE SOON</span>
      </div>

      {/* Header Titles */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-medieval mb-3 drop-shadow-md">
        Cambria Genesis <span className="gold-gradient-text">Prediction</span>
      </h1>
      <p className="text-lg sm:text-2xl font-semibold text-amber-200/90 mb-4 font-medieval tracking-wide drop-shadow uppercase">
        8 FACTION, ONE ROYALTY
      </p>
      {/* Slogan Bullet Pointed Order */}
      <div className="max-w-2xl mx-auto mb-8 bg-cambria-950/70 border border-cambria-800 rounded-xl p-5 sm:p-6 backdrop-blur-md shadow-inner text-left">
        <ul className="space-y-3 sm:space-y-3.5">
          <li className="flex items-start space-x-3 text-xs sm:text-sm font-semibold text-gray-200 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
            <span>CHOOSE WHICH OF THE 8 NOBLE HOUSE WILL BE RENOUNCED AS ROYALTY .</span>
          </li>
          <li className="flex items-start space-x-3 text-xs sm:text-sm font-semibold text-gray-200 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
            <span>SUBMIT YOUR DESIRED SILVER AMOUNT TO BURN.</span>
          </li>
          <li className="flex items-start space-x-3 text-xs sm:text-sm font-semibold text-gray-200 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
            <span>YOU CAN SUBMIT PREDICTION TO EITHER BACK YOUR OWN HOUSE OR OTHER FACTIONS</span>
          </li>
          <li className="flex items-start space-x-3 text-xs sm:text-sm font-semibold text-gray-200 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
            <span>YOUR BURNED SILVER WILL TURN INTO A SHARE FROM THE PRIZE POOL AT THE END OF AN EPOCH.</span>
          </li>
        </ul>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-cambria-950/75 p-4 rounded-xl border border-cambria-700/70 text-left backdrop-blur-md shadow-lg">
        <div>
          <span className="text-xs text-gray-400 block mb-1">Total Silver Burned</span>
          <span className="text-lg sm:text-xl font-bold text-amber-400 font-mono flex items-center space-x-1.5">
            <i className="fa-solid fa-fire text-amber-500 text-sm"></i>
            <span>0</span>
          </span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block mb-1">Active Predictors</span>
          <span className="text-lg sm:text-xl font-bold text-white font-mono flex items-center space-x-1.5">
            <i className="fa-solid fa-users text-blue-400 text-sm"></i>
            <span>0</span>
          </span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block mb-1">Current House Royalty Holder</span>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm sm:text-base font-bold text-gray-400 font-mono italic">
              No History
            </span>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-400 block mb-1">Reward Pool Format</span>
          <span className="text-base sm:text-lg font-bold text-amber-400 font-mono flex items-center space-x-1.5 mt-0.5">
            <i className="fa-solid fa-gem text-amber-400 text-xs"></i>
            <span>TBD</span>
          </span>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
