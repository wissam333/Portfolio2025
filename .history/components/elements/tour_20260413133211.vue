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
        <strong>{{ isAr ? currentStep.titleAr : currentStep.title }}</strong>
      </div>

      <div
        class="tour-body"
        v-html="isAr ? currentStep.contentAr : currentStep.content"
      ></div>

      <div
        class="tour-controls d-flex justify-content-between align-items-center"
      >
        <div>
          <button
            class="btn btn-sm btn-secondary mx-2"
            @click="prev"
            :disabled="stepIndex === 0"
          >
            {{ isAr ? "السابق" : "Back" }}
          </button>
          <button class="btn btn-sm btn-light" @click="skip" v-if="!isLast">
            {{ isAr ? "تخطي" : "Skip" }}
          </button>
        </div>
        <div>
          <button v-if="!isLast" class="btn btn-sm btn-success" @click="next">
            {{ isAr ? "التالي" : "Next" }}
          </button>
          <button v-else class="btn btn-sm btn-success" @click="end">
            {{ isAr ? "تم الانتهاء" : "Done" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { locale } = useI18n();

const props = defineProps({
  steps: { type: Array, default: () => [] },
  start: { type: Boolean, default: false },
  padding: { type: Number, default: 8 },
});

const emit = defineEmits(["start", "end", "step"]);

const isActive = ref(!!props.start);
const stepIndex = ref(0);
const tooltipRef = ref(null);
const highlightStyle = ref(null);
const tooltipStyle = ref(null);

let startTimer = null;
let rafHighlight = null;
let rafTooltip = null;

const isAr = computed(() => locale.value === "ar");
const currentStep = computed(() => props.steps[stepIndex.value] ?? null);
const isLast = computed(
  () => props.steps.length > 0 && stepIndex.value === props.steps.length - 1,
);

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

async function updatePositions() {
  if (!isActive.value || !currentStep.value) return;
  await nextTick();

  const sel = currentStep.value.selector;
  const el = sel ? document.querySelector(sel) : null;
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  if (!el) {
    highlightStyle.value = null;
    tooltipStyle.value = {
      top: scrollY + window.innerHeight / 2 - 70 + "px",
      left: scrollX + window.innerWidth / 2 - 180 + "px",
    };
    return;
  }

  el.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });

  const rect = el.getBoundingClientRect();
  const absTop = rect.top + scrollY;
  const absLeft = rect.left + scrollX;
  const pad = props.padding;

  if (rafHighlight) cancelAnimationFrame(rafHighlight);
  rafHighlight = requestAnimationFrame(() => {
    highlightStyle.value = {
      top: absTop - pad + "px",
      left: absLeft - pad + "px",
      width: rect.width + pad * 2 + "px",
      height: rect.height + pad * 2 + "px",
      transition: "all 250ms ease-out",
    };
    rafHighlight = null;
  });

  const tt = tooltipRef.value;
  if (!tt) return;
  const ttW = tt.offsetWidth;
  const ttH = tt.offsetHeight;
  const margin = 12;

  let top = absTop + rect.height + margin;
  let left = absLeft + (rect.width - ttW) / 2;

  left = clamp(left, scrollX + 8, scrollX + window.innerWidth - ttW - 8);
  top = clamp(top, scrollY + 8, scrollY + window.innerHeight - ttH - 8);

  if (rafTooltip) cancelAnimationFrame(rafTooltip);
  rafTooltip = requestAnimationFrame(() => {
    tooltipStyle.value = {
      top: top + "px",
      left: left + "px",
      transition: "top 250ms ease-out, left 250ms ease-out",
    };
    rafTooltip = null;
  });
}

watch(
  () => props.start,
  (val) => {
    if (val) start();
  },
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
  if (startTimer) clearTimeout(startTimer);
  if (rafHighlight) cancelAnimationFrame(rafHighlight);
  if (rafTooltip) cancelAnimationFrame(rafTooltip);
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
  stepIndex.value = clamp(index, 0, props.steps.length - 1);
  isActive.value = true;
  emit("start");
  startTimer = setTimeout(updatePositions, 40);
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
