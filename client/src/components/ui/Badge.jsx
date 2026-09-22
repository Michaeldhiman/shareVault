import React from 'react';

/**
 * Unified Badge Component
 * Replaces scattered ad-hoc badge class strings with consistent variants.
 */

const VARIANTS = {
  default: {
    bg: 'rgba(255, 255, 255, 0.06)',
    border: 'rgba(255, 255, 255, 0.10)',
    text: 'var(--sv-text-secondary)',
  },
  success: {
    bg: 'rgba(16, 185, 129, 0.10)',
    border: 'rgba(16, 185, 129, 0.20)',
    text: '#34D399',
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.10)',
    border: 'rgba(245, 158, 11, 0.20)',
    text: '#FBBF24',
  },
  danger: {
    bg: 'rgba(239, 68, 68, 0.10)',
    border: 'rgba(239, 68, 68, 0.20)',
    text: '#FCA5A5',
  },
  info: {
    bg: 'rgba(59, 130, 246, 0.10)',
    border: 'rgba(59, 130, 246, 0.20)',
    text: '#93C5FD',
  },
  accent: {
    bg: 'var(--sv-accent-soft)',
    border: 'var(--sv-accent-border, rgba(16, 185, 129, 0.25))',
    text: '#34D399',
  },
};

// Category-specific badge colors
const CATEGORY_VARIANTS = {
  Work: { bg: 'rgba(59, 130, 246, 0.10)', border: 'rgba(59, 130, 246, 0.20)', text: '#60A5FA' },
  Social: { bg: 'rgba(168, 85, 247, 0.10)', border: 'rgba(168, 85, 247, 0.20)', text: '#C084FC' },
  Shopping: { bg: 'rgba(6, 182, 212, 0.10)', border: 'rgba(6, 182, 212, 0.20)', text: '#22D3EE' },
  Finance: { bg: 'rgba(16, 185, 129, 0.10)', border: 'rgba(16, 185, 129, 0.20)', text: '#34D399' },
  Education: { bg: 'rgba(99, 102, 241, 0.10)', border: 'rgba(99, 102, 241, 0.20)', text: '#818CF8' },
  Other: { bg: 'rgba(148, 163, 184, 0.10)', border: 'rgba(148, 163, 184, 0.20)', text: '#94A3B8' },
};

export default function Badge({
  children,
  variant = 'default',
  category,
  size = 'sm',
  icon: Icon,
  className = '',
  ...props
}) {
  const colors = category
    ? CATEGORY_VARIANTS[category] || CATEGORY_VARIANTS.Other
    : VARIANTS[variant] || VARIANTS.default;

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full whitespace-nowrap ${sizes[size]} ${className}`}
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}
