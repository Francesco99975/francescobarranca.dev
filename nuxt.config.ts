// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "nuxt-icon",
    "nuxt-headlessui",
    "@nuxt/image",
    "nuxt-snackbar",
    "nuxt-jsonld",
    "nuxt-simple-sitemap",

    // "@nuxtjs/web-vitals",
  ],
  ignore: ["postgres"],
  image: {
    screen: {},
  },
  snackbar: {
    bottom: true,
    right: true,
    duration: 5000,
  },
  colorMode: {
    classSuffix: "",
  },
  css: ["~/assets/css/tailwind.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // webVitals: {
  //   // provider: "api",
  //   api: { url: "/api/vitals" },
  //   debug: true, // debug enable metrics reporting on dev environments
  // },
  runtimeConfig: {
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SEED_EMAIL: process.env.SEED_EMAIL,
    SEED_USERNAME: process.env.SEED_USERNAME,
    SEED_PASSWORD: process.env.SEED_PASSWORD,
    COOKIE_NAME: process.env.COOKIE_NAME,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    COOKIE_EXPIRES: process.env.COOKIE_EXPIRES,
    COOKIE_REMEMBER_ME_EXPIRES: process.env.COOKIE_REMEMBER_ME_EXPIRES,
    POSTMARK_API_KEY: process.env.POSTMARK_API_KEY,
    DEV_NAME: process.env.DEV_NAME,
    DEV_ADDRESS: process.env.DEV_ADDRESS,
    public: {
      socketPort: 9000,
      url:
        process.env.NODE_ENV === "production"
          ? "https://francescobarranca.dev"
          : "http://localhost:9000",
    },
  },
});
