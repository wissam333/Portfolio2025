<template>
  <div>
    <ClientOnly>
      <SharedEggCounter :position="`top-left`"></SharedEggCounter>
      <SharedDevTools></SharedDevTools>
      <SharedMusic :position="`bottom-right`"></SharedMusic>
      <SharedAstronaut @startTour="tourRef.start()"></SharedAstronaut>
      <div class="bodyEN">
        <slot />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
const { locale } = useI18n();
</script>
<style lang="scss" scoped></style>
