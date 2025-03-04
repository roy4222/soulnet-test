/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a73e8',
          dark: '#1557b0',
        },
        secondary: {
          DEFAULT: '#4285f4',
          dark: '#3367d6',
        },
      },
    },
  },
  plugins: [],
} 