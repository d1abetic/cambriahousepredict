import React from 'react';
import { useWallet } from '@/context/WalletContext';
import { useBuffer } from '@/context/BufferContext';

export interface AdminProfileSummary {
  username: string;
  displayName: string;
  avatarUrl: string;
  roleTitle?: string;
}

interface AdminOverviewProps {
  onLockConsole?: () => void;
  adminProfile?: AdminProfileSummary;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onLockConsole, adminProfile }) => {
  const { houses, regionalCities, freebornOptions, allPredictions, openHouseModal } = useWallet();
  const { triggerBuffer } = useBuffer();

  const handleLock = async () => {
    if (onLockConsole) {
      await triggerBuffer(400, 'Encrypting and locking administrative console...');
      onLockConsole();
    }
  };

  const handleInspect = async (houseId: string, houseName: string) => {
    await triggerBuffer(250, `Loading economic telemetry for House ${houseName}...`);
    openHouseModal(houseId);
  };

  const crownTotal = houses.reduce((acc, h) => acc + (h.silver || 0), 0);
  const regionalTotal = regionalCities.reduce((acc, c) => acc + c.totalSilverBurned, 0);
  const freebornTotal = freebornOptions.reduce((acc, o) => acc + o.totalSilverBurned, 0);
  const grandTotal = crownTotal + regionalTotal + freebornTotal;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-cambria-900/70 backdrop-blur-md p-6 rounded-xl border border-amber-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Restricted Access</span>
          <h2 className="text-2xl font-bold font-medieval text-white">Admin Nobility &amp; Multi-Chamber Console</h2>
          <p className="text-sm text-gray-300">
            Real-time telemetry across Chamber 1 (Imperial Crown), Chamber 2 (Regional Wars), and Chamber 3 (Freeborn Disruption).
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-center">
          {adminProfile && (
            <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-cambria-950/90 border border-amber-500/30">
              <img
                src={adminProfile.avatarUrl}
                alt={adminProfile.username}
                className="w-7 h-7 rounded-full object-cover border border-amber-400/60"
              />
              <div className="text-left">
                <span className="text-[10px] text-gray-400 font-mono block leading-none">Logged In</span>
                <span className="text-xs font-mono font-bold text-amber-300">{adminProfile.username}</span>
              </div>
            </div>
          )}

          {onLockConsole && (
            <button
              onClick={handleLock}
              className="px-4 py-2 bg-cambria-950/80 hover:bg-red-950/80 border border-cambria-700 hover:border-red-500/60 text-gray-300 hover:text-red-300 rounded-lg text-xs font-mono font-semibold transition flex items-center space-x-2 cursor-pointer shadow"
            >
              <i className="fa-solid fa-lock text-xs"></i>
              <span>Lock Console</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-Chamber Admin Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-cambria-950/80 p-5 rounded-xl border border-amber-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-bold uppercase mb-2">
            <span>Chamber I: Crown</span>
            <i className="fa-solid fa-crown text-amber-400"></i>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">
            {crownTotal.toLocaleString()} <span className="text-xs text-amber-400 font-normal">Silver</span>
          </div>
          <p className="text-[11px] text-gray-400 font-mono">8 Houses Vying for Capital City</p>
        </div>

        <div className="bg-cambria-950/80 p-5 rounded-xl border border-cyan-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-mono font-bold uppercase mb-2">
            <span>Chamber II: Regional</span>
            <i className="fa-solid fa-shield-halved text-cyan-400"></i>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">
            {regionalTotal.toLocaleString()} <span className="text-xs text-cyan-400 font-normal">Silver</span>
          </div>
          <p className="text-[11px] text-gray-400 font-mono">7 Concurrent City Offices</p>
        </div>

        <div className="bg-cambria-950/80 p-5 rounded-xl border border-rose-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs text-rose-400 font-mono font-bold uppercase mb-2">
            <span>Chamber III: Freeborn</span>
            <i className="fa-solid fa-fire text-rose-400"></i>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">
            {freebornTotal.toLocaleString()} <span className="text-xs text-rose-400 font-normal">Silver</span>
          </div>
          <p className="text-[11px] text-gray-400 font-mono">High-Multiplier Disruption Pools</p>
        </div>

        <div className="bg-cambria-950/80 p-5 rounded-xl border border-emerald-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-mono font-bold uppercase mb-2">
            <span>Total Epoch Protocol Pool</span>
            <i className="fa-solid fa-coins text-emerald-400"></i>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 mb-1">
            {grandTotal.toLocaleString()} <span className="text-xs text-gray-400 font-normal">Silver</span>
          </div>
          <p className="text-[11px] text-gray-400 font-mono">{allPredictions.length} Player Wagers Recorded</p>
        </div>
      </div>

      {/* Chamber II Regional Cities Tactical Overview */}
      <div className="bg-cambria-900/70 backdrop-blur-md rounded-xl royal-border overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-cambria-800/80 flex items-center justify-between bg-cambria-950/60">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-map-location-dot text-cyan-400"></i>
            <h3 className="font-medieval font-bold text-lg text-white">Chamber II: 7 Regional City Turf Wars Live</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Sub-Market Telemetry</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-cambria-950/80 text-gray-400 uppercase text-xs tracking-wider border-b border-cambria-800">
              <tr>
                <th className="py-3.5 px-6">Tactical City</th>
                <th className="py-3.5 px-6">Region &amp; Risk</th>
                <th className="py-3.5 px-6">Leading House</th>
                <th className="py-3.5 px-6">Leading Influence</th>
                <th className="py-3.5 px-6 text-right">Total Silver Burned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cambria-800/60 font-mono text-xs">
              {regionalCities.map((city) => {
                const leader = city.influenceBreakdown[0];
                return (
                  <tr key={city.id} className="hover:bg-cambria-950/40 transition">
                    <td className="py-3.5 px-6 font-bold text-white flex items-center space-x-2.5">
                      <i className={`fa-solid ${city.icon} text-cyan-400 text-sm`}></i>
                      <span className="font-medieval text-sm">{city.name}</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="text-gray-300 block">{city.region}</span>
                      <span className={`text-[10px] font-bold ${city.riskLevel.includes('T5') ? 'text-rose-400' : 'text-amber-400'}`}>
                        {city.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-bold text-amber-300">House {leader?.houseName || 'Contested'}</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-cambria-950 rounded-full h-2 overflow-hidden border border-cambria-800">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                            style={{ width: `${leader?.percentage || 0}%` }}
                          />
                        </div>
                        <span className="font-bold text-cyan-300">{leader?.percentage || 0}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-right text-amber-400 font-bold">
                      {city.totalSilverBurned.toLocaleString()} Silver
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Stats Table: Chamber I 8 Noble Houses */}
      <div className="bg-cambria-900/70 backdrop-blur-md rounded-xl royal-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-cambria-800/80 flex items-center justify-between bg-cambria-950/40">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-crown text-amber-400"></i>
            <h3 className="font-medieval font-bold text-lg text-white">Chamber I: 8 Noble Houses Status &amp; Holdings</h3>
          </div>
          <span className="text-xs font-mono text-gray-400">Epoch #04 Live Feed</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-cambria-950/60 text-gray-300 uppercase text-xs tracking-wider border-b border-cambria-800/60">
              <tr>
                <th className="py-4 px-6">House Name</th>
                <th className="py-4 px-6">Official Home City</th>
                <th className="py-4 px-6">Charter Supply (Viceroy)</th>
                <th className="py-4 px-6">Dominant Affinity</th>
                <th className="py-4 px-6">Crown Silver</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cambria-800/60">
              {houses.map((house) => (
                <tr key={house.id} className="hover:bg-cambria-950/40 transition">
                  <td className="py-4 px-6 font-bold text-white flex items-center space-x-3">
                    <div className="w-10 h-12 rounded bg-cambria-950 border border-amber-500/30 flex items-center justify-center p-1 flex-shrink-0 shadow overflow-hidden relative">
                      <div className={`absolute inset-0 bg-gradient-to-t ${house.color} opacity-20`} />
                      {house.image ? (
                        <img
                          src={house.image}
                          alt={house.name}
                          className="w-full h-full object-contain pixel-art filter drop-shadow"
                        />
                      ) : (
                        <i className={`fa-solid ${house.icon} text-amber-400 text-xs`}></i>
                      )}
                    </div>
                    <div>
                      <div className="font-medieval text-white text-base">House {house.name}</div>
                      <div className="text-[11px] text-amber-400 font-normal">{house.city}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-300 text-xs">
                    {house.homeCity || house.city}
                  </td>
                  <td className="py-4 px-6 font-mono text-amber-300 text-xs">
                    {house.viceroys ?? 64} / {house.totalRevealed ?? 480}
                  </td>
                  <td className="py-4 px-6 text-xs text-cyan-300 font-mono">
                    {house.primaryAffinity || 'Martial & Craft'}
                  </td>
                  <td className="py-4 px-6 font-mono text-amber-400 font-bold">
                    {(house.silver || 0).toLocaleString()} Silver
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleInspect(house.id, house.name)}
                      className="text-xs bg-cambria-800 hover:bg-amber-600 hover:text-cambria-950 text-amber-400 px-3 py-1.5 rounded font-bold transition cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
