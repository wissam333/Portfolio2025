<template>
  <div
    class="vortex-container"
    :class="cn('relative h-full w-full', props.containerClass)"
    ref="containerRef"
  >
    <Motion
      as="div"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      class="canvas"
    >
      <canvas ref="canvasRef"></canvas>
    </Motion>

    <div :class="cn('relative z-10', props.class)">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { createNoise3D } from "simplex-noise";
import { onMounted, onUnmounted, watch } from "vue";
import {
  templateRef,
  useDebounceFn,
  useRafFn,
  useElementVisibility,
} from "@vueuse/core";
import { cn } from "@/lib/utils";

const TAU = 2 * Math.PI;
const BASE_TTL = 50;
const RANGE_TTL = 150;
const PARTICLE_PROP_COUNT = 9;
const RANGE_HUE = 100;
const NOISE_STEPS = 3;
const X_OFF = 0.00125;
const Y_OFF = 0.00125;
const Z_OFF = 0.0005;

interface VortexProps {
  class?: string;
  containerClass?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

const props = withDefaults(defineProps<VortexProps>(), {
  particleCount: 300, // Reduced default count
  rangeY: 300,
  baseSpeed: 0.0,
  rangeSpeed: 1.5,
  baseRadius: 1,
  rangeRadius: 2,
  baseHue: 220,
  backgroundColor: "#000000",
});

// Performance state
const isPageActive = ref(true);
const reduceMotion = ref(false);

const tick = ref<number>(0);
const particleProps = shallowRef<Float32Array | null>(null);
const center = ref<[number, number]>([0, 0]);
const ctx = shallowRef<CanvasRenderingContext2D | null>(null);

const canvasRef = templateRef<HTMLCanvasElement | null>("canvasRef");
const containerRef = templateRef<HTMLElement | null>("containerRef");

// Use VueUse's visibility hook instead of manual checking
const isVisible = useElementVisibility(containerRef);

// Performance optimizations
const particleCache = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  life: 0,
  ttl: 0,
  speed: 0,
  radius: 0,
  hue: 0,
};

const noise3D = createNoise3D();

// Optimized math functions
const rand = (n: number) => n * Math.random();
const randRange = (n: number): number => n - rand(2 * n);
const fadeInOut = (t: number, m: number): number => {
  const hm = 0.5 * m;
  return Math.abs(((t + hm) % m) - hm) / hm;
};
const lerp = (n1: number, n2: number, speed: number): number => {
  return (1 - speed) * n1 + speed * n2;
};

function initParticle(i: number) {
  if (!particleProps.value || !canvasRef.value) return;

  const canvas = canvasRef.value;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  particleCache.x = rand(canvasWidth);
  particleCache.y = center.value[1] + randRange(props.rangeY);
  particleCache.vx = 0;
  particleCache.vy = 0;
  particleCache.life = 0;
  particleCache.ttl = BASE_TTL + rand(RANGE_TTL);
  particleCache.speed = props.baseSpeed + rand(props.rangeSpeed);
  particleCache.radius = props.baseRadius + rand(props.rangeRadius);
  particleCache.hue = props.baseHue + rand(RANGE_HUE);

  particleProps.value.set(
    [
      particleCache.x,
      particleCache.y,
      particleCache.vx,
      particleCache.vy,
      particleCache.life,
      particleCache.ttl,
      particleCache.speed,
      particleCache.radius,
      particleCache.hue,
    ],
    i
  );
}

function updateParticle(i: number) {
  if (!particleProps.value || !canvasRef.value || !ctx.value) return;

  const canvas = canvasRef.value;
  const propsArray = particleProps.value;
  const context = ctx.value;

  // Direct array access for performance
  const x = propsArray[i];
  const y = propsArray[i + 1];
  const vx = propsArray[i + 2];
  const vy = propsArray[i + 3];
  const life = propsArray[i + 4];
  const ttl = propsArray[i + 5];
  const speed = propsArray[i + 6];
  const radius = propsArray[i + 7];
  const hue = propsArray[i + 20];

  const n =
    noise3D(x * X_OFF, y * Y_OFF, tick.value * Z_OFF) * NOISE_STEPS * TAU;

  const nextVx = lerp(vx, Math.cos(n), 0.5);
  const nextVy = lerp(vy, Math.sin(n), 0.5);
  const nextX = x + nextVx * speed;
  const nextY = y + nextVy * speed;

  // Batch drawing operations
  const alpha = fadeInOut(life, ttl);

  // Use path batching for better performance
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(nextX, nextY);
  context.lineWidth = radius;
  context.strokeStyle = `hsla(${hue},100%,60%,${alpha})`;
  context.stroke();

  propsArray[i] = nextX;
  propsArray[i + 1] = nextY;
  propsArray[i + 2] = nextVx;
  propsArray[i + 3] = nextVy;
  propsArray[i + 4] = life + 1;

  // Recycle particles efficiently
  if (
    nextX > canvas.width ||
    nextX < 0 ||
    nextY > canvas.height ||
    nextY < 0 ||
    life > ttl
  ) {
    initParticle(i);
  }
}

