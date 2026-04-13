<template>
  <div style="overflow: hidden; background-color: #000">
    <home-snowflakes />
    <home-hero />
    <lazy-home-timeline hydrate-on-visible />
    <lazy-home-about hydrate-on-visible />
    <lazy-home-work hydrate-on-visible />
    <lazy-home-contact hydrate-on-visible />

    <Transition name="flash">
      <div v-if="flashActive" class="flash-overlay" />
    </Transition>
  </div>
</template>

<script setup>
const router = useRouter();
const flashActive = ref(false);

function triggerFeedback() {
  flashActive.value = true;
  setTimeout(() => (flashActive.value = false), 200);
  navigator.vibrate?.([100, 100, 100]);
}

const REQUIRED_CHANGES = 4;
const DIRECTION_THRESHOLD = 12;
const SHAKE_TIMEOUT = 1200;

let lastX = null;
let lastDirection = null;
let directionChanges = 0;
let lastChangeTime = 0;

function handleMotion(event) {
  const x = event.accelerationIncludingGravity?.x;
  if (x == null) return;

  const now = Date.now();

  if (lastX === null) {
    lastX = x;
    return;
  }

  const deltaX = x - lastX;
  lastX = x;

  // Reset if user paused too long
  if (now - lastChangeTime > SHAKE_TIMEOUT) {
    directionChanges = 0;
    lastDirection = null;
  }

  const direction = deltaX > 0 ? "right" : "left";

  if (Math.abs(deltaX) > DIRECTION_THRESHOLD && direction !== lastDirection) {
    directionChanges++;
    lastDirection = direction;
    lastChangeTime = now;
  }

  if (directionChanges >= REQUIRED_CHANGES) {
    triggerFeedback();
    window.removeEventListener("devicemotion", handleMotion);
    setTimeout(() => router.push("/secretpage"), 250);
  }
}

onMounted(() => window.addEventListener("devicemotion", handleMotion));
onUnmounted(() => window.removeEventListener("devicemotion", handleMotion));
</script>

<style lang="scss" scoped>
.flash-overlay {
  position: fixed;
  inset: 0;
  background: white;
  opacity: 0.8;
  z-index: 9999;
  pointer-events: none;
}

.flash-enter-active,
.flash-leave-active {
  transition: opacity 0.2s ease-out;
}
.flash-enter-from {
  opacity: 0.8;
}
.flash-leave-to {
  opacity: 0;
}
</style>
