<template>
  <div>
    <transition name="toast">
      <div v-if="showEgg" class="easter-egg">
        🚀 Pro-level user detected! 🎉
      </div>
    </transition>

    <CelebrationParticles ref="particlesRef" />
  </div>
</template>

<script setup>
const { devToolsOpen } = useDevTools();
const showEgg = ref(false);
const particlesRef = ref(null);

// Watch devToolsOpen reactively
watch(devToolsOpen, (isOpen) => {
  if (isOpen) {
    showEgg.value = true;
    particlesRef.value?.triggerParticles(50);
    if (!useEasterEggs().value.find((e) => e == 3)) {
      useEasterEggs().value.push(3);
    }
    // Hide toast after 2 seconds
    setTimeout(() => {
      showEgg.value = false;
    }, 2000);
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

/* Toast transition for enter/leave */
.toast-enter-active,
.toast-leave-active {
  transition: all 2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.toast-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
