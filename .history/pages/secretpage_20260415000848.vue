<template>
  <div class="observatory" :class="currentSeason" ref="observatoryEl">
    <!-- Grain overlay for film texture -->
    <div class="grain" aria-hidden="true" />

    <!-- Horizon glow that changes per season -->
    <div class="horizon-glow" aria-hidden="true" />

    <!-- Star field -->
    <div class="starfield" aria-hidden="true">
      <div
        v-for="(s, i) in bgStars"
        :key="i"
        class="bg-star"
        :style="{
          left: s.left,
          top: s.top,
          width: s.width,
          height: s.height,
          opacity: s.opacity,
          animationDelay: s.animationDelay,
          animationDuration: s.animationDuration,
        }"
      />
    </div>

    <!-- Shooting stars -->
    <div class="shooting-stars" aria-hidden="true">
      <div
        v-for="(ss, i) in shootingStars"
        :key="i"
        class="shooting-star"
        :style="ss"
      />
    </div>

    <!-- Constellation lines (winter only) -->
    <svg
      v-if="currentSeason === 'winter'"
      class="constellation-svg"
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <g class="constellation" opacity="0.18">
        <line x1="20" y1="15" x2="30" y2="25" />
        <line x1="30" y1="25" x2="45" y2="20" />
        <line x1="45" y1="20" x2="55" y2="30" />
        <line x1="55" y1="30" x2="70" y2="18" />
        <line x1="70" y1="18" x2="80" y2="28" />
        <circle cx="20" cy="15" r="0.5" />
        <circle cx="30" cy="25" r="0.5" />
        <circle cx="45" cy="20" r="0.5" />
        <circle cx="55" cy="30" r="0.5" />
        <circle cx="70" cy="18" r="0.5" />
        <circle cx="80" cy="28" r="0.5" />
      </g>
      <g class="constellation" opacity="0.13">
        <line x1="10" y1="45" x2="22" y2="38" />
        <line x1="22" y1="38" x2="35" y2="48" />
        <line x1="35" y1="48" x2="28" y2="58" />
        <line x1="28" y1="58" x2="15" y2="55" />
        <line x1="15" y1="55" x2="10" y2="45" />
        <circle cx="10" cy="45" r="0.4" />
        <circle cx="22" cy="38" r="0.4" />
        <circle cx="35" cy="48" r="0.4" />
        <circle cx="28" cy="58" r="0.4" />
        <circle cx="15" cy="55" r="0.4" />
      </g>
    </svg>

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
          {{ l.emoji }}
        </div>
      </div>
      <div class="ground-layer leaf-ground" />
    </div>

    <!-- ── Moon ─────────────────────────────────────────── -->
    <button
      class="moon-btn"
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

    <!-- ── Live clock ────────────────────────────────────── -->
    <div class="clock-display" aria-live="polite">
      <span class="clock-time">{{ clockTime }}</span>
      <span class="clock-date">{{ todayFormatted }}</span>
    </div>

    <!-- ── Season switcher ───────────────────────────────── -->
    <div class="season-switcher" role="group" aria-label="Season selector">
      <button
        v-for="s in SEASONS"
        :key="s"
        class="season-pill"
        :class="{ active: currentSeason === s }"
        @click="setSeason(s)"
        :aria-pressed="currentSeason === s"
      >
        {{ SEASON_META[s].icon }}
        <span class="pill-name">{{ SEASON_META[s].label }}</span>
      </button>
    </div>

    <!-- ── Sound toggle ──────────────────────────────────── -->
    <button
      class="sound-btn"
      @click="toggleSound"
      :aria-label="soundPlaying ? 'Mute ambient sound' : 'Play ambient sound'"
      :title="soundPlaying ? 'Mute' : 'Ambient sound'"
    >
      <span class="sound-icon">{{ soundPlaying ? "🔊" : "🔇" }}</span>
    </button>

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
            <img
              src="/moon.png"
              alt=""
              class="moon-texture"
              aria-hidden="true"
            />
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
              >{{ SEASON_META[currentSeason].icon }}
              {{ SEASON_META[currentSeason].label }}</span
            >
          </div>
          <div class="stat">
            <span class="stat-label">Date</span>
            <span class="stat-value">{{ todayFormatted }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Next Full Moon</span>
            <span class="stat-value">{{ nextFullMoonStr }}</span>
          </div>
        </div>

        <p class="panel-desc">{{ moonDescription }}</p>

        <div class="panel-footer">
          <span class="footer-hint">✦ &nbsp;You found the secret page&nbsp; ✦</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({ layout: "empty" });

// ── Season ────────────────────────────────────────────────────────────────────
const SEASONS = ["winter", "spring", "summer", "autumn"];

const SEASON_META = {
  winter: { icon: "❄️", label: "Winter" },
  spring: { icon: "🌸", label: "Spring" },
  summer: { icon: "☀️", label: "Summer" },
  autumn: { icon: "🍂", label: "Autumn" },
};

const LEAF_EMOJIS = ["🍁", "🍂", "🍃"];

const currentSeason = ref("winter");
const hoveredEl = ref(null);
const showPanel = ref(false);
const soundPlaying = ref(false);
let audioEl = null;

const setSeason = (s) => {
  currentSeason.value = s;
};

const todayFormatted = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// ── Live clock ────────────────────────────────────────────────────────────────
const clockTime = ref("");
let clockTimer = null;

function updateClock() {
  clockTime.value = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

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
  const nd = d < 0 ? d + LUNAR_CYCLE : d;
  if (nd <= 1 || nd >= 28.5) name = "Full Moon";
  else if (nd <= 7) name = "Waning Gibbous";
  else if (nd <= 8.5) name = "Last Quarter";
  else if (nd <= 14) name = "Waning Crescent";
  else if (nd <= 15.5) name = "New Moon";
  else if (nd <= 21) name = "Waxing Crescent";
  else if (nd <= 22.5) name = "First Quarter";
  else name = "Waxing Gibbous";

  return { illum, name };
}

function getNextFullMoon() {
  const now = new Date();
  const daysSince = (now - KNOWN_FULL_MOON) / 86400000;
  const d = daysSince % LUNAR_CYCLE;
  const nd = d < 0 ? d + LUNAR_CYCLE : d;
  const daysUntil = nd <= 1 ? 0 : LUNAR_CYCLE - nd;
  const nextFull = new Date(now.getTime() + daysUntil * 86400000);
  if (daysUntil < 1) return "Tonight!";
  const days = Math.round(daysUntil);
  const label = nextFull.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${label} (in ${days}d)`;
}

const nextFullMoonStr = computed(() => getNextFullMoon());

const moonDescription = computed(() => {
  const d = {
    "Full Moon":
      "The moon is fully illuminated. A powerful night for reflection and clarity.",
    "Waning Gibbous":
      "Light begins to retreat. A time to release what no longer serves you.",
    "Last Quarter":
      "Half lit, half shadow. Balance and decision-making come into focus.",
    "Waning Crescent":
      "The moon grows dark. Rest, introspection, and preparation.",
    "New Moon": "Darkness reigns. New beginnings stir beneath the surface.",
    "Waxing Crescent":
      "A sliver of light returns. Set intentions and plant seeds.",
    "First Quarter":
      "Growth meets resistance. Take action on what you've started.",
    "Waxing Gibbous": "Almost full. Refine your efforts — the peak approaches.",
  };
  return d[moonPhaseName.value] || "";
});

const isWaxing = computed(
  () =>
    moonPhaseName.value.includes("Waxing") ||
    moonPhaseName.value === "First Quarter",
);

const moonBeforeStyle = computed(() => {
  const il = moonIllumination.value;
  if (il === 0)
    return {
      opacity: 1,
      background: "#000",
      boxShadow: "inset 0 0 7px 0 #B5BCC6",
      borderRadius: "50%",
    };
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
  if (il === 1)
    return {
      opacity: 1,
      background: "#B5BCC6",
      boxShadow: "inset 0 0 7px 0 #B5BCC6",
      borderRadius: "50%",
    };
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

// ── Background stars ──────────────────────────────────────────────────────────
const bgStars = Array.from({ length: 140 }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 90}%`,
  width: `${(Math.random() * 2.5 + 0.5).toFixed(1)}px`,
  height: `${(Math.random() * 2.5 + 0.5).toFixed(1)}px`,
  opacity: (Math.random() * 0.8 + 0.1).toFixed(2),
  animationDelay: `${(Math.random() * 6).toFixed(2)}s`,
  animationDuration: `${(Math.random() * 4 + 2).toFixed(2)}s`,
}));

