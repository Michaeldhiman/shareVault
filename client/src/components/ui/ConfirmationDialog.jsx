import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

/**
 * Accessible Confirmation Modal Dialog Component
 * Replaces native window.confirm for destructive or high-stakes actions.
 */
export default function ConfirmationDialog({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl p-6 shadow-2xl relative z-10"
          >
            <button
              onClick={onCancel}
              className="absolute right-4 top-4 text-slate-500 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isDanger
                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800/80">
              <Button variant="ghost" onClick={onCancel} isDisabled={isLoading}>
                {cancelText}
              </Button>
              <Button
                variant={isDanger ? 'danger' : 'primary'}
                onClick={onConfirm}
                isLoading={isLoading}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
