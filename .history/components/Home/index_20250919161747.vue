<template>
  <div class="home">
    <!-- Falling Stars Background -->
    <div class="stars-container">
      <div class="stars">
        <div
          v-for="(s, i) in stars"
          :key="i"
          class="star-wrapper"
          :style="{ left: s.left }"
        >
          <!-- .star animates the falling transform (so it can be paused independently) -->
          <div
            class="star"
            :class="{ paused: hoveredStar === i }"
            :style="{
              animationDuration: s.animationDuration,
              animationDelay: s.animationDelay,
            }"
            @mouseenter="onStarEnter(i)"
            @mouseleave="onStarLeave(i)"
          >
            <!-- .star-inner is the visible dot + trail.
                 We pass per-star CSS vars so the pseudo-element trail can use them. -->
            <div
              class="star-inner"
              :class="{ hovered: hoveredStar === i }"
              :style="{
                '--trailLength': s.trailLength,
                '--animationDuration': s.animationDuration,
                '--animationDelay': s.animationDelay,
                '--size': s.size + 'px',
                opacity: s.opacity,
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Glow / Flashlight Cursor -->
    <div
      class="glow-cursor"
      :class="isCursorGlowing"
      :style="cursorStyle"
    ></div>

    <!-- Main content -->
    <main class="content">
      <div class="type_effect">
        <div class="container">
          <p class="intro-text" ref="introText">Hi, I'm</p>

          <p class="name" ref="name">Wissam Najjom</p>

          <p class="role" ref="role">Front End Developer</p>

          <div class="button-group">
            <router-link to="/contact" class="btn btn-primary"
              >Contact Me</router-link
            >
            <a
              href="https://github.com/wissam333/Portfolio/raw/gh-pages/CV-New.pdf"
              download="Wissam_CV.pdf"
              class="btn btn-secondary"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>
    </main>

    <div class="hidden-elements-container">
      <div class="hidden-item" style="top: 30%; left: 20%">
        <span>HTML5</span>
      </div>
      <div class="hidden-item" style="top: 60%; left: 70%">
        <span>CSS3</span>
      </div>
      <div class="hidden-item" style="top: 40%; left: 80%">
        <span>JavaScript</span>
      </div>
      <div class="hidden-item" style="top: 70%; left: 30%">
        <span>Vue.js</span>
      </div>
      <div class="hidden-item" style="top: 50%; left: 50%">
        <span>Nuxt 3</span>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="scroll-indicator">
      <span>Scroll down</span>
      <div class="mouse">
        <div class="wheel"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

/* ---------- Cursor + reveal state ---------- */
const isCursorGlowing = ref(false); // false | 'glow' | 'flashlight'
const cursorX = ref(window.innerWidth / 2);
const cursorY = ref(window.innerHeight / 2);
const cursorStyle = computed(() => ({
  left: `${cursorX.value}px`,
  top: `${cursorY.value}px`,
}));

// Revealed hidden elements (recomputed per mousemove in flashlight mode)
const revealedElements = ref([]);

// hovered star index (pauses only that star and adds hover visuals)
const hoveredStar = ref(null);
let glowTimeout = null;

/* ---------- Stars: pre-generate once so they don't change on re-render ---------- */
const stars = ref([]);

function createStars(count = 30) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    const size = +(Math.random() * 5 + 1).toFixed(2);
    const opacity = +(Math.random() * 0.7 + 0.3).toFixed(2);
    const animationDuration = (Math.random() * 8 + 6).toFixed(2) + "s"; // 6–14s

    const animationDelay = (Math.random() * 5).toFixed(2) + "s";
    const left = Math.random() * 100 + "%";
    const trailLength = Math.floor(Math.random() * 100 + 150) + "px";

    arr.push({
      size,
      opacity,
      animationDuration,
      animationDelay,
      left,
      trailLength,
    });
  }
  return arr;
}

/* ---------- Star hover handlers ---------- */
const onStarEnter = (index) => {
  hoveredStar.value = index;
  isCursorGlowing.value = "glow"; // lighter mode

  // after 1s upgrade to flashlight
  setTimeout(() => {
    isCursorGlowing.value = "flashlight";
  }, 1000);
};

const onStarLeave = () => {
  hoveredStar.value = null;
  // isCursorGlowing.value = false;
};

