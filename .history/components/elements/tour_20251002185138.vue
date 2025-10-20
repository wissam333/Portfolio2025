<template>
  <div v-if="active && currentStepData">
    <!-- Dark overlay -->
    <div class="p-overlay-mask" @click="end"></div>

    <!-- Highlight target -->
    <div
      v-if="highlightBox"
      class="absolute border-2 border-primary-500 rounded-lg shadow-lg pointer-events-none transition-all"
      :style="highlightBox"
    />

    <!-- PrimeVue OverlayPanel (as step tooltip) -->
    <OverlayPanel
      ref="op"
      :dismissable="false"
      :showCloseIcon="false"
      appendTo="body"
    >
      <div class="p-3 w-72">
        <h3 class="font-semibold mb-2">{{ currentStepData.title }}</h3>
        <p class="mb-3 text-sm">{{ currentStepData.content }}</p>

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
import { ref, computed, watch, nextTick, onMounted } from "vue";
import OverlayPanel from "primevue/overlaypanel";
import Button from "primevue/button";

const props = defineProps({
  steps: { type: Array, required: true },
  start: { type: Boolean, default: false },
});

const active = ref(props.start);
const stepIndex = ref(0);
const op = ref(null);

const currentStepData = computed(() => props.steps[stepIndex.value] || null);

const highlightBox = ref(null);

const updatePositions = () => {
  if (!currentStepData.value) return;
  const el = document.querySelector(currentStepData.value.selector);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  highlightBox.value = {
    top: rect.top + "px",
    left: rect.left + "px",
    width: rect.width + "px",
    height: rect.height + "px",
  };

  op.value?.show(el); // position tooltip relative to target
};

watch(currentStepData, async () => {
  await nextTick();
  updatePositions();
});

onMounted(() => {
  if (active.value) updatePositions();
  window.addEventListener("resize", updatePositions);
});

const next = () => {
  if (stepIndex.value < props.steps.length - 1) stepIndex.value++;
  else end();
};

const prev = () => {
  if (stepIndex.value > 0) stepIndex.value--;
};

const end = () => {
  active.value = false;
  op.value?.hide();
};
</script>

<style scoped>
.p-overlay-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9990;
}
</style>
