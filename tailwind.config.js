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
          DEFAULT: '#0B0829',
          light: '#161240',
          dark: '#060417',
        },
        toyOrange: {
          DEFAULT: '#FF8400',
          hover: '#D86F00',
          light: '#FFF5EB',
        },
        toyBg: {
          DEFAULT: '#FFF1E3',
          card: '#FFFFFF',
          single: '#F7F7F7',
        },
        toyText: {
          primary: '#242424',
          secondary: '#767676',
          heading: '#333333',
        },
        toyGold: '#FBBC34',
        toyRed: '#DD3333',
        toyGreen: '#459647',
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'Arial', 'sans-serif'],
        title: ['Poppins', 'Arial', 'sans-serif'],
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
