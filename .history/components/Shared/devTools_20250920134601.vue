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
    particlesRef.value?.triggerParticles(35);
    console.log("💻 Pro developer detected! Enjoy the particle show!");

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
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  font-family: monospace;
  font-weight: bold;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Toast animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
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
