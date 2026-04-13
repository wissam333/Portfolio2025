<template>
  <div class="clouds-container">
    <div
      v-for="(cloud, index) in clouds"
      :key="index"
      class="cloud"
      :class="`cloud-${cloud.type}`"
      :style="{
        left: `${cloud.position.x}%`,
        top: `${cloud.position.y}%`,
        opacity: cloud.opacity,
        transform: `scale(${cloud.scale}) rotate(${cloud.rotation}deg)`,
        filter: `blur(${cloud.blur}px) brightness(${cloud.brightness})`,
      }"
    ></div>
  </div>
</template>

<script setup>
// ✅ Removed `import { ref, onMounted } from "vue"` — Nuxt auto-imports these.

const clouds = ref([]);

const cloudTypes = [
  { name: "nimbostratus", blur: 14, brightness: 1.1 },
  { name: "stratocumulus", blur: 12, brightness: 1.2 },
  { name: "heavy_stratus", blur: 16, brightness: 1.0 },
  { name: "fractus", blur: 10, brightness: 1.3 },
];

function generateClouds(count = 25) {
  const newClouds = [];
  for (let i = 0; i < count; i++) {
    const ct = cloudTypes[Math.floor(Math.random() * cloudTypes.length)];
    newClouds.push({
      type: ct.name,
      position: { x: Math.random() * 100, y: Math.random() * 30 },
      opacity: 0.7 + Math.random() * 0.3,
      scale: 0.6 + Math.random() * 1.2,
      rotation: Math.random() * 10 - 5,
      blur: ct.blur + Math.random() * 4 - 2,
      brightness: ct.brightness + (Math.random() * 0.3 - 0.15),
    });
  }
  // Sort by scale so larger clouds appear in front
  clouds.value = newClouds.sort((a, b) => a.scale - b.scale);
}

onMounted(() => {
  generateClouds();
});
</script>

<style scoped>
.clouds-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.cloud {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
}

/* Cloud type base dimensions */
.cloud-nimbostratus {
  width: 180px;
  height: 20px;
  background: #2a3458;
}
.cloud-stratocumulus {
  width: 220px;
  height: 20px;
  background: #3a4568;
}
.cloud-heavy_stratus {
  width: 280px;
  height: 20px;
  background: #1e2849;
}
.cloud-fractus {
  width: 120px;
  height: 20px;
  background: #4a5678;
}
</style>
