/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Indian Flag Theme Colors
        primary: {
          50: '#fff8f1',
          100: '#ffecd9',
          200: '#ffd4b3',
          300: '#ffb77d',
          400: '#ff9945',
          500: '#ff7b1e',
          600: '#ff6b00',  // Saffron - Main
          700: '#cc5500',
          800: '#a34400',
          900: '#7a3300',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#138808',  // India Green - Main
          700: '#0f6e06',
          800: '#0c5705',
          900: '#094103',
        },
        navy: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a4b8fc',
          400: '#7e8ff8',
          500: '#5a67f2',
          600: '#000080',  // Navy Blue (Ashoka Chakra)
          700: '#000066',
          800: '#00004d',
          900: '#000033',
        }
      },
    },
  },
  plugins: [],
}
