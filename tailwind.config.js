/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Space Grotesk"', 'sans-serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      },
      colors: {
        brand: {
          purple: '#bf40ff',
          green: '#32D74B',
          dark: '#0f0f11',
          card: '#18181b',
          light: '#F8F9FA',
          primary: '#7C3AED', // Added partially from user edit diff
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(191, 64, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(191, 64, 255, 0.05) 1px, transparent 1px)",
        'bento-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
      }
    },
  },
  plugins: [],
}
