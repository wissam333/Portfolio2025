<template>
  <div>
    <div
      ref="toastRef"
      class="easter-egg"
      :class="{ hide: isHiding }"
    >
      💀 Curious how this works? Peek into DevTools if you dare! 💀
    </div>

    <CelebrationParticles ref="particlesRef" />
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

    // Trigger hide animation after 4s
    setTimeout(() => {
      isHiding.value = true;

      // Remove element after animation duration (1s)
      setTimeout(() => {
        showEgg.value = false;
        isHiding.value = false;
      }, 1000);
    }, 4000);
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
  animation: toastBounce 0.6s ease forwards,
    glowPulse 1.2s ease-in-out infinite alternate;
  transition: all 1s ease;
}

/* Hide animation triggered by class */
.easter-egg.hide {
  opacity: 0;
  transform: translateY(-40px) scale(0.6) rotate(-15deg);
}

/* Bounce animation when showing */
@keyframes toastBounce {
  0% {
    opacity: 0;
    transform: translateY(-40px) scale(0.9);
  }
  60% {
    opacity: 1;
    transform: translateY(10px) scale(1.05);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

/* Subtle glow pulse for attention */
@keyframes glowPulse {
  0% {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 110, 196, 0.4);
  }
  100% {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 110, 196, 0.9);
  }
}
</style>
