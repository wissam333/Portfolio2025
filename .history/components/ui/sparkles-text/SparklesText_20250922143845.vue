<template>
  <div
    class="text-6xl font-bold relative overflow-visible"
    :class="props.class"
    @mousemove="handleMouseMove"
    ref="root"
  >
    <span class="relative inline-block">
      <div class="stars">
        <template v-for="s in sparkles" :key="s.id">
          <Motion
            as="svg"
            class="absolute pointer-events-none z-20"
            :style="{ left: s.xStart + 'px', top: s.yStart + 'px' }"
            :initial="{ opacity: 1, scale: 0.6 }"
            :animate="{
              opacity: 0,
              x: s.xDelta,
              y: s.yDelta,
              scale: [0.6, s.scale],
              rotate: s.rotate,
            }"
            :transition="{ duration: s.duration, ease: 'easeOut' }"
            width="16"
            height="16"
            viewBox="0 0 21 21"
          >
            <!-- your star path -->
            <path
              d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
              :fill="s.color"
            />
          </Motion>
        </template>
      </div>

      <div>{{ props.text }}</div>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Motion } from "motion-v";

interface Props {
  text: string;
  colors?: { first: string; second: string };
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ({ first: "#ff8a00", second: "#ff0044" }),
});

interface Sparkle {
  id: string;
  xStart: number;
  yStart: number;
  xDelta: number;
  yDelta: number;
  color: string;
  rotate: number;
  scale: number;
  duration: number;
}

const sparkles = ref<Sparkle[]>([]);
const root = ref<HTMLElement | null>(null);

let lastX: number | null = null;
let lastTime: number | null = null;

function handleMouseMove(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement;
  if (!target) return;
  if (!root.value) root.value = target;
  const rect = target.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;

  const now = performance.now();
  if (lastX === null || lastTime === null) {
    lastX = e.clientX;
    lastTime = now;
    return;
  }

  const dx = e.clientX - lastX;
  const dt = now - lastTime;
  if (dt <= 0) {
    lastX = e.clientX;
    lastTime = now;
    return;
  }

  const velocity = dx / dt; // px per ms
  // tune threshold (0.5 is a good starting point)
  if (Math.abs(velocity) > 0.5) {
    spawnBurst(offsetX, offsetY, velocity);
  }

  lastX = e.clientX;
  lastTime = now;
}

function spawnBurst(offsetX: number, offsetY: number, velocity: number) {
  const count = 6;
  const burst: Sparkle[] = [];

  for (let i = 0; i < count; i++) {
    const angleSpread = 40;
    const baseAngle = velocity > 0 ? 0 : 180;
    const angle = baseAngle + (Math.random() * angleSpread - angleSpread / 2);
    const distance = 70 + Math.random() * 80;
    const rad = (angle * Math.PI) / 180;
    const xEnd = offsetX + Math.cos(rad) * distance;
    const yEnd = offsetY + Math.sin(rad) * distance - Math.random() * 20; // small upward bias
    const xDelta = xEnd - offsetX;
    const yDelta = yEnd - offsetY;
    const duration = 0.5 + Math.random() * 0.6;

    burst.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      xStart: Math.round(offsetX),
      yStart: Math.round(offsetY),
      xDelta: Math.round(xDelta),
      yDelta: Math.round(yDelta),
      color: Math.random() > 0.5 ? props.colors.first : props.colors.second,
      rotate: Math.round(Math.random() * 360),
      scale: 0.8 + Math.random() * 1.2,
      duration,
    });
  }

  sparkles.value.push(...burst);

  const maxDur = Math.max(...burst.map((b) => b.duration));
  setTimeout(() => {
    const ids = burst.map((b) => b.id);
    sparkles.value = sparkles.value.filter((s) => !ids.includes(s.id));
  }, Math.ceil(maxDur * 1000) + 120);
}
</script>

<style scoped>
.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: visible;
}
</style>
