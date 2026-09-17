import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Engineering Manager',
    company: 'Figma',
    avatar: 'SC',
    avatarColor: '#5E6AD2',
    rating: 5,
    quote: "I switched from 1Password and I'm not looking back. The zero-knowledge architecture gives me actual confidence that my data is safe, and the UI is honestly more beautiful than any password manager I've used.",
    highlight: 'zero-knowledge architecture',
  },
  {
    id: 2,
    name: 'Marcus Williams',
    role: 'Senior Security Engineer',
    company: 'Cloudflare',
    avatar: 'MW',
    avatarColor: '#10B981',
    rating: 5,
    quote: "As someone who spends all day thinking about security, I'm extremely picky. SecureVault's PBKDF2 implementation and client-side encryption model is exactly what the industry should look like. The breach monitoring caught two of my old accounts within the first week.",
    highlight: 'PBKDF2 implementation',
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Product Designer',
    company: 'Linear',
    avatar: 'PP',
    avatarColor: '#F59E0B',
    rating: 5,
    quote: "I used to keep passwords in a Notes app like a monster. SecureVault took me 10 minutes to set up and I never think about passwords anymore. It just works, beautifully. The auto-fill is incredibly smooth.",
    highlight: 'It just works, beautifully',
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    role: 'CTO',
    company: 'Vercel',
    avatar: 'AR',
    avatarColor: '#8B5CF6',
    rating: 5,
    quote: "We evaluated five password managers for our 80-person team. SecureVault won on every dimension — security model, UX, pricing, and the sharing controls for teams. The audit logs alone are worth it.",
    highlight: 'won on every dimension',
  },
  {
    id: 5,
    name: 'Jamie Kim',
    role: 'Freelance Developer',
    company: 'Independent',
    avatar: 'JK',
    avatarColor: '#EF4444',
    rating: 5,
    quote: "The password strength analyzer showed me I had 47 weak or reused passwords I didn't even know about. Fixed them all in an afternoon. I sleep better now. Genuinely.",
    highlight: '47 weak or reused passwords',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const total = TESTIMONIALS.length;

  const prev = () => setActive((a) => (a - 1 + total) % total);
  const next = () => setActive((a) => (a + 1) % total);

  const t = TESTIMONIALS[active];

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      aria-labelledby="testimonials-heading"
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[400px] opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(94,106,210,1) 0%, transparent 60%)', filter: 'blur(80px)' }}
        aria-hidden="true"
      />

      <div className="container-xl relative z-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="badge-indigo mx-auto mb-6"
          >
            <Star size={10} className="fill-indigo-400 text-indigo-400" />
            Social proof
          </motion.div>

          <motion.h2
            id="testimonials-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-4xl sm:text-5xl font-semibold text-white leading-tight mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            Trusted by people<br />
            <span className="italic text-white/40">who don't trust easily.</span>
          </motion.h2>
        </div>

        {/* Main testimonial card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div
            className="glass-card p-8 lg:p-12 relative overflow-hidden"
            role="region"
            aria-label="Customer testimonials"
            aria-live="polite"
          >
            {/* Quote icon */}
            <Quote
              size={56}
              className="absolute top-8 right-8 opacity-[0.04] rotate-180"
              aria-hidden="true"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-6" aria-label={`${t.rating} star rating`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="font-display text-xl sm:text-2xl text-white/90 leading-relaxed mb-8 font-light">
                  "{t.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-display font-bold text-white flex-shrink-0"
                    style={{ background: t.avatarColor }}
                    aria-hidden="true"
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-white/95 text-sm">{t.name}</p>
                    <p className="font-display text-xs text-white/55 mt-0.5">
                      {t.role} · <span className="text-white/75">{t.company}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Dots */}
              <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial navigation">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    role="tab"
                    aria-selected={i === active}
                    aria-label={`Testimonial ${i + 1}`}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === active ? '24px' : '6px',
                      height: '6px',
                      background: i === active ? '#10B981' : 'rgba(255,255,255,0.15)',
                    }}
                  />
                ))}
              </div>

              {/* Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/8 transition-all duration-200"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/8 transition-all duration-200"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Mini preview cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {TESTIMONIALS.filter((_, i) => i !== active).slice(0, 4).map((testimonial) => (
              <motion.button
                key={testimonial.id}
                onClick={() => setActive(TESTIMONIALS.indexOf(testimonial))}
                className="glass-card p-3 text-left group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                aria-label={`Read ${testimonial.name}'s testimonial`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                    style={{ background: testimonial.avatarColor }}
                    aria-hidden="true"
                  >
                    {testimonial.avatar}
                  </div>
                  <p className="text-[11px] font-display font-semibold text-white/70 truncate">{testimonial.name}</p>
                </div>
                <p className="text-[11px] font-display text-white/50 leading-snug line-clamp-2">
                  "{testimonial.quote.slice(0, 60)}..."
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
