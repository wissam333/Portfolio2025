<template>
  <canvas
    ref="canvasRef"
    width="300"
    height="300"
    :class="cn('rounded-lg', $props.class)"
    role="img"
    aria-label="Interactive 3D Image Cloud"
    @mousedown="handleMouseDown"
    @mousemove="throttledMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  />
</template>

<script lang="ts" setup>
import type { SphereIcon, IconCloudProps } from "./index";
import { cn } from "@/lib/utils";

const props = defineProps<IconCloudProps>();

// ── Refs ──────────────────────────────────────────────────────────────────────
const canvasRef = ref<HTMLCanvasElement | null>(null);
const animationFrameId = ref(0);
const imageCanvases = ref<HTMLCanvasElement[]>([]);
const imagesLoaded = ref<boolean[]>([]);
const isDragging = ref(false);
const lastMousePos = ref({ x: 0, y: 0 });
const mousePos = ref({ x: 0, y: 0 });
const rotation = ref({ x: 0, y: 0 });
const targetRotation = ref<{
  x: number;
  y: number;
  startX: number;
  startY: number;
  startTime: number;
  duration: number;
} | null>(null);

// ── Image positions (recalc only when images change) ──────────────────────────
const imagePositions = computed<SphereIcon[]>(() => {
  const count = props.images?.length ?? 0;
  if (!count) return [];

  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));

  return Array.from({ length: count }, (_, i) => {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    return {
      x: Math.cos(phi) * r * 100,
      y: y * 100,
      z: Math.sin(phi) * r * 100,
      scale: 1,
      opacity: 1,
      id: i,
    };
  });
});

// ── Load offscreen image canvases (client-only) ───────────────────────────────
const loadImages = (urls: string[]) => {
  imagesLoaded.value = new Array(urls.length).fill(false);
  imageCanvases.value = urls.map((url, idx) => {
    const offscreen = document.createElement("canvas");
    offscreen.width = 40;
    offscreen.height = 40;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return offscreen;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      ctx.clearRect(0, 0, 40, 40);
      ctx.beginPath();
      ctx.arc(20, 20, 20, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 0, 0, 40, 40);
      imagesLoaded.value[idx] = true;
    };
    return offscreen;
  });
};

// ── Mouse handlers ────────────────────────────────────────────────────────────
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

function handleMouseDown(e: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const cosX = Math.cos(rotation.value.x);
  const sinX = Math.sin(rotation.value.x);
  const cosY = Math.cos(rotation.value.y);
  const sinY = Math.sin(rotation.value.y);

  for (const icon of imagePositions.value) {
    const rotatedX = icon.x * cosY - icon.z * sinY;
    const rotatedZ = icon.x * sinY + icon.z * cosY;
    const rotatedY = icon.y * cosX + rotatedZ * sinX;
    const scale = (rotatedZ + 200) / 300;
    const screenX = canvas.width / 2 + rotatedX;
    const screenY = canvas.height / 2 + rotatedY;
    const radius = 20 * scale;
    const dx = x - screenX;
    const dy = y - screenY;

    if (dx * dx + dy * dy < radius * radius) {
      const tx = -Math.atan2(icon.y, Math.sqrt(icon.x ** 2 + icon.z ** 2));
      const ty = Math.atan2(icon.x, icon.z);
      const dist = Math.hypot(tx - rotation.value.x, ty - rotation.value.y);
      const duration = Math.min(2000, Math.max(800, dist * 1000));

      targetRotation.value = {
        x: tx,
        y: ty,
        startX: rotation.value.x,
        startY: rotation.value.y,
        startTime: performance.now(),
        duration,
      };
      break;
    }
  }

  isDragging.value = true;
  lastMousePos.value.x = e.clientX;
  lastMousePos.value.y = e.clientY;
}

// Throttle via requestAnimationFrame — no setTimeout needed
let pendingMove: MouseEvent | null = null;
const throttledMouseMove = (e: MouseEvent) => {
  pendingMove = e;
};

function handleMouseUp() {
  isDragging.value = false;
}

// ── Animation loop ────────────────────────────────────────────────────────────
const FPS_LIMIT = 60;
const FRAME_TIME = 1000 / FPS_LIMIT;
let lastRenderTime = 0;

const animate = (now: number) => {
  animationFrameId.value = requestAnimationFrame(animate);

  if (now - lastRenderTime < FRAME_TIME) return;
  lastRenderTime = now;

  // Process pending mousemove
  if (pendingMove) {
    const e = pendingMove;
    pendingMove = null;
    const canvas = canvasRef.value;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      mousePos.value.x = e.clientX - rect.left;
      mousePos.value.y = e.clientY - rect.top;

      if (isDragging.value) {
        rotation.value.x += (e.clientY - lastMousePos.value.y) * 0.002;
        rotation.value.y += (e.clientX - lastMousePos.value.x) * 0.002;
        lastMousePos.value.x = e.clientX;
        lastMousePos.value.y = e.clientY;
      }
    }
  }

  const canvas = canvasRef.value;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const dx = mousePos.value.x - centerX;
  const dy = mousePos.value.y - centerY;
  const maxDist = Math.hypot(centerX, centerY);
  const dist = Math.hypot(dx, dy);
  const speed = 0.003 + (dist / maxDist) * 0.01;

  if (targetRotation.value) {
    const {
      startX,
      startY,
      x: tx,
      y: ty,
      startTime,
      duration,
    } = targetRotation.value;
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = easeOutCubic(progress);
    rotation.value.x = startX + (tx - startX) * eased;
    rotation.value.y = startY + (ty - startY) * eased;
    if (progress >= 1) targetRotation.value = null;
  } else if (!isDragging.value) {
    rotation.value.x += (dy / canvas.height) * speed;
    rotation.value.y += (dx / canvas.width) * speed;
  }

  const cosX = Math.cos(rotation.value.x);
  const sinX = Math.sin(rotation.value.x);
  const cosY = Math.cos(rotation.value.y);
  const sinY = Math.sin(rotation.value.y);

  const icons = imagePositions.value;
  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i];
    const rotatedX = icon.x * cosY - icon.z * sinY;
    const rotatedZ = icon.x * sinY + icon.z * cosY;
    const rotatedY = icon.y * cosX + rotatedZ * sinX;
    const scale = (rotatedZ + 200) / 300;
    const opacity = Math.max(0.2, Math.min(1, (rotatedZ + 150) / 200));

    if (scale < 0.1 || opacity < 0.1) continue;

    ctx.save();
    ctx.translate(centerX + rotatedX, centerY + rotatedY);
    ctx.scale(scale, scale);
    ctx.globalAlpha = opacity;

    if (imageCanvases.value[i] && imagesLoaded.value[i]) {
      ctx.drawImage(imageCanvases.value[i], -20, -20, 40, 40);
    }
    ctx.restore();
  }
};

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => {
  if (props.images?.length) loadImages(props.images);
  animationFrameId.value = requestAnimationFrame(animate);
});

watch(
  () => props.images,
  (urls) => {
    if (urls?.length) loadImages(urls);
  },
);

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId.value);
});
</script>
