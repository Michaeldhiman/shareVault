import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import { Lock, ShieldCheck } from 'lucide-react';

export default function UnlockVaultModal() {
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const unlockVault = useAuthStore((state) => state.unlockVault);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!masterPassword) return;
    setError(null);

    const result = await unlockVault(masterPassword);
    if (!result.success) {
      setError(result.message || 'Incorrect Master Password');
    }
  };

  const handleSignOut = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => {}}
      showClose={false}
      closeOnBackdrop={false}
      maxWidth="max-w-md"
    >
      <div className="text-center mb-6">
        <div 
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3 shadow-lg"
          style={{
            backgroundColor: 'var(--sv-accent-soft)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: 'var(--sv-accent)',
            boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.1)',
          }}
        >
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold font-sans" style={{ color: 'var(--sv-text-primary)' }}>
          Unlock Your Vault
        </h3>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--sv-text-secondary)' }}>
          Enter your Master Password to derive your AES-256 key via PBKDF2 locally in memory.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-xs font-medium" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleUnlock} className="space-y-4">
        <Input
          label="Master Password"
          id="unlock-password"
          type="password"
          placeholder="••••••••••••"
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
          showPasswordToggle={true}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          autoFocus
        />

        <Button
          type="submit"
          variant="primary"
          icon={ShieldCheck}
          isLoading={loading}
          isDisabled={!masterPassword}
          className="w-full justify-center py-3 font-semibold focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        >
          {loading ? 'Deriving 256-bit Key & Unlocking...' : 'Decrypt Vault'}
        </Button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleSignOut}
            className="text-xs font-semibold focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded px-2 py-1 transition-colors"
            style={{ color: 'var(--sv-text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--sv-text-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sv-text-muted)'}
          >
            Sign Out
          </button>
        </div>
      </form>
    </Modal>
  );
}
