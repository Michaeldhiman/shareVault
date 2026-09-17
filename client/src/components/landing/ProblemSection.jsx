import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Eye, Brain, Shield } from 'lucide-react';

const PAIN_POINTS = [
  {
    id: 'reuse',
    icon: RefreshCw,
    iconColor: '#EF4444',
    iconBg: 'rgba(239,68,68,0.1)',
    iconBorder: 'rgba(239,68,68,0.2)',
    stat: '65%',
    statLabel: 'of people reuse the same password across sites',
    headline: 'One breach. Every account.',
    body: "When you reuse 'Summer2024!' on 17 different sites, one hacked database doesn't just cost you one account. It costs you everything.",
    before: '"Summer2024!"',
    after: 'Kx9#mP$qR2nLv!Wt',
  },
  {
    id: 'forget',
    icon: Brain,
    iconColor: '#F59E0B',
    iconBg: 'rgba(245,158,11,0.1)',
    iconBorder: 'rgba(245,158,11,0.2)',
    stat: '3 min',
    statLabel: 'average time lost resetting forgotten passwords per week',
    headline: 'Your memory has limits. Hackers know that.',
    body: "You can't memorize 200 unique, complex passwords. So you simplify. You repeat. You make yourself vulnerable — not because you're careless, but because the system is broken.",
    before: 'forgot_password... again',
    after: 'Auto-filled in 0.3s',
  },
  {
    id: 'exposed',
    icon: Eye,
    iconColor: '#8B5CF6',
    iconBg: 'rgba(139,92,246,0.1)',
    iconBorder: 'rgba(139,92,246,0.2)',
    stat: '24B',
    statLabel: 'credentials exposed in data breaches last year',
    headline: 'Your data is already out there.',
    body: "Billions of username-password pairs are traded on the dark web right now. If you haven't changed your passwords recently, there's a good chance yours is among them.",
    before: 'Checking if compromised...',
    after: '✓ None of your passwords found',
  },
];

function ProblemCard({ point, index }) {
  const Icon = point.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-8 lg:p-10 relative overflow-hidden group"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 0% 0%, ${point.iconColor}08, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Icon + stat row */}
      <div className="flex items-start justify-between mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: point.iconBg, border: `1px solid ${point.iconBorder}` }}
        >
          <Icon size={20} style={{ color: point.iconColor }} strokeWidth={2} aria-hidden="true" />
        </div>
        <div className="text-right">
          <p
            className="font-editorial text-3xl font-semibold leading-none"
            style={{ color: point.iconColor }}
          >
            {point.stat}
          </p>
          <p className="text-[11px] font-display text-white/35 mt-1 max-w-[160px] text-right leading-snug">
            {point.statLabel}
          </p>
        </div>
      </div>

      {/* Copy */}
      <h3 className="font-display text-xl font-semibold text-white/95 leading-snug mb-4">
        {point.headline}
      </h3>
      <p className="font-display text-sm text-white/60 leading-relaxed mb-8">
        {point.body}
      </p>

      {/* Before/After */}
      <div className="space-y-2">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}
        >
          <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />
          <span className="font-mono text-xs text-red-300/70 truncate">{point.before}</span>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg"
          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}
        >
          <Shield size={12} className="text-emerald-400 flex-shrink-0" />
          <span className="font-mono text-xs text-emerald-300/80 truncate">{point.after}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProblemSection() {
  return (
    <section
      id="problem"
      className="section-padding relative overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      aria-labelledby="problem-heading"
    >
      {/* Background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,1) 0%, transparent 60%)', filter: 'blur(60px)' }}
        aria-hidden="true"
      />

      <div className="container-xl relative z-10">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="badge-green mx-auto mb-6"
            style={{
              background: 'rgba(239,68,68,0.1)',
              borderColor: 'rgba(239,68,68,0.25)',
              color: '#FCA5A5',
            }}
          >
            <AlertTriangle size={10} />
            The harsh reality
          </motion.div>

          <motion.h2
            id="problem-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            You already<br />
            <span className="italic text-red-400/80">know the risk.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-lg text-white/60 leading-relaxed"
          >
            "123456". "Password1". Your pet's name followed by your birth year.
            We've all been there. And every single day, hackers are counting on it.
          </motion.p>
        </div>

        {/* Problem cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PAIN_POINTS.map((point, i) => (
            <ProblemCard key={point.id} point={point} index={i} />
          ))}
        </div>

        {/* Transition line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 text-center"
        >
          <p className="font-editorial text-2xl sm:text-3xl text-white/50 italic mb-2">
            "There's a better way."
          </p>
          <p className="font-display text-sm text-white/35">— and you're already looking at it.</p>
        </motion.div>
      </div>
    </section>
  );
}
