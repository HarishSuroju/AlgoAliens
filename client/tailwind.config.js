/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#480360', // dark neon pink
        'accent': '#4eb3c1', // azure
        'neon': '#a14097',   // neon pink
        'light': '#ffffff',  // white
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        'xl': '24px',
      },
    },
  },
  plugins: [],
}