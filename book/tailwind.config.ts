import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f1f4fa',
          100: '#dde3f0',
          200: '#b6c3df',
          300: '#8499c5',
          400: '#566fa6',
          500: '#34508a',
          600: '#243d6e',
          700: '#1a2e54',
          800: '#10203e',
          900: '#0a1730',
          950: '#06101f',
        },
        gold: {
          400: '#d6ad58',
          500: '#c4953d',
          600: '#a87d2d',
        },
        accent: {
          DEFAULT: '#2f6dff',
          soft: '#5f8dff',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        slide: '0 24px 64px -16px rgba(6, 16, 31, 0.45)',
        glow: '0 0 0 1px rgba(196,149,61,0.4), 0 18px 40px -10px rgba(196,149,61,0.35)',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #06101f 0%, #10203e 55%, #1a2e54 100%)',
        'navy-radial': 'radial-gradient(ellipse at top right, #1a2e54 0%, #06101f 70%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
