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
        sans: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(23,17,10,0.28)",
        deep: "0 30px 70px -25px rgba(10,10,12,0.55)",
        gold: "0 0 0 1px rgba(184,150,90,0.35)",
        "inner-edge": "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      borderRadius: {
        xl2: "1.1rem",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        fadeUp: "fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        fadeIn: "fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        kenburns: "kenburns 18s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
