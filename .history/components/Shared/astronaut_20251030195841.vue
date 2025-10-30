<template>
  <div v-if="visible" class="astronaut">
    <!-- Astronaut images -->
    <img
      v-if="astronaut === 1"
      class="normal"
      src="/photos/1.png"
      alt="astronaut"
    />
    <img
      v-if="astronaut === 2"
      class="normal"
      src="/photos/2.png"
      alt="astronaut"
    />
    <img
      v-if="astronaut === 3"
      class="normal"
      src="/photos/3.png"
      alt="astronaut"
    />
    <img
      v-if="astronaut === 4"
      class="normal"
      src="/photos/4.png"
      alt="astronaut"
    />
    <img
      v-if="astronaut === 5"
      class="normal"
      src="/photos/5.png"
      alt="astronaut"
    />

    <!-- Speech bubble -->
    <div class="speech-bubble">
      {{ $i18n.locale === "ar" ? messagesAr[step] : messages[step] }}
      <div class="d-flex justify-content-end">
        <button v-if="step < 2" class="next-btn" @click="nextMessage">
          {{ $i18n.locale === "ar" ? "التالي" : "Next" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
let astronaut = ref(2);
let step = ref(0);
let visible = ref(true);

const emit = defineEmits(["startTour"]);

// Dialog messages
const messages = [
  "👋 Welcome aboard, traveler!",
  "🌌 There are 6 easter eggs in my website, try to find them all!",
  "🛸 I will help you!",
];

const messagesAr = [
  "👋 مرحباً بك على متن الطائرة، أيها المسافر!",
  "🌌 هناك 6 خفايا في موقعي، حاول العثور عليهم جميعًا!",
  "🛸 سأساعدك!",
];

// Handle next button
function nextMessage() {
  if (step.value < 1) {
    astronaut.value = 1;
    step.value++;
  } else {
    // hide astronaut after 2nd message
    visible.value = false;

    // show again after 5 minutes
    setTimeout(() => {
      step.value++;
      astronaut.value = 5;
      visible.value = true;
      emit("startTour");
    }, 3 * 60 * 1000);
  }
}
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
