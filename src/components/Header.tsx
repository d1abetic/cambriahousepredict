import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useWallet } from '@/context/WalletContext';

interface HeaderProps {
  currentView?: 'player' | 'admin';
}

export const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const router = useRouter();
  const { isConnected, connectWallet, walletAddress } = useWallet();
  const isAdmin = currentView === 'admin' || router.pathname.includes('/admin');

  const navTabs = [
    { name: 'HOME', href: '/predict', active: !isAdmin },
    { name: 'TOKEN', href: '#', active: false },
    { name: 'HOLDINGS', href: '#', active: false },
    { name: 'INVITES', href: '#', active: false },
    { name: 'GENESIS', href: '/predict', active: false },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-black border-b border-[#141a21] flex items-center justify-between px-3 sm:px-6 select-none">
      {/* Left Navigation Capsule Tabs */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <div className="flex items-center bg-[#0a0e13] p-1 rounded-lg border border-[#1b232c] shadow-inner">
          {navTabs.map((tab) => {
            if (tab.name === 'HOME') {
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-3 sm:px-6 py-1.5 rounded text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
                    tab.active
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            }

            return (
              <span
                key={tab.name}
                className="hidden sm:inline-block px-3 sm:px-5 py-1.5 rounded text-xs font-mono font-semibold tracking-wider text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {tab.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* Right Action: SIGN IN TO PLAY / Wallet Button */}
      <div className="flex items-center space-x-3">
        {/* Subtle Admin Quick Link */}
        <Link
          href={isAdmin ? "/predict" : "/predict/admin"}
          className="hidden md:inline-flex text-[11px] font-mono text-[#8a723e] hover:text-amber-400 transition-colors uppercase tracking-wider px-2 py-1"
        >
          {isAdmin ? '← Player Hub' : 'Nobility Admin'}
        </Link>

        {/* SIGN IN TO PLAY Gold Action Button */}
        <button
          onClick={connectWallet}
          className="px-5 sm:px-6 py-2 rounded-md bg-[#f5a524] hover:bg-[#e09419] active:scale-95 text-black font-extrabold text-xs tracking-wider font-mono uppercase transition-all shadow-[0_2px_12px_rgba(245,165,36,0.35)] cursor-pointer"
        >
          SIGN IN TO PLAY
        </button>
      </div>
    </header>
  );
};

export default Header;