/* ---------- Cursor tracking (global) ---------- */
const updateCursorPosition = (event) => {
  cursorX.value = event.clientX;
  cursorY.value = event.clientY;

  checkHiddenElements();
};

onMounted(() => {
  // generate stars once
  stars.value = createStars(30);

  window.addEventListener("mousemove", updateCursorPosition);

  // small initial animations for intro text (same as before)
  setTimeout(() => {
    document.querySelector(".intro-text")?.classList.add("animate");
  }, 500);
  setTimeout(() => {
    document.querySelector(".name")?.classList.add("animate");
  }, 1500);
  setTimeout(() => {
    document.querySelector(".role")?.classList.add("animate");
  }, 2500);

  setTimeout(() => {
    document.querySelector(".content")?.classList.add("loaded");
  }, 3000);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", updateCursorPosition);
  if (glowTimeout) clearTimeout(glowTimeout);
});

/* ---------- Hidden-elements detection (only in flashlight mode) ---------- */
const checkHiddenElements = () => {
  if (isCursorGlowing.value !== "flashlight") {
    // hide all
    document.querySelectorAll(".hidden-item").forEach(item => {
      item.classList.remove("revealed");
    });
    return;
  }

  const cursorRadius = 120; // flashlight radius
  document.querySelectorAll(".hidden-item").forEach(item => {
    const rect = item.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.hypot(centerX - cursorX.value, centerY - cursorY.value);

    if (distance < cursorRadius) {
      item.classList.add("revealed");
    } else {
      item.classList.remove("revealed");
    }
  });
};


const updateCursor = (e) => {
  const x = e.clientX || e.touches[0].clientX;
  const y = e.clientY || e.touches[0].clientY;

  document.documentElement.style.setProperty("--cursorX", x + "px");
  document.documentElement.style.setProperty("--cursorY", y + "px");
};

onMounted(() => {
  window.addEventListener("mousemove", updateCursor);
  window.addEventListener("touchmove", updateCursor);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", updateCursor);
  window.removeEventListener("touchmove", updateCursor);
});
</script>

<style lang="scss" scoped>
$text-color: #fff;
$primary-color: #4fc08d;

.home {
  position: relative;
  overflow: hidden;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #0d0d1a, #000);
  cursor: none;
}

/* STARS LAYER */
.stars-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 10;
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;
}

.star-wrapper {
  position: absolute;
  top: 0;
  pointer-events: auto; /* allow hovering the star */
}

.star {
  position: absolute;
  top: -20px;
  left: 0;
  width: 0;
  height: 0;
  will-change: transform;
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.star.paused {
  animation-play-state: paused;
}

.star-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size, 2px);
  height: var(--size, 2px);
  background: #fff;
  border-radius: 50%;
  opacity: 0.9;
  box-shadow: 0 0 6px #fff, 0 0 12px rgba(255, 255, 255, 0.7);
  transform-origin: center center;
  transition: transform 0.28s ease, box-shadow 0.28s ease, opacity 0.28s ease;
}

.star-inner.hovered {
  transform: scale(3);
  opacity: 1 !important;
  box-shadow: 0 0 20px #fff, 0 0 40px #4fc08d, 0 0 60px #4fc08d;
  z-index: 10;
}

@keyframes fall {
  0% {
    transform: translateY(-20px) translateX(0) rotate(45deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(150vh) translateX(-40vw) rotate(45deg);
    opacity: 0;
  }
}

@keyframes trailFade {
  0% {
    opacity: 0;
    width: 0;
  }
  10% {
    opacity: 0.9;
  }
  20% {
    opacity: 0.8;
    width: var(--trailLength, 200px);
  }
  80% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
    width: var(--trailLength, 200px);
  }
}

/* ---------- Glow Cursor ---------- */
.glow-cursor {
  position: fixed;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9999;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  transition: width 0.28s ease, height 0.28s ease, background 0.28s ease,
    box-shadow 0.28s ease, opacity 0.28s ease;
  opacity: 1;
}

.glow-cursor.glow {
  width: 120px;
  height: 120px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.4) 40%,
    transparent 100%
  );
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.9),
    0 0 80px rgba(255, 255, 255, 0.6);
  mix-blend-mode: screen;
}

