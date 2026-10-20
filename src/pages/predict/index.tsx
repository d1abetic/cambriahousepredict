import React from 'react';
import Header from '@/components/Header';
import OverviewSection from '@/components/OverviewSection';
import ChamberTabs from '@/components/ChamberTabs';
import HouseGrid from '@/components/HouseGrid';
import RegionalWarsView from '@/components/RegionalWarsView';
import FreebornDisruptionView from '@/components/FreebornDisruptionView';
import HowItWorksSection from '@/components/HowItWorksSection';
import HouseModal from '@/components/HouseModal';
import ActivePredictionsDrawer from '@/components/ActivePredictionsDrawer';
import { useWallet } from '@/context/WalletContext';

export default function PredictPlayerPage() {
  const { activeChamber } = useWallet();

  return (
    <>
      <Header currentView="player" />

      {/* Main Container */}
      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:pl-[128px] lg:pr-[128px] pt-20 pb-12 w-full">
        <div className="space-y-10">
          {/* SECTION 1: OVERVIEW & STATS */}
          <OverviewSection />

          {/* SECTION 2: MULTI-CHAMBER NAVIGATION TABS */}
          <ChamberTabs />

          {/* SECTION 3: ACTIVE MARKET CHAMBER VIEW */}
          {activeChamber === 'crown' && <HouseGrid />}
          {activeChamber === 'regional' && <RegionalWarsView />}
          {activeChamber === 'freeborn' && <FreebornDisruptionView />}

          {/* SECTION 4: HOW IT WORKS & PREDICTION MECHANICS */}
          <HowItWorksSection />
        </div>
      </main>

      {/* Fixed Drawer for Player's Locked Predictions across all chambers */}
      <ActivePredictionsDrawer />

      {/* FOOTER */}
      <footer className="mt-auto border-t border-cambria-800 bg-cambria-900/60 py-8 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-medieval tracking-widest text-amber-400/80">
            CAMBRIA GENESIS • ON-CHAIN MMORPG PREDICTION PROTOCOL
          </p>
          <p>
            Independent community proposal built for BEN.ZZZ &amp; Team. Multi-Chamber Prediction Market (Concept A).
          </p>
          <p className="text-gray-500">&copy; 2026 New Cambria. All rights reserved.</p>
        </div>
      </footer>

      {/* Modal Dialog for Prediction and House Info */}
      <HouseModal />
    </>
  );
}
