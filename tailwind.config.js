// // /** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

const sizes = {
  "4px": '4px',
  "8px": '8px',
  "12px": '12px',
  "15px": '15px',
  "16px": '16px',
  "20px": '20px',
  "24px": '24px',
  "32px": '32px',
  "40px": '40px',
  "48px": '48px',
  "56px": '56px', 
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontSize: sizes,
      margin: sizes,
      padding: sizes,
      colors: {
        'brandColor': '#625df4',
        'brandColor-600': '#625df4',
        'brandColor-500': '#625df4',
        'brandColor-200': '#625df4',
        'brandColor-300': '#625df4',
        'lightGray': '#e5e7eb',
        'l-b2': '#e0e1f7',
        'l-l2': '#f7f7f8',
        'd-d2': '#f7f7f8',
        'd-l2': '#0e0e0e',
        'mainDark': '#212121',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Lexend', ...defaultTheme.fontFamily.sans],
      },
    }
  },
  plugins: [require('@tailwindcss/forms')],
}

