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
          <p class="intro-text" data-aos="fade-up" data-aos-delay="200">
            Hi, I'm
          </p>

          <p class="name" data-aos="fade-up" data-aos-delay="600">
            Wissam Najjom
          </p>

          <p class="role" data-aos="fade-up" data-aos-delay="1000">
            Front End Developer
          </p>

          <div class="button-group">
            <router-link
              to="/contact"
              class="btn btn-secondary"
              data-aos="flip-right"
              data-aos-delay="1400"
              >Contact Me</router-link
            >
            <a
              href="https://github.com/wissam333/Portfolio/raw/gh-pages/CV-New.pdf"
              download="Wissam_CV.pdf"
              data-aos="flip-left"
              data-aos-delay="1400"
              class="btn btn-secondary"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>
    </main>

    <div class="hidden-elements-container" id="hiddenPage">
      <div class="hidden-item" style="top: 10px; inset-inline-start: 10px">
        <img src="/gotMe.gif" alt="got Me" class="gotMe" />

        <CelebrationParticles ref="celebration"></CelebrationParticles>
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
let counted = false; // prevent multiple additions
let celebration = ref(null);
onMounted(() => {
  const gif = document.querySelector(".gotMe");

  const checkHover = (e) => {
    if (!gif || counted || isCursorGlowing.value !== "flashlight") return;

    const rect = gif.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    ) {
      useEasterEggs().value.push(2);
      counted = true;
      celebration.value?.triggerParticles(40);
    }
  };

  window.addEventListener("mousemove", checkHover);
  onUnmounted(() => {
    window.removeEventListener("mousemove", checkHover);
  });
});

/* ---------- Cursor + reveal state ---------- */
const isCursorGlowing = ref(false); // false | 'glow' | 'flashlight'
const cursorX = ref(window.innerWidth / 2);
const cursorY = ref(window.innerHeight / 2);
const cursorStyle = computed(() => ({
  left: `${cursorX.value}px`,
  top: `${cursorY.value}px`,
}));

// hovered star index (pauses only that star and adds hover visuals)
const hoveredStar = ref(null);
let glowTimeout = null;

/* ---------- Stars: pre-generate once so they don't change on re-render ---------- */
const stars = ref([]);

function createStars(count = 40) {
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
  isCursorGlowing.value = "glow"; // small glow first

  if (!useEasterEggs().value.find((e) => e == 1)) {
    useEasterEggs().value.push(1);
  }

  // after 1s upgrade to flashlight
  glowTimeout = setTimeout(() => {
    isCursorGlowing.value = "flashlight";

    // show all hidden items permanently
    document.getElementById("hiddenPage").classList.add("lit");
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

const updateCursor = (e) => {
  const x = e.clientX || e.touches[0].clientX;
  const y = e.clientY || e.touches[0].clientY;

  const container = document.getElementById("hiddenPage");
  container.style.setProperty("--cursorX", x + "px");
  container.style.setProperty("--cursorY", y + "px");
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
  background: rgba(255, 255, 255, 0.6); // brighter small dot
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.25); // subtle halo
  transition: width 0.28s ease, height 0.28s ease, background 0.28s ease,
    box-shadow 0.28s ease, opacity 0.28s ease;
  opacity: 1;
}

.glow-cursor.glow {
  width: 160px;
  height: 160px;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.4) 0%,
    // brighter core
    rgba(255, 255, 255, 0.1) 60%,
    // smooth fade
    transparent 100%
  );
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.15); // stronger glow
  mix-blend-mode: screen;
}

.glow-cursor.flashlight {
  width: 240px;
  height: 240px;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.6) 0%,
    // bright core
    rgba(255, 255, 255, 0.1) 70%,
    // smooth falloff
    transparent 100%
  );
  box-shadow: 0 0 80px rgba(255, 255, 255, 0.2); // volumetric glow
  mix-blend-mode: screen;
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
  background: linear-gradient(
    90deg,
    #246145a4 0%,
    #64ffda 40%,
    #59bc90,
    #64ffda
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textShine 4s linear infinite;
  @media (max-width: 991px) {
    font-size: 2rem;
  }
}

@keyframes textShine {
  100% {
    background-position: 200% center;
  }
}

.name.animate {
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
  @media (max-width: 991px) {
    font-size: 1rem;
  }
}

/* Buttons  */
.button-group {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  transition: opacity 1s ease 1.5s, transform 1s ease 1.5s;
  @media (max-width: 991px) {
    gap: 0.75rem;
  }
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

  @media (max-width: 768px) {
    padding: 0.4rem 1rem;
    font-size: 0.6rem;
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
  background: url("/1.png");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: absolute;
  --cursorX: 50vw;
  --cursorY: 50vh;
  width: 100%;
  height: 100%;
  // pointer-events: none; // cursor passes through
  z-index: 0;
  opacity: 0;
  transition: all 0.3s ease;

  .hidden-item {
    position: absolute;
    border-radius: 20px;
    transition: all 0.3s ease;
    opacity: 0;
    pointer-events: auto;

    .gotMe {
      width: 200px;
      transition: 0.5s ease-in-out;
      @media (max-width: 768px) {
        width: 100px;
      }
    }
  }
}

/* Flashlight effect */
.hidden-elements-container::before {
  content: "";
  display: block;
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    circle 12vmax at var(--cursorX) var(--cursorY),
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 70%,
    rgba(0, 0, 0, 0.95) 100%
  );
  z-index: 4; // below hidden items
}

/* All items visible after flashlight appears */
.hidden-elements-container.lit {
  opacity: 1;
  .hidden-item {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
