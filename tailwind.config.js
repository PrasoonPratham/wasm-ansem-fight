/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "8bit": ["8bit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
