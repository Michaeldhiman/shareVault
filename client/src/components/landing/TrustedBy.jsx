import React from 'react';
import { motion } from 'framer-motion';

const LOGOS = [
  { name: 'Google', abbr: 'G', color: '#4285F4' },
  { name: 'Apple', abbr: '', color: '#A2AAAD', isApple: true },
  { name: 'Meta', abbr: 'M', color: '#0081FB' },
  { name: 'Stripe', abbr: 'S', color: '#635BFF' },
  { name: 'Vercel', abbr: '▲', color: '#ffffff' },
  { name: 'Linear', abbr: 'L', color: '#5E6AD2' },
  { name: 'Notion', abbr: 'N', color: '#ffffff' },
  { name: 'Figma', abbr: 'F', color: '#F24E1E' },
];

const STATS = [
  { value: '500K+', label: 'Trusted users' },
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '0', label: 'Breaches ever' },
  { value: 'AES-256', label: 'Encryption standard' },
];

function LogoItem({ logo, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center px-6 py-3 rounded-xl transition-all duration-300 group cursor-default"
      style={{ border: '1px solid rgba(255,255,255,0.05)' }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}
      title={`Trusted by ${logo.name} employees`}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-lg font-bold transition-opacity duration-300 opacity-35 group-hover:opacity-70"
          style={{ color: logo.color, fontFamily: logo.isApple ? 'system-ui' : 'inherit' }}
        >
          {logo.isApple ? '⌘' : logo.abbr}
        </span>
        <span className="text-sm font-display font-medium text-white/25 group-hover:text-white/50 transition-colors duration-300 tracking-tight">
          {logo.name}
        </span>
      </div>
    </motion.div>
  );
}

export default function TrustedBy() {
  return (
    <section
      className="section-padding-sm relative overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      aria-label="Trusted by companies worldwide"
    >
      {/* Subtle center glow */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)' }}
        aria-hidden="true"
      />

      <div className="container-xl">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-xs font-display font-semibold tracking-[0.18em] uppercase text-white/45 mb-8"
        >
          Trusted by teams at world-class companies
        </motion.p>

        {/* Logo strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          {LOGOS.map((logo, i) => (
            <LogoItem key={logo.name} logo={logo} index={i} />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <p
                className="font-editorial text-3xl lg:text-4xl font-semibold text-gradient-green mb-1.5"
              >
                {stat.value}
              </p>
              <p className="font-display text-sm text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
