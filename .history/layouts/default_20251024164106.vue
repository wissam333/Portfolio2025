<template>
  <div :class="locale === 'ar' ? 'bodyAR' : 'bodyEN'">
    <ClientOnly>
      <SharedEggCounter :position="`top-left`"></SharedEggCounter>
      <SharedSocial :position="`top-left`"></SharedSocial>
      <SharedDevTools></SharedDevTools>
      <SharedMusic :position="`bottom-right`"></SharedMusic>
      <SharedAstronaut @startTour="tourRef.start()"></SharedAstronaut>
      <ElementsTour ref="tourRef" :steps="steps"></ElementsTour>
      <div>
        <slot />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
const { locale } = useI18n();

const tourRef = ref(null);

let steps = ref([
  {
    selector: ".star1",
    title: "First Easter Egg",
    content: "Hover on snow to light up",
  },
  {
    selector: ".gotMe",
    title: "Second Easter Egg",
    content: "Find heisenberg",
  },
  {
    selector: ".SparklesText",
    title: "Third Easter Egg",
    content: "Scratch 'About Me' Word",
  },
  {
    selector: ".love-word",
    title: "Forth Easter Egg",
    content: "Click 'Love' Word",
  },
  {
    selector: ".moon",
    title: "Fifht Easter Egg",
    content: "Drag the floating astronaut to the moon",
  },
  {
    selector: "",
    title: "Sixth Easter Egg",
    content: "Open dev tools",
  },
]);
</script>
<style lang="scss" scoped></style>
