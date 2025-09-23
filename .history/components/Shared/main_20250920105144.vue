<template>
  <div :class="['egg-counter', positionClass]">
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

      <!-- Progress (optional) -->
      <div class="progress">
        <div class="bar" :style="{ width: percent + '%' }"></div>
      </div>
    </div>

    <!-- Snowy glow -->
    <div class="snow-glow"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  position: { type: String, default: "bottom-left" }, // UI position
});

let total = ref(10);

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
  z-index: 9999;
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
  pointer-events: auto;
  min-width: 180px;
  backdrop-filter: blur(6px);
  background: rgb(139 139 139 / 75%);
  border: 1px solid rgba(160, 190, 255, 0.12);
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(140, 180, 255, 0.15);
  color: #e6f0ff;
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
  margin-top: 6px;
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

/* Progress */
.progress {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  margin-top: 6px;
  overflow: hidden;
}
.bar {
  height: 100%;
  background: linear-gradient(90deg, #9fd1ff, #6ba7ff);
  border-radius: 6px;
  transition: width 0.4s ease;
}

/* Snowy glow */
.snow-glow {
  position: absolute;
  top: -30%;
  left: -30%;
  right: -30%;
  bottom: -30%;
  pointer-events: none;
  background: radial-gradient(
    circle,
    rgba(180, 220, 255, 0.08) 0%,
    transparent 70%
  );
  animation: shimmer 6s ease-in-out infinite alternate;
  border-radius: 50%;
  z-index: -1;
}
@keyframes shimmer {
  from {
    opacity: 0.4;
    transform: scale(1);
  }
  to {
    opacity: 0.9;
    transform: scale(1.15);
  }
}
</style>
