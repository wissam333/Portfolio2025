<template>
  <div v-if="modelValue && currentStep" class="ui-tour">
    <!-- Dark overlay -->
    <div class="ut-overlay" @click="end"></div>

    <!-- Highlight box -->
    <div v-if="highlight" class="ut-highlight" :style="highlight">
      <div class="ut-pulse"></div>
    </div>

    <!-- Tooltip -->
    <div ref="tooltip" class="ut-tooltip" :style="tooltip">
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

const currentStep = computed(() => props.steps[stepIndex.value] || null);
const isLast = computed(() => stepIndex.value === props.steps.length - 1);

const highlight = ref(null);
const tooltipStyle = ref(null);

function updatePositions() {
  if (!currentStep.value) return;

  const el = document.querySelector(currentStep.value.selector);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const pad = props.padding;

  // highlight box
  highlight.value = {
    top: rect.top + scrollY - pad + "px",
    left: rect.left + scrollX - pad + "px",
    width: rect.width + pad * 2 + "px",
    height: rect.height + pad * 2 + "px",
  };

  // tooltip
  nextTick(() => {
    const tt = tooltip.value;
    if (!tt) return;

    const ttRect = tt.getBoundingClientRect();
    const margin = 12;
    let top = rect.bottom + scrollY + margin;
    let left = rect.left + scrollX + (rect.width - ttRect.width) / 2;

    // clamp within viewport
    left = Math.max(
      scrollX + 8,
      Math.min(left, scrollX + window.innerWidth - ttRect.width - 8)
    );
    top = Math.max(
      scrollY + 8,
      Math.min(top, scrollY + window.innerHeight - ttRect.height - 8)
    );

    tooltipStyle.value = { top: top + "px", left: left + "px" };
  });
}

watch(
  () => props.modelValue,
  (val) => {
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

onMounted(() => {
  window.addEventListener("resize", updatePositions);
  window.addEventListener("scroll", updatePositions, true);
});
onUnmounted(() => {
  window.removeEventListener("resize", updatePositions);
  window.removeEventListener("scroll", updatePositions, true);
});

function next() {
  if (stepIndex.value < props.steps.length - 1) stepIndex.value++;
  else end();
}
function prev() {
  if (stepIndex.value > 0) stepIndex.value--;
}
function end() {
  emit("update:modelValue", false);
  emit("end");
}

defineExpose({ next, prev, end });
</script>
<style scoped>
.ui-tour {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  pointer-events: none;
}

.ut-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  transition: background 0.3s ease;
  pointer-events: auto;
}

.ut-highlight {
  position: absolute;
  border-radius: 8px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
  border: 2px solid #4cafef;
  transition: all 0.3s ease;
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
  transition: top 0.25s ease, left 0.25s ease, opacity 0.3s;
  opacity: 1;
}
.ut-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
