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
    'inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:bg-blue-700',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60',
    danger: 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20',
    ghost: 'bg-transparent hover:bg-slate-800/80 text-slate-400 hover:text-white',
    outline: 'bg-transparent border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 gap-2',
    lg: 'text-sm font-semibold px-5 py-3 gap-2.5',
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
      <span>{children}</span>
    </motion.button>
  );
}
