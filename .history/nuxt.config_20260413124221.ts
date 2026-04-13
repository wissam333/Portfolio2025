// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  modules: [
    "@nuxtjs/i18n",
    "@nuxt/image",
    "nuxt-swiper",
    "nuxt-aos",
    "@nuxt/icon",
    "@primevue/nuxt-module",
    // "@vee-validate/nuxt",
    "@nuxtjs/fontaine",
    "shadcn-nuxt",
    "motion-v/nuxt",
  ],
  // veeValidate: {
  //   autoImports: true,
  // },

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
        { name: "description", content: "Ugarit Center" },
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
