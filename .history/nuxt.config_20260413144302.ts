import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  devtools: { enabled: true },

  modules: [
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxt/fonts",
    "shadcn-nuxt",
    "motion-v/nuxt",
    "nuxt-vitalizer",
    "nuxt-beastcss",
  ],

  // ── CSS ────────────────────────────────────────────────────────────────────
  css: ["bootstrap/dist/css/bootstrap.min.css", "@/assets/scss/main.scss"],

  // ── Vite ───────────────────────────────────────────────────────────────────
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

  // ── Build ──────────────────────────────────────────────────────────────────
  build: {
    cssMinify: true,
    postcss: {
      plugins: {
        cssnano: { preset: "default" },
      },
    },
  },

  // ── Fonts ──────────────────────────────────────────────────────────────────
  fonts: {
    defaults: { preload: true, display: "swap" },
  },

  // ── i18n ───────────────────────────────────────────────────────────────────
  i18n: {
    strategy: "no_prefix",
    langDir: "locales/",
    defaultLocale: "en",
    detectBrowserLanguage: false,
    locales: [
      {
        code: "en",
        iso: "en-US",
        name: "English",
        file: "en.json",
        dir: "ltr",
      },
      {
        code: "ar",
        iso: "ar-EG",
        name: "العربية",
        file: "ar.json",
        dir: "rtl",
      },
    ],
  },

  // ── nuxt-vitalizer ─────────────────────────────────────────────────────────
  vitalizer: {
    disableStylesheets: "entry",
    disablePrefetchLinks: true,
    disablePreloadLinks: true,
  },

  // ── nuxt-beastcss ──────────────────────────────────────────────────────────
  beastcss: {
    config: {
      pruneSource: true,
      asyncLoad: true,
    },
  },

  // ── App head ───────────────────────────────────────────────────────────────
  app: {
    head: {
      title: "Wissam Najjom",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Wissam Najjom — Front End Developer" },
        { name: "theme-color", content: "#000000" },
        { property: "og:title", content: "Wissam Najjom" },
        {
          property: "og:description",
          content: "Wissam Najjom — Front End Developer",
        },
        { property: "og:type", content: "website" },
      ],
      link: [
        { rel: "icon", href: "/logo/logo.png", type: "image/png" },
        { rel: "canonical", href: "https://wissamnajjom.com" },
      ],
    },
  },
});
