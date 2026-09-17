import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import LandingNav from '../components/landing/LandingNav';
import HeroSection from '../components/landing/HeroSection';
import TrustedBy from '../components/landing/TrustedBy';
import ProblemSection from '../components/landing/ProblemSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import SecuritySection from '../components/landing/SecuritySection';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import Statistics from '../components/landing/Statistics';
import FAQSection from '../components/landing/FAQSection';
import FinalCTA from '../components/landing/FinalCTA';
import LandingFooter from '../components/landing/LandingFooter';

/**
 * LandingPage — The main marketing page for SecureVault.
 *
 * Narrative arc:
 *   Nav → Hero → TrustedBy → Problem → Features → Security
 *   → HowItWorks → Testimonials → Statistics → FAQ → CTA → Footer
 *
 * Every section is scroll-reveal animated via Framer Motion's whileInView.
 * The background class is applied to body for the dark cinematic gradient.
 */
export default function LandingPage() {
  // Apply landing-page class to body for specialized background treatment
  useEffect(() => {
    document.body.classList.add('landing-page');
    return () => document.body.classList.remove('landing-page');
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="landing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative min-h-screen"
        style={{ background: '#020203' }}
      >
        {/* Film grain noise texture for premium feel */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Skip to content — uses translate to hide off-screen, avoids display:flex conflict */}
        <a
          href="#main-content"
          className="fixed -top-20 left-4 z-[9999] focus:top-4 transition-[top] duration-200 btn-primary text-sm py-2 px-4"
          tabIndex={0}
        >
          Skip to main content
        </a>

        {/* ── Navigation ─────────────────────────────────────────────── */}
        <LandingNav />

        {/* ── Main Content ──────────────────────────────────────────── */}
        <main id="main-content">
          {/* 1. Hero — First impression. Vault animation. Emotional headline. */}
          <HeroSection />

          {/* 2. Trusted By — Social proof logos + key stats */}
          <TrustedBy />

          {/* 3. Problem — Paint the pain. Build urgency. */}
          <ProblemSection />

          {/* 4. Features — The solution. Interactive bento grid. */}
          <FeaturesSection />

          {/* 5. Security — Technical trust. Architecture deep-dive. */}
          <SecuritySection />

          {/* 6. How It Works — Simplicity. 3 steps. */}
          <HowItWorks />

          {/* 7. Testimonials — Social proof from real users. */}
          <Testimonials />

          {/* 8. Statistics — Animated numbers that wow. */}
          <Statistics />

          {/* 9. FAQ — Honest answers to security questions. */}
          <FAQSection />

          {/* 11. Final CTA — The close. Nebula glow. Magnetic buttons. */}
          <FinalCTA />

          {/* 12. Footer — Links, social, legal. */}
          <LandingFooter />
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
