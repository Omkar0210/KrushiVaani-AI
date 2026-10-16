/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f0',
          100: '#dc-eddc',
          200: '#bcdcbc',
          300: '#8fc38f',
          400: '#5fa35f',
          500: '#3d8b3d',
          600: '#2d7d2d',
          700: '#246324',
          800: '#1e501e',
          900: '#163916',
          950: '#0a220a',
        },
        sage: {
          50: '#f6f8f4',
          100: '#ecefe8',
          200: '#d8ded3',
          300: '#bcc6b3',
          400: '#9fae91',
          500: '#809273',
          600: '#657959',
          700: '#506045',
          800: '#404d38',
          900: '#364032',
        },
        cream: {
          50: '#fdfbf6',
          100: '#faf5ea',
          200: '#f4ead2',
          300: '#ecdab5',
          400: '#e1c290',
          500: '#d4a868',
          600: '#c08f4e',
          700: '#a07340',
          800: '#845c38',
          900: '#6d4d33',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s linear infinite',
        'wave': 'wave 0.8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        wave: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};
