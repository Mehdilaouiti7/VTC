import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // "Midnight Galaxy" theme (Anthropic theme-factory skill): deep purple,
      // cosmic blue, lavender accent, silver — token names kept stable so the
      // rest of the app didn't need touching, only the hex values changed.
      colors: {
        noir: "#2b1e3e",
        anthracite: "#362849",
        anthracite2: "#413055",
        creme: "#e6e6fa",
        creme2: "#dcdcf2",
        or: "#8b6fae",
        "or-light": "#a98fc9",
        beige: "#4a4e8f",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(20,14,32,0.32)",
        deep: "0 30px 70px -25px rgba(16,11,26,0.6)",
        gold: "0 0 0 1px rgba(139,111,174,0.35)",
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
