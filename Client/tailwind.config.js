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
        /* Professional & Trustworthy Color Scheme */
        'primary-pro': '#1E2A38', /* Navy Blue (Trust) */
        'secondary-pro': '#2AB3A6', /* Teal/Mint Green (Fresh, Money-related) */
        'accent-pro': '#3EC1D3', /* Sky Blue (Clean, Open) */
        'background-pro': '#F8F9FA', /* Light Grey/Off White (Minimalism) */
        'text-pro': '#333333', /* Dark Grey/Charcoal (Easy Readability) */
        
        /* Modern & Youthful Color Scheme (Current) */
        primary: '#4B0082', /* Deep Purple */
        secondary: '#00D084', /* Neon Green */
        accent: '#0077FF', /* Electric Blue */
        background: '#FAF9F6', /* Soft Cream/Beige */
        text: '#1A1A1A', /* Almost Black */
        
        /* Dark Mode Colors */
        'dark-bg': '#121212',
        'dark-text': '#E0E0E0'
      },
      fontFamily: {
        /* Professional Fonts */
        'heading-pro': ['Poppins', 'Montserrat', 'sans-serif'],
        'body-pro': ['Roboto', 'Open Sans', 'sans-serif'],
        
        /* Modern & Youthful Fonts (Current) */
        heading: ['Urbanist', 'Quicksand', 'sans-serif'],
        body: ['Inter', 'Nunito', 'sans-serif']
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.12)'
      }
    },
  },
  plugins: [],
}