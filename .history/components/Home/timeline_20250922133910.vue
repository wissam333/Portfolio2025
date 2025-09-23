<template>
  <UiVortex
    background-color="black"
    :particle-count="70"
    :base-hue="60"
    :hue-variation="80"
    :saturation="90"
    :lightness="60"
    :glow-strength="1.2"
    class=""
  >
    <!-- SCENE LAYERS (pure HTML/CSS) -->
    <div class="scene">
      <!-- Moon -->
      <div class="moon" aria-hidden="true">
        <div class="moon-crater crater-a"></div>
        <div class="moon-crater crater-b"></div>
      </div>

      <!-- Distant stars (subtle) -->
      <div class="distant-stars" aria-hidden="true">
        <span style="--x:8%; --y:12%; --s:.9;"></span>
        <span style="--x:34%; --y:6%; --s:.6;"></span>
        <span style="--x:62%; --y:18%; --s:.7;"></span>
        <span style="--x:84%; --y:10%; --s:.5;"></span>
      </div>

      <!-- Fog / Horizon -->
      <div class="horizon-fog" aria-hidden="true"></div>

      <!-- Tree silhouettes using inline SVG (pure markup, no images) -->
      <div class="trees" aria-hidden="true">
        <svg viewBox="0 0 1200 240" preserveAspectRatio="xMidYMax slice" role="img">
          <path d="M0,180 C70,140 120,120 200,160 C260,185 320,135 380,150 C440,165 540,120 620,150 C700,180 760,140 820,160 C880,180 960,140 1020,150 C1080,160 1160,120 1200,170 L1200,240 L0,240 Z" />
          <!-- Add a few tree trunks / shapes -->
          <g class="tree">
            <rect x="120" y="140" width="8" height="40" rx="2"></rect>
            <circle cx="124" cy="128" r="22"></circle>
          </g>
          <g class="tree" transform="translate(520,10) scale(1.05)">
            <rect x="120" y="140" width="8" height="42" rx="2"></rect>
            <circle cx="124" cy="120" r="26"></circle>
          </g>
          <g class="tree" transform="translate(890,5) scale(.95)">
            <rect x="120" y="140" width="8" height="36" rx="2"></rect>
            <circle cx="124" cy="122" r="20"></circle>
          </g>
        </svg>
      </div>

      <!-- Tall grass foreground (pure CSS blades) -->
      <div class="grass" aria-hidden="true">
        <span class="blade" style="--i:0; --h:20px; --l:6%; --r:2%;"></span>
        <span class="blade" style="--i:1; --h:34px; --l:12%; --r:1%;"></span>
        <span class="blade" style="--i:2; --h:28px; --l:20%; --r:3%;"></span>
        <span class="blade" style="--i:3; --h:40px; --l:28%; --r:2%;"></span>
        <span class="blade" style="--i:4; --h:22px; --l:36%; --r:1%;"></span>
        <span class="blade" style="--i:5; --h:44px; --l:46%; --r:.5%;"></span>
        <span class="blade" style="--i:6; --h:32px; --l:58%; --r:3%;"></span>
        <span class="blade" style="--i:7; --h:26px; --l:68%; --r:2%;"></span>
        <span class="blade" style="--i:8; --h:36px; --l:78%; --r:1%;"></span>
        <span class="blade" style="--i:9; --h:30px; --l:88%; --r:2%;"></span>
      </div>
    </div>

    <!-- Your existing content -->
    <section class="experience-section">
      <h2 class="headline">Experience & Learning Journey</h2>

      <Timeline :value="events" align="alternate" class="custom-timeline">
        <!-- ... existing timeline templates ... -->
      </Timeline>

      <!-- Floating decorative particles -->
      <div class="experience-stars">
        <span
          v-for="n in 30"
          :key="n"
          class="star"
          :style="getStarStyle(n)"
        ></span>
      </div>
    </section>
  </UiVortex>
</template>

<style scoped lang="scss">
/* ----- Scene base (behind content) ----- */
.scene {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0; /* keep behind .experience-section (which is z-index:10) */
  overflow: hidden;
}

/* ----- Moon ----- */
.moon {
  position: absolute;
  top: 6%;
  right: 8%;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fffde7 0%, #fff8b8 18%, #f0e88a 36%, rgba(208,200,140,0.15) 65%, transparent 100%);
  box-shadow: 0 0 60px rgba(255, 248, 190, 0.18), 0 0 120px rgba(180, 230, 140, 0.06);
  transform: translateZ(0);
  animation: moonFloat 8s ease-in-out infinite;
  opacity: 0.95;
  mix-blend-mode: screen;
}

/* small moon crater accents */
.moon-crater {
  position: absolute;
  background: rgba(0,0,0,0.06);
  border-radius: 50%;
  filter: blur(0.6px);
}
.crater-a { width: 18px; height: 18px; left: 32%; top: 34%; }
.crater-b { width: 10px; height: 10px; left: 58%; top: 48%; }

@keyframes moonFloat {
  0% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(4px) translateX(-2px); }
  100% { transform: translateY(0) translateX(0); }
}

