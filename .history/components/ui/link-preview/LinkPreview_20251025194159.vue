<template>
  <div :class="['position-relative d-inline-block', props.class]">
    <!-- Trigger -->
    <NuxtLink
      :to="url"
      :class="['text-body text-decoration-none', props.linkClass]"
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
      class="position-fixed z-50"
      :style="previewStyle"
    >
      <div
        class="overflow-hidden shadow"
        :class="[popClass, { 'preview-transform': !props.isStatic }]"
      >
        <div class="bg-white border-0 rounded p-2 shadow-sm">
          <img
            :src="previewSrc"
            :width="width"
            :height="height"
            class="img-fluid rounded object-fit-cover"
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
import { ref, computed, reactive, type CSSProperties } from "vue";
import { cn } from "@/lib/utils";

interface BaseProps {
  class?: string;
  linkClass?: string;
  width?: number;
  height?: number;
}

// Props for static image mode
interface StaticImageProps extends BaseProps {
  isStatic?: true;
  imageSrc?: string;
  url?: string; // optional in static mode
}

// Props for URL preview mode
interface URLPreviewProps extends BaseProps {
  isStatic?: false; // optional but must be false if specified
  imageSrc?: string; // optional in URL mode
  url?: string;
}

// Combined type that enforces the requirements
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
    "viewport.width": String(props.width * 3),
    "viewport.height": String(props.height * 3),
  });

  return `https://api.microlink.io/?${params.toString()}`;
});

// Position tracking
const mousePosition = reactive({
  x: 0,
  y: 0,
});

// Calculate preview position
const previewStyle = computed<CSSProperties>(() => {
  if (!preview.value) return {};

  const offset = 20;
  const previewWidth = props.width;
  const previewHeight = props.height;
  const viewportWidth = window.innerWidth;

  let x = mousePosition.x - previewWidth / 2;
  x = Math.min(Math.max(0, x), viewportWidth - previewWidth);

  const linkRect = preview.value.parentElement?.getBoundingClientRect();
  const y = linkRect ? linkRect.top - previewHeight - offset : 0;

  return {
    position: "fixed",
    left: `${x}px`,
    top: `${y}px`,
    width: `${previewWidth}px`,
    height: `${previewHeight}px`,
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
.preview-transform {
  transform: scale(0);
  transform-origin: center bottom;
  will-change: transform;
}

.preview-pop-animation {
  animation: previewPop 1000ms ease forwards;
  will-change: transform;
}

@keyframes previewPop {
  0% {
    transform: scale(0.26);
  }
  25% {
    transform: scale(1.1);
  }
  65% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .bg-white {
    background-color: var(--bs-dark, #212529) !important;
  }
}

/* Object fit fallback for older Bootstrap versions */
.object-fit-cover {
  object-fit: cover;
}
</style>
