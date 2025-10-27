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
          <button v-if="!isLast" class="btn btn-sm btn-success" @click="next">
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
    highlightStyle.value = null;
    tooltipStyle.value = {
      top: scrollY + window.innerHeight / 2 - 70 + "px",
      left: scrollX + window.innerWidth / 2 - 180 + "px",
    };
    return;
  }

  // Instant jump to element
  el.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });

  const rect = el.getBoundingClientRect();
  const absTop = rect.top + scrollY;
  const absLeft = rect.left + scrollX;
  const pad = props.padding;

  // Animate highlight using rAF for smoothness
  requestAnimationFrame(() => {
    highlightStyle.value = {
      top: absTop - pad + "px",
      left: absLeft - pad + "px",
      width: rect.width + pad * 2 + "px",
      height: rect.height + pad * 2 + "px",
      transition: "all 250ms ease-out",
    };
  });

  // Tooltip placement
  const tt = tooltipRef.value;
  if (!tt) return;
  const ttW = tt.offsetWidth;
  const ttH = tt.offsetHeight;
  const margin = 12;

  let top = absTop + rect.height + margin;
  let left = absLeft + (rect.width - ttW) / 2;

  // Clamp
  left = Math.max(
    scrollX + 8,
    Math.min(left, scrollX + window.innerWidth - ttW - 8)
  );
  top = Math.max(
    scrollY + 8,
    Math.min(top, scrollY + window.innerHeight - ttH - 8)
  );

  requestAnimationFrame(() => {
    tooltipStyle.value = {
      top: top + "px",
      left: left + "px",
      transition: "top 250ms ease-out, left 250ms ease-out",
    };
  });
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
/* highlight around target (glow + subtle border) */
.tour-highlight {
  position: absolute;
  border-radius: 8px;
  border: 3px solid rgba(255, 255, 255, 0.06);
  z-index: 1001;
  transition: all 160ms ease;
  pointer-events: none;

  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.62);
}

/* tooltip card */
.tour-tooltip {
  position: absolute;
  z-index: 1002;
  max-width: 360px;
  inset-inline-start: 0;
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
