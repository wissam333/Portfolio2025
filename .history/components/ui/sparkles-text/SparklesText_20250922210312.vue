<template>
  <div class="text-6xl font-bold" :class="props.class">
    <span
      class="relative inline-block"
      ref="containerRef"
      @mousemove="handleMouseMove"
    >
      <!-- Ambient sparkles -->
      <div class="stars">
        <template v-for="sparkle in sparkles" :key="sparkle.id">
          <Motion
            :initial="{ opacity: 0, scale: 0, rotate: 75 }"
            :animate="{
              opacity: [0, 1, 0],
              scale: [0, sparkle.scale, 0],
              rotate: [75, 120, 150],
            }"
            :transition="{
              duration: 0.8,
              repeat: Infinity,
              delay: sparkle.delay,
            }"
            as="svg"
            class="pointer-events-none absolute z-10"
            :style="{ left: sparkle.x, top: sparkle.y, opacity: 0 }"
            width="21"
            height="21"
            viewBox="0 0 21 21"
          >
            <path
              d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
              :fill="sparkle.color"
            />
          </Motion>
        </template>
      </div>

      <!-- Burst stars -->
      <div class="burst-layer">
        <template v-for="b in bursts" :key="b.id">
          <Motion
            as="svg"
            class="absolute pointer-events-none z-20"
            :style="{ left: b.xStart + 'px', top: b.yStart + 'px' }"
            :initial="{ opacity: 1, scale: 0.7, rotate: b.rotate }"
            :animate="{
              opacity: 0,
              x: b.xDelta,
              y: b.yDelta,
              scale: [0.7, b.scale],
              rotate: b.rotateEnd,
            }"
            :transition="{ duration: b.duration, ease: 'easeOut' }"
            width="16"
            height="16"
            viewBox="0 0 21 21"
          >
            <path
              d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
              :fill="b.color"
            />
          </Motion>
        </template>
      </div>

      <div>{{ props.text }}</div>
    </span>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="toastMessage" class="toast">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Motion } from "motion-v";

interface AmbientSparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

interface BurstParticle {
  id: string;
  xStart: number;
  yStart: number;
  xDelta: number;
  yDelta: number;
  color: string;
  rotate: number;
  rotateEnd: number;
  scale: number;
  duration: number;
}

interface Props {
  text: string;
  sparklesCount?: number;
  colors?: { first: string; second: string };
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  sparklesCount: 10,
  colors: () => ({ first: "#9E7AFF", second: "#FE8BBB" }),
});

const sparkles = ref<AmbientSparkle[]>([]);
const bursts = ref<BurstParticle[]>([]);
const containerRef = ref<HTMLElement | null>(null);

let lastX: number | null = null;
let lastY: number | null = null;
let lastTime: number | null = null;
const burstTimeouts: number[] = [];
let ambientInterval = 0;

// --- Ambient stars ---
function generateStar(): AmbientSparkle {
  const starX = `${Math.random() * 100}%`;
  const starY = `${Math.random() * 80 + 10}%`;
  const color = Math.random() > 0.5 ? props.colors.first : props.colors.second;
  const delay = Math.random() * 2;
  const scale = Math.random() * 1 + 0.3;
  const lifespan = Math.random() * 10 + 5;
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return { id, x: starX, y: starY, color, delay, scale, lifespan };
}

function initializeStars() {
  sparkles.value = Array.from({ length: props.sparklesCount }, generateStar);
}

function updateStars() {
  sparkles.value = sparkles.value.map((star) =>
    star.lifespan <= 0
      ? generateStar()
      : { ...star, lifespan: star.lifespan - 0.1 }
  );
}

// --- Burst logic ---
function handleMouseMove(e: MouseEvent) {
  const el = containerRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;

  const now = performance.now();
  if (lastX === null || lastY === null || lastTime === null) {
    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = now;
    return;
  }

  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  const dt = now - lastTime;
  if (dt <= 0) return;

  const vx = dx / dt;
  const vy = dy / dt;
  const velocity = Math.sqrt(vx * vx + vy * vy);

  if (velocity > 3) spawnBurst(offsetX, offsetY, vx, vy, velocity);

  lastX = e.clientX;
  lastY = e.clientY;
  lastTime = now;
}

// Toast state
const toastMessage = ref<string | null>(null);
const showToast = (msg: string, duration = 1000000) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = null;
  }, duration);
};

function onBurstTriggered() {
  if (!useEasterEggs().value.find((e) => e == 5)) {
    useEasterEggs().value.push(5);
 
  }
}

function spawnBurst(
  x: number,
  y: number,
  vx: number,
  vy: number,
  velocity: number
) {
  const count = 3;
  const createdIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const speedFactor = 100;
    const spreadAngle = (Math.random() * 60 - 30) * (Math.PI / 180);
    const angle = Math.atan2(vy, vx) + spreadAngle;
    const distance = velocity * speedFactor * (0.5 + Math.random() * 0.5);

    const xDelta = Math.cos(angle) * distance;
    const yDelta = Math.sin(angle) * distance + 20 * Math.random(); // gravity

    const duration = 0.4 + Math.random() * 1.5;

    const p: BurstParticle = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      xStart: Math.round(x),
      yStart: Math.round(y),
      xDelta,
      yDelta,
      color: Math.random() > 0.5 ? props.colors.first : props.colors.second,
      rotate: Math.random() * 360,
      rotateEnd: Math.random() * 720,
      scale: 0.8 + Math.random() * 1.2,
      duration,
    };

    bursts.value.push(p);
    createdIds.push(p.id);
  }

  // Trigger easter egg
  onBurstTriggered();

  const maxDur = Math.max(...bursts.value.slice(-count).map((b) => b.duration));
  const t = window.setTimeout(() => {
    bursts.value = bursts.value.filter((b) => !createdIds.includes(b.id));
  }, Math.ceil(maxDur * 1000) + 80);
  burstTimeouts.push(t);
}

// --- lifecycle ---
onMounted(() => {
  initializeStars();
  ambientInterval = window.setInterval(updateStars, 100);
});

onUnmounted(() => {
  if (ambientInterval) clearInterval(ambientInterval);
  for (const t of burstTimeouts) clearTimeout(t);
});
</script>

<style scoped>
.stars {
  position: absolute;
  bottom: -50px;
  left: 0%;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.burst-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  height: 30px;
}

.toast {
  position: fixed;
  bottom: 40px; /* bottom-10 ≈ 2.5rem = 40px */
  left: 50%;
  transform: translateX(-50%);
  background-color: #7c3aed; /* bg-purple-700 */
  color: #ffffff; /* text-white */
  padding: 0.75rem 1.5rem; /* py-3 px-6 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  z-index: 9999;
}

/* Fade in/out transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
