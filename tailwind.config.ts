import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        '0.2': '0.05rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        nalmara: {
          brand: '#760159',
          primary: '#760159',
          'magenta-light': '#9E0277',
          'magenta-dark': '#54013F',
          dark: '#1C0411',
          plum: '#760159',
          wine: '#760159',
          velvet: '#760159',
          gold: '#D4AF37',
          'gold-antique': '#BC9E65',
          'gold-light': '#FFE59E',
          cream: '#FFFDF9',
          linen: '#FAF0DD',
        },
        brand: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          gold: '#d97706',
          emerald: '#10b981',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
        serif: ['var(--font-display)', 'serif'],
        cinzel: ['var(--font-display)', 'serif'],
        montserrat: ['var(--font-sans)', 'sans-serif'],
        script: ['var(--font-script)', "'Great Vibes'", 'Georgia', 'cursive'],
        'great-vibes': ['var(--font-script)', "'Great Vibes'", 'Georgia', 'cursive'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'float': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'royal': '0 12px 32px rgba(56, 7, 37, 0.15)',
        'royal-hover': '0 20px 48px rgba(56, 7, 37, 0.25)',
        'gold-glow': '0 0 24px rgba(212, 175, 55, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 1.5s infinite',
        'flicker': 'flicker 2.5s infinite alternate ease-in-out',
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        flicker: {
          '0%': { opacity: '0.95', transform: 'scale(1) rotate(-1deg)' },
          '20%': { opacity: '1', transform: 'scale(1.04) rotate(1deg)' },
          '40%': { opacity: '0.92', transform: 'scale(0.97) rotate(-1.5deg)' },
          '60%': { opacity: '1', transform: 'scale(1.08) rotate(1.5deg)' },
          '80%': { opacity: '0.96', transform: 'scale(1) rotate(-0.5deg)' },
          '100%': { opacity: '1', transform: 'scale(1.04) rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
