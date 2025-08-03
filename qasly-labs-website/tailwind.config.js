/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-slow': 'fadeInSlow 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInSlow: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'Inter, sans-serif',
            color: '#e5e7eb',
            h1: {
              fontFamily: 'Inter, sans-serif',
              fontWeight: '800',
            },
            h2: {
              fontFamily: 'Inter, sans-serif',
              fontWeight: '700',
            },
            h3: {
              fontFamily: 'Inter, sans-serif',
              fontWeight: '600',
            },
            code: {
              fontFamily: 'JetBrains Mono, monospace',
            },
          },
        },
      },
    },
  },
  plugins: [],
} 