// ── Shooting stars ────────────────────────────────────────────────────────────
const shootingStars = Array.from({ length: 6 }, (_, i) => ({
  top: `${Math.random() * 40}%`,
  left: `${Math.random() * 60}%`,
  animationDelay: `${(i * 3.5 + Math.random() * 4).toFixed(2)}s`,
  animationDuration: `${(Math.random() * 1.5 + 0.8).toFixed(2)}s`,
}));

// ── Seasonal particles ────────────────────────────────────────────────────────
function makeSnowflakes(count) {
  return Array.from({ length: count }, () => {
    const size = +(Math.random() * 5 + 2).toFixed(1);
    const drift = (Math.random() * 80 - 40).toFixed(0);
    return {
      wrapStyle: {
        left: `${Math.random() * 100}%`,
        animationDuration: `${(Math.random() * 12 + 8).toFixed(2)}s`,
        animationDelay: `${(Math.random() * 8).toFixed(2)}s`,
        "--drift": `${drift}px`,
      },
      innerStyle: {
        "--size": `${size}px`,
        "--rot": `${Math.random() * 360}deg`,
        opacity: (Math.random() * 0.7 + 0.3).toFixed(2),
      },
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
    innerStyle: {
      "--size": `${(Math.random() * 4 + 2).toFixed(1)}px`,
      "--glow": (Math.random() * 0.6 + 0.4).toFixed(2),
    },
  }));
}

