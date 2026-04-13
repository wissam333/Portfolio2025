<script setup>
definePageMeta({ layout: "empty" });

// ─── Season ───────────────────────────────────────────────────────────────
const currentSeason = ref("winter");
const hoveredElement = ref(null);
const showInfo = ref(false);

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 12 || month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "autumn";
}

const seasonDisplayName = computed(() => {
  const names = {
    winter: "❄️ Winter",
    spring: "🌸 Spring",
    summer: "☀️ Summer",
    autumn: "🍂 Autumn",
  };
  return names[currentSeason.value];
});

// ─── Moon Phase ───────────────────────────────────────────────────────────
const moonIllumination = ref(0.5);
const moonPhaseName = ref("");
const moonPhaseClass = ref("");

// ✅ Fixed: removed testMoonProgression() + testMoonPhaseForDate() which ran on
// every page load producing 9+ console.log calls – dev noise + wasted CPU.
// Also removed the duplicated calculateMoonPhase logic that existed twice.
const KNOWN_FULL_MOON = new Date(2025, 10, 5, 13, 19, 0); // Nov 5 2025 UTC
const LUNAR_CYCLE = 29.530588853;

function calculateMoonPhase() {
  const daysSince = (Date.now() - KNOWN_FULL_MOON.getTime()) / 86400000;
  const phaseAngle = (Math.abs(daysSince) / LUNAR_CYCLE) * 2 * Math.PI;
  const illumination = Math.max(
    0,
    Math.min(1, Math.pow(Math.cos(phaseAngle / 2), 2)),
  );
  moonIllumination.value = illumination;

  const d = daysSince;
  if (d >= -1 && d <= 1) return "Full Moon";
  if (d > 1 && d <= 6) return "Waning Gibbous";
  if (d > 6 && d <= 9) return "Last Quarter";
  if (d > 9 && d <= 14) return "Waning Crescent";
  if (d > 14 || d <= -14) return "New Moon";
  if (d > -14 && d <= -9) return "Waxing Crescent";
  if (d > -9 && d <= -6) return "First Quarter";
  return "Waxing Gibbous";
}

const moonBeforeStyle = computed(() => {
  const il = moonIllumination.value;
  const isWaxing =
    moonPhaseName.value.includes("Waxing") ||
    moonPhaseName.value === "First Quarter";
  if (il === 0)
    return {
      opacity: 1,
      background: "#000",
      boxShadow: "inset 0px 0 7px 0px #B5BCC6",
      borderRadius: "50%",
      transform: "rotate(0deg)",
    };
  if (il === 1)
    return {
      opacity: 0,
      background: "#B5BCC6",
      borderRadius: "50%",
      transform: "rotate(180deg)",
    };
  if (isWaxing) {
    const sp = il * 110;
    return {
      opacity: 1,
      background: il < 0.5 ? "#000" : "#B5BCC6",
      boxShadow: `inset ${sp}px 0 7px 0px ${il < 0.5 ? "#B5BCC6" : "#000"}`,
      borderRadius: il === 0.5 ? "0" : "50%",
      transform: il < 0.5 ? "rotate(0deg)" : "rotate(180deg)",
    };
  }
  const sp = il * 110;
  return {
    opacity: 1,
    background: il > 0.5 ? "#000" : "#B5BCC6",
    boxShadow: `inset ${-sp}px 0 7px 0px ${il > 0.5 ? "#B5BCC6" : "#000"}`,
    borderRadius: il === 0.5 ? "0" : "50%",
    transform: il > 0.5 ? "rotate(0deg)" : "rotate(180deg)",
  };
});

