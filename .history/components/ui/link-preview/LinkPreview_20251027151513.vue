<template>
  <div :class="cn('relative inline-block', props.class)" ref="container">
    <!-- Trigger -->
    <NuxtLink
      ref="link"
      :to="url"
      :class="cn('text-black dark:text-white', props.linkClass)"
      @mousemove="handleMouseMove"
      @mouseenter="showPreview"
      @mouseleave="hidePreview"
    >
      <slot />
    </NuxtLink>

    <!-- Preview -->
    <div
      v-if="isVisible"
      ref="preview"
      class="index pointer-events-none fixed z-50"
      :style="previewStyle"
    >
      <div
        class="overflow-hidden rounded-xl shadow-xl"
        :class="[popClass, { 'transform-gpu': !props.isStatic }]"
      >
        <div
          class="block rounded-xl border-2 border-transparent bg-white p-1 shadow-lg dark:bg-gray-900"
        >
          <img
            :src="currentPreviewSrc"
            :width="width"
            :height="height"
            class="size-full rounded-lg"
            :style="imageStyle"
            alt="preview"
            @load="handleImageLoad"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  reactive,
  type CSSProperties,
  onMounted,
  onUnmounted,
} from "vue";
import { cn } from "@/lib/utils";

interface BaseProps {
  class?: string;
  linkClass?: string;
  width?: number;
  height?: number;
}

interface StaticImageProps extends BaseProps {
  isStatic?: true;
  imageSrc?: string;
  url?: string;
}

interface URLPreviewProps extends BaseProps {
  isStatic?: false;
  imageSrc?: string;
  url?: string;
}

type Props = StaticImageProps | URLPreviewProps;
const props = withDefaults(defineProps<Props>(), {
  isStatic: false,
  imageSrc: "",
  url: "",
  width: 200,
  height: 125,
});

const isVisible = ref(false);
const isLoading = ref(true);
const preview = ref<HTMLElement | null>(null);
const link = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const hasPopped = ref(false);
const currentPreviewSrc = ref("");
const highQualityImageLoaded = ref(false);

// Track window size and scroll position
const windowSize = reactive({
  width: typeof window !== "undefined" ? window.innerWidth : 0,
  height: typeof window !== "undefined" ? window.innerHeight : 0,
  scrollX: typeof window !== "undefined" ? window.scrollX : 0,
  scrollY: typeof window !== "undefined" ? window.scrollY : 0,
});

const mousePosition = reactive({
  x: 0,
  y: 0,
});

// Initialize window dimensions safely
onMounted(() => {
  if (typeof window !== "undefined") {
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    window.addEventListener("scroll", updateWindowSize);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", updateWindowSize);
    window.removeEventListener("scroll", updateWindowSize);
  }
});

function updateWindowSize() {
  if (typeof window !== "undefined") {
    windowSize.width = window.innerWidth;
    windowSize.height = window.innerHeight;
    windowSize.scrollX = window.scrollX;
    windowSize.scrollY = window.scrollY;
  }
}

// Get fast-loading favicon
function getFastPreviewUrl(url: string): string {
  if (!url) return "/default-preview.png";

  try {
    const encodedUrl = encodeURIComponent(url);
    // No API key required, but might be slower
    return `https://s0.wp.com/mshots/v1/${encodedUrl}?w=${window.innerWidth}&h=${window.innerHeight}`;
  } catch {
    return "/default-preview.png";
  }
}

// Generate high-quality preview URL
function getHighQualityPreviewUrl(): string {
  if (props.isStatic) return props.imageSrc || "";

  const params = new URLSearchParams({
    url: props.url || "",
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    colorScheme: "light",
    "viewport.isMobile": "false",
    "viewport.deviceScaleFactor": "1",
    "viewport.width": String(window.innerWidth), // Reduced for faster loading
    "viewport.height": String(window.innerHeight),
  });

  return `https://api.microlink.io/?${params.toString()}`;
}

// Initial preview source (fast loading)
const initialPreviewSrc = computed(() => {
  if (props.isStatic) return props.imageSrc;
  return getFastPreviewUrl(props.url || "");
});

// Calculate preview position - EXACTLY YOUR ORIGINAL LOGIC
const previewStyle = computed<CSSProperties>(() => {
  if (!isVisible.value) {
    return { opacity: 0, pointerEvents: "none" };
  }

  const offset = 20;
  const previewWidth = props.width;
  const previewHeight = props.height;

  // Use the link ref directly instead of querying
  const linkEl = link.value;

  try {
    // Get link position relative to viewport
    const linkRect = linkEl.getBoundingClientRect();

    // Calculate X position - center aligned to mouse, but constrained to viewport
    let x = mousePosition.x - previewWidth / 2;

    // Constrain to viewport boundaries with some padding
    const viewportPadding = 10;
    x = Math.max(
      viewportPadding,
      Math.min(x, windowSize.width - previewWidth - viewportPadding)
    );

    // Calculate Y position - above the link element
    let y = linkRect.top - previewHeight - offset;

    // If there's not enough space above, show below the link
    if (y < viewportPadding) {
      y = linkRect.bottom + offset;
    }

    // Ensure Y position stays within viewport
    y = Math.max(
      viewportPadding,
      Math.min(y, windowSize.height - previewHeight - viewportPadding)
    );

    return {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      width: `${previewWidth}px`,
      height: `${previewHeight}px`,
      opacity: 1,
      pointerEvents: "none",
    };
  } catch (error) {
    console.warn("Error calculating preview position:", error);
  }
});

// Image specific styling
const imageStyle = computed<CSSProperties>(() => ({
  width: `200px`,
  height: `auto`,
  objectFit: "contain",
}));

// Pop animation class
const popClass = computed(() => {
  if (!hasPopped.value) return "";
  return "animate-pop";
});

function handleMouseMove(event: MouseEvent) {
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;
}

function showPreview() {
  isVisible.value = true;

  // Reset states
  isLoading.value = true;
  highQualityImageLoaded.value = false;

  // Start with fast-loading favicon
  currentPreviewSrc.value = initialPreviewSrc.value;

  // Small delay to ensure DOM is updated
  setTimeout(() => {
    hasPopped.value = true;
  }, 50);

  // Load high-quality preview in background (only for URL previews)
  if (!props.isStatic && props.url) {
    loadHighQualityPreview();
  }
}

function loadHighQualityPreview() {
  const highQualityUrl = getHighQualityPreviewUrl();
  const img = new Image();

  img.onload = () => {
    // Only update if preview is still visible
    if (isVisible.value) {
      currentPreviewSrc.value = highQualityUrl;
      highQualityImageLoaded.value = true;
    }
  };

  img.onerror = () => {
    // Keep the favicon if high-quality fails - no need to do anything
    console.warn("High quality preview failed to load, keeping favicon");
  };

  // Start loading
  img.src = highQualityUrl;
}

function hidePreview() {
  isVisible.value = false;
  hasPopped.value = false;
}

function handleImageLoad() {
  isLoading.value = false;
}
</script>

<style scoped>
.transform-gpu {
  transform: scale3d(0, 0, 1);
  transform-origin: center bottom;
  will-change: transform;
  backface-visibility: hidden;
}

.animate-pop {
  animation: pop 1000ms ease forwards;
  will-change: transform;
}

@keyframes pop {
  0% {
    transform: scale3d(0.26, 0.26, 1);
  }
  25% {
    transform: scale3d(1.1, 1.1, 1);
  }
  65% {
    transform: scale3d(0.98, 0.98, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
}

.index {
  z-index: 100;
  position: fixed;
  top: 0;
}
</style>
