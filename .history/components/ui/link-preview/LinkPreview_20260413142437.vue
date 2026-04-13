<template>
  <div :class="cn('relative inline-block', props.class)" ref="container">
    <NuxtLink
      :ref="
        (el) => {
          link = el?.$el ?? el;
        }
      "
      :to="url"
      :class="cn('text-black dark:text-white', props.linkClass)"
      @mousemove="handleMouseMove"
      @mouseenter="showPreview"
      @mouseleave="hidePreview"
    >
      <slot />
    </NuxtLink>

    <Transition name="preview">
      <div
        v-if="isVisible"
        ref="previewEl"
        class="pointer-events-none fixed z-50"
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
              alt="Website preview"
              @load="handleImageLoad"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";
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

// ── Refs ──────────────────────────────────────────────────────────────────────
const container = ref<HTMLElement | null>(null);
const link = ref<Element | null>(null);
const previewEl = ref<HTMLElement | null>(null);

const isVisible = ref(false);
const isLoading = ref(true);
const hasPopped = ref(false);
const currentPreviewSrc = ref("");
const highQualityImageLoaded = ref(false);

const mouseX = ref(0);
const mouseY = ref(0);

// Viewport size — only populated client-side
const vpWidth = ref(0);
const vpHeight = ref(0);

// ── Window tracking ───────────────────────────────────────────────────────────
const updateViewport = () => {
  vpWidth.value = window.innerWidth;
  vpHeight.value = window.innerHeight;
};

onMounted(() => {
  updateViewport();
  window.addEventListener("resize", updateViewport, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("resize", updateViewport);
});

// ── Preview URL helpers ───────────────────────────────────────────────────────
const getFastPreviewUrl = (url: string): string => {
  if (!url) return "/default-preview.png";
  try {
    return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=${vpWidth.value}&h=${vpHeight.value}`;
  } catch {
    return "/default-preview.png";
  }
};

const getHighQualityPreviewUrl = (): string => {
  if (props.isStatic) return props.imageSrc || "";
  const params = new URLSearchParams({
    url: props.url || "",
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    colorScheme: "light",
    "viewport.isMobile": "false",
    "viewport.deviceScaleFactor": "1",
    "viewport.width": String(vpWidth.value),
    "viewport.height": String(vpHeight.value),
  });
  return `https://api.microlink.io/?${params}`;
};

// ── Computed styles ───────────────────────────────────────────────────────────
const PADDING = 10;
const OFFSET = 20;

const previewStyle = computed<CSSProperties>(() => {
  if (!isVisible.value) return { opacity: 0, pointerEvents: "none" };

  const linkEl = link.value as HTMLElement | null;
  if (!linkEl) return { opacity: 0, pointerEvents: "none" };

  const rect = linkEl.getBoundingClientRect();
  const pw = props.width;
  const ph = props.height;

  let x = mouseX.value - pw / 2;
  x = Math.max(PADDING, Math.min(x, vpWidth.value - pw - PADDING));

  let y = rect.top - ph - OFFSET;
  if (y < PADDING) y = rect.bottom + OFFSET;
  y = Math.max(PADDING, Math.min(y, vpHeight.value - ph - PADDING));

  return {
    position: "fixed",
    left: `${x}px`,
    top: `${y}px`,
    width: `${pw}px`,
    height: `${ph}px`,
    opacity: 1,
    pointerEvents: "none",
  };
});

const imageStyle = computed<CSSProperties>(() => ({
  width: "200px",
  height: "auto",
  objectFit: "contain",
}));

const popClass = computed(() => (hasPopped.value ? "animate-pop" : ""));

// ── Handlers ──────────────────────────────────────────────────────────────────
const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
};

const showPreview = () => {
  isVisible.value = true;
  isLoading.value = true;
  highQualityImageLoaded.value = false;
  currentPreviewSrc.value = props.isStatic
    ? props.imageSrc || ""
    : getFastPreviewUrl(props.url || "");

  setTimeout(() => {
    hasPopped.value = true;
  }, 50);

  if (!props.isStatic && props.url) loadHighQualityPreview();
};

const loadHighQualityPreview = () => {
  const url = getHighQualityPreviewUrl();
  const img = new Image();
  img.onload = () => {
    if (isVisible.value) {
      currentPreviewSrc.value = url;
      highQualityImageLoaded.value = true;
    }
  };
  img.src = url;
};

const hidePreview = () => {
  isVisible.value = false;
  hasPopped.value = false;
};

const handleImageLoad = () => {
  isLoading.value = false;
};
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

.preview-enter-active,
.preview-leave-active {
  transition: opacity 0.15s ease;
}
.preview-enter-from,
.preview-leave-to {
  opacity: 0;
}
</style>
