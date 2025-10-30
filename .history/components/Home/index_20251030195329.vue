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

    <!-- Visual feedback for circle drawing (optional) -->
    <div v-if="isDrawing" class="drawing-feedback"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const flashActive = ref(false);
const isDrawing = ref(false);

onMounted(() => {
  // ==================== MOBILE SHAKE GESTURE (secretpage) ====================
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

  // ==================== PC CIRCLE GESTURE (secretpage2) ====================
  let points = [];
  let drawing = false;
  const requiredPoints = 15; // Minimum points to recognize a circle
  const maxTime = 3000; // 3 seconds to complete circle
  const minRadius = 50; // Minimum circle radius in pixels

  function calculateCircleProperties(points) {
    if (points.length < requiredPoints) return null;

    // Calculate center by averaging all points
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

    // Calculate average radius
    const radii = points.map((p) =>
      Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
    );
    const avgRadius = radii.reduce((sum, r) => sum + r, 0) / radii.length;

    // Calculate radius variance (how consistent the circle is)
    const variance =
      radii.reduce((sum, r) => sum + Math.pow(r - avgRadius, 2), 0) /
      radii.length;

    return { centerX, centerY, avgRadius, variance };
  }

  function isCircle(points) {
    if (points.length < requiredPoints) return false;

    const circle = calculateCircleProperties(points);
    if (!circle) return false;

    // Check if it's a decent circle:
    // - Large enough radius
    // - Low variance (consistent distance from center)
    // - Reasonable amount of points for the circumference
    const circumference = 2 * Math.PI * circle.avgRadius;
    const pointsPerPixel = points.length / circumference;

    return (
      circle.avgRadius >= minRadius &&
      circle.variance < circle.avgRadius * 0.3 && // Max 30% radius variation
      pointsPerPixel > 0.1 // At least 1 point per 10 pixels
    );
  }

  function handleMouseDown(event) {
    drawing = true;
    isDrawing.value = true;
    points = [{ x: event.clientX, y: event.clientY, time: Date.now() }];
  }

  function handleMouseMove(event) {
    if (!drawing) return;

    const newPoint = { x: event.clientX, y: event.clientY, time: Date.now() };
    points.push(newPoint);

    // Remove points older than maxTime
    const now = Date.now();
    points = points.filter((point) => now - point.time < maxTime);

    if (points.length >= requiredPoints && isCircle(points)) {
      triggerFeedback();
      setTimeout(() => router.push("/secretpage2"), 250);
      resetDrawing();
    }
  }

  function handleMouseUp() {
    resetDrawing();
  }

  function resetDrawing() {
    drawing = false;
    isDrawing.value = false;
    points = [];
  }

  // Prevent text selection while drawing
  function handleSelectStart(event) {
    if (drawing) {
      event.preventDefault();
    }
  }

  // ==================== SETUP EVENT LISTENERS ====================
  if (typeof window !== "undefined") {
    // Mobile shake detection
    window.addEventListener("devicemotion", handleMotion);

    // PC circle detection
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("selectstart", handleSelectStart);
  }

  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("selectstart", handleSelectStart);
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

.drawing-feedback {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9998;
  background: radial-gradient(
    circle at center,
    transparent 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
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
