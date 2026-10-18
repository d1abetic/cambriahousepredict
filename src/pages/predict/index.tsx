import React from 'react';
import Header from '@/components/Header';
import OverviewSection from '@/components/OverviewSection';
import HouseGrid from '@/components/HouseGrid';
import HowItWorksSection from '@/components/HowItWorksSection';
import HouseModal from '@/components/HouseModal';

export default function PredictPlayerPage() {
  return (
    <>
      <Header currentView="player" />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="space-y-12">
          {/* SECTION 1: OVERVIEW */}
          <OverviewSection />

          {/* SECTION 2: 8 HOUSES GRID */}
          <HouseGrid />

          {/* SECTION 3: HOW IT WORKS & PREDICTION MECHANICS */}
          <HowItWorksSection />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-cambria-800 bg-cambria-900/60 py-8 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-medieval tracking-widest text-amber-400/80">
            CAMBRIA GENESIS • ON-CHAIN MMORPG PREDICTION PROTOCOL
          </p>
          <p>
            Independent community proposal built for BEN.ZZZ &amp; Team. Powered by mock data adapter ready for game API
            integration.
          </p>
          <p className="text-gray-500">&copy; 2026 New Cambria. All rights reserved.</p>
        </div>
      </footer>

      {/* Modal Dialog for Prediction and House Info */}
      <HouseModal />
    </>
  );
}
