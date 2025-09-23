<template>
  <div class="home" @mousemove="updateCursorPosition">
    <!-- Falling Stars Background -->
    <div class="stars-container">
      <div class="stars">
        <span
          v-for="n in 30"
          :key="n"
          :style="getStarStyle(n)"
          @mouseenter="activateGlowCursor"
          class="star"
        ></span>
      </div>
    </div>

    <!-- Glow Cursor -->
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

          <!-- Hidden elements that appear when cursor hovers over them -->
          <div class="hidden-elements">
            <div
              class="hidden-item"
              :class="{ revealed: isElementRevealed(0) }"
              style="top: 30%; left: 20%"
            >
              <span>HTML5</span>
            </div>
            <div
              class="hidden-item"
              :class="{ revealed: isElementRevealed(1) }"
              style="top: 60%; left: 70%"
            >
              <span>CSS3</span>
            </div>
            <div
              class="hidden-item"
              :class="{ revealed: isElementRevealed(2) }"
              style="top: 40%; left: 80%"
            >
              <span>JavaScript</span>
            </div>
            <div
              class="hidden-item"
              :class="{ revealed: isElementRevealed(3) }"
              style="top: 70%; left: 30%"
            >
              <span>Vue.js</span>
            </div>
            <div
              class="hidden-item"
              :class="{ revealed: isElementRevealed(4) }"
              style="top: 50%; left: 50%"
            >
              <span>Nuxt 3</span>
            </div>
          </div>

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
import { ref, onMounted, onUnmounted } from "vue";

const isCursorGlowing = ref(false);
const cursorX = ref(0);
const cursorY = ref(0);
const revealedElements = ref([]);

const cursorStyle = computed(() => ({
  left: `${cursorX.value}px`,
  top: `${cursorY.value}px`,
}));

const activateGlowCursor = () => {
  isCursorGlowing.value = "glow";

  // Star glow lasts 1.5s
  setTimeout(() => {
    isCursorGlowing.value = "flashlight";
  }, 1500);
};

// Generate random properties for more natural stars
const getStarStyle = (index) => {
  const size = Math.random() * 3 + 1;
  const opacity = Math.random() * 0.7 + 0.3;
  const animationDuration = Math.random() * 10 + 3 + "s";
  const animationDelay = Math.random() * 5 + "s";
  const left = Math.random() * 100 + "%";
  const trailLength = Math.floor(Math.random() * 100 + 150) + "px";

  return {
    width: `${size}px`,
    height: `${size}px`,
    opacity: opacity,
    animationDuration: animationDuration,
    animationDelay: animationDelay,
    left: left,
    "--trailLength": trailLength,
  };
};

// Track cursor position
const updateCursorPosition = (event) => {
  cursorX.value = event.clientX;
  cursorY.value = event.clientY;

  // Check if cursor is over any hidden elements
  checkHiddenElements();
};

// Check if cursor is over hidden elements
const checkHiddenElements = () => {
  if (isCursorGlowing.value !== "flashlight") return;

  const hiddenItems = document.querySelectorAll(".hidden-item");
  const cursorRadius = 100; // flashl

  hiddenItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance between cursor and element center
    const distance = Math.sqrt(
      Math.pow(centerX - cursorX.value, 2) +
        Math.pow(centerY - cursorY.value, 2)
    );

    // If cursor is close enough, reveal the element
    if (distance < cursorRadius) {
      if (!revealedElements.value.includes(index)) {
        revealedElements.value.push(index);
      }
    }
  });
};

// Check if element should be revealed
const isElementRevealed = (index) => {
  return revealedElements.value.includes(index);
};

// Refs for text animation elements
const introText = ref(null);
const name = ref(null);
const role = ref(null);

