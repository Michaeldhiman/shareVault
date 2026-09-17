import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Zap, RefreshCw, Eye, Lock, Smartphone,
  Globe, Copy, CheckCircle2, Star, ArrowRight
} from 'lucide-react';

const FEATURES = [
  {
    id: 'vault',
    icon: Shield,
    color: '#10B981',
    colorBg: 'rgba(16,185,129,0.08)',
    colorBorder: 'rgba(16,185,129,0.2)',
    badge: 'Core',
    title: 'Encrypted Vault',
    subtitle: 'Everything in one place. Safe from everyone.',
    description: "Store unlimited passwords, secure notes, credit cards, and identities. Organized, searchable, and always accessible. Encrypted so completely that even we can't read it.",
    size: 'large',
  },
  {
    id: 'generator',
    icon: Zap,
    color: '#F59E0B',
    colorBg: 'rgba(245,158,11,0.08)',
    colorBorder: 'rgba(245,158,11,0.2)',
    badge: 'Smart',
    title: 'Password Generator',
    subtitle: 'Unguessable by design.',
    description: 'Generate cryptographically secure, high-entropy passwords with custom length, character sets, and complexity. Never reuse. Never compromise.',
    size: 'small',
  },
  {
    id: 'breach',
    icon: Eye,
    color: '#EF4444',
    colorBg: 'rgba(239,68,68,0.08)',
    colorBorder: 'rgba(239,68,68,0.2)',
    badge: 'Protection',
    title: 'Breach Monitoring',
    subtitle: 'Know before they do.',
    description: 'Continuous dark web monitoring using k-anonymity. Get instant alerts when any of your credentials appear in a data breach — before attackers exploit them.',
    size: 'small',
  },
  {
    id: 'autofill',
    icon: Globe,
    color: '#5E6AD2',
    colorBg: 'rgba(94,106,210,0.08)',
    colorBorder: 'rgba(94,106,210,0.2)',
    badge: 'Seamless',
    title: 'Auto-Fill Everywhere',
    subtitle: 'Log in faster than ever.',
    description: 'Smart browser integration that recognizes sites and fills credentials instantly. Works across all your devices, all your browsers, all your sites.',
    size: 'small',
  },
  {
    id: 'sync',
    icon: RefreshCw,
    color: '#10B981',
    colorBg: 'rgba(16,185,129,0.08)',
    colorBorder: 'rgba(16,185,129,0.2)',
    badge: 'Real-time',
    title: 'Cross-Device Sync',
    subtitle: 'Update once. Available everywhere.',
    description: 'Your vault syncs instantly across all your devices. Change a password on your laptop and it\'s available on your phone before you put your laptop down.',
    size: 'small',
  },
  {
    id: 'sharing',
    icon: Lock,
    color: '#8B5CF6',
    colorBg: 'rgba(139,92,246,0.08)',
    colorBorder: 'rgba(139,92,246,0.2)',
    badge: 'Team',
    title: 'Secure Sharing',
    subtitle: 'Share credentials. Not your security.',
    description: 'Share passwords with family or teammates through encrypted channels. Revoke access instantly. Full audit logs. Zero plaintext transmission.',
    size: 'large',
  },
];

function FeatureCard({ feature, index }) {
  const [copied, setCopied] = useState(false);
  const Icon = feature.icon;
  const isLarge = feature.size === 'large';

  const handleCopy = (e) => {
    e.stopPropagation();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card p-7 lg:p-8 relative overflow-hidden group flex flex-col ${isLarge ? 'md:col-span-2' : ''}`}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 50% 40% at 0% 100%, ${feature.color}08, transparent)` }}
        aria-hidden="true"
      />

      {/* Badge + icon */}
      <div className="flex items-start justify-between mb-6">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: feature.colorBg, border: `1px solid ${feature.colorBorder}` }}
        >
          <Icon size={18} style={{ color: feature.color }} strokeWidth={2} aria-hidden="true" />
        </div>
        <span
          className="text-[10px] font-display font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{
            background: feature.colorBg,
            border: `1px solid ${feature.colorBorder}`,
            color: feature.color,
          }}
        >
          {feature.badge}
        </span>
      </div>

      {/* Content */}
      <h3 className="font-display text-lg font-semibold text-white/90 mb-2">{feature.title}</h3>
      <p className="font-display text-sm font-medium text-white/65 mb-3">{feature.subtitle}</p>
      <p className="font-display text-sm text-white/55 leading-relaxed flex-1">{feature.description}</p>

      {/* Interactive demo element for generator card */}
      {feature.id === 'generator' && (
        <div
          className="mt-6 flex items-center justify-between px-3 py-2 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="font-mono text-xs text-emerald-300/70 truncate">Kx9#mP$qR2nLv!Wt</span>
          <button
            onClick={handleCopy}
            className="ml-2 p-1.5 rounded-md hover:bg-white/8 transition-colors duration-150 flex-shrink-0"
            aria-label="Copy generated password"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <CheckCircle2 size={13} className="text-emerald-400" />
                </motion.div>
              ) : (
                <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Copy size={13} className="text-white/40" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      )}

      {/* Strength bar for vault */}
      {feature.id === 'vault' && (
        <div className="mt-6 space-y-2">
          {['GitHub', 'Netflix', 'Banking', 'Email'].map((site, i) => (
            <div key={site} className="flex items-center gap-3">
              <span className="text-[11px] font-display text-white/50 w-14 flex-shrink-0">{site}</span>
              <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, #10B981, #059669)` }}
                  initial={{ width: 0 }}
                  whileInView={{ width: ['95%', '88%', '100%', '92%'][i] }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="text-[11px] font-display text-emerald-400/70 w-10 text-right flex-shrink-0">
                {['95', '88', '100', '92'][i]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Device icons for sync */}
      {feature.id === 'sync' && (
        <div className="mt-6 flex items-center gap-2">
          {['💻', '📱', '🖥️', '⌚'].map((d, i) => (
            <motion.div
              key={d}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-base"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {d}
            </motion.div>
          ))}
          <div
            className="ml-2 flex items-center gap-1.5 text-[11px] font-display text-emerald-400"
            style={{ paddingLeft: '4px' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live sync
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="section-padding relative overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      aria-labelledby="features-heading"
    >
      {/* Background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(94,106,210,1) 0%, transparent 60%)', filter: 'blur(80px)' }}
        aria-hidden="true"
      />

      <div className="container-xl relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="badge-green mx-auto mb-6"
          >
            <Star size={10} className="fill-emerald-400 text-emerald-400" />
            Everything you need
          </motion.div>

          <motion.h2
            id="features-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            Everything you need.<br />
            <span className="italic text-white/40">Nothing you don't.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-lg text-white/60"
          >
            Built for people who care about their security without compromising their sanity.
          </motion.p>
        </div>

        {/* Feature bento grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.id} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
