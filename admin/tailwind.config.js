/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        admin: {
          bg: '#0f1117',
          card: '#1a1d2e',
          border: 'rgba(99,102,241,0.15)',
          'border-hover': 'rgba(99,102,241,0.3)',
        },
      },
    },
  },
  plugins: [],
}
