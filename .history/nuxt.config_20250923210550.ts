// https://nuxt.com/docs/api/configuration/nuxt-config
import nora from "@primevue/themes/nora";
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
    "@vee-validate/nuxt",
    "@nuxtjs/fontaine",
    "shadcn-nuxt",
    "motion-v/nuxt",
  ],
  veeValidate: {
    autoImports: true,
  },

  // Font optimization
  fontMetrics: {
    fonts: ["Poppins"],
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
  primevue: {
    options: {
      theme: {
        preset: nora,
      },
    },
    components: {
      include: [],
    },
  },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "@/assets/scss/main.scss",
    "awesome-notifications/dist/style.css",
  ],
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

  aos: {
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: "DOMContentLoaded", // name of the event dispatched on the document, that AOS should initialize on
    initClassName: "aos-init", // class applied after initialization
    animatedClassName: "aos-animate", // class applied on animation
    useClassNames: false, // if true, will add content of data-aos as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
    // Settings that can be overridden on per-element basis, by data-aos-* attributes:
    offset: 60, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 800, // values from 0 to 3000, with step 50ms
    easing: "linear", // default easing for AOS animations
    once: true, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
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
          href: "/logo",
          type: "image/x-icon",
        },
      ],
      script: [],
    },
  },
  runtimeConfig: {
    serverApiBase: "",
    serverApi: {
      AuthLoginApi: "/api/identity/token",
      CurrencyGetDefaultApi: "/api/v1/Currencies/Defualt",
      CountriesGetAllApi: "/api/v1/Countries",
      NationalityGetAllApi: "api/v1/nations",

      BlocksApi: "/api/Blocks",

      //categories
      ProductsCategories: "/api/productcategories",

      // Menus
      MenusByCategoryId: "/api/menus",
      Menus: "/api/Menus",
      SoceialMediaApi: "/api/v1/menus/GetMenuMaster?categoryId=3",

      //pages
      GetPagesDetail: "/api/Pages",
    },
    public: {
      apiBase: "",
      api: {},
      globalDefaultImage: "/logo",
      cachedTime: 60 * 60 * 2 * 1000, // 60: second(1 minutes), 60: minutes(1 hours), 2 hours, 1000: milliseconds
    },
  },
  devtools: { enabled: true },
});
