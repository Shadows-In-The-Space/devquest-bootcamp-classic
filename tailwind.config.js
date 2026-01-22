/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'display': ['Syncopate', 'sans-serif'],
        'mono': ['"Space Mono"', 'monospace'],
      },
      colors: {
        brand: {
          purple: '#7C3AED',
          green: '#32D74B',
          dark: '#0F0F23',
          card: '#18182B',
          light: '#F8F9FA',
          cta: '#F43F5E',
          primary: '#7C3AED',
          secondary: '#A78BFA',
        },
        graphics: {
          opengl: '#5586a4',
          vulkan: '#aa1e1e',
          shader: '#f59e0b',
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(124, 58, 237, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(124, 58, 237, 0.05) 1px, transparent 1px)",
        'bento-gradient': 'radial-gradient(circle at top right, rgba(124, 58, 237, 0.1), transparent), radial-gradient(circle at bottom left, rgba(50, 215, 75, 0.05), transparent)',
      }
    }
  },
  plugins: [],
}
