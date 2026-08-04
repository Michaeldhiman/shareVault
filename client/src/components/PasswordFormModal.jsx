import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CATEGORIES } from '../constants/categories';
import { useAuthStore } from '../store/useAuthStore';
import { useVaultStore } from '../store/useVaultStore';
import { X, KeyRound, Loader2, Sparkles } from 'lucide-react';
import PasswordStrength from './PasswordStrength';
import Button from './ui/Button';

export default function PasswordFormModal({ itemToEdit, onClose, onOpenGenerator }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const passwordValue = watch('password', '');
  const encryptionKey = useAuthStore((state) => state.encryptionKey);
  const addVaultItem = useVaultStore((state) => state.addVaultItem);
  const updateVaultItem = useVaultStore((state) => state.updateVaultItem);
  const loading = useVaultStore((state) => state.loading);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {itemToEdit ? 'Edit Credential' : 'Add New Credential'}
            </h3>
            <p className="text-xs text-slate-400">
              Encrypted locally using AES-GCM before saving
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Website / App Name
              </label>
              <input
                type="text"
                placeholder="Google, GitHub, Netflix..."
                {...register('website', { required: 'Website name is required' })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {errors.website && <p className="text-xs text-rose-400 mt-1">{errors.website.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Category
              </label>
              <select
                {...register('category')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Username / Email
            </label>
            <input
              type="text"
              placeholder="user@example.com"
              {...register('username', { required: 'Username is required' })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
            {errors.username && <p className="text-xs text-rose-400 mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <button
                type="button"
                onClick={onOpenGenerator}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Generator</span>
              </button>
            </div>
            <input
              type="text"
              placeholder="••••••••••••"
              {...register('password', { required: 'Password is required' })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
            {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
            <PasswordStrength password={passwordValue} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Secure Notes (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Recovery codes, pin, security questions..."
              {...register('notes')}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            ></textarea>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="favorite"
              {...register('favorite')}
              className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
            />
            <label htmlFor="favorite" className="text-xs text-slate-300 select-none">
              Mark as Favorite
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/80">
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
              className="shadow-blue-600/20"
            >
              {loading
                ? 'Encrypting AES-GCM & Saving...'
                : itemToEdit
                ? 'Save Changes'
                : 'Encrypt & Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
