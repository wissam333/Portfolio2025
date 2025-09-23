<template>
  <div
    class="text-6xl font-bold relative overflow-visible"
    :class="props.class"
    @mousemove="handleMouseMove"
  >
    <span class="relative inline-block">
      <!-- Fire stars container -->
      <div class="stars">
        <template v-for="sparkle in sparkles" :key="sparkle.id">
          <Motion
            :initial="{
              opacity: 1,
              scale: 0.5,
              x: sparkle.xStart,
              y: sparkle.yStart,
            }"
            :animate="{
              opacity: [1, 0],
              x: [sparkle.xStart, sparkle.xEnd],
              y: [sparkle.yStart, sparkle.yEnd],
              scale: [0.5, sparkle.scale],
              rotate: [0, sparkle.rotate],
            }"
            :transition="{ duration: sparkle.duration, ease: 'easeOut' }"
            as="svg"
            class="absolute z-20 pointer-events-none"
            width="16"
            height="16"
            viewBox="0 0 21 21"
          >
            <path
              d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
              :fill="sparkle.color"
            />
          </Motion>
        </template>
      </div>

      <div>{{ text }}</div>
    </span>
  </div>
</template>

<script setup lang="ts">
import { Motion } from "motion-v";
import { ref } from "vue";

interface Sparkle {
  id: string;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  color: string;
  rotate: number;
  scale: number;
  duration: number;
}

interface Props {
  text: string;
  colors?: { first: string; second: string };
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ({ first: "#ff8a00", second: "#ff0044" }),
});

const sparkles = ref<Sparkle[]>([]);
let lastX = 0;
let lastTime = 0;

function handleMouseMove(e: MouseEvent) {
  const now = performance.now();
  const deltaX = e.clientX - lastX;
  const deltaTime = now - lastTime;

  // velocity in px/ms
  const velocity = deltaX / deltaTime;

  // only trigger bursts when fast movement (like shaking)
  if (Math.abs(velocity) > 0.5) {
    spawnBurst(e.clientX, e.clientY, velocity);
  }

  lastX = e.clientX;
  lastTime = now;
}

function spawnBurst(x: number, y: number, velocity: number) {
  const burst: Sparkle[] = Array.from({ length: 5 }, () => {
    const angle = Math.random() * 40 - 20 + (velocity > 0 ? 0 : 160); // left/right spread
    const distance = 80 + Math.random() * 50;

    return {
      id: `${Date.now()}-${Math.random()}`,
      xStart: x,
      yStart: y,
      xEnd: x + Math.cos(angle * (Math.PI / 180)) * distance,
      yEnd: y + Math.sin(angle * (Math.PI / 180)) * distance,
      color: Math.random() > 0.5 ? props.colors.first : props.colors.second,
      rotate: Math.random() * 180,
      scale: Math.random() * 1.2 + 0.6,
      duration: 0.6 + Math.random() * 0.4,
    };
  });

  sparkles.value.push(...burst);

  // auto-remove after animation
  setTimeout(() => {
    sparkles.value.splice(0, burst.length);
  }, 1000);
}
</script>

<style scoped>
.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
