import React, { useState } from 'react';
import { Lock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { loginWithCredentials, isFirebaseConfigured } from '../../lib/firebase';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onExitToPublic: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onExitToPublic,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both admin email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginWithCredentials(email.trim(), password);
      if (result.success) {
        onLoginSuccess();
      } else {
        setErrorMessage(result.error || 'Invalid credentials or unauthorized access.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col items-center justify-center p-6 relative">
      {/* Discreet Exit Link */}
      <button
        onClick={onExitToPublic}
        className="absolute top-8 left-8 inline-flex items-center space-x-2 text-xs font-semibold tracking-wider text-neutral-400 hover:text-white uppercase transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Website</span>
      </button>

      <div className="w-full max-w-md bg-[#0c0c10] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-white">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-[0.25em] text-white uppercase">
            TANBYR ADMIN
          </h1>
          <p className="text-xs text-neutral-400 tracking-wider uppercase mt-1">
            Official CMS &middot; Restricted Access
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-2"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tanbyr.com"
              autoComplete="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm placeholder:text-neutral-400 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-2"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#14141a] border border-white/10 text-white text-sm placeholder:text-neutral-400 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3.5 rounded-xl bg-white text-black font-bold text-xs tracking-[0.25em] uppercase hover:bg-neutral-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <span>LOGIN</span>
            )}
          </button>
        </form>

        {/* Status notice */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] tracking-wider uppercase bg-white/5 text-neutral-400">
            <span
              className={`w-2 h-2 rounded-full ${
                isFirebaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>
              {isFirebaseConfigured
                ? 'Firebase Auth Active'
                : 'Preview Mode (Local Auth Active)'}
            </span>
          </div>
          {!isFirebaseConfigured && (
            <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
              Enter any admin email (e.g. <span className="text-neutral-300">admin@tanbyr.com</span>) to preview the CMS.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
