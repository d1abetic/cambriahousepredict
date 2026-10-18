import React from 'react';
import { useWallet } from '@/context/WalletContext';

interface AdminOverviewProps {
  onLockConsole?: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onLockConsole }) => {
  const { houses, openHouseModal } = useWallet();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-cambria-900/70 backdrop-blur-md p-6 rounded-xl border border-amber-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Restricted Access</span>
          <h2 className="text-2xl font-bold font-medieval text-white">Admin Nobility Overview</h2>
          <p className="text-sm text-gray-300">
            Internal economic metrics, treasuries, asset holdings, and top guild contributions per House.
          </p>
        </div>

        {onLockConsole && (
          <button
            onClick={onLockConsole}
            className="self-start sm:self-center px-4 py-2 bg-cambria-950/80 hover:bg-red-950/80 border border-cambria-700 hover:border-red-500/60 text-gray-300 hover:text-red-300 rounded-lg text-xs font-mono font-semibold transition flex items-center space-x-2 cursor-pointer shadow"
          >
            <i className="fa-solid fa-lock text-xs"></i>
            <span>Lock Console</span>
          </button>
        )}
      </div>

      {/* Admin Stats Table */}
      <div className="bg-cambria-900/70 backdrop-blur-md rounded-xl royal-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-cambria-800/80 flex items-center justify-between bg-cambria-950/40">
          <h3 className="font-medieval font-bold text-lg text-white">House Economic Status &amp; Holdings</h3>
          <span className="text-xs font-mono text-gray-400">Epoch #04 Live Feed</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-cambria-950/60 text-gray-300 uppercase text-xs tracking-wider border-b border-cambria-800/60">
              <tr>
                <th className="py-4 px-6">House Name</th>
                <th className="py-4 px-6">Treasury (Gold/Silver)</th>
                <th className="py-4 px-6">Net Worth ($RSGP)</th>
                <th className="py-4 px-6">Registered Guilds</th>
                <th className="py-4 px-6">Top Guild Contributor</th>
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
                  <td className="py-4 px-6 font-mono text-amber-400">{house.treasury}</td>
                  <td className="py-4 px-6 font-mono text-emerald-400">{house.netWorth}</td>
                  <td className="py-4 px-6 font-mono text-white">{house.guilds} Guilds</td>
                  <td className="py-4 px-6 text-gray-300 text-xs">{house.topGuild}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => openHouseModal(house.id)}
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
