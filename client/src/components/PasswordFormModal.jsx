import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CATEGORIES } from '../constants/categories';
import { useAuthStore } from '../store/useAuthStore';
import { useVaultStore } from '../store/useVaultStore';
import { KeyRound, Sparkles, AlertTriangle, Check } from 'lucide-react';
import PasswordStrength from './PasswordStrength';
import { checkPasswordBreach } from '../utils/hibpService';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';

export default function PasswordFormModal({ itemToEdit, onClose, onOpenGenerator }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const passwordValue = watch('password', '');
  const encryptionKey = useAuthStore((state) => state.encryptionKey);
  const addVaultItem = useVaultStore((state) => state.addVaultItem);
  const updateVaultItem = useVaultStore((state) => state.updateVaultItem);
  const loading = useVaultStore((state) => state.loading);

  const [hibpStatus, setHibpStatus] = useState(null);
  const [breachCount, setBreachCount] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!passwordValue) {
      setHibpStatus(null);
      return;
    }

    setHibpStatus('checking');
    const delayDebounce = setTimeout(async () => {
      const res = await checkPasswordBreach(passwordValue);
      if (res.error) {
        setHibpStatus('error');
      } else if (res.found) {
        setHibpStatus('compromised');
        setBreachCount(res.breachCount);
      } else {
        setHibpStatus('safe');
      }
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [passwordValue]);

  useEffect(() => {
    if (itemToEdit) {
      setValue('website', itemToEdit.website);
      setValue('category', itemToEdit.category);
      setValue('username', itemToEdit.username === '[Decryption Error]' ? '' : itemToEdit.username);
      setValue('password', itemToEdit.password === '[Decryption Error]' ? '' : itemToEdit.password);
      setValue('notes', itemToEdit.notes === '[Decryption Error]' ? '' : itemToEdit.notes || '');
      setValue('favorite', itemToEdit.favorite || false);
    }
  }, [itemToEdit, setValue]);

  const onSubmit = async (data) => {
    let result;
    if (itemToEdit) {
      result = await updateVaultItem(itemToEdit.id, data, encryptionKey);
    } else {
      result = await addVaultItem(data, encryptionKey);
    }
    if (result.success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title=""
      maxWidth="max-w-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: 'var(--sv-accent-soft)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: 'var(--sv-accent)',
          }}
        >
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-sans" style={{ color: 'var(--sv-text-primary)' }}>
            {itemToEdit ? 'Edit Credential' : 'Add New Credential'}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--sv-text-secondary)' }}>
            Encrypted locally using client-side AES-GCM 256-bit
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Website / App Name"
            id="website"
            placeholder="Google, GitHub, Netflix..."
            {...register('website', { required: 'Website name is required' })}
            error={errors.website?.message}
          />

          <div>
            <label htmlFor="category" className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--sv-text-secondary)' }}>
              Category
            </label>
            <select
              id="category"
              {...register('category')}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500/50 cursor-pointer font-sans"
              style={{
                backgroundColor: 'var(--sv-bg)',
                border: '1px solid var(--sv-border)',
                color: 'var(--sv-text-primary)',
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ backgroundColor: 'var(--sv-surface)', color: 'var(--sv-text-primary)' }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Username / Email"
          id="username"
          placeholder="user@example.com"
          {...register('username', { required: 'Username is required' })}
          error={errors.username?.message}
          inputClassName="font-mono"
        />

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--sv-text-secondary)' }}>
              Password
            </label>
            <button
              type="button"
              onClick={onOpenGenerator}
              className="text-xs flex items-center gap-1 font-semibold focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded px-1"
              style={{ color: 'var(--sv-accent)' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Generator</span>
            </button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••••••"
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message}
            showPasswordToggle={true}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            inputClassName="font-mono"
          />
          <div className="mt-2">
            <PasswordStrength password={passwordValue} />
          </div>

          {hibpStatus === 'checking' && (
            <p className="text-[10px] mt-1.5 animate-pulse" style={{ color: 'var(--sv-text-secondary)' }}>
              Verifying password safety against HIBP dataset...
            </p>
          )}
          {hibpStatus === 'compromised' && (
            <div className="mt-2.5 p-3 rounded-xl text-xs" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#FCA5A5' }}>
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: '#FCA5A5' }} />
                <span>Found in {breachCount.toLocaleString()} public breaches</span>
              </p>
              <p className="text-[10px] mt-1 opacity-80" style={{ color: '#FCA5A5' }}>
                Using leaked passwords increases account vulnerability. Consider rotating.
              </p>
            </div>
          )}
          {hibpStatus === 'safe' && (
            <p className="text-[10px] mt-1.5 flex items-center gap-1.5" style={{ color: '#34D399' }}>
              <Check className="w-3 h-3" />
              <span>Not found in public breach records.</span>
            </p>
          )}
          {hibpStatus === 'error' && (
            <p className="text-[10px] mt-1.5 flex items-center gap-1.5" style={{ color: '#FBBF24' }}>
              <span>Unable to connect to breach database.</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--sv-text-secondary)' }}>
            Secure Notes (Optional)
          </label>
          <textarea
            id="notes"
            rows="3"
            placeholder="Recovery codes, PIN, security questions..."
            {...register('notes')}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500/50 font-sans"
            style={{
              backgroundColor: 'var(--sv-bg)',
              border: '1px solid var(--sv-border)',
              color: 'var(--sv-text-primary)',
            }}
          ></textarea>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="favorite"
            {...register('favorite')}
            className="rounded focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
            style={{
              backgroundColor: 'var(--sv-bg)',
              borderColor: 'var(--sv-border)',
              color: 'var(--sv-accent)',
            }}
          />
          <label htmlFor="favorite" className="text-xs select-none cursor-pointer" style={{ color: 'var(--sv-text-secondary)' }}>
            Mark as Favorite Bookmark
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--sv-border)' }}>
          <Button
            variant="ghost"
            onClick={onClose}
            isDisabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="focus-visible:ring-2 focus-visible:ring-emerald-500/40"
          >
            {loading ? 'Encrypting AES-GCM...' : itemToEdit ? 'Save Changes' : 'Encrypt & Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
