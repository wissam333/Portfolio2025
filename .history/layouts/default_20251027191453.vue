<template>
  <div>
    <ClientOnly>
      <div :class="locale === 'ar' ? 'bodyAR' : 'bodyEN'">
        <SharedEggCounter :position="`top-left`"></SharedEggCounter>
        <SharedSocial :position="`top-left`"></SharedSocial>
        <SharedDevTools></SharedDevTools>
        <SharedMusic :position="`bottom-right`"></SharedMusic>
        <SharedAstronaut @startTour="tourRef.start()"></SharedAstronaut>
        <ElementsTour ref="tourRef" :steps="steps"></ElementsTour>
        <div >
          <slot />
        </div>
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
    titleAr: "البيضة الأولى",
    content: "Hover on snow to light up",
    contentAr: "مرّر المؤشر على الثلج ليضيء",
  },
  {
    selector: ".gotMe",
    title: "Second Easter Egg",
    titleAr: "البيضة الثانية",
    content: "Find heisenberg",
    contentAr: "ابحث عن هايزنبرغ",
  },
  {
    selector: ".SparklesText",
    title: "Third Easter Egg",
    titleAr: "البيضة الثالثة",
    content: "Scratch 'About Me' Word",
    contentAr: "قم بخدش كلمة 'نبذة عني'",
  },
  {
    selector: ".love-word",
    title: "Forth Easter Egg",
    titleAr: "البيضة الرابعة",
    content: "Click 'Love' Word",
    contentAr: "انقر على كلمة 'حب'",
  },
  {
    selector: ".moon",
    title: "Fifth Easter Egg",
    titleAr: "البيضة الخامسة",
    content: "Drag the floating astronaut to the moon",
    contentAr: "اسحب رائد الفضاء الطائر إلى القمر",
  },
  {
    selector: "",
    title: "Sixth Easter Egg",
    titleAr: "البيضة السادسة",
    content: "Open dev tools",
    contentAr: "افتح أدوات المطور",
  },
]);
</script>
<style lang="scss" scoped></style>
