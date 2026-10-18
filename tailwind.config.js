/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cambria: {
          950: '#060911',
          900: '#0b0f19',
          800: '#131b2e',
          700: '#1e2942',
          600: '#2d3b59',
          gold: {
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
          },
          crimson: {
            500: '#ef4444',
            600: '#dc2626',
            900: '#7f1d1d',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        medieval: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
};
