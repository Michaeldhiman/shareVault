import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Shield, ArrowRight, Lock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

function MagneticLink({ to, children, className, primary = false }) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 300, damping: 20 });
  const y = useSpring(rawY, { stiffness: 300, damping: 20 });

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    rawY.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };

  const handleLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <motion.div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ x, y }}>
      <Link to={to} className={className}>{children}</Link>
    </motion.div>
  );
}

export default function FinalCTA() {
  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      aria-labelledby="cta-heading"
    >
      {/* Large nebula glow */}
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

      {/* Animated ring */}
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
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          className="w-[800px] h-[800px] rounded-full"
          style={{ border: '1px solid rgba(94,106,210,0.04)' }}
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <div className="container-xl relative z-10 text-center">
        {/* Central vault icon */}
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
          className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6 max-w-3xl mx-auto"
          style={{ letterSpacing: '-0.03em' }}
        >
          Your digital life<br />
          <span className="italic text-gradient-green">deserves better.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-display text-xl text-white/65 max-w-lg mx-auto mb-12"
        >
          Join 500,000+ people who sleep better at night.
          Start free, stay secure forever.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <MagneticLink
            to="/register"
            primary
            className="btn-primary text-base px-8 py-4"
            aria-label="Create your free SecureVault account"
          >
            <Shield size={18} strokeWidth={2.5} />
            Create free account
            <ArrowRight size={16} />
          </MagneticLink>

          <MagneticLink
            to="/login"
            className="btn-secondary text-base px-7 py-4"
          >
            <Lock size={16} />
            Sign in to vault
          </MagneticLink>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-display text-white/40"
        >
          {[
            { icon: Zap, text: 'Free forever. No credit card.' },
            { icon: Shield, text: 'AES-256 encrypted.' },
            { icon: Lock, text: 'Zero-knowledge architecture.' },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2">
              <Icon size={11} className="text-emerald-500/40" />
              {text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
