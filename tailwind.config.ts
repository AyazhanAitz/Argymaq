import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // Тёплая молочная / кремовая база
        cream: {
          50: "#FDFBF6",
          100: "#FAF5EC",
          200: "#F3EAD8",
          300: "#EADFC5",
        },
        // Песочный
        sand: {
          100: "#EFE3CB",
          200: "#E4D2AC",
          300: "#D8BE8A",
          400: "#C9A868",
        },
        // Мягкий терракотовый (акцент тепла/CTA)
        terracotta: {
          50: "#FBEFE9",
          100: "#F3D9CB",
          400: "#C97A55",
          500: "#B5623E",
          600: "#9A4E31",
          700: "#7C3D26",
        },
        // Глубокий зелёный (доверие, вторичный акцент)
        forest: {
          50: "#EAF0EA",
          100: "#CFDDD0",
          400: "#4B6B52",
          500: "#3A5741",
          600: "#2C4433",
          700: "#20331F",
        },
        // Тёмный графит (текст, header/footer)
        graphite: {
          50: "#F3F3F2",
          200: "#D6D5D1",
          400: "#84837D",
          600: "#4A4944",
          700: "#33322E",
          800: "#242320",
          900: "#1B1A17",
        },
        // Акцентный золотистый
        gold: {
          300: "#E8C87A",
          400: "#D9AE4E",
          500: "#C29435",
          600: "#A17726",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 4px 24px -6px rgba(36, 35, 32, 0.12)",
        card: "0 2px 12px -2px rgba(36, 35, 32, 0.08)",
      },
      backgroundImage: {
        "ornament-line": "url('/ornament/line.svg')",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grow-width": {
          "0%": { width: "0%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
