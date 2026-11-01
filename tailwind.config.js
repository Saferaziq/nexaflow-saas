/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    // Warna background Light/Dark
    'bg-[#F4EFE9]',
    'bg-slate-950',
    'bg-white',
    'bg-slate-900',
    // Warna text Light/Dark
    'text-[#2A1F17]',
    'text-white',
    // Warna border
    'border-[#D4C5B8]',
    'border-slate-700',
    // Class dinamis lainnya
    'border-slate-600',
    'bg-[#F4EFE9]/95',
    'bg-slate-900/95',
    {
      pattern: /(bg|text|border)-(emerald|amber|rose|cyan|slate)-(100|200|300|400|500|600|700|800|900|950)/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /bg-(white|black)/,
      variants: ['hover', 'focus'],
    }
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