<template>
  <div
    class="marquee-container"
    @mouseover="pauseOnHover ? pauseAnimation() : null"
    @mouseleave="pauseOnHover ? resumeAnimation() : null"
  >
    <div class="marquee-inner" :style="{ animationDuration: duration }">
      <slot />
      <slot />
      <!-- duplicate for seamless scroll -->
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    pauseOnHover?: boolean;
    duration?: string;
  }>(),
  {
    pauseOnHover: false,
    duration: "40s",
  }
);

const pauseAnimation = () => {
  const el = document.querySelector(".marquee-inner") as HTMLElement;
  if (el) el.style.animationPlayState = "paused";
};

const resumeAnimation = () => {
  const el = document.querySelector(".marquee-inner") as HTMLElement;
  if (el) el.style.animationPlayState = "running";
};
</script>

<style scoped>
.marquee-container {
  overflow: hidden;
  width: 100%;
}

.marquee-inner {
  display: flex;
  gap: 1rem;
  animation: marquee linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
