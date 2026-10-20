import React, { useState } from 'react';
import Link from 'next/link';

export const CambriaLobbySidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Drawer Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-16 left-3 z-50 p-2 rounded-lg bg-black/90 border border-amber-500/50 text-amber-400 shadow-xl backdrop-blur-md flex items-center space-x-2 text-xs font-mono font-bold"
        aria-label="Toggle Cambria Lobby Menu"
      >
        <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'} text-xs`}></i>
        <span>{mobileOpen ? 'Close' : 'Menu'}</span>
      </button>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container - Docked below top navigation bar */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-[240px] bg-[#070a0d] border-r border-[#151c24] flex flex-col justify-between p-3.5 select-none transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* SECTION: CORE */}
          <div>
            <div className="text-[#8e7a46] font-mono text-[10px] font-bold tracking-[0.22em] uppercase px-1 mb-2">
              CORE
            </div>

            <div className="space-y-2.5">
              {/* BUTTON 1: GENESIS */}
              <Link
                href="/predict"
                onClick={() => setMobileOpen(false)}
                className="relative block w-full rounded-xl p-3 overflow-hidden transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.99] group shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-[#e5a938]/60 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #c78d2b 0%, #b37a1b 50%, #94600e 100%)',
                }}
              >
                {/* Diagonal Glass Sheen */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(115deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.12) 35%, transparent 36%)',
                  }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="pr-1">
                    <h3 className="font-arcade text-2xl text-white tracking-wide leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                      GENESIS
                    </h3>
                    <p className="text-[8.5px] font-bold text-amber-100 font-mono tracking-wider uppercase mt-1 leading-tight">
                      MMORPG WITH MASSIVE STAKES
                    </p>
                  </div>

                  {/* Pixel Treasure Chest Icon */}
                  <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 64 64" className="w-full h-full pixel-art" fill="none">
                      <path d="M8 28h48v26a4 4 0 01-4 4H12a4 4 0 01-4-4V28z" fill="#78350f" />
                      <path d="M12 32h40v22H12z" fill="#92400e" />
                      <rect x="18" y="28" width="6" height="28" fill="#d97706" />
                      <rect x="40" y="28" width="6" height="28" fill="#d97706" />
                      <rect x="20" y="30" width="2" height="24" fill="#fbbf24" />
                      <rect x="42" y="30" width="2" height="24" fill="#fbbf24" />
                      <circle cx="22" cy="24" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
                      <circle cx="32" cy="22" r="5" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
                      <circle cx="42" cy="25" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
                      <circle cx="28" cy="27" r="4.5" fill="#fef08a" stroke="#78350f" strokeWidth="1.5" />
                      <circle cx="38" cy="28" r="4.5" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
                      <polygon points="16,21 19,25 16,29 13,25" fill="#ef4444" />
                      <polygon points="48,22 51,26 48,30 45,26" fill="#10b981" />
                      <polygon points="34,16 36,19 34,22 32,19" fill="#38bdf8" />
                      <path d="M10 24C10 14 54 14 54 24l-3-6C48 9 16 9 13 18z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
                      <rect x="28" y="36" width="8" height="8" rx="2" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* BUTTON 2: WHITEPAPER (Active highlighted in screenshot) */}
              <a
                href="/Cambria_Genesis_Prediction_Whitepaper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-full rounded-xl p-3 overflow-hidden transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.99] group bg-[#0e1317] border-2 border-[#ea9c27] shadow-[0_0_18px_rgba(234,156,39,0.32)] cursor-pointer"
              >
                {/* Active Left Indicator Notch */}
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-[#ea9c27]" />

                <div className="relative z-10 flex items-center justify-between pl-1">
                  <div className="pr-1">
                    <h3 className="font-arcade text-xl text-white tracking-wide leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      WHITEPAPER
                    </h3>
                    <p className="text-[8px] font-bold text-[#d49433] font-mono tracking-wide uppercase mt-1 leading-tight">
                      THE ECONOMICS OF CAMBRIA: GENESIS
                    </p>
                  </div>

                  {/* Pixel Scroll Icon */}
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 64 64" className="w-full h-full pixel-art" fill="none">
                      <path d="M16 14c-4 0-8 3-8 7v24c0 4 4 7 8 7h30c4 0 8-3 8-7V21c0-4-4-7-8-7H16z" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
                      <ellipse cx="14" cy="21" rx="5" ry="7" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
                      <ellipse cx="48" cy="45" rx="5" ry="7" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
                      <line x1="22" y1="24" x2="42" y2="24" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="22" y1="31" x2="40" y2="31" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="22" y1="38" x2="36" y2="38" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="44" cy="33" r="5" fill="#dc2626" />
                      <path d="M42 36l-3 8 5-2 5 2-3-8z" fill="#b91c1c" />
                    </svg>
                  </div>
                </div>
              </a>

              {/* BUTTON 3: ECONOMY */}
              <div className="relative block w-full rounded-xl p-3 overflow-hidden bg-[#10151a] border border-[#1b232c] transition-all duration-200 cursor-default opacity-80 hover:opacity-95">
                <div className="flex items-center justify-between">
                  <div className="pr-1">
                    <h3 className="font-arcade text-xl text-[#6b7683] tracking-wide leading-none">
                      ECONOMY
                    </h3>
                    <p className="text-[8px] font-medium text-[#465360] font-mono tracking-wide uppercase mt-1 leading-tight">
                      GAME ITEMS AND ECONOMY STATS
                    </p>
                  </div>

                  {/* Pixel Key Icon */}
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center opacity-65">
                    <svg viewBox="0 0 64 64" className="w-full h-full pixel-art" fill="none">
                      <circle cx="24" cy="24" r="14" fill="#475569" stroke="#94a3b8" strokeWidth="3" />
                      <circle cx="24" cy="24" r="6" fill="#11161b" stroke="#94a3b8" strokeWidth="2.5" />
                      <rect x="34" y="21" width="22" height="6" rx="2" fill="#94a3b8" />
                      <rect x="46" y="27" width="4" height="7" rx="1" fill="#94a3b8" />
                      <rect x="52" y="27" width="4" height="10" rx="1" fill="#94a3b8" />
                      <circle cx="24" cy="18" r="2" fill="#fbbf24" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-[#182129] my-3 mx-1" />

          {/* SECTION: ECOSYSTEM */}
          <div>
            <div className="text-[#8e7a46] font-mono text-[10px] font-bold tracking-[0.22em] uppercase px-1 mb-2">
              ECOSYSTEM
            </div>

            {/* BUTTON 4: DUNGEONS */}
            <a
              href="https://lobby.cambria.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative block w-full rounded-xl p-3 overflow-hidden transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.99] group shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-red-500/50 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #c0282b 0%, #a4191d 50%, #7d0e12 100%)',
              }}
            >
              {/* Diagonal Glass Sheen */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(115deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.1) 35%, transparent 36%)',
                }}
              />

              <div className="relative z-10 flex items-center justify-between">
                <div className="pr-1">
                  <h3 className="font-arcade text-2xl text-white tracking-wide leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    DUNGEONS
                  </h3>
                  <p className="text-[8.5px] font-bold text-red-100 font-mono tracking-wider uppercase mt-1 leading-tight">
                    DUNGEONS, FISHING, &amp; MINIGAMES
                  </p>
                </div>

                {/* Pixel Demon Skull Boss Icon */}
                <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 64 64" className="w-full h-full pixel-art" fill="none">
                    <path d="M14 26C10 10 2 12 4 4c8 4 16 14 18 20z" fill="#450a0a" stroke="#991b1b" strokeWidth="2" />
                    <path d="M50 26C54 10 62 12 60 4c-8 4-16 14-18 20z" fill="#450a0a" stroke="#991b1b" strokeWidth="2" />
                    <path d="M18 22h28l4 18-6 16H20l-6-16z" fill="#262626" stroke="#525252" strokeWidth="2" />
                    <path d="M22 26h20l3 12-4 12H23l-4-12z" fill="#171717" />
                    <ellipse cx="25" cy="34" rx="4" ry="2.5" fill="#ef4444" />
                    <circle cx="25" cy="34" r="1.5" fill="#fef2f2" />
                    <ellipse cx="39" cy="34" rx="4" ry="2.5" fill="#ef4444" />
                    <circle cx="39" cy="34" r="1.5" fill="#fef2f2" />
                    <polygon points="32,38 30,43 34,43" fill="#0a0a0a" />
                    <rect x="25" y="47" width="3" height="4" fill="#e5e5e5" />
                    <rect x="30" y="47" width="4" height="5" fill="#e5e5e5" />
                    <rect x="36" y="47" width="3" height="4" fill="#e5e5e5" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* BOTTOM FOOTER OF SIDEBAR */}
        <div className="pt-3 border-t border-[#151c24] flex items-center justify-between px-1">
          <div className="flex items-center space-x-3.5">
            <a
              href="https://x.com/cambria_gg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Cambria on X"
              className="text-[#8e7a46] hover:text-amber-400 text-sm transition-colors"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a
              href="https://discord.gg/cambria"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Cambria Discord"
              className="text-[#8e7a46] hover:text-amber-400 text-sm transition-colors"
            >
              <i className="fa-brands fa-discord"></i>
            </a>
            <a
              href="https://docs.cambria.gg/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Cambria RSS & Docs"
              className="text-[#8e7a46] hover:text-amber-400 text-sm transition-colors"
            >
              <i className="fa-solid fa-rss"></i>
            </a>
          </div>

          <span className="text-[#8e7a46] font-mono text-xs font-semibold tracking-wider">
            v0.6.2
          </span>
        </div>
      </aside>
    </>
  );
};

export default CambriaLobbySidebar;