function makePetals(count) {
  const COLORS = ["#ffb7c5", "#ff9eb5", "#ff85a1", "#ffc8d5", "#ffadc0", "#f9c6d0"];
  return Array.from({ length: count }, () => {
    const drift = (Math.random() * 160 - 40).toFixed(0);
    return {
      wrapStyle: {
        left: `${Math.random() * 100}%`,
        animationDuration: `${(Math.random() * 14 + 6).toFixed(2)}s`,
        animationDelay: `${(Math.random() * 6).toFixed(2)}s`,
        "--drift": `${drift}px`,
      },
      innerStyle: {
        "--size": `${(Math.random() * 8 + 4).toFixed(1)}px`,
        "--rot": `${Math.random() * 360}deg`,
        "--color": COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: (Math.random() * 0.5 + 0.5).toFixed(2),
      },
    };
  });
}

function makeLeaves(count) {
  return Array.from({ length: count }, () => {
    const drift = (Math.random() * 140 - 100).toFixed(0);
    return {
      wrapStyle: {
        left: `${Math.random() * 100}%`,
        animationDuration: `${(Math.random() * 16 + 8).toFixed(2)}s`,
        animationDelay: `${(Math.random() * 6).toFixed(2)}s`,
        "--drift": `${drift}px`,
      },
      innerStyle: {
        "--size": `${(Math.random() * 18 + 10).toFixed(1)}px`,
        "--rot": `${Math.random() * 360}deg`,
      },
      emoji: LEAF_EMOJIS[Math.floor(Math.random() * LEAF_EMOJIS.length)],
    };
  });
}

const snowflakes = ref([]);
const fireflies = ref([]);
const petals = ref([]);
const leaves = ref([]);

