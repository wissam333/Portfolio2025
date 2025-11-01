<template>
  <div class="seasonal-container" :class="currentSeason">
    <!-- Dynamic Background based on Season -->
    <div class="season-background"></div>

    <!-- Moon that changes with real moon phases -->
    <div
      class="moon"
      :class="moonPhaseClass"
      :style="{ ...moonPhaseStyle, ...moonGlowStyle }"
      @click="toggleMoonInfo"
    >
      <div class="moon-surface">
        <div
          v-for="crater in moonCraters"
          :key="crater.id"
          class="moon-crater"
          :style="crater.style"
        ></div>
      </div>
      <!-- Moon shadow for crescent phases -->
      <div class="moon-shadow" :style="moonShadowStyle"></div>
    </div>

    <!-- Winter: Snowfall -->
    <div v-if="currentSeason === 'winter'" class="snowfall">
      <div
        v-for="(snowflake, index) in snowflakes"
        :key="index"
        class="snowflake-wrapper"
        :style="{ left: snowflake.left }"
      >
        <div
          class="snowflake"
          :class="{ paused: hoveredElement === index }"
          :style="{
            animationDuration: snowflake.animationDuration,
            animationDelay: snowflake.animationDelay,
            opacity: snowflake.opacity,
          }"
          @mouseenter="onElementEnter(index)"
          @mouseleave="onElementLeave"
        >
          <div
            class="snowflake-inner"
            :class="{ hovered: hoveredElement === index }"
            :style="{
              '--size': snowflake.size + 'px',
              '--rotation': snowflake.rotation + 'deg',
            }"
          ></div>
        </div>
      </div>
      <div class="snow-pile"></div>
    </div>

    <!-- Summer: Fireflies Vortex -->
    <div v-if="currentSeason === 'summer'" class="fireflies-vortex">
      <div
        v-for="(firefly, index) in fireflies"
        :key="index"
        class="firefly-wrapper"
        :style="{ left: firefly.left, top: firefly.top }"
      >
        <div
          class="firefly"
          :class="{ paused: hoveredElement === index }"
          :style="{
            animationDuration: firefly.animationDuration,
            animationDelay: firefly.animationDelay,
            opacity: firefly.opacity,
          }"
          @mouseenter="onElementEnter(index)"
          @mouseleave="onElementLeave"
        >
          <div
            class="firefly-inner"
            :class="{ hovered: hoveredElement === index }"
            :style="{
              '--size': firefly.size + 'px',
              '--glow': firefly.glow,
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Spring: Cherry Blossoms -->
    <div v-if="currentSeason === 'spring'" class="cherry-blossoms">
      <div
        v-for="(petal, index) in petals"
        :key="index"
        class="petal-wrapper"
        :style="{ left: petal.left }"
      >
        <div
          class="petal"
          :class="{ paused: hoveredElement === index }"
          :style="{
            animationDuration: petal.animationDuration,
            animationDelay: petal.animationDelay,
            opacity: petal.opacity,
          }"
          @mouseenter="onElementEnter(index)"
          @mouseleave="onElementLeave"
        >
          <div
            class="petal-inner"
            :class="{ hovered: hoveredElement === index }"
            :style="{
              '--size': petal.size + 'px',
              '--rotation': petal.rotation + 'deg',
              '--color': petal.color,
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Autumn: Falling Leaves -->
    <div v-if="currentSeason === 'autumn'" class="falling-leaves">
      <div
        v-for="(leaf, index) in leaves"
        :key="index"
        class="leaf-wrapper"
        :style="{ left: leaf.left }"
      >
        <div
          class="leaf"
          :class="{ paused: hoveredElement === index }"
          :style="{
            animationDuration: leaf.animationDuration,
            animationDelay: leaf.animationDelay,
            opacity: leaf.opacity,
          }"
          @mouseenter="onElementEnter(index)"
          @mouseleave="onElementLeave"
        >
          <div
            class="leaf-inner"
            :class="{ hovered: hoveredElement === index }"
            :style="{
              '--size': leaf.size + 'px',
              '--rotation': leaf.rotation + 'deg',
              '--color': leaf.color,
            }"
          >
            🍁
          </div>
        </div>
      </div>
      <div class="leaf-pile"></div>
    </div>

    <!-- Season Info Display -->
    <div class="season-info" :class="{ visible: showInfo }">
      <div class="info-card">
        <h3>{{ seasonDisplayName }}</h3>
        <p>Moon Phase: {{ moonPhaseName }}</p>
        <p>Illumination: {{ Math.round(moonIllumination * 100) }}%</p>
        <button @click="toggleMoonInfo" class="close-btn">×</button>
      </div>
    </div>

    <!-- Debug Controls (remove in production) -->
    <div class="debug-controls">
      <button @click="cycleSeason">Cycle Season</button>
      <button @click="cycleMoonPhase">Cycle Moon</button>
      <span>Current: {{ currentSeason }} - {{ moonPhaseName }}</span>
    </div>
  </div>
