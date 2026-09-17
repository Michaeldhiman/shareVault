import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORY_COLORS } from '../constants/categories';
import { Star, Copy, Check, Eye, EyeOff, Edit2, Trash2, Globe, ShieldCheck } from 'lucide-react';
import { useVaultStore } from '../store/useVaultStore';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import Toast from './ui/Toast';

const getWebsiteAvatar = (name) => {
  const cleanName = name ? name.trim().toUpperCase() : 'W';
  const initial = cleanName.charAt(0);

  const colors = [
    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  ];

  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;

  return { initial, classes: colors[colorIndex] };
};

/**
 * Modern SaaS Credential Card Component
 */
export default function PasswordCard({ item, onEdit, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const toggleFavorite = useVaultStore((state) => state.toggleFavorite);

  const triggerToast = (msg, field) => {
    setCopiedField(field);
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
      setCopiedField(null);
    }, 2000);
  };

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(item.username);
    triggerToast('Username copied to clipboard', 'username');
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(item.password);
    triggerToast('Password copied to clipboard', 'password');
  };

  const categoryStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
  const avatar = getWebsiteAvatar(item.website);

  const strength = evaluatePasswordStrength(item.password);
  const getStrengthBadge = () => {
    if (strength.score >= 4) {
      return { label: 'Strong', style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    }
    if (strength.score >= 3) {
      return { label: 'Fair', style: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
    }
    if (strength.score >= 2) {
      return { label: 'Moderate', style: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    }
    return { label: 'Weak', style: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
  };

  const strengthBadge = getStrengthBadge();

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        className="bg-[#12141C] border border-white/[0.07] hover:border-white/20 rounded-2xl p-5 shadow-sm flex flex-col justify-between group backdrop-blur-md"
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${avatar.classes}`}>
                {avatar.initial}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white text-sm tracking-tight leading-tight truncate font-heading group-hover:text-blue-400 transition-colors">
                  {item.website}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`inline-block text-[9px] font-semibold px-2 py-0.5 rounded border ${categoryStyle}`}>
                    {item.category}
                  </span>
                  <span className={`inline-block text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border ${strengthBadge.style}`}>
                    {strengthBadge.label}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 1.2 }}
              onClick={() => toggleFavorite(item.id)}
              className="text-slate-500 hover:text-amber-400 transition-colors p-1.5 rounded-lg hover:bg-white/[0.06] shrink-0"
              title={item.favorite ? 'Remove from favorites' : 'Mark as favorite'}
              aria-label={item.favorite ? 'Remove from favorites' : 'Mark as favorite'}
            >
              <Star className={`w-4 h-4 ${item.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </motion.button>
          </div>

          {/* Username / Email Field */}
          <div className="bg-[#0B0C10] border border-white/[0.06] rounded-xl p-2.5 mb-2.5 flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <p className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider">Username / Email</p>
              <p className="text-xs text-slate-200 font-mono truncate mt-0.5">{item.username}</p>
            </div>
            <button
              onClick={handleCopyUsername}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors shrink-0"
              title="Copy Username"
              aria-label="Copy username"
            >
              {copiedField === 'username' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Password Field */}
          <div className="bg-[#0B0C10] border border-white/[0.06] rounded-xl p-2.5 mb-3 flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <p className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider">Password</p>
              <p className="text-xs text-slate-200 font-mono truncate mt-0.5">
                {showPassword ? item.password : '••••••••••••'}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleCopyPassword}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors"
                title="Copy Password"
                aria-label="Copy password"
              >
                {copiedField === 'password' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Notes preview if present */}
          {item.notes && (
            <div className="text-xs text-slate-400 bg-[#0B0C10]/60 p-2.5 rounded-xl border border-white/[0.05] mb-3 truncate">
              <span className="text-slate-400 font-semibold">Notes:</span> {item.notes}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-slate-400">
          <span className="font-mono text-[10px] text-slate-400">
            Saved {new Date(item.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-white/[0.06] transition-colors"
              title="Edit Credential"
              aria-label="Edit credential"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/[0.06] transition-colors"
              title="Delete Credential"
              aria-label="Delete credential"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Copy Toast Notification */}
      <Toast isVisible={!!toastMessage} message={toastMessage} type="success" />
    </>
  );
}
