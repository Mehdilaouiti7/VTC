import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        noir: "#0a0a0c",
        anthracite: "#17171b",
        anthracite2: "#202024",
        creme: "#f7f4ee",
        creme2: "#efe9dd",
        or: "#b8965a",
        "or-light": "#d4b483",
        beige: "#e7ddc9",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(0,0,0,0.35)",
        gold: "0 0 0 1px rgba(184,150,90,0.4)",
      },
      borderRadius: {
        xl2: "1.1rem",
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease forwards",
        fadeIn: "fadeIn 1s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
