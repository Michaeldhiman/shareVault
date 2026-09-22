import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import {
  User,
  ShieldCheck,
  KeyRound,
  Lock,
  Database,
  Save,
  LogOut,
  CheckCircle2,
  Monitor,
  Laptop
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
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="max-w-3xl mx-auto space-y-6 font-sans pb-12"
      >
        {/* User Hero Avatar Banner */}
        <Card className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-[var(--sv-accent)]/20 font-sans shrink-0 border border-[var(--sv-accent)]/30">
              {initials}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--sv-text-primary)] tracking-tight font-sans">
                {user?.name || 'Account User'}
              </h1>
              <p className="text-xs text-[var(--sv-text-muted)] font-mono mt-0.5">{user?.email}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--sv-accent-soft)] border border-[var(--sv-accent)]/20 text-[var(--sv-accent)] text-[10px] font-semibold mt-2">
                <CheckCircle2 className="w-3 h-3" />
                <span>Zero-Knowledge Protected</span>
              </div>
            </div>
          </div>

          <Button
            variant="danger"
            icon={LogOut}
            onClick={logoutUser}
            className="text-xs shrink-0"
          >
            Lock & Sign Out
          </Button>
        </Card>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Profile Details Form Card */}
        <Card className="p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-[var(--sv-border)] pb-3">
            <User className="w-4 h-4 text-[var(--sv-info)]" />
            <h2 className="text-sm font-bold text-[var(--sv-text-primary)] font-sans">Personal Information</h2>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profile-name" className="block text-xs font-bold uppercase tracking-wider text-[var(--sv-text-secondary)] mb-1 font-mono">
                  Full Name
                </label>
                <Input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="profile-email" className="block text-xs font-bold uppercase tracking-wider text-[var(--sv-text-secondary)] mb-1 font-mono">
                  Email Address (Read Only)
                </label>
                <Input
                  id="profile-email"
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="cursor-not-allowed opacity-70"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                icon={Save}
                isLoading={loading}
                className="text-xs"
              >
                Save Profile
              </Button>
            </div>
          </form>
        </Card>

        {/* Active Session Registry */}
        <Card className="p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-[var(--sv-border)] pb-3">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[var(--sv-info)]" />
              <h2 className="text-sm font-bold text-[var(--sv-text-primary)] font-sans">Active Sessions</h2>
            </div>

            {sessions.length > 1 && (
              <button
                onClick={handleLogoutOtherDevices}
                className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-2.5 py-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
              >
                Logout Other Devices
              </button>
            )}
          </div>

          <p className="text-[11px] text-[var(--sv-text-muted)] leading-relaxed">
            Active Refresh Tokens registered in the database. Revoking session terminates renewal privileges immediately.
          </p>

          <ul className="space-y-2 pt-1">
            {loadingSessions && sessions.length === 0 ? (
              <p className="text-xs text-[var(--sv-text-muted)] animate-pulse">Loading active sessions...</p>
            ) : sessions.map((sess) => (
              <li
                key={sess.id}
                className={`flex items-center justify-between bg-[var(--sv-bg)] border p-3.5 rounded-xl text-xs ${
                  sess.isCurrent ? 'border-[var(--sv-info)]/30 bg-[var(--sv-info)]/[0.04]' : 'border-[var(--sv-border)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${sess.isCurrent ? 'bg-[var(--sv-info)]/10 text-[var(--sv-info)]' : 'bg-[var(--sv-border-hover)] text-[var(--sv-text-muted)]'}`}>
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--sv-text-primary)]">
                        {sess.isCurrent ? 'Current Browser Tab' : 'Other Connected Device'}
                      </span>
                      {sess.isCurrent && (
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[var(--sv-info)]/15 text-[var(--sv-info)] rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--sv-text-muted)] font-mono mt-0.5">
                      Session established: {new Date(sess.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-[var(--sv-text-muted)] font-mono uppercase block">Expires At</span>
                  <span className="font-mono text-[10px] text-[var(--sv-text-secondary)]">
                    {new Date(sess.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Cryptography Specs Card */}
        <Card className="p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-[var(--sv-border)] pb-3">
            <ShieldCheck className="w-4 h-4 text-[var(--sv-accent)]" />
            <h2 className="text-sm font-bold text-[var(--sv-text-primary)] font-sans">Encryption Protocols</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-[var(--sv-bg)] border border-[var(--sv-border)] p-4 rounded-xl space-y-1">
              <h3 className="flex items-center gap-2 text-[var(--sv-info)] text-xs font-bold font-sans">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Knowledge Architecture</span>
              </h3>
              <p className="text-[11px] text-[var(--sv-text-muted)] leading-relaxed">
                Master password never leaves browser memory. Key derivation executes purely client-side.
              </p>
            </div>

            <div className="bg-[var(--sv-bg)] border border-[var(--sv-border)] p-4 rounded-xl space-y-1">
              <h3 className="flex items-center gap-2 text-purple-400 text-xs font-bold font-sans">
                <KeyRound className="w-4 h-4" />
                <span>PBKDF2 Key Derivation</span>
              </h3>
              <p className="text-[11px] text-[var(--sv-text-muted)] leading-relaxed">
                100,005 SHA-256 iterations generate separate auth & vault encryption keys locally.
              </p>
            </div>

            <div className="bg-[var(--sv-bg)] border border-[var(--sv-border)] p-4 rounded-xl space-y-1">
              <h3 className="flex items-center gap-2 text-[var(--sv-accent)] text-xs font-bold font-sans">
                <Lock className="w-4 h-4" />
                <span>AES-GCM 256-bit Encryption</span>
              </h3>
              <p className="text-[11px] text-[var(--sv-text-muted)] leading-relaxed">
                Authenticates payload integrity and encrypts credentials using unique 12-byte IVs.
              </p>
            </div>

            <div className="bg-[var(--sv-bg)] border border-[var(--sv-border)] p-4 rounded-xl space-y-1">
              <h3 className="flex items-center gap-2 text-amber-400 text-xs font-bold font-sans">
                <Database className="w-4 h-4" />
                <span>Isolated Ciphertext Storage</span>
              </h3>
              <p className="text-[11px] text-[var(--sv-text-muted)] leading-relaxed">
                Database stores ciphertext payload only. Server cannot read stored password values.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Profile Updated Toast */}
      <Toast isVisible={!!toastMessage} message={toastMessage} type="success" />
    </DashboardLayout>
  );
}
