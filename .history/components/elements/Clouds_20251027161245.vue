<template>
  <div class="snowy-night-container">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Cloud configuration
const clouds = ref([]);

// Optimized cloud colors for black background
const cloudTypes = [
  {
    name: "nimbostratus",
    layers: 6,
    baseWidth: 180,
    baseHeight: 20,
    color: "#2a3458",
    blur: 14,
    brightness: 1.1,
  },
  {
    name: "stratocumulus",
    layers: 5,
    baseWidth: 220,
    baseHeight: 20,
    color: "#3a4568",
    blur: 12,
    brightness: 1.2,
  },
  {
    name: "heavy_stratus",
    layers: 7,
    baseWidth: 280,
    baseHeight: 20,
    color: "#1e2849",
    blur: 16,
    brightness: 1.0,
  },
  {
    name: "fractus",
    layers: 3,
    baseWidth: 120,
    baseHeight: 20,
    color: "#4a5678",
    blur: 10,
    brightness: 1.3,
  },
];

// Generate realistic static clouds
function generateClouds(count = 25) {
  const newClouds = [];

  for (let i = 0; i < count; i++) {
    const typeIndex = Math.floor(Math.random() * cloudTypes.length);
    const cloudType = cloudTypes[typeIndex];

    newClouds.push({
      type: cloudType.name,
      position: {
        x: Math.random() * 100,
        y: Math.random() * 30,
      },
      opacity: 0.7 + Math.random() * 0.3, // Higher opacity for better visibility
      scale: 0.6 + Math.random() * 1.2,
      rotation: Math.random() * 10 - 5,
      blur: cloudType.blur + Math.random() * 4 - 2,
      brightness: cloudType.brightness + (Math.random() * 0.3 - 0.15),
    });
  }

  // Sort clouds by scale to create depth (larger clouds in front)
  clouds.value = newClouds.sort((a, b) => a.scale - b.scale);
}

onMounted(() => {
  generateClouds();
});
</script>

<style scoped>
.snowy-night-container {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  min-height: 40vh;
  overflow-x: hidden;
  background: #000;
  z-index: 1;
}

.clouds-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30vh;
}

.cloud {
  position: absolute;
  border-radius: 50%;
  animation: none;
  box-shadow: 0 0 40px rgba(100, 120, 200, 0.15),
    inset 0 0 30px rgba(150, 170, 220, 0.1);
}

/* Nimbostratus - heavy snow clouds */
.cloud-nimbostratus {
  width: 180px;
  height: 70px;
  background: #2a3458;
}