</template>
<script setup>
// Seasonal state
const currentSeason = ref("winter");
const hoveredElement = ref(null);
const showInfo = ref(false);

// Moon phase calculations
const moonIllumination = ref(0.5);
const moonPhaseName = ref("");
const moonPhaseClass = ref("");

// Elements for each season
const snowflakes = ref([]);
const fireflies = ref([]);
const petals = ref([]);
const leaves = ref([]);

// Moon craters for realism
const moonCraters = ref([
  { id: 1, style: { top: "20%", left: "30%", width: "8px", height: "8px" } },
  { id: 2, style: { top: "60%", left: "50%", width: "12px", height: "12px" } },
  { id: 3, style: { top: "40%", left: "70%", width: "6px", height: "6px" } },
  { id: 4, style: { top: "75%", left: "25%", width: "10px", height: "10px" } },
]);

// REALISTIC: Calculate moon phase with proper illumination
const calculateMoonPhase = () => {
  const now = new Date();
  const startOfCycle = new Date("2024-01-11");
  const daysInCycle = 29.53;
  const daysSinceNewMoon =
    ((now - startOfCycle) / (1000 * 60 * 60 * 24)) % daysInCycle;

  // Calculate phase angle (0 to 360 degrees)
  const phaseAngle = (daysSinceNewMoon / daysInCycle) * 360;

  // Realistic illumination calculation
  moonIllumination.value = (1 - Math.cos((phaseAngle * Math.PI) / 180)) / 2;

  // Determine phase name
  let phaseName;
  if (daysSinceNewMoon < 1) {
    phaseName = "New Moon";
    moonIllumination.value = 0;
  } else if (daysSinceNewMoon < 7.38) {
    phaseName = "Waxing Crescent";
  } else if (daysSinceNewMoon < 7.38 + 0.5) {
    phaseName = "First Quarter";
    moonIllumination.value = 0.5;
  } else if (daysSinceNewMoon < 14.77) {
    phaseName = "Waxing Gibbous";
  } else if (daysSinceNewMoon < 14.77 + 0.5) {
    phaseName = "Full Moon";
    moonIllumination.value = 1;
  } else if (daysSinceNewMoon < 22.15) {
    phaseName = "Waning Gibbous";
  } else if (daysSinceNewMoon < 22.15 + 0.5) {
    phaseName = "Last Quarter";
    moonIllumination.value = 0.5;
  } else {
    phaseName = "Waning Crescent";
  }

  return phaseName;
};

// REALISTIC: Moon phase using radial gradients and transforms
const moonPhaseStyle = computed(() => {
  const illumination = moonIllumination.value;
  const isWaxing =
    moonPhaseName.value.includes("Waxing") ||
    moonPhaseName.value === "First Quarter";

  if (illumination === 0) {
    // New Moon - completely dark
    return {
      background: "radial-gradient(circle, #2a2a2a 0%, #1a1a1a 100%)",
      boxShadow: "none",
      opacity: 0.3,
    };
  } else if (illumination === 1) {
    // Full Moon - completely lit
    return {
      background:
        "radial-gradient(circle, #f8f8e0 0%, #e8e8c0 50%, #d8d8a0 100%)",
      boxShadow: "0 0 60px 20px rgba(255, 255, 200, 0.6)",
      opacity: 1,
    };
  }

  // For crescent and quarter phases - use pseudo-element approach
  const shadowPosition = isWaxing ? -100 : 100;
  const shadowSize = (1 - illumination) * 200;

  return {
    background:
      "radial-gradient(circle, #f8f8e0 0%, #e8e8c0 50%, #d8d8a0 100%)",
    boxShadow: "0 0 40px 10px rgba(255, 255, 200, 0.4)",
    opacity: 0.3 + illumination * 0.7,
    position: "relative",
    overflow: "hidden",
  };
});

