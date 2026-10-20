import React, { useState } from 'react';
import Header from '@/components/Header';
import AdminOverview from '@/components/AdminOverview';
import AdminLoginModal, { AdminProfile } from '@/components/AdminLoginModal';
import HouseModal from '@/components/HouseModal';

export default function PredictAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeProfile, setActiveProfile] = useState<AdminProfile | undefined>(undefined);

  return (
    <>
      <Header currentView="admin" />

      {/* Main Container */}
      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:pl-[128px] lg:pr-[128px] pt-20 pb-12 w-full flex flex-col justify-center">
        {isAuthenticated ? (
          <AdminOverview
            adminProfile={activeProfile}
            onLockConsole={() => {
              setIsAuthenticated(false);
              setActiveProfile(undefined);
            }}
          />
        ) : (
          <div className="flex items-center justify-center min-h-[55vh] py-6 w-full">
            <AdminLoginModal
              onLoginSuccess={(profile) => {
                setActiveProfile(profile);
                setIsAuthenticated(true);
              }}
            />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-cambria-800 bg-cambria-900/60 py-8 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-medieval tracking-widest text-amber-400/80">
            CAMBRIA GENESIS • ON-CHAIN MMORPG PREDICTION PROTOCOL • ADMIN CONSOLE
          </p>
          <p>
            Nobility oversight portal for House treasuries, guild stakes, and weekly epoch resolution auditing.
          </p>
          <p className="text-gray-500">&copy; 2026 New Cambria. All rights reserved.</p>
        </div>
      </footer>

      {/* Modal Dialog for Inspecting House Details (only accessible after login) */}
      {isAuthenticated && <HouseModal />}
    </>
  );
}
