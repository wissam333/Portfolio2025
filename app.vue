<template>
  <div>
    <ElementsLoader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const { locale } = useI18n();

const titles = {
  en: "Wissam Najjom",
  ar: "وسام نجوم",
};
useHead({
  title: computed(() => titles[locale.value]),
});
</script>

<style lang="scss" scoped></style>
