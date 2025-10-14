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
        gangofthree: ['"Yuji Syuku"', 'serif'],
      },
    },
  },
  plugins: [],
};