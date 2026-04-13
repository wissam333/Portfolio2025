<template>
  <div class="text-6xl font-bold" :class="props.class">
    <span
      class="relative inline-block"
      ref="containerRef"
      @mousemove="handleMouseMove"
      @touchmove.passive="handleTouchMove"
      @touchstart.passive="handleTouchStart"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
    >
      <div class="stars" v-if="shouldShowAmbient">
        <Motion
          v-for="sparkle in visibleSparkles"
          :key="sparkle.id"
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
          <path :d="STAR_PATH" :fill="sparkle.color" />
        </Motion>
      </div>

      <div class="burst-layer">
        <Motion
          v-for="b in visibleBursts"
          :key="b.id"
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
          @motion-complete="removeBurst(b.id)"
        >
          <path :d="STAR_PATH" :fill="b.color" />
        </Motion>
      </div>

      <div class="SparklesText">{{ props.text }}</div>
    </span>

    <Transition name="fade">
      <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
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
  sparklesCount: 5,
  colors: () => ({ first: "#9E7AFF", second: "#FE8BBB" }),
});

// ── Constants ─────────────────────────────────────────────────────────────────
const STAR_PATH =
  "M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z";
const MAX_BURSTS = 15;
const AMBIENT_COUNT = Math.min(props.sparklesCount, 8);
const SPEED_FACTOR = 80;

// ── State ─────────────────────────────────────────────────────────────────────
const containerRef = ref<HTMLElement | null>(null);
const sparkles = ref<AmbientSparkle[]>([]);
const bursts = ref<BurstParticle[]>([]);
const toastMessage = ref("");
const isVisible = ref(true);
const isPageActive = ref(true);
const reduceMotion = ref(false);

// ── Computed ──────────────────────────────────────────────────────────────────
const shouldShowAmbient = computed(
  () => isVisible.value && isPageActive.value && !reduceMotion.value,
);
const visibleSparkles = computed(() =>
  shouldShowAmbient.value ? sparkles.value : [],
);
const visibleBursts = computed(() => bursts.value.slice(-MAX_BURSTS));

const pickColor = () =>
  Math.random() > 0.5 ? props.colors.first : props.colors.second;

