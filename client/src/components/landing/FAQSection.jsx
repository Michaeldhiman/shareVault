import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Shield } from 'lucide-react';

const FAQS = [
  {
    q: 'What is zero-knowledge encryption?',
    a: "Zero-knowledge means we architecturally cannot access your data. Your master password derives an encryption key locally on your device using PBKDF2 (600,000 iterations). This key encrypts your vault with AES-256-GCM before it ever leaves your browser. Our servers only receive encrypted ciphertext — we never see your passwords, and we mathematically cannot. Even our engineers with full database access couldn't read your vault.",
  },
  {
    q: 'What happens if I forget my master password?',
    a: "This is the trade-off of true zero-knowledge security: we genuinely cannot reset your master password because we don't know it. We recommend: (1) Enable Emergency Access so a trusted person can help you, (2) Store a hint in a safe place, (3) Export your vault periodically as a backup. This is the same model used by 1Password and Bitwarden. Your security is in your hands.",
  },
  {
    q: 'Is SecureVault safe to use on shared computers?',
    a: "Yes, with precautions. SecureVault never stores your master password in browser history or localStorage in plaintext. Always use the lock feature when done, clear session on logout, and avoid saving your master password in the browser. We also support automatic session timeout after inactivity. For maximum safety, use a personal device.",
  },
  {
    q: 'How does breach monitoring work without compromising privacy?',
    a: "We use Troy Hunt's Have I Been Pwned API with k-anonymity. When checking a password, we hash it with SHA-1, send only the first 5 characters of that hash to HIBP, and receive a list of matching hashes. Your actual password or its full hash never leaves your device. This lets us check billions of breached credentials while revealing nothing about your password.",
  },
  {
    q: 'Can I import from 1Password, LastPass, or Bitwarden?',
    a: "Absolutely. SecureVault supports importing from 1Password (1PIF, CSV), LastPass (CSV), Bitwarden (JSON), Dashlane (JSON/CSV), Chrome (CSV), Firefox (CSV), and any standard CSV format. Imports are processed entirely client-side — your data is encrypted before anything is uploaded. Migration takes under 5 minutes for most users.",
  },
  {
    q: 'What devices and browsers are supported?',
    a: "SecureVault works on any modern browser — Chrome, Firefox, Safari, Edge, Brave. We have native apps for iOS and Android. Your vault syncs in real-time across all your devices. The web app works offline for reading existing vault entries, and syncs when you reconnect.",
  },
  {
    q: 'Is the source code audited?',
    a: "Yes. Our encryption architecture has been independently audited by security firms. The client-side encryption code is open for inspection — security through obscurity isn't security. We also run a public bug bounty program. Audit reports are available on our security page.",
  },
];

function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200"
        style={{
          background: isOpen ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)',
        }}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
      >
        <span className="font-display text-sm font-semibold text-white/85 leading-snug">
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex-shrink-0"
          aria-hidden="true"
        >
          <ChevronDown
            size={16}
            style={{ color: isOpen ? '#10B981' : 'rgba(255,255,255,0.3)' }}
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-6 pb-5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p className="font-display text-sm text-white/65 leading-relaxed pt-4">
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="section-padding relative overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      aria-labelledby="faq-heading"
    >
      {/* Background */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,1) 0%, transparent 70%)', filter: 'blur(60px)' }}
        aria-hidden="true"
      />

      <div className="container-xl relative z-10">
        <div className="grid lg:grid-cols-[1fr,2fr] gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="badge-green mb-6"
            >
              <HelpCircle size={10} />
              FAQ
            </motion.div>

            <motion.h2
              id="faq-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-editorial text-4xl sm:text-5xl font-semibold text-white leading-tight mb-6"
              style={{ letterSpacing: '-0.02em' }}
            >
              Everything you<br />
              <span className="italic text-white/40">were afraid to ask.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-display text-sm text-white/60 leading-relaxed mb-8"
            >
              Security questions deserve honest, detailed answers. No marketing speak.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <Shield size={16} className="text-emerald-400" />
                <span className="font-display text-sm font-semibold text-white/70">Still have questions?</span>
              </div>
              <p className="font-display text-xs text-white/55 leading-relaxed mb-4">
                Our security team answers questions personally. No bots, no form letters.
              </p>
              <a
                href="mailto:security@securevault.app"
                className="btn-secondary text-xs px-4 py-2 inline-flex"
              >
                Contact security team
              </a>
            </motion.div>
          </div>

          {/* Right: FAQ list */}
          <div className="space-y-3" role="list">
            {FAQS.map((item, i) => (
              <FAQItem
                key={i}
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
