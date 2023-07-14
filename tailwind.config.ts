import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [
    "./assets/**/*.{vue,js,css}",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./nuxt.config.{js,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        std: "rgb(var(--color-std) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        transparent: "transparent",
        current: "currentColor",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