// REALISTIC: Moon shadow for crescent phases
const moonShadowStyle = computed(() => {
  const illumination = moonIllumination.value;
  const isWaxing =
    moonPhaseName.value.includes("Waxing") ||
    moonPhaseName.value === "First Quarter";

  if (illumination === 0 || illumination === 1) return { display: "none" };

  const shadowSize = Math.abs(0.5 - illumination) * 200;
  const shadowPosition = isWaxing ? -shadowSize / 2 : shadowSize / 2;

  return {
    position: "absolute",
    top: "0",
    [isWaxing ? "right" : "left"]: "50%",
    width: `${shadowSize}%`,
    height: "100%",
    background: "#0a0a2a",
    borderRadius: "50%",
    transform: `translateX(${shadowPosition}%)`,
    transition: "all 3s ease",
  };
});

// Moon glow style
const moonGlowStyle = computed(() => {
  const illumination = moonIllumination.value;

  return {
    boxShadow: `0 0 ${20 + illumination * 40}px ${
      5 + illumination * 15
    }px rgba(255, 255, 200, ${0.1 + illumination * 0.3})`,
    filter: `brightness(${0.7 + illumination * 0.6})`,
  };
});

// Determine current season based on real date
const getCurrentSeason = () => {
  const now = new Date();
  const month = now.getMonth() + 1;

  if (month >= 12 || month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "autumn";
};

// Season display names
const seasonDisplayName = computed(() => {
  const names = {
    winter: "❄️ Winter",
    spring: "🌸 Spring",
    summer: "☀️ Summer",
    autumn: "🍂 Autumn",
  };
  return names[currentSeason.value];
});

// Initialize seasonal elements
const createSnowflakes = (count = 80) => {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      size: Math.random() * 6 + 2,
      opacity: Math.random() * 0.8 + 0.2,
      animationDuration: (Math.random() * 10 + 8).toFixed(2) + "s",
      animationDelay: (Math.random() * 5).toFixed(2) + "s",
      left: Math.random() * 100 + "%",
      rotation: Math.random() * 360,
      swayAmount: Math.random() * 50 + 25,
    });
  }
  return arr;
};

const createFireflies = (count = 40) => {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.7 + 0.3,
      animationDuration: (Math.random() * 8 + 4).toFixed(2) + "s",
      animationDelay: (Math.random() * 3).toFixed(2) + "s",
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      glow: Math.random() * 0.8 + 0.2,
    });
  }
  return arr;
};

const createPetals = (count = 50) => {
  const colors = ["#ffb7c5", "#ff9eb5", "#ff85a1", "#ff6b8b"];
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      size: Math.random() * 8 + 4,
      opacity: Math.random() * 0.6 + 0.4,
      animationDuration: (Math.random() * 12 + 6).toFixed(2) + "s",
      animationDelay: (Math.random() * 4).toFixed(2) + "s",
      left: Math.random() * 100 + "%",
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  return arr;
};

const createLeaves = (count = 40) => {
  const colors = ["#8B4513", "#A0522D", "#CD853F", "#D2691E"];
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      size: Math.random() * 20 + 10,
      opacity: Math.random() * 0.7 + 0.3,
      animationDuration: (Math.random() * 15 + 8).toFixed(2) + "s",
      animationDelay: (Math.random() * 5).toFixed(2) + "s",
      left: Math.random() * 100 + "%",
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  return arr;
};

// Interaction handlers
const onElementEnter = (index) => {
  hoveredElement.value = index;
};

const onElementLeave = () => {
  hoveredElement.value = null;
};

const toggleMoonInfo = () => {
  showInfo.value = !showInfo.value;
};

// Debug functions
const cycleSeason = () => {
  const seasons = ["winter", "spring", "summer", "autumn"];
  const currentIndex = seasons.indexOf(currentSeason.value);
  currentSeason.value = seasons[(currentIndex + 1) % seasons.length];
};

const cycleMoonPhase = () => {
  const phases = [
    { name: "New Moon", illumination: 0 },
    { name: "Waxing Crescent", illumination: 0.1 },
    { name: "First Quarter", illumination: 0.5 },
    { name: "Waxing Gibbous", illumination: 0.9 },
    { name: "Full Moon", illumination: 1 },
    { name: "Waning Gibbous", illumination: 0.9 },
    { name: "Last Quarter", illumination: 0.5 },
    { name: "Waning Crescent", illumination: 0.1 },
  ];

  const currentIndex = phases.findIndex(
    (phase) => phase.name === moonPhaseName.value
  );
  const nextIndex = (currentIndex + 1) % phases.length;

  moonPhaseName.value = phases[nextIndex].name;
  moonIllumination.value = phases[nextIndex].illumination;
  moonPhaseClass.value = moonPhaseName.value.toLowerCase().replace(" ", "-");
};

