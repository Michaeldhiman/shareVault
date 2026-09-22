import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Lock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

export default function FinalCTA() {
  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ borderTop: '1px solid var(--sv-border)' }}
      aria-labelledby="cta-heading"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% 50%, rgba(16,185,129,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 70% 30%, rgba(94,106,210,0.06) 0%, transparent 60%)
          `,
        }}
        aria-hidden="true"
      />

      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          className="w-[600px] h-[600px] rounded-full"
          style={{ border: '1px solid rgba(16,185,129,0.06)' }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <div className="container-xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-10"
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.06))',
              border: '1px solid rgba(16,185,129,0.3)',
              boxShadow: '0 0 60px rgba(16,185,129,0.2), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <Shield size={36} className="text-emerald-400" strokeWidth={1.5} aria-hidden="true" />
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
              }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
          </div>
        </motion.div>

        <motion.h2
          id="cta-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--sv-text-primary)] leading-tight mb-6 max-w-3xl mx-auto tracking-tight"
        >
          Your digital life<br />
          <span className="text-[var(--sv-accent)]">deserves better security.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-sans text-lg sm:text-xl text-[var(--sv-text-secondary)] max-w-lg mx-auto mb-12"
        >
          Client-side encryption. Zero-knowledge architecture.
          Start free, stay secure forever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link to="/register" aria-label="Create your free SecureVault account" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <Shield size={17} strokeWidth={2.5} className="shrink-0" />
              <span>Create free account</span>
              <ArrowRight size={15} className="shrink-0" />
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <Lock size={16} className="shrink-0" />
              <span>Sign in to vault</span>
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-sans text-[var(--sv-text-secondary)]"
        >
          {[
            { icon: Zap, text: 'Free forever. No credit card.' },
            { icon: Shield, text: 'AES-256 encrypted.' },
            { icon: Lock, text: 'Zero-knowledge architecture.' },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2">
              <Icon size={13} className="text-emerald-400" />
              {text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
