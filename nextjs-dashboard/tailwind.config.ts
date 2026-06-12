import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          charcoal: '#231F20',
          red:      '#C41230',
          'red-dark': '#A30F28',
          white:    '#FFFFFF',
        },
        primary: {
          DEFAULT: '#231F20',
          dark:    '#3D3839',
          light:   '#F5F5F5',
        },
        neutral: {
          50:  '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        accent: {
          DEFAULT: '#C41230',
          dark:    '#A30F28',
          light:   '#FEF2F2',
        },
        category: {
          society:    { bg: '#FEF2F2', text: '#991B1B' },
          culture:    { bg: '#F5F5F5', text: '#404040' },
          humanities: { bg: '#F5F5F5', text: '#404040' },
          sports:     { bg: '#FFF7ED', text: '#9A3412' },
          startup:    { bg: '#F0FDF4', text: '#166534' },
          business:   { bg: '#F5F5F5', text: '#404040' },
        },
        status: {
          success: '#16A34A',
          error:   '#DC2626',
          warning: '#D97706',
          info:    '#2563EB',
        },
      },
      fontFamily: {
        'noto-serif': ['"Noto Serif KR"', 'Georgia', 'serif'],
        'noto-sans':  ['"Noto Sans KR"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        inter:        ['Inter', '"Helvetica Neue"', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3rem',    { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm': ['2.5rem',  { lineHeight: '1.2',  letterSpacing: '-0.015em' }],
        'heading-1':  ['2rem',    { lineHeight: '1.3',  letterSpacing: '-0.01em' }],
        'heading-2':  ['1.5rem',  { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        'heading-3':  ['1.25rem', { lineHeight: '1.4' }],
        'heading-4':  ['1.125rem',{ lineHeight: '1.4' }],
        'body-lg':    ['1.125rem',{ lineHeight: '1.8' }],
        body:         ['1rem',    { lineHeight: '1.8' }],
        'body-sm':    ['0.875rem',{ lineHeight: '1.6' }],
        caption:      ['0.75rem', { lineHeight: '1.5' }],
      },
      maxWidth: {
        content: '1280px',
        article: '720px',
        prose:   '680px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      gridTemplateColumns: {
        '13':           'repeat(13, minmax(0, 1fr))',
        article:        '1fr 320px',
        news:           'repeat(3, 1fr)',
        'news-featured':'2fr 1fr',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover':'0 4px 12px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.08)',
        header:     '0 1px 0 0 #E5E5E5',
        modal:      '0 20px 60px rgba(0,0,0,0.25)',
        dropdown:   '0 8px 24px rgba(0,0,0,0.12)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer:      'shimmer 2s infinite',
        ticker:       'ticker 30s linear infinite',
        'fade-in':    'fade-in 0.3s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};

export default config;
