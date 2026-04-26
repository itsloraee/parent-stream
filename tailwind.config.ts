import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand red
        brand: {
          50: '#FEE2E2',
          100: '#FECACA',
          200: '#FCA5A5',
          300: '#F87171',
          400: '#EF4444',
          500: '#DC2626', // primary red
          600: '#B91C1C',
          700: '#991B1B',
          800: '#7F1D1D',
          900: '#450A0A',
        },
        // Surface (dark backgrounds)
        surface: {
          900: '#0B0710',     // app background
          800: '#120D1A',     // page background with subtle gradient
          700: '#1A1227',     // card / input background
          600: '#241934',     // elevated card
          500: '#2D2240',     // border / divider
        },
        // Accents
        accent: {
          purple: '#3D1F4F',
          violet: '#4C2A6B',
          gold: '#FFD700',
          orange: '#FF8A3D',
          green: '#10B981',
        },
        // Text colors
        ink: {
          primary: '#FFFFFF',
          secondary: '#B8B5C5',
          tertiary: '#7A7689',
          muted: '#5A5668',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-app':
          'radial-gradient(ellipse at top, #1A0F1F 0%, #0B0710 50%, #0B0710 100%)',
        'gradient-card':
          'linear-gradient(135deg, #2A1A3A 0%, #1A1227 50%, #150E1F 100%)',
        'gradient-hero':
          'linear-gradient(180deg, rgba(11,7,16,0) 0%, rgba(11,7,16,0.9) 100%)',
        'gradient-brand':
          'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #991B1B 100%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(220, 38, 38, 0.45)',
        'glow-sm': '0 0 24px rgba(220, 38, 38, 0.3)',
        card: '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