function draw() {
  if (
    !canvasRef.value ||
    !ctx.value ||
    !particleProps.value ||
    !isVisible.value ||
    !isPageActive.value ||
    reduceMotion.value
  ) {
    return;
  }

  const canvas = canvasRef.value;
  const context = ctx.value;

  tick.value++;

  // Clear canvas efficiently
  context.fillStyle = props.backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Update all particles (simplified from batching for stability)
  const totalParticles = particleProps.value.length;
  for (let i = 0; i < totalParticles; i += PARTICLE_PROP_COUNT) {
    updateParticle(i);
  }

  // Reduced post-processing for performance
  context.save();
  context.filter = "blur(4px) brightness(150%)";
  context.globalCompositeOperation = "lighter";
  context.drawImage(canvas, 0, 0);
  context.restore();

  // Only apply heavy effects occasionally
  if (tick.value % 3 === 0) {
    context.save();
    context.filter = "blur(2px) brightness(120%)";
    context.globalCompositeOperation = "lighter";
    context.drawImage(canvas, 0, 0);
    context.restore();
  }
}

// Use vueuse's optimized RAF loop
const { pause: pauseAnimation, resume: resumeAnimation } = useRafFn(draw, {
  immediate: false,
});

const handleResize = useDebounceFn(() => {
  if (!canvasRef.value) return;

  const canvas = canvasRef.value;
  const { innerWidth, innerHeight } = window;

  // Only resize if dimensions changed significantly
  if (
    Math.abs(canvas.width - innerWidth) > 50 ||
    Math.abs(canvas.height - innerHeight) > 50
  ) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    center.value = [0.5 * canvas.width, 0.5 * canvas.height];

    // Reinitialize particles on resize
    if (particleProps.value) {
      const particlePropsLength = particleProps.value.length;
      for (let i = 0; i < particlePropsLength; i += PARTICLE_PROP_COUNT) {
        initParticle(i);
      }
    }
  }
}, 200);

function handleVisibilityChange() {
  isPageActive.value = !document.hidden;
}

function checkReduceMotion() {
  reduceMotion.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
}

// Watch performance conditions
watch(
  [isVisible, isPageActive, reduceMotion],
  ([visible, active, reduced]) => {
    if (visible && active && !reduced) {
      resumeAnimation();
    } else {
      pauseAnimation();
    }
  },
  { immediate: true }
);

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  ctx.value = canvas.getContext("2d", { alpha: false }); // Disable alpha for better performance
  if (!ctx.value) return;

  // Set canvas context properties once
  ctx.value.lineCap = "round";
  ctx.value.imageSmoothingEnabled = false;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.value = [0.5 * canvas.width, 0.5 * canvas.height];

  const particlePropsLength = props.particleCount * PARTICLE_PROP_COUNT;
  particleProps.value = new Float32Array(particlePropsLength);

  for (let i = 0; i < particlePropsLength; i += PARTICLE_PROP_COUNT) {
    initParticle(i);
  }

  // Initialize performance monitoring
  checkReduceMotion();

  window.addEventListener("resize", handleResize);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Start animation if conditions are met (handled by watcher)
});

onUnmounted(() => {
  pauseAnimation();
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("visibilitychange", handleVisibilityChange);

  ctx.value = null;
  particleProps.value = null;
});
</script>

<style lang="scss" scoped>
.vortex-container {
  position: relative;
  width: 100%;
  height: 100%;
  /* GPU acceleration */
  transform: translate3d(0, 0, 0);
}

.canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1 !important;
  /* Performance optimizations */
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000;

  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
    /* Optimize canvas rendering */
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .canvas {
    opacity: 0.5;
  }
}
</style>
