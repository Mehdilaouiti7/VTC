import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // "Modernist" design system — flat, architectural, zero radius, a
      // single red accent on a light gray ground. Old token names kept as
      // aliases (noir/anthracite/creme/or) pointing at the new values so a
      // partial migration doesn't break, but every value changed.
      colors: {
        bg: "#f3f2f2",
        surface: "#eae9e9",
        ink: "#201e1d",
        accent: {
          DEFAULT: "#ec3013",
          100: "#fff2ef",
          200: "#ffe0d9",
          300: "#ffc4b8",
          400: "#ff9783",
          500: "#ff563c",
          600: "#dd2b0f",
          700: "#ae1800",
          800: "#7c1405",
          900: "#4d170e",
        },
        divider: "color-mix(in srgb, #201e1d 40%, transparent)",
        neutral: {
          100: "#f8f4f4",
          200: "#eae7e7",
          300: "#d7d3d3",
          400: "#bab6b6",
          500: "#9b9797",
          600: "#7d7979",
          700: "#605d5d",
          800: "#444141",
          900: "#2d2b2b",
        },
        // Aliases for a smaller diff on files not yet migrated.
        noir: "#201e1d",
        anthracite: "#201e1d",
        anthracite2: "#605d5d",
        creme: "#f3f2f2",
        creme2: "#eae9e9",
        or: "#ec3013",
        "or-light": "#ff563c",
        beige: "#605d5d",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "sans-serif"],
        sans: ["var(--font-archivo)", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        xl2: "0px",
      },
      boxShadow: {
        none: "none",
      },
    },
  },
  plugins: [],
};

export default config;