onMounted(() => {
  // Add cursor tracking
  window.addEventListener("mousemove", updateCursorPosition);

  // Animate elements when component is mounted
  setTimeout(() => {
    if (introText.value) introText.value.classList.add("animate");
  }, 500);

  setTimeout(() => {
    if (name.value) name.value.classList.add("animate");
  }, 1500);

  setTimeout(() => {
    if (role.value) role.value.classList.add("animate");
  }, 2500);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", updateCursorPosition);
});

// Add loaded class to content after all animations complete
onMounted(() => {
  setTimeout(() => {
    document.querySelector(".content")?.classList.add("loaded");
  }, 3000);
});
</script>

<style lang="scss" scoped>
$text-color: #fff;
$transition-speed: 0.3s;
$primary-color: #4fc08d;

.home {
  position: relative;
  overflow: hidden;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #0d0d1a, #000);
  cursor: none; /* Hide default cursor */
}

/* Falling Stars Container */
.stars-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 1;
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;

  span {
    position: absolute;
    top: -20px; // Start above the screen
    width: 2px;
    height: 2px;
    background: #fff;
    border-radius: 50%;
    opacity: 0;
    box-shadow: 0 0 6px #fff, 0 0 12px rgba(255, 255, 255, 0.7);
    animation-name: fall;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    transition: all 0.5s ease;
    cursor: none;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: var(--trailLength, 200px);
      height: 1px;
      background: linear-gradient(
        90deg,
        #fff,
        rgba(255, 255, 255, 0.7),
        transparent
      );
      transform: translateY(-50%) rotate(45deg);
      transform-origin: left center;
      opacity: 0;
      animation: trailFade var(--animationDuration) linear infinite
        var(--animationDelay);
      pointer-events: none;
    }

    /* Star glow effect on hover */
    &:hover {
      transform: scale(3);
      opacity: 1 !important;
      box-shadow: 0 0 20px #fff, 0 0 40px #4fc08d, 0 0 60px #4fc08d;
      background: #fff;
      z-index: 10;
    }
  }

  @keyframes fall {
    0% {
      transform: translateY(0) translateX(0) rotate(45deg);
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(120vh) translateX(-60vw) rotate(45deg);
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
}

/* Glow Cursor */
.glow-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: all 0.3s ease;

  &.glow {
    opacity: 1;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      #fff 20%,
      rgba(79, 192, 141, 0.5) 60%,
      transparent 100%
    );
    box-shadow: 0 0 30px #4fc08d, 0 0 60px rgba(79, 192, 141, 0.6);
  }

  &.flashlight {
    opacity: 1;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0.1) 60%,
      transparent 100%
    );
    mix-blend-mode: screen;
    box-shadow: 0 0 80px rgba(79, 192, 141, 0.8);
  }
}

/* Hidden elements that appear when cursor hovers over them */
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
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.5s ease;
  padding: 10px 15px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(79, 192, 141, 0.3);

  span {
    color: #4fc08d;
    font-size: 1rem;
    font-weight: bold;
  }

  &.revealed {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 15px rgba(79, 192, 141, 0.5);
  }
}

/* Content */
.content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: $text-color;
  font-family: "Kdam Thmor Pro", sans-serif;
  padding: 2rem;
}

/* Animated Intro Text */
.intro-text {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;

  &.animate {
    opacity: 0.9;
    transform: translateY(0);
  }
}

/* Animated Name with Gradient */
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

  &.animate {
    opacity: 1;
    transform: translateY(0);
    animation: textShine 3s ease-in-out infinite alternate,
      float 6s ease-in-out infinite;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      $primary-color,
      transparent
    );
    opacity: 0.7;
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.5s ease;
  }

  &.animate::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
}

@keyframes textShine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

/* Animated Role */
.role {
  font-size: 2rem;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateX(-50px);
  transition: opacity 1s ease, transform 1s ease;

  &.animate {
    opacity: 0.8;
    transform: translateX(0);
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

/* Buttons */
.button-group {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1s ease 1.5s, transform 1s ease 1.5s;

  .content.loaded & {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
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
  transition: all $transition-speed;
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
</style>
