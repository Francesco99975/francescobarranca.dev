// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "nuxt-icon",
    "nuxt-headlessui",
    // "@nuxtjs/web-vitals",
  ],
  ignore: ["postgres"],
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
    cookieName: process.env.COOKIE_NAME || "__session",
    cookieSecret: process.env.COOKIE_SECRET || "secret",
    cookieExpires: parseInt(process.env.COOKIE_EXPIRES || "86400000"), // 1 day
    cookieRememberMeExpires: parseInt(
      process.env.COOKIE_REMEMBER_ME_EXPIRES || "604800000"
    ), // 7 days
    public: {
      socketPort: 3001,
      url: "http://192.168.0.38",
    },
  },
});
