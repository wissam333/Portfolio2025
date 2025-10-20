<template>
  <div v-if="active && currentStep">
    <!-- Overlay -->
    <div class="p-overlay-mask" @click="end"></div>

    <!-- Highlight box -->
    <div v-if="highlightBox" class="highlight-box" :style="highlightBox" />

    <!-- Tooltip (PrimeVue OverlayPanel) -->
    <OverlayPanel
      ref="op"
      :dismissable="false"
      :showCloseIcon="false"
      appendTo="body"
    >
      <div class="p-3 w-72">
        <h3 class="font-semibold mb-2">{{ currentStep.title }}</h3>
        <p class="mb-3 text-sm">{{ currentStep.content }}</p>

        <div class="flex justify-between">
          <Button
            v-if="stepIndex > 0"
            label="Back"
            icon="pi pi-arrow-left"
            @click="prev"
            outlined
            size="small"
          />
          <Button
            v-if="stepIndex < steps.length - 1"
            label="Next"
            icon="pi pi-arrow-right"
            iconPos="right"
            @click="next"
            size="small"
          />
          <Button
            v-else
            label="Finish"
            icon="pi pi-check"
            severity="success"
            @click="end"
            size="small"
          />
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import OverlayPanel from "primevue/overlaypanel";
import Button from "primevue/button";

const props = defineProps({
  steps: { type: Array, required: true },
  start: { type: Boolean, default: false },
});

const active = ref(props.start);
const stepIndex = ref(0);
const op = ref(null);

const currentStep = computed(() => props.steps[stepIndex.value] || null);
const highlightBox = ref(null);

function updatePositions() {
  if (!currentStep.value) return;
  const el = document.querySelector(currentStep.value.selector);
  if (!el) return;

  const rect = el.getBoundingClientRect();

  highlightBox.value = {
    top: rect.top + window.scrollY + "px",
    left: rect.left + window.scrollX + "px",
    width: rect.width + "px",
    height: rect.height + "px",
  };

  // show OverlayPanel near the element
  op.value?.show(null, el);
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
  op.value?.hide();
}
</script>

<style scoped>
.p-overlay-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9990;
}

.highlight-box {
  position: absolute;
  border: 2px solid var(--p-primary-color, #3b82f6);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  transition: all 0.2s ease-in-out;
  z-index: 9991;
}
</style>
