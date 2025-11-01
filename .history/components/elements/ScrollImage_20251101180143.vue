<template>
  <div ref="imageContainer" class="scroll-image">
    <img :src="src" :alt="alt" class="image" loading="lazy" />
  </div>
</template>

<script setup>
// Props to allow dynamic image inputs
const props = defineProps({
  src: String,
  alt: String,
});

const imageContainer = ref(null);
const animationFrameId = ref(null);
const lastScrollY = ref(0);

const handleScroll = () => {
  // Use requestAnimationFrame for smoother performance
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }

  animationFrameId.value = requestAnimationFrame(updateImagePosition);
};

const updateImagePosition = () => {
  if (!imageContainer.value) return;

  const scrollPosition = window.scrollY;

  // Throttle updates by checking if scroll position changed significantly
  if (Math.abs(scrollPosition - lastScrollY.value) < 2) return;

  lastScrollY.value = scrollPosition;

  const offsetTop = imageContainer.value.offsetTop;
  const windowHeight = window.innerHeight;
  const containerHeight = imageContainer.value.clientHeight;

  // Check if element is in viewport with intersection margin
  const isInView =
    scrollPosition + windowHeight > offsetTop - windowHeight &&
    scrollPosition < offsetTop + containerHeight + windowHeight;

  if (isInView) {
    // Calculate how much to move the image based on scroll
    const moveAmount = (scrollPosition - offsetTop) * 0.4;

    // Use transform3d to leverage GPU acceleration
    imageContainer.value.style.transform = `translate3d(0, ${moveAmount}px, 0)`;
  } else {
    // Reset transform when out of view to save resources
    imageContainer.value.style.transform = "translate3d(0, 0, 0)";
  }
};

// Throttled scroll handler with intersection observer as fallback
let scrollTimeout = null;
const throttledScroll = () => {
  if (scrollTimeout) return;

  scrollTimeout = setTimeout(() => {
    handleScroll();
    scrollTimeout = null;
  }, 16); // ~60fps
};

onMounted(() => {
  // Use passive event listener for better scrolling performance
  window.addEventListener("scroll", throttledScroll, { passive: true });

  // Initial position update
  updateImagePosition();
});

onUnmounted(() => {
  window.removeEventListener("scroll", throttledScroll);

  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }

  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
});
</script>

<style scoped lang="scss">
.scroll-image {
  overflow: hidden;
  position: relative;
  height: 800px; /* Adjust as needed */
  /* Enable GPU acceleration */
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;

  @media (max-width: 991px) {
    min-height: auto !important;
    height: 400px; /* Reduced height for mobile */
  }
}

.image {
  width: 100%;
  height: 100%;
  min-height: 800px;
  object-fit: cover;
  /* Remove transition for immediate response to scroll */
  will-change: transform;

  @media (max-width: 991px) {
    min-height: auto !important;
    min-height: 400px; /* Reduced height for mobile */
  }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .scroll-image {
    transform: none !important;
  }

  .image {
    will-change: auto;
  }
}
</style>
