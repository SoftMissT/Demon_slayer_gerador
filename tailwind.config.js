/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
        kimetsu: ['"Sawarabi Mincho"', 'serif'], // Para logo/display
        gangofthree: ['"M PLUS 1p"', '"Sawarabi Mincho"', 'serif'], // Para headings
      },
    },
  },
  plugins: [],
};