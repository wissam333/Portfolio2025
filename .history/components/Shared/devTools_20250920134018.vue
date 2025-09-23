<template>
  <div>
    <div v-if="showEgg" class="easter-egg">
      <p v-if="devToolsOpen">🚀 Pro-level user detected! 🎉</p>
      <p v-else>🎉 Hidden Easter Egg Unlocked!</p>
    </div>

    <CelebrationParticles ref="particlesRef" />
  </div>
</template>

<script setup lang="ts">
const { devToolsOpen } = useDevTools();
const showEgg = ref(false);
const particlesRef = ref<any>(null);

// Watch devToolsOpen, trigger Easter egg automatically
watch(devToolsOpen, (isOpen) => {
  if (isOpen) {
    showEgg.value = true;
    particlesRef.value?.triggerParticles(35);
    console.log("💻 Pro developer detected! Enjoy the particle show!");
  }
});
</script>

<style scoped>
.easter-egg {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 2rem 3rem;
  border-radius: 1rem;
  text-align: center;
  font-family: monospace;
  animation: fadeIn 0.5s ease forwards;
  z-index: 9998;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