// Initialize
onMounted(() => {
  currentSeason.value = getCurrentSeason();
  moonPhaseName.value = calculateMoonPhase();
  moonPhaseClass.value = moonPhaseName.value.toLowerCase().replace(" ", "-");

  snowflakes.value = createSnowflakes(100);
  fireflies.value = createFireflies(50);
  petals.value = createPetals(60);
  leaves.value = createLeaves(45);

  setInterval(() => {
    moonPhaseName.value = calculateMoonPhase();
    moonPhaseClass.value = moonPhaseName.value.toLowerCase().replace(" ", "-");
  }, 30000);
});

// Adjust element density on resize
onMounted(() => {
  const updateDensity = () => {
    const count = window.innerWidth < 768 ? 60 : 100;
    snowflakes.value = createSnowflakes(count);
    fireflies.value = createFireflies(Math.floor(count * 0.5));
    petals.value = createPetals(Math.floor(count * 0.6));
    leaves.value = createLeaves(Math.floor(count * 0.45));
  };

  window.addEventListener("resize", updateDensity);
  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateDensity);
  });
});
</script>

<style scoped>
.seasonal-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  transition: all 2s ease-in-out;
}

/* Seasonal Background Colors */
.seasonal-container.winter {
  background: linear-gradient(180deg, #000000 0%, #0e0a1f 50%, #0e0a1f 100%);
}

.seasonal-container.spring {
  background: linear-gradient(180deg, #000000 0%, #121612 50%, #121612 100%);
}

.seasonal-container.summer {
  background: linear-gradient(180deg, #000000 0%, #151519 50%, #151519 100%);
}

.seasonal-container.autumn {
  background: linear-gradient(180deg, #000000 0%, #201a15 50%, #201a15 100%);
}

.season-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background: radial-gradient(
      circle at 20% 80%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%
    );
}

/* Winter Snowfall */
.snowfall {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.snowflake-wrapper,
.petal-wrapper,
.leaf-wrapper {
  position: absolute;
  top: -40px;
  pointer-events: auto;
}

.snowflake,
.petal,
.leaf {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  transform: translate3d(0, 0, 0);
}

.snowflake {
  animation-name: snowFall;
}
.petal {
  animation-name: petalFall;
}
.leaf {
  animation-name: leafFall;
}

.snowflake.paused,
.petal.paused,
.leaf.paused {
  animation-play-state: paused;
}

/* Snowflake styles (your existing) */
.snowflake-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size, 4px);
  height: var(--size, 4px);
  background: #ffffff;
  border-radius: 50%;
  opacity: 0.9;
  box-shadow: 0 0 4px #ffffff, 0 0 8px rgba(255, 255, 255, 0.6);
  transform: rotate(var(--rotation, 0deg));
  transition: all 0.3s ease;
  filter: blur(0.3px);
}

.snowflake-inner.hovered {
  transform: scale(2) rotate(calc(var(--rotation, 0deg) + 180deg));
  opacity: 1 !important;
  box-shadow: 0 0 15px #ffffff, 0 0 30px rgba(255, 255, 255, 0.8);
  filter: blur(0.1px);
  animation: sparkle 0.5s ease-in-out;
}

/* Firefly styles */
.fireflies-vortex {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.firefly-wrapper {
  position: absolute;
  pointer-events: auto;
}

.firefly {
  position: absolute;
  will-change: transform;
  animation-name: fireflyFloat;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.firefly-inner {
  position: absolute;
  width: var(--size, 3px);
  height: var(--size, 3px);
  background: #ffff00;
  border-radius: 50%;
  opacity: var(--glow, 0.5);
  box-shadow: 0 0 10px #ff0, 0 0 20px rgba(255, 255, 0, 0.5);
  transition: all 0.3s ease;
  filter: blur(1px);
}

.firefly-inner.hovered {
  transform: scale(3);
  opacity: 1 !important;
  box-shadow: 0 0 20px #ff0, 0 0 40px rgba(255, 255, 0, 0.8);
}

/* Petal styles */
.petal-inner {
  position: absolute;
  width: var(--size, 6px);
  height: var(--size, 6px);
  background: var(--color, #ffb7c5);
  border-radius: 50% 50% 50% 0;
  transform: rotate(var(--rotation, 0deg));
  opacity: 0.8;
  transition: all 0.3s ease;
}

.petal-inner.hovered {
  transform: scale(1.5) rotate(calc(var(--rotation, 0deg) + 45deg));
  opacity: 1 !important;
  filter: brightness(1.5);
}

/* Leaf styles */
.leaf-inner {
  position: absolute;
  font-size: var(--size, 15px);
  transform: rotate(var(--rotation, 0deg));
  opacity: 0.8;
  transition: all 0.3s ease;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.leaf-inner.hovered {
  transform: scale(1.3) rotate(calc(var(--rotation, 0deg) + 30deg));
  opacity: 1 !important;
  filter: brightness(1.2);
}

/* Animations */
@keyframes snowFall {
  0% {
    transform: translateY(-20px) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity, 0.8);
    transform: translateY(0) translateX(calc(var(--sway, 0px) * 0.1))
      rotate(90deg);
  }
  100% {
    transform: translateY(100vh) translateX(calc(var(--sway, 0px) * 1))
      rotate(450deg);
    opacity: 0;
  }
}

@keyframes fireflyFloat {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.5;
  }
  25% {
    transform: translate(20px, -15px) scale(1.1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-15px, 10px) scale(0.9);
    opacity: 0.6;
  }
  75% {
    transform: translate(10px, 20px) scale(1.05);
    opacity: 0.7;
  }
}

@keyframes petalFall {
  0% {
    transform: translateY(-20px) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity, 0.6);
  }
  100% {
    transform: translateY(100vh) translateX(100px) rotate(720deg);
    opacity: 0;
  }
}

@keyframes leafFall {
  0% {
    transform: translateY(-20px) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity, 0.7);
  }
  100% {
    transform: translateY(100vh) translateX(-80px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes sparkle {
  0%,
  100% {
    filter: brightness(1) blur(0.1px);
  }
  50% {
    filter: brightness(1.5) blur(0.5px);
  }
}

/* Season Info */
.season-info {
  position: absolute;
  top: 20px;
  left: 20px;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease;
  z-index: 20;
}

.season-info.visible {
  opacity: 1;
  transform: translateY(0);
}

.info-card {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

/* Piles */
.snow-pile,
.leaf-pile {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  backdrop-filter: blur(2px);
  pointer-events: none;
}

.snow-pile {
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 20%,
    transparent 100%
  );
}

.leaf-pile {
  background: linear-gradient(
    to top,
    rgba(139, 69, 19, 0.2) 0%,
    rgba(139, 69, 19, 0.1) 20%,
    transparent 100%
  );
}

/* Debug Controls (remove in production) */
.debug-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  color: white;
  font-size: 12px;
}

.debug-controls button {
  margin: 0 5px;
  padding: 5px 10px;
  background: #333;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .moon {
    width: 60px;
    height: 60px;
    top: 5%;
    right: 5%;
  }

  .season-info {
    top: 10px;
    left: 10px;
  }
}

/* Performance optimizations */
.snowflake,
.firefly,
.petal,
.leaf {
  will-change: transform, opacity;
}

.seasonal-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  transition: all 2s ease-in-out;
}

/* Seasonal Background Colors */
.seasonal-container.winter {
  background: linear-gradient(180deg, #000000 0%, #0e0a1f 50%, #0e0a1f 100%);
}

.seasonal-container.spring {
  background: linear-gradient(180deg, #000000 0%, #121612 50%, #121612 100%);
}

.seasonal-container.summer {
  background: linear-gradient(180deg, #000000 0%, #151519 50%, #151519 100%);
}

.seasonal-container.autumn {
  background: linear-gradient(180deg, #000000 0%, #201a15 50%, #201a15 100%);
}

.season-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background: radial-gradient(
      circle at 20% 80%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%
    );
}

.moon {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 3s ease;
  z-index: 10;
  overflow: hidden;
}

.moon-surface {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 230, 0.9) 0%,
    rgba(220, 220, 180, 0.8) 40%,
    rgba(180, 180, 140, 0.7) 100%
  );
  transition: all 3s ease;
}

.moon-crater {
  position: absolute;
  background: rgba(140, 140, 100, 0.4);
  border-radius: 50%;
  transition: all 3s ease;
}

.moon-shadow {
  position: absolute;
  border-radius: 50%;
  background: #0a0a2a;
  transition: all 3s ease;
  pointer-events: none;
}

/* Specific phase styles for better control */
.moon.new-moon {
  background: #1a1a1a !important;
  box-shadow: none !important;
}

.moon.full-moon {
  background: radial-gradient(
    circle,
    #f8f8e0 0%,
    #e8e8c0 50%,
    #d8d8a0 100%
  ) !important;
  box-shadow: 0 0 60px 20px rgba(255, 255, 200, 0.6) !important;
}

.moon.first-quarter .moon-shadow {
  right: 50%;
  width: 100%;
  height: 100%;
  transform: translateX(50%);
}

.moon.last-quarter .moon-shadow {
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translateX(-50%);
}
</style>
