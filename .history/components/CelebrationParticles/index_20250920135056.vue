<template>
  <div class="celebration-container">
    <span
      v-for="(p, i) in particles"
      :key="i"
      class="particle"
      :style="{
        '--x': p.x + 'px',
        '--y': p.y + 'px',
        '--size': p.size + 'px',
        '--duration': p.duration + 's',
        background: p.color,
      }"
    ></span>
  </div>
</template>

<script setup>
const particles = reactive([]);

function triggerParticles(count = 25) {
  const colors = ["#fff", "#4fc08d", "#ff6ec4", "#59bc90", "#7873f5"];
  particles.splice(0); // clear previous
  for (let i = 0; i < count; i++) {
    particles.push({
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 0.6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  setTimeout(() => particles.splice(0), 1500); // remove after animation
}

defineExpose({ triggerParticles });
</script>

<style scoped lang="scss">
.celebration-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

.particle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  transform: translate(-50%, -50%) translate(var(--x), var(--y)) scale(0);
  animation: particleMove var(--duration) forwards ease-out;
}

@keyframes particleMove {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) translate(var(--x), var(--y)) scale(0);
  }
}
</style>
