<template>
  <div
    class="p-timeline p-timeline-vertical"
    :class="`p-timeline-align-${align}`"
  >
    <div v-for="(item, index) in value" :key="index" class="p-timeline-event">
      <!-- opposite side (empty by default, matches PrimeVue structure) -->
      <div class="p-timeline-event-opposite">
        <slot name="opposite" :item="item" :index="index" />
      </div>

      <!-- connector: line + marker -->
      <div class="p-timeline-event-separator">
        <div class="p-timeline-event-marker">
          <slot name="marker" :item="item" :index="index" />
        </div>
        <div
          v-if="index < value.length - 1"
          class="p-timeline-event-connector"
        />
      </div>

      <!-- main content -->
      <div class="p-timeline-event-content">
        <slot name="content" :item="item" :index="index" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: { type: Array, default: () => [] },
  align: { type: String, default: "left" }, // left | right | alternate
});
</script>

<style scoped>
.p-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.p-timeline-event {
  display: flex;
  position: relative;
  min-height: 80px;
}

/* ── alternate: even = normal, odd = reversed ── */
.p-timeline-align-alternate .p-timeline-event:nth-child(even) {
  flex-direction: row-reverse;
}

.p-timeline-event-opposite {
  flex: 1;
  padding: 0 1rem;
}

.p-timeline-event-separator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;
}

.p-timeline-event-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.p-timeline-event-connector {
  flex: 1;
  width: 2px;
  background: rgba(255, 255, 255, 0.15);
  margin: 4px 0;
}

.p-timeline-event-content {
  flex: 1;
  padding: 0 1rem 2rem;
}
</style>
