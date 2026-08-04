import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

/**
 * Auth Layout Wrapper
 * Encapsulates authentication screens with Framer Motion entrance animations and zero-knowledge branding.
 */
export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-4 shadow-lg shadow-blue-500/10 backdrop-blur-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">SecureVault</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium">
          Zero-Knowledge Client-Side Encrypted Vault
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-slate-900/90 border border-slate-800/90 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 backdrop-blur-md">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight font-heading">{title}</h2>
            {subtitle && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{subtitle}</p>}
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