const moonAfterStyle = computed(() => {
  const il = moonIllumination.value;
  const isWaxing =
    moonPhaseName.value.includes("Waxing") ||
    moonPhaseName.value === "First Quarter";
  if (il === 0)
    return {
      opacity: 0,
      background: "#B5BCC6",
      borderRadius: "50%",
      transform: "rotate(0deg)",
    };
  if (il === 1)
    return {
      opacity: 1,
      background: "#B5BCC6",
      boxShadow: "inset 0 0 7px 0px #B5BCC6",
      borderRadius: "50%",
      transform: "rotate(0deg)",
    };
  if (isWaxing)
    return {
      opacity: 0,
      background: "#B5BCC6",
      borderRadius: "50%",
      transform: "rotate(0deg)",
    };
  const sp = (1 - il) * 110;
  return {
    opacity: 1,
    background: il > 0.5 ? "#B5BCC6" : "#000",
    boxShadow: `inset ${sp}px 0 7px 0px ${il > 0.5 ? "#000" : "#B5BCC6"}`,
    borderRadius: il === 0.5 ? "0" : "50%",
    transform: il > 0.5 ? "rotate(0deg)" : "rotate(180deg)",
  };
});

const moonGlowStyle = computed(() => {
  const il = moonIllumination.value;
  if (il === 0) return { boxShadow: "none" };
  return {
    boxShadow: `0 0 ${20 + il * 40}px ${5 + il * 15}px rgba(181,188,198,${(0.1 + il * 0.3).toFixed(2)})`,
  };
});

// ─── Seasonal Elements ────────────────────────────────────────────────────
const snowflakes = ref([]);
const fireflies = ref([]);
const petals = ref([]);
const leaves = ref([]);

function createSnowflakes(count = 80) {
  return Array.from({ length: count }, () => ({
    size: Math.random() * 6 + 2,
    opacity: Math.random() * 0.8 + 0.2,
    animationDuration: (Math.random() * 10 + 8).toFixed(2) + "s",
    animationDelay: (Math.random() * 5).toFixed(2) + "s",
    left: Math.random() * 100 + "%",
    rotation: Math.random() * 360,
    swayAmount: Math.random() * 50 + 25,
  }));
}

function createFireflies(count = 40) {
  return Array.from({ length: count }, () => ({
    size: Math.random() * 4 + 2,
    opacity: Math.random() * 0.7 + 0.3,
    animationDuration: (Math.random() * 8 + 4).toFixed(2) + "s",
    animationDelay: (Math.random() * 3).toFixed(2) + "s",
    left: Math.random() * 100 + "%",
    top: Math.random() * 100 + "%",
    glow: Math.random() * 0.8 + 0.2,
  }));
}

