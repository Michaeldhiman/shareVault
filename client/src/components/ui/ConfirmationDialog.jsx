import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';

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
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      maxWidth="max-w-md"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: isDanger ? 'rgba(239, 68, 68, 0.1)' : 'var(--sv-accent-soft)',
            borderColor: isDanger ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: isDanger ? 'var(--sv-danger, #EF4444)' : 'var(--sv-accent)',
            borderWidth: '1px',
            borderStyle: 'solid',
          }}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--sv-text-secondary)' }}>
            {message}
          </p>
        </div>
      </div>

      <div
        className="flex items-center justify-end gap-3 mt-6 pt-4"
        style={{ borderTop: '1px solid var(--sv-border)' }}
      >
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
    </Modal>
  );
}
