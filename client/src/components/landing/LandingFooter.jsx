import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Security', href: '#security' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press kit', href: '#' },
    ],
  },
  {
    heading: 'Security',
    links: [
      { label: 'Security model', href: '#security' },
      { label: 'Audit reports', href: '#' },
      { label: 'Bug bounty', href: '#' },
      { label: 'Responsible disclosure', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy policy', href: '#' },
      { label: 'Terms of service', href: '#' },
      { label: 'Cookie policy', href: '#' },
      { label: 'GDPR compliance', href: '#' },
    ],
  },
];

const SOCIAL = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter/X' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

export default function LandingFooter() {
  const handleNavClick = (href) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer
      className="relative overflow-hidden pt-16 pb-8"
      style={{ borderTop: '1px solid var(--sv-border)' }}
      aria-label="Site footer"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.2), rgba(94,106,210,0.2), transparent)' }}
        aria-hidden="true"
      />

      <div className="container-xl">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit" aria-label="SecureVault Home">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <Shield size={15} className="text-emerald-400" strokeWidth={2.5} aria-hidden="true" />
              </div>
              <span className="font-sans font-semibold text-[15px] text-white/80 group-hover:text-white transition-colors duration-200">
                Secure<span className="text-emerald-400">Vault</span>
              </span>
            </Link>

            <p className="font-sans text-sm text-[var(--sv-text-secondary)] leading-relaxed max-w-xs mb-6">
              One vault. Unlimited peace of mind. Ultimate security made simple.
            </p>

            <div className="flex items-center gap-2">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/6 transition-all duration-200"
                  aria-label={label}
                  style={{ border: '1px solid var(--sv-border)' }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </motion.div>

          {FOOTER_LINKS.map((col, i) => (
            <motion.div key={col.heading} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i + 1) * 0.07, duration: 0.5 }}>
              <p className="font-sans text-xs font-bold tracking-widest uppercase text-white/25 mb-4">{col.heading}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('#') ? (
                      <button onClick={() => handleNavClick(link.href)} className="font-sans text-sm text-[var(--sv-text-secondary)] hover:text-white/80 transition-colors duration-200 cursor-pointer text-left">
                        {link.label}
                      </button>
                    ) : (
                      <a href={link.href} className="font-sans text-sm text-[var(--sv-text-secondary)] hover:text-white/80 transition-colors duration-200">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6" style={{ borderTop: '1px solid var(--sv-border)' }}>
          <p className="font-sans text-xs text-[var(--sv-text-muted)]">
            © {new Date().getFullYear()} SecureVault. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs font-sans text-[var(--sv-text-muted)]">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              All systems operational
            </span>
            <span className="w-px h-3 bg-white/10" aria-hidden="true" />
            <span>Built with ❤️ for privacy</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