.cloud-nimbostratus::before,
.cloud-nimbostratus::after,
.cloud-nimbostratus .layer-3,
.cloud-nimbostratus .layer-4,
.cloud-nimbostratus .layer-5 {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.cloud-nimbostratus::before {
  width: 140px;
  height: 60px;
  top: -20px;
  left: 25px;
  transform: skewX(-5deg);
}

.cloud-nimbostratus::after {
  width: 120px;
  height: 55px;
  top: -30px;
  left: 45px;
  transform: skewX(3deg);
}

.cloud-nimbostratus .layer-3 {
  width: 100px;
  height: 45px;
  top: -15px;
  left: 75px;
  transform: skewX(-2deg);
}

.cloud-nimbostratus .layer-4 {
  width: 80px;
  height: 40px;
  top: -10px;
  left: 95px;
  transform: skewX(4deg);
}

.cloud-nimbostratus .layer-5 {
  width: 60px;
  height: 35px;
  top: -5px;
  left: 115px;
  transform: skewX(-3deg);
}

/* Stratocumulus - lumpy, textured clouds */
.cloud-stratocumulus {
  width: 220px;
  height: 60px;
  background: #3a4568;
}

.cloud-stratocumulus::before,
.cloud-stratocumulus::after,
.cloud-stratocumulus .layer-3,
.cloud-stratocumulus .layer-4 {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.cloud-stratocumulus::before {
  width: 180px;
  height: 50px;
  top: -15px;
  left: 20px;
  transform: skewX(2deg) scaleX(1.1);
}

.cloud-stratocumulus::after {
  width: 160px;
  height: 45px;
  top: -20px;
  left: 35px;
  transform: skewX(-1deg) scaleX(0.95);
}

.cloud-stratocumulus .layer-3 {
  width: 140px;
  height: 40px;
  top: -10px;
  left: 60px;
  transform: skewX(3deg) scaleX(1.05);
}

.cloud-stratocumulus .layer-4 {
  width: 120px;
  height: 35px;
  top: -5px;
  left: 80px;
  transform: skewX(-2deg) scaleX(0.98);
}

/* Heavy Stratus - thick, continuous layer */
.cloud-heavy_stratus {
  width: 280px;
  height: 50px;
  background: #1e2849;
  border-radius: 40% 40% 30% 30% / 60% 60% 40% 40%;
}

.cloud-heavy_stratus::before,
.cloud-heavy_stratus::after,
.cloud-heavy_stratus .layer-3,
.cloud-heavy_stratus .layer-4,
.cloud-heavy_stratus .layer-5,
.cloud-heavy_stratus .layer-6 {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.cloud-heavy_stratus::before {
  width: 240px;
  height: 45px;
  top: -12px;
  left: 15px;
  border-radius: 45% 45% 35% 35% / 55% 55% 35% 35%;
  transform: skewX(-3deg);
}

.cloud-heavy_stratus::after {
  width: 220px;
  height: 40px;
  top: -18px;
  left: 25px;
  border-radius: 40% 40% 30% 30% / 50% 50% 30% 30%;
  transform: skewX(2deg);
}

.cloud-heavy_stratus .layer-3 {
  width: 200px;
  height: 38px;
  top: -8px;
  left: 40px;
  transform: skewX(-1deg);
}

.cloud-heavy_stratus .layer-4 {
  width: 180px;
  height: 35px;
  top: -6px;
  left: 55px;
  transform: skewX(4deg);
}

.cloud-heavy_stratus .layer-5 {
  width: 160px;
  height: 32px;
  top: -4px;
  left: 70px;
  transform: skewX(-2deg);
}

.cloud-heavy_stratus .layer-6 {
  width: 140px;
  height: 30px;
  top: -2px;
  left: 85px;
  transform: skewX(1deg);
}

/* Fractus - broken, ragged cloud fragments */
.cloud-fractus {
  width: 120px;
  height: 40px;
  background: #4a5678;
  border-radius: 35% 45% 40% 30% / 50% 40% 35% 45%;
}

.cloud-fractus::before,
.cloud-fractus::after {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.cloud-fractus::before {
  width: 90px;
  height: 35px;
  top: -12px;
  left: 20px;
  border-radius: 40% 35% 45% 30% / 45% 35% 40% 50%;
  transform: skewX(5deg) rotate(3deg);
}

.cloud-fractus::after {
  width: 70px;
  height: 30px;
  top: -8px;
  left: 40px;
  border-radius: 35% 40% 30% 45% / 40% 45% 35% 50%;
  transform: skewX(-4deg) rotate(-2deg);
}

/* Enhanced glow effect for better visibility */
.cloud::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background: radial-gradient(
    ellipse at center,
    rgba(180, 200, 255, 0.15) 0%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}

/* Snow fall effect from clouds */
.cloud::before {
  content: "";
  position: absolute;
  top: 100%;
  left: 10%;
  width: 80%;
  height: 40px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.4) 0%,
    transparent 100%
  );
  filter: blur(4px);
  opacity: 0.6;
  border-radius: 50% 50% 0 0;
}

/* Depth-based opacity variations */
.cloud:nth-child(odd)::before {
  opacity: 0.4;
}

.cloud:nth-child(3n)::before {
  opacity: 0.7;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .snowy-night-container {
    min-height: 40vh;
  }

  .clouds-container {
    height: 25vh;
  }

  .cloud-nimbostratus {
    width: 140px;
    height: 55px;
  }

  .cloud-stratocumulus {
    width: 180px;
    height: 50px;
  }

  .cloud-heavy_stratus {
    width: 220px;
    height: 45px;
  }

  .cloud-fractus {
    width: 100px;
    height: 35px;
  }
}

@media (max-width: 480px) {
  .clouds-container {
    height: 20vh;
  }

  .cloud-nimbostratus {
    width: 120px;
    height: 45px;
  }

  .cloud-stratocumulus {
    width: 150px;
    height: 40px;
  }

  .cloud-heavy_stratus {
    width: 180px;
    height: 35px;
  }

  .cloud-fractus {
    width: 80px;
    height: 30px;
  }
}

/* Ultra-wide screens */
@media (min-width: 1920px) {
  .clouds-container {
    height: 35vh;
  }

  .snowy-night-container {
    min-height: 35vh;
  }
}
</style>
