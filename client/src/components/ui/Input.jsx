import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Standardized Input Component
 * Supports: labels, error states, icon adornments, password toggle, accessibility.
 */
const Input = forwardRef(function Input(
  {
    label,
    id,
    type = 'text',
    error,
    helperText,
    icon: Icon,
    showPasswordToggle = false,
    showPassword,
    onTogglePassword,
    className = '',
    inputClassName = '',
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
          style={{ color: 'var(--sv-text-secondary)' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--sv-text-muted)' }}
          />
        )}
        <input
          ref={ref}
          id={inputId}
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={`w-full rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150
            placeholder:text-[var(--sv-text-muted)]
            focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : ''}
            ${showPasswordToggle ? 'pr-10' : ''}
            ${inputClassName}`}
          style={{
            backgroundColor: 'var(--sv-bg)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: error ? 'rgba(239,68,68,0.4)' : 'var(--sv-border)',
            color: 'var(--sv-text-primary)',
          }}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors cursor-pointer"
            style={{ color: 'var(--sv-text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sv-text-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sv-text-muted)')}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-400 mt-1" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="text-xs mt-1" style={{ color: 'var(--sv-text-muted)' }}>
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
