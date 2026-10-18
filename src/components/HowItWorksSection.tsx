import React from 'react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="bg-cambria-900/80 backdrop-blur-md rounded-2xl royal-border p-6 sm:p-10 shadow-xl">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Mechanics &amp; Rules</span>
        <h2 className="text-3xl font-bold font-medieval mt-1 text-white">How Royal Prediction Works</h2>
        <p className="text-gray-400 text-sm mt-2">
          Designed for the permanent Genesis main version. Every week brings new rivalries, alliance shifts, and economic dominance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Frame 01 */}
        <div className="bg-cambria-950/70 p-6 rounded-xl border border-cambria-700 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-medieval mb-4 text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-white font-medieval mb-2 uppercase tracking-wide">
              CHOOSE &amp; BURN
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed uppercase">
              INSPECT THE 8 NOBLE HOUSES. BURN BETWEEN{' '}
              <strong className="text-amber-400 font-mono">20,000</strong> AND{' '}
              <strong className="text-amber-400 font-mono">1,000,000 SILVER</strong> PER PREDICTION. MINIMUM TO MAXIMUM
              BOUNDS PREVENT WHALE DOMINATION WHILE KEEPING STAKES HIGH.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-cambria-800 text-xs text-amber-300/80 flex items-center space-x-1 uppercase font-medium">
            <i className="fa-solid fa-lock mr-1"></i>
            <span>1 HOUSE ONLY PER ROUND. LOCKED ONCE SUBMITTED.</span>
          </div>
        </div>

        {/* Frame 02 */}
        <div className="bg-cambria-950/70 p-6 rounded-xl border border-cambria-700 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-medieval mb-4 text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-white font-medieval mb-2 uppercase tracking-wide">
              WEEKLY EPOCH RESOLUTION
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed uppercase">
              ROUNDS RUN IN RECURRING WEEKLY EPOCH CYCLES. AT EACH WEEKLY EPOCH CLOSE, THE PROTOCOL RECORDS WHICH NOBLE
              HOUSE REIGNS SUPREME BASED ON INTERNAL TREASURIES, GUILD INFLUENCE, AND ON-CHAIN ASSET HOLDINGS.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-cambria-800 text-xs text-amber-300/80 flex items-center space-x-1 uppercase font-medium">
            <i className="fa-solid fa-rotate mr-1"></i>
            <span>CONSISTENT REIGNING OR NEW CROWNS EACH WEEKLY EPOCH.</span>
          </div>
        </div>

        {/* Frame 03 */}
        <div className="bg-cambria-950/70 p-6 rounded-xl border border-cambria-700 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-medieval mb-4 text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-white font-medieval mb-2 uppercase tracking-wide">
              REWARD DISTRIBUTION
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed uppercase">
              PREDICTORS WHO BACKED THE CORRECT ROYAL HOUSE SHARE THE ACCUMULATED POOL. REWARDS ARE PROPORTIONED TO
              YOUR BURN SHARE AND FORMAT IS{' '}
              <strong className="text-amber-400 font-bold tracking-wider">NOT YET DECIDED</strong>.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-cambria-800 text-xs text-emerald-400 flex items-center space-x-1 uppercase font-medium">
            <i className="fa-solid fa-coins mr-1"></i>
            <span>SILVER BURNED IS PERMANENTLY REMOVED FROM CIRCULATION.</span>
          </div>
        </div>
      </div>

      {/* FAQ Accordion / Additional Info */}
      <div className="border-t border-cambria-800 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold text-white font-medieval mb-2 flex items-center space-x-2">
            <i className="fa-solid fa-circle-question text-amber-500"></i>
            <span>Can I change my house prediction mid-round?</span>
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            No. Once a prediction is confirmed, it is permanently locked for the active round. Players must wait for the
            next round to back a different house or double down on their faction.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white font-medieval mb-2 flex items-center space-x-2">
            <i className="fa-solid fa-circle-question text-amber-500"></i>
            <span>How are house treasuries and economic data kept?</span>
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            House economics (such as treasury holdings, resource donations, and asset net worth) remain hidden from
            general players during the round to maintain strategic depth. Admins and Nobility leaders can review these
            stats in the Admin View.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
