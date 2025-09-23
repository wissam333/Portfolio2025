<template>
  <div
    :class="['egg-counter', positionClass]"
    role="status"
    aria-live="polite"
    title="Easter eggs found"
  >
    <div class="counter-inner" @click.stop>
      <div class="header">
        <svg class="moon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
        <div class="title">Easter Eggs</div>
        <button class="reset" @click="reset" :aria-label="'Reset found eggs'">
          ⟲
        </button>
      </div>

      <div class="count" :aria-hidden="false">
        <div class="num" :class="{ pulse: justFound }">{{ foundCount }}</div>
        <div class="total" v-if="typeof total === 'number'">/ {{ total }}</div>
      </div>

      <div class="progress" v-if="typeof total === 'number'">
        <div
          class="bar"
          :style="{ width: percent + '%' }"
          :aria-valuemin="0"
          :aria-valuemax="total"
          :aria-valuenow="foundCount"
        ></div>
      </div>

      <div class="found-list" v-if="showList && foundCount">
        <small>Found:</small>
        <div class="tags">
          <span v-for="id in foundArray" :key="id" class="tag">{{ id }}</span>
        </div>
      </div>
    </div>

    <!-- subtle decorative falling snow -->
    <div class="snow-layer" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";

/**
 * Props:
 * - total: number (optional) = total possible eggs (for progress)
 * - storageKey: string (optional) = localStorage key to persist set
 * - position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' (optional)
 * - showList: boolean (optional) show list of found ids
 */
const props = defineProps({
  total: { type: Number, required: false },
  storageKey: { type: String, default: "portfolio:easter-eggs" },
  position: { type: String, default: "bottom-left" },
  showList: { type: Boolean, default: true },
});

const found = ref(new Set());
const justFound = ref(false);

const load = () => {
  try {
    const raw = localStorage.getItem(props.storageKey);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) found.value = new Set(arr);
    }
  } catch (e) {
    /* ignore */
  }
};
const save = () => {
  try {
    localStorage.setItem(
      props.storageKey,
      JSON.stringify(Array.from(found.value))
    );
  } catch (e) {
    /* ignore */
  }
};

onMounted(() => {
  load();

  // Listen for CustomEvent detail being the id, or string event.detail.id
  window.addEventListener("easter-egg-found", onEggEvent);

  // Provide a global helper for easy usage
  // window.registerEasterEgg('egg-1') or dispatch event:
  // window.dispatchEvent(new CustomEvent('easter-egg-found',{detail: 'egg-1'}))
  // or: window.dispatchEvent(new CustomEvent('easter-egg-found',{detail:{id:'egg-1'}}))
  // The global is handy while prototyping; you can call it from components
  if (!window.registerEasterEgg) {
    window.registerEasterEgg = registerEgg;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("easter-egg-found", onEggEvent);
  if (window.registerEasterEgg === registerEgg) delete window.registerEasterEgg;
});

function onEggEvent(e) {
  const detail = e && e.detail;
  let id = null;
  if (typeof detail === "string" || typeof detail === "number")
    id = String(detail);
  else if (detail && (detail.id || detail.name))
    id = String(detail.id || detail.name);
  if (id) registerEgg(id);
}

function registerEgg(id) {
  if (!id) return;
  const before = found.value.size;
  found.value.add(String(id));
  if (found.value.size !== before) {
    // new egg discovered
    justFound.value = true;
    setTimeout(() => (justFound.value = false), 900);
    save();
  }
}

function reset() {
  found.value = new Set();
  save();
}

const foundCount = computed(() => found.value.size);
const foundArray = computed(() => Array.from(found.value));
const percent = computed(() => {
  if (typeof props.total !== "number" || props.total <= 0) return 0;
  return Math.min(100, Math.round((foundCount.value / props.total) * 100));
});

watch(found, save, { deep: true });

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

// expose for composition usage if needed
export { registerEgg };
</script>

<style scoped>
/* Layout & position */
.egg-counter {
  position: fixed;
  z-index: 9999;
  pointer-events: auto;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
    Roboto, "Helvetica Neue", Arial;
}
.pos-bottom-left {
  left: 18px;
  bottom: 18px;
}
.pos-bottom-right {
  right: 18px;
  bottom: 18px;
}
.pos-top-left {
  left: 18px;
  top: 18px;
}
.pos-top-right {
  right: 18px;
  top: 18px;
}

/* Card */
.counter-inner {
  min-width: 160px;
  max-width: 280px;
  backdrop-filter: blur(6px);
  background: linear-gradient(
    180deg,
    rgba(10, 14, 26, 0.86),
    rgba(2, 6, 12, 0.75)
  );
  border: 1px solid rgba(160, 190, 255, 0.06);
  box-shadow: 0 6px 30px rgba(2, 8, 23, 0.6),
    0 1px 0 rgba(255, 255, 255, 0.02) inset;
  color: #e6f0ff;
  padding: 10px 12px;
  border-radius: 12px;
  position: relative;
  overflow: visible;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.moon {
  width: 18px;
  height: 18px;
  fill: #cfe6ff;
  opacity: 0.95;
  filter: drop-shadow(0 3px 6px rgba(30, 60, 120, 0.15));
}
.title {
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.2px;
}
.reset {
  margin-left: auto;
  background: transparent;
  border: none;
  color: #9fb8ff;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.9;
}

/* Count */
.count {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 8px;
}
.num {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-shadow: 0 6px 18px rgba(60, 110, 200, 0.14),
    0 1px 0 rgba(255, 255, 255, 0.03);
  transition: transform 0.25s ease, opacity 0.25s;
  padding: 2px 6px;
  border-radius: 8px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.03),
    rgba(255, 255, 255, 0.01)
  );
}
.num.pulse {
  animation: pop 0.7s cubic-bezier(0.2, 0.9, 0.2, 1);
  box-shadow: 0 6px 26px rgba(100, 160, 255, 0.12),
    0 0 18px rgba(120, 180, 255, 0.06);
}
@keyframes pop {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.28);
  }
  60% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
  }
}

