/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "noto-sans": [ "Noto Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
}

