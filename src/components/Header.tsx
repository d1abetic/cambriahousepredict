import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface HeaderProps {
  currentView?: 'player' | 'admin';
}

export const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const router = useRouter();
  const isAdmin = currentView === 'admin' || router.pathname.includes('/admin');

  return (
    <header className="border-b border-cambria-700 bg-cambria-900/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo with image favicon */}
        <Link href={isAdmin ? "/predict/admin" : "/predict"} className="flex items-center space-x-3 group">
          <img
            src="/images/favicon.png"
            alt="Cambria Genesis Crest"
            className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform pixel-art"
          />
          <div>
            <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase block">Cambria Genesis</span>
            <h1 className="text-lg font-bold text-white tracking-wide font-medieval leading-tight">Royal House Prediction</h1>
          </div>
        </Link>

        {/* Right side indicator if on Admin portal */}
        {isAdmin && (
          <div className="flex items-center">
            <span className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
