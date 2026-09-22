import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Shield, Lock, Key, Eye, EyeOff, Zap, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const FLOATING_CARDS = [
  {
    id: 'github',
    site: 'github.com',
    user: 'michael@acme.co',
    strength: 98,
    label: 'Strong',
    color: '#10B981',
    icon: '⬡',
    x: '58%',
    y: '12%',
    delay: 0,
    rotation: 5,
  },
  {
    id: 'netflix',
    site: 'netflix.com',
    user: 'michael@acme.co',
    strength: 94,
    label: 'Strong',
    color: '#10B981',
    icon: '▶',
    x: '62%',
    y: '52%',
    delay: 0.2,
    rotation: -3,
  },
];

function AmbientBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute w-[700px] h-[700px] -top-40 left-1/2 -translate-x-1/2 opacity-[0.05] animate-blob-slow"
        style={{
          background: 'radial-gradient(circle, var(--sv-accent) 0%, #059669 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] top-1/4 -right-20 opacity-[0.04] animate-blob-slow-reverse"
        style={{
          background: 'radial-gradient(circle, #5E6AD2 0%, #4F46E5 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] bottom-0 left-[10%] opacity-[0.03] animate-blob-medium"
        style={{
          background: 'radial-gradient(circle, var(--sv-accent) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
}

function VaultOrb({ mouseX, mouseY }) {
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center mx-auto"
    >
      <motion.div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 65%)',
          filter: 'blur(20px)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border border-emerald-500/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute w-2 h-2 bg-emerald-400/60 rounded-full"
            style={{
              top: '50%', left: '50%',
              transform: `rotate(${deg}deg) translateX(calc(50% + 6rem)) translateY(-50%)`,
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="relative z-10 w-28 h-28 lg:w-36 lg:h-36 rounded-3xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.08) 100%)',
          border: '1px solid rgba(16,185,129,0.25)',
          boxShadow: '0 0 60px rgba(16,185,129,0.15), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <motion.div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"
            animate={{ y: ['-100%', '500%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
          />
        </div>
        <Shield size={52} className="text-emerald-400 drop-shadow-lg" strokeWidth={1.5} aria-hidden="true" />
      </motion.div>
    </motion.div>
  );
}

function PasswordCard({ card, mouseX, mouseY }) {
  const [revealed, setRevealed] = useState(false);
  const parallaxX = useTransform(mouseX, [-500, 500], [-6, 6]);
  const parallaxY = useTransform(mouseY, [-500, 500], [-4, 4]);

  return (
    <motion.div
      className="absolute hidden xl:block"
      style={{ left: card.x, top: card.y, x: parallaxX, y: parallaxY, rotate: card.rotation, zIndex: 10 }}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8 + card.delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="p-4 w-56 cursor-pointer select-none rounded-2xl"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4 + card.delay, repeat: Infinity, ease: 'easeInOut', delay: card.delay }}
        whileHover={{ scale: 1.03, rotate: 0 }}
        onClick={() => setRevealed(!revealed)}
        style={{
          background: 'var(--sv-surface)',
          border: '1px solid var(--sv-border)',
          boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${card.color}15`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-sans"
              style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
            >
              <span>{card.icon}</span>
            </div>
            <div>
              <p className="text-xs font-sans font-semibold text-white/90">{card.site}</p>
              <p className="text-[10px] text-white/40 truncate max-w-[80px] font-sans">{card.user}</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setRevealed(!revealed); }}
            className="p-1 rounded-md text-white/30 hover:text-white/70 hover:bg-white/8 transition-all duration-150"
          >
            {revealed ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
        </div>
        <div
          className="px-2.5 py-2 rounded-lg mb-3 font-mono text-xs tracking-widest overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className={revealed ? 'text-white/90' : 'text-white/30 blur-[4px] select-none'}>
            {revealed ? 'Kx9#mP$qR2nL' : '••••••••••••••'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1 h-1 rounded-full mr-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${card.color}, ${card.color}cc)` }}
              initial={{ width: 0 }}
              animate={{ width: `${card.strength}%` }}
              transition={{ delay: 1 + card.delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="text-[10px] font-sans font-semibold" style={{ color: card.color }}>
            {card.label}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

const TRUST_ITEMS = [
  { icon: Shield, label: 'AES-256-GCM' },
  { icon: Lock, label: 'Zero-Knowledge' },
  { icon: Key, label: 'PBKDF2 100K' },
  { icon: CheckCircle2, label: 'Client-Side Encrypted' },
];

export default function HeroSection() {
  const containerRef = useRef(null);
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(rawMouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawMouseX.set(e.clientX - rect.left - rect.width / 2);
    rawMouseY.set(e.clientY - rect.top - rect.height / 2);
  }, [rawMouseX, rawMouseY]);

  const STAGGER = {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
    item: {
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
    },
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-16"
      aria-labelledby="hero-heading"
      id="hero"
    >
      <AmbientBlobs />
      <div className="container-xl relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 xl:gap-12 items-center py-20 lg:py-28">
          <motion.div variants={STAGGER.container} initial="hidden" animate="visible" className="flex flex-col items-start text-left max-w-2xl">
            <motion.h1
              variants={STAGGER.item}
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl leading-[1.1] font-bold font-sans text-white mb-6"
              style={{ letterSpacing: '-0.02em' }}
            >
              One <span className="text-[var(--sv-accent)]">vault</span>.<br />
              Unlimited peace of mind.
            </motion.h1>
            <motion.p
              variants={STAGGER.item}
              className="font-sans text-lg sm:text-xl text-[var(--sv-text-secondary)] leading-relaxed mb-10 max-w-lg"
            >
              Your passwords are scattered. You reuse them. You forget them. You fear losing everything.<br className="hidden sm:block" />
              <span className="text-[var(--sv-text-primary)] font-semibold">There's a better way.</span>
            </motion.p>
            <motion.div variants={STAGGER.item} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10 w-full sm:w-auto">
              <Link to="/register" aria-label="Create your free SecureVault account" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  <Shield size={17} strokeWidth={2.5} className="shrink-0" />
                  <span>Start for free</span>
                  <ArrowRight size={15} className="shrink-0" />
                </Button>
              </Link>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('how-it-works');
                  if (el) {
                    const navOffset = 72;
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto group"
              >
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <span>See how it works</span>
                  <ChevronRight size={15} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </a>
            </motion.div>
            <motion.div variants={STAGGER.item} className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2 text-xs font-sans font-medium text-[var(--sv-text-secondary)]">
                  <Icon size={14} className="text-emerald-400" strokeWidth={2} /> {label}
                </span>
              ))}
            </motion.div>
          </motion.div>
          <div className="relative flex flex-col items-center justify-center min-h-[400px] lg:min-h-[560px]">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              <VaultOrb mouseX={mouseX} mouseY={mouseY} />
            </motion.div>
            {FLOATING_CARDS.map((card) => (
              <PasswordCard key={card.id} card={card} mouseX={mouseX} mouseY={mouseY} />
            ))}
            <motion.div 
              className="mt-8 relative z-10 hidden xl:block w-full max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="p-4 rounded-xl font-sans" style={{ background: 'var(--sv-surface-elevated)', border: '1px solid var(--sv-border)' }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-[var(--sv-text-primary)]">Your Vault</span>
                  <Shield size={14} className="text-emerald-400" />
                </div>
                <div className="space-y-2">
                  {[ { n: 'Google', e: 'michael@acme.co' }, { n: 'AWS', e: 'admin@acme.co' } ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'var(--sv-surface)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center text-[10px] text-emerald-400 font-bold">{c.n[0]}</div>
                        <div>
                          <p className="text-[11px] text-[var(--sv-text-primary)] font-medium leading-none mb-1">{c.n}</p>
                          <p className="text-[9px] text-[var(--sv-text-secondary)] leading-none">{c.e}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, var(--sv-bg))' }} aria-hidden="true" />
    </section>
  );
}
