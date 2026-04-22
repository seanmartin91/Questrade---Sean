/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#080c08',
          panel: '#0c110c',
          border: '#1a321a',
          green: '#00ff88',
          'green-dim': '#00cc66',
          'green-muted': '#3a7a3a',
          'green-dark': '#1a3a1a',
          amber: '#f0a500',
          red: '#ff4444',
          'red-dim': '#cc2222',
        }
      },
      animation: {
        blink: 'blink 1.2s step-end infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'count-up': 'fadeIn 0.8s ease-out',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.2 } },
        slideIn: { from: { opacity: 0, transform: 'translateY(-4px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      }
    },
  },
  plugins: [],
}
