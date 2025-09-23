<template>
  <div>
    <ClientOnly>
      <SharedMain :position="`top-left`"></SharedMain>
      <SharedDevTools></SharedDevTools>
      <SharedMusic :position="`bottom-right`"></SharedMusic>
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
