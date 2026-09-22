/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        editorial: ['"Bodoni Moda"', 'Georgia', 'serif'],
      },
      colors: {
        sv: {
          bg: 'var(--sv-bg)',
          'bg-subtle': 'var(--sv-bg-subtle)',
          surface: 'var(--sv-surface)',
          'surface-hover': 'var(--sv-surface-hover)',
          'surface-elevated': 'var(--sv-surface-elevated)',
          border: 'var(--sv-border)',
          'border-hover': 'var(--sv-border-hover)',
          'border-strong': 'var(--sv-border-strong)',
          'text-primary': 'var(--sv-text-primary)',
          'text-secondary': 'var(--sv-text-secondary)',
          'text-muted': 'var(--sv-text-muted)',
          accent: 'var(--sv-accent)',
          'accent-hover': 'var(--sv-accent-hover)',
          'accent-soft': 'var(--sv-accent-soft)',
          'accent-glow': 'var(--sv-accent-glow)',
          success: 'var(--sv-success)',
          warning: 'var(--sv-warning)',
          danger: 'var(--sv-danger)',
          info: 'var(--sv-info)',
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.08), transparent)',
      },
    },
  },
  plugins: [],
};
