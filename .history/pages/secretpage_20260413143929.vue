<template>
  <div class="observatory" :class="currentSeason" ref="observatoryEl">
    <!-- Grain overlay for film texture -->
    <div class="grain" aria-hidden="true" />

    <!-- Horizon glow that changes per season -->
    <div class="horizon-glow" aria-hidden="true" />

    <!-- Star field (always visible, density varies) -->
    <div class="starfield" aria-hidden="true">
      <div v-for="(s, i) in bgStars" :key="i" class="bg-star" :style="s" />
    </div>

    <!-- ── Season particles ─────────────────────────────── -->
    <div
      v-if="currentSeason === 'winter'"
      class="particles winter-particles"
      aria-hidden="true"
    >
      <div
        v-for="(s, i) in snowflakes"
        :key="i"
        class="particle snowflake"
        :style="s.wrapStyle"
        @mouseenter="onHover(i)"
        @mouseleave="onLeave"
      >
        <div
          class="particle-inner snow-inner"
          :class="{ hovered: hoveredEl === i }"
          :style="s.innerStyle"
        />
      </div>
      <div class="ground-layer snow-ground" />
    </div>

    <div
      v-if="currentSeason === 'summer'"
      class="particles summer-particles"
      aria-hidden="true"
    >
      <div
        v-for="(f, i) in fireflies"
        :key="i"
        class="particle firefly"
        :style="f.wrapStyle"
        @mouseenter="onHover(i)"
        @mouseleave="onLeave"
      >
        <div
          class="particle-inner fire-inner"
          :class="{ hovered: hoveredEl === i }"
          :style="f.innerStyle"
        />
      </div>
    </div>

    <div
      v-if="currentSeason === 'spring'"
      class="particles spring-particles"
      aria-hidden="true"
    >
      <div
        v-for="(p, i) in petals"
        :key="i"
        class="particle petal"
        :style="p.wrapStyle"
        @mouseenter="onHover(i)"
        @mouseleave="onLeave"
      >
        <div
          class="particle-inner petal-inner"
          :class="{ hovered: hoveredEl === i }"
          :style="p.innerStyle"
        />
      </div>
    </div>

    <div
      v-if="currentSeason === 'autumn'"
      class="particles autumn-particles"
      aria-hidden="true"
    >
      <div
        v-for="(l, i) in leaves"
        :key="i"
        class="particle leaf"
        :style="l.wrapStyle"
        @mouseenter="onHover(i)"
        @mouseleave="onLeave"
      >
        <div
          class="particle-inner leaf-inner"
          :class="{ hovered: hoveredEl === i }"
          :style="l.innerStyle"
        >
          🍁
        </div>
      </div>
      <div class="ground-layer leaf-ground" />
    </div>

    <!-- ── Moon ─────────────────────────────────────────── -->
    <button
      class="moon-btn"
      :style="moonGlowStyle"
      @click="togglePanel"
      :aria-label="`Moon: ${moonPhaseName}. Click for details.`"
    >
      <div class="moon-disk">
        <img src="/moon.png" alt="" class="moon-texture" aria-hidden="true" />
        <div class="moon-shadow before-shadow" :style="moonBeforeStyle" />
        <div class="moon-shadow after-shadow" :style="moonAfterStyle" />
      </div>
      <span class="moon-label">{{ moonPhaseName }}</span>
    </button>

    <!-- ── Season badge ──────────────────────────────────── -->
    <div class="season-badge">
      <span class="badge-icon">{{ seasonIcon }}</span>
      <span class="badge-name">{{ seasonDisplayName }}</span>
    </div>

    <!-- ── Info panel ────────────────────────────────────── -->
    <Transition name="panel">
      <div
        v-if="showPanel"
        class="info-panel"
        role="dialog"
        aria-label="Moon information"
      >
        <button class="panel-close" @click="togglePanel" aria-label="Close">
          ✕
        </button>

        <div class="panel-moon-mini">
          <div class="mini-disk">
            <div class="moon-shadow before-shadow" :style="moonBeforeStyle" />
            <div class="moon-shadow after-shadow" :style="moonAfterStyle" />
          </div>
        </div>

        <h2 class="panel-title">{{ moonPhaseName }}</h2>

        <div class="panel-stats">
          <div class="stat">
            <span class="stat-label">Illumination</span>
            <div class="stat-bar">
              <div
                class="stat-fill"
                :style="{ width: `${Math.round(moonIllumination * 100)}%` }"
              />
            </div>
            <span class="stat-value"
              >{{ Math.round(moonIllumination * 100) }}%</span
            >
          </div>
          <div class="stat">
            <span class="stat-label">Season</span>
            <span class="stat-value"
              >{{ seasonIcon }} {{ seasonDisplayName }}</span
            >
          </div>
          <div class="stat">
            <span class="stat-label">Date</span>
            <span class="stat-value">{{ todayFormatted }}</span>
          </div>
        </div>

        <p class="panel-desc">{{ moonDescription }}</p>
      </div>
    </Transition>

    <!-- ── Debug controls (uncomment to use) ────────────── -->
    <!--
    <div class="debug">
      <button @click="cycleSeason">⟳ Season</button>
      <button @click="cycleMoonPhase">⟳ Moon</button>
    </div>
    -->
  </div>
