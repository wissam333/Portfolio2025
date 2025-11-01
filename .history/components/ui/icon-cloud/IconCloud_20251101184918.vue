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
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";

const props = defineProps<IconCloudProps>();

const { images } = props;

// Refs
const canvasRef = ref<HTMLCanvasElement | null>(null);
const animationFrameRef = ref<number>(0);
const imageCanvasesRef = ref<HTMLCanvasElement[]>([]);
const imagesLoadedRef = ref<boolean[]>([]);
const isDragging = ref(false);
const lastMousePos = ref({ x: 0, y: 0 });
const mousePos = ref({ x: 0, y: 0 });
const targetRotation = ref<{
  x: number;
  y: number;
  startX: number;
  startY: number;
  startTime: number;
  duration: number;
} | null>(null);

// Reactive rotation for better performance
const rotation = ref({ x: 0, y: 0 });

// Computed image positions - only recalc when images change
const imagePositions = computed(() => {
  const count = images?.length || 0;
  if (count === 0) return [];

  const positions: SphereIcon[] = [];
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;

    positions.push({
      x: x * 100,
      y: y * 100,
      z: z * 100,
      scale: 1,
      opacity: 1,
      id: i,
    });
  }
  return positions;
});

// Pre-calculated values
const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

// Throttled mouse move handler
let mouseMoveTimeout: number | null = null;
const throttledMouseMove = (e: MouseEvent) => {
  if (mouseMoveTimeout) return;

  mouseMoveTimeout = window.setTimeout(() => {
    mouseMoveTimeout = null;
    handleMouseMove(e);
  }, 16); // ~60fps
};

// Load images only when images prop changes
watch(
  () => props.images,
  (newImages) => {
    if (!newImages) return;

    imagesLoadedRef.value = new Array(newImages.length).fill(false);
    const newImageCanvases: HTMLCanvasElement[] = [];

    newImages.forEach((url, idx) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = 40;
      offscreen.height = 40;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) {
        newImageCanvases.push(offscreen);
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => {
        offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
        offCtx.beginPath();
        offCtx.arc(20, 20, 20, 0, Math.PI * 2);
        offCtx.closePath();
        offCtx.clip();
        offCtx.drawImage(img, 0, 0, 40, 40);
        imagesLoadedRef.value[idx] = true;
      };

      newImageCanvases.push(offscreen);
    });

    imageCanvasesRef.value = newImageCanvases;
  },
  { immediate: true }
);

// Optimized mouse down handler
function handleMouseDown(e: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Check for icon clicks
  for (const icon of imagePositions.value) {
    const cosX = Math.cos(rotation.value.x);
    const sinX = Math.sin(rotation.value.x);
    const cosY = Math.cos(rotation.value.y);
    const sinY = Math.sin(rotation.value.y);

    const rotatedX = icon.x * cosY - icon.z * sinY;
    const rotatedZ = icon.x * sinY + icon.z * cosY;
    const rotatedY = icon.y * cosX + rotatedZ * sinX;

    const screenX = canvas.width / 2 + rotatedX;
    const screenY = canvas.height / 2 + rotatedY;

    const scale = (rotatedZ + 200) / 300;
    const radius = 20 * scale;
    const dx = x - screenX;
    const dy = y - screenY;

    if (dx * dx + dy * dy < radius * radius) {
      const targetX = -Math.atan2(
        icon.y,
        Math.sqrt(icon.x * icon.x + icon.z * icon.z)
      );
      const targetY = Math.atan2(icon.x, icon.z);
      const currentX = rotation.value.x;
      const currentY = rotation.value.y;
      const distance = Math.sqrt(
        (targetX - currentX) ** 2 + (targetY - currentY) ** 2
      );

      const duration = Math.min(2000, Math.max(800, distance * 1000));
      targetRotation.value = {
        x: targetX,
        y: targetY,
        startX: currentX,
        startY: currentY,
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

function handleMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  mousePos.value.x = e.clientX - rect.left;
  mousePos.value.y = e.clientY - rect.top;

  if (isDragging.value) {
    const deltaX = e.clientX - lastMousePos.value.x;
    const deltaY = e.clientY - lastMousePos.value.y;

    rotation.value.x += deltaY * 0.002;
    rotation.value.y += deltaX * 0.002;

    lastMousePos.value.x = e.clientX;
    lastMousePos.value.y = e.clientY;
  }
}

function handleMouseUp() {
  isDragging.value = false;
}

// Animation optimization
let lastRenderTime = 0;
const FPS_LIMIT = 60;
const FRAME_TIME = 1000 / FPS_LIMIT;

const animate = (currentTime: number) => {
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  // Throttle frame rate
  if (currentTime - lastRenderTime < FRAME_TIME) {
    animationFrameRef.value = requestAnimationFrame(animate);
    return;
  }
  lastRenderTime = currentTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const dx = mousePos.value.x - centerX;
  const dy = mousePos.value.y - centerY;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
  const distance = Math.sqrt(dx * dx + dy * dy);

  const speed = 0.003 + (distance / maxDistance) * 0.01;

  // Handle target rotation
  if (targetRotation.value) {
    const {
      startX,
      startY,
      x: tx,
      y: ty,
      startTime,
      duration,
    } = targetRotation.value;
    const elapsed = performance.now() - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeOutCubic(progress);

    rotation.value.x = startX + (tx - startX) * eased;
    rotation.value.y = startY + (ty - startY) * eased;

    if (progress >= 1) {
      targetRotation.value = null;
    }
  } else if (!isDragging.value) {
    rotation.value.x += (dy / canvas.height) * speed;
    rotation.value.y += (dx / canvas.width) * speed;
  }

  // Cache trigonometric values
  const cosX = Math.cos(rotation.value.x);
  const sinX = Math.sin(rotation.value.x);
  const cosY = Math.cos(rotation.value.y);
  const sinY = Math.sin(rotation.value.y);

  // Render icons
  for (let i = 0; i < imagePositions.value.length; i++) {
    const icon = imagePositions.value[i];

    const rotatedX = icon.x * cosY - icon.z * sinY;
    const rotatedZ = icon.x * sinY + icon.z * cosY;
    const rotatedY = icon.y * cosX + rotatedZ * sinX;

    const scale = (rotatedZ + 200) / 300;
    const opacity = Math.max(0.2, Math.min(1, (rotatedZ + 150) / 200));

    // Skip rendering if too small or not visible
    if (scale < 0.1 || opacity < 0.1) continue;

    ctx.save();
    ctx.translate(centerX + rotatedX, centerY + rotatedY);
    ctx.scale(scale, scale);
    ctx.globalAlpha = opacity;

    if (imageCanvasesRef.value[i] && imagesLoadedRef.value[i]) {
      ctx.drawImage(imageCanvasesRef.value[i], -20, -20, 40, 40);
    }
    ctx.restore();
  }

  animationFrameRef.value = requestAnimationFrame(animate);
};

onMounted(() => {
  animationFrameRef.value = requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
  if (mouseMoveTimeout) {
    clearTimeout(mouseMoveTimeout);
  }
  if (animationFrameRef.value) {
    cancelAnimationFrame(animationFrameRef.value);
  }
});
</script>
