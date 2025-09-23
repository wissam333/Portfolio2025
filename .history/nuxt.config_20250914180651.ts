// https://nuxt.com/docs/api/configuration/nuxt-config
import nora from "@primevue/themes/nora";
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
  ],
  veeValidate: {
    autoImports: true,
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
  image: {
    provider: "ipx",
    domains: [""],
    format: ["webp"],
    quality: 80,
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
          href: "/logo/bluelogo.png",
          type: "image/x-icon",
        },
        {
          rel: "preconnect",
          href: "https://admin.schooltec.org",
          crossorigin: "",
        },
      ],
      script: [],
    },
  },
  runtimeConfig: {
    serverApiBase: "https://admin.schooltec.org",
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
      apiBase: "https://admin.schooltec.org",
      api: {
        // Auth
        RegisterNewEmail: "/api/identity/user",
        AuthLoginApi: "/api/identity/token",
        AuthRefreshTokenApi: "/api/identity/token/refresh",
        PersonClientsEditProfileApi: "/api/identity/account/UpdateProfile",
        ChangePasswordAdminApi: "/api/identity/account/ChangePassword",
        CompanyClientsApi: "/api/v1/Companies",
        PersonClientsApi: "/api/v1/Persons",
        MenusMasterGetByCategoryApi: "/api/v1/menus/GetMenuMaster",
        Newsletters: "/api/v1/Newsletters",
        // Menus
        MenusGetAllApi: "/api/v1/Menus/All",
        GetMenuDetail: "/api/v1/menus/GetMenuMaster",
        MenusByCategoryId: "/api/v1/Menus",
        Menus: "/api/Menus",

        //categories
        ProductsCategories: "/api/v1/ProductCategories/GetAll",
        MainCategories:
          "/api/v1/ProductCategories/GetAllParentCategoriesByType",
        SubCategories: "/api/ProductCategories/subcategories",

        //products
        GetProducts: "/api/v1/products/GetAllPaged",
        ProductdetailsApi: "/api/v1/Products",
        ProductImages: "/api/v1/ProductImages/GetAllByProduct",
        GetRelatedItems: "/api/v1/Products/GetAllPagedByBrandAndCategoryId",
        Newcollection: "/api/Products/newcollection",
        AllNewCollection: "/api/Products/allnewcollectionproducts",
        GetAllProductsById: "/api/Products/allproducts",
        GetProductsByCat: "/api/v1/Products/GetByAllCategory",
        GetNewProductsByCat: "/api/v1/Products/ProductsRecentAndAllCategory",
        SearchProducts: "/api/v1/Products/GetAllPagedSearchProduct",
        GetByCategoryId: "/api/v1/Products/GetAllPagedByCategoryId",
        GetProductsPaged: "/api/v1/Products/ProductsAllCategory",

        //fav
        AddToFav: "/api/v1/WishLists",
        RemoveFromFav: "/api/v1/WishLists",
        GetAllFav: "/api/v1/WishLists/GetAllPagedWishListsByClientId",

        //pages
        GetPagesDetail: "/api/Pages",

        //contact
        Contact: "/api/v1/ContactUS",

        //cities
        cityIdApi: "/api/v1/Princedoms",

        //order
        FinalOrdinaryOrders: "/api/v1/finalOrdinaryOrders",
        GetAllPagedFinalOrdinaryOrders:
          "/api/v1/FinalOrdinaryOrders/GetAllPagedFinalOrdinaryOrders",

        //cost
        ShippingCostsApi: "api/v1/ShippingCosts/GetAll",

        //offers
        GetProductsOffers: "/api/v1/ProductOffers/GetAllPaged",

        //points
        GetPoints: "/api/v1/ClientPoints/GetPagedByClient",

        //password
        ChangePasswordFromAccount: "/api/identity/account/ChangePassword",

        // options
        GetProductOptions: "/api/v1/ProductSumOptions/GetAllByProduct",

        //get all colors
        GetAllColors: "/api/v1/Colors",

        //coupon
        verfiyCoupon: "/api/v1/Coupons/IsValid",

        // Blocks
        Blocks: "/api/blocks",
        BlocksCategories: "/api/blockcategories",

        // Countries
        NationsApi: "/api/v1/nations",
        CitiesApi: "/api/Cities",
        CountriesGetAllApi: "/api/v1/Countries",
        InvoicesApi: "/api/v1/Invoices/GetAllPaged",
      },
      globalDefaultImage: "/images/parfume-2.jpg",
      cachedTime: 60 * 60 * 2 * 1000, // 60: second(1 minutes), 60: minutes(1 hours), 2 hours, 1000: milliseconds
    },
  },
  devtools: { enabled: true },
});