</template>

<script setup>
definePageMeta({ layout: "empty" });

// ── Season ────────────────────────────────────────────────────────────────────
const SEASONS = ["winter", "spring", "summer", "autumn"];

const currentSeason = ref("winter");
const hoveredEl = ref(null);
const showPanel = ref(false);

const seasonIcon = computed(() => ({ winter: "❄️", spring: "🌸", summer: "☀️", autumn: "🍂" }[currentSeason.value]);
const seasonDisplayName = computed(() => ({ winter: "Winter", spring: "Spring", summer: "Summer", autumn: "Autumn" }[currentSeason.value]));

const todayFormatted = computed(() => {
  return new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
});

// ── Moon phase ────────────────────────────────────────────────────────────────
const moonIllumination = ref(0.5);
const moonPhaseName = ref("");

const KNOWN_FULL_MOON = new Date(2025, 10, 5, 13, 19, 0);
const LUNAR_CYCLE = 29.530588853;

function calcMoonPhase(date = new Date()) {
  const daysSince = (date - KNOWN_FULL_MOON) / 86400000;
  const angle = (daysSince / LUNAR_CYCLE) * 2 * Math.PI;
  const illum = Math.max(0, Math.min(1, Math.pow(Math.cos(angle / 2), 2)));

  let name;
  const d = daysSince % LUNAR_CYCLE;
  const nd = d < 0 ? d + LUNAR_CYCLE : d; // normalize to 0–29.5
  if (nd <= 1 || nd >= 28.5)           name = "Full Moon";
  else if (nd <= 7)                    name = "Waning Gibbous";
  else if (nd <= 8.5)                  name = "Last Quarter";
  else if (nd <= 14)                   name = "Waning Crescent";
  else if (nd <= 15.5)                 name = "New Moon";
  else if (nd <= 21)                   name = "Waxing Crescent";
  else if (nd <= 22.5)                 name = "First Quarter";
  else                                 name = "Waxing Gibbous";

  return { illum, name };
}

const moonDescription = computed(() => {
  const d = {
    "Full Moon":       "The moon is fully illuminated. A powerful night for reflection and clarity.",
    "Waning Gibbous":  "Light begins to retreat. A time to release what no longer serves you.",
    "Last Quarter":    "Half lit, half shadow. Balance and decision-making come into focus.",
    "Waning Crescent": "The moon grows dark. Rest, introspection, and preparation.",
    "New Moon":        "Darkness reigns. New beginnings stir beneath the surface.",
    "Waxing Crescent": "A sliver of light returns. Set intentions and plant seeds.",
    "First Quarter":   "Growth meets resistance. Take action on what you've started.",
    "Waxing Gibbous":  "Almost full. Refine your efforts — the peak approaches.",
  };
  return d[moonPhaseName.value] || "";
});

// Moon shadow styles — same logic as original, cleaned up
const isWaxing = computed(() =>
  moonPhaseName.value.includes("Waxing") || moonPhaseName.value === "First Quarter"
);

const moonBeforeStyle = computed(() => {
  const il = moonIllumination.value;
  if (il === 0) return { opacity: 1, background: "#000", boxShadow: "inset 0 0 7px 0 #B5BCC6", borderRadius: "50%" };
  if (il === 1) return { opacity: 0 };
  const sp = il * 110;
  if (isWaxing.value) {
    return {
      opacity: 1,
      background: il < 0.5 ? "#000" : "#B5BCC6",
      boxShadow: `inset ${sp}px 0 7px 0 ${il < 0.5 ? "#B5BCC6" : "#000"}`,
      borderRadius: il === 0.5 ? "0" : "50%",
      transform: il < 0.5 ? "rotate(0deg)" : "rotate(180deg)",
    };
  }
  return {
    opacity: 1,
    background: il > 0.5 ? "#000" : "#B5BCC6",
    boxShadow: `inset ${-sp}px 0 7px 0 ${il > 0.5 ? "#B5BCC6" : "#000"}`,
    borderRadius: il === 0.5 ? "0" : "50%",
    transform: il > 0.5 ? "rotate(0deg)" : "rotate(180deg)",
  };
});

const moonAfterStyle = computed(() => {
  const il = moonIllumination.value;
  if (il === 0) return { opacity: 0 };
  if (il === 1) return { opacity: 1, background: "#B5BCC6", boxShadow: "inset 0 0 7px 0 #B5BCC6", borderRadius: "50%" };
  if (isWaxing.value) return { opacity: 0 };
  const sp = (1 - il) * 110;
  return {
    opacity: 1,
    background: il > 0.5 ? "#B5BCC6" : "#000",
    boxShadow: `inset ${sp}px 0 7px 0 ${il > 0.5 ? "#000" : "#B5BCC6"}`,
    borderRadius: il === 0.5 ? "0" : "50%",
    transform: il > 0.5 ? "rotate(0deg)" : "rotate(180deg)",
  };
});

const moonGlowStyle = computed(() => {
  const il = moonIllumination.value;
  const season = currentSeason.value;
  const colors = { winter: "181,188,198", spring: "255,183,197", summer: "255,220,100", autumn: "205,133,63" };
  const c = colors[season];
  return il === 0
    ? { boxShadow: "none" }
    : { boxShadow: `0 0 ${20 + il * 60}px ${5 + il * 20}px rgba(${c},${(0.1 + il * 0.35).toFixed(2)})` };
});

// ── Background stars (static, generated once) ────────────────────────────────
const bgStars = Array.from({ length: 120 }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  width: `${(Math.random() * 2 + 0.5).toFixed(1)}px`,
  height: `${(Math.random() * 2 + 0.5).toFixed(1)}px`,
  opacity: (Math.random() * 0.7 + 0.1).toFixed(2),
  animationDelay: `${(Math.random() * 6).toFixed(2)}s`,
  animationDuration: `${(Math.random() * 4 + 2).toFixed(2)}s`,
}));

