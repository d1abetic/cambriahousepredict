import React, { useState } from 'react';
import Link from 'next/link';

interface AdminLoginModalProps {
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onLoginSuccess }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const cleanId = adminId.trim().toLowerCase();
      const cleanPass = password.trim();

      // Accepted limited credentials: admin / cambria2026 (or admin/admin, cambria/cambria for ease of access)
      const isValid =
        (cleanId === 'admin' && (cleanPass === 'cambria2026' || cleanPass === 'admin' || cleanPass === 'cambria')) ||
        (cleanId === 'cambria' && (cleanPass === 'cambria2026' || cleanPass === 'cambria'));

      if (isValid) {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Access Denied: Invalid Administrative ID or Security Passkey.');
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setAdminId('admin');
    setPassword('cambria2026');
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-cambria-900/95 backdrop-blur-xl rounded-2xl royal-border p-6 sm:p-8 shadow-2xl border border-amber-500/50 relative overflow-hidden">
        {/* Subtle background ambient light */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-cambria-950/80 pointer-events-none" />

        <div className="relative z-10 text-center">
          {/* Emblem / Shield Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-cambria-950 to-cambria-900 border-2 border-amber-500/60 flex items-center justify-center text-amber-400 text-2xl shadow-[0_0_24px_rgba(245,158,11,0.3)] mb-4">
            <i className="fa-solid fa-shield-halved"></i>
          </div>

          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Restricted Nobility Clearance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-medieval text-white tracking-wide mb-2">
            Admin Authentication
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto mb-6">
            Enter authorized administrative credentials to decrypt and access internal nobility metrics.
          </p>

          {/* Error Message Alert */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center space-x-2 text-left animate-in fade-in duration-150">
              <i className="fa-solid fa-circle-exclamation text-red-400 flex-shrink-0 text-sm"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1.5 font-medium">
                Admin ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <i className="fa-solid fa-user-shield text-xs text-amber-400"></i>
                </div>
                <input
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full pl-10 pr-4 py-2.5 bg-cambria-950/90 border border-cambria-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white rounded-lg text-xs font-mono transition outline-none placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1.5 font-medium">
                Security Passkey
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <i className="fa-solid fa-key text-xs text-amber-400"></i>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security passkey..."
                  className="w-full pl-10 pr-10 py-2.5 bg-cambria-950/90 border border-cambria-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white rounded-lg text-xs font-mono transition outline-none placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-amber-400 transition"
                  aria-label={showPassword ? 'Hide passkey' : 'Show passkey'}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                </button>
              </div>
            </div>

            {/* Limited Credentials Provided Box */}
            <div className="bg-cambria-950/90 border border-amber-500/20 rounded-xl p-3.5 mt-3 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono uppercase tracking-wider mb-2 font-semibold">
                <span className="flex items-center space-x-1">
                  <i className="fa-solid fa-id-badge text-amber-400"></i>
                  <span>Provided Credentials</span>
                </span>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-amber-400 hover:text-amber-300 hover:underline cursor-pointer lowercase font-medium"
                >
                  [auto-fill]
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-cambria-900/60 p-2 rounded border border-cambria-800">
                <div>
                  <span className="text-gray-400 text-[10px] block">ADMIN ID:</span>
                  <span className="text-amber-300 font-bold">admin</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">PASSKEY:</span>
                  <span className="text-amber-300 font-bold">cambria2026</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-cambria-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-lock-open text-xs"></i>
                  <span>Authorize &amp; Enter Console</span>
                </>
              )}
            </button>
          </form>

          {/* Return link */}
          <div className="mt-6 pt-4 border-t border-cambria-800/80 text-center">
            <Link
              href="/predict"
              className="text-xs text-gray-400 hover:text-amber-400 transition inline-flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-arrow-left text-[10px]"></i>
              <span>Return to Player Prediction</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
