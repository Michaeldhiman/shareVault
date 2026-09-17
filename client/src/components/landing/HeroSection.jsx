import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Shield, Lock, Key, Eye, EyeOff, Zap, ChevronRight,
  Star, Users, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Floating Password Card Data ─────────────────────────────── */
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
  {
    id: 'bank',
    site: 'chase.com',
    user: 'michael@acme.co',
    strength: 100,
    label: 'Perfect',
    color: '#5E6AD2',
    icon: '🏦',
    x: '55%',
    y: '74%',
    delay: 0.4,
    rotation: 2,
  },
];

/* ─── Animated Blobs Background ───────────────────────────────── */
function AmbientBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Primary green blob */}
      <div
        className="absolute w-[700px] h-[700px] -top-40 left-1/2 -translate-x-1/2 opacity-[0.07] animate-blob-slow"
        style={{
          background: 'radial-gradient(circle, #10B981 0%, #059669 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Secondary indigo blob */}
      <div
        className="absolute w-[500px] h-[500px] top-1/4 -right-20 opacity-[0.06] animate-blob-slow-reverse"
        style={{
          background: 'radial-gradient(circle, #5E6AD2 0%, #4F46E5 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Accent small blob */}
      <div
        className="absolute w-[300px] h-[300px] bottom-0 left-[10%] opacity-[0.05] animate-blob-medium"
        style={{
          background: 'radial-gradient(circle, #10B981 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
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

/* ─── Vault Orb ────────────────────────────────────────────────── */
function VaultOrb({ mouseX, mouseY }) {
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative w-64 h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 flex items-center justify-center mx-auto"
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 65%)',
          filter: 'blur(20px)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-emerald-500/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        {/* Ring dots */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute w-2 h-2 bg-emerald-400/60 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translateX(calc(50% + 6rem)) translateY(-50%)`,
            }}
          />
        ))}
      </motion.div>

      {/* Inner ring counter-rotating */}
      <motion.div
        className="absolute inset-8 rounded-full border border-indigo-500/15"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        {[45, 135, 225, 315].map((deg) => (
          <div
            key={deg}
            className="absolute w-1.5 h-1.5 bg-indigo-400/50 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translateX(calc(50% + 4rem)) translateY(-50%)`,
            }}
          />
        ))}
      </motion.div>

      {/* Core vault icon */}
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
        {/* Scan line effect */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <motion.div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"
            animate={{ y: ['-100%', '500%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
          />
        </div>
        <Shield size={52} className="text-emerald-400 drop-shadow-lg" strokeWidth={1.5} aria-hidden="true" />
      </motion.div>

      {/* Floating micro-badges */}
      <motion.div
        className="absolute top-0 right-0 translate-x-2 -translate-y-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-display font-semibold text-emerald-300 whitespace-nowrap"
        style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', backdropFilter: 'blur(8px)' }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        AES-256
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 -translate-x-2 translate-y-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-display font-semibold text-indigo-300 whitespace-nowrap"
        style={{ background: 'rgba(94,106,210,0.15)', border: '1px solid rgba(94,106,210,0.3)', backdropFilter: 'blur(8px)' }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <CheckCircle2 size={10} className="text-indigo-400" />
        Zero-Knowledge
      </motion.div>
    </motion.div>
  );
}

/* ─── Floating Password Card ───────────────────────────────────── */
function PasswordCard({ card, mouseX, mouseY }) {
  const [revealed, setRevealed] = useState(false);
  const parallaxX = useTransform(mouseX, [-500, 500], [-6, 6]);
  const parallaxY = useTransform(mouseY, [-500, 500], [-4, 4]);

  return (
    <motion.div
      className="absolute hidden xl:block"
      style={{
        left: card.x,
        top: card.y,
        x: parallaxX,
        y: parallaxY,
        rotate: card.rotation,
        zIndex: 10,
      }}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8 + card.delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="glass-card p-4 w-56 cursor-pointer select-none"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4 + card.delay, repeat: Infinity, ease: 'easeInOut', delay: card.delay }}
        whileHover={{ scale: 1.03, rotate: 0 }}
        onClick={() => setRevealed(!revealed)}
        role="button"
        aria-label={`Password card for ${card.site}`}
        style={{
          boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${card.color}15`,
        }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
            >
              <span style={{ fontSize: '12px' }}>{card.icon}</span>
            </div>
            <div>
              <p className="text-xs font-display font-semibold text-white/90">{card.site}</p>
              <p className="text-[10px] text-white/40 truncate max-w-[80px]">{card.user}</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setRevealed(!revealed); }}
            className="p-1 rounded-md text-white/30 hover:text-white/70 hover:bg-white/8 transition-all duration-150"
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
        </div>

        {/* Password display */}
        <div
          className="px-2.5 py-2 rounded-lg mb-3 font-mono text-xs tracking-widest overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className={revealed ? 'text-white/90' : 'text-white/30 blur-[4px] select-none'}>
            {revealed ? 'Kx9#mP$qR2nL' : '••••••••••••••'}
          </span>
        </div>

        {/* Strength bar */}
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
          <span className="text-[10px] font-display font-semibold" style={{ color: card.color }}>
            {card.label}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Typewriter Words ─────────────────────────────────────────── */
const CYCLING_WORDS = ['peace of mind', 'digital security', 'zero worry', 'true freedom'];

function TypewriterCycle() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = CYCLING_WORDS[index];
    let timer;
    if (!isDeleting && displayed.length < word.length) {
      timer = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!isDeleting && displayed.length === word.length) {
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayed.length > 0) {
      timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setIndex((i) => (i + 1) % CYCLING_WORDS.length);
    }
    return () => clearTimeout(timer);
  }, [displayed, isDeleting, index]);

  return (
    <span className="text-gradient-green font-editorial italic">
      {displayed}
      <span className="inline-block w-0.5 h-[0.85em] ml-0.5 bg-emerald-400 align-middle animate-pulse" aria-hidden="true" />
    </span>
  );
}

/* ─── Trust Badges Row ─────────────────────────────────────────── */
const TRUST_ITEMS = [
  { icon: Shield, label: 'AES-256 Encrypted' },
  { icon: Lock, label: 'Zero-Knowledge' },
  { icon: Key, label: 'Open Audited' },
  { icon: Users, label: '500K+ Users' },
];

/* ─── Star Rating ──────────────────────────────────────────────── */
function StarRating({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

/* ─── Main HeroSection ─────────────────────────────────────────── */
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

          {/* ── Left: Copy ──────────────────────────────────────── */}
          <motion.div
            variants={STAGGER.container}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-left max-w-2xl"
          >
            {/* Announcement badge */}
            <motion.div variants={STAGGER.item} className="mb-8">
              <div className="badge-green">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                New — Version 2.0 is live
                <ChevronRight size={10} />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={STAGGER.item}
              id="hero-heading"
              className="font-editorial text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] leading-[1.0] font-semibold text-white mb-6"
              style={{ letterSpacing: '-0.03em' }}
            >
              One vault.<br />
              Unlimited{' '}
              <TypewriterCycle />
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={STAGGER.item}
              className="font-display text-lg sm:text-xl text-white/65 leading-relaxed mb-10 max-w-lg"
            >
              Your passwords are scattered. You reuse them. You forget them.
              You fear losing everything.<br className="hidden sm:block" />
              <span className="text-white/90 font-semibold">There's a better way.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={STAGGER.item}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10"
            >
              <Link
                to="/register"
                className="btn-primary text-base px-7 py-3.5"
                aria-label="Create your free SecureVault account"
              >
                <Shield size={16} strokeWidth={2.5} />
                Start for free
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-base px-6 py-3.5 group"
              >
                See how it works
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={STAGGER.item}
              className="flex items-center gap-3 mb-8"
            >
              {/* Avatar stack */}
              <div className="flex -space-x-2" aria-hidden="true">
                {['#10B981', '#5E6AD2', '#F59E0B', '#EF4444', '#8B5CF6'].map((color, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-[#020203] flex items-center justify-center text-[8px] font-bold text-white"
                    style={{ background: color, zIndex: 5 - i }}
                  >
                    {['M', 'S', 'A', 'J', 'K'][i]}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <StarRating count={5} />
                <p className="text-xs text-white/55 font-display mt-0.5">
                  Loved by <span className="text-white/85 font-semibold">500,000+</span> people worldwide
                </p>
              </div>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={STAGGER.item}
              className="flex flex-wrap items-center gap-x-5 gap-y-2.5"
              aria-label="Security certifications"
            >
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs font-display font-medium text-white/55">
                  <Icon size={11} className="text-emerald-400/80" strokeWidth={2} />
                  {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Visual ───────────────────────────────────── */}
          <div className="relative flex items-center justify-center min-h-[400px] lg:min-h-[560px]">
            {/* Vault orb */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <VaultOrb mouseX={mouseX} mouseY={mouseY} />
            </motion.div>

            {/* Floating password cards */}
            {FLOATING_CARDS.map((card) => (
              <PasswordCard key={card.id} card={card} mouseX={mouseX} mouseY={mouseY} />
            ))}

            {/* Bottom stat card */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 xl:left-auto xl:translate-x-0 xl:-left-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="glass-card px-5 py-4 flex items-center gap-4 min-w-[220px]"
                aria-label="Security status: All passwords secured"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
                >
                  <CheckCircle2 size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-display font-semibold text-white/95">All passwords secured</p>
                  <p className="text-[11px] text-white/55 font-display">Last synced just now</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" aria-hidden="true" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #020203)' }}
        aria-hidden="true"
      />
    </section>
  );
}
