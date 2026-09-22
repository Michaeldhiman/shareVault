import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast Notification Component
 * Fixed positioning, ARIA live region, semantic variants.
 */
export default function Toast({ isVisible, message, type = 'success', onClose }) {
  const config = {
    success: {
      icon: CheckCircle,
      border: 'rgba(16, 185, 129, 0.25)',
      text: '#34D399',
    },
    error: {
      icon: AlertCircle,
      border: 'rgba(239, 68, 68, 0.25)',
      text: '#FCA5A5',
    },
    info: {
      icon: Info,
      border: 'rgba(59, 130, 246, 0.25)',
      text: '#93C5FD',
    },
  };

  const { icon: Icon, border, text } = config[type] || config.success;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-xs font-medium"
          style={{
            backgroundColor: 'var(--sv-surface-elevated)',
            border: `1px solid ${border}`,
            color: text,
          }}
          role="status"
          aria-live="polite"
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span>{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-1 p-0.5 rounded transition-opacity opacity-60 hover:opacity-100 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
