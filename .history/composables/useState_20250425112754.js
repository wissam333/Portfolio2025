export const useGlobalLoader = () => useState('globalLoader', () => true);
export const useMainSlider = () => useState(() => []);
export const useMainSliderText = () => useState(() => []);
export const useMainToken = () => useState(() => null);
export const useRefreshMainToken = () => useState(() => []);
export const useToken = () => useState(() => null);
export const useMenus = () => useState(() => []);
export const useMenusFooter = () => useState(() => []);
export const useMenusSocial = () => useState(() => []);
export const useCurrency = () => useState(() => []);
export const useProductCategories = () => useState(() => []);
export const useUserInfo = () => useState(() => []);
export const useAccountType = () => useState(() => []);
export const useLang = () => useState(() => []);
export const useCart = () => useState(() => ({
  items: new Array(),
  totalQty: 0,
  totalPrice: 0
}));
export const useAuth = () => useState(() => ({
  isAuthenticated: false
}));
export const useImageLouded = () => useState(() => ({
  loaded: false
}));
export const useOpenNav = () => useState(() => false);
export const princedomORMap = () => useState(() => true);
export const useHeadersPages = () => useState(() => null);


export const showModal = () => useState(() => false);
export const modalData = () => useState(() => [{ id: 0, info: "", image: "" }]);