/* ----- Distant stars (very subtle) ----- */
.distant-stars span {
  position: absolute;
  width: calc(1.5px * var(--s));
  height: calc(1.5px * var(--s));
  left: var(--x);
  top: var(--y);
  background: rgba(255,255,255,0.85);
  border-radius: 50%;
  opacity: 0.7;
  filter: blur(.6px);
  transform: translate(-50%, -50%);
  animation: starTwinkle calc(6s * var(--s)) ease-in-out infinite;
}
@keyframes starTwinkle {
  0% { opacity: .25; transform: scale(.6); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: .25; transform: scale(.6); }
}

/* ----- Horizon fog ----- */
.horizon-fog {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 40%;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(3,6,8,0.25) 30%, rgba(2,4,6,0.6) 60%, rgba(0,0,0,1) 100%);
  z-index: 1;
  mix-blend-mode: normal;
  pointer-events: none;
}

/* ----- Trees SVG silhouette ----- */
.trees {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 38%;
  z-index: 2;
  transform-origin: center bottom;
  animation: treesSway 10s ease-in-out infinite;
}

.trees svg {
  width: 100%;
  height: 100%;
  display: block;
}

.trees svg path,
.trees svg rect,
.trees svg circle {
  fill: #030405; /* silhouette color */
  stroke: none;
  opacity: 0.98;
  filter: drop-shadow(0 6px 18px rgba(0,0,0,0.6));
}

/* subtle slow sway */
@keyframes treesSway {
  0% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-1px) translateX(-2px); }
  100% { transform: translateY(0) translateX(0); }
}

/* ----- Tall grass foreground ----- */
.grass {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16%;
  z-index: 3;
  display: block;
  pointer-events: none;
}

/* single blade (repeated spans) */
.grass .blade {
  position: absolute;
  bottom: -2px; /* overlap with horizon */
  left: var(--l);
  right: var(--r);
  width: calc(var(--h) / 6);
  height: var(--h);
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%);
  border-radius: 999px 999px 10px 10px;
  transform-origin: bottom center;
  opacity: 0.95;
  box-shadow: 0 0 16px rgba(0,0,0,0.3) inset;
  animation: bladeSway calc(5s + var(--i) * .3s) ease-in-out infinite;
}

/* create a 'leaf' shape using pseudo elements for each blade */
.grass .blade::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 8%;
  transform: translateX(-50%) rotate(-12deg);
  width: 100%;
  height: 60%;
  border-radius: 50% 50% 0 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.35));
  filter: blur(.3px);
  opacity: 0.6;
}

@keyframes bladeSway {
  0% { transform: rotate(-2deg); }
  50% { transform: rotate(6deg); }
  100% { transform: rotate(-2deg); }
}

/* ----- Keep timeline & cards on top ----- */
.experience-section {
  position: relative;
  z-index: 10; /* ensures content sits above scenery */
}

/* optional: slight ambient glow near horizon to make fireflies pop */
.scene::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 8%;
  height: 20%;
  background: radial-gradient(50% 30% at 50% 100%, rgba(140,200,120,0.06), rgba(20,30,20,0.0) 60%);
  z-index: 4;
  pointer-events: none;
}

/* small responsive adjustments */
@media (max-width: 768px) {
  .moon { width: 84px; height: 84px; top: 8%; right: 6%; }
  .trees { height: 34%; }
  .grass { height: 18%; }
}
</style>

<script setup>
import Timeline from "primevue/timeline";
import Card from "primevue/card";

const events = ref([
  {
    title: "Start Journey",
    date: "2018",
    icon: "mdi:briefcase-account",
    color: "#9C27B0",
    description: "Started learning web basics, discovered passion for coding.",
  },
  {
    title: "Learning JS",
    date: "2019",
    icon: "mdi:code",
    color: "#673AB7",
    description: "Learned JavaScript, Pascal, and C++ basics.",
  },
  {
    title: "University & SQL",
    date: "2020",
    icon: "mdi:database",
    color: "#FF9800",
    description: "Studied SQL, C++, Java, Sass, Bootstrap, JS DOM/BOM.",
  },
  {
    title: "First Job",
    date: "2021",
    icon: "mdi:briefcase",
    color: "#607D8B",
    description: "Learned Vue 2 and worked at Dr Social Company.",
  },
  {
    title: "Vue 3 & Freelancing",
    date: "2022",
    icon: "mdi:remote-desktop",
    color: "#9C27B0",
    description: "Worked as freelancer, plan to master Nuxt & backend skills.",
  },
  {
    title: "Remote Work",
    date: "2023",
    icon: "mdi:code-brackets",
    color: "#a89233",
    description: "Worked as Vue developer for 3 companies.",
  },
  {
    title: "FSIT Company",
    date: "2024",
    icon: "mdi:code-braces",
    color: "#59bc90",
    description: "Worked as Nuxt developer at FSIT company for 1.5 years.",
  },
]);

const getStarStyle = (n) => {
  const size = Math.random() * 5 + 3;
  return {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, rgba(255,255,255,${Math.random()}) 0%, transparent 70%)`,
    animationDuration: `${Math.random() * 5 + 3}s`,
  };
};
</script>

