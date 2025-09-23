<template>
  <div>
    <ClientOnly>
      <SharedMain :eggs="5" :total="10"></SharedMain>
      <div :class="locale == 'ar' ? 'bodyAR' : 'bodyEN'">
        <slot />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
const { locale } = useI18n();
</script>
<style lang="scss" scoped></style>
