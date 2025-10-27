<template>
  <div style="overflow: hidden; background-color: #000">
    <home-snowflakes></home-snowflakes>
    <home-hero></home-hero>
    <lazy-home-timeline hydrate-on-visible></lazy-home-timeline>
    <lazy-home-about hydrate-on-visible></lazy-home-about>
    <lazy-home-work hydrate-on-visible></lazy-home-work>
    <lazy-home-contact hydrate-on-visible></lazy-home-contact>
  </div>
</template>
<script setup>
onMounted(() => {
  let lastX = null;
  let lastY = null;
  let lastZ = null;
  let lastTime = 0;
  const shakeThreshold = 15; // higher = less sensitive

  const handleMotion = (event) => {
    const { x, y, z } = event.accelerationIncludingGravity;
    const currentTime = Date.now();

    if (lastX === null && lastY === null && lastZ === null) {
      lastX = x;
      lastY = y;
      lastZ = z;
      return;
    }

    const deltaTime = currentTime - lastTime;
    if (deltaTime > 100) {
      const speed =
        (Math.abs(x + y + z - lastX - lastY - lastZ) / deltaTime) * 10000;

      if (speed > shakeThreshold) {
        // prevent multiple redirects
        window.removeEventListener("devicemotion", handleMotion);
        navigateTo("/secretpage");
      }

      lastTime = currentTime;
      lastX = x;
      lastY = y;
      lastZ = z;
    }
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
<style lang="scss" scoped></style>
