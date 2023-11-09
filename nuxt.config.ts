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
    "@nuxtjs/robots",
    "nuxt-jsonld",
    "nuxt-simple-sitemap",
    "nuxt-security",
  ],
  security: {
    nonce: true,
    // csrf: {
    //   https: process.env.NODE_ENV === "production",
    //   cookieKey: process.env.NODE_ENV === "production" ? "__Host-csrf" : "csrf",
    //   cookie: {
    //     path: "/",
    //     httpOnly: true,
    //     sameSite: "strict",
    //   },
    //   methodsToProtect: ["POST", "PUT", "PATCH"],
    // },
    headers: {
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === "production" ? "require-corp" : "unsafe-none",
      contentSecurityPolicy: {
        "img-src": [
          "'self'",
          process.env.NODE_ENV === "production"
            ? "https://media.francescobarranca.dev"
            : "http://localhost:8888",
        ],

        "form-action": ["'self'"],
        "style-src":
          process.env.NODE_ENV === "production"
            ? [
                "'self'", // backwards compatibility for older browsers that don't support strict-dynamic
                "'nonce-{{nonce}}'",
              ]
            : // In dev mode, we allow unsafe-inline so that hot reloading keeps working
              ["'self'", "'unsafe-inline'"],
        "style-src-attr":
          process.env.NODE_ENV === "production"
            ? [
                "'self'", // backwards compatibility for older browsers that don't support strict-dynamic
                "'nonce-{{nonce}}'",
              ]
            : // In dev mode, we allow unsafe-inline so that hot reloading keeps working
              ["'self'", "'unsafe-inline'"],
        "script-src": [
          "'self'", // fallback value for older browsers, automatically removed if `strict-dynamic` is supported.
          "'nonce-{{nonce}}'",
          "'strict-dynamic'",
        ],
        "script-src-attr": [
          "'self'", // fallback value for older browsers, automatically removed if `strict-dynamic` is supported.
          "'nonce-{{nonce}}'",
          "'strict-dynamic'",
        ],
      },
    },
    rateLimiter: {
      tokensPerInterval: 100,
      interval: 250000,
    },
    requestSizeLimiter: {
      maxUploadFileRequestInBytes: 50000000,
      maxRequestSizeInBytes: 50000000,
    },
  },
  routeRules: {
    "/about": {
      headers: {
        "Content-Security-Policy": "",
      },
    },
  },
  nitro: {
    compressPublicAssets: {
      brotli: true,
    },
    routeRules: {
      "/api/projects": {
        security: {
          xssValidator: false,
        },
      },
      "/img/**": {
        headers: {
          "cache-control": `public,max-age=${31536000},s-maxage=${31536000}`,
        },
      },
      "/_nuxt/**": {
        headers: {
          "cache-control": `public,max-age=${31536000},s-maxage=${31536000}`,
        },
      },
    },
  },
  sitemap: {
    exclude: ["/admin", "/admin/*", "/api/*", "/commissions/confirmation"],
    enabled: true,
  },
  robots: {
    rules: {
      UserAgent: "*",
      Disallow: "/",
      BlankLine: true,
      Sitemap:
        process.env.NODE_ENV === "production"
          ? "https://francescobarranca.dev/sitemap.xml"
          : "http://localhost:3000/sitemap.xml",
    },
  },
  ignore: ["postgres"],
  image: {
    screen: {},
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
  runtimeConfig: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_DEV: process.env.DATABASE_URL_DEV,
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
