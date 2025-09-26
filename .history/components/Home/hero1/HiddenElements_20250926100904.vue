<template>
  <div
    class="hidden-elements-container"
    id="hiddenPage"
    :class="{
      lit: isCursorGlowing === 'flashlight',
      'flashlight-off': !flashlightActive,
    }"
  >
    <div class="hidden-item" style="top: 10px; inset-inline-end: 10px">
      <img loading="lazy" src="/gotMe.gif" alt="got Me" class="gotMe" />
      <CelebrationParticles ref="celebration"></CelebrationParticles>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

defineProps({
  isCursorGlowing: {
    type: [Boolean, String],
    default: false,
  },
  flashlightActive: {
    type: Boolean,
    default: false,
  },
});

const celebration = ref(null);
let counted = false;

onMounted(() => {
  const gif = document.querySelector(".gotMe");

  const checkHover = (e) => {
    if (!gif || counted || !props.flashlightActive) return;

    const rect = gif.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    ) {
      useEasterEggs().value.push(2);
      counted = true;
      celebration.value?.triggerParticles(40);
    }
  };

  window.addEventListener("mousemove", checkHover);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", checkHover);
});

defineExpose({
  triggerParticles: (count) => celebration.value?.triggerParticles(count),
});
</script>

<style lang="scss" scoped>
.hidden-elements-container {
  background: url("/photos/hiddenBg.png");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: absolute;
  --cursorX: 50vw;
  --cursorY: 50vh;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0;
  transition: all 0.3s ease;

  .hidden-item {
    position: absolute;
    border-radius: 20px;
    transition: all 0.3s ease;
    opacity: 0;
    pointer-events: auto;

    .gotMe {
      width: 200px;
      transition: 0.5s ease-in-out;

      @media (max-width: 768px) {
        width: 100px;
      }
    }
  }
}

.hidden-elements-container::before {
  content: "";
  display: block;
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    circle 12vmax at var(--cursorX) var(--cursorY),
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 70%,
    rgba(0, 0, 0, 0.95) 100%
  );
  z-index: 4;
}

.hidden-elements-container.lit {
  opacity: 1;

  .hidden-item {
    transform: scale(1);
    opacity: 1;
  }
}

.hidden-elements-container.flashlight-off::before {
  opacity: 0;
  pointer-events: none;
}
</style>
