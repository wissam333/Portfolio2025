<template>
  <div :class="cn('relative inline-block', props.class)">
    <!-- Trigger -->
    <NuxtLink
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
      class="index pointer-events-none absolute z-50"
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
            :src="previewSrc"
            :width="width"
            :height="height"
            class="size-full rounded-lg object-cover"
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
const hasPopped = ref(false);
const linkElement = ref<HTMLElement | null>(null);

// Track window resize and scroll
const windowSize = reactive({
  width: typeof window !== "undefined" ? window.innerWidth : 0,
  height: typeof window !== "undefined" ? window.innerHeight : 0,
});

const mousePosition = reactive({
  x: 0,
  y: 0,
});

// Get the link element
onMounted(() => {
  if (typeof window !== "undefined") {
    // Find the NuxtLink element (it's a child of our component)
    linkElement.value =
      preview.value?.closest("div")?.querySelector("a") || null;

    window.addEventListener("resize", updateWindowSize);
    window.addEventListener("scroll", updateWindowSize);
    updateWindowSize();
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
  }
}

// Generate preview URL
const previewSrc = computed(() => {
  if (props.isStatic) return props.imageSrc;

  const params = new URLSearchParams({
    url: props.url,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    colorScheme: "light",
    "viewport.isMobile": "true",
    "viewport.deviceScaleFactor": "1",
    "viewport.width": String(props.width * 6),
    "viewport.height": String(props.height * 6),
  });

  return `https://api.microlink.io/?${params.toString()}`;
});

// Calculate preview position - FIXED
const previewStyle = computed<CSSProperties>(() => {
  if (!preview.value || !linkElement.value) return { opacity: 1 };

  const offset = 20;
  const previewWidth = props.width;
  const previewHeight = props.height;

  // Get link position relative to viewport
  const linkRect = linkElement.value.getBoundingClientRect();

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
    position: "fixed", // Use fixed positioning for better control
    left: `${x}px`,
    top: `${y}px`,
    width: `${previewWidth}px`,
    height: `${previewHeight}px`,
    opacity: 1,
  };
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
  setTimeout(() => {
    hasPopped.value = true;
  }, 50);
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
}
</style>
