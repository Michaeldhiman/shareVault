import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORY_COLORS } from '../constants/categories';
import { Star, Copy, Check, Eye, EyeOff, Edit2, Trash2, Globe, Shield } from 'lucide-react';
import { useVaultStore } from '../store/useVaultStore';
import Toast from './ui/Toast';

/**
 * Modern Credential Card Component
 * Encapsulates password masking, progressive disclosure, copy toast, and Framer Motion micro-interactions.
 */
export default function PasswordCard({ item, onEdit, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const toggleFavorite = useVaultStore((state) => state.toggleFavorite);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(item.username);
    triggerToast('Username copied to clipboard');
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(item.password);
    triggerToast('Password copied to clipboard');
  };

  const categoryStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;

  return (
    <>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.15 }}
        className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between group backdrop-blur-md"
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 group-hover:border-blue-500/40 transition-colors shadow-inner">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base tracking-tight leading-tight font-heading">
                  {item.website}
                </h3>
                <span
                  className={`inline-block mt-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${categoryStyle}`}
                >
                  {item.category}
                </span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 1.2 }}
              onClick={() => toggleFavorite(item.id)}
              className="text-slate-500 hover:text-amber-400 transition-colors p-1 rounded-lg hover:bg-slate-800/60"
              title={item.favorite ? 'Remove from favorites' : 'Mark as favorite'}
              aria-label={item.favorite ? 'Remove from favorites' : 'Mark as favorite'}
            >
              <Star className={`w-5 h-5 ${item.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </motion.button>
          </div>

          {/* Username / Email Field */}
          <div className="bg-slate-950/70 border border-slate-800/60 rounded-xl p-2.5 mb-2.5 flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Username / Email</p>
              <p className="text-xs text-slate-200 font-mono truncate mt-0.5">{item.username}</p>
            </div>
            <button
              onClick={handleCopyUsername}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Copy Username"
              aria-label="Copy username"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Password Field */}
          <div className="bg-slate-950/70 border border-slate-800/60 rounded-xl p-2.5 mb-3 flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Password</p>
              <p className="text-xs text-slate-200 font-mono truncate mt-0.5">
                {showPassword ? item.password : '••••••••••••'}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleCopyPassword}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                title="Copy Password"
                aria-label="Copy password"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notes preview if present */}
          {item.notes && (
            <div className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40 mb-3 truncate">
              <span className="text-slate-400 font-semibold">Notes:</span> {item.notes}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
          <span className="font-mono text-[11px]">{new Date(item.createdAt).toLocaleDateString()}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Edit Credential"
              aria-label="Edit credential"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Delete Credential"
              aria-label="Delete credential"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Copy Toast Notification */}
      <Toast isVisible={!!toastMessage} message={toastMessage} type="success" />
    </>
  );
}
