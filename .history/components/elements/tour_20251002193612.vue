<template>
  <div v-if="isActive">
    <!-- dark overlay -->
    <div class="tour-overlay" @click="end" aria-hidden="true"></div>

    <!-- highlight box around the target -->
    <div
      v-if="highlightStyle"
      class="tour-highlight"
      :style="highlightStyle"
    ></div>

    <!-- tooltip / step panel -->
    <div
      v-if="currentStep"
      ref="tooltipRef"
      class="tour-tooltip"
      :style="tooltipStyle"
      role="dialog"
      :aria-label="currentStep.title || 'Tour step'"
      tabindex="-1"
    >
      <div class="tour-header">
        <strong>{{ currentStep.title }}</strong>
      </div>

      <div class="tour-body" v-html="currentStep.content"></div>

      <div
        class="tour-controls d-flex justify-content-between align-items-center"
      >
        <div>
          <button
            class="btn btn-sm btn-secondary me-2"
            @click="prev"
            :disabled="stepIndex === 0"
          >
            Back
          </button>
          <button class="btn btn-sm btn-light" @click="skip">Skip</button>
        </div>
        <div>
          <button v-if="!isLast" class="btn btn-sm btn-primary" @click="next">
            Next
          </button>
          <button v-else class="btn btn-sm btn-success" @click="end">
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * UiTour.vue
 * Props:
 *  - steps: [{ selector: '#id', title: '...', content: '...', placement?: 'top|bottom|left|right|auto' }]
 *  - start: boolean (optional)
 *
 * Exposed methods via ref:
 *  - start(index = 0)
 *  - end()
 *  - goTo(index)
 *
 * Emits: 'start', 'end', 'step'
 */

import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";

const props = defineProps({
  steps: { type: Array, default: () => [] },
  start: { type: Boolean, default: false },
  padding: { type: Number, default: 8 }, // visual gap around highlight
});

const emit = defineEmits(["start", "end", "step"]);

const isActive = ref(!!props.start);
const stepIndex = ref(0);
const tooltipRef = ref(null);
const highlightStyle = ref(null);
const tooltipStyle = ref(null);

const currentStep = computed(() => props.steps[stepIndex.value] ?? null);
const isLast = computed(
  () => props.steps.length > 0 && stepIndex.value === props.steps.length - 1
);

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

async function updatePositions() {
  if (!isActive.value || !currentStep.value) return;
  await nextTick();

  const sel = currentStep.value.selector;
  const el = sel ? document.querySelector(sel) : null;
  const scrollY = window.scrollY || window.pageYOffset;
  const scrollX = window.scrollX || window.pageXOffset;

  if (!el) {
    // If element not found, center tooltip and clear highlight
    highlightStyle.value = null;
    const vw = Math.min(window.innerWidth - 32, 720);
    tooltipStyle.value = {
      top: window.innerHeight / 2 + scrollY - 80 + "px",
      left: (window.innerWidth - vw) / 2 + scrollX + "px",
      width: vw + "px",
    };
    focusTooltip();
    return;
  }

  // Ensure element visible (center)
  try {
    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  } catch (e) {}

  // Wait a tiny bit for scroll to settle
  await new Promise((r) => setTimeout(r, 120));

  const rect = el.getBoundingClientRect();
  const absTop = rect.top + scrollY;
  const absLeft = rect.left + scrollX;

  // highlight style (with padding)
  const pad = props.padding;
  highlightStyle.value = {
    top: absTop - pad + "px",
    left: absLeft - pad + "px",
    width: rect.width + pad * 2 + "px",
    height: rect.height + pad * 2 + "px",
  };

  await nextTick();
  const tt = tooltipRef.value;
  const ttW = tt ? tt.offsetWidth : 300;
  const ttH = tt ? tt.offsetHeight : 140;

  // choose placement (auto tries best side)
  const placement = currentStep.value.placement || "auto";
  const avail = {
    top: rect.top,
    bottom: window.innerHeight - rect.bottom,
    left: rect.left,
    right: window.innerWidth - rect.right,
  };

  let chosen = placement;
  if (placement === "auto") {
    if (avail.bottom > ttH + 20) chosen = "bottom";
    else if (avail.top > ttH + 20) chosen = "top";
    else if (avail.right > ttW + 20) chosen = "right";
    else chosen = "left";
  }

  const margin = 10;
  let top, left;
  if (chosen === "bottom") {
    top = absTop + rect.height + margin;
    left = absLeft + (rect.width - ttW) / 2;
  } else if (chosen === "top") {
    top = absTop - ttH - margin;
    left = absLeft + (rect.width - ttW) / 2;
  } else if (chosen === "right") {
    top = absTop + (rect.height - ttH) / 2;
    left = absLeft + rect.width + margin;
  } else {
    // left
    top = absTop + (rect.height - ttH) / 2;
    left = absLeft - ttW - margin;
  }

  // clamp to viewport
  left = clamp(left, scrollX + 8, scrollX + window.innerWidth - ttW - 8);
  top = clamp(top, scrollY + 8, scrollY + window.innerHeight - ttH - 8);

  tooltipStyle.value = {
    top: top + "px",
    left: left + "px",
  };

  focusTooltip();
}

