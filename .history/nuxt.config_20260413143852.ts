// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  modules: [
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@nuxt/icon",
    "shadcn-nuxt",
    "motion-v/nuxt",
    "nuxt-beastcss",
    "nuxt-vitalizer",
    "@nuxt/fonts",
  ],

  vitalizer: {
    disableStylesheets: "entry",
    disablePrefetchLinks: true,
    disablePreloadLinks: true,
  },

  beastcss: {
    // Basic config
    config: {
      // 1. Critical CSS only
      pruneSource: true, // Removes the inlined CSS from the original stylesheet to avoid duplication

      // 2. Resource Management
      additionalStylesheets: [], // Add paths to extra CSS files (like Bootstrap CDN if you must use it)

      // 3. Performance
      asyncLoad: true, // Loads the remaining "non-critical" CSS asynchronously after the page paints
    },
  },

  fonts: {
    defaults: { preload: true, display: "swap" },
  },

  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/theme/variables.scss" as *;',
        },
      },
    },
  },

  i18n: {
    strategy: "no_prefix", // بدون تغيير في الرابط
    langDir: "locales/",
    defaultLocale: "en",
    locales: [
      {
        code: "ar",
        iso: "ar-EG",
        name: "العربية",
        file: "ar.json",
        dir: "rtl",
      },
      {
        code: "en",
        iso: "en-US",
        name: "English",
        file: "en.json",
        dir: "ltr",
      },
    ],
    detectBrowserLanguage: false,
  },

  css: ["bootstrap/dist/css/bootstrap.min.css", "@/assets/scss/main.scss"],
  build: {
    cssMinify: true,
    postcss: {
      plugins: {
        cssnano: {
          preset: "default",
        },
      },
    },
  },

  app: {
    head: {
      title: "Wissam Najjom",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Wissam Najjom Portfolio" },
      ],
      link: [
        {
          rel: "icon",
          href: "/logo/logo.png",
          type: "image/x-icon",
        },
      ],
      script: [],
    },
  },
  runtimeConfig: {},
  devtools: { enabled: true },
});
