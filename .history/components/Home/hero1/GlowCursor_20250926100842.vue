<template>
  <div
    class="glow-cursor"
    :class="isCursorGlowing"
    :style="cursorStyle"
  ></div>
</template>

<script setup>
defineProps({
  isCursorGlowing: {
    type: [Boolean, String],
    default: false
  },
  cursorStyle: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.glow-cursor {
  position: fixed;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9999;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.25);
  transition: width 0.28s ease, height 0.28s ease, background 0.28s ease,
    box-shadow 0.28s ease, opacity 0.28s ease;
  opacity: 1;
}

.glow-cursor.glow {
  width: 160px;
  height: 160px;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.1) 60%,
    transparent 100%
  );
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.15);
  mix-blend-mode: screen;
}

.glow-cursor.flashlight {
  width: 240px;
  height: 240px;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.6) 0%,
    rgba(255, 255, 255, 0.1) 70%,
    transparent 100%
  );
  box-shadow: 0 0 80px rgba(255, 255, 255, 0.2);
  mix-blend-mode: screen;
}
</style>