function focusTooltip() {
  nextTick(() => {
    try {
      tooltipRef.value?.focus();
    } catch (e) {}
  });
}

watch(
  () => props.start,
  (val) => {
    if (val) start();
  }
);

watch(stepIndex, () => {
  emit("step", stepIndex.value);
  updatePositions();
});

onMounted(() => {
  if (isActive.value) updatePositions();
  window.addEventListener("resize", updatePositions);
  window.addEventListener("scroll", updatePositions, true);
  window.addEventListener("keydown", onKeydown, true);
});

onUnmounted(() => {
  window.removeEventListener("resize", updatePositions);
  window.removeEventListener("scroll", updatePositions, true);
  window.removeEventListener("keydown", onKeydown, true);
});

function onKeydown(e) {
  if (!isActive.value) return;
  if (e.key === "Escape") {
    end();
    e.preventDefault();
  } else if (e.key === "ArrowRight" || e.key === "Enter") {
    next();
    e.preventDefault();
  } else if (e.key === "ArrowLeft") {
    prev();
    e.preventDefault();
  }
}

function start(index = 0) {
  if (!Array.isArray(props.steps) || props.steps.length === 0) return;
  stepIndex.value = Math.max(0, Math.min(index, props.steps.length - 1));
  isActive.value = true;
  emit("start");
  // small delay so DOM settles
  setTimeout(updatePositions, 40);
}

function next() {
  if (stepIndex.value < props.steps.length - 1) stepIndex.value++;
  else end();
}

function prev() {
  if (stepIndex.value > 0) stepIndex.value--;
}

function skip() {
  end();
}

function end() {
  isActive.value = false;
  highlightStyle.value = null;
  tooltipStyle.value = null;
  emit("end");
}

defineExpose({
  start,
  end,
  goTo(index) {
    if (typeof index === "number") stepIndex.value = index;
  },
});
</script>

<style scoped>
.tour-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.62);
  z-index: 1000;
}

/* highlight around target (glow + subtle border) */
.tour-highlight {
  position: absolute;
  border-radius: 8px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.55),
    0 0 0 6px rgba(255, 255, 255, 0.02) inset;
  border: 3px solid rgba(255, 255, 255, 0.06);
  z-index: 1001;
  transition: all 160ms ease;
  pointer-events: none;
}

/* tooltip card */
.tour-tooltip {
  position: absolute;
  z-index: 1002;
  max-width: 360px;
  background: #fff;
  color: #111;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
  outline: none;
}

/* small layout niceties */
.tour-header {
  margin-bottom: 8px;
  font-size: 1rem;
}
.tour-body {
  font-size: 0.95rem;
  margin-bottom: 10px;
}
.tour-controls .btn {
  min-width: 72px;
}
</style>
