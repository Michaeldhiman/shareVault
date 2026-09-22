import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Shield, Zap, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: UserPlus,
    color: '#10B981',
    colorBg: 'rgba(16,185,129,0.1)',
    colorBorder: 'rgba(16,185,129,0.25)',
    title: 'Create your account',
    description: "Sign up with your email. Set a strong master password — the only password you'll ever need to remember. It never leaves your device.",
    detail: 'Takes 30 seconds. No credit card required.',
    highlight: 'Your master password = your key. We never see it.',
  },
  {
    step: '02',
    icon: Shield,
    color: '#5E6AD2',
    colorBg: 'rgba(94,106,210,0.1)',
    colorBorder: 'rgba(94,106,210,0.25)',
    title: 'Import or add passwords',
    description: 'Import from Chrome, 1Password, LastPass, or Bitwarden in one click. Or add passwords manually. Your vault is ready in minutes.',
    detail: 'Supports CSV, JSON, and all major password managers.',
    highlight: 'Every password encrypted client-side before upload.',
  },
  {
    step: '03',
    icon: Zap,
    color: '#F59E0B',
    colorBg: 'rgba(245,158,11,0.1)',
    colorBorder: 'rgba(245,158,11,0.25)',
    title: 'Log in faster, safer',
    description: 'Auto-fill credentials on any site with one click. Get breach alerts. Generate strong passwords. Access from any device, anytime.',
    detail: 'Works on Chrome, Firefox, Safari, Edge, and mobile.',
    highlight: 'Sync is instant. Security is permanent.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-padding relative overflow-hidden"
      style={{ borderTop: '1px solid var(--sv-border)' }}
      aria-labelledby="how-it-works-heading"
    >
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,1) 0%, transparent 60%)', filter: 'blur(80px)' }} aria-hidden="true" />
      <div className="container-xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="badge-green mx-auto mb-6 font-sans">
            <Zap size={10} /> Dead simple
          </motion.div>
          <motion.h2
            id="how-it-works-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--sv-text-primary)] leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            Up and running<br />
            <span className="text-[var(--sv-accent)]">in 60 seconds.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="font-sans text-lg text-[var(--sv-text-secondary)]">
            Security shouldn't require a manual. Three steps and you're protected.
          </motion.p>
        </div>
        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.15) 20%, rgba(94,106,210,0.15) 50%, rgba(245,158,11,0.15) 80%, transparent)' }} aria-hidden="true" />
          <div className="grid lg:grid-cols-3 gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.step} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative" style={{ background: step.colorBg, border: `1px solid ${step.colorBorder}`, boxShadow: `0 0 30px ${step.color}15` }}>
                      <Icon size={22} style={{ color: step.color }} strokeWidth={2} aria-hidden="true" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[9px] font-mono font-bold flex items-center justify-center" style={{ background: step.color, color: 'var(--sv-bg)' }}>{i + 1}</span>
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold tracking-widest" style={{ color: step.color, opacity: 0.5 }}>STEP {step.step}</p>
                    </div>
                  </div>
                  <h3 className="font-sans text-xl font-semibold text-[var(--sv-text-primary)] mb-4 leading-snug">{step.title}</h3>
                  <p className="font-sans text-sm text-[var(--sv-text-secondary)] leading-relaxed mb-6">{step.description}</p>
                  <p className="text-xs font-sans text-[var(--sv-text-muted)] mb-4">{step.detail}</p>
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg" style={{ background: `${step.color}08`, border: `1px solid ${step.color}18` }}>
                    <CheckCircle2 size={13} style={{ color: step.color }} className="flex-shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden="true" />
                    <p className="text-xs font-sans leading-snug" style={{ color: `${step.color}cc` }}>{step.highlight}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
