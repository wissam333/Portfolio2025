<template>

  <div >

      <ElementsLoader />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
  </div>
</template>


<script setup>


const {
  public: { api, apiBase },
} = useRuntimeConfig();





onMounted(async () => {
    try {
      // const MainMenueURL = `${api.GetMenuDetail}?categoryId=1`;
      // const MainSliderURL = `${api.Blocks}?categoryId=15`;
      // const HeaderURL = `${api.Blocks}?categoryId=9`;

        // const [MainMenueRes] = await Promise.all([
        //   $fetch(MainMenueURL, {
        //     baseURL: apiBase,
            
        //   }),
        //   // $fetch(MainSliderURL, {
        //   //   baseURL: apiBase,
            
        //   // }),
        //   // $fetch(HeaderURL, {
        //   //   baseURL: apiBase,
            
        //   // }),
        // ]);

        // if(MainMenueRes) {
          
        //   const activeSortedMenus = MainMenueRes.items
        //       .filter((item) => item.isActive)
        //       .sort((a, b) => a.levelOrder - b.levelOrder);
        //       useMenus().value = activeSortedMenus;
        // }
        // if (MainSliderRes) {
        //   useMainSlider().value = MainSliderRes.items
        // }
        // if (HeaderRes) {
        //   useHeadersPages().value = HeaderRes
        // }
        
        useGlobalLoader().value = false
    } catch (error) {
      console.error('Failed to fetch token:', error)
      useGlobalLoader().value = true
    }

  
})

const { locale } = useI18n();

// Set the page title based on the locale
const titles = {
  en: "Ugarit Center",
  ar: "مركز أوغاريت",
};

// Update the title dynamically
useHead({
  title: computed(() => titles[locale.value]),
});


</script>

<style lang="scss" scoped>

</style>
