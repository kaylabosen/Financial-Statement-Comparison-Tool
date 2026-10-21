/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        finance: {
          bg: '#0B0F17',
          surface: '#111827',
          card: '#1F2937',
          border: '#374151',
          accent: '#3B82F6',
          green: '#10B981',
          red: '#EF4444',
          gold: '#F59E0B',
          cyan: '#06B6D4',
          purple: '#8B5CF6'
        }
      }
    },
  },
  plugins: [],
}
