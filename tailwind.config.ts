import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Neutral charcoal/zinc base with a single desaturated emerald accent —
      // token names kept stable (inherited from an earlier purple theme) so
      // the rest of the app didn't need touching, only the hex values changed.
      colors: {
        noir: "#1c1c1e",
        anthracite: "#27272a",
        anthracite2: "#3a3a3f",
        creme: "#f7f6f3",
        creme2: "#efece6",
        or: "#0d8f6a",
        "or-light": "#2fac85",
        beige: "#6b6f76",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(18,18,20,0.32)",
        deep: "0 30px 70px -25px rgba(10,10,12,0.6)",
        gold: "0 0 0 1px rgba(13,143,106,0.35)",
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
          "0%": { opacity: "0", transform: "translateY(26px)" },
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
