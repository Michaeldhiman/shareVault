import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Shield, X, Menu, ChevronRight, Lock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Security', href: '#security' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (!href || !href.startsWith('#')) return;
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      const navOffset = 72;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
      />
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(10, 11, 15, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--sv-border)' : '1px solid transparent',
        }}
      >
        <div className="container-xl">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group" aria-label="SecureVault Home">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors duration-300" />
                <div className="absolute inset-0 rounded-lg border border-emerald-500/30 group-hover:border-emerald-500/50 transition-colors duration-300" />
                <Shield size={16} className="relative z-10 text-white group-hover:text-emerald-300 transition-colors duration-300" strokeWidth={2.5} />
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)' }} />
              </div>
              <span className="font-sans font-semibold text-[15px] tracking-tight text-white/90 group-hover:text-white transition-colors duration-300">
                <span className="text-white">Secure</span><span className="text-emerald-400">Vault</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 text-sm font-sans font-medium text-white/50 hover:text-white/90 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-sans font-medium text-white/60 hover:text-white/90 transition-colors duration-200">
                Sign in
              </Link>
              <Link to="/register" aria-label="Get started with SecureVault">
                <Button variant="primary" size="md" className="font-sans font-medium">
                  <Zap size={14} strokeWidth={2.5} className="mr-1.5" />
                  Get started free
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 lg:hidden flex flex-col"
            style={{ background: 'var(--sv-bg)' }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex-1 flex flex-col pt-24 pb-8 px-6">
              <nav className="flex flex-col gap-1 mb-8">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => handleNavClick(link.href)}
                    className="flex items-center justify-between w-full px-4 py-4 text-lg font-sans font-medium text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer group"
                  >
                    {link.label}
                    <ChevronRight size={16} className="text-white/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-200" />
                  </motion.button>
                ))}
              </nav>
              <div className="section-divider mb-8" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-3"
              >
                <Link to="/register" onClick={() => setMobileOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full justify-center py-4 font-sans text-base">
                    <Shield size={16} strokeWidth={2.5} className="mr-2" /> Get started free
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full">
                  <Button variant="secondary" className="w-full justify-center py-4 font-sans text-base">
                    Sign in to SecureVault
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-auto flex items-center justify-center gap-4 text-xs font-sans text-white/30"
              >
                <span className="flex items-center gap-1.5"><Lock size={10} /> AES-256 Encrypted</span>
                <span className="w-px h-3 bg-white/10" />
                <span>Zero-knowledge</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
