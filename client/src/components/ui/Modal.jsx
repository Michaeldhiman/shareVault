import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Accessible Modal Component
 * Features: focus trap, Escape key dismiss, ARIA dialog roles, backdrop click dismiss.
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = 'max-w-lg',
  showClose = true,
  closeOnBackdrop = true,
  className = '',
}) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    requestAnimationFrame(() => {
      const modal = modalRef.current;
      if (modal) {
        const autoFocus = modal.querySelector('[autofocus], input, button');
        autoFocus?.focus();
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (closeOnBackdrop && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 ${maxWidth} w-full rounded-2xl p-6 shadow-2xl ${className}`}
            style={{
              backgroundColor: 'var(--sv-surface-elevated)',
              border: '1px solid var(--sv-border-hover)',
            }}
          >
            {showClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer"
                style={{ color: 'var(--sv-text-muted)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sv-text-secondary)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--sv-text-muted)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold mb-4"
                style={{ color: 'var(--sv-text-primary)' }}
              >
                {title}
              </h2>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
