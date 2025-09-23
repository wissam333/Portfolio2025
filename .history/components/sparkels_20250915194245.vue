<template>
  <div
    ref="containerRef"
    class="relative size-full overflow-hidden will-change-transform"
    :style="{ background }"
  >
    <canvas ref="canvasRef" class="absolute inset-0 size-full" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

interface Props {
  background?: string;
  particleColor?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleDensity?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  phase: number;
  phaseSpeed: number;
}

const props = withDefaults(defineProps<Props>(), {
  background: "#0d47a1",
  particleColor: "#ffffff",
  minSize: 1,
  maxSize: 3,
  speed: 4,
  particleDensity: 120,
});

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const particles = ref<Particle[]>([]);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const animationFrameId = ref<number | null>(null);

// Adjust canvas size on mount and resize
function resizeCanvas() {
  if (!canvasRef.value || !containerRef.value) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = containerRef.value.getBoundingClientRect();

  canvasRef.value.width = rect.width * dpr;
  canvasRef.value.height = rect.height * dpr;

  if (ctx.value) {
    ctx.value.scale(dpr, dpr);
  }
}

function generateParticles(): void {
  const newParticles: Particle[] = [];
  const count = props.particleDensity;

  for (let i = 0; i < count; i++) {
    const baseSpeed = 0.05;
    const speedVariance = Math.random() * 0.3 + 0.7;

    newParticles.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (props.maxSize - props.minSize) + props.minSize,
      opacity: Math.random() * 0.5 + 0.3,
      vx: (Math.random() - 0.5) * baseSpeed * speedVariance * props.speed,
      vy:
        ((Math.random() - 0.5) * baseSpeed - baseSpeed * 0.3) *
        speedVariance *
        props.speed,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.015,
    });
  }

  particles.value = newParticles;
}

function updateAndDrawParticles() {
  if (!ctx.value || !canvasRef.value) return;

  const canvas = canvasRef.value;
  ctx.value.clearRect(0, 0, canvas.width, canvas.height);

  particles.value = particles.value.map((particle) => {
    let newX = particle.x + particle.vx;
    let newY = particle.y + particle.vy;

    if (newX < -2) newX = 102;
    if (newX > 102) newX = -2;
    if (newY < -2) newY = 102;
    if (newY > 102) newY = -2;

    const newPhase = (particle.phase + particle.phaseSpeed) % (Math.PI * 2);
    const opacity = 0.3 + (Math.sin(newPhase) * 0.3 + 0.3);

    // Draw particle
    ctx.value!.beginPath();
    ctx.value!.arc(
      (newX * canvas.width) / 100,
      (newY * canvas.height) / 100,
      particle.size,
      0,
      Math.PI * 2
    );

    // Convert opacity to hex with a fallback for edge cases
    const alphaHex = Math.floor(opacity * 255)
      .toString(16)
      .padStart(2, "0");

    ctx.value!.fillStyle = `${props.particleColor}${alphaHex}`;
    ctx.value!.fill();

    return {
      ...particle,
      x: newX,
      y: newY,
      phase: newPhase,
      opacity,
    };
  });

  // Continue animation loop
  animationFrameId.value = requestAnimationFrame(updateAndDrawParticles);
}

function startAnimation() {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }
  animationFrameId.value = requestAnimationFrame(updateAndDrawParticles);
}

function stopAnimation() {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }
}

// Handle window resize
let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
  if (!canvasRef.value) return;

  ctx.value = canvasRef.value.getContext("2d");
  resizeCanvas();
  generateParticles();

  // Set up resize observer
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(resizeCanvas);
    if (containerRef.value) {
      resizeObserver.observe(containerRef.value);
    }
  }

  startAnimation();
});

onBeforeUnmount(() => {
  stopAnimation();
  if (resizeObserver && containerRef.value) {
    resizeObserver.unobserve(containerRef.value);
  }
});
</script>
