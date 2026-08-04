import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import Button from './ui/Button';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

/**
 * Unlock Vault Modal
 * Prompted when token is active but in-memory AES encryptionKey is missing.
 */
export default function UnlockVaultModal() {
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const unlockVault = useAuthStore((state) => state.unlockVault);
  const loading = useAuthStore((state) => state.loading);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!masterPassword) return;
    setError(null);

    const result = await unlockVault(masterPassword);
    if (!result.success) {
      setError(result.message || 'Incorrect Master Password');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800/90 max-w-md w-full rounded-2xl p-6 shadow-2xl relative"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-3 shadow-lg shadow-blue-500/10">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-heading">Unlock Your Vault</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Enter your Master Password to derive your AES-256 key via PBKDF2 locally in memory.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label htmlFor="unlock-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Master Password
            </label>
            <div className="relative">
              <input
                id="unlock-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-200 p-1 rounded-lg transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            icon={ShieldCheck}
            isLoading={loading}
            isDisabled={!masterPassword}
            className="w-full justify-center py-3 font-semibold shadow-blue-600/20"
          >
            {loading ? 'Deriving 256-bit Key & Unlocking...' : 'Decrypt Vault'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
