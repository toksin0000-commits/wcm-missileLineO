/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "animate-missile-flow",
    "animate-slide-in-up",
    "animate-pulse-slow",
    {
      pattern: /delay-m-\d+/,
    },
    {
      pattern: /scope-.*/,
    },
    {
      pattern: /animate-.*/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