function refreshParticles() {
  const mobile = window.innerWidth < 768;
  snowflakes.value = makeSnowflakes(mobile ? 50 : 100);
  fireflies.value = makeFireflies(mobile ? 25 : 50);
  petals.value = makePetals(mobile ? 30 : 60);
  leaves.value = makeLeaves(mobile ? 22 : 45);
}

// ── Interactions ──────────────────────────────────────────────────────────────
const onHover = (i) => (hoveredEl.value = i);
const onLeave = () => (hoveredEl.value = null);
const togglePanel = () => (showPanel.value = !showPanel.value);

function toggleSound() {
  if (!audioEl) {
    audioEl = new Audio("/savior.mp3");
    audioEl.loop = true;
    audioEl.volume = 0.3;
  }
  if (soundPlaying.value) {
    audioEl.pause();
    soundPlaying.value = false;
  } else {
    audioEl.play();
    soundPlaying.value = true;
  }
}

function onKeydown(e) {
  if (e.key === "Escape" && showPanel.value) showPanel.value = false;
}

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
  updateClock();
  clockTimer = setInterval(updateClock, 1000);

  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshParticles, 200);
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("keydown", onKeydown);

  const moonTimer = setInterval(() => {
    const { illum, name } = calcMoonPhase();
    moonIllumination.value = illum;
    moonPhaseName.value = name;
  }, 3_600_000);

  onUnmounted(() => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("keydown", onKeydown);
    clearTimeout(resizeTimer);
    clearInterval(moonTimer);
    clearInterval(clockTimer);
    if (audioEl) {
      audioEl.pause();
      audioEl = null;
    }
  });
});
</script>

<style scoped>
/* ── CSS variables per season ──────────────────────────────────────────────── */
.observatory {
  --accent: #b5bcc6;
  --accent-rgb: 181, 188, 198;
  --glow: rgba(181, 188, 198, 0.15);
  --horizon: #0e0a2a;
  --bg-top: #000005;
  --particle-glow: rgba(255, 255, 255, 0.4);
}
.observatory.spring {
  --accent: #ffb7c5;
  --accent-rgb: 255, 183, 197;
  --glow: rgba(255, 183, 197, 0.18);
  --horizon: #0d1a10;
  --bg-top: #010204;
  --particle-glow: rgba(255, 183, 197, 0.4);
}
.observatory.summer {
  --accent: #ffd764;
  --accent-rgb: 255, 215, 100;
  --glow: rgba(255, 215, 100, 0.18);
  --horizon: #0a1020;
  --bg-top: #020304;
  --particle-glow: rgba(255, 228, 77, 0.4);
}
.observatory.autumn {
  --accent: #cd853f;
  --accent-rgb: 205, 133, 63;
  --glow: rgba(205, 133, 63, 0.18);
  --horizon: #1a0e06;
  --bg-top: #040200;
  --particle-glow: rgba(205, 133, 63, 0.4);
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
    background 3s ease;
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
  height: 45%;
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
  animation: twinkle var(--dur, 3s) ease-in-out var(--delay, 0s) infinite alternate;
}

@keyframes twinkle {
  from {
    opacity: var(--op, 0.3);
    transform: scale(1);
  }
  to {
    opacity: calc(var(--op, 0.3) * 0.25);
    transform: scale(0.6);
  }
}

/* ── Shooting stars ─────────────────────────────────────────────────────────── */
.shooting-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.shooting-star {
  position: absolute;
  width: 100px;
  height: 1.5px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.9) 50%,
    transparent 100%
  );
  border-radius: 2px;
  opacity: 0;
  transform: rotate(-30deg);
  animation: shoot var(--dur, 1s) linear var(--delay, 0s) infinite;
}

@keyframes shoot {
  0% {
    opacity: 0;
    transform: translateX(0) translateY(0) rotate(-30deg);
  }
  5% {
    opacity: 1;
  }
  60% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    transform: translateX(300px) translateY(150px) rotate(-30deg);
  }
}

