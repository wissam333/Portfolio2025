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
          'z-index': cloud.zIndex,
        }"
      ></div>
    </div>

    <!-- Snowfall effect -->
    <div class="snowfall"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Cloud configuration
const clouds = ref([]);

// More realistic cloud types with better visibility
const cloudTypes = [
  {
    name: "storm_nimbus",
    layers: 8,
    baseWidth: 300,
    baseHeight: 120,
    color: "#1a223f",
    blur: 8,
    brightness: 0.9,
  },
  {
    name: "heavy_stratus",
    layers: 6,
    baseWidth: 400,
    baseHeight: 80,
    color: "#162044",
    blur: 6,
    brightness: 1.0,
  },
  {
    name: "cumulus_congestus",
    layers: 7,
    baseWidth: 250,
    baseHeight: 150,
    color: "#1e2849",
    blur: 10,
    brightness: 0.8,
  },
  {
    name: "fractus_clouds",
    layers: 4,
    baseWidth: 180,
    baseHeight: 60,
    color: "#2a3658",
    blur: 12,
    brightness: 1.1,
  },
];

// Generate highly visible realistic clouds
function generateClouds(count = 18) {
  const newClouds = [];

  for (let i = 0; i < count; i++) {
    const typeIndex = Math.floor(Math.random() * cloudTypes.length);
    const cloudType = cloudTypes[typeIndex];

    newClouds.push({
      type: cloudType.name,
      position: {
        x: Math.random() * 120 - 10,
        y: Math.random() * 35,
      },
      opacity: 0.7 + Math.random() * 0.3, // Much higher opacity
      scale: 0.8 + Math.random() * 1.4, // Larger scales
      rotation: Math.random() * 15 - 7.5,
      blur: cloudType.blur + Math.random() * 6 - 3,
      brightness: cloudType.brightness + (Math.random() * 0.4 - 0.2),
      zIndex: Math.floor(Math.random() * 10) + 1,
    });
  }

  // Sort by z-index for proper layering
  clouds.value = newClouds.sort((a, b) => a.zIndex - b.zIndex);
}

onMounted(() => {
  generateClouds();
});
</script>

<style scoped>
.snowy-night-container {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  min-height: 40vh;
  overflow: hidden;
  background: transparent;
}

.clouds-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40vh;
  z-index: 2;
}

.cloud {
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(120, 140, 200, 0.15),
    inset 0 0 60px rgba(200, 220, 255, 0.1), 0 5px 25px rgba(0, 0, 0, 0.3);
  background: linear-gradient(
    135deg,
    rgba(40, 50, 90, 0.9) 0%,
    rgba(30, 40, 80, 0.95) 50%,
    rgba(20, 30, 70, 0.9) 100%
  );
}

