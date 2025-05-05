/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF7558',
        heading: '#2C2A49',
        body: '#6E6E6E',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        'pt-serif': ['PT Serif', 'serif'],
      },
    },
  },
  plugins: [],
} 