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
          transform: `scale(${cloud.scale})`,
          animationDuration: `${cloud.speed}s`,
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Cloud configuration
const clouds = ref([]);

// Enhanced cloud types for heavy snowy night
const cloudTypes = [
  {
    name: "nimbostratus",
    layers: 5,
    baseWidth: 400,
    baseHeight: 80,
  },
  {
    name: "cumulonimbus",
    layers: 6,
    baseWidth: 380,
    baseHeight: 100,
  },
  {
    name: "stratocumulus",
    layers: 4,
    baseWidth: 420,
    baseHeight: 70,
  },
  {
    name: "heavy_stratus",
    layers: 5,
    baseWidth: 450,
    baseHeight: 60,
  },
];

// Generate more dense and heavy clouds
function generateClouds(count = 12) {
  const newClouds = [];

  for (let i = 0; i < count; i++) {
    const typeIndex = Math.floor(Math.random() * cloudTypes.length);
    const cloudType = cloudTypes[typeIndex];

    newClouds.push({
      type: cloudType.name,
      position: {
        x: Math.random() * 120 - 10, // Start some clouds off-screen
        y: Math.random() * 25, // Keep within top 25vh for denser feel
      },
      opacity: 0.6 + Math.random() * 0.3, // Higher opacity for heavier clouds
      scale: 0.8 + Math.random() * 0.8, // Larger scale for heavier appearance
      speed: 60 + Math.random() * 100, // Slower movement for heavy clouds
      direction: Math.random() > 0.3 ? 1 : -1, // More clouds moving right
    });
  }

  clouds.value = newClouds;
}

// Animation frame reference
let animationFrameId = null;

// Update cloud positions for animation
function updateClouds() {
  clouds.value.forEach((cloud) => {
    // Move cloud horizontally - slower for heavy clouds
    cloud.position.x += 0.008 * cloud.direction;

    // Reset position when cloud moves out of view
    if (cloud.direction > 0 && cloud.position.x > 120) {
      cloud.position.x = -20;
      cloud.position.y = Math.random() * 25;
    } else if (cloud.direction < 0 && cloud.position.x < -20) {
      cloud.position.x = 120;
      cloud.position.y = Math.random() * 25;
    }
  });

  animationFrameId = requestAnimationFrame(updateClouds);
}

