import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Auth Layout Wrapper
 * Encapsulates authentication screens with Framer Motion entrance animations and zero-knowledge branding.
 */
export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 font-sans selection:bg-emerald-600 selection:text-white relative overflow-hidden"
      style={{ backgroundColor: 'var(--sv-bg)' }}
    >
      {/* Subtle Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="sm:mx-auto sm:w-full sm:max-w-md text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">SecureVault</h1>
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
          <div 
            className="py-8 px-6 shadow-2xl rounded-2xl sm:px-10 backdrop-blur-md"
            style={{ backgroundColor: 'var(--sv-surface)', borderColor: 'var(--sv-border)', borderWidth: '1px' }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white tracking-tight font-sans">{title}</h2>
              {subtitle && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{subtitle}</p>}
            </div>
            {children}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
