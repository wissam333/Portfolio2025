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

// Cloud types with different appearances
const cloudTypes = [
  {
    name: "cumulus",
    layers: 4,
    baseWidth: 120,
    baseHeight: 60,
  },
  {
    name: "stratus",
    layers: 3,
    baseWidth: 180,
    baseHeight: 40,
  },
  {
    name: "cirrus",
    layers: 2,
    baseWidth: 200,
    baseHeight: 30,
  },
    {
    name: "cumulus",
    layers: 4,
    baseWidth: 120,
    baseHeight: 60,
  },
  {
    name: "stratus",
    layers: 3,
    baseWidth: 180,
    baseHeight: 40,
  },
  {
    name: "cirrus",
    layers: 2,
    baseWidth: 200,
    baseHeight: 30,
  },
    {
    name: "cumulus",
    layers: 4,
    baseWidth: 120,
    baseHeight: 60,
  },
  {
    name: "stratus",
    layers: 3,
    baseWidth: 180,
    baseHeight: 40,
  },
  {
    name: "cirrus",
    layers: 2,
    baseWidth: 200,
    baseHeight: 30,
  },
    {
    name: "cumulus",
    layers: 4,
    baseWidth: 120,
    baseHeight: 60,
  },
  {
    name: "stratus",
    layers: 3,
    baseWidth: 180,
    baseHeight: 40,
  },
  {
    name: "cirrus",
    layers: 2,
    baseWidth: 200,
    baseHeight: 30,
  },
    {
    name: "cumulus",
    layers: 4,
    baseWidth: 120,
    baseHeight: 60,
  },
  {
    name: "stratus",
    layers: 3,
    baseWidth: 180,
    baseHeight: 40,
  },
  {
    name: "cirrus",
    layers: 2,
    baseWidth: 200,
    baseHeight: 30,
  },
    {
    name: "cumulus",
    layers: 4,
    baseWidth: 120,
    baseHeight: 60,
  },
  {
    name: "stratus",
    layers: 3,
    baseWidth: 180,
    baseHeight: 40,
  },
  {
    name: "cirrus",
    layers: 2,
    baseWidth: 200,
    baseHeight: 30,
  },
];

// Generate random clouds
function generateClouds(count = 8) {
  const newClouds = [];

  for (let i = 0; i < count; i++) {
    const typeIndex = Math.floor(Math.random() * cloudTypes.length);
    const cloudType = cloudTypes[typeIndex];

    newClouds.push({
      type: cloudType.name,
      position: {
        x: Math.random() * 100,
        y: Math.random() * 30, // Keep within top 30vh
      },
      opacity: 0.3 + Math.random() * 0.5, // Varying opacity for depth
      scale: 0.7 + Math.random() * 0.6, // Different sizes
      speed: 40 + Math.random() * 80, // Different movement speeds
      direction: Math.random() > 0.5 ? 1 : -1, // Random direction
    });
  }

  clouds.value = newClouds;
}

// Animation frame reference
let animationFrameId = null;

// Update cloud positions for animation
function updateClouds() {
  clouds.value.forEach((cloud) => {
    // Move cloud horizontally
    cloud.position.x += 0.01 * cloud.direction;

    // Reset position when cloud moves out of view
    if (cloud.direction > 0 && cloud.position.x > 110) {
      cloud.position.x = -10;
    } else if (cloud.direction < 0 && cloud.position.x < -10) {
      cloud.position.x = 110;
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
  min-height: 20vh;
  overflow: hidden;
  background-color: transparent;
}

.clouds-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30vh; /* Clouds take first 30vh */
  z-index: 1;
}

.cloud {
  position: absolute;
  background: #2a304a;
  border-radius: 50%;
  filter: blur(8px);
  animation-name: float;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* Cumulus clouds - puffy */
.cloud-cumulus::before,
.cloud-cumulus::after {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
  filter: blur(8px);
}

.cloud-cumulus {
  width: 120px;
  height: 60px;
}

.cloud-cumulus::before {
  width: 80px;
  height: 80px;
  top: -30px;
  left: 20px;
}

.cloud-cumulus::after {
  width: 60px;
  height: 60px;
  top: -20px;
  left: 60px;
}

/* Stratus clouds - layered */
.cloud-stratus {
  width: 180px;
  height: 40px;
}

.cloud-stratus::before,
.cloud-stratus::after {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
  filter: blur(8px);
}

.cloud-stratus::before {
  width: 160px;
  height: 35px;
  top: -15px;
  left: 10px;
}

.cloud-stratus::after {
  width: 140px;
  height: 30px;
  top: -25px;
  left: 20px;
}

/* Cirrus clouds - wispy */
.cloud-cirrus {
  width: 200px;
  height: 30px;
  filter: blur(12px);
  opacity: 0.4;
}

.cloud-cirrus::before {
  content: "";
  position: absolute;
  width: 180px;
  height: 25px;
  background: inherit;
  border-radius: 50%;
  filter: blur(12px);
  top: -10px;
  left: 10px;
}

/* Floating animation */
@keyframes float {
  0% {
    transform: translateX(0) scale(v-bind("clouds[0]?.scale || 1"));
  }
  50% {
    transform: translateX(5px) scale(v-bind("clouds[0]?.scale || 1"));
  }
  100% {
    transform: translateX(0) scale(v-bind("clouds[0]?.scale || 1"));
  }
}

/* Page content styling */
.page-content {
  position: relative;
  z-index: 2;
  padding: 40vh 2rem 2rem;
  color: #e0e0e0;
  text-align: center;
}

.page-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.page-content p {
  font-size: 1.2rem;
  opacity: 0.8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .clouds-container {
    height: 20vh; /* Smaller height on mobile */
  }

  .page-content {
    padding-top: 25vh;
  }

  .cloud {
    filter: blur(6px);
  }

  .cloud-cumulus {
    width: 80px;
    height: 40px;
  }

  .cloud-cumulus::before {
    width: 60px;
    height: 60px;
  }

  .cloud-cumulus::after {
    width: 40px;
    height: 40px;
  }
}
</style>