// ── Ambient sparkles ──────────────────────────────────────────────────────────
const makeSparkle = (): AmbientSparkle => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 80 + 10}%`,
  color: pickColor(),
  delay: Math.random() * 2,
  scale: Math.random() + 0.3,
  lifespan: Math.random() * 10 + 5,
});

const updateStars = () => {
  if (!shouldShowAmbient.value) return;
  sparkles.value = sparkles.value.map((s) =>
    s.lifespan <= 0 ? makeSparkle() : { ...s, lifespan: s.lifespan - 0.1 },
  );
};

// ── Pointer tracking (shared mouse + touch logic) ─────────────────────────────
let pendingPointer: { clientX: number; clientY: number } | null = null;
let lastClientX: number | null = null;
let lastClientY: number | null = null;
let lastPointerTime: number | null = null;

// RAF-based throttle — processes at most once per frame
let rafThrottleId: number | null = null;

const schedulePointerProcess = () => {
  if (rafThrottleId) return;
  rafThrottleId = requestAnimationFrame(() => {
    rafThrottleId = null;
    if (!pendingPointer || !containerRef.value) return;

    const { clientX, clientY } = pendingPointer;
    pendingPointer = null;

    const rect = containerRef.value.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    const now = performance.now();

    if (
      lastClientX === null ||
      lastClientY === null ||
      lastPointerTime === null
    ) {
      lastClientX = clientX;
      lastClientY = clientY;
      lastPointerTime = now;
      return;
    }

    const dt = now - lastPointerTime;
    if (dt <= 0) return;

    const vx = (clientX - lastClientX) / dt;
    const vy = (clientY - lastClientY) / dt;
    const velocity = Math.hypot(vx, vy);

    if (velocity > 2 && bursts.value.length < MAX_BURSTS) {
      spawnBurst(offsetX, offsetY, vx, vy, velocity);
    }

    lastClientX = clientX;
    lastClientY = clientY;
    lastPointerTime = now;
  });
};

const handleMouseMove = (e: MouseEvent) => {
  pendingPointer = { clientX: e.clientX, clientY: e.clientY };
  schedulePointerProcess();
};

const handleTouchStart = (e: TouchEvent) => {
  const t = e.touches[0];
  if (!t) return;
  lastClientX = t.clientX;
  lastClientY = t.clientY;
  lastPointerTime = performance.now();
};

const handleTouchMove = (e: TouchEvent) => {
  const t = e.touches[0];
  if (!t || bursts.value.length >= MAX_BURSTS) return;
  pendingPointer = { clientX: t.clientX, clientY: t.clientY };
  schedulePointerProcess();
};

const handleTouchEnd = () => {
  lastClientX = null;
  lastClientY = null;
  lastPointerTime = null;
  pendingPointer = null;
};

// ── Burst spawning ────────────────────────────────────────────────────────────
const burstTimeouts: number[] = [];

const spawnBurst = (
  x: number,
  y: number,
  vx: number,
  vy: number,
  velocity: number,
) => {
  if (reduceMotion.value) return;

  const count = Math.min(3, MAX_BURSTS - bursts.value.length);
  const createdIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const spread = (Math.random() * 60 - 30) * (Math.PI / 180);
    const angle = Math.atan2(vy, vx) + spread;
    const distance = velocity * SPEED_FACTOR * (0.5 + Math.random() * 0.5);
    const duration = 0.4 + Math.random() * 0.8;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    bursts.value.push({
      id,
      xStart: Math.round(x),
      yStart: Math.round(y),
      xDelta: Math.cos(angle) * distance,
      yDelta: Math.sin(angle) * distance + Math.random() * 20,
      color: pickColor(),
      rotate: Math.random() * 360,
      rotateEnd: Math.random() * 360,
      scale: 0.8 + Math.random() * 0.8,
      duration,
    });
    createdIds.push(id);
  }

  const maxDur = Math.max(...bursts.value.slice(-count).map((b) => b.duration));
  burstTimeouts.push(
    window.setTimeout(
      () => {
        bursts.value = bursts.value.filter((b) => !createdIds.includes(b.id));
      },
      Math.ceil(maxDur * 1000) + 80,
    ),
  );

  if (!useEasterEggs().value.includes(5)) useEasterEggs().value.push(5);
};

const removeBurst = (id: string) => {
  bursts.value = bursts.value.filter((b) => b.id !== id);
};

// ── Visibility / motion ───────────────────────────────────────────────────────
const checkVisibility = () => {
  if (!containerRef.value) return;
  const { top, bottom } = containerRef.value.getBoundingClientRect();
  isVisible.value = top < window.innerHeight && bottom > 0;
};

// ── Lifecycle ─────────────────────────────────────────────────────────────────
let ambientInterval = 0;

onMounted(() => {
  reduceMotion.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  sparkles.value = Array.from({ length: AMBIENT_COUNT }, makeSparkle);

  ambientInterval = window.setInterval(updateStars, 100);

  window.addEventListener("scroll", checkVisibility, { passive: true });
  window.addEventListener("resize", checkVisibility, { passive: true });
  document.addEventListener("visibilitychange", () => {
    isPageActive.value = !document.hidden;
  });

  checkVisibility();
});

onUnmounted(() => {
  clearInterval(ambientInterval);
  burstTimeouts.forEach(clearTimeout);
  if (rafThrottleId) cancelAnimationFrame(rafThrottleId);

  window.removeEventListener("scroll", checkVisibility);
  window.removeEventListener("resize", checkVisibility);
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
  /* GPU acceleration */
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

.burst-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  height: 30px;
  /* GPU acceleration */
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

.toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #7c3aed;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 9999;
  /* Performance */
  backface-visibility: hidden;
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

/* Improve touch interaction */
.relative {
  touch-action: pan-x pan-y;
}

.SparklesText {
  user-select: none !important;
  /* Prevent layout shifts */
  display: inline-block;
  min-width: 1ch;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .stars,
  .burst-layer {
    display: none;
  }
}
</style>
