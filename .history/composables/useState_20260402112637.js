// composables/useState.js
// Single source of truth for all global state.
// Always use useState() — never module-level ref() for shared state.

export const useToken = () => useState("token", () => null);
export const useMainToken = () => useState("", () => null);
export const useAuth = () => useState("auth", () => ({ isAuthenticated: false }));
export const useUserInfo = () => useState("userInfo", () => null);
export const useRole = () => useState("role", () => null);
export const useMenus = () => useState("menus", () => []);
export const useGlobalLoader = () => useState("globalLoader", () => false);

// ✅ useLang was used in Shared/social.vue but never defined → caused runtime error
export const useLang = () => useState("lang", () => "en");

// ✅ Easter eggs tracker (used across hero/about/etc)
export const useEasterEggs = () => useState("easterEggs", () => []);

// ✅ Cart state (referenced in composables)
export const useCart = () =>
  useState("cart", () => ({
    items: [],
    totalQty: 0,
    totalPrice: 0,
  }));