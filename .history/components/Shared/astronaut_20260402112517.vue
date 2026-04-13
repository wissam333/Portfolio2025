<template>
  <div v-if="visible" class="astronaut">
    <img class="normal" :src="`/photos/${astronaut}.png`" alt="astronaut" />

    <div class="speech-bubble">
      {{ $i18n.locale === "ar" ? messagesAr[step] : messages[step] }}
      <div style="display: flex; justify-content: flex-end">
        <button v-if="step < 2" class="next-btn" @click="nextMessage">
          {{ $i18n.locale === "ar" ? "التالي" : "Next" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// ✅ Fixed: was using module-level `let` refs which don't survive SSR and
// don't share state correctly. Component-scoped refs are fine here (not shared state).
const astronaut = ref(2);
const step = ref(0);
const visible = ref(true);

// ✅ Fixed: previous code had a setInterval-style timeout that was never cleared
// on component unmount → memory leak. Now tracked and cleaned up.
let reshowTimer = null;

const emit = defineEmits(["startTour"]);

const messages = [
  "👋 Welcome aboard, traveler!",
  "🌌 There are 7 easter eggs in my website, try to find them all!",
  "🛸 I will help you!",
];

const messagesAr = [
  "👋 مرحباً بك على متن الطائرة، أيها المسافر!",
  "🌌 هناك 7 خفايا في موقعي، حاول العثور عليهم جميعًا!",
  "🛸 سأساعدك!",
];

function nextMessage() {
  if (step.value < 1) {
    astronaut.value = 1;
    step.value++;
  } else {
    visible.value = false;
    reshowTimer = setTimeout(
      () => {
        step.value++;
        astronaut.value = 5;
        visible.value = true;
        emit("startTour");
      },
      3 * 60 * 1000,
    );
  }
}

onUnmounted(() => {
  if (reshowTimer) clearTimeout(reshowTimer);
});
</script>

<style lang="scss" scoped>
.normal {
  position: fixed;
  inset-inline-end: 10px;
  top: 20%;
  z-index: 15;
  width: 70px;

  @media (max-width: 768px) {
    width: 30px;
  }
}

.astronaut {
  position: fixed;
  inset-inline-end: 10px;
  top: 20%;
  z-index: 1003;
  display: flex;
  align-items: center;
  gap: 10px;
}

.speech-bubble {
  background: white;
  padding: 8px 12px;
  border-radius: 16px;
  max-width: 200px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  top: -30px;
  inset-inline-end: 70px;

  @media (max-width: 768px) {
    top: -20px;
    inset-inline-end: 30px;
    font-size: 10px;
  }
}

.next-btn {
  display: block;
  margin-top: 6px;
  padding: 2px 8px;
  font-size: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
}
</style>
