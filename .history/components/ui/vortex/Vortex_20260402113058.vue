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
import { onMounted, onUnmounted, watch, ref, shallowRef } from "vue";
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
  particleCount: 100,
  rangeY: 300,
  baseSpeed: 0.0,
  rangeSpeed: 1.5,
  baseRadius: 1,
  rangeRadius: 2,
  baseHue: 220,
  backgroundColor: "#000000",
});

// ── Performance state (plain refs, never reactive in the render loop) ──────
const isPageActive = ref(true);
const reduceMotion = ref(false);

// Use a plain number for tick — no Vue reactivity needed here at all
let tick = 0;

const particleProps = shallowRef<Float32Array | null>(null);
const center: [number, number] = [0, 0]; // plain array, never reactive
const ctx = shallowRef<CanvasRenderingContext2D | null>(null);

const canvasRef = templateRef<HTMLCanvasElement | null>("canvasRef");
const containerRef = templateRef<HTMLElement | null>("containerRef");

const isVisible = useElementVisibility(containerRef);

const noise3D = createNoise3D();

// ── Helpers ────────────────────────────────────────────────────────────────
const rand = (n: number) => n * Math.random();
const randRange = (n: number) => n - rand(2 * n);
const fadeInOut = (t: number, m: number) => {
  const hm = 0.5 * m;
  return Math.abs(((t + hm) % m) - hm) / hm;
};
const lerp = (n1: number, n2: number, speed: number) =>
  (1 - speed) * n1 + speed * n2;

// ── Detect low-end device ──────────────────────────────────────────────────
function isLowEndDevice(): boolean {
  // navigator.hardwareConcurrency is ≤ 4 on most low-end phones
  const cores = navigator.hardwareConcurrency ?? 4;
  // navigator.deviceMemory is in GB (Chrome/Android only)
  const memory = (navigator as any).deviceMemory ?? 4;
  return cores <= 4 || memory <= 2;
}

// ── Resize & DPR handling ──────────────────────────────────────────────────
function resizeCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  // Cap DPR at 2 — higher values burn GPU memory on mobile for no visible gain
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
  const w = canvas.offsetWidth || window.innerWidth;
  const h = canvas.offsetHeight || window.innerHeight;

  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);

  // Scale context so all drawing coords stay in CSS-pixel space
  ctx.value?.setTransform(dpr, 0, 0, dpr, 0, 0);

  center[0] = w * 0.5;
  center[1] = h * 0.5;
}

// ── Particle helpers ───────────────────────────────────────────────────────
function initParticle(i: number) {
  const arr = particleProps.value;
  const canvas = canvasRef.value;
  if (!arr || !canvas) return;

  // Use CSS pixel size (canvas.width / dpr), so particles spread correctly
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
  const cssW = canvas.width / dpr;

  arr[i] = rand(cssW);
  arr[i + 1] = center[1] + randRange(props.rangeY);
  arr[i + 2] = 0;
  arr[i + 3] = 0;
  arr[i + 4] = 0;
  arr[i + 5] = BASE_TTL + rand(RANGE_TTL);
  arr[i + 6] = props.baseSpeed + rand(props.rangeSpeed);
  arr[i + 7] = props.baseRadius + rand(props.rangeRadius);
  arr[i + 8] = props.baseHue + rand(RANGE_HUE);
}