.glow-cursor.flashlight {
  width: 220px;
  height: 220px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.08) 55%,
    transparent 100%
  );
  box-shadow: 0 0 80px rgba(79, 192, 141, 0.8);
  mix-blend-mode: screen;
}

.hidden-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hidden-item {
  position: absolute;
  opacity: 1;
  transform: scale(0.5);
  transition: all 0.32s ease;
  padding: 10px 15px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(79, 192, 141, 0.18);
  filter: brightness(0) blur(2px);

  span {
    color: #4fc08d;
    font-size: 1rem;
    font-weight: 700;
  }
}

.hidden-item.revealed {
  opacity: 1;
  filter: brightness(1) blur(0);
  transform: scale(1);
  box-shadow: 0 0 18px rgba(79, 192, 141, 0.45);
}

/* ---------- Content  ---------- */
.content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: $text-color;
  font-family: "Kdam Thmor Pro", sans-serif;
  padding: 2rem;
}

.intro-text {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.intro-text.animate {
  opacity: 0.9;
  transform: translateY(0);
}

.name {
  font-size: 4rem;
  font-weight: bold;
  margin: 1rem 0;
  position: relative;
  display: inline-block;
  background: linear-gradient(90deg, #4fc08d, #64ffda, #4fc08d);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1s ease, transform 1s ease;
}
.name.animate {
  opacity: 1;
  transform: translateY(0);
  animation: textShine 3s ease-in-out infinite alternate,
    float 6s ease-in-out infinite;
}
@keyframes textShine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.role {
  font-size: 2rem;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateX(-50px);
  transition: opacity 1s ease, transform 1s ease;
}
.role.animate {
  opacity: 0.8;
  transform: translateX(0);
}

/* Buttons  */
.button-group {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1s ease 1.5s, transform 1s ease 1.5s;
}
.content.loaded .button-group {
  opacity: 1;
  transform: translateY(0);
}
.btn {
  padding: 0.8rem 2rem;
  border: 2px solid $text-color;
  background: transparent;
  color: $text-color;
  font-family: "Kdam Thmor Pro", sans-serif;
  font-size: 1.2rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  .content.loaded & {
    opacity: 1;
    transform: translateY(0);
  }
  @media (max-width: 768px) {
    padding: 0.6rem 1.5rem;
    font-size: 1rem;
  }
  &:hover {
    background: $primary-color;
    border-color: $primary-color;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }
  &:hover::before {
    left: 100%;
  }
}
.btn-primary {
  background: rgba($primary-color, 0.2);
  transition: opacity 1s ease 2s, transform 1s ease 2s, background 0.3s ease;
  &:hover {
    background: $primary-color;
  }
}
.btn-secondary {
  background: transparent;
  transition: opacity 1s ease 2.2s, transform 1s ease 2.2s, background 0.3s ease;
  &:hover {
    background: $primary-color;
  }
}

/* Scroll indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: $text-color;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.7;
  animation: fadeIn 2s ease-out 3s both;
  span {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  .mouse {
    width: 26px;
    height: 42px;
    border: 2px solid $text-color;
    border-radius: 15px;
    position: relative;
    .wheel {
      width: 3px;
      height: 8px;
      background: $text-color;
      border-radius: 50%;
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      animation: scroll 2s infinite;
    }
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.7;
  }
}
@keyframes scroll {
  0% {
    opacity: 0;
    transform: translate(-50%, 0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, 15px);
  }
}

/* some resets so star visuals are crisp */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.hidden-elements-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;

  --cursorX: 50vw;
  --cursorY: 50vh;

  .hidden-item {
    position: absolute;
    opacity: 0; // initially hidden
    transform: scale(0.5);
    transition: all 0.3s ease;
    padding: 10px 15px;
    border-radius: 20px;
    background: rgba(0,0,0,0.7);
    border: 1px solid rgba(79,192,141,0.18);
    color: #4fc08d;
    font-weight: 700;
  }

  .hidden-item.revealed {
    opacity: 1;
    transform: scale(1);
    filter: brightness(1) blur(0);
    box-shadow: 0 0 18px rgba(79,192,141,0.45);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.95); // mostly dark
    pointer-events: none;
  }
}

</style>
