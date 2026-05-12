/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        triage: {
          red:    '#DC2626',
          orange: '#EA580C',
          yellow: '#CA8A04',
          green:  '#16A34A',
          blue:   '#2563EB',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
    },
  },
}