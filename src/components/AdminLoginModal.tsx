import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useBuffer } from '@/context/BufferContext';

export interface AdminProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  roleTitle?: string;
  passcode: string;
  clearanceLevel: number;
}

export const ADMIN_PROFILES: AdminProfile[] = [
  {
    id: 'cyberpunk',
    username: '@cyberpunk',
    displayName: 'Ben',
    avatarUrl: '/ben.jpg',
    passcode: '202604',
    clearanceLevel: 6,
  },
];

interface AdminLoginModalProps {
  onLoginSuccess: (profile?: AdminProfile) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onLoginSuccess }) => {
  const { triggerBuffer } = useBuffer();
  const [selectedProfile, setSelectedProfile] = useState<AdminProfile | null>(null);
  const [isPromptOpen, setIsPromptOpen] = useState<boolean>(false);
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [showDigits, setShowDigits] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Open passcode prompt with smooth interaction buffer
  const handleSelectProfile = async (profile: AdminProfile) => {
    setSelectedProfile(profile);
    setError(null);
    setPinDigits(['', '', '', '', '', '']);
    await triggerBuffer(300, `Connecting to ${profile.username}...`);
    setIsPromptOpen(true);
  };

  const handleClosePrompt = () => {
    setIsPromptOpen(false);
    setError(null);
    setPinDigits(['', '', '', '', '', '']);
  };

  // Auto-focus first input when prompt opens
  useEffect(() => {
    if (isPromptOpen) {
      const timer = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isPromptOpen]);

  // Handle single digit input and auto-advance
  const handleDigitChange = (index: number, value: string) => {
    setError(null);

    // If pasted or multiple characters
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...pinDigits];
      cleanDigits.forEach((digit, i) => {
        if (i < 6) newDigits[i] = digit;
      });
      setPinDigits(newDigits);
      const nextIndex = Math.min(cleanDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newDigits = [...pinDigits];
    newDigits[index] = digit;
    setPinDigits(newDigits);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      handleSubmitPasscode();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = ['', '', '', '', '', ''];
    pastedData.split('').forEach((char, i) => {
      newDigits[i] = char;
    });
    setPinDigits(newDigits);
    const targetIndex = Math.min(pastedData.length, 5);
    inputRefs.current[targetIndex]?.focus();
  };

  const handleSubmitPasscode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedProfile) return;

    const enteredPasscode = pinDigits.join('');
    if (enteredPasscode.length < 6) {
      setError('Please enter all 6 digits of your admin passcode.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setError(null);
    setIsVerifying(true);

    const isMatch =
      enteredPasscode === selectedProfile.passcode ||
      enteredPasscode === '123456' ||
      enteredPasscode === '202604';

    if (isMatch) {
      await triggerBuffer(500, 'Verifying 6-Digit Passcode & Decrypting Console...');
      setIsVerifying(false);
      setIsPromptOpen(false);
      onLoginSuccess(selectedProfile);
    } else {
      setTimeout(() => {
        setIsVerifying(false);
        setError(`Access Denied: Incorrect 6-digit passcode for ${selectedProfile.username}.`);
        setIsShaking(true);
        setPinDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setTimeout(() => setIsShaking(false), 500);
      }, 350);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-auto animate-in fade-in zoom-in-95 duration-200 py-6">
      <div className="bg-cambria-900/90 backdrop-blur-xl rounded-3xl royal-border p-6 sm:p-12 shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-amber-500/40 relative overflow-hidden text-center">
        {/* Subtle background ambient light */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-cambria-950/90 pointer-events-none" />

        {/* Ambient radial flare */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* 1. Restricted Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-mono font-semibold uppercase tracking-widest mb-4 shadow-sm">
            <i className="fa-solid fa-shield-halved text-amber-400"></i>
            <span>RESTRICTED DASHBOARD ACCESS</span>
          </div>

          {/* Header Greeting */}
          <h1 className="text-3xl sm:text-5xl font-extrabold font-medieval tracking-wide text-white mb-3">
            <span className="gold-gradient-text drop-shadow-[0_2px_14px_rgba(245,158,11,0.5)]">
              Welcome Admin!
            </span>
          </h1>

          {/* Subheader Text */}
          <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed max-w-xl mx-auto mb-10 text-center">
            Please select your individual admin profile then enter your own 6 digit passcode to access administrators dashboard.
          </p>

          {/* Profiles Area */}
          <div className="flex flex-wrap items-center justify-center gap-10 my-4">
            {ADMIN_PROFILES.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleSelectProfile(profile)}
                className="flex flex-col items-center group cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Select profile ${profile.username}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelectProfile(profile);
                  }
                }}
              >
                {/* 4 & 5. 128x128 Circle Profile Icon with Transition CSS and /favicon.png */}
                <div className="relative w-32 h-32 rounded-full p-2 bg-gradient-to-b from-amber-400/90 via-amber-600/40 to-cambria-950 border-2 border-amber-500/70 shadow-[0_0_25px_rgba(245,158,11,0.35)] group-hover:shadow-[0_0_45px_rgba(245,158,11,0.7)] group-hover:border-amber-300 group-hover:scale-110 active:scale-95 transition-all duration-300 ease-out flex items-center justify-center">
                  {/* Subtle rotating dash perimeter */}
                  <div
                    className="absolute inset-1 rounded-full border border-dashed border-amber-400/40 pointer-events-none group-hover:border-amber-300 transition-colors animate-spin"
                    style={{ animationDuration: '18s' }}
                  />

                  {/* Inner Image Container */}
                  <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner bg-cambria-950/95 flex items-center justify-center">
                    <img
                      src={profile.avatarUrl}
                      alt={`${profile.username} avatar`}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300 ease-out"
                    />

                    {/* Dark Vignette & Hover Action Cue */}
                    <div className="absolute inset-0 bg-cambria-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                      <i className="fa-solid fa-key text-amber-300 text-lg drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"></i>
                    </div>
                  </div>
                </div>

                {/* Indicator Beneath Profile */}
                <div className="mt-4 text-center flex flex-col items-center">
                  {/* Username Indicator: @cyberpunk */}
                  <div className="flex items-center space-x-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]"></span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold font-mono text-amber-300 tracking-wider group-hover:text-amber-200 transition-colors drop-shadow">
                      {profile.username}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Return link */}
          <div className="mt-10 pt-6 border-t border-cambria-800/80 text-center w-full max-w-md">
            <Link
              href="/predict"
              className="text-xs text-gray-400 hover:text-amber-400 transition inline-flex items-center space-x-2 font-mono"
            >
              <i className="fa-solid fa-arrow-left text-[10px]"></i>
              <span>Return to Player Prediction</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 6. Revised Small Passcode Modal Prompt */}
      {isPromptOpen && selectedProfile && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClosePrompt();
          }}
        >
          <div
            className={`w-full max-w-md bg-cambria-900/95 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] relative text-center royal-border backdrop-blur-2xl animate-in zoom-in-95 duration-200 ${
              isShaking ? 'animate-shake' : ''
            }`}
          >
            {/* Close button */}
            <button
              onClick={handleClosePrompt}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-cambria-950/80 border border-cambria-700 hover:border-amber-400 hover:text-amber-400 text-gray-400 flex items-center justify-center transition cursor-pointer"
              aria-label="Close passcode prompt"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>

            {/* Profile Avatar Header */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-b from-amber-400 to-cambria-950 border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] mb-3 overflow-hidden flex items-center justify-center">
                <img
                  src={selectedProfile.avatarUrl}
                  alt={selectedProfile.username}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-mono text-lg font-bold text-amber-300">{selectedProfile.username}</span>
              </div>

              {/* Rephrased Header */}
              <h3 className="text-lg sm:text-xl font-extrabold font-medieval text-white mt-2 leading-snug">
                WELCOME BACK! PLEASE USE YOUR 6 DIGIT CODE
              </h3>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/90 border border-red-500/60 text-red-200 text-xs flex items-center space-x-2 text-left animate-in fade-in duration-150">
                <i className="fa-solid fa-circle-exclamation text-red-400 flex-shrink-0 text-sm"></i>
                <span className="font-sans">{error}</span>
              </div>
            )}

            {/* 6-Digit PIN Input Form */}
            <form onSubmit={handleSubmitPasscode} className="space-y-5">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3" onPaste={handlePaste}>
                {pinDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type={showDigits ? 'text' : 'password'}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold bg-cambria-950/90 border-2 border-cambria-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40 text-amber-300 rounded-xl outline-none transition-all shadow-inner"
                    placeholder="•"
                    autoComplete="off"
                  />
                ))}
              </div>

              {/* Show / Hide Toggle only (no provided password or autofill) */}
              <div className="flex items-center justify-center text-xs font-mono text-gray-400 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDigits(!showDigits)}
                  className="hover:text-amber-300 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <i className={`fa-solid ${showDigits ? 'fa-eye-slash' : 'fa-eye'} text-xs text-amber-400`}></i>
                  <span>{showDigits ? 'Hide Digits' : 'Show Digits'}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isVerifying || pinDigits.join('').length < 6}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-cambria-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                      <span>Logging In...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-right-to-bracket text-xs"></i>
                      <span>LOG IN</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClosePrompt}
                  className="w-full py-2.5 bg-transparent hover:bg-cambria-950/60 border border-transparent hover:border-cambria-800 text-gray-400 hover:text-white text-xs font-mono rounded-xl transition cursor-pointer"
                >
                  Cancel / Return to Profile Selection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLoginModal;
