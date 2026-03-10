/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#ff9900',
        'brand-orange-dark': '#e47911',
        'brand-navy': '#131921',
        'brand-navy-light': '#232f3e',
        'brand-blue': '#007185',
        'brand-red': '#cc0c39',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'product': '0 2px 8px rgba(0,0,0,0.08)',
        'product-hover': '0 4px 20px rgba(0,0,0,0.15)',
        'nav': '0 2px 6px rgba(0,0,0,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}