// ── Seasonal particles ────────────────────────────────────────────────────────
function makeSnowflakes(count) {
  return Array.from({ length: count }, () => {
    const size = +(Math.random() * 5 + 2).toFixed(1);
    return {
      wrapStyle: {
        left: `${Math.random() * 100}%`,
        animationDuration: `${(Math.random() * 10 + 8).toFixed(2)}s`,
        animationDelay: `${(Math.random() * 6).toFixed(2)}s`,
      },
      innerStyle: { "--size": `${size}px`, "--rot": `${Math.random() * 360}deg`, opacity: (Math.random() * 0.7 + 0.3).toFixed(2) },
    };
  });
}

function makeFireflies(count) {
  return Array.from({ length: count }, () => ({
    wrapStyle: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 80}%`,
      animationDuration: `${(Math.random() * 8 + 4).toFixed(2)}s`,
      animationDelay: `${(Math.random() * 4).toFixed(2)}s`,
    },
    innerStyle: { "--size": `${(Math.random() * 4 + 2).toFixed(1)}px`, "--glow": (Math.random() * 0.6 + 0.4).toFixed(2) },
  }));
}

function makePetals(count) {
  const COLORS = ["#ffb7c5", "#ff9eb5", "#ff85a1", "#ffc8d5", "#ffadc0"];
  return Array.from({ length: count }, () => ({
    wrapStyle: {
      left: `${Math.random() * 100}%`,
      animationDuration: `${(Math.random() * 12 + 6).toFixed(2)}s`,
      animationDelay: `${(Math.random() * 5).toFixed(2)}s`,
    },
    innerStyle: {
      "--size": `${(Math.random() * 8 + 4).toFixed(1)}px`,
      "--rot": `${Math.random() * 360}deg`,
      "--color": COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: (Math.random() * 0.5 + 0.5).toFixed(2),
    },
  }));
}

function makeLeaves(count) {
  return Array.from({ length: count }, () => ({
    wrapStyle: {
      left: `${Math.random() * 100}%`,
      animationDuration: `${(Math.random() * 14 + 8).toFixed(2)}s`,
      animationDelay: `${(Math.random() * 5).toFixed(2)}s`,
    },
    innerStyle: { "--size": `${(Math.random() * 18 + 10).toFixed(1)}px`, "--rot": `${Math.random() * 360}deg` },
  }));
}

const snowflakes = ref([]);
const fireflies  = ref([]);
const petals     = ref([]);
const leaves     = ref([]);

function refreshParticles() {
  const mobile = window.innerWidth < 768;
  snowflakes.value = makeSnowflakes(mobile ? 50 : 100);
  fireflies.value  = makeFireflies(mobile ? 25 : 50);
  petals.value     = makePetals(mobile ? 30 : 60);
  leaves.value     = makeLeaves(mobile ? 22 : 45);
}

// ── Interactions ──────────────────────────────────────────────────────────────
const onHover = (i) => { hoveredEl.value = i; };
const onLeave = ()  => { hoveredEl.value = null; };
const togglePanel = () => { showPanel.value = !showPanel.value; };

// ── Debug helpers ─────────────────────────────────────────────────────────────
const cycleSeason = () => {
  const i = SEASONS.indexOf(currentSeason.value);
  currentSeason.value = SEASONS[(i + 1) % SEASONS.length];
};

const PHASE_CYCLE = [
  { name: "New Moon", illumination: 0 },
  { name: "Waxing Crescent", illumination: 0.25 },
  { name: "First Quarter", illumination: 0.5 },
  { name: "Waxing Gibbous", illumination: 0.75 },
  { name: "Full Moon", illumination: 1 },
  { name: "Waning Gibbous", illumination: 0.75 },
  { name: "Last Quarter", illumination: 0.5 },
  { name: "Waning Crescent", illumination: 0.25 },
];

const cycleMoonPhase = () => {
  const i = PHASE_CYCLE.findIndex((p) => p.name === moonPhaseName.value);
  const next = PHASE_CYCLE[(i + 1) % PHASE_CYCLE.length];
  moonPhaseName.value = next.name;
  moonIllumination.value = next.illumination;
};

// ── Lifecycle ─────────────────────────────────────────────────────────────────
let resizeTimer = null;

onMounted(() => {
  currentSeason.value = (() => {
    const m = new Date().getMonth() + 1;
    if (m >= 12 || m <= 2) return "winter";
    if (m <= 5) return "spring";
    if (m <= 8) return "summer";
    return "autumn";
  })();

  const { illum, name } = calcMoonPhase();
  moonIllumination.value = illum;
  moonPhaseName.value = name;

  refreshParticles();

  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshParticles, 200);
  };
  window.addEventListener("resize", onResize);
  onUnmounted(() => {
    window.removeEventListener("resize", onResize);
    clearTimeout(resizeTimer);
  });

  // Recalculate moon every hour
  const moonTimer = setInterval(() => {
    const { illum, name } = calcMoonPhase();
    moonIllumination.value = illum;
    moonPhaseName.value = name;
  }, 3_600_000);
  onUnmounted(() => clearInterval(moonTimer));
});
</script>

<style scoped>
/* ── CSS variables per season ──────────────────────────────────────────────── */
.observatory {
  --accent: #b5bcc6;
  --glow: rgba(181, 188, 198, 0.15);
  --horizon: #0e0a2a;
  --bg-top: #000005;
}
.observatory.spring {
  --accent: #ffb7c5;
  --glow: rgba(255, 183, 197, 0.15);
  --horizon: #0d1a10;
  --bg-top: #010204;
}
.observatory.summer {
  --accent: #ffd764;
  --glow: rgba(255, 215, 100, 0.15);
  --horizon: #0a1020;
  --bg-top: #020304;
}
.observatory.autumn {
  --accent: #cd853f;
  --glow: rgba(205, 133, 63, 0.15);
  --horizon: #1a0e06;
  --bg-top: #040200;
}

/* ── Base ──────────────────────────────────────────────────────────────────── */
.observatory {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(
    ellipse at 50% 0%,
    var(--horizon) 0%,
    var(--bg-top) 70%
  );
  transition:
    background 3s ease,
    --accent 3s ease;
  font-family: "Georgia", serif;
  cursor: default;
}

/* Grain */
.grain {
  position: absolute;
  inset: 0;
  z-index: 100;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* Horizon glow */
.horizon-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: radial-gradient(
    ellipse at 50% 100%,
    var(--glow) 0%,
    transparent 70%
  );
  pointer-events: none;
  transition: background 3s ease;
  z-index: 1;
}

/* ── Stars ─────────────────────────────────────────────────────────────────── */
.starfield {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.bg-star {
  position: absolute;
  border-radius: 50%;
  background: #fff;
  animation: twinkle var(--dur, 3s) ease-in-out var(--delay, 0s) infinite
    alternate;
}
@keyframes twinkle {
  from {
    opacity: var(--op, 0.3);
    transform: scale(1);
  }
  to {
    opacity: calc(var(--op, 0.3) * 0.3);
    transform: scale(0.7);
  }
}

/* ── Moon button ───────────────────────────────────────────────────────────── */
.moon-btn {
  position: absolute;
  top: 8%;
  right: 8%;
  width: 90px;
  height: 90px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: box-shadow 3s ease;
}

.moon-disk {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #b5bcc6;
  overflow: hidden;
  clip-path: circle(40px at center);
  transition: transform 0.3s ease;
}

.moon-btn:hover .moon-disk {
  transform: scale(1.08);
}

.moon-texture {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  opacity: 0.6;
  mix-blend-mode: overlay;
}

.moon-shadow {
  position: absolute;
  top: -4%;
  left: -4%;
  width: 108%;
  height: 108%;
  border-radius: 50%;
  mix-blend-mode: darken;
  transition: all 3s ease;
}

.moon-label {
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  opacity: 0.8;
  white-space: nowrap;
  font-family: "Georgia", serif;
}

/* ── Season badge ──────────────────────────────────────────────────────────── */
.season-badge {
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  z-index: 20;
}

.badge-icon {
  font-size: 1.1rem;
}
.badge-name {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  font-family: "Georgia", serif;
}

/* ── Info panel ────────────────────────────────────────────────────────────── */
.info-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(380px, 90vw);
  background: rgba(4, 4, 12, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px) saturate(140%);
  border-radius: 1.25rem;
  padding: 2rem;
  z-index: 50;
  color: #e8e8f0;
  box-shadow:
    0 0 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.panel-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.panel-close:hover {
  background: rgba(255, 255, 255, 0.14);
}

.panel-moon-mini {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.mini-disk {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #b5bcc6;
  overflow: hidden;
  clip-path: circle(28px at center);
}

.panel-title {
  text-align: center;
  font-size: 1.35rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin: 0 0 1.5rem;
  font-family: "Georgia", serif;
}

.panel-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  width: 90px;
  flex-shrink: 0;
}

.stat-bar {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 1s ease;
}

.stat-value {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
  min-width: 40px;
}

.panel-desc {
  font-size: 0.85rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  font-style: italic;
  margin: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding-top: 1rem;
}

/* Panel transition */
.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translate(-50%, calc(-50% + 12px));
}

/* ── Particles common ──────────────────────────────────────────────────────── */
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.particle {
  position: absolute;
  top: -40px;
  pointer-events: auto;
  will-change: transform;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* Winter */
.winter-particles .particle {
  animation-name: snowFall;
}
.snow-inner {
  width: var(--size, 4px);
  height: var(--size, 4px);
  background: #fff;
  border-radius: 50%;
  box-shadow:
    0 0 4px #fff,
    0 0 10px rgba(255, 255, 255, 0.5);
  transform: rotate(var(--rot, 0deg));
  transition: all 0.3s ease;
  filter: blur(0.3px);
}
.snow-inner.hovered {
  transform: scale(2.5) rotate(calc(var(--rot, 0deg) + 180deg));
  box-shadow:
    0 0 16px #fff,
    0 0 32px rgba(255, 255, 255, 0.7);
}

/* Summer / fireflies */
.summer-particles .particle {
  position: absolute;
  top: unset;
  animation-name: fireflyFloat;
  animation-timing-function: ease-in-out;
}
.fire-inner {
  width: var(--size, 3px);
  height: var(--size, 3px);
  background: #ffe44d;
  border-radius: 50%;
  opacity: var(--glow, 0.6);
  box-shadow:
    0 0 8px #ffe44d,
    0 0 20px rgba(255, 228, 77, 0.5);
  filter: blur(0.8px);
  transition: all 0.3s ease;
}
.fire-inner.hovered {
  transform: scale(3);
  opacity: 1 !important;
  box-shadow:
    0 0 20px #ffe44d,
    0 0 40px rgba(255, 228, 77, 0.8);
}

/* Spring / petals */
.spring-particles .particle {
  animation-name: petalFall;
}
.petal-inner {
  width: var(--size, 6px);
  height: var(--size, 6px);
  background: var(--color, #ffb7c5);
  border-radius: 50% 50% 50% 0;
  transform: rotate(var(--rot, 0deg));
  transition: all 0.3s ease;
}
.petal-inner.hovered {
  transform: scale(1.6) rotate(calc(var(--rot, 0deg) + 45deg));
  filter: brightness(1.4);
}

/* Autumn / leaves */
.autumn-particles .particle {
  animation-name: leafFall;
}
.leaf-inner {
  font-size: var(--size, 15px);
  transform: rotate(var(--rot, 0deg));
  transition: all 0.3s ease;
  display: block;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
.leaf-inner.hovered {
  transform: scale(1.4) rotate(calc(var(--rot, 0deg) + 30deg));
  filter: brightness(1.3);
}

/* Ground layers */
.ground-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  pointer-events: none;
}
.snow-ground {
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.03) 30%,
    transparent
  );
}
.leaf-ground {
  background: linear-gradient(
    to top,
    rgba(139, 69, 19, 0.18) 0%,
    rgba(139, 69, 19, 0.06) 30%,
    transparent
  );
}

/* ── Keyframes ─────────────────────────────────────────────────────────────── */
@keyframes snowFall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  92% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(105vh) translateX(60px) rotate(540deg);
    opacity: 0;
  }
}

@keyframes petalFall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  100% {
    transform: translateY(105vh) translateX(120px) rotate(720deg);
    opacity: 0;
  }
}

@keyframes leafFall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  100% {
    transform: translateY(105vh) translateX(-100px) rotate(420deg);
    opacity: 0;
  }
}

@keyframes fireflyFloat {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }
  25% {
    transform: translate(22px, -18px) scale(1.1);
    opacity: 0.85;
  }
  50% {
    transform: translate(-18px, 12px) scale(0.9);
    opacity: 0.55;
  }
  75% {
    transform: translate(12px, 22px) scale(1.05);
    opacity: 0.7;
  }
}

/* ── Debug ─────────────────────────────────────────────────────────────────── */
.debug {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 200;
  display: flex;
  gap: 0.5rem;
}
.debug button {
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 0.4rem;
  cursor: pointer;
  font-size: 0.75rem;
  backdrop-filter: blur(8px);
  transition: background 0.2s;
}
.debug button:hover {
  background: rgba(255, 255, 255, 0.18);
}

/* ── Responsive ────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .moon-btn {
    top: 5%;
    right: 5%;
    width: 70px;
    height: 70px;
  }
  .moon-disk {
    width: 60px;
    height: 60px;
  }
  .season-badge {
    top: 1rem;
    left: 1rem;
  }
}
</style>
