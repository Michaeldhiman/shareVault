import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Key, Server, Eye, CheckCircle2 } from 'lucide-react';

const LAYERS = [
  {
    level: '01',
    icon: Key,
    color: '#F59E0B',
    title: 'Master Password',
    description: 'Never leaves your device. Never stored. Never transmitted. Only you know it.',
    tag: 'Your Device Only',
  },
  {
    level: '02',
    icon: Lock,
    color: '#10B981',
    title: 'PBKDF2 Key Derivation',
    description: '100,000 iterations transform your password into a cryptographic key using salted SHA-256.',
    tag: '100K Iterations',
  },
  {
    level: '03',
    icon: Shield,
    color: '#5E6AD2',
    title: 'AES-256-GCM Encryption',
    description: 'Your vault data is encrypted client-side with strong AES-256 before any sync.',
    tag: 'Zero-Knowledge',
  },
  {
    level: '04',
    icon: Server,
    color: '#8B5CF6',
    title: 'Encrypted Sync',
    description: 'Only ciphertext ever reaches our servers. We store encrypted blobs we mathematically cannot read.',
    tag: 'End-to-End',
  },
];

const GUARANTEES = [
  'Your master password is never stored or transmitted',
  'All encryption happens on your device, in your browser',
  'Our servers only store encrypted ciphertext',
  'Open architecture — independently verifiable',
  'k-Anonymity breach detection — no plaintext sent',
  'Automatic session timeout with re-encryption',
];

export default function SecuritySection() {
  return (
    <section
      id="security"
      className="section-padding relative overflow-hidden"
      style={{ borderTop: '1px solid var(--sv-border)' }}
      aria-labelledby="security-heading"
    >
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(94,106,210,1) 0%, transparent 60%)', filter: 'blur(80px)' }} aria-hidden="true" />
      <div className="container-xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="badge-indigo mb-6 font-sans">
              <Shield size={10} /> Security architecture
            </motion.div>
            <motion.h2
              id="security-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-4xl sm:text-5xl font-bold text-[var(--sv-text-primary)] leading-tight mb-6"
              style={{ letterSpacing: '-0.02em' }}
            >
              Uncompromising security.<br />
              <span className="text-[var(--sv-text-secondary)] font-normal">Human-friendly.</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="font-sans text-lg text-[var(--sv-text-secondary)] leading-relaxed mb-10">
              End-to-end encryption. Zero-knowledge architecture. We built SecureVault so that even if our servers were breached tomorrow, your data would remain completely unreadable.
            </motion.p>
            <motion.ul initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="space-y-3" aria-label="Security guarantees">
              {GUARANTEES.map((item, i) => (
                <motion.li key={item} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex items-start gap-3 text-sm font-sans text-[var(--sv-text-secondary)]">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden="true" /> {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>
          <div className="space-y-3">
            {LAYERS.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <motion.div
                  key={layer.level}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="px-6 py-5 flex items-center gap-5 group rounded-2xl"
                  style={{ background: 'var(--sv-surface)', border: '1px solid var(--sv-border)', borderLeft: `2px solid ${layer.color}30`, transition: 'border-color 0.3s ease' }}
                  whileHover={{ borderLeftColor: `${layer.color}70` }}
                >
                  <span className="font-mono text-xs font-bold flex-shrink-0 w-7" style={{ color: layer.color, opacity: 0.5 }}>{layer.level}</span>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${layer.color}10`, border: `1px solid ${layer.color}25` }}>
                    <Icon size={16} style={{ color: layer.color }} strokeWidth={2} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="font-sans text-sm font-semibold text-[var(--sv-text-primary)]">{layer.title}</p>
                      <span className="text-[10px] font-sans font-bold tracking-wider px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: `${layer.color}10`, color: layer.color, border: `1px solid ${layer.color}20` }}>
                        {layer.tag}
                      </span>
                    </div>
                    <p className="text-xs font-sans leading-snug" style={{ color: `var(--sv-text-secondary)` }}>{layer.description}</p>
                  </div>
                  {i < LAYERS.length - 1 && (
                    <div className="absolute left-[3.5rem] -bottom-3 z-10 text-white/10 text-xs" aria-hidden="true">↓</div>
                  )}
                </motion.div>
              );
            })}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex items-center justify-center gap-3 py-5">
              <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 0 30px rgba(16,185,129,0.08)' }}>
                <Eye size={14} className="text-emerald-400" />
                <span className="font-mono text-xs text-emerald-400 font-semibold tracking-wide">{"{ encrypted: true, readable_by_us: false }"}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
