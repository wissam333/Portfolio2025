<template>
  <div v-if="isActive && currentStep" class="ui-tour">
    <!-- Overlay -->
    <div class="ut-overlay" @click="end"></div>

    <!-- Highlight -->
    <div v-if="highlight" class="ut-highlight" :style="highlight">
      <div class="ut-pulse"></div>
    </div>

    <!-- Tooltip -->
    <div ref="tooltip" class="ut-tooltip" :style="tooltipStyle">
      <div class="ut-header">
        <h3>{{ currentStep.title }}</h3>
        <button class="ut-close" @click="end">✕</button>
      </div>
      <p>{{ currentStep.content }}</p>
      <div class="ut-actions">
        <button v-if="stepIndex > 0" @click="prev">Back</button>
        <button v-if="!isLast" @click="next">Next</button>
        <button v-else @click="end">Finish</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  defineExpose,
} from "vue";

const props = defineProps({
  steps: { type: Array, required: true },
  modelValue: { type: Boolean, default: false },
  padding: { type: Number, default: 10 },
});
const emit = defineEmits(["update:modelValue", "step", "end"]);

const stepIndex = ref(0);
const tooltip = ref(null);
const highlight = ref(null);
const tooltipStyle = ref(null);
const isActive = ref(!!props.modelValue);

const currentStep = computed(() => props.steps[stepIndex.value] || null);
const isLast = computed(() => stepIndex.value === props.steps.length - 1);

// Determine best tooltip placement
function getTooltipPosition(elRect, ttRect, scrollX, scrollY, margin = 12) {
  const positions = [
    {
      name: "bottom",
      top: elRect.bottom + scrollY + margin,
      left: elRect.left + scrollX + (elRect.width - ttRect.width) / 2,
    },
    {
      name: "top",
      top: elRect.top + scrollY - ttRect.height - margin,
      left: elRect.left + scrollX + (elRect.width - ttRect.width) / 2,
    },
    {
      name: "right",
      top: elRect.top + scrollY + (elRect.height - ttRect.height) / 2,
      left: elRect.right + scrollX + margin,
    },
    {
      name: "left",
      top: elRect.top + scrollY + (elRect.height - ttRect.height) / 2,
      left: elRect.left + scrollX - ttRect.width - margin,
    },
  ];
  // Choose first position fully inside viewport
  for (let pos of positions) {
    if (
      pos.left >= scrollX + 8 &&
      pos.left + ttRect.width <= scrollX + window.innerWidth - 8 &&
      pos.top >= scrollY + 8 &&
      pos.top + ttRect.height <= scrollY + window.innerHeight - 8
    )
      return { top: pos.top, left: pos.left };
  }
  // fallback: bottom clamped
  let top = Math.min(
    Math.max(positions[0].top, scrollY + 8),
    scrollY + window.innerHeight - ttRect.height - 8
  );
  let left = Math.min(
    Math.max(positions[0].left, scrollX + 8),
    scrollX + window.innerWidth - ttRect.width - 8
  );
  return { top, left };
}

function updatePositions() {
  if (!currentStep.value) return;
  const el = document.querySelector(currentStep.value.selector);
  if (!el) return;

  // Jump first to element (ensure coordinates are correct)
  el.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });

  nextTick(() => {
    const rect = el.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const pad = props.padding;

    // Highlight
    highlight.value = {
      top: rect.top + scrollY - pad + "px",
      left: rect.left + scrollX - pad + "px",
      width: rect.width + pad * 2 + "px",
      height: rect.height + pad * 2 + "px",
    };

    // Tooltip
    const tt = tooltip.value;
    if (!tt) return;
    const ttRect = tt.getBoundingClientRect();
    const pos = getTooltipPosition(rect, ttRect, scrollX, scrollY);
    tooltipStyle.value = { top: pos.top + "px", left: pos.left + "px" };

    // Optional: smooth scroll for user experience after positioning
    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  });
}

// Watchers
watch(
  () => props.modelValue,
  (val) => {
    isActive.value = val;
    if (val) {
      stepIndex.value = 0;
      nextTick(updatePositions);
    }
  }
);
watch(stepIndex, () => {
  emit("step", stepIndex.value);
  nextTick(updatePositions);
});

// Window listeners
function onWindowResize() {
  nextTick(updatePositions);
}
function onWindowScroll() {
  nextTick(updatePositions);
}

onMounted(() => {
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("scroll", onWindowScroll, true);
});
onUnmounted(() => {
  window.removeEventListener("resize", onWindowResize);
  window.removeEventListener("scroll", onWindowScroll, true);
});

// Navigation
function next() {
  if (stepIndex.value < props.steps.length - 1) stepIndex.value++;
  else end();
}
function prev() {
  if (stepIndex.value > 0) stepIndex.value--;
}
function end() {
  isActive.value = false;
  emit("update:modelValue", false);
  emit("end");
}

// Expose API
defineExpose({
  next,
  prev,
  end,
  start: (index = 0) => {
    stepIndex.value = index;
    isActive.value = true;
    nextTick(updatePositions);
  },
});
</script>

<style scoped>
.ui-tour {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  pointer-events: none; /* disables interaction except children */
}
.ut-overlay {
  pointer-events: auto; /* only active when tour is running */
}
.ut-tooltip {
  pointer-events: auto;
}

.ut-highlight {
  position: absolute;
  border-radius: 8px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
  border: 2px solid #4cafef;
  transition: all 0.35s ease;
  pointer-events: none;
}
.ut-pulse {
  position: absolute;
  inset: -6px;
  border: 2px solid #4cafef;
  border-radius: 10px;
  animation: pulse 1.8s infinite;
}
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.1);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
.ut-tooltip {
  position: absolute;
  min-width: 240px;
  max-width: 320px;
  background: #fff;
  color: #222;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
  transition: top 0.3s ease, left 0.3s ease, opacity 0.3s;
  opacity: 1;
  z-index: 2010;
}
.ut-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.ut-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
}
.ut-close {
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
  color: #888;
}
.ut-close:hover {
  color: #000;
}
.ut-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}
.ut-actions button {
  background: #4cafef;
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}
.ut-actions button:hover {
  background: #2196f3;
}
</style>
