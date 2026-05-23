/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Mirror the mobile app's God Theme palette so the website
      // feels like a natural extension of the app.
      colors: {
        saffron: {
          DEFAULT: "#FF6B00",
          light: "#FF8C42",
          dark: "#CC5500",
          deep: "#B34700",
        },
        bg: {
          primary: "#4A1306",
          secondary: "#7A3018",
          tertiary: "#9A4A28",
        },
        gold: {
          DEFAULT: "#D4A847",
          light: "#E8C874",
          dim: "#A07830",
        },
        maroon: {
          DEFAULT: "#4A0E1C",
          light: "#6B1A2E",
        },
        text: {
          primary: "#FFF0E0",
          secondary: "#C4A882",
          muted: "#7A5F45",
        },
        cream: "#FFF8F0",
      },
      fontFamily: {
        devanagari: ['"Noto Sans Devanagari"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
