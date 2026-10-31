/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',   // ← TAMBAHKAN INI
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        'primary-dark': 'var(--primary-dark)',
        'primary-light': 'var(--primary-light)',
      },
    },
  },
  plugins: [],
}