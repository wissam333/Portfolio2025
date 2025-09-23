<template>
  <div>
    <div
      v-if="data.show"
      class="Ourloader w-100 d-flex justify-center align-items-center flex-column"
      style="height: 100vh"
    >
      <div id="preloader">
        <div
          id="preloaders"
          class="w-100 d-flex justify-center align-items-center flex-column"
        >
          <NuxtImg
            src="/logo/whitelogo.png"
            format="webp"
            width="300"
            preload
          />
          <Icon
            class="mt-5"
            name="eos-icons:bubble-loading"
            size="150px"
            style="color: #ffffff"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  throttle: {
    type: Number,
    default: 200,
  },
  duration: {
    type: Number,
    default: 2000,
  },
  height: {
    type: Number,
    default: 3,
  },
});
// Options & Data
const data = reactive({
  percent: 0,
  show: false,
  canSucceed: true,
});
// Local variables
let _timer = null;
let _throttle = null;
let _cut;

// Functions
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
  data.canSucceed = true;
  data.percent = Math.min(100, Math.max(0, Math.floor(num)));
};
const increase = (num) => {
  data.percent = Math.min(100, Math.floor(data.percent + num));
};
const decrease = (num) => {
  data.percent = Math.max(0, Math.floor(data.percent - num));
};
const pause = () => clearInterval(_timer);
const resume = () => startTimer();
const finish = () => {
  // isLoaded.value = useImageLouded().value.loaded
  data.percent = 100;
  hide();
};
const hide = () => {
  clear();
  setTimeout(() => {
    data.show = false;
    // isLoaded.value = useImageLouded().value.loaded = false;
    setTimeout(() => {
      data.percent = 0;
    }, 400);
  }, 500);
};
const startTimer = () => {
  data.show = true;
  _cut = 10000 / Math.floor(props.duration);
  _timer = setInterval(() => {
    increase(_cut);
  }, 100);
};

// Hooks
const nuxtApp = useNuxtApp();

nuxtApp.hook("page:start", start);
nuxtApp.hook("page:finish", finish);

// watchEffect(() => {
//   isLoaded.value = useImageLouded().value.loaded
//   console.log('loader check 1', isLoaded.value);
// })
onBeforeUnmount(() => clear);
</script>
<style lang="scss" scoped>
@use "@/assets/scss/theme/variables.scss" as *;

.Ourloader {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  background-color: $main;
}
</style>