/* Storm Nimbus - Massive, dramatic snow clouds */
.cloud-storm_nimbus {
  width: 300px;
  height: 120px;
  background: linear-gradient(135deg, #1a223f, #2a3458);
  border-radius: 40% 40% 35% 35% / 60% 60% 45% 45%;
}

.cloud-storm_nimbus::before,
.cloud-storm_nimbus::after,
.cloud-storm_nimbus .layer-3,
.cloud-storm_nimbus .layer-4,
.cloud-storm_nimbus .layer-5,
.cloud-storm_nimbus .layer-6,
.cloud-storm_nimbus .layer-7 {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
  box-shadow: inherit;
}

.cloud-storm_nimbus::before {
  width: 250px;
  height: 100px;
  top: -35px;
  left: 30px;
  border-radius: 45% 45% 40% 40% / 55% 55% 40% 40%;
  transform: skewX(-8deg) scaleX(1.1);
}

.cloud-storm_nimbus::after {
  width: 220px;
  height: 90px;
  top: -45px;
  left: 45px;
  border-radius: 42% 42% 38% 38% / 52% 52% 38% 38%;
  transform: skewX(5deg) scaleX(0.95);
}

.cloud-storm_nimbus .layer-3 {
  width: 190px;
  height: 80px;
  top: -25px;
  left: 70px;
  transform: skewX(-3deg) scaleX(1.05);
}

.cloud-storm_nimbus .layer-4 {
  width: 160px;
  height: 70px;
  top: -20px;
  left: 95px;
  transform: skewX(7deg) scaleX(0.98);
}

.cloud-storm_nimbus .layer-5 {
  width: 130px;
  height: 60px;
  top: -15px;
  left: 120px;
  transform: skewX(-4deg);
}

.cloud-storm_nimbus .layer-6 {
  width: 100px;
  height: 50px;
  top: -10px;
  left: 145px;
  transform: skewX(2deg);
}

.cloud-storm_nimbus .layer-7 {
  width: 80px;
  height: 40px;
  top: -5px;
  left: 165px;
  transform: skewX(-1deg);
}

/* Heavy Stratus - Wide, covering cloud layer */
.cloud-heavy_stratus {
  width: 400px;
  height: 80px;
  background: linear-gradient(135deg, #162044, #26345c);
  border-radius: 35% 35% 30% 30% / 55% 55% 35% 35%;
}

.cloud-heavy_stratus::before,
.cloud-heavy_stratus::after,
.cloud-heavy_stratus .layer-3,
.cloud-heavy_stratus .layer-4,
.cloud-heavy_stratus .layer-5 {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
  box-shadow: inherit;
}

.cloud-heavy_stratus::before {
  width: 350px;
  height: 70px;
  top: -20px;
  left: 25px;
  border-radius: 32% 32% 28% 28% / 50% 50% 30% 30%;
  transform: skewX(-5deg) scaleX(1.08);
}

.cloud-heavy_stratus::after {
  width: 320px;
  height: 65px;
  top: -25px;
  left: 40px;
  border-radius: 30% 30% 26% 26% / 48% 48% 28% 28%;
  transform: skewX(3deg) scaleX(0.96);
}

.cloud-heavy_stratus .layer-3 {
  width: 290px;
  height: 60px;
  top: -15px;
  left: 60px;
  transform: skewX(-2deg) scaleX(1.03);
}

.cloud-heavy_stratus .layer-4 {
  width: 260px;
  height: 55px;
  top: -12px;
  left: 80px;
  transform: skewX(4deg) scaleX(0.99);
}

.cloud-heavy_stratus .layer-5 {
  width: 230px;
  height: 50px;
  top: -8px;
  left: 100px;
  transform: skewX(-1deg);
}

/* Cumulus Congestus - Towering, puffy snow clouds */
.cloud-cumulus_congestus {
  width: 250px;
  height: 150px;
  background: linear-gradient(135deg, #1e2849, #2e3c65);
  border-radius: 45% 45% 40% 40% / 50% 50% 35% 35%;
}

.cloud-cumulus_congestus::before,
.cloud-cumulus_congestus::after,
.cloud-cumulus_congestus .layer-3,
.cloud-cumulus_congestus .layer-4,
.cloud-cumulus_congestus .layer-5,
.cloud-cumulus_congestus .layer-6 {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
  box-shadow: inherit;
}

.cloud-cumulus_congestus::before {
  width: 200px;
  height: 120px;
  top: -50px;
  left: 30px;
  border-radius: 48% 48% 42% 42% / 52% 52% 38% 38%;
  transform: skewX(-6deg);
}

.cloud-cumulus_congestus::after {
  width: 170px;
  height: 100px;
  top: -60px;
  left: 50px;
  border-radius: 46% 46% 40% 40% / 50% 50% 36% 36%;
  transform: skewX(4deg);
}

.cloud-cumulus_congestus .layer-3 {
  width: 140px;
  height: 85px;
  top: -35px;
  left: 80px;
  transform: skewX(-3deg);
}

.cloud-cumulus_congestus .layer-4 {
  width: 110px;
  height: 70px;
  top: -25px;
  left: 110px;
  transform: skewX(5deg);
}

.cloud-cumulus_congestus .layer-5 {
  width: 85px;
  height: 55px;
  top: -15px;
  left: 135px;
  transform: skewX(-2deg);
}

.cloud-cumulus_congestus .layer-6 {
  width: 65px;
  height: 45px;
  top: -8px;
  left: 155px;
  transform: skewX(1deg);
}

/* Fractus Clouds - Broken, scud-like cloud fragments */
.cloud-fractus_clouds {
  width: 180px;
  height: 60px;
  background: linear-gradient(135deg, #2a3658, #3a4a74);
  border-radius: 40% 35% 45% 30% / 50% 45% 40% 35%;
}

.cloud-fractus_clouds::before,
.cloud-fractus_clouds::after,
.cloud-fractus_clouds .layer-3 {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: 50%;
  box-shadow: inherit;
}

.cloud-fractus_clouds::before {
  width: 140px;
  height: 50px;
  top: -18px;
  left: 25px;
  border-radius: 38% 32% 42% 28% / 46% 42% 38% 32%;
  transform: skewX(8deg) rotate(5deg);
}

.cloud-fractus_clouds::after {
  width: 110px;
  height: 45px;
  top: -12px;
  left: 50px;
  border-radius: 35% 40% 30% 45% / 42% 48% 35% 40%;
  transform: skewX(-6deg) rotate(-3deg);
}

.cloud-fractus_clouds .layer-3 {
  width: 85px;
  height: 40px;
  top: -8px;
  left: 75px;
  border-radius: 42% 38% 35% 40% / 45% 42% 38% 35%;
  transform: skewX(4deg) rotate(2deg);
}

/* Enhanced cloud lighting and depth */
.cloud::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background: radial-gradient(
    ellipse at 30% 30%,
    rgba(150, 170, 220, 0.25) 0%,
    rgba(100, 120, 180, 0.15) 30%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}

/* Snow fall effect from each cloud */
.cloud::before {
  content: "";
  position: absolute;
  top: 100%;
  left: 5%;
  width: 90%;
  height: 60px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.15) 40%,
    transparent 100%
  );
  filter: blur(8px);
  opacity: 0.6;
  border-radius: 50% 50% 0 0;
  z-index: 1;
}

/* Enhanced snowfall overlay */
.snowfall {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      ellipse at 20% 20%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 80% 80%,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 40% 40%,
      rgba(255, 255, 255, 0.06) 0%,
      transparent 50%
    );
  pointer-events: none;
  z-index: 3;
}

/* Cloud shadow effects for depth */
.cloud:nth-child(odd)::after {
  background: radial-gradient(
    ellipse at 70% 30%,
    rgba(120, 140, 200, 0.2) 0%,
    rgba(80, 100, 160, 0.1) 30%,
    transparent 70%
  );
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .snowy-night-container {
    min-height: 35vh;
  }

  .clouds-container {
    height: 35vh;
  }

  .cloud-storm_nimbus {
    width: 220px;
    height: 90px;
  }

  .cloud-heavy_stratus {
    width: 300px;
    height: 65px;
  }

  .cloud-cumulus_congestus {
    width: 190px;
    height: 120px;
  }

  .cloud-fractus_clouds {
    width: 140px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .clouds-container {
    height: 30vh;
  }

  .cloud-storm_nimbus {
    width: 180px;
    height: 75px;
  }

  .cloud-heavy_stratus {
    width: 250px;
    height: 55px;
  }

  .cloud-cumulus_congestus {
    width: 150px;
    height: 100px;
  }

  .cloud-fractus_clouds {
    width: 120px;
    height: 45px;
  }
}

/* Ultra-wide screens */
@media (min-width: 1920px) {
  .clouds-container {
    height: 45vh;
  }

  .snowy-night-container {
    min-height: 45vh;
  }

  .cloud-storm_nimbus {
    width: 400px;
    height: 160px;
  }

  .cloud-heavy_stratus {
    width: 500px;
    height: 100px;
  }
}
</style>
