/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')


module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'xs': '422px',
      ...defaultTheme.screens
    },
    extend: {
      colors: {
        primaryBlack: '#121826',
        secondaryBlack: '#282C34',
        primaryGray: '#6C727F',
        secondaryGray: '#E5E7EB'
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}

