<template>
  <div>
    <div :class="locale === 'ar' ? 'bodyAR' : 'bodyEN'">
      <!-- Hydrate only when user interacts (idle = good fallback) -->
      <LazySharedEggCounter :position="`top-left`" hydrate-on-idle />

      <SharedSocial :position="`top-left`" hydrate-on-visible />

      <SharedDevTools hydrate-on-interaction="['mouseover', 'keydown']" />

      <LazySharedMusic :position="`bottom-right`" hydrate-on-visible />

      <LazySharedAstronaut hydrate-on-visible @startTour="tourRef.start()" />

      <LazyElementsTour
        ref="tourRef"
        :steps="steps"
        hydrate-on-interaction="['click']"
      />

      <div>
        <slot />
      </div>
    </div>
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
  {
    selector: ".snowflakes-container",
    title: "seventh Easter Egg",
    titleAr: "البيضة السابعة",
    content: "Click on the top of the page",
    contentAr: "انقر على أعلى الصفحة",
  },
]);
</script>
<style lang="scss" scoped></style>