.total {
  font-size: 12px;
  color: #bcd7ff;
}

/* progress bar */
.progress {
  height: 8px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02),
    rgba(255, 255, 255, 0.01)
  );
  border-radius: 8px;
  margin-top: 8px;
  overflow: hidden;
}
.bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(
    90deg,
    rgba(170, 210, 255, 0.18),
    rgba(110, 170, 255, 0.28)
  );
  border-radius: 8px;
  transition: width 0.6s ease;
  box-shadow: 0 4px 12px rgba(80, 140, 220, 0.12) inset;
}

/* list of ids */
.found-list {
  margin-top: 8px;
  font-size: 11px;
  color: #9fb8ff;
}
.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 6px;
}
.tag {
  background: rgba(255, 255, 255, 0.02);
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 600;
  color: #dbeeff;
  font-size: 11px;
}

/* Snow decor */
.snow-layer {
  position: absolute;
  left: -18%;
  right: -18%;
  top: -150%;
  bottom: -150%;
  pointer-events: none;
  background-image: radial-gradient(
      circle at 10% 20%,
      rgba(255, 255, 255, 0.06) 0 1px,
      transparent 2px
    ),
    radial-gradient(
      circle at 40% 60%,
      rgba(255, 255, 255, 0.04) 0 1px,
      transparent 2px
    ),
    radial-gradient(
      circle at 80% 30%,
      rgba(255, 255, 255, 0.05) 0 1px,
      transparent 2px
    );
  background-size: 8% 8%, 6% 6%, 7% 7%;
  animation: drift 12s linear infinite;
  opacity: 0.9;
  filter: blur(0.6px) drop-shadow(0 4px 14px rgba(120, 160, 255, 0.04));
}

@keyframes drift {
  0% {
    transform: translateY(-8%) rotate(0deg);
    opacity: 0.95;
  }
  50% {
    transform: translateY(6%) rotate(3deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-8%) rotate(0deg);
    opacity: 0.95;
  }
}

/* small responsive tweak */
@media (max-width: 420px) {
  .counter-inner {
    min-width: 140px;
    max-width: 200px;
    padding: 8px;
  }
  .num {
    font-size: 22px;
  }
}
</style>
