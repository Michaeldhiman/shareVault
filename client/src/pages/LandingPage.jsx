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
 */
export default function LandingPage() {
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
        style={{ background: 'var(--sv-bg)' }}
      >
        <div className="noise-overlay" aria-hidden="true" />
        <a
          href="#main-content"
          className="fixed -top-20 left-4 z-[9999] focus:top-4 transition-[top] duration-200 btn-primary text-sm py-2 px-4"
          tabIndex={0}
        >
          Skip to main content
        </a>
        <LandingNav />
        <main id="main-content">
          <HeroSection />
          <TrustedBy />
          <ProblemSection />
          <FeaturesSection />
          <SecuritySection />
          <HowItWorks />
          <Testimonials />
          <Statistics />
          <FAQSection />
          <FinalCTA />
          <LandingFooter />
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
