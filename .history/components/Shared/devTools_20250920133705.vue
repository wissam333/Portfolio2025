<template>
  <div>
    <button @click="triggerEgg" class="egg-button">Reveal Easter Egg</button>

    <div v-if="showEgg" class="easter-egg">
      <p v-if="useDevTools()">🚀 Pro-level user detected! 🎉</p>
      <p v-else>🎉 Hidden Easter Egg Unlocked!</p>
    </div>

    <CelebrationParticles ref="particlesRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const showEgg = ref(false);
const particlesRef = ref<any>(null);

function triggerEgg() {
  showEgg.value = true;

  if (useDevTools()) {
    // trigger pro-level particles
    particlesRef.value?.triggerParticles(35);
    console.log("💻 Pro developer detected! Enjoy the particle show!");
  } else {
    // trigger normal particles
    particlesRef.value?.triggerParticles(20);
    console.log("🙂 You found a hidden Easter Egg!");
  }
}
</script>

<style scoped>
.egg-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: bold;
  background: linear-gradient(90deg, #ff6ec4, #7873f5);
  color: white;
  border: none;
}

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
