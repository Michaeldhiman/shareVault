import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Key, Server } from 'lucide-react';

const LOGOS = [
  { name: 'AES-256 Encryption', icon: Shield, color: '#10B981' },
  { name: 'Zero-Knowledge', icon: Lock, color: '#5E6AD2' },
  { name: 'PBKDF2 Derivation', icon: Key, color: '#F59E0B' },
  { name: 'End-to-End Secure', icon: Server, color: '#8B5CF6' },
];

const STATS = [
  { value: '256-bit', label: 'AES-GCM Encryption' },
  { value: '100K', label: 'PBKDF2 Iterations' },
  { value: '100%', label: 'Zero-Knowledge' },
  { value: 'Client', label: 'Side Encryption' },
];

function LogoItem({ logo, index }) {
  const Icon = logo.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center px-6 py-3 rounded-xl transition-all duration-300 group cursor-default"
      style={{ border: '1px solid var(--sv-border)' }}
      whileHover={{ borderColor: 'var(--sv-border-hover)', background: 'var(--sv-surface-hover)' }}
      title={logo.name}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="transition-opacity duration-300 opacity-60 group-hover:opacity-100" style={{ color: logo.color }} />
        <span className="text-sm font-sans font-medium text-[var(--sv-text-secondary)] group-hover:text-[var(--sv-text-primary)] transition-colors duration-300 tracking-tight">
          {logo.name}
        </span>
      </div>
    </motion.div>
  );
}

export default function TrustedBy() {
  return (
    <section className="section-padding-sm relative overflow-hidden" style={{ borderTop: '1px solid var(--sv-border)' }} aria-label="Security indicators">
      <div className="absolute inset-x-0 top-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)' }} aria-hidden="true" />
      <div className="container-xl">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center text-xs font-sans font-semibold tracking-[0.18em] uppercase text-[var(--sv-text-muted)] mb-8">
          Powered by proven cryptographic standards
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          {LOGOS.map((logo, i) => (
            <LogoItem key={logo.name} logo={logo} index={i} />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="text-center">
              <p className="font-sans text-3xl lg:text-4xl font-bold text-[var(--sv-accent)] mb-1.5">{stat.value}</p>
              <p className="font-sans text-sm text-[var(--sv-text-secondary)]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