/* ── Constellation SVG ──────────────────────────────────────────────────────── */
.constellation-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  animation: constellationPulse 8s ease-in-out infinite alternate;
}

.constellation line {
  stroke: #b5bcc6;
  stroke-width: 0.3;
  stroke-linecap: round;
}

.constellation circle {
  fill: #b5bcc6;
}

@keyframes constellationPulse {
  from { opacity: 1; }
  to { opacity: 0.4; }
}

/* ── Moon button ───────────────────────────────────────────────────────────── */
.moon-btn {
  position: absolute;
  top: 8%;
  right: 8%;
  width: 90px;
  height: 110px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.moon-disk {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #b5bcc6;
  overflow: hidden;
  clip-path: circle(40px at center);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
  box-shadow: 0 0 30px rgba(var(--accent-rgb), 0.1);
}

.moon-btn:hover .moon-disk {
  transform: scale(1.1);
  box-shadow: 0 0 40px rgba(var(--accent-rgb), 0.3);
}

.moon-texture {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  opacity: 0.6;
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
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  opacity: 0.85;
  white-space: nowrap;
  transition: color 3s ease;
}

/* ── Live clock ─────────────────────────────────────────────────────────────── */
.clock-display {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  z-index: 20;
  pointer-events: none;
}

.clock-time {
  font-size: 2.8rem;
  color: rgba(var(--accent-rgb), 0.85);
  letter-spacing: 0.1em;
  font-weight: 400;
  text-shadow: 0 0 40px rgba(var(--accent-rgb), 0.35);
  transition: color 3s ease, text-shadow 3s ease;
  line-height: 1;
}

.clock-date {
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
}

/* ── Season switcher ────────────────────────────────────────────────────────── */
.season-switcher {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.4rem;
  z-index: 20;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 3rem;
  padding: 0.3rem;
  backdrop-filter: blur(16px);
}

.season-pill {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  border: 1px solid transparent;
  border-radius: 2rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

.season-pill:hover {
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.06);
}

.season-pill.active {
  background: rgba(var(--accent-rgb), 0.15);
  border-color: rgba(var(--accent-rgb), 0.35);
  color: var(--accent);
}

.pill-name {
  font-size: 0.65rem;
}

/* ── Sound toggle ────────────────────────────────────────────────────────────── */
.sound-btn {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  transition: border-color 0.3s ease, background 0.3s ease, transform 0.2s ease;
}

.sound-btn:hover {
  background: rgba(var(--accent-rgb), 0.15);
  border-color: rgba(var(--accent-rgb), 0.35);
  transform: scale(1.1);
}

.sound-icon {
  font-size: 1.1rem;
  line-height: 1;
}

/* ── Info panel ────────────────────────────────────────────────────────────── */
.info-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(400px, 92vw);
  background: rgba(4, 4, 14, 0.92);
  border: 1px solid rgba(var(--accent-rgb), 0.15);
  backdrop-filter: blur(28px) saturate(160%);
  border-radius: 1.5rem;
  padding: 2.25rem;
  z-index: 50;
  color: #e8e8f0;
  box-shadow:
    0 0 80px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition: border-color 3s ease;
}

.panel-close {
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.panel-close:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.panel-moon-mini {
  display: flex;
  justify-content: center;
  margin-bottom: 1.1rem;
}

.mini-disk {
  position: relative;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: #b5bcc6;
  overflow: hidden;
  clip-path: circle(31px at center);
  box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.2);
}

.panel-title {
  text-align: center;
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin: 0 0 1.5rem;
  transition: color 3s ease;
}

.panel-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.4rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-label {
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  width: 100px;
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
  background: linear-gradient(90deg, rgba(var(--accent-rgb), 0.5), var(--accent));
  border-radius: 2px;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-value {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.65);
  text-align: right;
  min-width: 50px;
}

.panel-desc {
  font-size: 0.85rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.42);
  text-align: center;
  font-style: italic;
  margin: 0 0 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding-top: 1.1rem;
}

