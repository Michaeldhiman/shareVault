import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Animated Toast Notification Component
 */
export default function Toast({ isVisible, message, type = 'success', onClose }) {
  const icons = {
    success: <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-slate-900/95 text-emerald-300',
    error: 'border-rose-500/30 bg-slate-900/95 text-rose-300',
    info: 'border-blue-500/30 bg-slate-900/95 text-blue-300',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md text-xs font-medium"
        >
          <div className={`flex items-center gap-2.5 ${borders[type] || borders.success}`}>
            {icons[type]}
            <span>{message}</span>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-2 text-slate-500 hover:text-white p-0.5"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
