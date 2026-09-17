/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        editorial: ['"Bodoni Moda"', 'Georgia', 'serif'],
        display: ['Jost', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f6ff',
          100: '#e0edff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        vault: {
          bg: '#020203',
          base: '#050506',
          elevated: '#0a0a0c',
          surface: 'rgba(255,255,255,0.04)',
          border: 'rgba(255,255,255,0.08)',
          green: '#10B981',
          'green-glow': 'rgba(16,185,129,0.15)',
          'green-mid': 'rgba(16,185,129,0.3)',
          indigo: '#5E6AD2',
          'indigo-glow': 'rgba(94,106,210,0.15)',
          muted: '#8A8F98',
          foreground: '#EDEDEF',
        },
      },
      animation: {
        'blob-slow': 'blob 12s ease-in-out infinite',
        'blob-slow-reverse': 'blob 15s ease-in-out infinite reverse',
        'blob-medium': 'blob 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 2s infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'scan-line': 'scan-line 4s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'counter-up': 'counter-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        blob: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', transform: 'translate(0,0) scale(1)' },
          '33%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%', transform: 'translate(30px,-20px) scale(1.05)' },
          '66%': { borderRadius: '50% 60% 30% 60% / 30% 40% 70% 50%', transform: 'translate(-20px,10px) scale(0.97)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.08)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(1deg)' },
          '66%': { transform: 'translateY(-6px) rotate(-1deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(400%)', opacity: '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'counter-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.12), transparent)',
        'hero-gradient-2': 'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(94,106,210,0.08), transparent)',
        'glow-green': 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)',
        'glow-indigo': 'radial-gradient(circle, rgba(94,106,210,0.2) 0%, transparent 70%)',
        'card-shimmer': 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
        'shimmer-fast': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
      },
    },
  },
  plugins: [],
};