onMounted(() => {
  generateClouds();
  updateClouds();
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.snowy-night-container {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  min-height: 30vh;
  overflow: hidden;
  background: linear-gradient(to bottom, #000 0%, #000 100%);
}

.clouds-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30vh;
  z-index: 1;
}

.cloud {
  position: absolute;
  background: #1a2038;
  border-radius: 50%;
  filter: blur(10px);
  animation-name: float-heavy;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1),
    inset 0 0 15px rgba(255, 255, 255, 0.193);
}

/* Nimbostratus - heavy rain/snow clouds */
.cloud-nimbostratus {
  width: 200px;
  height: 80px;
  background: #161b30;
  filter: blur(12px);
}

.cloud-nimbostratus::before,
.cloud-nimbostratus::after,
.cloud-nimbostratus .layer-3,
.cloud-nimbostratus .layer-4 {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
  filter: blur(12px);
}

.cloud-nimbostratus::before {
  width: 160px;
  height: 70px;
  top: -25px;
  left: 20px;
}

.cloud-nimbostratus::after {
  width: 140px;
  height: 60px;
  top: -35px;
  left: 40px;
}

.cloud-nimbostratus .layer-3 {
  width: 120px;
  height: 50px;
  top: -20px;
  left: 70px;
}

.cloud-nimbostratus .layer-4 {
  width: 100px;
  height: 40px;
  top: -15px;
  left: 90px;
}

/* Cumulonimbus - towering storm clouds */
.cloud-cumulonimbus {
  width: 180px;
  height: 100px;
  background: #14192d;
  filter: blur(14px);
}

.cloud-cumulonimbus::before,
.cloud-cumulonimbus::after,
.cloud-cumulonimbus .layer-3,
.cloud-cumulonimbus .layer-4,
.cloud-cumulonimbus .layer-5 {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
  filter: blur(14px);
}

.cloud-cumulonimbus::before {
  width: 150px;
  height: 80px;
  top: -40px;
  left: 15px;
}

.cloud-cumulonimbus::after {
  width: 130px;
  height: 70px;
  top: -50px;
  left: 30px;
}

.cloud-cumulonimbus .layer-3 {
  width: 110px;
  height: 60px;
  top: -35px;
  left: 50px;
}

.cloud-cumulonimbus .layer-4 {
  width: 90px;
  height: 50px;
  top: -25px;
  left: 70px;
}

.cloud-cumulonimbus .layer-5 {
  width: 70px;
  height: 40px;
  top: -15px;
  left: 90px;
}

/* Stratocumulus - low, lumpy cloud layer */
.cloud-stratocumulus {
  width: 220px;
  height: 70px;
  background: #181d33;
  filter: blur(11px);
}

.cloud-stratocumulus::before,
.cloud-stratocumulus::after,
.cloud-stratocumulus .layer-3 {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
  filter: blur(11px);
}

.cloud-stratocumulus::before {
  width: 190px;
  height: 60px;
  top: -20px;
  left: 15px;
}

.cloud-stratocumulus::after {
  width: 170px;
  height: 55px;
  top: -25px;
  left: 30px;
}

.cloud-stratocumulus .layer-3 {
  width: 150px;
  height: 50px;
  top: -15px;
  left: 50px;
}

/* Heavy Stratus - thick, uniform layer */
.cloud-heavy_stratus {
  width: 250px;
  height: 60px;
  background: #151a2f;
  filter: blur(13px);
}

.cloud-heavy_stratus::before,
.cloud-heavy_stratus::after,
.cloud-heavy_stratus .layer-3,
.cloud-heavy_stratus .layer-4 {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
  filter: blur(13px);
}

.cloud-heavy_stratus::before {
  width: 230px;
  height: 50px;
  top: -15px;
  left: 10px;
}

.cloud-heavy_stratus::after {
  width: 210px;
  height: 45px;
  top: -20px;
  left: 20px;
}

.cloud-heavy_stratus .layer-3 {
  width: 190px;
  height: 40px;
  top: -10px;
  left: 30px;
}

.cloud-heavy_stratus .layer-4 {
  width: 170px;
  height: 35px;
  top: -5px;
  left: 40px;
}

/* Heavy floating animation with more vertical movement */
@keyframes float-heavy {
  0% {
    transform: translateY(0) scale(v-bind("clouds[0]?.scale || 1"));
  }
  25% {
    transform: translateY(-3px) scale(v-bind("clouds[0]?.scale || 1"));
  }
  50% {
    transform: translateY(0) scale(v-bind("clouds[0]?.scale || 1"));
  }
  75% {
    transform: translateY(2px) scale(v-bind("clouds[0]?.scale || 1"));
  }
  100% {
    transform: translateY(0) scale(v-bind("clouds[0]?.scale || 1"));
  }
}

/* Add some subtle snow effect */
.cloud::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 20px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.5) 0%,
    transparent 100%
  );
  filter: blur(3px);
  opacity: 0.3;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .snowy-night-container {
    min-height: 25vh;
  }

  .clouds-container {
    height: 25vh;
  }

  .cloud {
    filter: blur(8px);
  }

  .cloud-nimbostratus {
    width: 140px;
    height: 60px;
  }

  .cloud-cumulonimbus {
    width: 130px;
    height: 80px;
  }

  .cloud-stratocumulus {
    width: 160px;
    height: 50px;
  }

  .cloud-heavy_stratus {
    width: 180px;
    height: 45px;
  }
}

/* Extra small devices */
@media (max-width: 480px) {
  .clouds-container {
    height: 20vh;
  }

  .cloud {
    filter: blur(6px);
  }

  .cloud-nimbostratus {
    width: 120px;
    height: 50px;
  }

  .cloud-cumulonimbus {
    width: 110px;
    height: 70px;
  }
}
</style>
