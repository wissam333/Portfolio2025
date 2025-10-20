<template>
  <div>
    <ClientOnly>
      <SharedEggCounter :position="`top-left`"></SharedEggCounter>
      <SharedDevTools></SharedDevTools>
      <SharedMusic :position="`bottom-right`"></SharedMusic>
      <!-- <SharedAstronaut @startTour="tourRef.start()"></SharedAstronaut> -->
      <ElementsTour ref="tourRef" :steps="steps" />
      <div class="bodyEN">
        <slot />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
const { locale } = useI18n();

const tourRef = ref(null);

const steps = [
  { selector: ".logo", title: "Logo", content: "This is our logo" },
  { selector: ".menu", title: "Menu", content: "Here’s the menu" },
];
</script>
<style lang="scss" scoped></style>
