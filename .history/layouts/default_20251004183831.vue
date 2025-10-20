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
    selector: ".floating-astronaut",
    title: "Fifht Easter Egg",
    content: "Drag the astronaut to the moon",
  },
];
</script>
<style lang="scss" scoped></style>