function updateParticle(i: number) {
  const arr = particleProps.value;
  const canvas = canvasRef.value;
  const context = ctx.value;
  if (!arr || !canvas || !context) return;

  const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
  const cssW = canvas.width / dpr;
  const cssH = canvas.height / dpr;

  const x = arr[i];
  const y = arr[i + 1];
  const vx = arr[i + 2];
  const vy = arr[i + 3];
  const life = arr[i + 4];
  const ttl = arr[i + 5];
  const speed = arr[i + 6];
  const radius = arr[i + 7];
  const hue = arr[i + 8];

  const n = noise3D(x * X_OFF, y * Y_OFF, tick * Z_OFF) * NOISE_STEPS * TAU;
  const nextVx = lerp(vx, Math.cos(n), 0.5);
  const nextVy = lerp(vy, Math.sin(n), 0.5);
  const nextX = x + nextVx * speed;
  const nextY = y + nextVy * speed;

  const alpha = fadeInOut(life, ttl);

  context.save();
  context.lineCap = "round";
  context.lineWidth = radius;
  context.strokeStyle = `hsla(${hue},100%,60%,${alpha})`;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(nextX, nextY);
  context.stroke();
  context.restore();

  arr[i] = nextX;
  arr[i + 1] = nextY;
  arr[i + 2] = nextVx;
  arr[i + 3] = nextVy;
  arr[i + 4] = life + 1;

  if (nextX > cssW || nextX < 0 || nextY > cssH || nextY < 0 || life > ttl) {
    initParticle(i);
  }
}

// ── Main draw loop ─────────────────────────────────────────────────────────
function draw() {
  if (
    !canvasRef.value ||
    !ctx.value ||
    !particleProps.value ||
    !isVisible.value ||
    !isPageActive.value ||
    reduceMotion.value
  )
    return;

  const canvas = canvasRef.value;
  const context = ctx.value;
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
  const cssW = canvas.width / dpr;
  const cssH = canvas.height / dpr;

  tick++;

  context.fillStyle = props.backgroundColor;
  context.fillRect(0, 0, cssW, cssH);

  for (let i = 0; i < particleProps.value.length; i += PARTICLE_PROP_COUNT) {
    updateParticle(i);
  }

  // ── Glow pass — skip entirely on low-end devices ────────────────────────
  if (!isLowEndDevice()) {
    context.save();
    context.filter = "blur(8px) brightness(200%)";
    context.globalCompositeOperation = "lighter";
    context.drawImage(canvas, 0, 0, cssW, cssH);
    context.restore();

    context.save();
    context.filter = "blur(4px) brightness(200%)";
    context.globalCompositeOperation = "lighter";
    context.drawImage(canvas, 0, 0, cssW, cssH);
    context.restore();
  }
}

// ── RAF loop ───────────────────────────────────────────────────────────────
const { pause: pauseAnimation, resume: resumeAnimation } = useRafFn(draw, {
  immediate: false,
});

// ── Resize ─────────────────────────────────────────────────────────────────
const handleResize = useDebounceFn(() => {
  resizeCanvas();
  if (particleProps.value) {
    for (let i = 0; i < particleProps.value.length; i += PARTICLE_PROP_COUNT) {
      initParticle(i);
    }
  }
}, 150);

// ── Visibility / motion ────────────────────────────────────────────────────
function handleVisibilityChange() {
  isPageActive.value = !document.hidden;
}

function checkReduceMotion() {
  reduceMotion.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
}

watch(
  [isVisible, isPageActive, reduceMotion],
  ([visible, active, reduced]) => {
    if (visible && active && !reduced) resumeAnimation();
    else pauseAnimation();
  },
  { immediate: true },
);

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  ctx.value = canvas.getContext("2d", {
    alpha: false, // skip alpha compositing — measurable perf win
    desynchronized: true, // hint to browser: don't sync with DOM paint
  });
  if (!ctx.value) return;

  resizeCanvas();

  // Reduce particle count on low-end devices
  const count = isLowEndDevice()
    ? Math.min(props.particleCount, 50)
    : props.particleCount;

  const len = count * PARTICLE_PROP_COUNT;
  particleProps.value = new Float32Array(len);
  for (let i = 0; i < len; i += PARTICLE_PROP_COUNT) initParticle(i);

  checkReduceMotion();

  // passive:true lets the browser skip calling preventDefault — scroll perf fix
  window.addEventListener("resize", handleResize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);
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
}

.canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1 !important;

  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .canvas {
    opacity: 0.3;
    animation: none;
  }
}
</style>
