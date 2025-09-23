<template>
  <div
    :class="cn(
      'relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 w-full rounded-md z-0',
      $props.class
    )"
  >
    <div
      class="relative isolate z-0 flex w-full flex-1 scale-y-125 items-center justify-center"
    >
      <!-- Conic Gradient Left -->
      <div
        class="lamp-gradient-left"
      ></div>

      <!-- Conic Gradient Right -->
      <div
        class="lamp-gradient-right"
      ></div>

      <!-- Bottom Glow -->
      <div class="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl"></div>
      <div class="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
      <div class="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>

      <!-- Spotlight -->
      <div class="spotlight"></div>

      <!-- Glowing Line -->
      <div class="glowing-line"></div>
    </div>

    <div class="relative z-50 flex -translate-y-80 flex-col items-center px-5">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface LampEffectProps {
  delay?: number;
  duration?: number;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<LampEffectProps>(), {
  delay: 0,
  duration: 1.5,
});
</script>

<style scoped>
/* Conic Gradient Animations */
.lamp-gradient-left,
.lamp-gradient-right {
  position: absolute;
  height: 14rem;
  width: 15rem;
  opacity: 0.5;
  filter: blur(4rem);
  border-radius: 50%;
  animation: gradient-pulse 3s ease-in-out forwards;
}

.lamp-gradient-left {
  left: 25%;
  background: conic-gradient(from 70deg at center top, cyan, transparent 70%);
}

.lamp-gradient-right {
  right: 25%;
  background: conic-gradient(from 290deg at center top, transparent, cyan 70%);
}

/* Spotlight Animation */
.spotlight {
  position: absolute;
  inset: auto;
  z-index: 30;
  height: 9rem;
  width: 8rem;
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #22d3ee;
  border-radius: 50%;
  filter: blur(2rem);
  opacity: 0.6;
  animation: spotlight-anim 2s ease-in-out forwards alternate;
}

/* Glowing Line Animation */
.glowing-line {
  position: absolute;
  inset: auto;
  z-index: 50;
  height: 0.5rem;
  width: 15rem;
  bottom: 27%;
  left: 50%;
  background-color: #22d3ee;
  transform: translateX(-50%);
  border-radius: 0.25rem;
  opacity: 0.6;
  filter: blur(0.5rem);
  animation: glowing-line-anim 2s ease-in-out forwards alternate;
}

/* Keyframes */
@keyframes gradient-pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes spotlight-anim {
  0% { width: 8rem; height: 8rem; opacity: 0.5; }
  100% { width: 14rem; height: 14rem; opacity: 0.9; }
}

@keyframes glowing-line-anim {
  0% { width: 15rem; opacity: 0.4; }
  100% { width: 25rem; opacity: 0.8; }
}
</style>
