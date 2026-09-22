import React from 'react';

/**
 * Skeleton Loader Primitive
 * Base color matches loaded content surfaces for seamless transition.
 */
export default function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-36 w-full rounded-2xl',
    button: 'h-10 w-28 rounded-xl',
  };

  return (
    <div
      className={`animate-pulse rounded-lg ${variants[variant] || variants.text} ${className}`}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
      aria-hidden="true"
    />
  );
}
