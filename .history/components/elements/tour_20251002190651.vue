<template>
  <div v-if="active && currentStep">
    <!-- Overlay -->
    <div class="tour-overlay" @click="end"></div>

    <!-- Highlight box (smooth animated) -->
    <div v-if="highlightBox" class="highlight-box" :style="highlightBox">
      <div class="pulse"></div>
    </div>

    <!-- Tooltip -->
    <div v-if="tooltipBox" class="tooltip-box" :style="tooltipBox">
      <h3 class="tooltip-title">{{ currentStep.title }}</h3>
      <p class="tooltip-content">{{ currentStep.content }}</p>

      <div class="tooltip-actions">
        <button v-if="stepIndex > 0" @click="prev" class="btn back">
          ◀ Back
        </button>
        <button
          v-if="stepIndex < steps.length - 1"
          @click="next"
          class="btn next"
        >
          Next ▶
        </button>
        <button v-else @click="end" class="btn finish">✔ Finish</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";

const props = defineProps({
  steps: { type: Array, required: true },
  start: { type: Boolean, default: false },
});

const active = ref(props.start);
const stepIndex = ref(0);

const currentStep = computed(() => props.steps[stepIndex.value] || null);
const highlightBox = ref(null);
const tooltipBox = ref(null);

function updatePositions() {
  if (!currentStep.value) return;
  const el = document.querySelector(currentStep.value.selector);
  if (!el) return;

  const rect = el.getBoundingClientRect();

  // Highlight box
  highlightBox.value = {
    top: rect.top + window.scrollY + "px",
    left: rect.left + window.scrollX + "px",
    width: rect.width + "px",
    height: rect.height + "px",
  };

  // Tooltip (position below element, adjust if near bottom)
  const margin = 12;
  const top = rect.bottom + window.scrollY + margin;
  const left = rect.left + window.scrollX;

  tooltipBox.value = {
    top: top + "px",
    left: left + "px",
  };
}

watch(currentStep, async () => {
  await nextTick();
  updatePositions();
});

onMounted(() => {
  if (active.value) updatePositions();
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
  active.value = false;
}
</script>

<style scoped>
.tour-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9990;
}

/* Smooth highlight */
.highlight-box {
  position: absolute;
  border: 2px solid #3b82f6;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  pointer-events: none;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 9991;
}

.highlight-box .pulse {
  position: absolute;
  inset: -10px;
  border: 2px solid rgba(59, 130, 246, 0.4);
  border-radius: 12px;
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* Tooltip */
.tooltip-box {
  position: absolute;
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 9992;
  max-width: 280px;
  transition: all 0.3s ease;
}

.tooltip-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
}

.tooltip-content {
  font-size: 14px;
  margin-bottom: 12px;
}

.tooltip-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.btn.back {
  background: #eee;
}
.btn.next {
  background: #3b82f6;
  color: white;
}
.btn.finish {
  background: #10b981;
  color: white;
}

.btn:hover {
  opacity: 0.85;
}
</style>
