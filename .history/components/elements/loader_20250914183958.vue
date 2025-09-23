<template>
  <div v-if="!data.show" class="Ourloader">
    <div class="handwriting-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 357.1 74.702"
        class="handwriting-svg"
      >
        <g
          stroke-linecap="round"
          fill-rule="evenodd"
          stroke="#fff"
          stroke-width="2"
          fill="transparent"
        >
          <path
            ref="handwritingPath"
            class="handwriting-path"
            d="M 30.8 73.501 L 19 73.501 L 0 5.801 L 9.4 2.801 L 25.2 63.401 L 40.1 10.801 L 52 10.801 L 66.8 63.401 L 82.5 3.101 L 91.3 5.801 L 72.4 73.501 L 60.6 73.501 L 45.8 20.901 L 30.8 73.501 Z M 290.1 73.501 ..."
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  throttle: { type: Number, default: 200 },
  duration: { type: Number, default: 2000 },
});

const data = reactive({
  percent: 0,
  show: false,
  canSucceed: true,
});

let _timer = null;
let _throttle = null;
let _cut;

const handwritingPath = ref(null);

const clear = () => {
  _timer && clearInterval(_timer);
  _throttle && clearTimeout(_throttle);
  _timer = null;
};

const start = () => {
  clear();
  data.percent = 0;
  data.canSucceed = true;

  if (props.throttle) {
    _throttle = setTimeout(startTimer, props.throttle);
  } else {
    startTimer();
  }
};

const set = (num) => {
  data.show = true;
  data.percent = Math.min(100, Math.max(0, Math.floor(num)));
};

const increase = (num) => {
  data.percent = Math.min(100, Math.floor(data.percent + num));
};

const finish = () => {
  data.percent = 100;
  hide();
};

const hide = () => {
  clear();
  setTimeout(() => {
    data.show = false;
    setTimeout(() => {
      data.percent = 0;
    }, 400);
  }, 800);
};

const startTimer = () => {
  data.show = true;
  _cut = 10000 / Math.floor(props.duration);
  _timer = setInterval(() => {
    increase(_cut);
  }, 100);
};

// Nuxt hooks
const nuxtApp = useNuxtApp();
nuxtApp.hook("page:start", start);
nuxtApp.hook("page:finish", finish);

// Animate handwriting when loader starts
onMounted(() => {
  if (handwritingPath.value) {
    const length = handwritingPath.value.getTotalLength();
    handwritingPath.value.style.strokeDasharray = length;
    handwritingPath.value.style.strokeDashoffset = length;
    handwritingPath.value.style.animation = "handwriting 3s linear forwards";
  }
});

onBeforeUnmount(() => clear());
</script>

<style scoped>
.Ourloader {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #0f172a;
  display: flex;
  justify-content: center;
  align-items: center;
}

.handwriting-svg {
  width: 70%;
  max-width: 600px;
}

.handwriting-path {
  stroke: #ffffff;
}

@keyframes handwriting {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
