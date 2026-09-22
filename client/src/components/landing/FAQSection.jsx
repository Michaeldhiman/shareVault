import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Shield } from 'lucide-react';
import Button from '../ui/Button';

const FAQS = [
  {
    q: 'How does SecureVault protect my passwords?',
    a: "All your credentials are encrypted directly on your device using AES-256-GCM before ever being transmitted over the network. Your 256-bit encryption key is derived from your Master Password in browser memory using PBKDF2 with 100,000 iterations and a unique salt. Our servers only store encrypted ciphertext blobs — we never see or store your plaintext passwords.",
  },
  {
    q: 'What happens if I forget my Master Password?',
    a: "Because SecureVault utilizes true zero-knowledge architecture, your Master Password is never sent to or stored on our servers. This means we cannot reset or recover it for you. We strongly advise writing down your Master Password and storing it in a secure offline location when creating your vault.",
  },
  {
    q: 'Can SecureVault engineers or admins see my vault entries?',
    a: "No. Even with full database and server access, all vault entries are stored strictly as encrypted ciphertext. Without your Master Password — which only exists in your head and in temporary browser memory during your active session — the stored data is mathematically impossible for anyone else to read.",
  },
  {
    q: 'How does the breach monitoring feature check my passwords safely?',
    a: "We implement the privacy-preserving k-anonymity model. When checking a credential against known database breaches, SecureVault hashes your password using SHA-1 locally in your browser and only sends the first 5 characters of that hash. The full hash and your actual password never leave your device.",
  },
  {
    q: 'What happens when I lock my vault or close the browser?',
    a: "Locking your vault or logging out immediately purges the derived 256-bit encryption key from browser memory. To view, edit, or copy your passwords again, you simply re-enter your Master Password to decrypt your vault locally.",
  },
  {
    q: 'What built-in security tools does SecureVault include?',
    a: "SecureVault includes an in-browser Cryptographic Password Generator (with customizable length, character sets, and entropy estimation), a Password Reuse & Duplication Detector, a Password Strength Health Gauge, and real-time Have I Been Pwned breach scanning.",
  },
  {
    q: 'What browsers and devices can I use SecureVault on?',
    a: "SecureVault runs seamlessly in any modern web browser — including Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, and Brave — across desktop, tablet, and mobile screen sizes.",
  },
];

function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-colors duration-200"
      style={{
        border: '1px solid var(--sv-border)',
        backgroundColor: isOpen ? 'var(--sv-surface-elevated)' : 'var(--sv-surface)',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer transition-colors duration-150"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
      >
        <span className="font-sans text-sm sm:text-base font-semibold text-[var(--sv-text-primary)] leading-snug">
          {item.q}
        </span>
        <div
          className="flex-shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          <ChevronDown
            size={18}
            style={{ color: isOpen ? 'var(--sv-accent)' : 'var(--sv-text-muted)' }}
          />
        </div>
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
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-6 pb-5 pt-2"
              style={{ borderTop: '1px solid var(--sv-border)' }}
            >
              <p className="font-sans text-sm text-[var(--sv-text-secondary)] leading-relaxed pt-2">
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="section-padding relative"
      style={{ borderTop: '1px solid var(--sv-border)' }}
      aria-labelledby="faq-heading"
    >
      <div className="container-xl relative z-10">
        <div className="grid lg:grid-cols-[1fr,2fr] gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading and Support Box */}
          <div className="space-y-6">
            <div className="badge-green inline-flex font-sans">
              <HelpCircle size={12} />
              <span>FAQ</span>
            </div>
            <h2
              id="faq-heading"
              className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--sv-text-primary)] leading-tight tracking-tight"
            >
              Everything you<br />
              <span className="text-[var(--sv-text-secondary)] font-normal">were afraid to ask.</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-[var(--sv-text-secondary)] leading-relaxed max-w-md">
              Security questions deserve honest, detailed answers. No marketing speak.
            </p>
            <div
              className="p-5 rounded-2xl space-y-3"
              style={{
                backgroundColor: 'var(--sv-surface)',
                border: '1px solid var(--sv-border)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <Shield size={16} className="text-emerald-400 shrink-0" />
                <span className="font-sans text-sm font-semibold text-[var(--sv-text-primary)]">
                  Still have questions?
                </span>
              </div>
              <p className="font-sans text-xs text-[var(--sv-text-secondary)] leading-relaxed">
                Our security team answers questions directly with technical transparency.
              </p>
              <a
                href="mailto:security@securevault.app"
                className="inline-block pt-1"
              >
                <Button variant="secondary" size="sm">
                  Contact security team
                </Button>
              </a>
            </div>
          </div>

          {/* Right Column: Clean Accordion List without scroll jitter */}
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
