<template>
  <div
    :class="['egg-counter', positionClass]"
    data-aos="fade-right"
    data-aos-delay="1200"
  >
    <div class="counter-inner">
      <!-- Header -->
      <div class="header">
        <svg class="icon" viewBox="0 0 24 24">
          <path
            d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 15h-2v-2h2zm0-4h-2V7h2z"
          />
        </svg>
        <span class="title">Easter Eggs</span>
      </div>

      <!-- Count -->
      <div class="count">
        <span class="num">{{ useEasterEggs().value.length }}</span>
        <span class="total">/ {{ total }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  position: { type: String, default: "bottom-left" }, // UI position
});

let total = ref(6);

const percent = computed(() => {
  if (total.value <= 0) return 0;
  return Math.min(
    100,
    Math.round((useEasterEggs().value.length / total.value) * 100)
  );
});

const positionClass = computed(() => {
  switch (props.position) {
    case "top-left":
      return "pos-top-left";
    case "top-right":
      return "pos-top-right";
    case "bottom-right":
      return "pos-bottom-right";
    default:
      return "pos-bottom-left";
  }
});
</script>

<style scoped>
.egg-counter {
  position: fixed;
  z-index: 999;
  pointer-events: none;
}
.pos-bottom-left {
  bottom: 20px;
  left: 20px;
}
.pos-bottom-right {
  bottom: 20px;
  right: 20px;
}
.pos-top-left {
  top: 20px;
  left: 20px;
}
.pos-top-right {
  top: 20px;
  right: 20px;
}

.counter-inner {
  display: flex;
  gap: 20px;
  pointer-events: auto;
  min-width: 180px;
  backdrop-filter: blur(8px);
  background: rgba(160, 190, 255, 0.15);
  border: 1px solid rgba(200, 220, 255, 0.2);
  border-radius: 14px;
  padding: 12px 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 25px rgba(140, 180, 255, 0.2);
  color: #e6f0ff;
  font-family: "Inter", sans-serif;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.icon {
  width: 18px;
  height: 18px;
  fill: #cfe6ff;
}
.title {
  font-size: 13px;
  font-weight: 600;
}

/* Count */
.count {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.num {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 10px rgba(120, 170, 255, 0.6);
}
.total {
  font-size: 12px;
  color: #bcd7ff;
}
</style>
