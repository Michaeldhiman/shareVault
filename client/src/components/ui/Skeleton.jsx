import React from 'react';

/**
 * Animated Pulse Skeleton Loader Component
 * Replaces generic spinners to eliminate layout shifts.
 */
export default function Skeleton({ className = '', variant = 'text' }) {
  const baseStyles = 'animate-pulse bg-slate-800/60 rounded-lg';

  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-36 w-full rounded-2xl',
    button: 'h-10 w-28 rounded-xl',
  };

  return <div className={`${baseStyles} ${variants[variant] || ''} ${className}`} />;
}
