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
import { onMounted, onUnmounted, ref, shallowRef, watch } from "vue";
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

// ── State ──────────────────────────────────────────────────────────────────
const isPageActive = ref(true);
const reduceMotion = ref(false);

// Plain primitives — zero Vue overhead in the hot path
let tick = 0;
let cssW = 0;
let cssH = 0;
const center: [number, number] = [0, 0];

const particleProps = shallowRef<Float32Array | null>(null);
const ctx = shallowRef<CanvasRenderingContext2D | null>(null);

// Separate offscreen canvas for the glow composite — fixes the
// "draw canvas onto itself" security error in Chrome 100+ / Safari 16+
let glowCanvas: HTMLCanvasElement | null = null;
let glowCtx: CanvasRenderingContext2D | null = null;

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
let _isLowEnd: boolean | null = null;
function isLowEndDevice(): boolean {
  if (_isLowEnd !== null) return _isLowEnd;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as any).deviceMemory ?? 4;
  _isLowEnd = cores <= 4 || memory <= 2;
  return _isLowEnd;
}

// ── Canvas / DPR setup ─────────────────────────────────────────────────────
function resizeCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
  // Use the container's actual size, not window — avoids mobile chrome toolbar jumps
  const rect = canvas.getBoundingClientRect();
  cssW = rect.width || window.innerWidth;
  cssH = rect.height || window.innerHeight;

  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx.value?.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Keep offscreen canvas in sync
  if (glowCanvas) {
    glowCanvas.width = canvas.width;
    glowCanvas.height = canvas.height;
    glowCtx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  center[0] = cssW * 0.5;
  center[1] = cssH * 0.5;
}

// ── Offscreen glow canvas ──────────────────────────────────────────────────
function initGlowCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  glowCanvas = document.createElement("canvas");
  glowCanvas.width = canvas.width;
  glowCanvas.height = canvas.height;

  // No alpha:false here — we need transparency for the composite
  glowCtx = glowCanvas.getContext("2d") ?? null;

  const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
  glowCtx?.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ── Particles ──────────────────────────────────────────────────────────────
function initParticle(i: number) {
  const arr = particleProps.value;
  if (!arr) return;

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
  const context = ctx.value;
  if (!arr || !context) return;

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

// ── Glow pass using offscreen canvas ──────────────────────────────────────
// Instead of drawing the canvas onto itself (blocked in modern browsers),
// we copy to a separate canvas, apply the filter there, then composite back.
function applyGlow() {
  const canvas = canvasRef.value;
  const context = ctx.value;
  if (!canvas || !context || !glowCanvas || !glowCtx) return;

  const dpr = Math.min(window.devicePixelRatio ?? 1, 2);

  // Copy current frame into the glow canvas (different source → no security error)
  glowCtx.clearRect(0, 0, cssW, cssH);
  glowCtx.drawImage(canvas, 0, 0, cssW, cssH);

  // First glow layer
  context.save();
  context.filter = "blur(8px) brightness(200%)";
  context.globalCompositeOperation = "lighter";
  context.drawImage(glowCanvas, 0, 0, cssW, cssH);
  context.restore();

  // Second glow layer (tighter)
  context.save();
  context.filter = "blur(4px) brightness(200%)";
  context.globalCompositeOperation = "lighter";
  context.drawImage(glowCanvas, 0, 0, cssW, cssH);
  context.restore();
}

// ── Draw loop ──────────────────────────────────────────────────────────────
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

  const context = ctx.value;
  tick++;

  context.fillStyle = props.backgroundColor;
  context.fillRect(0, 0, cssW, cssH);

  for (let i = 0; i < particleProps.value.length; i += PARTICLE_PROP_COUNT) {
    updateParticle(i);
  }

  if (!isLowEndDevice()) {
    applyGlow();
  }
}

// ── RAF ────────────────────────────────────────────────────────────────────
const { pause: pauseAnimation, resume: resumeAnimation } = useRafFn(draw, {
  immediate: false,
});

const handleResize = useDebounceFn(() => {
  resizeCanvas();
  const arr = particleProps.value;
  if (arr) {
    for (let i = 0; i < arr.length; i += PARTICLE_PROP_COUNT) initParticle(i);
  }
}, 150);

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

  // Do NOT use desynchronized:true — it causes silent failures on new Macs
  // (Apple Silicon + Metal GPU pipeline rejects it in certain Safari versions)
  ctx.value = canvas.getContext("2d", { alpha: false }) ?? null;
  if (!ctx.value) return;

  resizeCanvas();
  initGlowCanvas();

  const count = isLowEndDevice()
    ? Math.min(props.particleCount, 50)
    : props.particleCount;
  const len = count * PARTICLE_PROP_COUNT;
  particleProps.value = new Float32Array(len);
  for (let i = 0; i < len; i += PARTICLE_PROP_COUNT) initParticle(i);

  checkReduceMotion();
  window.addEventListener("resize", handleResize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onUnmounted(() => {
  pauseAnimation();
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  ctx.value = null;
  particleProps.value = null;
  glowCanvas = null;
  glowCtx = null;
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