function createPetals(count = 50) {
  const colors = ["#ffb7c5", "#ff9eb5", "#ff85a1", "#ff6b8b"];
  return Array.from({ length: count }, () => ({
    size: Math.random() * 8 + 4,
    opacity: Math.random() * 0.6 + 0.4,
    animationDuration: (Math.random() * 12 + 6).toFixed(2) + "s",
    animationDelay: (Math.random() * 4).toFixed(2) + "s",
    left: Math.random() * 100 + "%",
    rotation: Math.random() * 360,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

function createLeaves(count = 40) {
  const colors = ["#8B4513", "#A0522D", "#CD853F", "#D2691E"];
  return Array.from({ length: count }, () => ({
    size: Math.random() * 20 + 10,
    opacity: Math.random() * 0.7 + 0.3,
    animationDuration: (Math.random() * 15 + 8).toFixed(2) + "s",
    animationDelay: (Math.random() * 5).toFixed(2) + "s",
    left: Math.random() * 100 + "%",
    rotation: Math.random() * 360,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

// ─── Interaction handlers ─────────────────────────────────────────────────
const onElementEnter = (index) => {
  hoveredElement.value = index;
};
const onElementLeave = () => {
  hoveredElement.value = null;
};
const toggleMoonInfo = () => {
  showInfo.value = !showInfo.value;
};

// ─── Init + Cleanup ───────────────────────────────────────────────────────
let moonInterval = null;
let resizeHandler = null;

// ✅ Fixed: was two separate onMounted calls — merged into one.
onMounted(() => {
  currentSeason.value = getCurrentSeason();
  moonPhaseName.value = calculateMoonPhase();
  moonPhaseClass.value = moonPhaseName.value.toLowerCase().replace(/ /g, "-");

  const isMobile = window.innerWidth < 768;
  snowflakes.value = createSnowflakes(isMobile ? 60 : 100);
  fireflies.value = createFireflies(isMobile ? 20 : 40);
  petals.value = createPetals(isMobile ? 36 : 60);
  leaves.value = createLeaves(isMobile ? 27 : 45);

  // Update moon phase every hour
  moonInterval = setInterval(() => {
    moonPhaseName.value = calculateMoonPhase();
    moonPhaseClass.value = moonPhaseName.value.toLowerCase().replace(/ /g, "-");
  }, 3_600_000);

  // Adjust density on resize
  resizeHandler = () => {
    const mobile = window.innerWidth < 768;
    snowflakes.value = createSnowflakes(mobile ? 60 : 100);
    fireflies.value = createFireflies(mobile ? 20 : 40);
    petals.value = createPetals(mobile ? 36 : 60);
    leaves.value = createLeaves(mobile ? 27 : 45);
  };
  window.addEventListener("resize", resizeHandler);
});

// ✅ Fixed: previous code never cleared the interval or resize listener → memory leak
onUnmounted(() => {
  if (moonInterval) clearInterval(moonInterval);
  if (resizeHandler) window.removeEventListener("resize", resizeHandler);
});
</script>

<template>
  <div class="seasonal-container" :class="currentSeason">
    <div class="season-background"></div>

    <!-- Moon -->
    <div
      class="moon"
      :class="{ 'gravity-zone': hoveredElement !== null }"
      :style="moonGlowStyle"
      @click="toggleMoonInfo"
    >
      <div class="moon-before" :style="moonBeforeStyle"></div>
      <div class="moon-after" :style="moonAfterStyle"></div>
    </div>

    <!-- Winter: Snowfall -->
    <div v-if="currentSeason === 'winter'" class="snowfall" aria-hidden="true">
      <div
        v-for="(flake, index) in snowflakes"
        :key="index"
        class="snowflake-wrapper"
        :style="{ left: flake.left }"
      >
        <div
          class="snowflake"
          :class="{ paused: hoveredElement === index }"
          :style="{
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
          }"
          @mouseenter="onElementEnter(index)"
          @mouseleave="onElementLeave"
        >
          <div
            class="snowflake-inner"
            :class="{ hovered: hoveredElement === index }"
            :style="{
              '--size': flake.size + 'px',
              '--rotation': flake.rotation + 'deg',
              '--sway': flake.swayAmount + 'px',
              opacity: flake.opacity,
            }"
          ></div>
        </div>
      </div>
      <div class="snow-pile"></div>
    </div>

    <!-- Summer: Fireflies -->
    <div
      v-if="currentSeason === 'summer'"
      class="fireflies-vortex"
      aria-hidden="true"
    >
      <div
        v-for="(fly, index) in fireflies"
        :key="index"
        class="firefly-wrapper"
        :style="{ left: fly.left, top: fly.top }"
      >
        <div
          class="firefly"
          :class="{ paused: hoveredElement === index }"
          :style="{
            animationDuration: fly.animationDuration,
            animationDelay: fly.animationDelay,
          }"
          @mouseenter="onElementEnter(index)"
          @mouseleave="onElementLeave"
        >
          <div
            class="firefly-inner"
            :class="{ hovered: hoveredElement === index }"
            :style="{ '--size': fly.size + 'px', '--glow': fly.glow }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Spring: Cherry blossoms -->
    <div
      v-if="currentSeason === 'spring'"
      class="cherry-blossoms"
      aria-hidden="true"
    >
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

    <!-- Autumn: Falling leaves -->
    <div
      v-if="currentSeason === 'autumn'"
      class="falling-leaves"
      aria-hidden="true"
    >
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

    <!-- Season Info -->
    <div class="season-info" :class="{ visible: showInfo }">
      <div class="info-card">
        <h3>{{ seasonDisplayName }}</h3>
        <p>Moon Phase: {{ moonPhaseName }}</p>
        <p>Illumination: {{ Math.round(moonIllumination * 100) }}%</p>
        <button @click="toggleMoonInfo" class="close-btn" aria-label="Close">
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ✅ Fixed: duplicate .seasonal-container, background color rules removed */
.seasonal-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  transition: background 2s ease-in-out;
}

.seasonal-container.winter {
  background: linear-gradient(180deg, #000 0%, #0e0a1f 100%);
}
.seasonal-container.spring {
  background: linear-gradient(180deg, #000 0%, #121612 100%);
}
.seasonal-container.summer {
  background: linear-gradient(180deg, #000 0%, #151519 100%);
}
.seasonal-container.autumn {
  background: linear-gradient(180deg, #000 0%, #201a15 100%);
}

.season-background {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background:
    radial-gradient(
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

/* Moon */
.moon {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 80px;
  height: 80px;
  clip-path: circle(40px at center);
  border-radius: 50%;
  background: #b5bcc6;
  overflow: hidden;
  cursor: pointer;
  transition: all 3s ease;
  z-index: 10;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    top: 5%;
    right: 5%;
  }
}

.moon-before,
.moon-after {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transition: all 1s ease;
}

.moon::after {
  content: "";
  position: absolute;
  top: -25%;
  left: -25%;
  width: 150%;
  height: 150%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(245, 243, 206, 0.1) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: -1;
}

.moon.gravity-zone::after {
  opacity: 0.3;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
}

/* Snowfall */
.snowfall {
  position: absolute;
  inset: 0;
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
  will-change: transform, opacity;
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

.snowflake-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size, 4px);
  height: var(--size, 4px);
  background: #fff;
  border-radius: 50%;
  box-shadow:
    0 0 4px #fff,
    0 0 8px rgba(255, 255, 255, 0.6);
  transform: rotate(var(--rotation, 0deg));
  transition: all 0.3s ease;
  filter: blur(0.3px);
}
.snowflake-inner.hovered {
  transform: scale(2) rotate(calc(var(--rotation, 0deg) + 180deg));
  box-shadow:
    0 0 15px #fff,
    0 0 30px rgba(255, 255, 255, 0.8);
}

/* Fireflies */
.fireflies-vortex {
  position: absolute;
  inset: 0;
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
  background: #ff0;
  border-radius: 50%;
  opacity: var(--glow, 0.5);
  box-shadow:
    0 0 10px #ff0,
    0 0 20px rgba(255, 255, 0, 0.5);
  filter: blur(1px);
  transition: all 0.3s ease;
}
.firefly-inner.hovered {
  transform: scale(3);
  opacity: 1 !important;
}

/* Petals */
.cherry-blossoms {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

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
}

/* Leaves */
.falling-leaves {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.leaf-inner {
  position: absolute;
  font-size: var(--size, 15px);
  transform: rotate(var(--rotation, 0deg));
  opacity: 0.8;
  transition: all 0.3s ease;
}
.leaf-inner.hovered {
  transform: scale(1.3) rotate(calc(var(--rotation, 0deg) + 30deg));
  opacity: 1 !important;
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

/* Season info */
.season-info {
  position: absolute;
  top: 20px;
  left: 20px;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease;
  z-index: 20;

  @media (max-width: 768px) {
    top: 10px;
    left: 10px;
  }
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

/* Keyframes */
@keyframes snowFall {
  0% {
    transform: translateY(-20px) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity, 0.8);
  }
  100% {
    transform: translateY(100vh) translateX(calc(var(--sway, 0px)))
      rotate(450deg);
    opacity: 0;
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
@keyframes sparkle {
  0%,
  100% {
    filter: brightness(1) blur(0.1px);
  }
  50% {
    filter: brightness(1.5) blur(0.5px);
  }
}
</style>