.panel-footer {
  text-align: center;
}

.footer-hint {
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(var(--accent-rgb), 0.5);
}

/* Panel transition */
.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translate(-50%, calc(-50% + 16px)) scale(0.96);
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
    0 0 12px rgba(255, 255, 255, 0.5);
  transform: rotate(var(--rot, 0deg));
  transition: all 0.3s ease;
  filter: blur(0.3px);
}
.snow-inner.hovered {
  transform: scale(2.8) rotate(calc(var(--rot, 0deg) + 180deg));
  box-shadow:
    0 0 20px #fff,
    0 0 40px rgba(255, 255, 255, 0.7);
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
    0 0 22px rgba(255, 228, 77, 0.5);
  filter: blur(0.8px);
  transition: all 0.3s ease;
}
.fire-inner.hovered {
  transform: scale(3.5);
  opacity: 1 !important;
  box-shadow:
    0 0 24px #ffe44d,
    0 0 50px rgba(255, 228, 77, 0.9);
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
  box-shadow: 0 0 6px rgba(255, 183, 197, 0.3);
  transition: all 0.3s ease;
}
.petal-inner.hovered {
  transform: scale(1.8) rotate(calc(var(--rot, 0deg) + 45deg));
  filter: brightness(1.5);
  box-shadow: 0 0 14px rgba(255, 183, 197, 0.7);
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
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
  filter: drop-shadow(0 0 4px rgba(205, 133, 63, 0.3));
}
.leaf-inner.hovered {
  transform: scale(1.5) rotate(calc(var(--rot, 0deg) + 30deg));
  filter: brightness(1.4) drop-shadow(0 0 8px rgba(205, 133, 63, 0.6));
}

/* Ground layers */
.ground-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  pointer-events: none;
}
.snow-ground {
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.04) 40%,
    transparent
  );
}
.leaf-ground {
  background: linear-gradient(
    to top,
    rgba(139, 69, 19, 0.22) 0%,
    rgba(139, 69, 19, 0.08) 40%,
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
    transform: translateY(105vh) translateX(var(--drift, 60px)) rotate(540deg);
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
  50% {
    transform: translateY(52vh) translateX(calc(var(--drift, 120px) * 0.6)) rotate(360deg);
    opacity: 0.85;
  }
  100% {
    transform: translateY(105vh) translateX(var(--drift, 120px)) rotate(720deg);
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
  50% {
    transform: translateY(52vh) translateX(calc(var(--drift, -100px) * 0.5)) rotate(210deg);
    opacity: 0.9;
  }
  100% {
    transform: translateY(105vh) translateX(var(--drift, -100px)) rotate(420deg);
    opacity: 0;
  }
}

@keyframes fireflyFloat {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.35;
  }
  20% {
    transform: translate(28px, -22px) scale(1.15);
    opacity: 0.9;
  }
  40% {
    transform: translate(-22px, 16px) scale(0.88);
    opacity: 0.5;
  }
  60% {
    transform: translate(16px, 28px) scale(1.1);
    opacity: 0.75;
  }
  80% {
    transform: translate(-12px, -14px) scale(0.95);
    opacity: 0.45;
  }
}

/* ── Responsive ────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .moon-btn {
    top: 5%;
    right: 5%;
    width: 70px;
    height: 90px;
  }
  .moon-disk {
    width: 62px;
    height: 62px;
    clip-path: circle(31px at center);
  }
  .clock-time {
    font-size: 2rem;
  }
  .season-switcher {
    top: auto;
    bottom: 7rem;
    left: 50%;
    transform: translateX(-50%);
  }
  .pill-name {
    display: none;
  }
  .season-pill {
    padding: 0.35rem 0.6rem;
  }
  .sound-btn {
    bottom: 1.5rem;
    right: 1.5rem;
  }
  .clock-display {
    bottom: 3.5rem;
  }
}

@media (max-width: 480px) {
  .clock-time {
    font-size: 1.6rem;
  }
}
</style>
