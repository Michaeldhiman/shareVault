import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import {
  User,
  ShieldCheck,
  KeyRound,
  Lock,
  Database,
  Save,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Laptop,
  Check,
  Globe
} from 'lucide-react';
import { authApi } from '../api/authApi';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [error, setError] = useState(null);

  // Active Sessions State
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Mock settings toggles
  const [googleConnected, setGoogleConnected] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

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
      triggerToast('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch active sessions from database
  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const response = await authApi.getSessions();
      setSessions(response.data);
    } catch (err) {
      // Fail silently
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleLogoutOtherDevices = async () => {
    try {
      await authApi.logoutOtherSessions();
      triggerToast('Revoked all other devices successfully');
      fetchSessions();
    } catch (err) {
      triggerToast('Failed to revoke sessions');
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto space-y-6 font-sans"
      >
        {/* User Hero Avatar Banner */}
        <div className="bg-[#151521]/60 border border-[#242433] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-650 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-blue-600/10 font-heading shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-heading">
                {user?.name || 'Account User'}
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user?.email}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold mt-2">
                <CheckCircle2 className="w-3 h-3" />
                <span>Zero-Knowledge Vault Protected</span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            icon={LogOut}
            onClick={logoutUser}
            className="text-rose-450 hover:text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 text-xs shrink-0"
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
        <div className="bg-[#151521]/60 border border-[#242433] rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
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
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
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
                  className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                icon={Save}
                isLoading={loading}
                className="shadow-blue-600/10 text-xs"
              >
                Save Profile Name
              </Button>
            </div>
          </form>
        </div>

        {/* Mock Connected Toggles */}
        <div className="bg-[#151521]/60 border border-[#242433] rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <Globe className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white font-heading">Security Integrations</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl">
              <div>
                <p className="font-bold text-slate-200">Google OAuth Identity</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Use single sign-on parameters</p>
              </div>
              <button
                onClick={() => {
                  setGoogleConnected(!googleConnected);
                  triggerToast(googleConnected ? 'Google OAuth disconnected' : 'Google OAuth connected successfully');
                }}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-semibold transition-all ${
                  googleConnected
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {googleConnected ? 'Connected' : 'Connect Account'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl">
              <div>
                <p className="font-bold text-slate-200">Email Verification</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Status of registered email</p>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Active Session Registry */}
        <div className="bg-[#151521]/60 border border-[#242433] rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white font-heading">Active Sessions</h2>
            </div>
            
            {sessions.length > 1 && (
              <button
                onClick={handleLogoutOtherDevices}
                className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 px-2.5 py-1.5 rounded-lg"
              >
                Logout Other Devices
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed">
            These are devices and tabs that have active Refresh Tokens in the database. Revoking a session immediately terminates its ability to renew Access Tokens.
          </p>

          <ul className="space-y-2 pt-1">
            {loadingSessions && sessions.length === 0 ? (
              <p className="text-xs text-slate-500 animate-pulse">Loading active sessions...</p>
            ) : sessions.map((sess) => (
              <li
                key={sess.id}
                className={`flex items-center justify-between bg-slate-950/40 border p-3.5 rounded-xl text-xs ${
                  sess.isCurrent ? 'border-blue-500/25 bg-blue-600/5' : 'border-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${sess.isCurrent ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-900 text-slate-400'}`}>
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">
                        {sess.isCurrent ? 'Current Browser Tab' : 'Other Connected Device'}
                      </span>
                      {sess.isCurrent && (
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-500/15 text-blue-400 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Session established: {new Date(sess.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-slate-500 font-mono uppercase block">Expires At</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {new Date(sess.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Cryptography Specs Card */}
        <div className="bg-[#151521]/60 border border-[#242433] rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white font-heading">Encryption Protocol Standards</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-950/70 border border-slate-900 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold font-heading">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Knowledge Architecture</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Master password never leaves browser memory. Key derivation executes purely client-side.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-900 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold font-heading">
                <KeyRound className="w-4 h-4" />
                <span>PBKDF2 Key Derivation</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                100,005 SHA-256 iterations generate separate auth & vault encryption keys locally.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-900 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-heading">
                <Lock className="w-4 h-4" />
                <span>AES-GCM 256-bit Encryption</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Authenticates payload integrity and encrypts credentials using unique 12-byte IVs.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-900 p-4 rounded-xl space-y-1">
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
