--- FILE: pages/index.vue ---
<template>
  <div style="overflow: hidden; background-color: #000">
    <home-snowflakes></home-snowflakes>
    <home-hero></home-hero>
    <lazy-home-timeline hydrate-on-visible></lazy-home-timeline>
    <lazy-home-about hydrate-on-visible></lazy-home-about>
    <lazy-home-work hydrate-on-visible></lazy-home-work>
    <lazy-home-contact hydrate-on-visible></lazy-home-contact>

    <!-- Flash overlay -->
    <div v-if="flashActive" class="flash-overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const flashActive = ref(false);

onMounted(() => {
  let lastX = null;
  let lastDirection = null;
  let directionChanges = 0;
  let lastChangeTime = 0;
  const requiredChanges = 4; // must shake left-right 4 times quickly
  const directionThreshold = 12; // minimum acceleration to count as a direction change
  const shakeTimeout = 1200; // must finish all changes within 1.2s

  function triggerFeedback() {
    flashActive.value = true;
    setTimeout(() => (flashActive.value = false), 200);
    if (navigator.vibrate) navigator.vibrate([100, 100, 100]);
  }

  function handleMotion(event) {
    const { x } = event.accelerationIncludingGravity;
    const now = Date.now();

    if (lastX === null) {
      lastX = x;
      return;
    }

    const deltaX = x - lastX;
    const direction = deltaX > 0 ? "right" : "left";

    // Detect strong side changes
    if (Math.abs(deltaX) > directionThreshold && direction !== lastDirection) {
      directionChanges++;
      lastDirection = direction;
      lastChangeTime = now;
    }

    // If enough quick alternating changes detected → trigger secret
    if (
      directionChanges >= requiredChanges &&
      now - lastChangeTime < shakeTimeout
    ) {
      triggerFeedback();
      window.removeEventListener("devicemotion", handleMotion);
      setTimeout(() => router.push("/secretpage"), 250);
    }

    // Reset if user pauses too long
    if (now - lastChangeTime > shakeTimeout) {
      directionChanges = 0;
      lastDirection = null;
    }

    lastX = x;
  }

  if (typeof window !== "undefined") {
    window.addEventListener("devicemotion", handleMotion);
  }

  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("devicemotion", handleMotion);
    }
  });
});
</script>

<style lang="scss" scoped>
.flash-overlay {
  position: fixed;
  inset: 0;
  background: white;
  opacity: 0.8;
  z-index: 9999;
  animation: flashAnim 0.2s ease-out;
}

@keyframes flashAnim {
  from {
    opacity: 0.8;
  }
  to {
    opacity: 0;
  }
}
</style>
