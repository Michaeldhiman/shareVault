import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Accessible Button Component
 * Features Framer Motion press states, loading spinner, and semantic variants.
 * Primary accent: Deep, authoritative emerald green (SecureVault brand).
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  isDisabled = false,
  icon: Icon = null,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl whitespace-nowrap select-none cursor-pointer transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sv-bg)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold tracking-tight shadow-md shadow-emerald-950/40 border border-emerald-500/40 active:scale-[0.98]',
    secondary:
      'bg-[#181B23] hover:bg-[#202530] active:bg-[#14161D] text-slate-200 hover:text-white border border-white/10 hover:border-white/20 shadow-sm active:scale-[0.98]',
    danger:
      'bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/25 shadow-sm active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-white/[0.06] active:bg-white/[0.1] text-slate-300 hover:text-white active:scale-[0.98]',
    outline:
      'bg-transparent hover:bg-white/[0.04] active:bg-white/[0.08] border border-white/10 hover:border-white/25 text-slate-200 hover:text-white active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 gap-2',
    lg: 'text-sm sm:text-base font-semibold px-5 sm:px-6 py-3 gap-2.5',
  };

  return (
    <motion.button
      whileHover={isDisabled || isLoading ? {} : { y: -1 }}
      whileTap={isDisabled || isLoading ? {} : { scale: 0.98, y: 0 }}
      transition={{ duration: 0.12 }}
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </motion.button>
  );
}
