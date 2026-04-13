<template>
  <div
    ref="target"
    class="egg-counter"
    :class="isVisible ? 'v-show-reveal' : 'v-hide-fade-right'"
  >
    <div class="counter-inner">
      <div class="header">
        <svg class="icon" viewBox="0 0 24 24">
          <path
            d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 15h-2v-2h2zm0-4h-2V7h2z"
          />
        </svg>
        <span class="title">{{
          $i18n.locale === "ar" ? "خفايا الموقع" : "Easter Eggs"
        }}</span>
      </div>
      <div class="count">
        <span class="num">{{ useEasterEggs().value.length }}</span>
        <span class="total">/ {{ total }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { target, isVisible } = useScrollReveal(0.1);
const total = ref(7);
</script>
