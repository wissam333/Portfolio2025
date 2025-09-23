<template>
  <div>
    <!-- Always rendered, visibility controlled via classes -->
    <div
      ref="toastRef"
      class="easter-egg"
      :class="{ visible: showEgg, hide: isHiding }"
    >
      <CelebrationParticles ref="particlesRef" />
      💀 Curious how this works? 💀
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const { devToolsOpen } = useDevTools();
const showEgg = ref(false);
const isHiding = ref(false);
const particlesRef = ref(null);

// Watch DevTools
watch(devToolsOpen, (isOpen) => {
  if (isOpen) {
    isHiding.value = false;
    showEgg.value = true;
    particlesRef.value?.triggerParticles(50);

    // Start hide after 4 seconds
    setTimeout(() => {
      isHiding.value = true;

      // Fully hide after animation duration (1s)
      setTimeout(() => {
        showEgg.value = false;
        isHiding.value = false;
      }, 1000);
    }, 5000);
  }
});
</script>

<style scoped>
.easter-egg {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #ff6ec4, #7873f5);
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 1.2rem 2rem;
  border-radius: 1rem;
  font-family: monospace;
  z-index: 9999;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 110, 196, 0.6);
  border: 2px solid #fff;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
  transition: all 1s ease;
}

.easter-egg.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.easter-egg.hide {
  opacity: 0;
  transform: translateY(-40px) scale(0.6);
}
</style>
