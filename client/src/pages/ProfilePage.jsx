import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import { User, ShieldCheck, KeyRound, Lock, Database, Save, LogOut, CheckCircle2 } from 'lucide-react';
import { authApi } from '../api/authApi';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const logout = useAuthStore((state) => state.logout);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [error, setError] = useState(null);

  // Compute initials from user name
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'SV';

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authApi.updateProfile({ name });
      await checkAuth();
      setToastMessage('Profile updated successfully');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto space-y-6 font-sans"
      >
        {/* User Hero Avatar Banner */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-blue-600/20 font-heading shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-heading">
                {user?.name || 'Account User'}
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold mt-2">
                <CheckCircle2 className="w-3 h-3" />
                <span>Zero-Knowledge Vault Protected</span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            icon={LogOut}
            onClick={logout}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 text-xs shrink-0"
          >
            Lock Vault & Sign Out
          </Button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Profile Details Form Card */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <User className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white font-heading">Personal Information</h2>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profile-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
                />
              </div>

              <div>
                <label htmlFor="profile-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address (Read Only)
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-400 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                icon={Save}
                isLoading={loading}
                className="shadow-blue-600/20"
              >
                Save Profile
              </Button>
            </div>
          </form>
        </div>

        {/* Product Security & Cryptography Features Grid */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white font-heading">Vault Security Specs & Encryption Protocol</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-950/70 border border-slate-800/70 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold font-heading">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Knowledge Architecture</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Master password never leaves browser memory. Key derivation executes purely client-side.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/70 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold font-heading">
                <KeyRound className="w-4 h-4" />
                <span>PBKDF2 Key Derivation</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                100,000 SHA-256 iterations generate separate auth & vault encryption keys locally.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/70 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-heading">
                <Lock className="w-4 h-4" />
                <span>AES-GCM 256-bit Encryption</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Authenticates payload integrity and encrypts credentials using unique 12-byte IVs.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/70 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-heading">
                <Database className="w-4 h-4" />
                <span>Isolated Ciphertext Storage</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                MongoDB stores ciphertext payload only. Server cannot read stored password values.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Updated Toast */}
      <Toast isVisible={!!toastMessage} message={toastMessage} type="success" />
    </DashboardLayout>
  );
}
