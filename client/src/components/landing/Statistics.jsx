import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const STATS = [
  {
    value: 500000,
    suffix: '+',
    label: 'Active users',
    description: 'People who sleep better at night',
    color: '#10B981',
  },
  {
    value: 99.99,
    suffix: '%',
    decimals: 2,
    label: 'Uptime SLA',
    description: 'Always available when you need it',
    color: '#5E6AD2',
  },
  {
    value: 0,
    suffix: '',
    label: 'Data breaches',
    description: 'Zero incidents since founding',
    color: '#F59E0B',
  },
  {
    value: 2,
    suffix: 'M+',
    label: 'Passwords secured',
    description: 'Encrypted in our users\' vaults',
    color: '#8B5CF6',
  },
];

function useCountUp(target, decimals = 0, isInView) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    const duration = 1800;
    const steps = 60;
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      const progress = current / steps;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      setCount(parseFloat(value.toFixed(decimals)));

      if (current >= steps) {
        clearInterval(timer);
        setCount(target);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isInView, target, decimals]);

  return count;
}

function StatCard({ stat, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useCountUp(stat.value, stat.decimals || 0, isInView);

  const formatNumber = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return Math.round(n).toLocaleString();
    return stat.decimals ? n.toFixed(stat.decimals) : Math.round(n).toString();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-8 text-center group relative overflow-hidden"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 50%, ${stat.color}08, transparent)` }}
        aria-hidden="true"
      />

      {/* Number */}
      <p
        className="font-editorial text-5xl lg:text-6xl font-semibold leading-none mb-2"
        style={{ color: stat.color }}
        aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
      >
        {formatNumber(count)}{stat.suffix}
      </p>

      {/* Label */}
      <p className="font-display text-base font-semibold text-white/85 mb-2">{stat.label}</p>
      <p className="font-display text-xs text-white/50">{stat.description}</p>

      {/* Trend indicator */}
      <div
        className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-display"
        style={{ color: `${stat.color}99` }}
        aria-hidden="true"
      >
        <TrendingUp size={11} />
        <span>Growing daily</span>
      </div>
    </motion.div>
  );
}

export default function Statistics() {
  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      aria-labelledby="statistics-heading"
    >
      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.03), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="container-xl relative z-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <motion.h2
            id="statistics-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-4xl sm:text-5xl font-semibold text-white mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            The numbers<br />
            <span className="italic text-white/35">speak for themselves.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
