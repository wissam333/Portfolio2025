<template>
  <div>
    <ClientOnly>
      <SharedEggCounter :position="`top-left`"></SharedEggCounter>
      <SharedDevTools></SharedDevTools>
      <SharedMusic :position="`bottom-right`"></SharedMusic>
      <SharedAstronaut @startTour="tourRef.start()"></SharedAstronaut>
      <ElementsTour ref="tourRef" :steps="steps"></ElementsTour>
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
  { selector: ".star1", title: "First Easter Egg", content: "hover on snow to light up" },
];
</script>
<style lang="scss" scoped></style>
