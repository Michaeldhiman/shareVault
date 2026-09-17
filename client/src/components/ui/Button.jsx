import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Accessible Button Component
 * Features Framer Motion press states, loading spinner, and semantic variants.
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'emerald'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  isDisabled = false,
  icon: Icon = null,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C10] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/20 active:bg-blue-700 border border-blue-500/30',
    secondary:
      'bg-[#181B26] hover:bg-[#202433] text-slate-200 border border-white/10 hover:border-white/20 active:bg-[#151822]',
    danger:
      'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 active:bg-rose-500/30',
    emerald:
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 border border-emerald-500/30',
    ghost:
      'bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 active:bg-white/10',
    outline:
      'bg-transparent border border-white/10 hover:border-white/20 text-slate-300 hover:text-white active:bg-white/5',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-3.5 py-2 gap-2',
    lg: 'text-sm font-semibold px-4.5 py-2.5 gap-2.5',
  };

  return (
    <motion.button
      whileHover={isDisabled || isLoading ? {} : { scale: 1.01 }}
      whileTap={isDisabled || isLoading ? {} : { scale: 0.98 }}
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
      {children && <span>{children}</span>}
    </motion.button>
  );
}
