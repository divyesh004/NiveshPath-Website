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
        primary: '#1E2A38',
        secondary: '#2AB3A6',
        accent: '#3EC1D3',
        background: '#F8F9FA',
        text: '#333333',
        'dark-bg': '#121212',
        'dark-text': '#E0E0E0'
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}