/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        toyNavy: {
          DEFAULT: '#0E2A47',
          deep: '#0A1E34',
          light: '#16385C',
          dark: '#060417',
        },
        toyOrange: {
          DEFAULT: '#F96515',
          dark: '#E05307',
          hover: '#EA580C',
          light: '#FFF2EA',
          soft: '#FEECE2',
        },
        toyCream: {
          DEFAULT: '#FAF8F5',
          warm: '#FDFBF7',
          accent: '#FDECC8',
          subtle: '#FFF7E6',
        },
        toyBg: {
          DEFAULT: '#FAF9F5',
          card: '#FFFFFF',
          single: '#F7F7F7',
        },
        toyText: {
          primary: '#1A293D',
          secondary: '#55657E',
          muted: '#7C8BA0',
          heading: '#0E2A47',
        },
        toyGold: '#FBBC34',
        toyRed: '#DD3333',
        toyGreen: '#459647',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Nunito Sans"', 'Arial', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        title: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        handwriting: ['"Patrick Hand"', '"Caveat"', 'cursive'],
        caveat: ['"Caveat"', 'cursive'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1222px',
          '2xl': '1222px',
        },
      },
    },
  },
  plugins: [],
}
