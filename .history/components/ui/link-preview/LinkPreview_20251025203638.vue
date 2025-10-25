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
          <!-- Progressive loading image -->
          <img
            :src="currentPreviewSrc"
            :width="width"
            :height="height"
            class="size-full rounded-lg object-cover transition-opacity duration-300"
            :class="{ 'opacity-0': isLoading && !props.isStatic }"
            :style="imageStyle"
            alt="preview"
            @load="handleImageLoad"
            @error="handleImageError"
          />

          <!-- Loading state -->
          <div
            v-if="isLoading && !props.isStatic"
            class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <div class="flex flex-col items-center gap-2">
              <div
                class="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"
              ></div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Loading preview...
              </div>
            </div>
          </div>
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
function getFaviconUrl(url: string): string {
  if (!url) return "/default-preview.png";

  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return "/default-preview.png";
  }
}

// Generate high-quality preview URL (lazy load)
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
    "viewport.width": String(props.width * 3), // Reduced for faster loading
    "viewport.height": String(props.height * 3),
  });

  return `https://api.microlink.io/?${params.toString()}`;
}

// Initial preview source (fast loading)
const initialPreviewSrc = computed(() => {
  if (props.isStatic) return props.imageSrc;
  return getFaviconUrl(props.url || "");
});

// Calculate preview position
const previewStyle = computed<CSSProperties>(() => {
  if (!isVisible.value) {
    return { opacity: 0, pointerEvents: "none" };
  }

  const offset = 20;
  const previewWidth = props.width;
  const previewHeight = props.height;

  // Use the link ref directly instead of querying
  const linkEl = link.value;
  if (!linkEl) {
    return {
      opacity: 0,
      pointerEvents: "none",
      left: "-1000px",
      top: "-1000px",
    };
  }

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
    return {
      opacity: 0,
      pointerEvents: "none",
      left: "-1000px",
      top: "-1000px",
    };
  }
});

// Image specific styling
const imageStyle = computed<CSSProperties>(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
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

  // For static images, we're done
  if (props.isStatic) {
    return;
  }

  // Small delay to ensure DOM is updated before animation
  setTimeout(() => {
    hasPopped.value = true;
  }, 50);

  // Load high-quality preview in background
  loadHighQualityPreview();
}

function loadHighQualityPreview() {
  if (props.isStatic || !props.url) return;

  const highQualityUrl = getHighQualityPreviewUrl();
  const img = new Image();

  img.onload = () => {
    // Only update if preview is still visible
    if (isVisible.value) {
      currentPreviewSrc.value = highQualityUrl;
      highQualityImageLoaded.value = true;
      isLoading.value = false;
    }
  };

  img.onerror = () => {
    // Keep the favicon if high-quality fails
    if (isVisible.value) {
      isLoading.value = false;
    }
  };

  // Start loading
  img.src = highQualityUrl;

  // Set timeout as fallback
  setTimeout(() => {
    if (isVisible.value && !highQualityImageLoaded.value) {
      isLoading.value = false;
    }
  }, 3000); // Max 3 seconds wait
}

function hidePreview() {
  isVisible.value = false;
  hasPopped.value = false;
  isLoading.value = true;
  highQualityImageLoaded.value = false;
}

function handleImageLoad() {
  // For static images, mark as loaded immediately
  if (props.isStatic) {
    isLoading.value = false;
  }
  // For URL previews, only mark as loaded if high-quality image loaded
  else if (highQualityImageLoaded.value) {
    isLoading.value = false;
  }
}

function handleImageError() {
  isLoading.value = false;
  // If high-quality image fails to load, we keep the favicon
  if (!props.isStatic && !highQualityImageLoaded.value) {
    currentPreviewSrc.value = initialPreviewSrc.value;
  }
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
}
</style>
