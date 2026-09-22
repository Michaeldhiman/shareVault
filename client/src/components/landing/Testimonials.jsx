import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronLeft, ChevronRight, Lock, EyeOff, Code } from 'lucide-react';

const HIGHLIGHTS = [
  {
    id: 1,
    title: 'Zero-Knowledge Architecture',
    icon: Lock,
    iconColor: '#5E6AD2',
    description: "Your master password never leaves your device. It is used to locally derive encryption keys, ensuring we never have access to your plaintext data. Even if our servers are compromised, your data remains secure.",
  },
  {
    id: 2,
    title: 'Client-Side Encryption',
    icon: Shield,
    iconColor: '#10B981',
    description: "All encryption and decryption happens directly in your browser. Data is encrypted with AES-256-GCM before it ever touches our network. We only store the resulting ciphertext blobs.",
  },
  {
    id: 3,
    title: 'Privacy-First Breach Monitoring',
    icon: EyeOff,
    iconColor: '#F59E0B',
    description: "We check for breached passwords using k-anonymity. Only the first 5 characters of a hashed password are ever sent to check against known breach databases, keeping your actual passwords fully anonymous and secure.",
  },
  {
    id: 4,
    title: 'Open & Auditable',
    icon: Code,
    iconColor: '#8B5CF6',
    description: "Our cryptographic implementations and client-side code are transparent and independently verifiable. We believe true security relies on robust mathematical foundations, not on keeping the source code a secret.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const total = HIGHLIGHTS.length;

  const prev = () => setActive((a) => (a - 1 + total) % total);
  const next = () => setActive((a) => (a + 1) % total);
  const t = HIGHLIGHTS[active];
  const ActiveIcon = t.icon;

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ borderTop: '1px solid var(--sv-border)' }}
      aria-labelledby="highlights-heading"
    >
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(94,106,210,1) 0%, transparent 60%)', filter: 'blur(80px)' }} aria-hidden="true" />
      <div className="container-xl relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="badge-indigo mx-auto mb-6 font-sans">
            <Shield size={10} className="text-indigo-400" /> What makes SecureVault different
          </motion.div>
          <motion.h2
            id="highlights-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-4xl sm:text-5xl font-bold text-[var(--sv-text-primary)] leading-tight mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            Built for security,<br />
            <span className="text-[var(--sv-text-secondary)] font-normal">designed for peace of mind.</span>
          </motion.h2>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="max-w-3xl mx-auto">
          <div className="p-8 lg:p-12 relative overflow-hidden rounded-3xl" style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-border)' }} role="region" aria-label="Product Highlights" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${t.iconColor}15`, border: `1px solid ${t.iconColor}30` }}>
                  <ActiveIcon size={32} style={{ color: t.iconColor }} strokeWidth={1.5} />
                </div>
                <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[var(--sv-text-primary)] mb-4">
                  {t.title}
                </h3>
                <p className="font-sans text-lg text-[var(--sv-text-secondary)] leading-relaxed mb-8">
                  {t.description}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid var(--sv-border)' }}>
              <div className="flex items-center gap-2" role="tablist" aria-label="Highlight navigation">
                {HIGHLIGHTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    role="tab"
                    aria-selected={i === active}
                    aria-label={`Highlight ${i + 1}`}
                    className="transition-all duration-300 rounded-full"
                    style={{ width: i === active ? '24px' : '6px', height: '6px', background: i === active ? 'var(--sv-accent)' : 'var(--sv-border)' }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prev} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/8 transition-all duration-200" aria-label="Previous highlight">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={next} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/8 transition-all duration-200" aria-label="Next highlight">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {HIGHLIGHTS.filter((_, i) => i !== active).slice(0, 4).map((highlight) => {
              const HIcon = highlight.icon;
              return (
                <motion.button
                  key={highlight.id}
                  onClick={() => setActive(HIGHLIGHTS.indexOf(highlight))}
                  className="p-3 text-left group cursor-pointer rounded-xl"
                  style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-border)' }}
                  whileHover={{ scale: 1.02, borderColor: 'var(--sv-border-hover)' }}
                  transition={{ duration: 0.2 }}
                  aria-label={`View ${highlight.title}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: `${highlight.iconColor}20` }} aria-hidden="true">
                      <HIcon size={12} style={{ color: highlight.iconColor }} />
                    </div>
                  </div>
                  <p className="text-xs font-sans font-semibold text-[var(--sv-text-primary)] truncate">{highlight.title}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
