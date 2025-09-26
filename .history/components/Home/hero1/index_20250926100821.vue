<template>
  <div class="home">
    <HomeHero1StarsBackground
      :stars="stars"
      :hovered-star="hoveredStar"
      @star-enter="onStarEnter"
      @star-leave="onStarLeave"
      @star-tap="onStarTap"
    />

    <HomeHero1GlowCursor
      :is-cursor-glowing="isCursorGlowing"
      :cursor-style="cursorStyle"
    />

    <HomeHero1MainContent ref="contentContainer" />

    <HomeHero1HiddenElements
      :is-cursor-glowing="isCursorGlowing"
      :flashlight-active="flashlightActive"
      ref="celebration"
    />

    <HomeHero1MountainsBackground />
  </div>
</template>

<script setup>
// Reactive data
const isCursorGlowing = ref(false);
const hoveredStar = ref(null);
const flashlightActive = ref(false);
const cursorX = ref(window.innerWidth / 2);
const cursorY = ref(window.innerHeight / 2);
const contentContainer = ref(null);
const celebration = ref(null);

// Computed
const cursorStyle = computed(() => ({
  left: `${cursorX.value}px`,
  top: `${cursorY.value}px`,
}));

// Stars generation
const stars = ref([]);
function createStars(count = 40) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    const size = +(Math.random() * 5 + 1).toFixed(2);
    const opacity = +(Math.random() * 0.7 + 0.3).toFixed(2);
    const animationDuration = (Math.random() * 8 + 6).toFixed(2) + "s";
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

// Event handlers
const onStarEnter = (index) => {
  hoveredStar.value = index;
  isCursorGlowing.value = "glow";
  flashlightActive.value = true;

  if (!useEasterEggs().value.find((e) => e == 1)) {
    useEasterEggs().value.push(1);
  }

  glowTimeout = setTimeout(() => {
    isCursorGlowing.value = "flashlight";
    document.getElementById("hiddenPage")?.classList.add("lit");
  }, 1000);
};

const onStarLeave = () => {
  hoveredStar.value = null;
};

const onStarTap = (index) => {
  hoveredStar.value = index;
  isCursorGlowing.value = "flashlight";
  flashlightActive.value = true;

  if (!useEasterEggs().value.find((e) => e == 1)) {
    useEasterEggs().value.push(1);
  }

  setTimeout(() => {
    hoveredStar.value = null;
  }, 1000);
};

// Cursor animation
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let glowTimeout = null;

const animateCursor = () => {
  cursorX.value += (targetX - cursorX.value) * 0.2;
  cursorY.value += (targetY - cursorY.value) * 0.2;
  requestAnimationFrame(animateCursor);
};

const updateCursor = (e) => {
  const x = e.clientX || (e.touches && e.touches[0].clientX);
  const y = e.clientY || (e.touches && e.touches[0].clientY);

  if (x && y) {
    targetX = x;
    targetY = y;

    const container = document.getElementById("hiddenPage");
    if (container) {
      container.style.setProperty("--cursorX", targetX + "px");
      container.style.setProperty("--cursorY", targetY + "px");
    }
  }
};

// Scroll handling
const handleScroll = () => {
  if (contentContainer.value?.$el) {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    if (scrollPosition > windowHeight * 0.9) {
      isCursorGlowing.value = false;
      flashlightActive.value = false;
    }

    const moveAmount =
      (scrollPosition - contentContainer.value.$el.offsetTop) * 0.4;
    contentContainer.value.$el.style.transform = `translateY(${moveAmount}px)`;
  }
};

// Lifecycle
onMounted(() => {
  stars.value = createStars(30);
  window.addEventListener("mousemove", updateCursor);
  window.addEventListener("touchmove", updateCursor);
  window.addEventListener("scroll", handleScroll);
  animateCursor();
});

onUnmounted(() => {
  window.removeEventListener("mousemove", updateCursor);
  window.removeEventListener("touchmove", updateCursor);
  window.removeEventListener("scroll", handleScroll);
  if (glowTimeout) clearTimeout(glowTimeout);
});
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  overflow: hidden;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #0d0d1a, #000);
  cursor: none;
}
</style>
