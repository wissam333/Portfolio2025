
export default defineNuxtPlugin((nuxtApp) => {
    const i18n = nuxtApp.$i18n
    const savedLanguage = localStorage.getItem("lang") ? localStorage.getItem("lang") : i18n.defaultLocale  ;
    i18n.locale.value = savedLanguage
});