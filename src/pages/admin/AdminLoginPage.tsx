import React, { useState } from 'react';
import { Lock, AlertCircle, Loader2, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { unlockAdminWithPassword, isFirebaseConfigured } from '../../lib/firebase';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onExitToPublic: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onExitToPublic,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password) {
      setErrorMessage('Please enter the password to unlock.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await unlockAdminWithPassword(password);
      if (result.success) {
        onLoginSuccess();
      } else {
        setErrorMessage(result.error || 'Incorrect password. Access denied.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col items-center justify-center p-6 relative">
      {/* Discreet Exit Link */}
      <button
        id="admin-exit-btn"
        onClick={onExitToPublic}
        className="absolute top-8 left-8 inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.2em] text-neutral-400 hover:text-white uppercase transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Website</span>
      </button>

      <div className="w-full max-w-md bg-[#0c0c10] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-white shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-[0.25em] text-white uppercase">
            TANBYR ADMIN
          </h1>
          <p className="text-xs text-neutral-400 tracking-wider uppercase mt-1">
            Official CMS &middot; Protected Access
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            id="admin-error-alert"
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start space-x-3"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Single Password Unlock Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-2"
            >
              Master Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter password to unlock..."
                autoComplete="current-password"
                autoFocus
                required
                className="w-full pl-4 pr-11 py-3.5 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-white/40 transition-colors font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            id="admin-unlock-btn"
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-xs tracking-[0.25em] uppercase hover:bg-neutral-200 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>VERIFYING...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>UNLOCK ADMIN</span>
              </>
            )}
          </button>
        </form>

        {/* Status notice */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] tracking-wider uppercase bg-white/5 text-neutral-400">
            <span
              className={`w-2 h-2 rounded-full ${
                isFirebaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'
              }`}
            />
            <span>
              {isFirebaseConfigured
                ? 'Firestore Cloud Database Active'
                : 'Local Secure Storage Active'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
            All updates made in the CMS save directly to live Firebase Firestore.
          </p>
        </div>
      </div>
    </div>
  );
};
